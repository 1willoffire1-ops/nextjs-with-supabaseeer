import { Invoice, VatError } from '@/types/supabase'

export type FixStrategy = 
  | 'recalculate_vat'
  | 'apply_reverse_charge'
  | 'correct_rate'
  | 'recalculate_amounts'
  | 'update_vat_id'

export interface FixResult {
  success: boolean
  strategy: FixStrategy
  before: Partial<Invoice>
  after: Partial<Invoice>
  changes: string[]
  penaltyAvoided: number
  requiresApproval: boolean
}

// VAT Rate Database (from Phase 3)
const VAT_RATES: Record<string, { standard: number; reduced: number; digital: number }> = {
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
  'ES': { standard: 21, reduced: 10, digital: 21 },
  'SE': { standard: 25, reduced: 6, digital: 25 }
}

/**
 * Fix Strategy: Recalculate VAT with correct rate
 */
export async function recalculateVAT(
  invoice: Invoice,
  error: VatError
): Promise<FixResult> {
  const countryRates = VAT_RATES[invoice.customer_country]
  if (!countryRates) {
    throw new Error(`Unknown country: ${invoice.customer_country}`)
  }

  // Determine correct rate based on product type
  let correctRate: number
  switch (invoice.product_type) {
    case 'goods':
      correctRate = countryRates.standard
      break
    case 'services':
      correctRate = countryRates.standard
      break
    case 'digital_service':
      correctRate = countryRates.digital
      break
    default:
      correctRate = countryRates.standard
  }

  // Calculate correct VAT amount
  const correctVATAmount = Number((invoice.net_amount * (correctRate / 100)).toFixed(2))
  const grossAmount = Number((invoice.net_amount + correctVATAmount).toFixed(2))

  const before = {
    vat_rate_percent: invoice.vat_rate_percent,
    vat_amount: invoice.vat_amount
  }

  const after = {
    vat_rate_percent: correctRate,
    vat_amount: correctVATAmount
  }

  const changes = [
    `Changed VAT rate from ${invoice.vat_rate_percent}% to ${correctRate}%`,
    `Recalculated VAT amount from €${invoice.vat_amount} to €${correctVATAmount}`,
    `New gross amount: €${grossAmount}`
  ]

  return {
    success: true,
    strategy: 'recalculate_vat',
    before,
    after,
    changes,
    penaltyAvoided: error.penalty_risk,
    requiresApproval: false
  }
}

/**
 * Fix Strategy: Apply Reverse Charge for cross-border B2B
 */
export async function applyReverseCharge(
  invoice: Invoice,
  error: VatError
): Promise<FixResult> {
  const before = {
    vat_rate_percent: invoice.vat_rate_percent,
    vat_amount: invoice.vat_amount
  }

  const after = {
    vat_rate_percent: 0,
    vat_amount: 0
  }

  const changes = [
    'Applied reverse charge mechanism',
    'Set VAT rate to 0% (buyer accounts for VAT)',
    'Added reverse charge note to invoice'
  ]

  return {
    success: true,
    strategy: 'apply_reverse_charge',
    before,
    after,
    changes,
    penaltyAvoided: error.penalty_risk,
    requiresApproval: true // Requires user confirmation
  }
}

/**
 * Fix Strategy: Correct calculation errors
 */
export async function recalculateAmounts(
  invoice: Invoice,
  error: VatError
): Promise<FixResult> {
  // Recalculate VAT amount based on rate and net amount
  const calculatedVAT = Number((invoice.net_amount * (invoice.vat_rate_percent / 100)).toFixed(2))
  
  const before = {
    vat_amount: invoice.vat_amount
  }

  const after = {
    vat_amount: calculatedVAT
  }

  const changes = [
    `Corrected VAT calculation`,
    `Updated VAT amount from €${invoice.vat_amount} to €${calculatedVAT}`,
    `Formula: €${invoice.net_amount} × ${invoice.vat_rate_percent}% = €${calculatedVAT}`
  ]

  return {
    success: true,
    strategy: 'recalculate_amounts',
    before,
    after,
    changes,
    penaltyAvoided: error.penalty_risk,
    requiresApproval: false
  }
}

/**
 * Main fix router - determines which strategy to use
 */
export async function getFixStrategy(
  invoice: Invoice,
  error: VatError
): Promise<FixResult> {
  switch (error.error_type) {
    case 'ERROR_WRONG_RATE':
      return recalculateVAT(invoice, error)
    
    case 'ERROR_CROSS_BORDER':
      return applyReverseCharge(invoice, error)
    
    case 'ERROR_INVALID_CALCULATION':
      return recalculateAmounts(invoice, error)
    
    default:
      throw new Error(`No fix strategy for error type: ${error.error_type}`)
  }
}