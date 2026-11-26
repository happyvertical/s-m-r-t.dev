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

- **Staging**: `staging.smrt.happyvertical.com` (also `staging.s-m-r-t.dev`, redirecting)
- **Production**: `smrt.happyvertical.com` (also `s-m-r-t.dev`, redirecting)

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **OpenTofu** >= 1.6.0
3. **Route53 hosted zones** for `happyvertical.com` and, while it redirects, `s-m-r-t.dev`
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

- `staging.smrt.happyvertical.com`, `staging.s-m-r-t.dev`: ALIAS to staging CloudFront distribution
- `smrt.happyvertical.com`, `s-m-r-t.dev`: ALIAS to production CloudFront distribution
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

## Missing pages answer 404, and production's own origin access control (#389)

Both distributions read the bucket through origin access control (OAC), and the
bucket policy keys on the distribution ARN, not on the OAC. Two things changed.

**Missing pages answer 404.** The bucket policy grants the distribution
`s3:ListBucket`, so S3 reports a missing key as 404 (without it, 403), and the
403 mapping is gone, so a 403 now means a broken bucket policy or OAC. The
distribution can only ask whether a key exists; nothing requests a listing and
`s3:ListBucketVersions` is not granted. The 404 mapping keeps
`/404.html` as its page; the build emits it (the prerendered `/404` route, with
absolute `/_app/` asset URLs so it renders at any depth), and the deploy uploads
it with `Cache-Control: no-cache` so a browser never keeps a not-found. The site
deploy that ships `404.html` must run before the missing-page check below.

**Production gets its own OAC.** Until now both workspaces state-track one OAC
(same id), so each plan renames it to its own name and the two flap. The code
already names it per environment (`havesmrt-<environment>-oac`); only
production's state needs to let go of the shared one. It also repoints the
`havesmrt.com` redirect distribution, which uses the same OAC. Staging keeps
the shared OAC and needs no state step.

### Owner steps

Run from `infra/`. Order matters: the state step comes **before any production
apply**, including the 404 change, because any production apply would otherwise
rename the shared OAC again. Staging has no such dependency.

1. Staging: `TF_WORKSPACE=staging tofu plan -var-file=staging.tfvars` shows
   0 add, 3 change, 0 destroy (the distribution loses its 403 mapping, the
   URL-rewrite function updates, the bucket policy gains `s3:ListBucket`).
   Stop on anything else. Apply with
   `TF_WORKSPACE=staging tofu apply -var-file=staging.tfvars`, wait for
   `aws cloudfront get-distribution --id <STAGING_DIST_ID> --query Distribution.Status --output text`
   to say `Deployed`, then
   `curl -sI https://staging.s-m-r-t.dev/definitely-missing | head -1` answers
   `404`, and `curl -sI https://staging.s-m-r-t.dev/docs | head -1` answers `200`.
   Also check that no listing leaks:
   `curl -s --path-as-is https://staging.s-m-r-t.dev/_app/..` and
   `curl -s --path-as-is https://staging.s-m-r-t.dev/_app/x/../..` must print
   no `<ListBucketResult`. Check the 404's caching with
   `curl -sI https://staging.s-m-r-t.dev/definitely-missing | grep -i cache-control`:
   it should say `no-cache` once the site deploy has uploaded `404.html`.
2. Production, preconditions: step 1 verified; nothing else is applying to the
   production workspace; no OAC named `havesmrt-production-oac` exists yet (AWS
   names are unique, so the plan's create would fail otherwise):
   `aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='havesmrt-production-oac'].Id" --output text`
   prints nothing; and record the shared OAC's id (needed for rollback):
   `TF_WORKSPACE=production tofu state show module.havesmrt.aws_cloudfront_origin_access_control.site | grep '^ *id '`
3. Production, the state step. It writes state only, changes nothing in AWS,
   and leaves the OAC itself alone for staging:
   `TF_WORKSPACE=production tofu state rm module.havesmrt.aws_cloudfront_origin_access_control.site`
4. Production plan, `TF_WORKSPACE=production tofu plan -var-file=production.tfvars`,
   must show exactly 1 to add, 4 to change, 0 to destroy:
   - add `aws_cloudfront_origin_access_control.site` named
     `havesmrt-production-oac`;
   - change `aws_cloudfront_distribution.site`: the origin's
     `origin_access_control_id` becomes the new OAC's id, and the 403 mapping is
     removed;
   - change `aws_cloudfront_distribution.redirect`: its origin's
     `origin_access_control_id` becomes the new OAC's id;
   - change `aws_cloudfront_function.url_rewrite` (code only);
   - change `aws_s3_bucket_policy.site`: gains the `s3:ListBucket` statement;
     the existing `s3:GetObject` statement, which names the production
     distribution ARN, is unchanged.

   Stop if the plan renames or replaces anything, destroys anything, or touches
   staging-named resources.

5. Apply: `TF_WORKSPACE=production tofu apply -var-file=production.tfvars`, then
   wait for the production distribution's status to be `Deployed`.
6. Verify: `curl -sI https://s-m-r-t.dev/docs | head -1` answers `200`;
   `curl -sI https://s-m-r-t.dev/definitely-missing | head -1` answers `404`;
   `curl -sI https://s-m-r-t.dev/docs/ | grep -i '^location'` still answers a
   301 to `/docs`; `curl -sI https://havesmrt.com/ | head -1` still answers 301.
   A plan from the committed tfvars is now clean for both workspaces.

### Rollback

- After step 3, before the apply: put the shared OAC back with
  `TF_WORKSPACE=production tofu import -var-file=production.tfvars module.havesmrt.aws_cloudfront_origin_access_control.site <ID>`,
  where `<ID>` is the id recorded in step 2. The id also shows in
  `TF_WORKSPACE=staging tofu state show module.havesmrt.aws_cloudfront_origin_access_control.site`
  and in the origin of either distribution
  (`aws cloudfront get-distribution-config --id <DIST_ID> --query 'DistributionConfig.Origins.Items[0].OriginAccessControlId'`).
- After the apply there is no rollback to the shared OAC, by design. Both
  distributions already use their own OACs and serve, so nothing needs undoing
  for availability. Going back would mean renaming the shared OAC to
  `havesmrt-production-oac` while the new one still holds that name (AWS names
  are unique), and the new one cannot be deleted until nothing references it:
  a multi-step repoint that recreates the staging/production flap. Fix forward
  instead: a failed or interrupted apply is repeated with the same command.
- An interrupted production apply can create `havesmrt-production-oac` in AWS
  without recording it in state. A retry then fails on the duplicate name.
  Recover read-only first: find its id with
  `aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='havesmrt-production-oac'].Id" --output text`,
  then
  `TF_WORKSPACE=production tofu import -var-file=production.tfvars module.havesmrt.aws_cloudfront_origin_access_control.site <ID>`.
  Re-plan: expect step 4's plan minus the create (0 to add, 4 to change, 0 to
  destroy), then apply as in step 5.
- The 404 change alone reverts by reverting commit and applying the same
  workspace: the 403 mapping returns and the extra bucket-policy statement goes.

## URL rewriting

`modules/havesmrt/url-rewrite.js` is the viewer-request CloudFront Function for
both environments. A path without an extension is served as `<path>.html`, and
`<path>/` gets a 301 to `<path>` with its query string, because the site has no
directory index pages (#339). Change the file, then `tofu apply` publishes it.

## Hosts: smrt.happyvertical.com primary, s-m-r-t.dev redirecting (#400, #440)

The site's primary host is `smrt.happyvertical.com` (staging:
`staging.smrt.happyvertical.com`); `s-m-r-t.dev` is the old host, still served by
the same distribution and answering one 301 to the new host. Each variable has a
module variable of the same name.

| Variable               | Default                  | Meaning                                                                                                                                               |
| ---------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`               | `smrt.happyvertical.com` | Primary host: certificate primary name, alias, record, `site_url`, and the `havesmrt.com` redirect target. Staging derives `staging.<host>`.          |
| `hosted_zone_name`     | `null`                   | Route53 zone holding `domain`'s records, when `domain` sits inside a parent zone (`happyvertical.com`). `null` uses `domain`.                         |
| `old_domain`           | `null`                   | The previous host. While set, the distribution also serves it (alias, certificate subject alternative name, record in its own zone). `null` drops it. |
| `old_hosted_zone_name` | `null`                   | Zone holding the old host's records. `null` uses `old_domain`.                                                                                        |
| `redirect_old_domain`  | `false`                  | The main viewer-request function answers `old_domain` with one 301 to the same path and query on `domain`. Needs `old_domain`.                        |

(`old_` rather than `legacy_`: `legacy_domain` already names `havesmrt.com` in
`redirect.tf`.) Bucket, function, OAC and IAM names are per environment, so none
follows `domain`.

With the redirect off, the published function is `url-rewrite.js` byte for byte.
With it on, `main.tf` renames that handler to `rewriteRequest` and appends
`modules/havesmrt/moved-redirect.js`, which handles the old host (exact,
case-insensitive match; port ignored) and passes every other request on. The
redirect collapses leading slashes and backslashes (a `//evil.com/` path cannot
leave the site), strips trailing slashes (pages are `<path>.html`, so keeping one
costs a second hop) and rebuilds the query string as received. `/_app/*` has no
function, so assets still answer on the old host. The `havesmrt.com` redirect
targets `domain`; it keeps its own function, so a trailing-slash URL there is
still two hops (301 to the new host, then the site's 301 to `<path>`).

### Applying the primary-domain change (#440)

Moving from the old layout (`domain = s-m-r-t.dev`, `new_domain = ...`) renames
the variables and swaps which host is primary. `moved` blocks keep both A records
(`aws_route53_record.new[0]` becomes `.primary`, `.site` becomes `.old[0]`)
without destroy or create. Run from `infra/`, staging first, with `-var-file`:
`TF_WORKSPACE=staging tofu apply -var-file=staging.tfvars`, then production. The
certificate's primary name changes, so it is replaced (create before destroy, the
distribution is repointed in place, then the old one goes). Plan first; it must
show exactly 4 to add, 1 to change, 4 to destroy, and stop on anything else:

- `aws_acm_certificate.site` replaced (create before destroy);
- `aws_acm_certificate_validation.site` replaced (follows the certificate);
- both `aws_route53_record.cert_validation[...]` (keys unchanged: the old and new
  host) replaced; validation CNAMEs, not serving records;
- `aws_cloudfront_distribution.site` updated in place (certificate ARN only; the
  aliases are the same set);
- both A records reported as moved, no change;
- `site_url` now the new host; no function, bucket, OAC, policy or `havesmrt.com`
  change.

Check both hosts afterwards: the new host answers 200 and the old one one 301.

### Dropping the old domain

When `s-m-r-t.dev` is to lapse, remove `old_domain`, `old_hosted_zone_name` and
`redirect_old_domain` from both tfvars and apply staging, then production. The
plan must show the certificate replaced (the old name leaves its subject
alternative names; create before destroy), its validation and the old host's
validation record replaced or destroyed, the distribution updated in place (alias
and certificate ARN), `aws_route53_record.old[0]` destroyed, and the site
function updated to plain `url-rewrite.js`. Nothing serving
`smrt.happyvertical.com` is replaced. The old host stops answering, so do this only
once its traffic no longer matters. Release the domain and zone afterwards.

### Rollback

Revert the tfvars and code and apply the same workspace with `-var-file`. The
`moved` blocks are one-way in state, so a revert is a fresh rename the same way
(plan shows the certificate replaced again and the records moved back).

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
