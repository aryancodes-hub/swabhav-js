const nodemailer = require("nodemailer");

class MailerService {
  /**
   * Helper to initialize transporter (uses ENV credentials or auto-generates Ethereal test account)
   */
  static async getTransporter() {
    // If SMTP credentials are supplied in .env, use them
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    // Fallback: Auto-generate dynamic Ethereal test credentials (Zero setup!)
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  /**
   * Sends password reset email and outputs browser preview link in terminal
   */
  static async sendPasswordResetEmail(toEmail, resetToken) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"URL Shortener Support" <${process.env.SMTP_FROM || "noreply@urlshortener.com"}>`,
      to: toEmail,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 16px;">Password Reset Request</h2>
          <p style="color: #374151; font-size: 15px;">Hello,</p>
          <p style="color: #374151; font-size: 15px;">We received a request to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">If you did not request a password reset, you can safely ignore this email.</p>
          <p style="color: #6b7280; font-size: 13px;">This link will expire in 15 minutes.</p>
        </div>
      `
    };

    try {
      const transporter = await MailerService.getTransporter();
      const info = await transporter.sendMail(mailOptions);

      // Print direct URL to view the email in your browser!
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n[EMAIL SENT] View email in browser: ${previewUrl}\n`);

      return info;
    } catch (error) {
      console.error("[SMTP ERROR] Failed to send email:", error.message);
    }
  }
}

module.exports = MailerService;