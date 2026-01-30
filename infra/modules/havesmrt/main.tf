locals {
  site_domain = var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"
  bucket_name = "havesmrt-${var.environment}"
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

# CloudFront function to handle URL rewriting (add .html extension)
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "havesmrt-${var.environment}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // If URI ends with '/' add index.html
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      }
      // If URI doesn't have an extension, add .html
      else if (!uri.includes('.')) {
        request.uri += '.html';
      }

      return request;
    }
  EOF
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
  aliases             = [local.site_domain]

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

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 403
    response_page_path = "/404.html"
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

# S3 bucket policy for CloudFront OAC
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
      }
    ]
  })
}

# ACM Certificate (must be in us-east-1 for CloudFront)
resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = local.site_domain
  validation_method = "DNS"

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
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.site.arn
  timeouts {
    create = "30m"
  }
}

# Route53 DNS record for the site (assuming zone exists)
data "aws_route53_zone" "site" {
  name         = var.domain
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

# Route53 record for certificate validation
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
  zone_id         = data.aws_route53_zone.site.zone_id
}
