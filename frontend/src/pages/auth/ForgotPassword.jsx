import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  forgotPassword,
} from "../../services/authService.js";


export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setMessage("");


    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }


    try {

      setLoading(true);

      const result =
        await forgotPassword({
          email: email.trim(),
        });


      setMessage(
        result?.message ||
        "OTP has been sent to your email."
      );


      setTimeout(() => {

        navigate(
          `/verify-reset-otp?email=${encodeURIComponent(
            email.trim()
          )}`,
          {
            replace: true,
          }
        );

      }, 1000);


    } catch (err) {

      console.error(
        "Forgot password error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to process your request."
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
              <i className="bi bi-key-fill fs-3"></i>
            </div>

            <h1 className="fw-bold">
              Forgot Password?
            </h1>

            <p className="text-muted">
              Enter your email and we'll send you a verification OTP.
            </p>

          </div>


          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}


          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Email Address
              </label>

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <i className="bi bi-envelope text-primary"></i>
                </span>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />

              </div>

            </div>


            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send OTP
                </>
              )}

            </button>

          </form>


          <div className="text-center mt-4">

            <Link
              to="/login"
              className="text-primary text-decoration-none"
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