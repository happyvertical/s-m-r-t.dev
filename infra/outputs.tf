output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.havesmrt.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.havesmrt.cloudfront_domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for static files"
  value       = module.havesmrt.s3_bucket_name
}

output "site_url" {
  description = "Full site URL"
  value       = module.havesmrt.site_url
}
