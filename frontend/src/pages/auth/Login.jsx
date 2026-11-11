// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth.js";
// import logo from "../../assets/images/s-logo.png";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle input changes
//   function handleChange(event) {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));

//     if (error) setError("");
//   }

//   // Role-based navigation
//   function navigateByRole(user) {
//     const role = String(user?.role || "").trim().toUpperCase();

//     if (role === "SUPER_ADMIN" || role === "ADMIN") {
//       navigate("/admin/dashboard", { replace: true });
//       return;
//     }

//     if (role === "INSTRUCTOR") {
//       navigate("/instructor/dashboard", { replace: true });
//       return;
//     }

//     if (role === "STUDENT") {
//       navigate("/student/dashboard", { replace: true });
//       return;
//     }

//     setError(
//       "Your account has an invalid role. Please contact the administrator."
//     );
//   }

//   // Login submission
//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     if (!formData.email.trim()) {
//       setError("Please enter your email address.");
//       return;
//     }

//     if (!formData.password) {
//       setError("Please enter your password.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const loggedInUser = await login(
//         formData.email.trim(),
//         formData.password
//       );

//       navigateByRole(loggedInUser);
//     } catch (err) {
//       console.error("Login error:", err);

//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Invalid email or password."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="svr-login-page">
//       <div className="svr-login-shell">
//         {/* LEFT BRAND PANEL */}
//         <section className="svr-brand-panel">
//           <div className="svr-brand-content">
//             <div className="svr-logo-circle">
//               <img
//                 src={logo}
//                 alt="SVR EdTech Pvt. Ltd. Logo"
//                 className="svr-logo-image"
//               />
//             </div>

//             <div className="svr-brand-heading">
//               <h1>
//                 Start Your Learning
//                 <br />
//                 Journey
//               </h1>

//               <p>
//                 Learn new skills, improve your knowledge, and build
//                 your future with SVR EdTech .
//               </p>
//             </div>

//             <div className="svr-brand-footer">
//               Learn. Practice. Grow.
//             </div>
//           </div>
//         </section>

//         {/* RIGHT LOGIN PANEL */}
//         <section className="svr-form-panel">
//           <div className="svr-form-inner">
//             <div className="svr-form-heading">
//               <span className="svr-welcome-label">
//                 WELCOME BACK
//               </span>

//               <h2>Sign in to your account</h2>

//               <p>
//                 Enter your details below to continue learning.
//               </p>
//             </div>

//             {/* ERROR MESSAGE */}
//             {error && (
//               <div className="svr-error-message" role="alert">
//                 <i className="bi bi-exclamation-circle-fill" />
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* LOGIN FORM */}
//             <form onSubmit={handleSubmit}>
//               {/* EMAIL */}
//               <div className="svr-field">
//                 <label htmlFor="login-email">
//                   Email Address
//                 </label>

//                 <div className="svr-input-wrapper">
//                   <i className="bi bi-envelope svr-input-icon" />

//                   <input
//                     id="login-email"
//                     type="email"
//                     name="email"
//                     placeholder="Enter your email address"
//                     value={formData.email}
//                     onChange={handleChange}
//                     autoComplete="email"
//                     disabled={loading}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* PASSWORD */}
//               <div className="svr-field">
//                 <div className="svr-password-label">
//                   <label htmlFor="login-password">
//                     Password
//                   </label>

//                   <Link
//                     to="/forgot-password"
//                     className="svr-forgot-link"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <div className="svr-input-wrapper">
//                   <i className="bi bi-lock svr-input-icon" />

//                   <input
//                     id="login-password"
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     autoComplete="current-password"
//                     disabled={loading}
//                     required
//                   />

//                   <button
//                     type="button"
//                     className="svr-password-toggle"
//                     onClick={() =>
//                       setShowPassword((previous) => !previous)
//                     }
//                     disabled={loading}
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     <i
//                       className={`bi ${
//                         showPassword ? "bi-eye-slash" : "bi-eye"
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>

//               {/* LOGIN BUTTON */}
//               <button
//                 type="submit"
//                 className="svr-login-button"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm"
//                       role="status"
//                       aria-hidden="true"
//                     />
//                     <span>Signing in...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>Login</span>
//                     <i className="bi bi-arrow-right" />
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* REGISTER LINK */}
//             <div className="svr-register-section">
//               <p>
//                 Don't have an account?{" "}
//                 <Link to="/register">Create an account</Link>
//               </p>
//             </div>

//             {/* FOOTER */}
//             <div className="svr-form-bottom">
//               <span className="svr-bottom-line" />
//               <p>
//                 © 2026 SVR EdTech Pvt. Ltd. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* PAGE STYLES */}
//       <style>{`
//         .svr-login-page {
//           min-height: 100vh;
//           min-height: 100dvh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 32px;
//           background: #ffffff;
//           font-family: Inter, "Segoe UI", Arial, sans-serif;
//           box-sizing: border-box;
//         }

//         .svr-login-page *,
//         .svr-login-page *::before,
//         .svr-login-page *::after {
//           box-sizing: border-box;
//         }

//         /* WHITE CARD WITH FULL SHADOW */
//         .svr-login-shell {
//           position: relative;
//           isolation: isolate;
//           width: 100%;
//           max-width: 1050px;
//           min-height: 610px;
//           display: grid;
//           grid-template-columns: 0.95fr 1.05fr;
//           background: #ffffff;
//           border: 1px solid #eeeeee;
//           border-radius: 26px;
//           overflow: hidden;
//           box-shadow:
//             0 0 0 1px rgba(0, 0, 0, 0.025),
//             0 12px 30px rgba(0, 0, 0, 0.08),
//             0 25px 55px rgba(0, 0, 0, 0.12),
//             0 40px 85px rgba(0, 0, 0, 0.07);
//         }

//         /* LEFT YELLOW BRAND PANEL */
//         .svr-brand-panel {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 42px 34px;
//           background: #ffcc42;
//           color: #003744;
//         }

//         .svr-brand-content {
//           width: 100%;
//           max-width: 370px;
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//         }

//         /* CIRCULAR WHITE LOGO BACKGROUND */
//         .svr-logo-circle {
//           width: 260px;
//           height: 260px;
//           max-width: 100%;
//           aspect-ratio: 1 / 1;
//           align-self: center;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//           margin-bottom: 34px;
//           border-radius: 50%;
//           background: #ffffff;
//           box-shadow:
//             0 16px 30px rgba(91, 68, 0, 0.16),
//             0 4px 10px rgba(91, 68, 0, 0.05);
//         }

//         .svr-logo-image {
//           display: block;
//           width: 65%;
//           height: 55%;
//           object-fit: contain;
//         }

//         .svr-brand-heading h1 {
//           margin: 0 0 16px;
//           color: #003744;
//           font-size: clamp(27px, 3vw, 34px);
//           font-weight: 800;
//           line-height: 1.18;
//           letter-spacing: -0.8px;
//         }

//         .svr-brand-heading p {
//           max-width: 330px;
//           margin: 0;
//           color: #23494e;
//           font-size: 14px;
//           line-height: 1.8;
//         }

//         .svr-brand-footer {
//           margin-top: 30px;
//           color: #36575b;
//           font-size: 12px;
//           font-weight: 700;
//           letter-spacing: 1.5px;
//           text-transform: uppercase;
//         }

//         /* RIGHT WHITE LOGIN PANEL */
//         .svr-form-panel {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 48px 50px;
//           background: #ffffff;
//         }

//         .svr-form-inner {
//           width: 100%;
//           max-width: 390px;
//         }

//         .svr-form-heading {
//           margin-bottom: 30px;
//         }

//         .svr-welcome-label {
//           display: inline-block;
//           margin-bottom: 12px;
//           color: #a87900;
//           font-size: 11px;
//           font-weight: 800;
//           letter-spacing: 2px;
//         }

//         .svr-form-heading h2 {
//           margin: 0 0 10px;
//           color: #102b33;
//           font-size: 29px;
//           font-weight: 800;
//           line-height: 1.3;
//           letter-spacing: -0.6px;
//         }

//         .svr-form-heading p {
//           margin: 0;
//           color: #7a8589;
//           font-size: 13px;
//           line-height: 1.7;
//         }

//         /* ERROR MESSAGE */
//         .svr-error-message {
//           display: flex;
//           align-items: flex-start;
//           gap: 10px;
//           margin-bottom: 22px;
//           padding: 12px 14px;
//           border: 1px solid #fecaca;
//           border-radius: 10px;
//           background: #fff1f2;
//           color: #b42318;
//           font-size: 13px;
//           line-height: 1.5;
//           overflow-wrap: anywhere;
//         }

//         .svr-error-message i {
//           margin-top: 2px;
//           flex-shrink: 0;
//         }

//         /* INPUT FIELDS */
//         .svr-field {
//           margin-bottom: 23px;
//         }

//         .svr-field label {
//           display: block;
//           margin-bottom: 9px;
//           color: #273b40;
//           font-size: 13px;
//           font-weight: 700;
//         }

//         .svr-password-label {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 12px;
//         }

//         .svr-password-label label {
//           margin-bottom: 9px;
//         }

//         .svr-forgot-link {
//           margin-bottom: 9px;
//           color: #8a680a;
//           font-size: 12px;
//           font-weight: 600;
//           text-decoration: none;
//         }

//         .svr-forgot-link:hover {
//           color: #003744;
//           text-decoration: underline;
//         }

//         .svr-input-wrapper {
//           position: relative;
//           display: flex;
//           align-items: center;
//           width: 100%;
//           min-height: 51px;
//           border: 1px solid #e6e9e9;
//           border-radius: 11px;
//           background: #f7f8f8;
//           transition:
//             border-color 0.2s ease,
//             box-shadow 0.2s ease,
//             background 0.2s ease;
//         }

//         .svr-input-wrapper:focus-within {
//           border-color: #d6a91f;
//           background: #ffffff;
//           box-shadow: 0 0 0 3px rgba(255, 204, 66, 0.22);
//         }

//         .svr-input-icon {
//           flex-shrink: 0;
//           margin-left: 15px;
//           color: #849195;
//           font-size: 17px;
//         }

//         .svr-input-wrapper input {
//           width: 100%;
//           min-width: 0;
//           height: 49px;
//           padding: 0 13px;
//           border: none;
//           outline: none;
//           background: transparent;
//           color: #20383e;
//           font-family: inherit;
//           font-size: 13px;
//         }

//         .svr-input-wrapper input::placeholder {
//           color: #a3abad;
//           opacity: 1;
//         }

//         .svr-input-wrapper input:disabled {
//           cursor: not-allowed;
//           opacity: 0.7;
//         }

//         /* SHOW/HIDE PASSWORD */
//         .svr-password-toggle {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//           width: 42px;
//           height: 46px;
//           padding: 0;
//           border: none;
//           background: transparent;
//           color: #77878b;
//           cursor: pointer;
//           font-size: 17px;
//         }

//         .svr-password-toggle:disabled {
//           cursor: not-allowed;
//           opacity: 0.6;
//         }

//         /* LOGIN BUTTON */
//         .svr-login-button {
//           width: 100%;
//           min-height: 51px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 12px;
//           margin-top: 7px;
//           padding: 12px 18px;
//           border: none;
//           border-radius: 11px;
//           background: #003744;
//           color: #ffffff;
//           font-family: inherit;
//           font-size: 14px;
//           font-weight: 700;
//           cursor: pointer;
//           transition:
//             background 0.2s ease,
//             transform 0.2s ease,
//             box-shadow 0.2s ease;
//         }

//         .svr-login-button:hover:not(:disabled) {
//           background: #07505c;
//           transform: translateY(-1px);
//           box-shadow: 0 8px 18px rgba(0, 55, 68, 0.18);
//         }

//         .svr-login-button:disabled {
//           cursor: not-allowed;
//           opacity: 0.75;
//         }

//         /* REGISTER LINK */
//         .svr-register-section {
//           margin-top: 25px;
//           text-align: center;
//         }

//         .svr-register-section p {
//           margin: 0;
//           color: #7b8588;
//           font-size: 12px;
//           line-height: 1.8;
//         }

//         .svr-register-section a {
//           color: #003744;
//           font-weight: 800;
//           text-decoration: none;
//         }

//         .svr-register-section a:hover {
//           color: #a87900;
//           text-decoration: underline;
//         }

//         /* FOOTER */
//         .svr-form-bottom {
//           margin-top: 35px;
//           text-align: center;
//         }

//         .svr-bottom-line {
//           display: block;
//           width: 48px;
//           height: 3px;
//           margin: 0 auto 17px;
//           border-radius: 10px;
//           background: #ffcc42;
//         }

//         .svr-form-bottom p {
//           margin: 0;
//           color: #9aa2a4;
//           font-size: 10px;
//           line-height: 1.7;
//         }

//         /* TABLET */
//         @media (max-width: 850px) {
//           .svr-login-page {
//             padding: 24px;
//           }

//           .svr-login-shell {
//             max-width: 720px;
//             grid-template-columns: 0.9fr 1.1fr;
//           }

//           .svr-brand-panel {
//             padding: 34px 24px;
//           }

//           .svr-logo-circle {
//             width: 210px;
//             height: 210px;
//             margin-bottom: 28px;
//           }

//           .svr-brand-heading h1 {
//             font-size: 28px;
//           }

//           .svr-form-panel {
//             padding: 40px 30px;
//           }

//           .svr-form-heading h2 {
//             font-size: 25px;
//           }
//         }

//         /* MOBILE */
//         @media (max-width: 600px) {
//           .svr-login-page {
//             display: flex;
//             align-items: flex-start;
//             justify-content: center;
//             min-height: 100vh;
//             min-height: 100dvh;
//             padding: 20px;
//             background: #ffffff;
//           }

//           .svr-login-shell {
//             display: flex;
//             flex-direction: column;
//             width: 100%;
//             max-width: 440px;
//             min-height: auto;
//             border: 1px solid #eeeeee;
//             border-radius: 22px;
//             overflow: hidden;
//             background: #ffffff;

//             /* Keep full shadow on mobile */
//             box-shadow:
//               0 0 0 1px rgba(0, 0, 0, 0.025),
//               0 12px 30px rgba(0, 0, 0, 0.08),
//               0 25px 55px rgba(0, 0, 0, 0.12);
//           }

//           .svr-brand-panel {
//             display: block;
//             padding: 30px 25px 28px;
//           }

//           .svr-brand-content {
//             max-width: 430px;
//             margin: 0 auto;
//           }

//           .svr-logo-circle {
//             width: 220px;
//             height: 220px;
//             margin: 0 auto 30px;
//           }

//           .svr-logo-image {
//             width: 65%;
//             height: 55%;
//           }

//           .svr-brand-heading h1 {
//             margin-bottom: 12px;
//             font-size: clamp(28px, 7vw, 34px);
//             line-height: 1.15;
//           }

//           .svr-brand-heading p {
//             font-size: 13px;
//           }

//           .svr-brand-footer {
//             margin-top: 18px;
//             font-size: 10px;
//           }

//           .svr-form-panel {
//             flex: 1;
//             align-items: flex-start;
//             padding: 30px 25px 28px;
//             border-radius: 0;
//             background: #ffffff;
//           }

//           .svr-form-inner {
//             max-width: 430px;
//             margin: 0 auto;
//           }

//           .svr-form-heading {
//             margin-bottom: 25px;
//           }

//           .svr-form-heading h2 {
//             font-size: 26px;
//           }

//           .svr-form-bottom {
//             margin-top: 30px;
//           }
//         }

//         /* SMALL MOBILE */
//         @media (max-width: 360px) {
//           .svr-login-page {
//             padding: 12px;
//           }

//           .svr-brand-panel {
//             padding: 25px 20px;
//           }

//           .svr-logo-circle {
//             width: 185px;
//             height: 185px;
//             margin-bottom: 25px;
//           }

//           .svr-brand-heading h1 {
//             font-size: 27px;
//           }

//           .svr-form-panel {
//             padding: 27px 20px 24px;
//           }

//           .svr-password-label {
//             align-items: flex-start;
//           }

//           .svr-forgot-link {
//             font-size: 11px;
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .svr-login-button,
//           .svr-input-wrapper {
//             transition: none;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import logo from "../../assets/images/s-logo.png";

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
          maxWidth: "840px",
          minHeight: "500px",
          borderRadius: "18px",
          boxShadow:
            "0 20px 45px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="row g-0 h-100">
          {/* LEFT SIDE - YELLOW SECTION */}
          <div
            className="col-12 col-md-5 d-flex flex-column align-items-center justify-content-center text-center p-4 text-dark"
            style={{ backgroundColor: "#FECA42" }}
          >
            {/* ENLARGED CIRCULAR LOGO BADGE */}
            <div
              className="d-flex align-items-center justify-content-center bg-white rounded-circle mb-3"
              style={{
                width: "200px",
                height: "200px",
                padding: "20px",
                boxShadow: "0 10px 28px rgba(0, 47, 60, 0.18)",
              }}
            >
              <img
                src={logo}
                alt="SVR EDTECH Logo"
                className="img-fluid"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* UNIFIED LMS TITLE & SUBTITLE */}
            <h3 className="fw-bold fs-4 text-dark mb-2">Login Portal</h3>
            <p
              className="text-dark opacity-75 small mb-0 px-3"
              style={{ fontSize: "0.85rem", lineHeight: "1.4" }}
            >
              Access your learning dashboard, courses, and resources.
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
                  Sign in to continue to your account
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
                    placeholder="name@example.com"
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
              {/* <div className="row g-2">
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
              </div> */}
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