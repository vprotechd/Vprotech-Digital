import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ============================================
// ENVIRONMENT CHECK
// ============================================

if (!process.env.EMAIL_USER) {
  console.error("❌ EMAIL_USER is missing in .env");
}

if (!process.env.EMAIL_PASSWORD) {
  console.error("❌ EMAIL_PASSWORD is missing in .env");
}

if (!process.env.CLIENT_URL) {
  console.error("❌ CLIENT_URL is missing in .env");
}

// ============================================
// SMTP TRANSPORTER
// ============================================

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

// ============================================
// VERIFY SMTP CONNECTION
// ============================================

transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP connection failed:");
    console.error(error.message);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

// ============================================
// COMMON SEND EMAIL FUNCTION
// ============================================

export const sendEmail = async (to, subject, html) => {
  try {
    if (!to) {
      throw new Error("Recipient email address is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!html) {
      throw new Error("Email HTML content is required");
    }

    const info = await transporter.sendMail({
      from: `"VProTech Digital" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Message ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`❌ Email sending failed to: ${to}`);
    console.error("❌ Error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================
// EMAIL VERIFICATION
// ============================================

export const sendVerificationEmail = async (
  email,
  verificationUrl,
  name
) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Verify Your Email - VProTech Digital</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      text-align: center;
      padding: 30px 20px;
      border-bottom: 2px solid #1769aa;
    }

    .header h1 {
      margin: 0;
      color: #1769aa;
      font-size: 28px;
    }

    .content {
      padding: 35px;
    }

    .content h2 {
      color: #10213d;
      margin-top: 0;
    }

    .content p {
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }

    .button-container {
      text-align: center;
      margin: 30px 0;
    }

    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eeeeee;
      color: #777777;
      font-size: 13px;
    }
  </style>
</head>

<body>

  <div class="wrapper">

    <div class="container">

      <div class="header">
        <h1>VProTech Digital</h1>
      </div>

      <div class="content">

        <h2>Verify Your Email Address</h2>

        <p>
          Hello <strong>${name || "User"}</strong>,
        </p>

        <p>
          Thank you for registering with VProTech Digital!
        </p>

        <p>
          Please verify your email address by clicking the button below.
        </p>

        <div class="button-container">

          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              background-color: #1769aa;
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 30px;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 600;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            Verify Email
          </a>

        </div>

        <p style="font-size: 14px; color: #666666;">
          This verification link will expire in 24 hours.
        </p>

        <p style="font-size: 14px; color: #666666;">
          If you did not create an account with VProTech Digital,
          you can safely ignore this email.
        </p>

      </div>

      <div class="footer">
        <p>
          &copy; ${new Date().getFullYear()} VProTech Digital.
          All rights reserved.
        </p>
      </div>

    </div>

  </div>

</body>
</html>
`;

  return await sendEmail(
    email,
    "Verify Your Email - VProTech Digital",
    html
  );
};

// ============================================
// EMAIL VERIFICATION SUCCESS
// ============================================

export const sendVerificationSuccessEmail = async (
  email,
  name
) => {
  const loginUrl = `${process.env.CLIENT_URL}/login`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Email Verified - VProTech Digital</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      text-align: center;
      padding: 30px 20px;
      border-bottom: 2px solid #10b981;
    }

    .header h1 {
      margin: 0;
      color: #10b981;
      font-size: 28px;
    }

    .content {
      padding: 35px;
    }

    .content p {
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }

    .button-container {
      text-align: center;
      margin: 30px 0;
    }

    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eeeeee;
      color: #777777;
      font-size: 13px;
    }
  </style>
</head>

<body>

  <div class="wrapper">

    <div class="container">

      <div class="header">
        <h1>Email Verified!</h1>
      </div>

      <div class="content">

        <p>
          Hello <strong>${name || "User"}</strong>,
        </p>

        <p>
          Your email address has been successfully verified.
        </p>

        <p>
          Your VProTech Digital account is now active and you can
          log in to your account.
        </p>

        <div class="button-container">

          <a
            href="${loginUrl}"
            style="
              display: inline-block;
              background-color: #10b981;
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            Log In Now
          </a>

        </div>

      </div>

      <div class="footer">
        <p>
          &copy; ${new Date().getFullYear()} VProTech Digital.
          All rights reserved.
        </p>
      </div>

    </div>

  </div>

</body>
</html>
`;

  return await sendEmail(
    email,
    "Email Verified - VProTech Digital",
    html
  );
};

// ============================================
// FORGOT PASSWORD EMAIL
// ============================================

export const sendPasswordResetEmail = async (
  email,
  resetUrl,
  name
) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Reset Your Password - VProTech Digital</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      text-align: center;
      padding: 30px 20px;
      border-bottom: 2px solid #1769aa;
    }

    .header h1 {
      margin: 0;
      color: #1769aa;
      font-size: 28px;
    }

    .content {
      padding: 35px;
    }

    .content h2 {
      color: #10213d;
    }

    .content p {
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }

    .button-container {
      text-align: center;
      margin: 30px 0;
    }

    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eeeeee;
      color: #777777;
      font-size: 13px;
    }
  </style>
</head>

<body>

  <div class="wrapper">

    <div class="container">

      <div class="header">
        <h1>VProTech Digital</h1>
      </div>

      <div class="content">

        <h2>Reset Your Password</h2>

        <p>
          Hello <strong>${name || "User"}</strong>,
        </p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <div class="button-container">

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              background-color: #1769aa;
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            Reset Password
          </a>

        </div>

        <p style="font-size: 14px; color: #666666;">
          This password reset link will expire in 1 hour.
        </p>

        <p style="font-size: 14px; color: #666666;">
          If you did not request a password reset, please ignore this email.
        </p>

      </div>

      <div class="footer">
        <p>
          &copy; ${new Date().getFullYear()} VProTech Digital.
          All rights reserved.
        </p>
      </div>

    </div>

  </div>

</body>
</html>
`;

  return await sendEmail(
    email,
    "Reset Your Password - VProTech Digital",
    html
  );
};

// ============================================
// PASSWORD RESET CONFIRMATION
// ============================================

export const sendPasswordResetConfirmation = async (
  email,
  name
) => {
  const loginUrl = `${process.env.CLIENT_URL}/login`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Password Reset Successful</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      padding: 40px;
      box-sizing: border-box;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      text-align: center;
      border-bottom: 2px solid #10b981;
      padding-bottom: 20px;
    }

    .header h1 {
      color: #10b981;
      margin: 0;
      font-size: 28px;
    }

    .content {
      padding: 25px 0;
    }

    .content p {
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }

    .button-container {
      text-align: center;
      margin: 25px 0;
    }

    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
      color: #777777;
      font-size: 13px;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      <h1>Password Reset Successful</h1>
    </div>

    <div class="content">

      <p>
        Hello <strong>${name || "User"}</strong>,
      </p>

      <p>
        Your VProTech Digital password has been successfully reset.
      </p>

      <p>
        You can now log in using your new password.
      </p>

      <div class="button-container">

        <a
          href="${loginUrl}"
          style="
            display: inline-block;
            background-color: #10b981;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          Log In Now
        </a>

      </div>

    </div>

    <div class="footer">
      <p>
        &copy; ${new Date().getFullYear()} VProTech Digital.
        All rights reserved.
      </p>
    </div>

  </div>

</body>
</html>
`;

  return await sendEmail(
    email,
    "Password Reset Confirmation - VProTech Digital",
    html
  );
};