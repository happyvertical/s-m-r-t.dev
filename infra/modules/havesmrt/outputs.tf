output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for static files"
  value       = aws_s3_bucket.site.id
}

output "site_url" {
  description = "Full site URL"
  value       = "https://${local.site_domain}"
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions deployment"
  value       = aws_iam_role.github_actions.arn
}
