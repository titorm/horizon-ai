#!/bin/bash

# Script to create the transactions collection in Appwrite
# This script should be run after setting up your Appwrite instance

set -e

# Load environment variables
source "$(dirname "$0")/../../../.env.local" 2>/dev/null || true

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Creating Transactions Collection${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if required environment variables are set
if [ -z "$APPWRITE_PROJECT_ID" ] || [ -z "$APPWRITE_API_KEY" ] || [ -z "$APPWRITE_ENDPOINT" ]; then
    echo -e "${RED}Error: Required environment variables are not set${NC}"
    echo "Please ensure APPWRITE_PROJECT_ID, APPWRITE_API_KEY, and APPWRITE_ENDPOINT are configured"
    exit 1
fi

DATABASE_ID="${APPWRITE_DATABASE_ID:-horizon_ai_db}"
COLLECTION_ID="transactions"

echo -e "${YELLOW}Database ID: $DATABASE_ID${NC}"
echo -e "${YELLOW}Collection ID: $COLLECTION_ID${NC}"

# Create collection
echo -e "\n${GREEN}Step 1: Creating collection...${NC}"
appwrite databases createCollection \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --name="Transactions" \
    --permissions='["read(\"any\")","write(\"any\")"]' \
    --documentSecurity=true \
    2>/dev/null || echo -e "${YELLOW}Collection may already exist, continuing...${NC}"

# Create attributes
echo -e "\n${GREEN}Step 2: Creating attributes...${NC}"

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="user_id" \
    --size=255 \
    --required=true

appwrite databases createFloatAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="amount" \
    --required=true

appwrite databases createEnumAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="type" \
    --elements='["income","expense","transfer"]' \
    --required=true

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="category" \
    --size=100 \
    --required=true

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="description" \
    --size=1000 \
    --required=false

appwrite databases createDatetimeAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="date" \
    --required=true

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="account_id" \
    --size=255 \
    --required=false

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="merchant" \
    --size=255 \
    --required=false

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="currency" \
    --size=10 \
    --required=true

appwrite databases createEnumAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="status" \
    --elements='["pending","completed","failed","cancelled"]' \
    --required=true

appwrite databases createEnumAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="source" \
    --elements='["manual","integration","import"]' \
    --required=true

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="integration_id" \
    --size=255 \
    --required=false

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="integration_data" \
    --size=10000 \
    --required=false

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="tags" \
    --size=1000 \
    --required=false

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="location" \
    --size=1000 \
    --required=false

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="receipt_url" \
    --size=1000 \
    --required=false

appwrite databases createBooleanAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="is_recurring" \
    --required=true

appwrite databases createStringAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="recurring_pattern" \
    --size=1000 \
    --required=false

appwrite databases createDatetimeAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="created_at" \
    --required=true

appwrite databases createDatetimeAttribute \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="updated_at" \
    --required=true

echo -e "\n${YELLOW}Waiting for attributes to be available (30 seconds)...${NC}"
sleep 30

# Create indexes
echo -e "\n${GREEN}Step 3: Creating indexes...${NC}"

appwrite databases createIndex \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="idx_user_id" \
    --type="key" \
    --attributes='["user_id"]' \
    2>/dev/null || echo -e "${YELLOW}Index may already exist${NC}"

appwrite databases createIndex \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="idx_date" \
    --type="key" \
    --attributes='["date"]' \
    --orders='["DESC"]' \
    2>/dev/null || echo -e "${YELLOW}Index may already exist${NC}"

appwrite databases createIndex \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="idx_type" \
    --type="key" \
    --attributes='["type"]' \
    2>/dev/null || echo -e "${YELLOW}Index may already exist${NC}"

appwrite databases createIndex \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="idx_category" \
    --type="key" \
    --attributes='["category"]' \
    2>/dev/null || echo -e "${YELLOW}Index may already exist${NC}"

appwrite databases createIndex \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="idx_status" \
    --type="key" \
    --attributes='["status"]' \
    2>/dev/null || echo -e "${YELLOW}Index may already exist${NC}"

appwrite databases createIndex \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="idx_source" \
    --type="key" \
    --attributes='["source"]' \
    2>/dev/null || echo -e "${YELLOW}Index may already exist${NC}"

appwrite databases createIndex \
    --databaseId="$DATABASE_ID" \
    --collectionId="$COLLECTION_ID" \
    --key="idx_integration_id" \
    --type="key" \
    --attributes='["integration_id"]' \
    2>/dev/null || echo -e "${YELLOW}Index may already exist${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Transactions collection created successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Collection Details:${NC}"
echo -e "  - Database: ${DATABASE_ID}"
echo -e "  - Collection: ${COLLECTION_ID}"
echo -e "  - Attributes: 20"
echo -e "  - Indexes: 7"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "  1. Verify the collection in Appwrite Console"
echo -e "  2. Test the API endpoints"
echo -e "  3. Configure integration settings if needed"
