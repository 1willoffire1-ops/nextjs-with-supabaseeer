import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/server'

// EU VAT number format patterns
const VAT_PATTERNS: Record<string, RegExp> = {
  AT: /^ATU\d{8}$/,
  BE: /^BE0?\d{9,10}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-Z0-9]{2}\d{9}$/,
  GB: /^GB(\d{9}|\d{12}|GD\d{3}|HA\d{3})$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE\d[A-Z0-9+*]\d{5}[A-Z]$/,
  IT: /^IT\d{11}$/,
  LT: /^LT(\d{9}|\d{12})$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/,
}

// Validate VAT number format
function validateVatFormat(countryCode: string, vatNumber: string): boolean {
  const cleanVatNumber = vatNumber.replace(/\s/g, '').toUpperCase()
  const pattern = VAT_PATTERNS[countryCode.toUpperCase()]
  
  if (!pattern) {
    return false
  }
  
  return pattern.test(cleanVatNumber)
}

// Validate VAT via VIES (EU VAT Information Exchange System)
async function validateViaVIES(countryCode: string, vatNumber: string) {
  const cleanVatNumber = vatNumber.replace(/\s/g, '').replace(countryCode.toUpperCase(), '')
  
  try {
    // VIES SOAP API endpoint
    const viesUrl = 'https://ec.europa.eu/taxation_customs/vies/services/checkVatService'
    
    const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:checkVat>
      <urn:countryCode>${countryCode.toUpperCase()}</urn:countryCode>
      <urn:vatNumber>${cleanVatNumber}</urn:vatNumber>
    </urn:checkVat>
  </soapenv:Body>
</soapenv:Envelope>`

    const response = await fetch(viesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'checkVat',
      },
      body: soapRequest,
    })

    if (!response.ok) {
      throw new Error(`VIES API error: ${response.status}`)
    }

    const xmlText = await response.text()
    
    // Parse XML response
    const isValid = xmlText.includes('<valid>true</valid>')
    const nameMatch = xmlText.match(/<name>(.*?)<\/name>/)
    const addressMatch = xmlText.match(/<address>(.*?)<\/address>/)
    const requestDateMatch = xmlText.match(/<requestDate>(.*?)<\/requestDate>/)
    
    return {
      isValid,
      companyName: nameMatch ? nameMatch[1] : null,
      address: addressMatch ? addressMatch[1].replace(/\n/g, ', ') : null,
      consultationNumber: requestDateMatch ? requestDateMatch[1] : null,
      source: 'VIES',
      errorMessage: isValid ? null : 'VAT number not found in VIES database',
    }
  } catch (error) {
    console.error('VIES validation error:', error)
    return {
      isValid: false,
      companyName: null,
      address: null,
      consultationNumber: null,
      source: 'VIES',
      errorMessage: error instanceof Error ? error.message : 'VIES service unavailable',
    }
  }
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json()
      const { vatNumber, countryCode } = body

      if (!vatNumber || !countryCode) {
        return NextResponse.json(
          { error: 'VAT number and country code are required' },
          { status: 400 }
        )
      }

      // Validate format first
      const isFormatValid = validateVatFormat(countryCode, vatNumber)
      
      if (!isFormatValid) {
        return NextResponse.json(
          { 
            error: 'Invalid VAT number format for the selected country',
            isValid: false,
          },
          { status: 400 }
        )
      }

      // Validate via VIES for EU countries
      const validationResult = await validateViaVIES(countryCode, vatNumber)

      // Save validation result to database
      const { data: validation, error: dbError } = await supabaseAdmin
        .from('vat_validations')
        .insert({
          user_id: req.user.id,
          vat_number: vatNumber,
          country_code: countryCode,
          company_name: validationResult.companyName,
          address: validationResult.address,
          is_valid: validationResult.isValid,
          validation_source: validationResult.source,
          consultation_number: validationResult.consultationNumber,
          error_message: validationResult.errorMessage,
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error saving validation:', dbError)
        // Don't fail the request, just log the error
      }

      return NextResponse.json({
        success: true,
        validation: {
          vatNumber,
          countryCode,
          isValid: validationResult.isValid,
          companyName: validationResult.companyName,
          address: validationResult.address,
          consultationNumber: validationResult.consultationNumber,
          validatedAt: new Date().toISOString(),
          source: validationResult.source,
        },
        errorMessage: validationResult.errorMessage,
      })

    } catch (error) {
      console.error('VAT validation error:', error)
      return NextResponse.json(
        { error: 'Failed to validate VAT number' },
        { status: 500 }
      )
    }
  })
}

// Get validation history
export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url)
      const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))

      const { data: validations, error } = await supabaseAdmin
        .from('vat_validations')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return NextResponse.json({ 
        validations: validations || [],
        count: validations?.length || 0,
      })

    } catch (error) {
      console.error('Failed to fetch validation history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch validation history' },
        { status: 500 }
      )
    }
  })
}
