# ---------------------------------------------------------------------------
# Legacy-domain 301 redirect: havesmrt.com  ->  s-m-r-t.dev  (the new var.domain)
#
# A dedicated CloudFront distribution fronts the legacy domain; a viewer-request
# CloudFront Function returns a 301 to the canonical site (local.site_domain),
# preserving the path. Mirrors the primary stack's cert / validation / Route53
# patterns in main.tf.
#
# APPLY PREREQUISITES (owner action — see infra/README.md):
#   - A Route53 public hosted zone must exist for `local.legacy_domain`
#     (havesmrt.com) so the cert can be DNS-validated and the alias created.
#   - The new canonical domain (var.domain = s-m-r-t.dev) must have its own
#     Route53 zone with registrar NS delegation before `terraform apply`.
# This file provisions real AWS resources — review `terraform plan` first.
# ---------------------------------------------------------------------------

locals {
  legacy_domain      = "havesmrt.com"
  legacy_site_domain = var.environment == "production" ? local.legacy_domain : "${var.environment}.${local.legacy_domain}"
}

# 301 -> canonical site. Path is preserved; querystring is dropped (extend if needed).
resource "aws_cloudfront_function" "redirect" {
  name    = "havesmrt-${var.environment}-legacy-redirect"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOF
    function handler(event) {
      var request = event.request;
      return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: { 'location': { value: 'https://${local.site_domain}' + request.uri } }
      };
    }
  EOF
}

data "aws_route53_zone" "legacy" {
  name         = local.legacy_domain
  private_zone = false
}

# Cert for the legacy domain (CloudFront certs must live in us-east-1).
resource "aws_acm_certificate" "legacy" {
  provider          = aws.us_east_1
  domain_name       = local.legacy_site_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "havesmrt-${var.environment}-legacy"
    Environment = var.environment
    Project     = "havesmrt"
  }
}

resource "aws_route53_record" "legacy_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.legacy.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.legacy.zone_id
}

resource "aws_acm_certificate_validation" "legacy" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.legacy.arn
  timeouts {
    create = "30m"
  }

  depends_on = [aws_route53_record.legacy_cert_validation]
}

# Redirect-only distribution for the legacy domain.
resource "aws_cloudfront_distribution" "redirect" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "havesmrt ${var.environment} legacy-domain 301 redirect"
  price_class     = "PriceClass_100"
  aliases         = [local.legacy_site_domain]

  # Origin is never reached (the viewer-request function returns 301 first), but
  # CloudFront requires one defined — reuse the site bucket + OAC from main.tf.
  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "S3-redirect-${local.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-redirect-${local.bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.legacy.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  depends_on = [aws_acm_certificate_validation.legacy]

  tags = {
    Environment = var.environment
    Project     = "havesmrt"
  }
}

resource "aws_route53_record" "legacy" {
  zone_id = data.aws_route53_zone.legacy.zone_id
  name    = local.legacy_site_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
    evaluate_target_health = false
  }
}
