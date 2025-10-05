import Anthropic from '@anthropic-ai/sdk'

if (!process.env.CLAUDE_API_KEY) {
  throw new Error('🚨 CLAUDE_API_KEY environment variable is required!')
}

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
})

export class ClaudeService {
  // Analyze invoice compliance with AI
  static async analyzeInvoiceCompliance(invoice: any, existingErrors: any[] = []) {
    const prompt = `Analyze this EU VAT invoice for compliance issues:

INVOICE DATA:
${JSON.stringify({
  invoice_id: invoice.invoice_id,
  date: invoice.date,
  customer_country: invoice.customer_country,
  customer_vat_id: invoice.customer_vat_id,
  customer_name: invoice.customer_name,
  net_amount: invoice.net_amount,
  vat_rate_percent: invoice.vat_rate_percent,
  vat_amount: invoice.vat_amount,
  product_type: invoice.product_type
}, null, 2)}

EXISTING DETECTED ISSUES:
${JSON.stringify(existingErrors.map(e => ({
  type: e.error_type,
  severity: e.severity,
  message: e.message,
  penalty_risk: e.penalty_risk_eur
})), null, 2)}

Please provide AI analysis on:
1. Risk assessment accuracy (0.5-1.5 confidence multiplier)
2. Additional compliance insights not detected
3. Priority recommendation for fixing
4. Context about EU VAT regulations
5. Potential cost savings from correction

Respond ONLY with valid JSON:
{
  "confidence_adjustment": number,
  "additional_insights": string,
  "priority_recommendation": "low" | "medium" | "high" | "urgent",
  "regulatory_context": string,
  "estimated_savings": number,
  "recommended_actions": string[]
}`

    try {
      console.log('🧠 Sending invoice to Claude for AI analysis...')
      
      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
      
      const responseText = response.content[0].text
      
      // Clean up response (remove markdown if present)
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      const analysis = JSON.parse(cleanedText)
      
      console.log('✅ Claude AI analysis completed successfully')
      return analysis
      
    } catch (error) {
      console.error('💥 Claude API error:', error)
      
      // Return safe fallback
      return {
        confidence_adjustment: 1.0,
        additional_insights: 'AI analysis temporarily unavailable',
        priority_recommendation: 'medium',
        regulatory_context: 'Standard EU VAT compliance rules apply',
        estimated_savings: 0,
        recommended_actions: ['Manual review recommended']
      }
    }
  }
  
  // Generate compliance suggestions for multiple errors
  static async generateComplianceSuggestions(errors: any[]) {
    const prompt = `Analyze these VAT compliance errors and provide actionable fixing strategy:

ERRORS TO ANALYZE:
${JSON.stringify(errors.map(e => ({
  type: e.error_type,
  severity: e.severity,
  message: e.message,
  penalty_risk: e.penalty_risk_eur,
  auto_fixable: e.auto_fixable
})), null, 2)}

Provide strategic recommendations:
1. Priority order for fixing (highest impact first)
2. Estimated time to fix each category
3. Total potential cost savings
4. Step-by-step instructions for top 3 priorities
5. Prevention strategies

Respond ONLY with valid JSON:
{
  "total_estimated_savings": number,
  "fixing_time_estimate": string,
  "priority_order": [
    {
      "category": string,
      "count": number,
      "estimated_savings": number,
      "time_to_fix": string,
      "instructions": string[]
    }
  ],
  "prevention_tips": string[]
}`

    try {
      console.log('🧠 Getting Claude recommendations for error fixing...')
      
      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
      
      const responseText = response.content[0].text
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      return JSON.parse(cleanedText)
      
    } catch (error) {
      console.error('💥 Claude suggestions error:', error)
      
      // Fallback response
      return {
        total_estimated_savings: errors.reduce((sum, e) => sum + (e.penalty_risk_eur || 0), 0),
        fixing_time_estimate: '30-60 minutes',
        priority_order: errors.sort((a, b) => (b.penalty_risk_eur || 0) - (a.penalty_risk_eur || 0))
          .slice(0, 3)
          .map((e, i) => ({
            category: e.error_type,
            count: 1,
            estimated_savings: e.penalty_risk_eur || 0,
            time_to_fix: '15-30 minutes',
            instructions: ['Review and correct manually']
          })),
        prevention_tips: ['Regular VAT rate validation', 'Automated compliance checks']
      }
    }
  }
  
  // Rate limiting helper
  static async withRateLimit<T>(apiCall: () => Promise<T>, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await apiCall()
      } catch (error: any) {
        if (error.status === 429 && i < retries - 1) {
          // Rate limited, wait and retry
          const waitTime = Math.pow(2, i) * 1000 // Exponential backoff
          console.log(`⏳ Rate limited, waiting ${waitTime}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
        throw error
      }
    }
    throw new Error('Rate limit retries exhausted')
  }
}
337