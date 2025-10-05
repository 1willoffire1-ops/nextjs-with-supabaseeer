# 🚀 Supabase Quick Start - VATANA

## ⚡ 3-Minute Setup

### Step 1: Login to Supabase CLI

```bash
supabase login
```

This will open your browser for authentication.

### Step 2: Link Your Project

```bash
supabase link --project-ref trojfnjtcwjitlziurkl
```

When prompted, enter your database password (from Supabase dashboard).

### Step 3: Copy Core Schema Migration

```powershell
# Copy the main schema to migrations folder
Copy-Item "src\lib\supabase\migrations\20250929190000_vatana_core_schema_fixed.sql" "supabase\migrations\"
```

### Step 4: Apply All Migrations

```bash
supabase db push
```

That's it! Your database is ready.

## ✅ Verify Setup

Check that tables were created:

```bash
supabase db dump --schema public
```

## 🎯 Test the App

```bash
pnpm run dev
```

Navigate to: http://localhost:3000

---

## 📊 Your Supabase Project Info

**Project**: trojfnjtcwjitlziurkl  
**URL**: https://trojfnjtcwjitlziurkl.supabase.co  
**Dashboard**: https://supabase.com/dashboard/project/trojfnjtcwjitlziurkl

## 🗄️ Expected Database Tables

After migration, you should have:

1. ✅ **users** - User profiles
2. ✅ **organizations** - Companies/tenants
3. ✅ **invoices** - Invoice data
4. ✅ **vat_errors** - Detected errors
5. ✅ **auto_fixes** - Applied fixes
6. ✅ **savings** - Cost savings tracking
7. ✅ **team_members** - Team collaboration
8. ✅ **webhooks** - Integration webhooks
9. ✅ **push_subscriptions** - PWA notifications

## 🔐 Environment Variables

Your `.env.local` is already configured with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://trojfnjtcwjitlziurkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

## 🆘 Troubleshooting

**Issue**: "Failed to link project"
- Make sure you ran `supabase login` first

**Issue**: "Migration failed"
- Check database password is correct
- Try: `supabase db push --force`

**Issue**: "Can't find migration file"
- Ensure you're in the project root directory
- Check that migrations exist in `supabase/migrations/`

## 📚 Full Documentation

For detailed setup info, see: `docs/SUPABASE_SETUP.md`
