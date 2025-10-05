import Papa from 'papaparse'
import { supabaseAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

// Invoice validation schema
const invoiceSchema = z.object({
  invoice_id: z.string().min(1, 'Invoice ID required'),
  date: z.string().refine(date => !isNaN(Date.parse(date)), 'Invalid date'),
  customer_name: z.string().optional(),
  customer_vat_id: z.string().optional(),
  customer_country: z.string().length(2, 'Country code must be 2 characters'),
  net_amount: z.number().min(0, 'Net amount must be positive'),
  vat_rate_percent: z.number().min(0).max(100, 'VAT rate must be 0-100%'),
  vat_amount: z.number().min(0, 'VAT amount must be positive'),
  product_type: z.enum(['goods', 'services', 'digital_service']).optional().default('goods')
})

export class FileProcessor {
  static async processFile(file: File, userId: string, uploadId: string) {
    console.log(`🔄 Processing file: ${file.name} for user: ${userId}`)
    
    try {
      // Update upload status to processing
      await this.updateUploadStatus(uploadId, 'processing', 10)
      
      let data: any[]
      
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        data = await this.processCSV(file)
      } else {
        throw new Error('Unsupported file type. Please upload CSV files.')
      }
      
      await this.updateUploadStatus(uploadId, 'processing', 30)
      
      // Validate and save data
      const result = await this.validateAndSaveData(data, uploadId, userId)
      
      // Complete processing
      await this.updateUploadStatus(uploadId, 'completed', 100)
      
      console.log(`✅ File processing completed: ${result.validInvoices} valid, ${result.errors} errors`)
      
      return result
      
    } catch (error) {
      console.error('❌ File processing error:', error)
      await this.updateUploadStatus(uploadId, 'failed', 0)
      throw error
    }
  }
  
  static async processCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Normalize headers to match our schema
          return header.toLowerCase()
            .replace(/\s+/g, '_')
            .replace('invoice_number', 'invoice_id')
            .replace('customer', 'customer_name')
            .replace('vat_number', 'customer_vat_id')
            .replace('country', 'customer_country')
            .replace('amount', 'net_amount')
            .replace('vat_rate', 'vat_rate_percent')
            .replace('vat', 'vat_amount')
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
          } else {
            resolve(results.data)
          }
        },
        error: (error) => reject(error)
      })
    })
  }
  
  static async validateAndSaveData(data: any[], uploadId: string, userId: string) {
    const validInvoices: any[] = []
    const errors: any[] = []
    const totalRows = data.length
    
    console.log(`📊 Validating ${totalRows} invoice rows`)
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      // Update progress every 50 rows
      if (i % 50 === 0) {
        const progress = Math.floor(30 + (i / totalRows) * 50) // 30-80% range
        await this.updateUploadStatus(uploadId, 'processing', progress)
      }
      
      try {
        const validatedInvoice = await this.validateInvoiceRow(row, uploadId, i + 1)
        validInvoices.push(validatedInvoice)
      } catch (error) {
        console.warn(`⚠️ Row ${i + 1} validation error:`, error)
        errors.push({
          row_number: i + 1,
          error: error instanceof Error ? error.message : 'Validation failed',
          data: row
        })
      }
    }
    
    // Save valid invoices in batches
    if (validInvoices.length > 0) {
      console.log(`💾 Saving ${validInvoices.length} valid invoices`)
      await this.saveInvoicesBatch(validInvoices)
    }
    
    // Update upload with final stats
    await supabaseAdmin
      .from('uploads')
      .update({
        row_count: totalRows,
        errors_found: errors.length
      })
      .eq('id', uploadId)
    
    await this.updateUploadStatus(uploadId, 'processing', 90)
    
    return {
      totalRows,
      validInvoices: validInvoices.length,
      errors: errors.length,
      errorDetails: errors
    }
  }
  
  static async validateInvoiceRow(row: any, uploadId: string, rowNumber: number) {
    // Convert string numbers to actual numbers
    const cleanRow = {
      ...row,
      net_amount: this.parseNumber(row.net_amount),
      vat_rate_percent: this.parseNumber(row.vat_rate_percent),
      vat_amount: this.parseNumber(row.vat_amount),
      customer_country: row.customer_country?.toUpperCase()
    }
    
    // Validate with Zod schema
    const validationResult = invoiceSchema.safeParse(cleanRow)
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ')
      throw new Error(errorMessages)
    }
    
    const validatedData = validationResult.data
    
    // Additional business validation
    const expectedVAT = (validatedData.net_amount * validatedData.vat_rate_percent) / 100
    const vatDifference = Math.abs(validatedData.vat_amount - expectedVAT)
    
    if (vatDifference > 0.02) {
      console.warn(`💰 VAT calculation mismatch in row ${rowNumber}: expected ${expectedVAT.toFixed(2)}, got ${validatedData.vat_amount}`)
    }
    
    return {
      upload_id: uploadId,
      invoice_id: validatedData.invoice_id,
      date: new Date(validatedData.date).toISOString().split('T')[0],
      customer_name: validatedData.customer_name || '',
      customer_vat_id: validatedData.customer_vat_id || '',
      customer_country: validatedData.customer_country,
      net_amount: validatedData.net_amount,
      vat_rate_percent: validatedData.vat_rate_percent,
      vat_amount: validatedData.vat_amount,
      product_type: validatedData.product_type,
      status: 'pending'
    }
  }
  
  static parseNumber(value: any): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '')
      const parsed = parseFloat(cleaned)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }
  
  static async saveInvoicesBatch(invoices: any[], batchSize = 500) {
    for (let i = 0; i < invoices.length; i += batchSize) {
      const batch = invoices.slice(i, i + batchSize)
      
      const { error } = await supabaseAdmin
        .from('invoices')
        .insert(batch)
      
      if (error) {
        console.error('💥 Batch insert error:', error)
        throw new Error(`Failed to save invoices batch: ${error.message}`)
      }
    }
  }
  
  static async updateUploadStatus(uploadId: string, status: string, progress: number) {
    const { error } = await supabaseAdmin
      .from('uploads')
      .update({
        processing_status: status,
        processing_progress: progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', uploadId)
    
    if (error) {
      console.error('📊 Upload status update error:', error)
    }
  }
}