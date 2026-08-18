import nodemailer from 'nodemailer';

// Email configuration - in production, these should be in environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@wedonate-adama.gov.et';

// Create transporter
let transporter: nodemailer.Transporter | null = null;

if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

export class EmailService {
  /**
   * Send OTP email
   */
  static async sendOtpEmail(email: string, otp: string, expiresAt: Date): Promise<void> {
    const minutes = Math.ceil((expiresAt.getTime() - Date.now()) / (60 * 1000));
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">WeDonate Adama</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          <p>You requested to reset your password for your WeDonate Adama account. Use the following One-Time Password (OTP) to proceed:</p>
          
          <div style="background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</span>
          </div>
          
          <p><strong>This OTP will expire in ${minutes} minutes.</strong></p>
          <p>If you did not request this password reset, please ignore this email and your account will remain secure.</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated email from WeDonate Adama. Please do not reply.
          </p>
        </div>
      </body>
      </html>
    `;

    const text = `
      WeDonate Adama - Password Reset
      
      You requested to reset your password for your WeDonate Adama account.
      
      Your OTP code is: ${otp}
      
      This OTP will expire in ${minutes} minutes.
      
      If you did not request this password reset, please ignore this email.
    `;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: EMAIL_FROM,
          to: email,
          subject: 'Password Reset OTP - WeDonate Adama',
          text,
          html,
        });
        console.log(`OTP email sent to ${email}`);
      } catch (error) {
        console.error('Failed to send email:', error);
        // Fallback to console log
        console.log(`OTP for ${email}: ${otp} (expires at ${expiresAt})`);
      }
    } else {
      // Development mode - log to console
      console.log(`[EMAIL SERVICE] OTP for ${email}: ${otp} (expires at ${expiresAt})`);
      console.log(`[EMAIL SERVICE] Email content:`, { subject: 'Password Reset OTP - WeDonate Adama', text, html });
    }
  }

  /**
   * Test email configuration
   */
  static async testConnection(): Promise<boolean> {
    if (!transporter) {
      console.log('Email transporter not configured');
      return false;
    }

    try {
      await transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}
