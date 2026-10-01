#!/bin/sh
# Uploads the site to S3 and refreshes CloudFront.
# Usage: SITE_BUCKET=<bucket> SITE_DISTRIBUTION_ID=<id> deploy/deploy.sh
set -eu
: "${SITE_BUCKET:?Set SITE_BUCKET to the S3 bucket name}"
: "${SITE_DISTRIBUTION_ID:?Set SITE_DISTRIBUTION_ID to the CloudFront distribution ID}"

cd "$(dirname "$0")/.."

aws s3 sync . "s3://$SITE_BUCKET" --delete \
  --exclude "*" --include "index.html" --include "trip-map.js" --include "trip-map.css" \
  --cache-control "public, max-age=300"

aws cloudfront create-invalidation --distribution-id "$SITE_DISTRIBUTION_ID" --paths "/*"
