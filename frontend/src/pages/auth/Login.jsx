import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ======================================================
  // ROLE BASED NAVIGATION
  // ======================================================
  function navigateByRole(user) {
    const role = String(user?.role || "").trim().toUpperCase();

    console.log("Authenticated user:", user);
    console.log("User role:", role);

    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (role === "INSTRUCTOR") {
      navigate("/instructor/dashboard", { replace: true });
      return;
    }

    if (role === "STUDENT") {
      navigate("/student/dashboard", { replace: true });
      return;
    }

    setError(
      "Your account has an invalid role. Please contact the administrator."
    );
  }

  // ======================================================
  // LOGIN SUBMIT
  // ======================================================
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const loggedInUser = await login(
        formData.email.trim(),
        formData.password
      );

      console.log("Login successful:", loggedInUser);
      navigateByRole(loggedInUser);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white py-4 px-3">
      {/* MAIN CONTAINER CARD WITH FULL SHADOW */}
      <div
        className="card border-0 overflow-hidden w-100"
        style={{
          maxWidth: "800px",
          minHeight: "460px",
          borderRadius: "18px",
          boxShadow:
            "0 20px 45px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="row g-0 h-100">
          {/* LEFT SIDE - YELLOW SECTION */}
          <div
            className="col-12 col-md-5 d-flex flex-column align-items-center justify-content-center text-center p-4 text-dark"
            style={{ backgroundColor: "#FFC200" }}
          >
            {/* LARGE SVR LOGO & BRAND NAME */}
            <div className="d-flex align-items-center justify-content-center mb-4">
              <div
                className="me-3"
                style={{ width: "75px", height: "95px" }}
              >
                <svg
                  viewBox="0 0 100 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-100 h-100"
                >
                  <path
                    d="M10 10 H90 V45 H55 L10 85 Z"
                    fill="#1A1A1A"
                  />
                  <path
                    d="M10 95 L55 55 H90 V95 Z"
                    fill="#1A1A1A"
                  />
                </svg>
              </div>

              {/* VERTICAL DIVIDER & BRAND TEXT */}
              <div
                className="ps-3 border-start border-2 border-dark text-start fw-bold lh-sm text-dark"
                style={{ fontSize: "1.2rem" }}
              >
                <div>SVR</div>
                <div>EDTECH</div>
                <div>PVT. LTD</div>
              </div>
            </div>

            {/* PORTAL TITLE & SUBTITLE */}
            <h3 className="fw-bold fs-4 text-dark mb-2">Admin Portal</h3>
            <p
              className="text-dark opacity-75 small mb-0 px-3"
              style={{ fontSize: "0.82rem", lineHeight: "1.3" }}
            >
              Securely manage your platform, users, and administration.
            </p>
          </div>

          {/* RIGHT SIDE - WHITE FORM SECTION */}
          <div
            className="col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-between"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div>
              {/* HEADER */}
              <div className="mb-4">
                <h2 className="fw-bold text-dark fs-3 mb-1">Welcome Back</h2>
                <p
                  className="text-secondary small mb-0"
                  style={{ fontSize: "0.85rem" }}
                >
                  Sign in to your account
                </p>
              </div>

              {/* ERROR ALERT */}
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center py-2 px-3 mb-3 small"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle-fill me-2"></i>
                  <span>{error}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                {/* EMAIL ADDRESS */}
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-0 py-2 text-dark"
                    placeholder="lithinbv97@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={loading}
                    style={{
                      backgroundColor: "#EFEFEF",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small text-secondary fw-medium mb-0">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-secondary text-decoration-none small"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control border-0 py-2 text-dark pe-5"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      disabled={loading}
                      style={{
                        backgroundColor: "#EFEFEF",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-link text-muted position-absolute end-0 top-50 translate-middle-y text-decoration-none pe-3"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      style={{ boxShadow: "none" }}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="btn text-white w-100 py-2 fw-medium mt-3"
                  style={{
                    backgroundColor: "#1F242D",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="text-center my-4 position-relative">
                <hr className="text-muted opacity-25 m-0" />
                <span
                  className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted fw-normal"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  OR CONTINUE WITH
                </span>
              </div>

              {/* OAUTH BUTTONS */}
              <div className="row g-2">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn border text-dark w-100 py-2 d-flex align-items-center justify-content-center bg-white"
                    style={{
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <i className="bi bi-google text-danger me-2"></i>
                    Google
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn border text-dark w-100 py-2 d-flex align-items-center justify-content-center bg-white"
                    style={{
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <i className="bi bi-microsoft text-primary me-2"></i>
                    Microsoft
                  </button>
                </div>
              </div>
            </div>

            {/* SIGN UP REDIRECT & FOOTER COPYRIGHT */}
            <div className="text-center mt-4">
              <p
                className="text-secondary mb-2 small"
                style={{ fontSize: "0.85rem" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="fw-semibold text-decoration-none"
                  style={{ color: "#1F242D" }}
                >
                  Sign Up
                </Link>
              </p>
              <span
                className="text-muted opacity-75"
                style={{ fontSize: "0.75rem" }}
              >
                © 2026 SVR EDTECH. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}