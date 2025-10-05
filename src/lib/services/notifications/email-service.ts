import nodemailer from 'nodemailer'
import { supabaseAdmin } from '@/lib/supabase/server'

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  /**
   * Send critical error alert
   */
  async sendCriticalErrorAlert(
    userEmail: string,
    companyName: string,
    errorCount: number,
    totalRisk: number
  ): Promise<void> {
    const template = this.getCriticalErrorTemplate(companyName, errorCount, totalRisk)
    
    await this.sendEmail(userEmail, template)
    await this.logNotification(userEmail, 'error_alert', template.subject)
  }

  /**
   * Send deadline reminder
   */
  async sendDeadlineReminder(
    userEmail: string,
    companyName: string,
    deadline: Date,
    country: string
  ): Promise<void> {
    const template = this.getDeadlineReminderTemplate(companyName, deadline, country)
    
    await this.sendEmail(userEmail, template)
    await this.logNotification(userEmail, 'deadline_reminder', template.subject)
  }

  /**
   * Send weekly summary
   */
  async sendWeeklySummary(
    userEmail: string,
    companyName: string,
    summary: {
      healthScore: number
      errorsFixed: number
      savingsAchieved: number
      newErrors: number
    }
  ): Promise<void> {
    const template = this.getWeeklySummaryTemplate(companyName, summary)
    
    await this.sendEmail(userEmail, template)
    await this.logNotification(userEmail, 'weekly_summary', template.subject)
  }

  /**
   * Send savings report
   */
  async sendSavingsReport(
    userEmail: string,
    companyName: string,
    period: string,
    savings: {
      totalSaved: number
      errorsFixed: number
      roiPercentage: number
    }
  ): Promise<void> {
    const template = this.getSavingsReportTemplate(companyName, period, savings)
    
    await this.sendEmail(userEmail, template)
    await this.logNotification(userEmail, 'savings_report', template.subject)
  }

  /**
   * Core email sending method
   */
  private async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    await this.transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html
    })
  }

  /**
   * Log notification in database
   */
  private async logNotification(
    userEmail: string,
    type: string,
    title: string
  ): Promise<void> {
    // Get user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, company_id')
      .eq('email', userEmail)
      .single()

    if (!user) return

    await supabaseAdmin
      .from('notifications')
      .insert({
        company_id: user.company_id,
        user_id: user.id,
        type,
        title,
        message: title,
        severity: type === 'error_alert' ? 'critical' : 'info',
        sent_via: ['email'],
        sent_at: new Date().toISOString()
      })
  }

  // Email Templates

  private getCriticalErrorTemplate(
    companyName: string,
    errorCount: number,
    totalRisk: number
  ): EmailTemplate {
    return {
      subject: `🚨 Critical VAT Errors Detected - ${companyName}`,
      text: `
Critical VAT compliance errors have been detected for ${companyName}.

Errors Found: ${errorCount}
Total Penalty Risk: €${totalRisk.toLocaleString()}

Please log in to VATANA to review and fix these errors immediately.

Login: https://vatana.com/login
      `.trim(),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .stats { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .stat-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #fecaca; }
            .stat-label { color: #7f1d1d; }
            .stat-value { font-weight: bold; color: #991b1b; font-size: 18px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <div class=\"header\">
              <h1>🚨 Critical VAT Errors Detected</h1>
            </div>
            <div class=\"content\">
              <p>Hello,</p>
              <p>Critical VAT compliance errors have been detected for <strong>${companyName}</strong>.</p>
              
              <div class=\"stats\">
                <div class=\"stat-item\">
                  <span class=\"stat-label\">Errors Found:</span>
                  <span class=\"stat-value\">${errorCount}</span>
                </div>
                <div class=\"stat-item\" style=\"border-bottom: none;\">
                  <span class=\"stat-label\">Total Penalty Risk:</span>
                  <span class=\"stat-value\">€${totalRisk.toLocaleString()}</span>
                </div>
              </div>

              <p>These errors require immediate attention to avoid penalties from tax authorities.</p>
              
              <a href=\"https://vatana.com/login\" class=\"button\">Review Errors Now</a>

              <p style=\"margin-top: 30px; color: #6b7280; font-size: 14px;\">
                <strong>What to do next:</strong><br>
                1. Log in to your VATANA dashboard<br>
                2. Review the detected errors<br>
                3. Use our auto-fix feature to resolve issues quickly<br>
                4. Export compliance reports if needed
              </p>
            </div>
            <div class=\"footer\">
              This is an automated alert from VATANA - VAT Compliance Platform<br>
              If you have questions, contact support@vatana.com
            </div>
          </div>
        </body>
        </html>
      `
    }
  }

  private getDeadlineReminderTemplate(
    companyName: string,
    deadline: Date,
    country: string
  ): EmailTemplate {
    const daysUntil = Math.ceil(
      (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    return {
      subject: `⏰ VAT Filing Deadline Reminder - ${country} (${daysUntil} days)`,
      text: `
VAT Filing Deadline Reminder for ${companyName}

Country: ${country}
Deadline: ${deadline.toLocaleDateString()}
Days Remaining: ${daysUntil}

Please ensure all invoices are processed and errors are resolved before the deadline.

Login: https://vatana.com/login
      `.trim(),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .deadline-box { background: #fffbeb; border: 2px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .countdown { font-size: 48px; font-weight: bold; color: #f59e0b; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <div class=\"header\">
              <h1>⏰ VAT Filing Deadline Reminder</h1>
            </div>
            <div class=\"content\">
              <p>Hello,</p>
              <p>This is a reminder about an upcoming VAT filing deadline for <strong>${companyName}</strong>.</p>
              
              <div class=\"deadline-box\">
                <div class=\"countdown\">${daysUntil}</div>
                <div style=\"font-size: 18px; color: #92400e;\">days until deadline</div>
                <div style=\"margin-top: 15px; padding-top: 15px; border-top: 1px solid #fbbf24;\">
                  <strong>Country:</strong> ${country}<br>
                  <strong>Deadline:</strong> ${deadline.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              <p>Make sure to complete the following before the deadline:</p>
              <ul>
                <li>Process all pending invoices</li>
                <li>Resolve outstanding errors</li>
                <li>Generate and review compliance reports</li>
                <li>Submit VAT return to authorities</li>
              </ul>
              
              <a href=\"https://vatana.com/login\" class=\"button\">Go to Dashboard</a>
            </div>
            <div class=\"footer\">
              VATANA - VAT Compliance Platform<br>
              Automatic deadline reminders keep you compliant
            </div>
          </div>
        </body>
        </html>
      `
    }
  }

  private getWeeklySummaryTemplate(
    companyName: string,
    summary: {
      healthScore: number
      errorsFixed: number
      savingsAchieved: number
      newErrors: number
    }
  ): EmailTemplate {
    return {
      subject: `📊 Weekly VAT Summary - ${companyName}`,
      text: `
Weekly VAT Compliance Summary for ${companyName}

Health Score: ${summary.healthScore}/100
Errors Fixed This Week: ${summary.errorsFixed}
Savings Achieved: €${summary.savingsAchieved.toLocaleString()}
New Errors Detected: ${summary.newErrors}

Login to view detailed analytics: https://vatana.com/login
      `.trim(),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .metric-card { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; }
            .metric-value { font-size: 32px; font-weight: bold; color: #6366f1; }
            .metric-label { color: #6b7280; font-size: 14px; margin-top: 5px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <div class=\"header\">
              <h1>📊 Your Weekly VAT Summary</h1>
            </div>
            <div class=\"content\">
              <p>Hello,</p>
              <p>Here's your weekly VAT compliance summary for <strong>${companyName}</strong>:</p>
              
              <div class=\"metrics\">
                <div class=\"metric-card\">
                  <div class=\"metric-value\">${summary.healthScore}</div>
                  <div class=\"metric-label\">Health Score</div>
                </div>
                <div class=\"metric-card\">
                  <div class=\"metric-value\">${summary.errorsFixed}</div>
                  <div class=\"metric-label\">Errors Fixed</div>
                </div>
                <div class=\"metric-card\">
                  <div class=\"metric-value\">€${summary.savingsAchieved.toLocaleString()}</div>
                  <div class=\"metric-label\">Savings This Week</div>
                </div>
                <div class=\"metric-card\">
                  <div class=\"metric-value\">${summary.newErrors}</div>
                  <div class=\"metric-label\">New Errors</div>
                </div>
              </div>

              <p>${summary.newErrors > 0 
                ? `You have ${summary.newErrors} new error${summary.newErrors > 1 ? 's' : ''} that need attention.`
                : 'Great job! No new errors this week. Keep it up!'
              }</p>
              
              <a href=\"https://vatana.com/dashboard\" class=\"button\">View Full Dashboard</a>
            </div>
            <div class=\"footer\">
              VATANA - VAT Compliance Platform<br>
              Weekly summaries delivered every Monday
            </div>
          </div>
        </body>
        </html>
      `
    }
  }

  private getSavingsReportTemplate(
    companyName: string,
    period: string,
    savings: {
      totalSaved: number
      errorsFixed: number
      roiPercentage: number
    }
  ): EmailTemplate {
    return {
      subject: `💰 Savings Report - ${period} - ${companyName}`,
      text: `
VAT Compliance Savings Report for ${companyName}
Period: ${period}

Total Savings: €${savings.totalSaved.toLocaleString()}
Errors Fixed: ${savings.errorsFixed}
ROI: ${savings.roiPercentage.toFixed(0)}%

View detailed report: https://vatana.com/reports
      `.trim(),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .savings-hero { background: #ecfdf5; border: 2px solid #10b981; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .amount { font-size: 48px; font-weight: bold; color: #047857; }
            .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-box { background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <div class=\"header\">
              <h1>💰 Your Savings Report</h1>
              <p style=\"margin: 0; opacity: 0.9;\">${period}</p>
            </div>
            <div class=\"content\">
              <p>Hello,</p>
              <p>Here's how much <strong>${companyName}</strong> saved with VATANA this period:</p>
              
              <div class=\"savings-hero\">
                <div style=\"color: #065f46; margin-bottom: 10px;\">Total Savings</div>
                <div class=\"amount\">€${savings.totalSaved.toLocaleString()}</div>
              </div>

              <div class=\"stats\">
                <div class=\"stat-box\">
                  <div style=\"font-size: 24px; font-weight: bold; color: #6366f1;\">${savings.errorsFixed}</div>
                  <div style=\"color: #6b7280; font-size: 14px; margin-top: 5px;\">Errors Fixed</div>
                </div>
                <div class=\"stat-box\">
                  <div style=\"font-size: 24px; font-weight: bold; color: #6366f1;\">${savings.roiPercentage.toFixed(0)}%</div>
                  <div style=\"color: #6b7280; font-size: 14px; margin-top: 5px;\">ROI</div>
                </div>
              </div>

              <p>By using VATANA's automated VAT compliance system, you've:</p>
              <ul>
                <li>Avoided costly penalties and fines</li>
                <li>Saved hours of manual processing time</li>
                <li>Maintained compliance across EU jurisdictions</li>
                <li>Achieved a ${savings.roiPercentage.toFixed(0)}% return on investment</li>
              </ul>
              
              <a href=\"https://vatana.com/reports\" class=\"button\">Download Full Report</a>
            </div>
            <div class=\"footer\">
              VATANA - VAT Compliance Platform<br>
              Helping businesses save money and stay compliant
            </div>
          </div>
        </body>
        </html>
      `
    }
  }
}

export const emailService = new EmailService()