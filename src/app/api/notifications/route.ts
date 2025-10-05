import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/services/notifications/email-service'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

// Get user notifications
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: notifications } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json(notifications || [])
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId } = await request.json()

    await supabaseAdmin
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

// Send test email
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data: emailData } = await request.json()

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('email, company_name')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Send appropriate email based on type
    switch (type) {
      case 'critical_error':
        await emailService.sendCriticalErrorAlert(
          userData.email,
          userData.company_name,
          emailData.errorCount,
          emailData.totalRisk
        )
        break
      
      case 'deadline_reminder':
        await emailService.sendDeadlineReminder(
          userData.email,
          userData.company_name,
          new Date(emailData.deadline),
          emailData.country
        )
        break
      
      case 'weekly_summary':
        await emailService.sendWeeklySummary(
          userData.email,
          userData.company_name,
          emailData
        )
        break
      
      case 'savings_report':
        await emailService.sendSavingsReport(
          userData.email,
          userData.company_name,
          emailData.period,
          emailData
        )
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
