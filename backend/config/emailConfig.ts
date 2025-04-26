import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the email service
transporter.verify((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(":::::::::Gmail service verified :::::::::");
  }
});

// Send email
const sendEmail = async (to: string, subject: string, body: string) => {
  const mailOptions = {
    from: `"PagePlaza" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
  };

  await transporter.sendMail(mailOptions);
};

// Send welcome email
export const sendWelcomeEmail = async (to: string) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  const body = generateEmailTemplate(
    "Welcome to PagePlaza",
    "Thank you for joining PagePlaza. We're excited to have you on board!",
    "Get Started",
    baseUrl,
    "If you have any questions, please contact us at support@pageplaza.com"
  );

  await sendEmail(to, "Welcome to PagePlaza", body);
};

// Send verification email
export const sendVerificationToEmail = async (to: string, token: string) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:8000";
  const verificationUrl = `${baseUrl}verify/${token}`;
  const body = generateEmailTemplate(
    "Verify your PagePlaza account",
    "Click the button below to complete your registration",
    "Verify Email",
    verificationUrl,
    "If you didn't create this account, please ignore this email"
  );

  await sendEmail(to, "Verify your email", body);
};

// Send password reset email
export const sendPasswordResetEmail = async (to: string, token: string) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password/${token}`;
  const body = generateEmailTemplate(
    "Reset your password",
    "We received a request to reset your PagePlaza password",
    "Reset Password",
    resetUrl,
    "If you didn't request this change, please ignore this email"
  );

  await sendEmail(to, "Reset your password", body);
};

// Generate email template
const generateEmailTemplate = (
  title: string,
  description: string,
  buttonText: string,
  buttonUrl: string,
  footerText: string
) => {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" bgcolor="#f0f4f8" style="padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px;">
          <tr>
            <td align="center">
              <h2 style="color: #2c3e50; margin-bottom: 20px; font-family: Arial, sans-serif;">${title}</h2>
              <p style="margin-bottom: 25px; font-family: Arial, sans-serif; color: #4a5568;">${description}</p>
              <a href="${buttonUrl}" target="_blank" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold; display: inline-block; border-radius: 4px;">${buttonText}</a>
              <p style="margin-top: 30px; font-size: 14px; color: #718096; font-family: Arial, sans-serif;">${footerText}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};
