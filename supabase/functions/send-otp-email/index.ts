import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, name }: EmailRequest = await req.json();
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Mailtrap SMTP configuration
    const MAILTRAP_HOST = 'sandbox.smtp.mailtrap.io';
    const MAILTRAP_PORT = 587;
    const MAILTRAP_USER = Deno.env.get('MAILTRAP_USER');
    const MAILTRAP_PASS = Deno.env.get('MAILTRAP_PASS');

    if (!MAILTRAP_USER || !MAILTRAP_PASS) {
      console.warn('Mailtrap not configured, using console OTP for development');
      console.log(`OTP for ${to}: ${otp}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP generated (check console in development)',
          otp: import.meta.env?.DEV ? otp : undefined
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Email template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - SaveMoney</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; color: #f97316; letter-spacing: 8px; margin: 20px 0; }
          .footer { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0; font-size: 28px;">🛍️ SaveMoney</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Your trusted cashback partner</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name || 'there'}! 👋</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Welcome to SaveMoney! To complete your registration and start earning cashback, please verify your email address using the OTP below:
            </p>
            
            <div class="otp-box">
              <h3 style="color: #374151; margin-top: 0;">Your Verification Code</h3>
              <div class="otp-code">${otp}</div>
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                This code will expire in 10 minutes
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              If you didn't create an account with SaveMoney, please ignore this email.
            </p>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 20px; border-radius: 12px; margin: 30px 0;">
              <h4 style="color: #92400e; margin-top: 0;">🎉 Welcome Bonus Waiting!</h4>
              <p style="color: #92400e; margin-bottom: 0; font-size: 14px;">
                Complete verification to get ₹100 welcome bonus + up to 25% cashback on your first purchase!
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0; font-size: 14px;">
              © 2025 SaveMoney. All rights reserved.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
              Need help? Contact us at support@savemoney.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Mailtrap
    const emailData = {
      from: {
        email: 'noreply@savemoney.com',
        name: 'SaveMoney Team'
      },
      to: [{ email: to, name: name || '' }],
      subject: `${otp} is your SaveMoney verification code`,
      html: emailHTML,
      text: `Hi ${name || 'there'}! Your SaveMoney verification code is: ${otp}. This code will expire in 10 minutes. If you didn't create an account, please ignore this email.`
    };

    const response = await fetch(`https://send.api.mailtrap.io/api/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILTRAP_PASS}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`Mailtrap API error: ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP email sent successfully',
        messageId: await response.json()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error sending OTP email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send OTP email' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});