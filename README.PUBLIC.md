# 🚀 VATANA - AI-Powered VAT Compliance Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

> Simplify VAT compliance with AI. Automated filing, real-time validation, and comprehensive reporting for modern businesses.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Database](#-database)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered VAT Validation** - Real-time VAT number verification across all EU countries
- 📊 **Automated Filing** - Automatic VAT return generation and submission
- 📈 **Real-Time Analytics** - Live dashboards with compliance tracking
- 🌍 **Multi-Country Support** - Support for all EU member states
- 🔐 **Secure & Compliant** - Bank-level security with GDPR compliance
- ⚡ **Easy Integration** - Seamless integration with accounting software

### Additional Features
- User authentication (email/password + OAuth)
- Team collaboration and management
- File upload and processing
- VAT validation history
- Comprehensive reporting
- Webhook system
- Push notifications
- Dark mode UI

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Framer Motion
- **State Management**: React Hooks, Zustand

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### DevOps & Tools
- **Build Tool**: Vite (Turbopack)
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel
- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/1willoffire1-ops/vatana-ai-tax-flow.git
   cd vatana-ai-tax-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials (see [Environment Setup](#-environment-setup))

4. **Run database migrations**
   ```bash
   npx supabase link --project-ref your-project-id
   npx supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase Configuration (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Configuration (Private)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Claude AI
CLAUDE_API_KEY=your_claude_api_key_here

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@vatana.com
FROM_NAME=VATANA

# Optional: Figma Integration
FIGMA_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_file_key_here
```

### Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings → API
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

---

## 🗄 Database

### Public Supabase Project

This project uses Supabase for database and authentication.

**Public Project Information:**
- Project URL: `https://trojfnjtcwjitlziurkl.supabase.co`
- Project ID: `trojfnjtcwjitlziurkl`
- Region: EU Central (Frankfurt)

### Database Schema

Main tables:
- `users` - User profiles and authentication
- `vat_validations` - VAT validation history
- `team_members` - Team collaboration
- `team_invitations` - Team invites
- `activity_log` - Activity tracking
- `webhooks` - Webhook configuration
- `webhook_deliveries` - Webhook delivery tracking
- `push_subscriptions` - PWA push notifications

### Running Migrations

```bash
# Link to your Supabase project
npx supabase link --project-ref trojfnjtcwjitlziurkl

# View migration status
npx supabase migration list

# Apply migrations
npx supabase db push

# Create new migration
npx supabase migration new migration_name
```

---

## 📦 Project Structure

```
vatana/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── api/        # API routes
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard/  # Main dashboard
│   │   └── ...
│   ├── components/     # React components
│   │   ├── landing/    # Landing page components
│   │   └── ui/         # Reusable UI components
│   ├── data/          # Static data and content
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript type definitions
├── supabase/
│   ├── migrations/    # Database migrations
│   └── config.toml    # Supabase configuration
├── docs/              # Documentation
└── tests/            # Test files
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run unit tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all

# Generate coverage report
npm run test:coverage
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Fly.io
- Self-hosted (Node.js)

---

## 📚 Documentation

Additional documentation available in the repository:

- `SETUP_COMPLETE_SUMMARY.md` - Complete setup guide
- `OAUTH_SETUP_GUIDE.md` - OAuth configuration
- `LANDING_PAGE_INTEGRATION_GUIDE.md` - Landing page setup
- `INTEGRATION_PROGRESS.md` - Feature implementation status
- `DEPLOYMENT_SUMMARY.md` - Deployment information

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## 🔗 Links

- **GitHub**: https://github.com/1willoffire1-ops/vatana-ai-tax-flow
- **Supabase**: https://app.supabase.com/project/trojfnjtcwjitlziurkl
- **Issues**: https://github.com/1willoffire1-ops/vatana-ai-tax-flow/issues

---

## 👥 Team

Built with ❤️ by the VATANA team

---

## 📧 Support

For support, email support@vatana.com or open an issue in the GitHub repository.

---

**Made with Next.js, Supabase, and TypeScript** 🚀