#!/bin/bash
# Script to replace all localhost:7000 URLs with production URL
# Usage: ./update-api-urls.sh https://tourbnb-backend.onrender.com

if [ -z "$1" ]; then
  echo "Usage: ./update-api-urls.sh <BACKEND_URL>"
  echo "Example: ./update-api-urls.sh https://tourbnb-backend.onrender.com"
  exit 1
fi

BACKEND_URL=$1
OLD_URL="http://localhost:7000"

echo "Updating all API URLs..."
echo "From: $OLD_URL"
echo "To: $BACKEND_URL"

# Update all TypeScript/TSX files in frontend/src
find frontend/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s|$OLD_URL|$BACKEND_URL|g" {} \;

echo "✅ All URLs updated!"
echo "Files changed:"
grep -r "$BACKEND_URL" frontend/src --include="*.ts" --include="*.tsx" | cut -d: -f1 | sort -u

echo ""
echo "Remember to:"
echo "1. Commit these changes: git add . && git commit -m 'Update API URLs for production'"
echo "2. Push to GitHub: git push"
echo "3. Vercel will auto-deploy with the new URLs"
