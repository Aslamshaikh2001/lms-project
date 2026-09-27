import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter = null;

if (
  env.smtpHost &&
  env.smtpUser &&
  env.smtpPassword
) {
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: Number(env.smtpPort),
    secure: Number(env.smtpPort) === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPassword,
    },
  });
}

export async function sendOtpEmail({
  email,
  otp,
  purpose,
}) {
  if (!transporter) {
    console.log(
      `[DEV OTP] ${purpose} for ${email}: ${otp}`
    );

    return;
  }

  const subject =
    purpose === "PASSWORD_RESET"
      ? "LMS Password Reset OTP"
      : "LMS Email Verification OTP";

  await transporter.sendMail({
    from: env.smtpFrom || env.smtpUser,
    to: email,
    subject,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
      ">

        <h2>LMS Authentication</h2>

        <p>Your verification code is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 25px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for 10 minutes.
        </p>

        <p>
          If you did not request this code,
          you can safely ignore this email.
        </p>

      </div>
    `,
  });
}