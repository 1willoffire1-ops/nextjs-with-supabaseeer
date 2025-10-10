# 🔐 OAuth Configuration Guide for VATANA

## Overview
This guide will help you configure OAuth providers (Google and Microsoft) for your VATANA application.

## 🚀 Quick Setup Steps

### 1. **Google OAuth Configuration**

#### Step 1: Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen first if prompted
6. Select "Web application" as application type
7. Add authorized redirect URIs:
   - **Development**: `http://localhost:3000/auth/callback`
   - **Production**: `https://your-domain.com/auth/callback`

#### Step 2: Configure in Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com/project/trojfnjtcwjitlziurkl)
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and click to configure
4. Enable Google provider
5. Add your Google OAuth credentials:
   - **Client ID**: From Google Console
   - **Client Secret**: From Google Console
6. Set Redirect URL: `https://trojfnjtcwjitlziurkl.supabase.co/auth/v1/callback`

### 2. **Microsoft OAuth Configuration**

#### Step 1: Create Microsoft Azure App
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Configure:
   - **Name**: VATANA
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: Web - `https://trojfnjtcwjitlziurkl.supabase.co/auth/v1/callback`

#### Step 2: Configure in Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com/project/trojfnjtcwjitlziurkl)
2. Navigate to "Authentication" > "Providers"
3. Find "Azure (Microsoft)" and click to configure
4. Enable Azure provider
5. Add your Azure OAuth credentials:
   - **Client ID**: From Azure App Registration
   - **Client Secret**: Create new client secret in Azure
6. Set Redirect URL: `https://trojfnjtcwjitlziurkl.supabase.co/auth/v1/callback`

## 🔧 Environment Variables

Add these to your `.env.local` file (already configured):

```env
# Supabase Configuration (✅ Already Set)
NEXT_PUBLIC_SUPABASE_URL=https://trojfnjtcwjitlziurkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb2pmbmp0Y3dqaXRseml1cmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTMwMDEsImV4cCI6MjA3MzM4OTAwMX0.ShdcNpTX_59g0M5dqzwf_mnkoK5AP-nvwTaX60KNlhg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb2pmbmp0Y3dqaXRseml1cmtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgxMzAwMSwiZXhwIjoyMDczMzg5MDAxfQ.nerHxYS2ade_d7M0ImO8NTVngCUj4sJ1W3QcO_jD5Q0
```

## ✅ Testing OAuth Integration

### Test Google OAuth:
1. Visit: http://localhost:3000/auth/login
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Should redirect to dashboard with user logged in

### Test Microsoft OAuth:
1. Visit: http://localhost:3000/auth/login
2. Click "Sign in with Microsoft" 
3. Complete Microsoft OAuth flow
4. Should redirect to dashboard with user logged in

## 🎯 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| ✅ **GitHub Integration** | Working | Both repositories synced |
| ✅ **Supabase Database** | Working | All tables created |
| ✅ **Authentication System** | Working | Email/password ready |
| ⏳ **Google OAuth** | Pending | Needs configuration |
| ⏳ **Microsoft OAuth** | Pending | Needs configuration |
| ✅ **Application Running** | Working | http://localhost:3000 |

## 🚨 Next Steps

1. **Configure OAuth providers** (Google + Microsoft) in Supabase Dashboard
2. **Test authentication flows** with both email/password and social login
3. **Test VAT validation functionality** 
4. **Deploy to production** when ready

## 📞 Need Help?

If you encounter any issues:
1. Check the Supabase Dashboard logs
2. Verify redirect URLs match exactly
3. Ensure OAuth apps are properly configured
4. Test with incognito/private browsing first

---

**Your application is now 95% ready! Just need OAuth configuration to be 100% complete.**