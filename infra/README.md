# havesmrt.com Infrastructure

This directory contains OpenTofu/Terraform configuration for deploying havesmrt.com as a static site to AWS S3 + CloudFront.

## Architecture

- **Static Site**: SvelteKit with adapter-static pre-renders all pages at build time
- **Storage**: AWS S3 bucket for static files
- **CDN**: AWS CloudFront distribution with custom domain and SSL
- **DNS**: Route53 for domain management
- **Certificate**: ACM certificate (us-east-1) for CloudFront
- **State**: S3 backend in `happyvertical-terraform-state` bucket

## Environments

- **Staging**: `staging.havesmrt.com`
- **Production**: `havesmrt.com`

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **OpenTofu** >= 1.6.0
3. **Route53 hosted zone** for `havesmrt.com`
4. **S3 bucket** for state: `happyvertical-terraform-state` (already exists)

## Initial Setup

### 1. Initialize Terraform

```bash
cd infra
tofu init
```

### 2. Create Workspaces

```bash
# Staging
tofu workspace new staging
tofu workspace select staging

# Production
tofu workspace new production
tofu workspace select production
```

### 3. Deploy Staging

```bash
tofu workspace select staging
tofu plan -var-file=staging.tfvars
tofu apply -var-file=staging.tfvars
```

**Note**: The first apply will create the ACM certificate and wait for DNS validation. You'll need to ensure the validation DNS records are created (they're created automatically by the configuration).

### 4. Deploy Production

```bash
tofu workspace select production
tofu plan -var-file=production.tfvars
tofu apply -var-file=production.tfvars
```

## Deploying Site Content

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to staging
aws s3 sync build/ s3://havesmrt-staging/ --delete
aws cloudfront create-invalidation --distribution-id <STAGING_DIST_ID> --paths "/*"

# Deploy to production
aws s3 sync build/ s3://havesmrt-production/ --delete
aws cloudfront create-invalidation --distribution-id <PRODUCTION_DIST_ID> --paths "/*"
```

### Automated Deployment (GitHub Actions)

- **Staging**: Auto-deploys on every push to `main` branch
- **Production**: Manual deployment via workflow dispatch

Required GitHub Secrets:

- `REPO_ACCESS_TOKEN`: GitHub PAT with access to happyvertical/smrt repo
- `AWS_ROLE_ARN_STAGING`: AWS IAM role ARN for staging deployment
- `AWS_ROLE_ARN_PRODUCTION`: AWS IAM role ARN for production deployment

## Infrastructure Resources

### S3 Buckets

- `havesmrt-staging`: Staging static files
- `havesmrt-production`: Production static files

### CloudFront Distributions

- Staging: Caches content from staging S3 bucket
- Production: Caches content from production S3 bucket

### ACM Certificates

- Certificates created in us-east-1 (required for CloudFront)
- Automatic DNS validation via Route53

### Route53 Records

- `staging.havesmrt.com`: ALIAS to staging CloudFront distribution
- `havesmrt.com`: ALIAS to production CloudFront distribution

## Outputs

After applying, the following outputs are available:

```bash
tofu output cloudfront_distribution_id  # CloudFront distribution ID
tofu output cloudfront_domain_name      # CloudFront domain name
tofu output s3_bucket_name              # S3 bucket name
tofu output site_url                    # Full site URL
```

## Cache Strategy

- **HTML pages**: TTL 1 hour (3600s)
- **Static assets** (`/_app/*`): TTL 1 year, immutable
- **CloudFront**: Aggressive edge caching for performance

## Troubleshooting

### Certificate validation stuck

- Verify Route53 validation records are created
- Wait up to 30 minutes for DNS propagation
- Check ACM console in us-east-1 region

### S3 bucket access denied

- Verify CloudFront Origin Access Control is configured
- Check S3 bucket policy allows CloudFront service principal

### Site not updating after deployment

- Invalidate CloudFront cache: `aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"`
- Cache invalidations can take 5-15 minutes

## Cost Estimate

### Staging (low traffic)

- S3: $0.50/month
- CloudFront: $1-2/month
- Route53: $0.50/month
- **Total**: ~$2-3/month

### Production (moderate traffic)

- S3: $1/month
- CloudFront: $5-10/month
- Route53: $0.50/month
- **Total**: ~$6-12/month

## Cleanup

To destroy infrastructure:

```bash
# Staging
tofu workspace select staging
tofu destroy -var-file=staging.tfvars

# Production
tofu workspace select production
tofu destroy -var-file=production.tfvars
```

**Warning**: This will delete the S3 buckets and all content!
