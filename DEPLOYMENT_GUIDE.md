# VATANA Deployment Guide

Complete guide for deploying VATANA to production on Vercel with Supabase backend.

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ pnpm package manager
- ✅ Git repository
- ✅ Vercel account
- ✅ Supabase account
- ✅ Claude API key (Anthropic)
- ✅ Email service (SendGrid, AWS SES, or Resend)

---

## Step 1: Setup Production Supabase Project

### 1.1 Create New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name:** VATANA Production
   - **Database Password:** (Generate strong password)
   - **Region:** Choose closest to your users (e.g., EU West for Ireland)
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### 1.2 Get Connection Strings

Navigate to **Settings > API** and copy:

- **Project URL:** `https://xxxxx.supabase.co`
- **Anon (public) key:** `eyJhbGciOiJI...`
- **Service role key:** `eyJhbGciOiJI...` (keep secret!)

### 1.3 Run Database Migrations

```bash
# Set Supabase URL
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Install Supabase CLI
pnpm add -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push

# Or if using custom migrations
cd supabase/migrations
supabase db push --db-url "postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres"
```

### 1.4 Setup Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Similar for other tables...
```

---

## Step 2: Setup Environment Variables

### 2.1 Create Production Environment File

```bash
# Copy template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

### 2.2 Required Environment Variables

Fill in these critical values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Claude AI
CLAUDE_API_KEY=sk-ant-your-claude-api-key-here

# Email (SendGrid recommended)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key_here
FROM_EMAIL=noreply@vatana.ie

# App URLs
NEXT_PUBLIC_APP_URL=https://vatana.ie
```

### 2.3 Generate Security Keys

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate encryption key
openssl rand -base64 32

# Add to .env.production
JWT_SECRET=generated_jwt_secret_here
ENCRYPTION_KEY=generated_encryption_key_here
```

---

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI

```bash
pnpm add -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Initial Deployment

```bash
# From project root
cd D:\buildvatana\vatana

# Deploy to production
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name? vatana
# - Which directory? ./
# - Override settings? No
```

### 3.4 Configure Environment Variables in Vercel

**Option 1: Via CLI**

```bash
# Set each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... repeat for all variables
```

**Option 2: Via Dashboard (Recommended)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings > Environment Variables**
4. Add all variables from `.env.production`
5. Set environment: **Production**, **Preview**, **Development**

### 3.5 Redeploy After Adding Variables

```bash
vercel --prod
```

---

## Step 4: Setup Custom Domain

### 4.1 Add Domain in Vercel

1. Go to **Settings > Domains**
2. Add domain: `vatana.ie` and `www.vatana.ie`
3. Follow DNS configuration instructions

### 4.2 Configure DNS Records

Add these records to your DNS provider:

```
Type    Name    Value
A       @       76.76.21.21 (Vercel IP)
CNAME   www     cname.vercel-dns.com
```

### 4.3 Update Environment Variables

```bash
# Update app URL
NEXT_PUBLIC_APP_URL=https://vatana.ie
```

---

## Step 5: Setup Sentry (Error Tracking)

### 5.1 Create Sentry Project

1. Go to [sentry.io](https://sentry.io)
2. Create account / login
3. Create new project
4. Select **Next.js**
5. Note your DSN

### 5.2 Install Sentry

```bash
pnpm add @sentry/nextjs
```

### 5.3 Initialize Sentry

```bash
npx @sentry/wizard@latest -i nextjs
```

Follow wizard prompts:
- Login to Sentry
- Select project
- Confirm configuration

### 5.4 Add Sentry Environment Variables

```bash
# In Vercel dashboard
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-name
SENTRY_PROJECT=vatana
SENTRY_AUTH_TOKEN=your_auth_token
```

---

## Step 6: Setup Analytics & Monitoring

### 6.1 Vercel Analytics

```bash
# Install Vercel Analytics
pnpm add @vercel/analytics
```

Already configured in the project!

### 6.2 Enable in Vercel Dashboard

1. Go to **Analytics** tab
2. Enable Web Analytics
3. Enable Speed Insights

### 6.3 Uptime Monitoring

**Using Vercel:**
1. Go to **Settings > Monitoring**
2. Enable uptime checks
3. Add health check endpoint: `/api/health`

**Using External Service (Recommended):**
- UptimeRobot: https://uptimerobot.com
- Better Uptime: https://betteruptime.com
- Pingdom: https://pingdom.com

Configure to check: `https://vatana.ie/api/health`

---

## Step 7: Performance Optimization

### 7.1 Enable Caching

Already configured in `next.config.ts`:
- Image optimization
- Static asset caching
- API response caching (via PWA)

### 7.2 Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_errors_upload_id ON errors(upload_id);
CREATE INDEX idx_errors_severity ON errors(severity);
CREATE INDEX idx_fixes_error_id ON fixes(error_id);

-- Add composite indexes
CREATE INDEX idx_uploads_user_created ON uploads(user_id, created_at DESC);
```

### 7.3 CDN Configuration

Vercel automatically provides CDN - no additional configuration needed!

---

## Step 8: Security Checklist

### 8.1 Pre-Deployment Security

- ✅ All secrets in environment variables
- ✅ No `.env` files committed to Git
- ✅ RLS enabled on all Supabase tables
- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ Rate limiting enabled
- ✅ Input sanitization implemented

### 8.2 Run Security Tests

```bash
# Run security test suite
pnpm test src/__tests__/security --run

# Expected: 52/52 tests passing
```

### 8.3 Enable Security Features

In Vercel Dashboard:
1. **Settings > Security**
2. Enable **DDoS Protection**
3. Enable **Vercel Firewall** (if available)
4. Set up **Attack Challenge Mode**

---

## Step 9: Final Checks

### 9.1 Health Check

```bash
curl https://vatana.ie/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-10-05T18:30:00.000Z",
  "database": "connected"
}
```

### 9.2 Test Core Features

- ✅ User registration/login
- ✅ File upload
- ✅ Error detection
- ✅ Auto-fix functionality
- ✅ Report generation
- ✅ Email notifications

### 9.3 Performance Check

Use these tools:
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **WebPageTest:** https://www.webpagetest.org/
- **Lighthouse:** Built into Chrome DevTools

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## Step 10: Post-Deployment

### 10.1 Setup Monitoring Alerts

**Sentry Alerts:**
1. Go to **Alerts** in Sentry
2. Create alert for error rate > 5%
3. Add notification channels (email, Slack)

**Vercel Alerts:**
1. **Settings > Notifications**
2. Enable deployment notifications
3. Enable performance degradation alerts

### 10.2 Backup Strategy

**Database Backups:**
- Supabase provides automatic daily backups
- Consider enabling point-in-time recovery
- Test restore procedure

**Code Backups:**
- Git repository is your backup
- Ensure protected branches
- Tag production releases

### 10.3 Create Runbook

Document:
- Emergency contacts
- Rollback procedure
- Common issues & solutions
- Scaling instructions

---

## Continuous Deployment

### Setup Automatic Deployments

Vercel automatically deploys from Git:

**Production (main branch):**
```bash
git checkout main
git pull origin main
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main
# Vercel automatically deploys
```

**Preview (feature branches):**
```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Vercel creates preview deployment
```

---

## Rollback Procedure

### If Something Goes Wrong

**Option 1: Instant Rollback (Vercel)**
1. Go to **Deployments**
2. Find previous working deployment
3. Click **...** > **Promote to Production**

**Option 2: Git Revert**
```bash
# Revert to previous commit
git revert HEAD
git push origin main
# Vercel deploys previous version
```

**Option 3: Redeploy Specific Commit**
```bash
git checkout <commit-hash>
vercel --prod
```

---

## Troubleshooting

### Common Issues

**1. Environment Variables Not Working**
```bash
# Verify variables are set
vercel env ls

# Pull latest variables
vercel env pull .env.local
```

**2. Database Connection Errors**
- Check Supabase project is running
- Verify service role key is correct
- Check IP restrictions in Supabase settings

**3. Build Failures**
```bash
# Check build logs
vercel logs

# Test build locally
pnpm build
```

**4. Performance Issues**
- Check database indexes
- Review API response times in Sentry
- Check CDN cache hit rate

---

## Support & Resources

### Documentation
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs
- **Sentry:** https://docs.sentry.io/

### Community
- **Discord:** VATANA Community (if applicable)
- **GitHub Issues:** Report bugs
- **Email:** support@vatana.ie

---

## Deployment Checklist

Before going live, verify:

- [ ] Database migrations run successfully
- [ ] All environment variables configured
- [ ] Custom domain configured
- [ ] SSL certificate active (HTTPS)
- [ ] Sentry error tracking enabled
- [ ] Analytics enabled
- [ ] Health check endpoint responding
- [ ] Security tests passing (52/52)
- [ ] Core features tested in production
- [ ] Monitoring alerts configured
- [ ] Backup strategy documented
- [ ] Rollback procedure tested
- [ ] Team notified of deployment
- [ ] Documentation updated

---

## Success! 🎉

Your VATANA application is now live in production!

**Next Steps:**
1. Monitor error rates in Sentry
2. Check performance metrics
3. Gather user feedback
4. Plan next iteration

---

**Deployment Date:** _________  
**Deployed By:** _________  
**Version:** 1.0.0  
**Environment:** Production
