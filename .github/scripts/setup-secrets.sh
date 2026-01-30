#!/usr/bin/env bash

# Setup script for GitHub Actions secrets
# Run this script to configure required secrets for CI/CD

set -e

echo "🔐 Setting up GitHub Actions secrets for havesmrt.com"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "   Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo "   Run: gh auth login"
    exit 1
fi

echo "📝 Setting up secrets..."
echo ""

# GitHub PAT for accessing private smrt repository
echo "1️⃣  GitHub Personal Access Token (GH_PAT)"
echo "   This token needs 'repo' scope to access happyvertical/smrt"
echo ""
read -p "   Do you want to set GH_PAT now? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    gh secret set GH_PAT
    echo "   ✅ GH_PAT configured"
else
    echo "   ⏭️  Skipped - you can set it later with: gh secret set GH_PAT"
fi
echo ""

# AWS Role ARNs (optional)
echo "2️⃣  AWS IAM Role ARNs (Optional - for automated deployments)"
echo "   These are only needed if you want GitHub Actions to deploy automatically"
echo ""
read -p "   Do you want to set AWS roles now? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Enter AWS Role ARN for staging (or press Enter to skip):"
    read -r staging_role
    if [ -n "$staging_role" ]; then
        echo "$staging_role" | gh secret set AWS_ROLE_ARN_STAGING
        echo "   ✅ AWS_ROLE_ARN_STAGING configured"
    fi

    echo "   Enter AWS Role ARN for production (or press Enter to skip):"
    read -r prod_role
    if [ -n "$prod_role" ]; then
        echo "$prod_role" | gh secret set AWS_ROLE_ARN_PRODUCTION
        echo "   ✅ AWS_ROLE_ARN_PRODUCTION configured"
    fi
else
    echo "   ⏭️  Skipped - manual deployments with 'tofu apply' will continue to work"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "📋 Current secrets:"
gh secret list
