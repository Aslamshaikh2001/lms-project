// import nodemailer from "nodemailer";
// import env from "../config/env.js";

// let transporter = null;

// if (
//   env.smtpHost &&
//   env.smtpUser &&
//   env.smtpPassword
// ) {
//   transporter = nodemailer.createTransport({
//     host: env.smtpHost,
//     port: Number(env.smtpPort),
//     secure: Number(env.smtpPort) === 465,
//     auth: {
//       user: env.smtpUser,
//       pass: env.smtpPassword,
//     },
//   });
// }

// export async function sendOtpEmail({
//   email,
//   otp,
//   purpose,
// }) {
//   if (!transporter) {
//     console.log(
//       `[DEV OTP] ${purpose} for ${email}: ${otp}`
//     );

//     return;
//   }

//   const subject =
//     purpose === "PASSWORD_RESET"
//       ? "LMS Password Reset OTP"
//       : "LMS Email Verification OTP";

//   await transporter.sendMail({
//     from: env.smtpFrom || env.smtpUser,
//     to: email,
//     subject,

//     html: `
//       <div style="
//         font-family: Arial, sans-serif;
//         max-width: 600px;
//         margin: auto;
//         padding: 30px;
//       ">

//         <h2>LMS Authentication</h2>

//         <p>Your verification code is:</p>

//         <div style="
//           font-size: 32px;
//           font-weight: bold;
//           letter-spacing: 8px;
//           margin: 25px 0;
//         ">
//           ${otp}
//         </div>

//         <p>
//           This OTP is valid for 10 minutes.
//         </p>

//         <p>
//           If you did not request this code,
//           you can safely ignore this email.
//         </p>

//       </div>
//     `,
//   });
// }





import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter = null;

// ======================================================
// CREATE SMTP TRANSPORTER
// ======================================================

if (
  env.smtpHost &&
  env.smtpUser &&
  env.smtpPassword
) {
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: Number(env.smtpPort || 587),

    // Port 465 = SSL
    // Port 587 = STARTTLS
    secure: Number(env.smtpPort) === 465,

    auth: {
      user: env.smtpUser,
      pass: env.smtpPassword,
    },

    // Helpful for debugging SMTP connection
    logger: false,
    debug: false,
  });
}

// ======================================================
// VERIFY SMTP CONNECTION
// ======================================================

export async function verifyEmailTransporter() {
  if (!transporter) {
    console.log(
      "⚠️ SMTP transporter is not configured."
    );

    return false;
  }

  try {
    await transporter.verify();

    console.log(
      "✅ SMTP transporter is ready."
    );

    return true;
  } catch (error) {
    console.error(
      "❌ SMTP transporter verification failed."
    );

    console.error(
      "SMTP Error:",
      error.message
    );

    return false;
  }
}

// ======================================================
// SEND OTP EMAIL
// ======================================================

export async function sendOtpEmail({
  email,
  otp,
  purpose,
}) {
  // --------------------------------------------------
  // Validate recipient
  // --------------------------------------------------

  if (!email) {
    throw new Error(
      "Recipient email is required."
    );
  }

  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail =
    String(email)
      .trim()
      .toLowerCase();

  // --------------------------------------------------
  // Development mode
  // --------------------------------------------------

  if (!transporter) {
    console.log(
      "========================================"
    );

    console.log(
      "⚠️ SMTP NOT CONFIGURED"
    );

    console.log(
      `📧 OTP for: ${normalizedEmail}`
    );

    console.log(
      `🔐 OTP: ${otp}`
    );

    console.log(
      "========================================"
    );

    return {
      success: true,
      development: true,
      accepted: [normalizedEmail],
      rejected: [],
    };
  }

  // --------------------------------------------------
  // Subject
  // --------------------------------------------------

  let subject =
    "LMS Email Verification OTP";

  if (
    purpose === "PASSWORD_RESET" ||
    purpose === "FORGOT_PASSWORD"
  ) {
    subject =
      "LMS Password Reset OTP";
  }

  // --------------------------------------------------
  // Send email
  // --------------------------------------------------

  try {
    const info =
      await transporter.sendMail({
        from:
          env.smtpFrom ||
          env.smtpUser,

        to: normalizedEmail,

        subject,

        html: `
          <!DOCTYPE html>

          <html>
            <head>
              <meta charset="UTF-8" />

              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />

              <title>${subject}</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background-color: #f5f7fb;
                font-family: Arial, Helvetica, sans-serif;
              "
            >

              <div
                style="
                  max-width: 600px;
                  margin: 40px auto;
                  background: #ffffff;
                  border-radius: 12px;
                  padding: 35px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                "
              >

                <h2
                  style="
                    margin-top: 0;
                    color: #1f2937;
                  "
                >
                  LMS Authentication
                </h2>

                <p
                  style="
                    color: #4b5563;
                    font-size: 16px;
                  "
                >
                  Your verification code is:
                </p>

                <div
                  style="
                    margin: 30px 0;
                    padding: 18px;
                    background: #f3f4f6;
                    border-radius: 8px;
                    text-align: center;
                  "
                >

                  <span
                    style="
                      font-size: 32px;
                      font-weight: bold;
                      letter-spacing: 8px;
                      color: #111827;
                    "
                  >
                    ${otp}
                  </span>

                </div>

                <p
                  style="
                    color: #4b5563;
                    font-size: 14px;
                  "
                >
                  This OTP is valid for 10 minutes.
                </p>

                <p
                  style="
                    color: #6b7280;
                    font-size: 14px;
                  "
                >
                  If you did not request this code,
                  you can safely ignore this email.
                </p>

              </div>

            </body>
          </html>
        `,
      });

    // --------------------------------------------------
    // IMPORTANT DEBUG INFORMATION
    // --------------------------------------------------

    console.log(
      "========================================"
    );

    console.log(
      "📧 OTP EMAIL SENT"
    );

    console.log(
      "Recipient:",
      normalizedEmail
    );

    console.log(
      "Purpose:",
      purpose
    );

    console.log(
      "Message ID:",
      info.messageId
    );

    console.log(
      "Accepted:",
      info.accepted
    );

    console.log(
      "Rejected:",
      info.rejected
    );

    console.log(
      "Response:",
      info.response
    );

    console.log(
      "========================================"
    );

    // --------------------------------------------------
    // Check SMTP rejection
    // --------------------------------------------------

    if (
      !info.accepted ||
      !info.accepted.includes(normalizedEmail)
    ) {
      throw new Error(
        `SMTP server did not accept email for ${normalizedEmail}.`
      );
    }

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    };

  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "❌ OTP EMAIL FAILED"
    );

    console.error(
      "Recipient:",
      normalizedEmail
    );

    console.error(
      "Purpose:",
      purpose
    );

    console.error(
      "Error:",
      error.message
    );

    console.error(
      "Code:",
      error.code
    );

    console.error(
      "Command:",
      error.command
    );

    console.error(
      "========================================"
    );

    // IMPORTANT:
    // Do not silently hide email errors.
    throw new Error(
      `Unable to send OTP email to ${normalizedEmail}.`
    );
  }
}