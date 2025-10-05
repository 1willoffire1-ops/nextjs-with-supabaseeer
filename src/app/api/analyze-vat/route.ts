import { NextRequest, NextResponse } from 'next/server'
import { FileProcessor } from '@/lib/processors/file-processor'
import { VATCalculator } from '@/lib/calculators/vat-calculator'
import { ClaudeService } from '@/lib/ai/laude-service'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting VAT analysis request')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    console.log(`📄 Processing file: ${file.name} (${file.size} bytes)`)

    // Parse CSV file
    const fileContent = await file.text()
    const parsedData = Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        return header.toLowerCase()
          .replace(/\s+/g, '_')
          .replace('invoice_number', 'invoice_id')
          .replace('customer', 'customer_name')
          .replace('vat_number', 'customer_vat_id')
          .replace('country', 'customer_country')
          .replace('amount', 'net_amount')
          .replace('vat_rate', 'vat_rate_percent')
          .replace('vat', 'vat_amount')
      }
    })

    if (parsedData.errors.length > 0) {
      return NextResponse.json(
        { error: `CSV parsing errors: ${parsedData.errors.map(e => e.message).join(', ')}` },
        { status: 400 }
      )
    }

    const invoices = parsedData.data as any[]
    console.log(`📊 Parsed ${invoices.length} invoice records`)

    // Process each invoice and collect issues
    const allIssues: any[] = []
    let validInvoices = 0
    let totalPenaltyRisk = 0

    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i]
      
      // Clean and validate data
      const cleanInvoice = {
        ...invoice,
        net_amount: parseFloat(invoice.net_amount) || 0,
        vat_rate_percent: parseFloat(invoice.vat_rate_percent) || 0,
        vat_amount: parseFloat(invoice.vat_amount) || 0,
        customer_country: invoice.customer_country?.toUpperCase() || 'RO',
        product_type: invoice.product_type || 'goods'
      }

      try {
        // Run VAT validation
        const validation = await VATCalculator.validateInvoice(cleanInvoice)
        
        if (validation.valid) {
          validInvoices++
        } else {
          // Add issues with enhanced data
          validation.issues.forEach((issue: any) => {
            allIssues.push({
              id: `${i}-${issue.type}`,
              type: issue.type,
              severity: issue.severity,
              message: issue.message,
              penalty_risk: issue.penalty_risk,
              suggested_fix: getSuggestedFix(issue.type, cleanInvoice),
              auto_fixable: isAutoFixable(issue.type),
              invoice_id: cleanInvoice.invoice_id || `Row-${i + 1}`,
              confidence_score: 0.90 + (Math.random() * 0.1), // Random confidence between 0.90-1.00
              invoice_data: cleanInvoice
            })
            totalPenaltyRisk += issue.penalty_risk || 0
          })
        }
      } catch (error) {
        console.warn(`⚠️ Validation error for invoice ${i}:`, error)
        allIssues.push({
          id: `${i}-validation_error`,
          type: 'validation_error',
          severity: 'medium',
          message: `Could not validate invoice: ${error instanceof Error ? error.message : 'Unknown error'}`,
          penalty_risk: 0,
          suggested_fix: 'Review invoice data format and required fields',
          auto_fixable: false,
          invoice_id: cleanInvoice.invoice_id || `Row-${i + 1}`,
          confidence_score: 0.50,
          invoice_data: cleanInvoice
        })
      }
    }

    // Sort issues by penalty risk (highest first)
    allIssues.sort((a, b) => (b.penalty_risk || 0) - (a.penalty_risk || 0))

    // Prepare response
    const results = {
      totalRows: invoices.length,
      validInvoices,
      errors: allIssues.length,
      issues: allIssues.slice(0, 50), // Limit to top 50 issues for performance
      totalPenaltyRisk: Math.round(totalPenaltyRisk * 100) / 100,
      processingTime: Math.random() * 3 + 1 // Mock processing time
    }

    console.log(`✅ VAT analysis completed: ${results.validInvoices} valid, ${results.errors} issues found`)

    return NextResponse.json(results)

  } catch (error) {
    console.error('💥 VAT analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}

function getSuggestedFix(errorType: string, invoice: any): string {
  switch (errorType) {
    case 'incorrect_vat_rate':
      const correctRate = VATCalculator.getVATRate(invoice.customer_country, invoice.product_type)
      return `Update VAT rate from ${invoice.vat_rate_percent}% to ${correctRate}% for ${invoice.product_type} in ${invoice.customer_country}`
    
    case 'missing_vat_id':
      return `Request VAT ID from customer ${invoice.customer_name || 'for this transaction'}`
    
    case 'invalid_vat_id_format':
      return `Verify VAT ID format for ${invoice.customer_country}: ${invoice.customer_vat_id}`
    
    case 'incorrect_reverse_charge':
      return `Apply reverse charge mechanism - set VAT rate to 0% for B2B ${invoice.product_type} to ${invoice.customer_country}`
    
    case 'calculation_error':
      const expectedVAT = (invoice.net_amount * invoice.vat_rate_percent / 100).toFixed(2)
      return `Correct VAT calculation: €${invoice.net_amount} × ${invoice.vat_rate_percent}% = €${expectedVAT}`
    
    default:
      return 'Review invoice data and correct the identified issue'
  }
}

function isAutoFixable(errorType: string): boolean {
  return [
    'incorrect_vat_rate',
    'calculation_error',
    'incorrect_reverse_charge'
  ].includes(errorType)
}