import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,  // Gmail App Password, not account password
  },
});

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
  await transporter.sendMail({
    from: `"LMS App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
