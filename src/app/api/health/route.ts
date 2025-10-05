import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime ? Math.floor(process.uptime()) : null,
    checks: {
      database: 'unknown',
      api: 'unknown',
      claude: 'unknown'
    }
  }

  try {
    // Check database connection
    const { data, error: dbError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    checks.checks.database = dbError ? 'unhealthy' : 'healthy'

    // Check if Claude API key is configured
    checks.checks.claude = process.env.CLAUDE_API_KEY ? 'configured' : 'missing'
    
    // Check if API is responsive
    checks.checks.api = 'healthy'

    // Overall health
    const isHealthy = checks.checks.database === 'healthy' && 
                     checks.checks.api === 'healthy' && 
                     checks.checks.claude === 'configured'
    
    checks.status = isHealthy ? 'healthy' : 'degraded'

    return NextResponse.json(checks, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        ...checks,
        status: 'unhealthy',
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
