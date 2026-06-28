import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createError } from '../utils/errors.js';

// ─── Code generation ────────────────────────────────────────────────────────
// Reused from the TaskFlow email service: a 6-digit numeric OTP in the range
// 100000–999999 (never starts with 0) used for the password-reset flow.
export const generateOtpCode = () => crypto.randomInt(100000, 1000000).toString();

// ─── Transporter (lazy, reused) ─────────────────────────────────────────────
let transporter = null;

const getTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw createError(
      'Email service is not configured. Set EMAIL_HOST, EMAIL_USER and EMAIL_PASS in .env and restart the server.',
      500,
    );
  }

  if (!transporter) {
    const port = Number(process.env.EMAIL_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
};

// Build a valid RFC "From" header. If EMAIL_FROM is only a display name, pair it
// with the authenticated address so the mail is less likely to be flagged as spam.
const buildFrom = () => {
  const name = process.env.EMAIL_FROM?.trim();
  const address = process.env.EMAIL_USER;
  if (!name) return address;
  if (name.includes('<') || name.includes('@')) return name;
  return `${name} <${address}>`;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    await getTransporter().sendMail({ from: buildFrom(), to, subject, html });
  } catch (error) {
    // Never log the body (it may contain the code) — only the technical reason.
    console.error('Email send failed:', error.message);
    throw createError('Unable to send email, please try again later.', 500);
  }
};

// ─── Templates ──────────────────────────────────────────────────────────────
const passwordResetCodeHtml = (code, expiresInMinutes) => `
  <div style="background:#f1f5f9;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <h1 style="margin:0 0 24px;text-align:center;color:#1e293b;font-size:22px;">DoanhThu</h1>
      <p style="color:#334155;font-size:15px;line-height:1.6;">
        Sử dụng mã bên dưới để đặt lại mật khẩu của bạn:
      </p>
      <p style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;font-size:32px;letter-spacing:8px;font-weight:bold;color:#4f46e5;background:#eef2ff;padding:12px 24px;border-radius:12px;">
          ${code}
        </span>
      </p>
      <p style="color:#64748b;font-size:14px;line-height:1.6;text-align:center;">
        Mã chỉ có hiệu lực trong <strong>${expiresInMinutes} phút</strong>.
        Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
      </p>
      <p style="margin:32px 0 0;text-align:center;color:#94a3b8;font-size:12px;">
        Email được gửi tự động từ DoanhThu, vui lòng không trả lời email này.
      </p>
    </div>
  </div>
`;

const verificationCodeHtml = (code, expiresInMinutes) => `
  <div style="background:#f1f5f9;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <h1 style="margin:0 0 24px;text-align:center;color:#1e293b;font-size:22px;">DoanhThu</h1>
      <p style="color:#334155;font-size:15px;line-height:1.6;">
        Sử dụng mã bên dưới để xác minh địa chỉ email của bạn:
      </p>
      <p style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;font-size:32px;letter-spacing:8px;font-weight:bold;color:#0f766e;background:#f0fdfa;padding:12px 24px;border-radius:12px;">
          ${code}
        </span>
      </p>
      <p style="color:#64748b;font-size:14px;line-height:1.6;text-align:center;">
        Mã chỉ có hiệu lực trong <strong>${expiresInMinutes} phút</strong>.
        Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
      </p>
      <p style="margin:32px 0 0;text-align:center;color:#94a3b8;font-size:12px;">
        Email được gửi tự động từ DoanhThu, vui lòng không trả lời email này.
      </p>
    </div>
  </div>
`;

// ─── Public API ─────────────────────────────────────────────────────────────
export const sendPasswordResetCode = async ({ to, code, expiresInMinutes }) => {
  await sendEmail({
    to,
    subject: 'Mã đặt lại mật khẩu DoanhThu',
    html: passwordResetCodeHtml(code, expiresInMinutes),
  });
};

export const sendVerificationCode = async ({ to, code, expiresInMinutes }) => {
  await sendEmail({
    to,
    subject: 'Mã xác minh email DoanhThu',
    html: verificationCodeHtml(code, expiresInMinutes),
  });
};
