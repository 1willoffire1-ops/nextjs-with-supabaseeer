# VATANA - Quick Start Deployment

**TL;DR:** Get VATANA from development to production in 30 minutes.

---

## ⚡ Quick Setup (30 mins)

### 1. Prerequisites (5 mins)
```bash
# Install dependencies
pnpm install

# Install Vercel CLI globally
pnpm add -g vercel

# Login to Vercel
vercel login
```

### 2. Setup Supabase (10 mins)
1. Visit [supabase.com](https://supabase.com)
2. Create new project → "VATANA Production"
3. Copy credentials from Settings > API:
   - Project URL
   - Anon key
   - Service role key

### 3. Configure Environment (5 mins)
```bash
# Copy template
cp .env.production.example .env.production

# Edit with your values (minimum required):
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLAUDE_API_KEY=your_claude_key
```

### 4. Deploy to Vercel (10 mins)
```bash
# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# Settings > Environment Variables > Add all from .env.production
```

**Done! Your app is live at: `https://your-project.vercel.app`**

---

## 📋 Post-Deployment Checklist

### Must-Do (Required)
- [ ] Add custom domain (if applicable)
- [ ] Configure DNS records
- [ ] Test health endpoint: `curl https://your-app.com/api/health`
- [ ] Run security tests: `pnpm test src/__tests__/security --run`
- [ ] Setup Sentry error tracking
- [ ] Enable Vercel Analytics

### Should-Do (Recommended)
- [ ] Setup uptime monitoring (UptimeRobot, etc.)
- [ ] Configure alert notifications
- [ ] Add team members to Vercel project
- [ ] Document deployment process
- [ ] Setup staging environment

### Nice-to-Have (Optional)
- [ ] Configure custom email domain
- [ ] Setup CDN for static assets
- [ ] Add performance monitoring
- [ ] Configure backup strategy

---

## 🚀 One-Command Deploy

```bash
# Full deployment script
./scripts/deploy-production.sh
```

Or manually:

```bash
# 1. Build locally to test
pnpm build

# 2. Run security tests
pnpm test src/__tests__/security --run

# 3. Deploy to production
vercel --prod

# 4. Verify deployment
curl https://your-app.vercel.app/api/health
```

---

## 🔧 Essential Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm test                   # Run all tests

# Deployment
vercel                      # Deploy to preview
vercel --prod               # Deploy to production
vercel logs                 # View deployment logs
vercel env pull             # Pull environment variables

# Database
supabase login              # Login to Supabase
supabase link               # Link to project
supabase db push            # Run migrations
supabase db reset           # Reset database (dev only!)

# Monitoring
pnpm test:e2e               # Run E2E tests
pnpm test:security          # Run security tests
vercel logs --follow        # Stream logs
```

---

## 🔐 Security Checklist

Before going live:

```bash
# 1. Run security tests
pnpm test src/__tests__/security --run
# Expected: 52/52 passing ✅

# 2. Check for vulnerabilities
pnpm audit

# 3. Verify environment variables
vercel env ls

# 4. Test HTTPS
curl -I https://your-app.com
# Should return 200 with HTTPS

# 5. Verify security headers
curl -I https://your-app.com
# Check for: X-Frame-Options, X-Content-Type-Options, etc.
```

---

## 📊 Monitoring Setup (5 mins)

### Sentry (Error Tracking)
```bash
# Install
pnpm add @sentry/nextjs

# Configure
npx @sentry/wizard@latest -i nextjs

# Add environment variables
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Vercel Analytics (Built-in)
1. Go to Vercel Dashboard
2. Navigate to your project
3. Click **Analytics** tab
4. Enable **Web Analytics** & **Speed Insights**

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs
vercel logs

# Test build locally
pnpm build

# Common fix: Clear cache
rm -rf .next
pnpm build
```

### Environment Variables Not Working
```bash
# Pull latest env vars
vercel env pull .env.local

# Verify they're set
vercel env ls

# Redeploy
vercel --prod
```

### Database Connection Error
```bash
# Test Supabase connection
curl https://your-project.supabase.co/rest/v1/

# Verify credentials in Vercel
# Settings > Environment Variables

# Check Supabase project status
# https://app.supabase.com/project/your-project-id/settings/api
```

### Health Check Failing
```bash
# Test locally
curl http://localhost:3000/api/health

# Test production
curl https://your-app.com/api/health

# Check logs
vercel logs --follow
```

---

## 📈 Performance Optimization

### Quick Wins
1. ✅ Image optimization (already configured)
2. ✅ Compression enabled
3. ✅ CDN automatically enabled (Vercel)
4. ✅ PWA caching configured

### Measure Performance
```bash
# Run Lighthouse
npx lighthouse https://your-app.com --view

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 95+
```

---

## 🔄 Continuous Deployment

### Automatic Deployments
Once connected to Git, Vercel auto-deploys:

- **Production:** Push to `main` branch
- **Preview:** Push to any other branch
- **Rollback:** Promote previous deployment

```bash
# Normal workflow
git checkout main
git pull
git checkout -b feature/new-feature
# Make changes
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Vercel creates preview URL
# After review, merge to main
git checkout main
git merge feature/new-feature
git push origin main
# Vercel deploys to production
```

---

## 📞 Support

### Resources
- **Documentation:** See `DEPLOYMENT_GUIDE.md` for full details
- **Security:** See `SECURITY_CHECKLIST.md`
- **API Health:** `https://your-app.com/api/health`

### Emergency Rollback
```bash
# Option 1: Via Vercel Dashboard
# Deployments > Previous Version > Promote to Production

# Option 2: Via Git
git revert HEAD
git push origin main
```

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Health endpoint responds: `/api/health`
2. ✅ Login works with test credentials
3. ✅ File upload functions correctly
4. ✅ Error detection runs successfully
5. ✅ Reports generate properly
6. ✅ HTTPS is enforced (no warnings)
7. ✅ Security tests pass (52/52)
8. ✅ Performance score > 90 (Lighthouse)
9. ✅ Error tracking active (Sentry)
10. ✅ Analytics collecting data

---

## 🎉 You're Live!

**Production URL:** `https://your-app.vercel.app`

### Next Steps
1. Monitor Sentry for errors
2. Check analytics dashboard
3. Gather user feedback
4. Plan feature iterations
5. Schedule regular backups

### Maintenance
- Monitor uptime weekly
- Check error rates daily
- Review performance monthly
- Update dependencies monthly
- Review security quarterly

---

## 📚 Additional Documentation

- **Full Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Security Checklist:** `SECURITY_CHECKLIST.md`
- **Security Report:** `SECURITY_TEST_REPORT.md`
- **Environment Template:** `.env.production.example`

---

**Last Updated:** 2024-10-05  
**Version:** 1.0.0  
**Deployment Time:** ~30 minutes  
**Difficulty:** ⭐⭐ (Medium)
