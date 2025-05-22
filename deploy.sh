#!/bin/bash
# Production deployment script for KaseCobra

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting KaseCobra production deployment...${NC}"

# Step 1: Make sure we have the latest code
echo -e "${GREEN}Step 1: Pulling latest code from repository...${NC}"
git pull

# Step 2: Install dependencies
echo -e "${GREEN}Step 2: Installing dependencies...${NC}"
pnpm install

# Step 3: Build the application
echo -e "${GREEN}Step 3: Building application...${NC}"
pnpm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed! Check the errors above and fix them before deploying.${NC}"
  exit 1
fi

# Step 4: Run tests if available
if [ -f "package.json" ] && grep -q "test" "package.json"; then
  echo -e "${GREEN}Step 4: Running tests...${NC}"
  pnpm test
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Tests failed! Please fix the issues before deploying.${NC}"
    exit 1
  fi
fi

# Step 5: Deploy to production
echo -e "${GREEN}Step 5: Deploying to production...${NC}"
# Add your deployment command here, examples:
# vercel --prod
# npm run deploy
# aws s3 sync .next s3://your-bucket-name

echo -e "${GREEN}Deployment successful!${NC}"
echo -e "${YELLOW}Post-deployment checklist:${NC}"
echo "1. Verify authentication flow in production"
echo "2. Test image upload and processing"
echo "3. Check all pages load correctly"
echo "4. Verify no console errors in browser"
echo "5. Visit /diagnostics page to verify system status"

echo -e "${GREEN}Done!${NC}"
