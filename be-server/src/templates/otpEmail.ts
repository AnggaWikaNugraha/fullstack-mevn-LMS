// Returns an HTML email string with the OTP code injected
// `purpose` differentiates between account verification and password reset
export const otpEmailTemplate = (name: string, otp: string, purpose: 'verification' | 'reset'): string => {
  const title = purpose === 'verification' ? 'Verify Your Account' : 'Reset Your Password';
  const message =
    purpose === 'verification'
      ? 'Use the code below to verify your account. This code expires in <strong>15 minutes</strong>.'
      : 'Use the code below to reset your password. This code expires in <strong>15 minutes</strong>.';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827;">${title}</h2>
      <p style="color: #374151;">Hi <strong>${name}</strong>,</p>
      <p style="color: #374151;">${message}</p>
      <div style="text-align: center; margin: 32px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #111827;">${otp}</span>
      </div>
      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
};
