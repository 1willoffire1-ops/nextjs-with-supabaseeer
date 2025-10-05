import { supabaseAdmin } from '@/lib/supabase/server'

interface DetectedError {
  id?: string
  upload_id: string
  error_type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  penalty_risk_eur: number
  auto_fixable: boolean
  field_path?: string
  suggested_fix?: string
}

class ErrorDetectorService {
  async detectErrors(uploadId: string, useAI: boolean = false): Promise<DetectedError[]> {
    try {
      console.log(`🔍 Detecting errors for upload ${uploadId}, AI: ${useAI}`)
      
      // Get upload details
      const { data: upload, error: uploadError } = await supabaseAdmin
        .from('uploads')
        .select('*')
        .eq('id', uploadId)
        .single()
      
      if (uploadError || !upload) {
        throw new Error(`Upload not found: ${uploadId}`)
      }
      
      // Get invoices for this upload
      const { data: invoices, error: invoicesError } = await supabaseAdmin
        .from('invoices')
        .select('*')
        .eq('upload_id', uploadId)
      
      if (invoicesError) {
        throw new Error(`Failed to fetch invoices: ${invoicesError.message}`)
      }
      
      const errors: DetectedError[] = []
      
      // Run basic validation on each invoice
      for (const invoice of invoices || []) {
        const invoiceErrors = await this.validateInvoice(invoice, useAI)
        errors.push(...invoiceErrors)
      }
      
      // Store detected errors in database
      if (errors.length > 0) {
        const { error: insertError } = await supabaseAdmin
          .from('vat_errors')
          .insert(errors.map(err => ({
            upload_id: uploadId,
            invoice_id: err.upload_id, // This should be invoice_id but keeping for compatibility
            error_type: err.error_type,
            severity: err.severity,
            description: err.description,
            penalty_risk_eur: err.penalty_risk_eur,
            auto_fixable: err.auto_fixable,
            field_path: err.field_path,
            suggested_fix: err.suggested_fix,
            resolved: false,
            created_at: new Date().toISOString()
          })))
        
        if (insertError) {
          console.error('Failed to store errors:', insertError)
        }
      }
      
      console.log(`✅ Error detection completed: ${errors.length} errors found`)
      return errors
      
    } catch (error) {
      console.error('Error detection failed:', error)
      throw error
    }
  }
  
  private async validateInvoice(invoice: any, useAI: boolean): Promise<DetectedError[]> {
    const errors: DetectedError[] = []
    
    // Basic validation rules
    
    // Check for missing VAT ID in B2B transactions
    if (invoice.customer_type === 'business' && !invoice.customer_vat_id) {
      errors.push({
        upload_id: invoice.id,
        error_type: 'ERROR_MISSING_VAT_ID',
        severity: 'high',
        description: 'B2B transaction missing customer VAT ID',
        penalty_risk_eur: 500,
        auto_fixable: false,
        field_path: 'customer_vat_id',
        suggested_fix: 'Collect and validate customer VAT ID for B2B transactions'
      })
    }
    
    // Check for invalid VAT rates
    const validRates = [0, 9, 19] // Common German VAT rates
    if (invoice.vat_rate && !validRates.includes(invoice.vat_rate)) {
      errors.push({
        upload_id: invoice.id,
        error_type: 'ERROR_INVALID_VAT_RATE',
        severity: 'critical',
        description: `Invalid VAT rate: ${invoice.vat_rate}%`,
        penalty_risk_eur: 1000,
        auto_fixable: true,
        field_path: 'vat_rate',
        suggested_fix: `Use standard VAT rate (19% for most goods/services)`
      })
    }
    
    // Check for missing invoice date
    if (!invoice.invoice_date) {
      errors.push({
        upload_id: invoice.id,
        error_type: 'ERROR_MISSING_DATE',
        severity: 'medium',
        description: 'Invoice date is missing',
        penalty_risk_eur: 200,
        auto_fixable: false,
        field_path: 'invoice_date',
        suggested_fix: 'Add valid invoice date'
      })
    }
    
    // Check for incorrect VAT calculation
    if (invoice.net_amount && invoice.vat_rate && invoice.vat_amount) {
      const expectedVat = (invoice.net_amount * invoice.vat_rate) / 100
      const difference = Math.abs(expectedVat - invoice.vat_amount)
      
      if (difference > 0.01) { // Allow for small rounding differences
        errors.push({
          upload_id: invoice.id,
          error_type: 'ERROR_INCORRECT_VAT_CALCULATION',
          severity: 'high',
          description: `VAT calculation error: Expected €${expectedVat.toFixed(2)}, got €${invoice.vat_amount}`,
          penalty_risk_eur: 750,
          auto_fixable: true,
          field_path: 'vat_amount',
          suggested_fix: `Correct VAT amount to €${expectedVat.toFixed(2)}`
        })
      }
    }
    
    // AI-powered additional checks (if enabled)
    if (useAI) {
      const aiErrors = await this.runAIValidation(invoice)
      errors.push(...aiErrors)
    }
    
    return errors
  }
  
  private async runAIValidation(invoice: any): Promise<DetectedError[]> {
    // Placeholder for AI-powered validation
    // In a real implementation, this would call an AI service to analyze the invoice
    const errors: DetectedError[] = []
    
    // Mock AI analysis - look for suspicious patterns
    if (invoice.description && invoice.description.toLowerCase().includes('cash')) {
      errors.push({
        upload_id: invoice.id,
        error_type: 'ERROR_SUSPICIOUS_CASH_TRANSACTION',
        severity: 'medium',
        description: 'AI detected potential cash transaction requiring special handling',
        penalty_risk_eur: 300,
        auto_fixable: false,
        field_path: 'description',
        suggested_fix: 'Review cash transaction documentation requirements'
      })
    }
    
    return errors
  }
}

export const ErrorDetector = new ErrorDetectorService()