# 🗄️ Supabase Setup Guide for VATANA

This guide will help you set up your Supabase database for the VATANA project.

## 📋 Prerequisites

- [x] Supabase account created
- [x] Project created: `trojfnjtcwjitlziurkl`
- [x] API credentials obtained
- [ ] Supabase CLI installed and logged in

## 🔑 Your Project Details

**Project Reference**: `trojfnjtcwjitlziurkl`  
**Project URL**: `https://trojfnjtcwjitlziurkl.supabase.co`  
**Dashboard**: https://supabase.com/dashboard/project/trojfnjtcwjitlziurkl

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the PowerShell setup script:

```powershell
.\scripts\setup-supabase.ps1
```

This will:
- ✅ Link your local project to Supabase
- ✅ Copy all migration files
- ✅ Push migrations to your database
- ✅ Verify the setup

### Option 2: Manual Setup

#### Step 1: Login to Supabase CLI

```bash
supabase login
```

#### Step 2: Link Your Project

```bash
supabase link --project-ref trojfnjtcwjitlziurkl
```

#### Step 3: Copy Core Schema Migration

```bash
# Copy the core schema to main migrations folder
cp src/lib/supabase/migrations/20250929190000_vatana_core_schema_fixed.sql supabase/migrations/
```

#### Step 4: Push All Migrations

```bash
supabase db push
```

## 📊 Database Schema Overview

### Core Tables

#### 1. **users** - User Management
- Extends Supabase auth.users
- Stores user profiles and settings
- Links to organizations

#### 2. **organizations** - Multi-tenancy
- Organization/company information
- VAT registration numbers
- Subscription plans

#### 3. **invoices** - Invoice Data
- Uploaded invoice records
- VAT calculations
- Status tracking

#### 4. **vat_errors** - Error Detection
- Detected VAT compliance errors
- Severity levels (high, medium, low)
- AI-suggested fixes

#### 5. **auto_fixes** - Fix Tracking
- Applied fixes history
- Before/after values
- Success tracking

#### 6. **savings** - Cost Savings
- Penalty savings calculations
- Compliance improvements
- ROI tracking

#### 7. **team_members** - Team Collaboration
- Team member roles
- Permissions
- Activity tracking

#### 8. **webhooks** - Integration System
- Webhook subscriptions
- Event tracking
- Retry logic

#### 9. **push_subscriptions** - PWA Notifications
- Web push subscriptions
- User notification preferences

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies for:
- ✅ User isolation (users can only see their own data)
- ✅ Organization-based access
- ✅ Team member permissions
- ✅ Admin overrides

## 🧪 Verify Setup

### Check Tables

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- auto_fixes
- invoices
- organizations
- push_subscriptions
- savings
- team_members
- users
- vat_errors
- webhooks

### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Test Connection

Run this test script:

```bash
pnpm run test:db
```

Or manually test:

```typescript
// Test in your app or via Supabase dashboard
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Test query
const { data, error } = await supabase
  .from('organizations')
  .select('*')
  .limit(1)

console.log('Connection test:', data ? 'SUCCESS ✅' : 'FAILED ❌')
if (error) console.error('Error:', error)
```

## 🔧 Troubleshooting

### Issue: "Failed to link project"

**Solution**: Make sure you're logged in
```bash
supabase login
```

### Issue: "Migration already exists"

**Solution**: This is normal. Skip or use `--force` flag
```bash
supabase db push --force
```

### Issue: "Permission denied"

**Solution**: Check your service role key in `.env.local`
```env
SUPABASE_SERVICE_ROLE_KEY=your_actual_key_here
```

### Issue: "RLS policy blocking query"

**Solution**: Ensure you're authenticated
```typescript
// Make sure user is signed in
const { data: { user } } = await supabase.auth.getUser()
```

## 📚 Migration Files

All migrations are in `supabase/migrations/`:

1. `20250929190000_vatana_core_schema_fixed.sql` - Core schema
2. `20240115000005_create_push_subscriptions.sql` - PWA support
3. `20251004154718_phase4_autofix_savings.sql` - Auto-fix & savings
4. `20251005165746_team_collaboration.sql` - Team features
5. `20251005170021_webhooks_system.sql` - Webhook integration

## 🎯 Next Steps

After setup is complete:

1. **Test the Application**
   ```bash
   pnpm run dev
   ```

2. **Create Your First User**
   - Navigate to http://localhost:3000/login
   - Sign up with email/password

3. **Upload Test Data**
   - Use the sample CSV: `public/samples/sample-invoices.csv`
   - Test the upload flow

4. **Verify Database**
   - Check Supabase dashboard
   - Confirm data is being created

## 🆘 Need Help?

- **Supabase Documentation**: https://supabase.com/docs
- **VATANA Issues**: https://github.com/1willoffire1-ops/nextjs-with-supabaseeer/issues
- **Database Schema**: Check `supabase/migrations/` folder

## ✅ Setup Checklist

- [ ] Supabase CLI installed
- [ ] Logged into Supabase CLI
- [ ] Project linked
- [ ] All migrations applied
- [ ] Tables created successfully
- [ ] RLS policies active
- [ ] Test connection successful
- [ ] `.env.local` configured correctly
- [ ] Application running locally
- [ ] First user created
- [ ] Test upload completed

---

**Last Updated**: October 5, 2025  
**Version**: 1.0.0  
**Project**: VATANA - VAT Analysis & Automation
