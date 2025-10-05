import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) throw error
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      message: 'VATANA API is running! 🚀'
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}