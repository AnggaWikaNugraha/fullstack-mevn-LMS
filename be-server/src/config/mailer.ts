import nodemailer from 'nodemailer';

// Create a reusable transporter using SMTP credentials from .env
// Supports Mailtrap (dev) or any SMTP provider (Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
