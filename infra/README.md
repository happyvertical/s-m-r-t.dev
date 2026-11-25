# s-m-r-t.dev Infrastructure

This directory contains OpenTofu/Terraform configuration for deploying s-m-r-t.dev as a static site to AWS S3 + CloudFront.

## Architecture

- **Static Site**: SvelteKit with adapter-static pre-renders all pages at build time
- **Storage**: AWS S3 bucket for static files
- **CDN**: AWS CloudFront distribution with custom domain and SSL
- **DNS**: Route53 for domain management
- **Certificate**: ACM certificate (us-east-1) for CloudFront
- **State**: S3 backend in `happyvertical-terraform-state` bucket

## Environments

- **Staging**: `staging.s-m-r-t.dev`
- **Production**: `s-m-r-t.dev`

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **OpenTofu** >= 1.6.0
3. **Route53 hosted zone** for `s-m-r-t.dev`
4. **Route53 hosted zone** for `havesmrt.com` while the legacy-domain redirect is enabled
5. **S3 bucket** for state: `happyvertical-terraform-state` (already exists)

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

- `staging.s-m-r-t.dev`: ALIAS to staging CloudFront distribution
- `s-m-r-t.dev`: ALIAS to production CloudFront distribution
- `staging.havesmrt.com`: ALIAS to the staging legacy redirect distribution
- `havesmrt.com`: ALIAS to the production legacy redirect distribution

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

## URL rewriting

`modules/havesmrt/url-rewrite.js` is the viewer-request CloudFront Function for
both environments. A path without an extension is served as `<path>.html`, and
`<path>/` gets a 301 to `<path>` with its query string, because the site has no
directory index pages (#339). Change the file, then `tofu apply` publishes it.

## Moving the site to another host (#400)

Four variables, all off by default, so merging this changes nothing: staging
plans no changes, and production plans only the #389 OAC rename. Each has a
module variable of the same name.

| Variable                 | Default | Meaning                                                                                                                                                          |
| ------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hosted_zone_name`       | `null`  | Route53 zone holding `domain`'s records, when `domain` sits inside a parent zone. `null` uses `domain`.                                                          |
| `new_domain`             | `null`  | The host the site moves to. While set, the same distribution also serves it (alias, certificate name, record in its own zone); `domain` keeps serving unchanged. |
| `new_hosted_zone_name`   | `null`  | Zone holding the new host's records (`happyvertical.com` for `smrt.happyvertical.com`). `null` uses `new_domain`.                                                |
| `redirect_to_new_domain` | `false` | The main viewer-request function answers `domain` with one 301 to the same path and query on `new_domain`. Needs `new_domain`.                                   |

`domain` stays the old host in the tfvars throughout. Its Route53 record, alias
and certificate name are never touched, so there is no `state mv`, no `-var`,
and nothing to delete mid-cutover; the new host only adds resources. Staging
derives `staging.<host>` from each value.

With the redirect off, the published function is `url-rewrite.js` byte for byte.
With it on, `main.tf` renames that handler to `rewriteRequest` and appends
`modules/havesmrt/moved-redirect.js`, which handles the old host (exact,
case-insensitive match; port ignored) and passes every other request on. The
redirect collapses leading slashes and backslashes (a `//evil.com/` path cannot
leave the site), strips trailing slashes (pages are `<path>.html`, so keeping one
costs a second hop) and rebuilds the query string as received. `/_app/*` has no
function, so assets still answer on the old host. The `havesmrt.com` redirect
targets the new host once `redirect_to_new_domain` is on; it keeps its own
function, so a trailing-slash URL there is still two hops (301 to the new host,
then the site's 301 to `<path>`). Matching it is a separate change.

### Cutover order

Every step ships its values in the tfvars through its own pull request and is
applied with `-var-file` only, so a later plan from committed tfvars never
reverts a step. Run from `infra/`. Production always follows a clean staging
rehearsal of the same step. Owner steps are applies, state changes and Matomo;
the pull requests are code.

0. Owner: resolve #389 on production (the shared OAC) and confirm
   `TF_WORKSPACE=production tofu plan -var-file=production.tfvars` is clean.
   Nothing below is safe to apply before this.
1. PR (this change): infra code only, a no-op.
2. PR, then owner applies staging. Add to `staging.tfvars`:
   `new_domain = "smrt.happyvertical.com"` and
   `new_hosted_zone_name = "happyvertical.com"`. Apply:
   `TF_WORKSPACE=staging tofu apply -var-file=staging.tfvars`. It adds the
   certificate name, alias and record for `staging.smrt.happyvertical.com`; the
   certificate is replaced create-before-destroy. Plan first and stop if it shows anything else: one certificate replaced
   (create before destroy), the old host's validation CNAME recreated, one
   alias added, one record created, and nothing else destroyed. Check that host answers and
   `staging.s-m-r-t.dev` still does.
3. PR, then owner applies production. The same two lines in `production.tfvars`:
   `TF_WORKSPACE=production tofu apply -var-file=production.tfvars`. The plan
   must show the same as step 2 (plus the #389 fix already applied); stop if it
   shows anything else. Check
   `https://smrt.happyvertical.com` and `https://s-m-r-t.dev`.
4. Owner: set Matomo site 31's URL to the new host at or before the next step's
   merge, or analytics stop at deploy. PR: the code cutover (`SITE_ORIGIN`, the
   workflow's post-deploy checks, `robots.txt` and the tests together). Merge it
   only after step 3, because it deploys and the new checks need the new host.
5. PR, then owner applies staging: `redirect_to_new_domain = true` in
   `staging.tfvars`; `TF_WORKSPACE=staging tofu apply -var-file=staging.tfvars`.
   The plan must show function updates only (the site and `havesmrt.com`
   functions); stop if it shows anything else. Check `curl -sI https://staging.s-m-r-t.dev/docs/` answers one 301 to
   `https://staging.smrt.happyvertical.com/docs`, with the query kept.
6. PR, then owner applies production: `redirect_to_new_domain = true` in
   `production.tfvars`;
   `TF_WORKSPACE=production tofu apply -var-file=production.tfvars`. Same plan
   rule as step 5. Check
   `https://s-m-r-t.dev/docs/` the same way.
7. Track references in other repositories (smrt, have-config, iac, happyvertical.com).

### Rollback

Each step reverts by reverting its tfvars change and applying the same
workspace with `-var-file`. Steps 5 and 6 only republish the function, so the
old host serves again once clients drop the 301, which they may cache for up to an hour (`max-age=3600`). Steps 2 and 3 remove the new host's
alias, record and certificate name; the old host's resources are not in the
change, so it never stops serving. Roll back step 4 (the code) before 2 or 3.
The certificate's primary name stays the old host, and ACM renewal validates
every name on it, so the old domain and its Route53 zone cannot be dropped
while this layout stands: if they lapse, renewal fails and TLS breaks on the
new host too. Before the old domain is ever released, a later step must make the
new host the primary `domain` (old host secondary or removed) and apply it.
Until then the `site_url` output also stays the old host.

## Agent document delivery

The build emits `/llms.txt`, `/llms-full.txt`, and a `.md` sibling of each
canonical HTML page (homepage: `/index.md`). The CloudFront rewrite preserves
paths with extensions. Both deployment jobs explicitly upload `.txt` as
`text/plain; charset=utf-8` and `.md` as `text/markdown; charset=utf-8`; this avoids
platform-dependent S3 MIME guessing. They retain the one-hour cache policy.

Deployments wait for invalidation to complete, then run
`node scripts/check-agent-metadata.mjs --origin <site-url>`. This checks both text
indexes, every Markdown URL from the sitemap, and representative HTML JSON-LD
and no-JavaScript content. A missing page answers 404 (the bucket policy grants
the distribution `s3:ListBucket`, and there is no 403 mapping); the check fails on
any status but 200. The same checker runs on local build
output before artifacts are uploaded.
