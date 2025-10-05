import { NextRequest, NextResponse } from 'next/server'
import { reportGenerator, ComplianceReportPDF } from '@/lib/services/reports/pdf-generator'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { renderToStream } from '@react-pdf/renderer'
import React from 'react'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company
    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { period } = await request.json()

    // Generate report data
    const reportData = await reportGenerator.generateComplianceReport(
      userData.company_id,
      period
    )

    // Render PDF to stream
    const pdfStream = await renderToStream(
      React.createElement(ComplianceReportPDF, { data: reportData })
    )

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of pdfStream) {
      chunks.push(chunk)
    }
    const pdfBuffer = Buffer.concat(chunks)

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="vatana-report-${period || 'current'}.pdf"`
      }
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

// Preview endpoint (returns JSON instead of PDF)
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period')

    const reportData = await reportGenerator.generateComplianceReport(
      userData.company_id,
      period || undefined
    )

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Report preview error:', error)
    return NextResponse.json(
      { error: 'Failed to preview report' },
      { status: 500 }
    )
  }
}
