import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  verifyResetOtp,
} from "../../services/authService.js";


export default function VerifyResetOtp() {

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

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");


    if (!email.trim()) {
      setError("Please enter your email.");
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

      await verifyResetOtp({
        email: email.trim(),
        otp,
      });


      navigate(
        `/reset-password?email=${encodeURIComponent(
          email.trim()
        )}&otp=${encodeURIComponent(otp)}`,
        {
          replace: true,
        }
      );


    } catch (err) {

      console.error(
        "Verify reset OTP error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid or expired OTP."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="auth-page min-vh-100 d-flex align-items-center justify-content-center bg-light">

      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "20px",
        }}
      >

        <div className="card-body p-4 p-md-5">

          <div className="text-center mb-4">

            <div
              className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: "64px",
                height: "64px",
              }}
            >
              <i className="bi bi-shield-check fs-3"></i>
            </div>

            <h1 className="fw-bold">
              Verify OTP
            </h1>

            <p className="text-muted">
              Enter the OTP sent to your email.
            </p>

          </div>


          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

            </div>


            <div className="mb-4">

              <label className="form-label fw-semibold">
                Verification OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="form-control text-center fs-4 fw-bold"
                placeholder="000000"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, "")
                  )
                }
              />

            </div>


            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Verify OTP
                </>
              )}

            </button>

          </form>


          <div className="text-center mt-4">

            <Link to="/login">
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}