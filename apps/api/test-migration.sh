#!/bin/bash

# Test Migration Script
# This script tests the transactions migration

set -e

echo "🧪 Testing Transactions Migration"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from apps/api directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking migration status${NC}"
pnpm migrate:status
echo ""

echo -e "${YELLOW}Step 2: Running migration${NC}"
pnpm migrate:up
echo ""

echo -e "${YELLOW}Step 3: Verifying migration was applied${NC}"
pnpm migrate:status
echo ""

echo -e "${GREEN}✅ Migration test completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Check Appwrite Console to verify the table was created"
echo "2. Start the API: pnpm dev"
echo "3. Test the endpoints with curl or Postman"
echo ""
echo "To rollback (DANGER - will delete data):"
echo "  pnpm migrate:down"
