# Supabase Setup Script for VATANA
# This script applies all database migrations to your Supabase project

Write-Host "🚀 VATANA Supabase Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Supabase project details
$SUPABASE_URL = "https://trojfnjtcwjitlziurkl.supabase.co"
$SUPABASE_PROJECT_REF = "trojfnjtcwjitlziurkl"

Write-Host "📊 Project: $SUPABASE_PROJECT_REF" -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI is not installed!" -ForegroundColor Red
    Write-Host "Install it from: https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Link to the project
Write-Host "🔗 Linking to Supabase project..." -ForegroundColor Yellow
supabase link --project-ref $SUPABASE_PROJECT_REF

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to link to Supabase project" -ForegroundColor Red
    Write-Host "You may need to login first: supabase login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Successfully linked to project" -ForegroundColor Green
Write-Host ""

# List of migration files in order
$migrations = @(
    "src\lib\supabase\migrations\20250929190000_vatana_core_schema_fixed.sql",
    "supabase\migrations\20240115000005_create_push_subscriptions.sql",
    "supabase\migrations\20251004154718_phase4_autofix_savings.sql",
    "supabase\migrations\20251005165746_team_collaboration.sql",
    "supabase\migrations\20251005170021_webhooks_system.sql"
)

Write-Host "📦 Applying migrations..." -ForegroundColor Yellow
Write-Host ""

foreach ($migration in $migrations) {
    $migrationPath = Join-Path $PSScriptRoot "..\$migration"
    $migrationName = Split-Path $migration -Leaf
    
    if (Test-Path $migrationPath) {
        Write-Host "  🔄 Applying: $migrationName" -ForegroundColor Cyan
        
        # Read the SQL file and execute it
        $sql = Get-Content $migrationPath -Raw
        
        # You'll need to apply this via Supabase CLI
        # For now, we'll copy migrations to the supabase/migrations folder
        $destPath = Join-Path $PSScriptRoot "..\supabase\migrations\$migrationName"
        
        if (-not (Test-Path $destPath)) {
            Copy-Item $migrationPath $destPath
            Write-Host "  ✅ Copied to supabase/migrations" -ForegroundColor Green
        } else {
            Write-Host "  ⏭️  Already exists in supabase/migrations" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠️  Migration not found: $migration" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔄 Pushing migrations to Supabase..." -ForegroundColor Yellow

# Push all migrations to remote
supabase db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All migrations applied successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some migrations may have failed. Check the output above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 Database Status:" -ForegroundColor Cyan
supabase db dump --schema public

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Supabase setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test your database connection" -ForegroundColor White
Write-Host "2. Run: pnpm run dev" -ForegroundColor White
Write-Host "3. Check: http://localhost:3000" -ForegroundColor White
Write-Host ""
