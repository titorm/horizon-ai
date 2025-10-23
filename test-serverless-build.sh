#!/bin/bash

# Script to test the serverless build locally
# This simulates the Vercel environment

set -e

echo "🔨 Building API for serverless deployment..."
cd apps/api
pnpm build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📦 Checking built files..."
ls -lh dist/serverless.js

echo ""
echo "🔍 Verifying serverless handler..."
node -e "const handler = require('./dist/serverless'); console.log('Handler type:', typeof handler.default); console.log('✅ Handler loaded successfully!');"

echo ""
echo "🚀 Ready to deploy to Vercel!"
echo ""
echo "Next steps:"
echo "  1. Run 'vercel' to deploy to preview"
echo "  2. Run 'vercel --prod' to deploy to production"
echo "  3. Or push to GitHub to trigger automatic deployment"
