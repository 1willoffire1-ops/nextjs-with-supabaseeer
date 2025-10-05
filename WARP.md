# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- **Start development server**: `pnpm dev` - Runs Next.js dev server with Turbopack
- **Build for production**: `pnpm build` - Creates optimized production build with Turbopack
- **Start production server**: `pnpm start` - Runs the production build
- **Lint code**: `pnpm lint` - Runs ESLint to check code quality

### Supabase Local Development
- **Start Supabase locally**: `supabase start` - Starts local Supabase services (requires Docker)
- **Stop Supabase**: `supabase stop` - Stops all local Supabase services
- **Reset database**: `supabase db reset` - Resets the local database and runs migrations/seeds
- **Generate types**: `supabase gen types typescript --local > src/types/supabase.ts`
- **View local services**: Access Supabase Studio at http://127.0.0.1:54323

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **Runtime**: React 19.1.0
- **Language**: TypeScript with strict configuration
- **Styling**: CSS Modules + Tailwind CSS 4.x
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Authentication**: Supabase Auth with JWT
- **Build Tool**: Turbopack (Next.js default)
- **Package Manager**: pnpm

### Project Structure
```
src/
  app/                  # Next.js App Router pages and layouts
    layout.tsx         # Root layout with Geist fonts
    page.tsx           # Home page component
    globals.css        # Global styles with CSS variables
    page.module.css    # Component-specific styles
supabase/              # Supabase local development
  config.toml         # Local development configuration
```

### Key Configuration Details
- **TypeScript**: Strict mode enabled, paths configured for `@/*` imports
- **ESLint**: Next.js recommended config with TypeScript support
- **Supabase**: Local development configured on ports 54321-54327
- **Authentication**: JWT expiry set to 1 hour, signup enabled
- **Database**: PostgreSQL 17 with realtime features enabled

### Development Patterns
- **Styling**: Uses CSS Modules for component styles + global CSS variables for theming
- **Theming**: Built-in dark/light mode support via CSS `prefers-color-scheme`
- **Authentication**: Supabase Auth configured for local development at http://127.0.0.1:3000
- **Path Resolution**: `@/*` imports resolve to `src/*`

### Local Environment Setup
1. Ensure Docker is running for Supabase
2. Run `supabase start` to initialize local services
3. Use `pnpm dev` for development with hot reload
4. Access the app at http://localhost:3000
5. Access Supabase Studio at http://127.0.0.1:54323

### Dependencies of Note
- **UI Components**: Radix UI (Dialog, Tooltip) for accessible primitives
- **Utilities**: clsx for conditional classes, class-variance-authority for variants
- **Data**: Supabase client, date-fns for date handling, Zod for validation
- **CSV**: fast-csv and papaparse for data processing
- **Security**: bcryptjs for password hashing, jose for JWT handling