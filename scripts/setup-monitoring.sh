#!/bin/bash

# ========================================
# VATANA Monitoring Setup Script
# ========================================
# This script installs and configures monitoring tools

set -e

echo "🚀 Setting up VATANA monitoring tools..."
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}✗ pnpm not found. Please install pnpm first.${NC}"
    echo "Run: npm install -g pnpm"
    exit 1
fi

echo -e "${GREEN}✓ pnpm found${NC}"

# Install Sentry
echo ""
echo "📦 Installing Sentry..."
pnpm add @sentry/nextjs
echo -e "${GREEN}✓ Sentry installed${NC}"

# Install Vercel Analytics
echo ""
echo "📊 Installing Vercel Analytics..."
pnpm add @vercel/analytics
echo -e "${GREEN}✓ Vercel Analytics installed${NC}"

# Install Speed Insights
echo ""
echo "⚡ Installing Vercel Speed Insights..."
pnpm add @vercel/speed-insights
echo -e "${GREEN}✓ Speed Insights installed${NC}"

# Optional: PostHog
read -p "Do you want to install PostHog analytics? (y/N): " install_posthog
if [[ $install_posthog =~ ^[Yy]$ ]]; then
    echo "📈 Installing PostHog..."
    pnpm add posthog-js
    echo -e "${GREEN}✓ PostHog installed${NC}"
fi

# Run Sentry wizard
echo ""
echo "🔧 Configuring Sentry..."
read -p "Do you want to run Sentry setup wizard now? (y/N): " run_sentry_wizard
if [[ $run_sentry_wizard =~ ^[Yy]$ ]]; then
    npx @sentry/wizard@latest -i nextjs
else
    echo -e "${YELLOW}⚠ Skipped Sentry wizard. Run manually: npx @sentry/wizard@latest -i nextjs${NC}"
fi

# Create instrumentation file if it doesn't exist
echo ""
echo "📝 Creating instrumentation.ts..."
if [ ! -f "instrumentation.ts" ]; then
    cat > instrumentation.ts << 'EOF'
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
EOF
    echo -e "${GREEN}✓ instrumentation.ts created${NC}"
else
    echo -e "${YELLOW}⚠ instrumentation.ts already exists${NC}"
fi

# Update package.json scripts
echo ""
echo "📝 Updating package.json scripts..."
# This would use jq or node to update package.json
echo -e "${YELLOW}⚠ Manually add these scripts to package.json:${NC}"
echo "  \"build:analyze\": \"ANALYZE=true pnpm build\""
echo "  \"lighthouse\": \"lighthouse http://localhost:3000 --view\""

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Monitoring tools setup complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure Sentry DSN in .env.production"
echo "2. Enable analytics in Vercel dashboard"
echo "3. Test with: pnpm dev"
echo ""
echo "Environment variables needed:"
echo "  NEXT_PUBLIC_SENTRY_DSN"
echo "  SENTRY_ORG"
echo "  SENTRY_PROJECT"
echo "  SENTRY_AUTH_TOKEN"
echo ""
echo -e "${GREEN}Happy monitoring! 📊${NC}"
