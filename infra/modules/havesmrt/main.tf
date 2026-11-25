locals {
  site_domain = var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"
  bucket_name = "havesmrt-${var.environment}"

  # The Route53 zone is the domain itself unless the host lives inside a parent
  # zone (smrt.happyvertical.com in happyvertical.com).
  zone_name = coalesce(var.hosted_zone_name, var.domain)

  # The host the site is moving to. var.domain keeps serving too, as an alias
  # and certificate name on this distribution, and its Route53 record keeps its
  # address; the new host only adds resources.
  has_new          = var.new_domain != null
  new_site_domain  = !local.has_new ? null : var.environment == "production" ? var.new_domain : "${var.environment}.${var.new_domain}"
  new_zone_name    = local.has_new ? coalesce(var.new_hosted_zone_name, var.new_domain) : null
  redirect_to_new  = local.has_new && var.redirect_to_new_domain
  canonical_domain = local.redirect_to_new ? local.new_site_domain : local.site_domain
  site_aliases     = local.has_new ? [local.site_domain, local.new_site_domain] : [local.site_domain]

  # With the redirect off the published function is url-rewrite.js, byte for
  # byte. With it on, the old host answers a 301 first (moved-redirect.js) and
  # every other request falls through to the same rewrite.
  url_rewrite_code = local.redirect_to_new ? join("\n", [
    replace(file("${path.module}/url-rewrite.js"), "function handler(", "function rewriteRequest("),
    replace(replace(file("${path.module}/moved-redirect.js"), "__OLD_HOST__", lower(local.site_domain)), "__NEW_HOST__", lower(local.new_site_domain))
  ]) : file("${path.module}/url-rewrite.js")
}

# GitHub OIDC provider (data source - already exists in account)
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# IAM role for GitHub Actions deployment
resource "aws_iam_role" "github_actions" {
  name = "havesmrt-${var.environment}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repository}:*"
          }
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = "havesmrt"
  }
}

# IAM policy for S3 and CloudFront access
resource "aws_iam_role_policy" "github_actions" {
  name = "havesmrt-${var.environment}-deploy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.site.arn,
          "${aws_s3_bucket.site.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListDistributions"
        ]
        Resource = "*"
      }
    ]
  })
}

# S3 bucket for static website hosting
resource "aws_s3_bucket" "site" {
  bucket = local.bucket_name

  tags = {
    Name        = "havesmrt-${var.environment}"
    Environment = var.environment
    Project     = "havesmrt"
  }
}

resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront function to handle URL rewriting: <path> -> <path>.html, and a 301
# from <path>/ to <path> (the site has no directory index pages; #339).
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "havesmrt-${var.environment}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = local.url_rewrite_code
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "havesmrt-${var.environment}-oac"
  description                       = "OAC for havesmrt ${var.environment}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "havesmrt ${var.environment} distribution"
  default_root_object = "index.html"
  price_class         = var.environment == "production" ? "PriceClass_All" : "PriceClass_100"
  aliases             = local.site_aliases

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "S3-${local.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${local.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # Cache static assets aggressively
  ordered_cache_behavior {
    path_pattern     = "/_app/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${local.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 31536000
    default_ttl            = 31536000
    max_ttl                = 31536000
    compress               = true
  }

  # A missing key answers 404 from S3 (the bucket policy below grants
  # s3:ListBucket to this distribution, without which S3 answers 403 for a
  # missing key). There is deliberately no 403 mapping: a real 403 means the
  # bucket policy or OAC is broken and should show as one.
  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.site.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  depends_on = [aws_acm_certificate_validation.site]

  tags = {
    Environment = var.environment
    Project     = "havesmrt"
  }
}

# S3 bucket policy for CloudFront OAC. ListBucket is what makes S3 report a
# missing key as 404 instead of 403. It lets only this distribution ask whether
# a key exists; CloudFront never issues a listing request, every object is
# already public through it, and ListBucketVersions is not granted.
resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.site.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.site.arn
          }
        }
      },
      {
        Sid    = "AllowCloudFrontListBucketFor404"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:ListBucket"
        Resource = aws_s3_bucket.site.arn
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.site.arn
          }
        }
      }
    ]
  })
}

# ACM Certificate (must be in us-east-1 for CloudFront)
resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = local.site_domain
  validation_method = "DNS"

  subject_alternative_names = local.has_new ? [local.new_site_domain] : []

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "havesmrt-${var.environment}"
    Environment = var.environment
    Project     = "havesmrt"
  }
}

# Certificate validation
resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
  timeouts {
    create = "30m"
  }
}

# Route53 DNS record for the site (assuming zone exists)
data "aws_route53_zone" "site" {
  name         = local.zone_name
  private_zone = false
}

# Zone of the new host, when the site is moving.
data "aws_route53_zone" "new" {
  count = local.has_new ? 1 : 0

  name         = local.new_zone_name
  private_zone = false
}

resource "aws_route53_record" "site" {
  zone_id = data.aws_route53_zone.site.zone_id
  name    = local.site_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "new" {
  count = local.has_new ? 1 : 0

  zone_id = data.aws_route53_zone.new[0].zone_id
  name    = local.new_site_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

# Route53 records for certificate validation. The new host's records go in its
# own zone.
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site.domain_validation_options : dvo.domain_name => {
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
  zone_id         = each.key == local.new_site_domain ? data.aws_route53_zone.new[0].zone_id : data.aws_route53_zone.site.zone_id
}
