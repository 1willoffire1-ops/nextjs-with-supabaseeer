import { BaseFilingService, FilingCredentials, VATReturn, FilingResult } from '../base-filing-service'

export class MOSSService extends BaseFilingService {
  constructor(credentials: FilingCredentials) {
    super('https://ec.europa.eu/taxation_customs/vies/rest-api/v1', credentials)
  }

  protected setupAuth(credentials: FilingCredentials): void {
    // MOSS uses OAuth2 authentication
    this.client.defaults.headers.common['Authorization'] = `Bearer ${credentials.apiKey}`
    this.client.defaults.headers.common['Content-Type'] = 'application/xml'
  }

  protected generateXML(vatReturn: VATReturn): string {
    // Group transactions by country
    const transactionsByCountry = vatReturn.transactions.reduce((acc, transaction) => {
      // Extract country from customer data (would need to be added to transaction interface)
      const country = 'EU' // Placeholder
      if (!acc[country]) {
        acc[country] = {
          totalAmount: 0,
          totalVAT: 0,
          transactions: []
        }
      }
      acc[country].totalAmount += transaction.amount
      acc[country].totalVAT += transaction.vatAmount
      acc[country].transactions.push(transaction)
      return acc
    }, {} as Record<string, any>)

    const mossXML = {
      '?xml': {
        '@_version': '1.0',
        '@_encoding': 'UTF-8'
      },
      'MOSSVATReturn': {
        '@_xmlns': 'urn:ec.europa.eu:taxud:vat:moss:v1',
        'Header': {
          'MessageRefId': `MOSS-${vatReturn.companyId}-${Date.now()}`,
          'Timestamp': new Date().toISOString()
        },
        'VATIdentificationNumber': vatReturn.taxId,
        'PeriodKey': vatReturn.period,
        'CurrencyCode': 'EUR',
        
        'VATDeclaration': {
          'SupplierVATIdentificationNumber': vatReturn.taxId,
          'MemberStateOfConsumption': Object.entries(transactionsByCountry).map(([country, data]) => ({
            'CountryCode': country,
            'TaxableAmount': Math.round(data.totalAmount * 100) / 100,
            'VATAmount': Math.round(data.totalVAT * 100) / 100,
            'VATRate': data.transactions[0]?.vatRate || 0
          }))
        },
        
        'TotalVATAmount': Math.round(vatReturn.totalVAT * 100) / 100,
        'TotalTaxableAmount': Math.round(vatReturn.totalSales * 100) / 100
      }
    }

    return this.xmlBuilder.build(mossXML)
  }

  protected parseResponse(response: any): FilingResult {
    const submissionId = response.MOSSVATReturnResponse?.SubmissionReference
    const status = response.MOSSVATReturnResponse?.Status

    if (status === 'ACCEPTED' || status === 'PROCESSED') {
      return {
        success: true,
        submissionId,
        status: 'accepted',
        message: 'MOSS VAT return successfully submitted',
        receiptUrl: `https://ec.europa.eu/taxation_customs/moss/receipt/${submissionId}`
      }
    } else if (status === 'PENDING') {
      return {
        success: true,
        submissionId,
        status: 'pending',
        message: 'MOSS VAT return is being processed',
      }
    } else {
      return {
        success: false,
        status: 'rejected',
        message: 'MOSS rejected the submission',
        errors: response.MOSSVATReturnResponse?.Errors?.Error || ['Unknown error']
      }
    }
  }

  /**
   * MOSS-specific method to validate VAT ID across EU member states
   */
  async validateVATID(vatId: string, countryCode: string): Promise<boolean> {
    try {
      const response = await this.client.get('/check-vat-number', {
        params: {
          countryCode,
          vatNumber: vatId
        }
      })
      return response.data.valid === true
    } catch (error) {
      console.error('VAT ID validation failed:', error)
      return false
    }
  }

  /**
   * Get MOSS registration status
   */
  async getRegistrationStatus(taxId: string): Promise<{
    registered: boolean
    memberState: string
    validFrom: string
  }> {
    try {
      const response = await this.client.get(`/moss-registration/${taxId}`)
      return {
        registered: response.data.registered,
        memberState: response.data.memberState,
        validFrom: response.data.validFrom
      }
    } catch (error) {
      return {
        registered: false,
        memberState: '',
        validFrom: ''
      }
    }
  }
}
