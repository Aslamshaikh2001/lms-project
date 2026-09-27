import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  resetPassword,
} from "../../services/authService.js";


export default function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const email =
    searchParams.get("email") || "";


  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setMessage("");


    if (!email) {
      setError(
        "Email information is missing."
      );
      return;
    }


    if (newPassword.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }


    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }


    try {

      setLoading(true);

      const result =
        await resetPassword({
          email,
          newPassword,
        });


      setMessage(
        result?.message ||
        "Password reset successfully."
      );


      setTimeout(() => {

        navigate(
          "/login",
          {
            replace: true,
          }
        );

      }, 1200);


    } catch (err) {

      console.error(
        "Reset password error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to reset password."
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
              <i className="bi bi-lock-fill fs-3"></i>
            </div>

            <h1 className="fw-bold">
              Reset Password
            </h1>

            <p className="text-muted">
              Create your new password.
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

            <div className="mb-3">

              <label className="form-label fw-semibold">
                New Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
              />

            </div>


            <div className="mb-4">

              <label className="form-label fw-semibold">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
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
                  Resetting...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Reset Password
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