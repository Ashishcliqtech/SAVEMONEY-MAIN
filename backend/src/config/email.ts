import nodemailer from 'nodemailer';

const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@savemoney.com';
const senderName = process.env.BREVO_SENDER_NAME || 'SaveMoney Team';

if (!brevoApiKey) {
  console.warn('⚠️  BREVO_API_KEY not configured. Email functionality will be disabled.');
}

// Create Brevo transporter
export const emailTransporter = nodemailer.createTransporter({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: senderEmail,
    pass: brevoApiKey,
  },
});

// Email templates
export const emailTemplates = {
  // OTP Email Template
  otpEmail: (name: string, otp: string) => ({
    subject: 'Your SaveMoney Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SaveMoney - Verification Code</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 20px; }
          .otp-box { background: #f3f4f6; border: 2px dashed #8b5cf6; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; color: #8b5cf6; letter-spacing: 8px; margin: 10px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ SaveMoney</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0;">Your trusted cashback partner</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name}! 👋</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Welcome to SaveMoney! To complete your account setup, please verify your email address using the code below:
            </p>
            
            <div class="otp-box">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-weight: 600;">Your Verification Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">This code expires in 10 minutes</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Once verified, you'll be able to:
            </p>
            
            <ul style="color: #4b5563; line-height: 1.8; margin-bottom: 30px;">
              <li>🎯 Earn up to 25% cashback on every purchase</li>
              <li>🔥 Access exclusive deals and offers</li>
              <li>💰 Withdraw earnings instantly via UPI</li>
              <li>👥 Refer friends and earn bonus rewards</li>
            </ul>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you didn't request this verification code, please ignore this email or contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 SaveMoney. All rights reserved.</p>
            <p>Need help? Contact us at support@savemoney.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${name}!\n\nYour SaveMoney verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nSaveMoney Team`,
  }),

  // Welcome Email Template
  welcomeEmail: (name: string) => ({
    subject: 'Welcome to SaveMoney! Start Earning Cashback Today 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SaveMoney</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 20px; }
          .feature-box { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ Welcome to SaveMoney!</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0;">Start earning cashback today</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name}! 🎉</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Congratulations! Your SaveMoney account has been successfully created. You're now part of a community of over 2 million users who are saving money on every purchase.
            </p>
            
            <div class="feature-box">
              <h3 style="color: #1f2937; margin-bottom: 15px;">🎁 Your Welcome Bonus: ₹100</h3>
              <p style="color: #4b5563; margin: 0;">Your welcome bonus has been credited to your account. Start shopping to earn even more!</p>
            </div>
            
            <h3 style="color: #1f2937; margin: 30px 0 20px 0;">What's Next?</h3>
            
            <div style="margin-bottom: 30px;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="background: #8b5cf6; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">1</span>
                <span style="color: #4b5563;">Browse 500+ partner stores and exclusive offers</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="background: #14b8a6; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">2</span>
                <span style="color: #4b5563;">Shop through our links and earn up to 25% cashback</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="background: #f97316; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">3</span>
                <span style="color: #4b5563;">Withdraw your earnings via UPI, bank transfer, or vouchers</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/offers" class="button">Start Shopping & Earning</a>
            </div>
            
            <div class="feature-box">
              <h4 style="color: #1f2937; margin-bottom: 10px;">💡 Pro Tip</h4>
              <p style="color: #4b5563; margin: 0;">Refer friends using your unique code and earn ₹100 for each successful referral!</p>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2025 SaveMoney. All rights reserved.</p>
            <p>Need help? Contact us at support@savemoney.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Password Reset Email
  passwordResetEmail: (name: string, resetLink: string) => ({
    subject: 'Reset Your SaveMoney Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your SaveMoney account password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetLink}" class="button">Reset My Password</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              This link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email or contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 SaveMoney. All rights reserved.</p>
            <p>Need help? Contact us at support@savemoney.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Cashback Notification Email
  cashbackNotificationEmail: (name: string, amount: number, storeName: string) => ({
    subject: `🎉 Cashback Earned: ₹${amount} from ${storeName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cashback Earned!</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .cashback-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Cashback Earned!</h1>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Great news, ${name}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Your cashback from ${storeName} has been confirmed and credited to your SaveMoney wallet.
            </p>
            
            <div class="cashback-box">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">Cashback Earned</h3>
              <div style="font-size: 48px; font-weight: bold; margin: 20px 0;">₹${amount}</div>
              <p style="margin: 0; opacity: 0.9;">Added to your wallet</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/wallet" class="button">View My Wallet</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              Keep shopping through SaveMoney to earn more cashback on every purchase!
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 SaveMoney. All rights reserved.</p>
            <p>Need help? Contact us at support@savemoney.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Email service functions
export const emailService = {
  async sendOTP(email: string, name: string, otp: string) {
    if (!brevoApiKey) {
      console.log('📧 Email not configured, OTP would be sent to:', email, 'OTP:', otp);
      return { success: true, messageId: 'mock-id' };
    }

    try {
      const template = emailTemplates.otpEmail(name, otp);
      
      const info = await emailTransporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log('📧 OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error);
      throw new Error('Failed to send verification email');
    }
  },

  async sendWelcomeEmail(email: string, name: string) {
    if (!brevoApiKey) {
      console.log('📧 Welcome email would be sent to:', email);
      return { success: true, messageId: 'mock-id' };
    }

    try {
      const template = emailTemplates.welcomeEmail(name);
      
      const info = await emailTransporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
      });

      console.log('📧 Welcome email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't throw error for welcome email failure
      return { success: false, error: error.message };
    }
  },

  async sendPasswordResetEmail(email: string, name: string, resetLink: string) {
    if (!brevoApiKey) {
      console.log('📧 Password reset email would be sent to:', email);
      return { success: true, messageId: 'mock-id' };
    }

    try {
      const template = emailTemplates.passwordResetEmail(name, resetLink);
      
      const info = await emailTransporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
      });

      console.log('📧 Password reset email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  },

  async sendCashbackNotification(email: string, name: string, amount: number, storeName: string) {
    if (!brevoApiKey) {
      console.log('📧 Cashback notification would be sent to:', email);
      return { success: true, messageId: 'mock-id' };
    }

    try {
      const template = emailTemplates.cashbackNotificationEmail(name, amount, storeName);
      
      const info = await emailTransporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
      });

      console.log('📧 Cashback notification sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send cashback notification:', error);
      // Don't throw error for notification email failure
      return { success: false, error: error.message };
    }
  },
};