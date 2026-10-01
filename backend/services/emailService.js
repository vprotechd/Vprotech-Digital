import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"VProTech Digital" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// ============ EMAIL VERIFICATION ============
export const sendVerificationEmail = async (email, verificationUrl, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; }
        .header h1 { color: #4F46E5; margin: 0; font-size: 28px; }
        .content { padding: 20px 0; }
        .content p { color: #333; font-size: 16px; line-height: 1.6; }
        .btn { display: inline-block; padding: 14px 32px; background: #4F46E5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
        .btn:hover { background: #4338CA; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 VProTech Digital</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for registering with VProTech Digital!</p>
          <p>Please click the button below to verify your email address:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="btn">Verify Email</a>
          </div>
          <p style="font-size: 14px; color: #666;">This link will expire in 24 hours.</p>
          <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 VProTech Digital. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, "Verify Your Email - VProTech Digital", html);
};

// ============ VERIFICATION SUCCESS EMAIL ============
export const sendVerificationSuccessEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
        .header h1 { color: #10b981; margin: 0; font-size: 28px; }
        .content { padding: 20px 0; }
        .content p { color: #333; font-size: 16px; line-height: 1.6; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Email Verified!</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your email has been successfully verified!</p>
          <p>You can now log in to your VProTech Digital account.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; padding: 14px 32px; background: #10b981; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Log In Now</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 VProTech Digital. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, "Email Verified - VProTech Digital", html);
};

// ============ FORGOT PASSWORD ============
export const sendPasswordResetEmail = async (email, resetUrl, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; }
        .header h1 { color: #4F46E5; margin: 0; font-size: 28px; }
        .content { padding: 20px 0; }
        .content p { color: #333; font-size: 16px; line-height: 1.6; }
        .btn { display: inline-block; padding: 14px 32px; background: #4F46E5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
        .btn:hover { background: #4338CA; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 VProTech Digital</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset your password.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #666;">This link will expire in 1 hour.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 VProTech Digital. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, "Reset Your Password - VProTech Digital", html);
};

export const sendPasswordResetConfirmation = async (email, name) => {
  const html = `
    <h1>Password Reset Successful</h1>
    <p>Hello ${name},</p>
    <p>Your password has been reset successfully.</p>
    <a href="${process.env.CLIENT_URL}/login">Login Now</a>
  `;
  return await sendEmail(email, "Password Reset Confirmation - VProTech Digital", html);
};