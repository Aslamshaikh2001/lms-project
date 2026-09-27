import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  verifyEmailOtp,
  resendVerificationOtp,
} from "../../services/authService.js";

export default function VerifyEmailOtp() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const initialEmail =
    searchParams.get("email") || "";

  const [email, setEmail] =
    useState(initialEmail);

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ======================================================
  // VERIFY OTP
  // ======================================================

  async function handleVerify(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (otp.length !== 6) {
      setError(
        "Please enter a valid 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      await verifyEmailOtp({
        email: email.trim(),
        otp,
      });

      setMessage(
        "Email verified successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }, 1000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  }


  // ======================================================
  // RESEND OTP
  // ======================================================

  async function handleResend() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    try {
      setResendLoading(true);

      await resendVerificationOtp({
        email: email.trim(),
      });

      setMessage(
        "A new OTP has been sent to your email."
      );

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to resend OTP."
      );
    } finally {
      setResendLoading(false);
    }
  }


  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">

      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "20px",
        }}
      >

        <div className="card-body p-4 p-md-5 text-center">

          {/* Icon */}

          <div
            className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
            style={{
              width: "64px",
              height: "64px",
            }}
          >
            <i className="bi bi-envelope-check fs-3"></i>
          </div>


          {/* Heading */}

          <h2 className="fw-bold">
            Verify Your Email
          </h2>

          <p className="text-muted">
            Enter the 6-digit OTP sent to your email.
          </p>


          {/* Error */}

          {error && (
            <div
              className="alert alert-danger text-start"
              role="alert"
            >
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}


          {/* Success */}

          {message && (
            <div
              className="alert alert-success text-start"
              role="alert"
            >
              <i className="bi bi-check-circle me-2"></i>
              {message}
            </div>
          )}


          {/* Form */}

          <form
            onSubmit={handleVerify}
          >

            {/* Email */}

            <div className="text-start mb-3">

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                disabled={loading}
              />

            </div>


            {/* OTP */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Verification OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="form-control text-center fs-4 fw-bold"
                placeholder="000000"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                disabled={loading}
              />

              <small className="text-muted">
                Enter the 6-digit code sent to your email.
              </small>

            </div>


            {/* Verify */}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={
                loading ||
                otp.length !== 6
              }
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>

                  Verifying...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check me-2"></i>
                  Verify Email
                </>
              )}

            </button>

          </form>


          {/* Resend */}

          <button
            type="button"
            className="btn btn-link mt-3"
            onClick={handleResend}
            disabled={
              resendLoading ||
              loading
            }
          >

            {resendLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>

                Sending...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-repeat me-1"></i>
                Resend OTP
              </>
            )}

          </button>


          {/* Back Login */}

          <div className="mt-2">

            <Link
              to="/login"
              className="text-decoration-none"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}