import { env } from '@/config/env.config';
import { otpEmailTemplates } from '@/constants/otpEmailTemplates';
import { OtpPurpose } from '@/constants/otpPurpose';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const smtpOptions: SMTPTransport.Options = {
  service: env.EMAIL_SERVICE,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(smtpOptions);

export const sendOTPEmail = async (
  to: string,
  otp: string,
  purpose: OtpPurpose,
  name?: string
) => {
  const template = otpEmailTemplates[purpose];

  if (!template) {
    throw new Error(`No email template found for OTP purpose: ${purpose}`);
  }

  const mailOptions = {
    from: `"Event Booking" <${env.EMAIL_FROM}>`,
    to,
    subject: template.subject,
    html: `
      <h2>Hello${name ? ` ${name}` : ''},</h2>

      <h3>${template.title}</h3>

      <p>${template.message}</p>

      <h1 style="letter-spacing: 8px; margin: 20px 0;">${otp}</h1>

      <p>This OTP will expire in <strong>10 minutes</strong>.</p>

      <p style="color: #777;">
        If you didn't request this, please ignore this email.
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
