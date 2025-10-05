import { supabaseAdmin } from '@/lib/supabase/server'

// EU VAT rates database (cached for performance)
const VAT_RATES = {
  'AT': { standard: 20, reduced: 10, digital: 20 },
  'BE': { standard: 21, reduced: 6, digital: 21 },
  'BG': { standard: 20, reduced: 9, digital: 20 },
  'HR': { standard: 25, reduced: 5, digital: 25 },
  'CY': { standard: 19, reduced: 5, digital: 19 },
  'CZ': { standard: 21, reduced: 10, digital: 21 },
  'DK': { standard: 25, reduced: 0, digital: 25 },
  'EE': { standard: 20, reduced: 9, digital: 20 },
  'FI': { standard: 24, reduced: 10, digital: 24 },
  'FR': { standard: 20, reduced: 5.5, digital: 20 },
  'DE': { standard: 19, reduced: 7, digital: 19 },
  'GR': { standard: 24, reduced: 6, digital: 24 },
  'HU': { standard: 27, reduced: 5, digital: 27 },
  'IE': { standard: 23, reduced: 9, digital: 23 },
  'IT': { standard: 22, reduced: 4, digital: 22 },
  'LV': { standard: 21, reduced: 5, digital: 21 },
  'LT': { standard: 21, reduced: 5, digital: 21 },
  'LU': { standard: 17, reduced: 3, digital: 17 },
  'MT': { standard: 18, reduced: 5, digital: 18 },
  'NL': { standard: 21, reduced: 9, digital: 21 },
  'PL': { standard: 23, reduced: 5, digital: 23 },
  'PT': { standard: 23, reduced: 6, digital: 23 },
  'RO': { standard: 19, reduced: 5, digital: 19 },
  'SK': { standard: 20, reduced: 10, digital: 20 },
  'SI': { standard: 22, reduced: 5, digital: 22 },
  'ES': { standard: 21, reduced: 4, digital: 21 },
  'SE': { standard: 25, reduced: 6, digital: 25 }
} as const

export class VATCalculator {
  // Get correct VAT rate for country and product type
  static getVATRate(countryCode: string, productType: string = 'goods'): number {
    const rates = VAT_RATES[countryCode as keyof typeof VAT_RATES]
    
    if (!rates) {
      console.warn(`⚠️ VAT rates not found for country: ${countryCode}`)
      return 19 // Default to Romanian rate
    }
    
    switch (productType) {
      case 'digital_service':
        return rates.digital
      case 'services':
        return rates.standard // Most services use standard rate
      case 'goods':
      default:
        return rates.standard
    }
  }
  
  // Check if reverse charge should apply
  static shouldApplyReverseCharge(
    supplierCountry: string,
    customerCountry: string,
    productType: string,
    hasValidVATID: boolean
  ): boolean {
    // Must be different EU countries
    if (supplierCountry === customerCountry) return false
    
    // Customer must have valid VAT ID for B2B
    if (!hasValidVATID) return false
    
    // Digital services - reverse charge applies for B2B
    if (productType === 'digital_service') return true
    
    // Most services - reverse charge applies for B2B
    if (productType === 'services') return true
    
    // Goods - generally no reverse charge
    return false
  }
  
  // Validate VAT ID format
  static isValidVATIDFormat(vatId: string, country: string): boolean {
    const patterns: Record<string, RegExp> = {
      'AT': /^ATU[0-9]{8}$/,
      'BE': /^BE[0-9]{10}$/,
      'BG': /^BG[0-9]{9,10}$/,
      'HR': /^HR[0-9]{11}$/,
      'CY': /^CY[0-9]{8}[A-Z]$/,
      'CZ': /^CZ[0-9]{8,10}$/,
      'DK': /^DK[0-9]{8}$/,
      'EE': /^EE[0-9]{9}$/,
      'FI': /^FI[0-9]{8}$/,
      'FR': /^FR[0-9A-Z]{2}[0-9]{9}$/,
      'DE': /^DE[0-9]{9}$/,
      'GR': /^GR[0-9]{9}$/,
      'HU': /^HU[0-9]{8}$/,
      'IE': /^IE[0-9][A-Z0-9][0-9]{5}[A-Z]{1,2}$/,
      'IT': /^IT[0-9]{11}$/,
      'LV': /^LV[0-9]{11}$/,
      'LT': /^LT([0-9]{9}|[0-9]{12})$/,
      'LU': /^LU[0-9]{8}$/,
      'MT': /^MT[0-9]{8}$/,
      'NL': /^NL[0-9]{9}B[0-9]{2}$/,
      'PL': /^PL[0-9]{10}$/,
      'PT': /^PT[0-9]{9}$/,
      'RO': /^RO[0-9]{2,10}$/,
      'SK': /^SK[0-9]{10}$/,
      'SI': /^SI[0-9]{8}$/,
      'ES': /^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/,
      'SE': /^SE[0-9]{12}$/
    }
    
    const pattern = patterns[country.toUpperCase()]
    if (!pattern) {
      console.warn(`⚠️ No VAT ID pattern for country: ${country}`)
      return true // Default to valid if no pattern available
    }
    
    return pattern.test(vatId.toUpperCase())
  }
  
  // Calculate penalty risk based on error type and amount
  static calculatePenaltyRisk(amount: number, errorType: string): number {
    const penaltyRates: Record<string, number> = {
      'incorrect_vat_rate': 0.20, // 20% of VAT amount
      'missing_vat_id': 0.05, // 5% of net amount
      'invalid_vat_id': 0.10, // 10% of VAT amount
      'calculation_error': 0.15, // 15% of difference
      'jurisdiction_error': 0.25, // 25% of VAT amount
      'reverse_charge_error': 0.30 // 30% of missed VAT
    }
    
    const rate = penaltyRates[errorType] || 0.10
    return Math.round(amount * rate * 100) / 100
  }
  
  // Comprehensive invoice validation
  static async validateInvoice(invoice: any) {
    const issues: any[] = []
    
    try {
      // 1. VAT Rate Validation
      const correctRate = this.getVATRate(invoice.customer_country, invoice.product_type)
      
      if (Math.abs(invoice.vat_rate_percent - correctRate) > 0.1) {
        issues.push({
          type: 'incorrect_vat_rate',
          severity: 'high',
          message: `VAT rate should be ${correctRate}% for ${invoice.product_type} in ${invoice.customer_country}`,
          expected_value: correctRate,
          actual_value: invoice.vat_rate_percent,
          penalty_risk: this.calculatePenaltyRisk(invoice.vat_amount, 'incorrect_vat_rate')
        })
      }
      
      // 2. Calculation Validation
      const expectedVAT = Math.round((invoice.net_amount * invoice.vat_rate_percent / 100) * 100) / 100
      const calculationDifference = Math.abs(invoice.vat_amount - expectedVAT)
      
      if (calculationDifference > 0.02) { // Allow 2 cent rounding
        issues.push({
          type: 'calculation_error',
          severity: 'medium',
          message: `VAT calculation incorrect. Expected €${expectedVAT.toFixed(2)}, got €${invoice.vat_amount}`,
          expected_value: expectedVAT,
          actual_value: invoice.vat_amount,
          penalty_risk: this.calculatePenaltyRisk(calculationDifference, 'calculation_error')
        })
      }
      
      // 3. VAT ID Validation
      if (invoice.net_amount > 1000 && !invoice.customer_vat_id) {
        issues.push({
          type: 'missing_vat_id',
          severity: 'medium',
          message: 'VAT ID required for transactions over €1,000',
          penalty_risk: this.calculatePenaltyRisk(invoice.net_amount, 'missing_vat_id')
        })
      }
      
      if (invoice.customer_vat_id && !this.isValidVATIDFormat(invoice.customer_vat_id, invoice.customer_country)) {
        issues.push({
          type: 'invalid_vat_id_format',
          severity: 'high',
          message: `VAT ID format invalid for ${invoice.customer_country}`,
          penalty_risk: this.calculatePenaltyRisk(invoice.vat_amount, 'invalid_vat_id')
        })
      }
      
      // 4. Reverse Charge Validation
      const shouldReverse = this.shouldApplyReverseCharge(
        'RO', // Assuming Romanian supplier
        invoice.customer_country,
        invoice.product_type,
        !!invoice.customer_vat_id
      )
      
      if (shouldReverse && invoice.vat_rate_percent > 0) {
        issues.push({
          type: 'incorrect_reverse_charge',
          severity: 'high',
          message: 'Reverse charge should apply - VAT rate should be 0%',
          expected_value: 0,
          actual_value: invoice.vat_rate_percent,
          penalty_risk: this.calculatePenaltyRisk(invoice.vat_amount, 'reverse_charge_error')
        })
      }
      
      // 5. Date Validation
      const invoiceDate = new Date(invoice.date)
      const now = new Date()
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      const futureLimit = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
      
      if (invoiceDate < oneYearAgo || invoiceDate > futureLimit) {
        issues.push({
          type: 'date_validation_error',
          severity: 'low',
          message: 'Invoice date seems unusual - please verify',
          penalty_risk: 0
        })
      }
      
    } catch (error) {
      console.error('💥 Invoice validation error:', error)
      issues.push({
        type: 'validation_system_error',
        severity: 'low',
        message: 'Could not complete full validation',
        penalty_risk: 0
      })
    }
    
    return {
      valid: issues.length === 0,
      issues,
      total_penalty_risk: issues.reduce((sum, issue) => sum + (issue.penalty_risk || 0), 0)
    }
  }
}