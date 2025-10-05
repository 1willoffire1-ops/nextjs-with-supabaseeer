import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'
import { ElsterService } from '@/lib/services/government/elster/elster-service'
import { MOSSService } from '@/lib/services/government/moss/moss-service'
import { HMRCService } from '@/lib/services/government/hmrc/hmrc-service'
import type { VATReturn, FilingResult } from '@/lib/services/government/base-filing-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { country, period, taxId } = await request.json()

    // Get user's company
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('company_id, company_name')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch VAT data for the period
    const vatData = await fetchVATData(userData.company_id, period)

    if (!vatData) {
      return NextResponse.json({ error: 'No VAT data found for period' }, { status: 404 })
    }

    // Get government API credentials
    const credentials = await getGovernmentCredentials(userData.company_id, country)

    if (!credentials) {
      return NextResponse.json({ error: 'Government API not configured' }, { status: 400 })
    }

    // Submit to appropriate government service
    let result: FilingResult

    switch (country.toUpperCase()) {
      case 'DE':
      case 'GERMANY':
        const elster = new ElsterService(credentials)
        result = await elster.submitReturn(vatData)
        break

      case 'EU':
      case 'MOSS':
        const moss = new MOSSService(credentials)
        result = await moss.submitReturn(vatData)
        break

      case 'UK':
      case 'GB':
        const hmrc = new HMRCService(credentials)
        result = await hmrc.submitReturn(vatData)
        break

      default:
        return NextResponse.json({ error: 'Unsupported country' }, { status: 400 })
    }

    // Log submission to database
    await logSubmission(userData.company_id, country, period, result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Filing submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit VAT return' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const submissionId = searchParams.get('submissionId')
    const country = searchParams.get('country')

    if (!submissionId || !country) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get credentials and check status
    const credentials = await getGovernmentCredentials(userData.company_id, country)

    if (!credentials) {
      return NextResponse.json({ error: 'Government API not configured' }, { status: 400 })
    }

    let result: FilingResult

    switch (country.toUpperCase()) {
      case 'DE':
      case 'GERMANY':
        const elster = new ElsterService(credentials)
        result = await elster.checkStatus(submissionId)
        break

      case 'EU':
      case 'MOSS':
        const moss = new MOSSService(credentials)
        result = await moss.checkStatus(submissionId)
        break

      case 'UK':
      case 'GB':
        const hmrc = new HMRCService(credentials)
        result = await hmrc.checkStatus(submissionId)
        break

      default:
        return NextResponse.json({ error: 'Unsupported country' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check submission status' },
      { status: 500 }
    )
  }
}

// Helper functions

async function fetchVATData(companyId: string, period: string): Promise<VATReturn | null> {
  // Fetch invoices for the period
  const { data: invoices } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('company_id', companyId)
    .gte('invoice_date', `${period}-01`)
    .lt('invoice_date', getNextPeriod(period))

  if (!invoices || invoices.length === 0) return null

  // Calculate totals
  const totalSales = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0)
  const totalVAT = invoices.reduce((sum, inv) => sum + Number(inv.vat_amount), 0)
  const deductibleVAT = 0 // Would need purchase invoice tracking
  const netVATPayable = totalVAT - deductibleVAT

  // Get company tax ID
  const { data: company } = await supabaseAdmin
    .from('users')
    .select('tax_id')
    .eq('company_id', companyId)
    .single()

  return {
    companyId,
    taxId: company?.tax_id || '',
    period,
    totalSales,
    totalVAT,
    deductibleVAT,
    netVATPayable,
    transactions: invoices.map(inv => ({
      invoiceId: inv.invoice_id,
      date: inv.invoice_date,
      amount: Number(inv.amount),
      vatRate: Number(inv.vat_rate),
      vatAmount: Number(inv.vat_amount)
    }))
  }
}

async function getGovernmentCredentials(companyId: string, country: string) {
  const { data } = await supabaseAdmin
    .from('government_credentials')
    .select('*')
    .eq('company_id', companyId)
    .eq('country', country.toUpperCase())
    .single()

  if (!data) return null

  return {
    apiKey: data.api_key,
    username: data.username,
    password: data.password,
    certificatePath: data.certificate_path
  }
}

async function logSubmission(
  companyId: string,
  country: string,
  period: string,
  result: FilingResult
) {
  await supabaseAdmin
    .from('filing_submissions')
    .insert({
      company_id: companyId,
      country,
      period,
      submission_id: result.submissionId,
      status: result.status,
      success: result.success,
      message: result.message,
      errors: result.errors,
      receipt_url: result.receiptUrl,
      submitted_at: new Date().toISOString()
    })
}

function getNextPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number)
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}`
}
