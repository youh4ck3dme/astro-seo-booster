import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { storage } from './storage';
import { type EmailConfig, type EmailTemplate, type EmailLog, type InsertEmailLog } from '@shared/schema';

// Email service class for sending emails with templates
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  // Initialize email service with configuration from storage
  async initialize(): Promise<void> {
    const config = await storage.getEmailConfig();
    this.config = config || null;
    if (this.config?.enabled && this.config.smtpHost && this.config.smtpUser && this.config.smtpPassword) {
      try {
        this.transporter = nodemailer.createTransport({
          host: this.config.smtpHost,
          port: this.config.smtpPort,
          secure: this.config.smtpPort === 465,
          auth: {
            user: this.config.smtpUser,
            pass: this.config.smtpPassword,
          },
        });

        // Verify connection
        await this.transporter.verify();
        console.log('✅ Email service initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize email service:', error);
        this.transporter = null;
      }
    } else {
      console.log('⚠️  Email service is disabled or missing configuration');
    }
  }

  // Render email template with Handlebars
  private renderTemplate(template: string, data: any): string {
    try {
      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(data);
    } catch (error) {
      console.error('❌ Template rendering error:', error);
      return template; // Fallback to raw template
    }
  }

  // Send email with template
  async sendEmail(
    templateKey: string,
    toEmail: string,
    data: any,
    subjectOverride?: string
  ): Promise<EmailLog> {
    const logEntry: InsertEmailLog = {
      templateKey,
      toEmail,
      subject: subjectOverride || `Email from ${this.config?.fromName}`,
      status: 'pending',
      error: null,
      sentAt: null,
    };

    try {
      const log = await storage.createEmailLog(logEntry);

      // Check if email service is initialized
      if (!this.transporter) {
        await this.initialize();
      }

      if (!this.transporter || !this.config?.enabled) {
        throw new Error('Email service is disabled or not configured');
      }

      // Get template
      const template = await storage.getEmailTemplateByKey(templateKey);
      if (!template || !template.enabled) {
        throw new Error(`Template '${templateKey}' not found or disabled`);
      }

      // Render subject and content
      const subject = subjectOverride || this.renderTemplate(template.subject, data);
      const htmlContent = this.renderTemplate(template.htmlContent, data);
      const textContent = this.renderTemplate(template.textContent, data);

      // Send email
      const info = await this.transporter.sendMail({
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: toEmail,
        subject: subject,
        text: textContent,
        html: htmlContent,
        replyTo: this.config.replyTo,
        bcc: this.config.bcc || undefined,
      });

      // Update log
      const updatedLog = await storage.updateEmailLog(log.id, {
        status: 'sent',
        sentAt: new Date(),
        subject,
      });

      console.log('📧 Email sent successfully:', info.messageId);
      return updatedLog!;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update log with error
      let failedLog: EmailLog;
      if (logEntry.status === 'pending') {
        const log = await storage.createEmailLog(logEntry);
        failedLog = (await storage.updateEmailLog(log.id, {
          status: 'failed',
          error: errorMessage,
        }))!;
      } else {
        failedLog = {
          id: 'temp-' + Date.now(),
          ...logEntry,
          status: 'failed',
          error: errorMessage,
          createdAt: new Date(),
        };
      }

      return failedLog;
    }
  }

  // Send contact form notification
  async sendContactNotification(submission: any): Promise<EmailLog> {
    const data = {
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      apartmentSize: submission.apartmentSize,
      moveDate: submission.moveDate,
      message: submission.message,
      submittedAt: submission.submittedAt || new Date().toLocaleString('sk-SK'),
    };

    return this.sendEmail('contact', this.config?.fromEmail || 'info@viamo.sk', data);
  }

  // Send confirmation email to customer
  async sendConfirmationEmail(submission: any): Promise<EmailLog> {
    const data = {
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      message: submission.message,
    };

    return this.sendEmail('confirmation', submission.email, data);
  }

  // Test email configuration
  async testEmailConfig(toEmail: string): Promise<{ success: boolean; message: string }> {
    try {
      const testData = {
        name: 'Test User',
        email: toEmail,
        message: 'This is a test email to verify your email configuration.',
      };

      const log = await this.sendEmail('confirmation', toEmail, testData, 'Test Email Configuration');
      
      return {
        success: log.status === 'sent',
        message: log.status === 'sent' 
          ? 'Test email sent successfully'
          : `Failed to send test email: ${log.error}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email',
      };
    }
  }

  // Get email sending statistics
  async getStats(): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    last24Hours: number;
  }> {
    const logs = await storage.getAllEmailLogs();
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return {
      total: logs.length,
      sent: logs.filter(log => log.status === 'sent').length,
      failed: logs.filter(log => log.status === 'failed').length,
      pending: logs.filter(log => log.status === 'pending').length,
      last24Hours: logs.filter(log => log.createdAt >= last24Hours).length,
    };
  }
}

// Create a singleton instance
export const emailService = new EmailService();

// Initialize email service on startup
emailService.initialize().catch(console.error);