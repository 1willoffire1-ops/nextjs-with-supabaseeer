import axios, { AxiosInstance } from 'axios'
import { XMLBuilder } from 'fast-xml-parser'

export interface FilingCredentials {
  apiKey?: string
  username?: string
  password?: string
  certificatePath?: string
}

export interface VATReturn {
  companyId: string
  taxId: string
  period: string
  totalSales: number
  totalVAT: number
  deductibleVAT: number
  netVATPayable: number
  transactions: Array<{
    invoiceId: string
    date: string
    amount: number
    vatRate: number
    vatAmount: number
  }>
}

export interface FilingResult {
  success: boolean
  submissionId?: string
  status: 'submitted' | 'accepted' | 'rejected' | 'pending'
  message: string
  errors?: string[]
  receiptUrl?: string
}

export abstract class BaseFilingService {
  protected client: AxiosInstance
  protected xmlBuilder: XMLBuilder

  constructor(baseURL: string, credentials: FilingCredentials) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      }
    })

    this.xmlBuilder = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    })

    this.setupAuth(credentials)
    this.setupRetry()
  }

  protected abstract setupAuth(credentials: FilingCredentials): void
  protected abstract generateXML(vatReturn: VATReturn): string
  protected abstract parseResponse(response: any): FilingResult

  async submitReturn(vatReturn: VATReturn): Promise<FilingResult> {
    try {
      const xml = this.generateXML(vatReturn)
      const response = await this.client.post('/submit', xml)
      return this.parseResponse(response.data)
    } catch (error: any) {
      return {
        success: false,
        status: 'rejected',
        message: error.message || 'Submission failed',
        errors: [error.response?.data || 'Unknown error']
      }
    }
  }

  async checkStatus(submissionId: string): Promise<FilingResult> {
    try {
      const response = await this.client.get(`/status/${submissionId}`)
      return this.parseResponse(response.data)
    } catch (error: any) {
      return {
        success: false,
        status: 'pending',
        message: 'Status check failed',
        errors: [error.message]
      }
    }
  }

  private setupRetry() {
    // Retry logic for network failures
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const config = error.config
        if (!config || !config.retry) {
          config.retry = 0
        }

        config.retry += 1

        if (config.retry <= 3 && error.response?.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, 1000 * config.retry))
          return this.client(config)
        }

        return Promise.reject(error)
      }
    )
  }
}
