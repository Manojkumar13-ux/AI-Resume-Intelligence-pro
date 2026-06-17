import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/verify/${token}`;
  await sendEmail(
    email,
    'Verify Your Email',
    `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;border-radius:12px;">
      <h1 style="color:#4f46e5;">🧠 AI Resume Analyzer</h1>
      <p>Click the button to verify your email:</p>
      <a href="${url}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:20px 0;">Verify Email</a>
      <p style="color:#64748b;font-size:14px;">If you didn't sign up, ignore this email.</p>
    </div>`
  );
};

export const sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(
    email,
    'Reset Your Password',
    `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;border-radius:12px;">
      <h1 style="color:#4f46e5;">🔑 Reset Password</h1>
      <p>Click the button to reset your password:</p>
      <a href="${url}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:20px 0;">Reset Password</a>
      <p style="color:#64748b;font-size:14px;">This link expires in 1 hour.</p>
    </div>`
  );
};