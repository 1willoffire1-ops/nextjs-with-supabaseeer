import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { FileProcessor } from '@/lib/processors/file-processor'
import { supabaseAdmin } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['text/csv', 'application/vnd.ms-excel']

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      console.log('📁 Upload request received')
      
      const formData = await req.formData()
      const file = formData.get('file') as File
      const period = formData.get('period') as string
      
      // Validate file
      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: 'No valid file provided' },
          { status: 400 }
        )
      }
      
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        )
      }
      
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.csv')) {
        return NextResponse.json(
          { error: 'Invalid file type. Please upload CSV files only.' },
          { status: 400 }
        )
      }
      
      console.log(`📊 Processing file: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`)
      
      // Create upload record
      const { data: upload, error: uploadError } = await supabaseAdmin
        .from('uploads')
        .insert({
          user_id: req.user.id,
          filename: file.name,
          file_type: file.type || 'text/csv',
          file_size: file.size,
          period: period || new Date().toISOString().slice(0, 7),
          processing_status: 'pending'
        })
        .select()
        .single()
      
      if (uploadError) {
        console.error('💥 Upload creation error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to create upload record' },
          { status: 500 }
        )
      }
      
      console.log(`✅ Upload record created: ${upload.id}`)
      
      // Process file asynchronously
      setImmediate(async () => {
        try {
          await FileProcessor.processFile(file, req.user.id, upload.id)
          console.log(`🎉 File processing completed successfully: ${upload.id}`)
        } catch (error) {
          console.error('💥 Background processing error:', error)
        }
      })
      
      return NextResponse.json({
        success: true,
        upload_id: upload.id,
        filename: file.name,
        message: 'File upload started. Processing in background...',
        status: 'processing'
      })
      
    } catch (error) {
      console.error('💥 Upload endpoint error:', error)
      return NextResponse.json(
        { error: 'Failed to process upload' },
        { status: 500 }
      )
    }
  })
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url)
      const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))
      
      const { data: uploads, error } = await supabaseAdmin
        .from('uploads')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      
      return NextResponse.json({ uploads: uploads || [] })
      
    } catch (error) {
      console.error('💥 Uploads fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch uploads' },
        { status: 500 }
      )
    }
  })
}