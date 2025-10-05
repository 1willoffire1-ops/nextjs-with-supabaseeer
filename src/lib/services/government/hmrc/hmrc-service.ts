import { BaseFilingService, FilingCredentials, VATReturn, FilingResult } from '../base-filing-service'

export class HMRCService extends BaseFilingService {
  constructor(credentials: FilingCredentials) {
    super('https://api.service.hmrc.gov.uk', credentials)
  }

  protected setupAuth(credentials: FilingCredentials): void {
    // HMRC MTD uses OAuth 2.0
    this.client.defaults.headers.common['Authorization'] = `Bearer ${credentials.apiKey}`
    this.client.defaults.headers.common['Accept'] = 'application/vnd.hmrc.1.0+json'
    this.client.defaults.headers.common['Content-Type'] = 'application/json'
  }

  protected generateXML(vatReturn: VATReturn): string {
    // HMRC MTD uses JSON, not XML, but we'll keep the method for interface consistency
    const hmrcReturn = {
      periodKey: vatReturn.period,
      vatDueSales: Math.round(vatReturn.totalVAT * 100) / 100,
      vatDueAcquisitions: 0, // EU acquisitions
      totalVatDue: Math.round(vatReturn.totalVAT * 100) / 100,
      vatReclaimedCurrPeriod: Math.round(vatReturn.deductibleVAT * 100) / 100,
      netVatDue: Math.round(vatReturn.netVATPayable * 100) / 100,
      totalValueSalesExVAT: Math.round(vatReturn.totalSales * 100) / 100,
      totalValuePurchasesExVAT: 0, // Would need to be tracked
      totalValueGoodsSuppliedExVAT: 0,
      totalAcquisitionsExVAT: 0,
      finalised: true
    }

    // Return JSON as string (HMRC uses JSON, not XML)
    return JSON.stringify(hmrcReturn)
  }

  protected parseResponse(response: any): FilingResult {
    if (response.processingDate) {
      return {
        success: true,
        submissionId: response.formBundleNumber || response.paymentIndicator,
        status: 'accepted',
        message: 'VAT return successfully submitted to HMRC',
        receiptUrl: `https://www.tax.service.gov.uk/vat-through-software/vat-overview`
      }
    } else if (response.code === 'INVALID_REQUEST' || response.code === 'BUSINESS_ERROR') {
      return {
        success: false,
        status: 'rejected',
        message: response.message || 'HMRC rejected the submission',
        errors: response.errors?.map((e: any) => e.message) || ['Unknown error']
      }
    } else {
      return {
        success: false,
        status: 'rejected',
        message: 'Failed to submit to HMRC',
        errors: ['Unknown response format']
      }
    }
  }

  /**
   * Override submitReturn to use JSON instead of XML
   */
  async submitReturn(vatReturn: VATReturn): Promise<FilingResult> {
    try {
      const jsonData = JSON.parse(this.generateXML(vatReturn))
      const vrn = vatReturn.taxId.replace(/[^0-9]/g, '') // Extract VRN number only
      
      const response = await this.client.post(
        `/organisations/vat/${vrn}/returns`,
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      return this.parseResponse(response.data)
    } catch (error: any) {
      return {
        success: false,
        status: 'rejected',
        message: error.message || 'Submission failed',
        errors: [error.response?.data?.message || 'Unknown error']
      }
    }
  }

  /**
   * Get VAT obligations for a period
   */
  async getObligations(vrn: string, from: string, to: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/organisations/vat/${vrn}/obligations`,
        {
          params: {
            from,
            to,
            status: 'O' // Open obligations
          }
        }
      )
      return response.data.obligations || []
    } catch (error) {
      console.error('Failed to get obligations:', error)
      return []
    }
  }

  /**
   * Get VAT liabilities for a period
   */
  async getLiabilities(vrn: string, from: string, to: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/organisations/vat/${vrn}/liabilities`,
        {
          params: { from, to }
        }
      )
      return response.data.liabilities || []
    } catch (error) {
      console.error('Failed to get liabilities:', error)
      return []
    }
  }

  /**
   * Get VAT payments for a period
   */
  async getPayments(vrn: string, from: string, to: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/organisations/vat/${vrn}/payments`,
        {
          params: { from, to }
        }
      )
      return response.data.payments || []
    } catch (error) {
      console.error('Failed to get payments:', error)
      return []
    }
  }

  /**
   * Retrieve a previously submitted VAT return
   */
  async getSubmittedReturn(vrn: string, periodKey: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/organisations/vat/${vrn}/returns/${periodKey}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to get submitted return:', error)
      return null
    }
  }
}
