
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import { registerUser } from "../../services/authService.js";

// export default function Register() {
//   const navigate = useNavigate();

//   // ======================================================
//   // INDIAN STATES + UNION TERRITORIES
//   // ======================================================

//   const INDIAN_STATES = [
//     "Andhra Pradesh",
//     "Arunachal Pradesh",
//     "Assam",
//     "Bihar",
//     "Chhattisgarh",
//     "Goa",
//     "Gujarat",
//     "Haryana",
//     "Himachal Pradesh",
//     "Jharkhand",
//     "Karnataka",
//     "Kerala",
//     "Madhya Pradesh",
//     "Maharashtra",
//     "Manipur",
//     "Meghalaya",
//     "Mizoram",
//     "Nagaland",
//     "Odisha",
//     "Punjab",
//     "Rajasthan",
//     "Sikkim",
//     "Tamil Nadu",
//     "Telangana",
//     "Tripura",
//     "Uttar Pradesh",
//     "Uttarakhand",
//     "West Bengal",

//     // Union Territories
//     "Andaman and Nicobar Islands",
//     "Chandigarh",
//     "Dadra and Nagar Haveli and Daman and Diu",
//     "Delhi",
//     "Jammu and Kashmir",
//     "Ladakh",
//     "Lakshadweep",
//     "Puducherry",
//   ];

//   // ======================================================
//   // FORM STATE
//   // ======================================================

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",

//     address: {
//       street: "",
//       city: "",
//       state: "",
//       country: "",
//       postalCode: "",
//     },
 
//     role: "",

//     password: "",
//     confirmPassword: "",
//   });

//   // ======================================================
//   // UI STATE
//   // ======================================================

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // ======================================================
//   // HANDLE NORMAL INPUT CHANGE
//   // ======================================================

//   function handleChange(event) {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));

//     if (error) {
//       setError("");
//     }
//   }

//   // ======================================================
//   // HANDLE ADDRESS CHANGE
//   // ======================================================

//   function handleAddressChange(event) {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,

//       address: {
//         ...previous.address,
//         [name]: value,
//       },
//     }));

//     if (error) {
//       setError("");
//     }
//   }

//   // ======================================================
//   // VALIDATE FORM
//   // ======================================================

//   function validateForm() {
//     // --------------------------------------------------
//     // Name
//     // --------------------------------------------------

//     if (!formData.name.trim()) {
//       return "Please enter your full name.";
//     }

//     if (formData.name.trim().length < 2) {
//       return "Name must contain at least 2 characters.";
//     }

//     // --------------------------------------------------
//     // Email
//     // --------------------------------------------------

//     if (!formData.email.trim()) {
//       return "Please enter your email address.";
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(formData.email.trim())) {
//       return "Please enter a valid email address.";
//     }

//     // --------------------------------------------------
//     // Phone
//     // --------------------------------------------------

//     if (!formData.phone.trim()) {
//       return "Please enter your phone number.";
//     }

//     const phoneRegex = /^[0-9+\-\s()]+$/;

//     if (!phoneRegex.test(formData.phone.trim())) {
//       return "Please enter a valid phone number.";
//     }

//     if (
//       formData.phone.trim().length < 10 ||
//       formData.phone.trim().length > 15
//     ) {
//       return "Phone number must be between 10 and 15 characters.";
//     }

//     // --------------------------------------------------
//     // Role
//     // --------------------------------------------------

//     if (!formData.role) {
//       return "Please select a role.";
//     }

//     // --------------------------------------------------
//     // Password
//     // --------------------------------------------------

//     if (formData.password.length < 8) {
//       return "Password must contain at least 8 characters.";
//     }

//     // --------------------------------------------------
//     // Confirm Password
//     // --------------------------------------------------

//     if (formData.password !== formData.confirmPassword) {
//       return "Passwords do not match.";
//     }

//     return null;
//   }

//   // ======================================================
//   // HANDLE SUBMIT
//   // ======================================================

//   async function handleSubmit(event) {
//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     // --------------------------------------------------
//     // Validate
//     // --------------------------------------------------

//     const validationError = validateForm();

//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     // --------------------------------------------------
//     // Register
//     // --------------------------------------------------

//     try {
//       setLoading(true);

//       const result = await registerUser({
//         name: formData.name.trim(),

//         email: formData.email.trim(),

//         phone: formData.phone.trim(),

//         address: {
//           street: formData.address.street.trim(),
//           city: formData.address.city.trim(),
//           state: formData.address.state.trim(),
//           country: formData.address.country.trim(),
//           postalCode: formData.address.postalCode.trim(),
//         },

//         role: formData.role,

//         password: formData.password,
//       });

//       // ------------------------------------------------
//       // Success
//       // ------------------------------------------------

//       setSuccess(
//         result?.message ||
//           "Registration successful. Please verify your email."
//       );

//       // ------------------------------------------------
//       // Navigate to email verification
//       // ------------------------------------------------

//       setTimeout(() => {
//         navigate(
//           `/verify-email?email=${encodeURIComponent(
//             formData.email.trim()
//           )}`,
//           {
//             replace: true,
//           }
//         );
//       }, 800);
//     } catch (err) {
//       console.error("Registration error:", err);

//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Unable to create account."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ======================================================
//   // RENDER
//   // ======================================================

//   return (
//     <div
//       className="register-page min-vh-100 d-flex align-items-center justify-content-center py-5 px-3"
//       style={{
//         background:
//           "linear-gradient(135deg, #eef4ff 0%, #f8f9ff 45%, #ffffff 100%)",
//       }}
//     >
//       {/* ==================================================
//           BACKGROUND DECORATIONS
//           ================================================== */}

//       <div className="register-bg-circle register-bg-circle-one" />

//       <div className="register-bg-circle register-bg-circle-two" />

//       {/* ==================================================
//           MAIN CARD
//           ================================================== */}

//       <div className="register-card bg-white shadow-lg">
//         <div className="row g-0">

//           {/* ==================================================
//               LEFT SIDE
//               ================================================== */}

//           <div className="col-lg-5 d-none d-lg-flex">
//             <div className="register-left-panel text-white w-100 d-flex flex-column justify-content-center">

//               <div className="px-5 py-5">

//                 {/* Logo */}

//                 {/* 
//                 <div className="register-logo mb-4">
//                   <i className="bi bi-mortarboard-fill"></i>
//                 </div>
//                 */}

//                 <h2 className="fw-bold mb-3">
//                   Start Your Learning Journey
//                 </h2>

//                 <p className="mb-4 register-description">
//                   Create your LMS account and get access to courses,
//                   assessments, learning resources, and more.
//                 </p>

//                 {/* Features */}

//                 <div className="register-features">

//                   <div className="register-feature">
//                     <div className="feature-icon">
//                       <i className="bi bi-book"></i>
//                     </div>

//                     <div>
//                       <h6 className="mb-1 fw-semibold">
//                         Learn at Your Pace
//                       </h6>

//                       <small>
//                         Access your learning content anytime.
//                       </small>
//                     </div>
//                   </div>

//                   <div className="register-feature">
//                     <div className="feature-icon">
//                       <i className="bi bi-clipboard-check"></i>
//                     </div>

//                     <div>
//                       <h6 className="mb-1 fw-semibold">
//                         Take Assessments
//                       </h6>

//                       <small>
//                         Track your learning progress and results.
//                       </small>
//                     </div>
//                   </div>

//                   <div className="register-feature">
//                     <div className="feature-icon">
//                       <i className="bi bi-bar-chart"></i>
//                     </div>

//                     <div>
//                       <h6 className="mb-1 fw-semibold">
//                         Track Progress
//                       </h6>

//                       <small>
//                         Monitor your performance throughout your journey.
//                       </small>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ==================================================
//               RIGHT SIDE - REGISTER FORM
//               ================================================== */}

//           <div className="col-lg-7">
//             <div className="register-form-wrapper">

//               {/* ==================================================
//                   HEADER
//                   ================================================== */}

//               <div className="text-center mb-4">

//                 <div className="register-mobile-icon d-inline-flex d-lg-none align-items-center justify-content-center mb-3">
//                   <i className="bi bi-person-plus-fill"></i>
//                 </div>

//                 <h1 className="register-title">
//                   Create Account
//                 </h1>

//                 <p className="text-muted mb-0">
//                   Register for your LMS account
//                 </p>

//               </div>

//               {/* ==================================================
//                   ALERTS
//                   ================================================== */}

//               {error && (
//                 <div
//                   className="alert alert-danger register-alert d-flex align-items-center"
//                   role="alert"
//                 >
//                   <i className="bi bi-exclamation-circle-fill me-2"></i>

//                   <span>{error}</span>
//                 </div>
//               )}

//               {success && (
//                 <div
//                   className="alert alert-success register-alert d-flex align-items-center"
//                   role="alert"
//                 >
//                   <i className="bi bi-check-circle-fill me-2"></i>

//                   <span>{success}</span>
//                 </div>
//               )}

//               {/* ==================================================
//                   FORM
//                   ================================================== */}

//               <form onSubmit={handleSubmit} noValidate>

//                 {/* ==================================================
//                     PERSONAL INFORMATION
//                     ================================================== */}

//                 <div className="section-heading">
//                   <span className="section-number">
//                     1
//                   </span>

//                   <span>
//                     Personal Information
//                   </span>
//                 </div>

//                 <div className="row g-3">

//                   {/* Name */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Full Name
//                       <span className="text-danger ms-1">
//                         *
//                       </span>
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-person"></i>
//                       </span>

//                       <input
//                         type="text"
//                         name="name"
//                         className="form-control custom-input"
//                         placeholder="Enter full name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         autoComplete="name"
//                         disabled={loading}
//                       />

//                     </div>
//                   </div>

//                   {/* Email */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Email Address
//                       <span className="text-danger ms-1">
//                         *
//                       </span>
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-envelope"></i>
//                       </span>

//                       <input
//                         type="email"
//                         name="email"
//                         className="form-control custom-input"
//                         placeholder="Enter email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         autoComplete="email"
//                         disabled={loading}
//                       />

//                     </div>
//                   </div>

//                   {/* Phone */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Phone Number
//                       <span className="text-danger ms-1">
//                         *
//                       </span>
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-telephone"></i>
//                       </span>

//                       <input
//                         type="tel"
//                         name="phone"
//                         className="form-control custom-input"
//                         placeholder="Enter phone number"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         autoComplete="tel"
//                         disabled={loading}
//                       />

//                     </div>
//                   </div>

//                   {/* Role */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Account Role
//                       <span className="text-danger ms-1">
//                         *
//                       </span>
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-person-badge"></i>
//                       </span>

//                       <select
//                         name="role"
//                         className="form-select custom-input custom-select"
//                         value={formData.role}
//                         onChange={handleChange}
//                         disabled={loading}
//                       >
//                         <option value="">
//                           Select role
//                         </option>

//                         <option value="STUDENT">
//                           Student
//                         </option>

//                         {/* <option value="INSTRUCTOR">
//                           Instructor
//                         </option>

//                         <option value="ADMIN">
//                           Admin
//                         </option> */}
//                       </select>

//                     </div>
//                   </div>

//                 </div>

//                 {/* ==================================================
//                     ADDRESS INFORMATION
//                     ================================================== */}

//                 <div className="section-heading mt-4">

//                   <span className="section-number">
//                     2
//                   </span>

//                   <span>
//                     Address Information
//                   </span>

//                 </div>

//                 <div className="row g-3">

//                   {/* Street */}

//                   <div className="col-12">

//                     <label className="form-label custom-label">
//                       Current Location
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-geo-alt"></i>
//                       </span>

//                       <input
//                         type="text"
//                         name="street"
//                         className="form-control custom-input"
//                         placeholder="Enter street address"
//                         value={formData.address.street}
//                         onChange={handleAddressChange}
//                         autoComplete="street-address"
//                         disabled={loading}

//                       />

//                     </div>
//                   </div>

//                   {/* City */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       City
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-building"></i>
//                       </span>

//                       <input
//                         type="text"
//                         name="city"
//                         className="form-control custom-input"
//                         placeholder="Enter city"
//                         value={formData.address.city}
//                         onChange={handleAddressChange}
//                         autoComplete="address-level2"
//                         disabled={loading}
//                       />

//                     </div>
//                   </div>

//                   {/* ==================================================
//                       STATE DROPDOWN
//                       ================================================== */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       State
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-map"></i>
//                       </span>

//                       <select
//                         name="state"
//                         className="form-select custom-input custom-select"
//                         value={formData.address.state}
//                         onChange={handleAddressChange}
//                         disabled={loading}
//                       >
//                         <option value="">
//                           Select state
//                         </option>

//                         {INDIAN_STATES.map((state) => (
//                           <option
//                             key={state}
//                             value={state}
//                           >
//                             {state}
//                           </option>
//                         ))}
//                       </select>

//                     </div>
//                   </div>

//                   {/* Country */}

//                   {/* <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Country
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-globe"></i>
//                       </span>

//                       <input
//                         type="text"
//                         name="country"
//                         className="form-control custom-input"
//                         placeholder="Enter country"
//                         value={formData.address.country}
//                         onChange={handleAddressChange}
//                         autoComplete="country-name"
//                         disabled={loading}
//                       />

//                     </div>
//                   </div> */}

//                   {/* Postal Code */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Postal Code
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-mailbox"></i>
//                       </span>

//                       <input
//                         type="text"
//                         name="postalCode"
//                         className="form-control custom-input"
//                         placeholder="Enter postal code"
//                         value={formData.address.postalCode}
//                         onChange={handleAddressChange}
//                         autoComplete="postal-code"
//                         disabled={loading}
//                       />

//                     </div>
//                   </div>

//                 </div>

//                 {/* ==================================================
//                     ACCOUNT SECURITY
//                     ================================================== */}

//                 <div className="section-heading mt-4">

//                   <span className="section-number">
//                     3
//                   </span>

//                   <span>
//                     Account Security
//                   </span>

//                 </div>

//                 <div className="row g-3">

//                   {/* Password */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Password
//                       <span className="text-danger ms-1">
//                         *
//                       </span>
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-lock"></i>
//                       </span>

//                       <input
//                         type={
//                           showPassword
//                             ? "text"
//                             : "password"
//                         }
//                         name="password"
//                         className="form-control custom-input password-input"
//                         placeholder="Minimum 8 characters"
//                         value={formData.password}
//                         onChange={handleChange}
//                         autoComplete="new-password"
//                         disabled={loading}
//                       />

//                       <button
//                         type="button"
//                         className="password-toggle"
//                         onClick={() =>
//                           setShowPassword(
//                             (previous) => !previous
//                           )
//                         }
//                         disabled={loading}
//                         aria-label={
//                           showPassword
//                             ? "Hide password"
//                             : "Show password"
//                         }
//                       >
//                         <i
//                           className={
//                             showPassword
//                               ? "bi bi-eye-slash"
//                               : "bi bi-eye"
//                           }
//                         />
//                       </button>

//                     </div>
//                   </div>

//                   {/* Confirm Password */}

//                   <div className="col-md-6">

//                     <label className="form-label custom-label">
//                       Confirm Password
//                       <span className="text-danger ms-1">
//                         *
//                       </span>
//                     </label>

//                     <div className="custom-input-group">

//                       <span className="custom-input-icon">
//                         <i className="bi bi-shield-lock"></i>
//                       </span>

//                       <input
//                         type={
//                           showConfirmPassword
//                             ? "text"
//                             : "password"
//                         }
//                         name="confirmPassword"
//                         className="form-control custom-input password-input"
//                         placeholder="Confirm password"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         autoComplete="new-password"
//                         disabled={loading}
//                       />

//                       <button
//                         type="button"
//                         className="password-toggle"
//                         onClick={() =>
//                           setShowConfirmPassword(
//                             (previous) => !previous
//                           )
//                         }
//                         disabled={loading}
//                         aria-label={
//                           showConfirmPassword
//                             ? "Hide password"
//                             : "Show password"
//                         }
//                       >
//                         <i
//                           className={
//                             showConfirmPassword
//                               ? "bi bi-eye-slash"
//                               : "bi bi-eye"
//                           }
//                         />
//                       </button>

//                     </div>
//                   </div>

//                 </div>

//                 {/* ==================================================
//                     PASSWORD INFO
//                     ================================================== */}

//                 <div className="password-info mt-3">

//                   <i className="bi bi-info-circle me-2"></i>

//                   Password must contain at least 8 characters.

//                 </div>

//                 {/* ==================================================
//                     SUBMIT BUTTON
//                     ================================================== */}

//                 <button
//                   type="submit"
//                   className="btn register-submit-btn w-100 mt-4"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span
//                         className="spinner-border spinner-border-sm me-2"
//                         role="status"
//                       />

//                       Creating Account...
//                     </>
//                   ) : (
//                     <>
//                       <i className="bi bi-person-plus-fill me-2"></i>

//                       Create Account
//                     </>
//                   )}
//                 </button>

//               </form>

//               {/* ==================================================
//                   LOGIN LINK
//                   ================================================== */}

//               <div className="text-center mt-4 pt-3 border-top">

//                 <span className="text-muted">
//                   Already have an account?
//                 </span>{" "}

//                 <Link
//                   to="/login"
//                   className="fw-semibold text-primary text-decoration-none register-login-link"
//                 >
//                   Sign In
//                 </Link>

//               </div>

//             </div>
//           </div>

//         </div>
//       </div>

//       {/* ==================================================
//           PAGE STYLES
//           ================================================== */}

//       <style>
//         {`

//           /* ==============================================
//              PAGE
//              ============================================== */

//           .register-page {
//             position: relative;
//             overflow: hidden;
//           }


//           /* ==============================================
//              BACKGROUND CIRCLES
//              ============================================== */

//           .register-bg-circle {
//             position: absolute;
//             border-radius: 50%;
//             pointer-events: none;
//             opacity: 0.45;
//             animation: registerFloat 8s ease-in-out infinite;
//           }

//           .register-bg-circle-one {
//             width: 300px;
//             height: 300px;
//             backgroundColor: "#1F242D",
//             top: -100px;
//             left: -80px;
//           }

//           .register-bg-circle-two {
//             width: 400px;
//             height: 400px;
//             backgroundColor: "#1F242D",
//             right: -150px;
//             bottom: -150px;
//             animation-delay: 1.5s;
//           }


//           /* ==============================================
//              MAIN CARD
//              ============================================== */

//           .register-card {
//             position: relative;
//             z-index: 2;
//             width: 100%;
//             max-width: 1080px;
//             border-radius: 24px;
//             overflow: hidden;
//             animation: registerCardEnter 0.7s ease-out;
//           }


//           /* ==============================================
//              LEFT PANEL
//              ============================================== */

//           .register-left-panel {
//             min-height: 680px;
//             background: #FECB43;
//             position: relative;
//             overflow: hidden;
//           }

//           .register-description {
//             color: rgba(255, 255, 255, 0.9);
//             font-size: 0.95rem;
//             line-height: 1.6;
//           }

//           .register-features {
//             display: flex;
//             flex-direction: column;
//             gap: 1.25rem;
//           }

//           .register-feature {
//             display: flex;
//             align-items: flex-start;
//             gap: 1rem;
//             background: rgba(255, 255, 255, 0.12);
//             padding: 1rem 1.25rem;
//             border-radius: 14px;
//             backdrop-filter: blur(8px);
//           }

//           .feature-icon {
//             width: 38px;
//             height: 38px;
//             border-radius: 10px;
//             background: rgba(255, 255, 255, 0.2);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 1.2rem;
//             flex-shrink: 0;
//           }


//           /* ==============================================
//              RIGHT PANEL & FORM WRAPPER
//              ============================================== */

//           .register-form-wrapper {
//             padding: 2.5rem;
//           }

//           .register-title {
//             font-weight: 700;
//             color: #1e293b;
//             font-size: 1.75rem;
//           }

//           .register-mobile-icon {
//             width: 50px;
//             height: 50px;
//             border-radius: 50%;
//             background: rgba(0, 56, 71, 0.1);
//             color: #003847;
//             font-size: 1.5rem;
//           }


//           /* ==============================================
//              SECTION HEADINGS
//              ============================================== */

//           .section-heading {
//             display: flex;
//             align-items: center;
//             gap: 0.75rem;
//             font-weight: 600;
//             color: #334155;
//             margin-bottom: 1rem;
//             font-size: 0.95rem;
//           }

//           .section-number {
//             width: 24px;
//             height: 24px;
//             border-radius: 50%;
//             background: #e2e8f0;
//             color: #475569;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 0.8rem;
//             font-weight: 700;
//           }


//           /* ==============================================
//              FORM CONTROLS & INPUT GROUPS
//              ============================================== */

//           .custom-label {
//             font-size: 0.85rem;
//             font-weight: 500;
//             color: #475569;
//             margin-bottom: 0.4rem;
//           }

//           .custom-input-group {
//             position: relative;
//             display: flex;
//             align-items: center;
//           }

//           .custom-input-icon {
//             position: absolute;
//             left: 1rem;
//             color: #94a3b8;
//             font-size: 1.1rem;
//             z-index: 4;
//             pointer-events: none;
//           }

//           .custom-input {
//             padding-left: 2.75rem !important;
//             padding-right: 1rem;
//             height: 46px;
//             border-radius: 10px;
//             border: 1px solid #cbd5e1;
//             font-size: 0.9rem;
//             transition: all 0.2s ease;
//           }

//           .custom-input:focus {
//             border-color: #003847;
//             box-shadow: 0 0 0 4px rgba(0, 56, 71, 0.1);
//           }

//           .password-input {
//             padding-right: 2.75rem !important;
//           }

//           .password-toggle {
//             position: absolute;
//             right: 0.75rem;
//             background: transparent;
//             border: none;
//             color: #94a3b8;
//             font-size: 1.1rem;
//             padding: 0.25rem 0.5rem;
//             cursor: pointer;
//             z-index: 4;
//           }

//           .password-toggle:hover {
//             color: #475569;
//           }


//           /* ==============================================
//              SINGLE DROPDOWN ARROW FIX
//              ============================================== */

//           .custom-select {
//             -webkit-appearance: none !important;
//             -moz-appearance: none !important;
//             appearance: none !important;
//             background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
//             background-repeat: no-repeat !important;
//             background-position: right 0.75rem center !important;
//             background-size: 16px 12px !important;
//             padding-right: 2.5rem !important;
//           }


//           /* ==============================================
//              INFO & ALERTS
//              ============================================== */

//           .password-info {
//             font-size: 0.8rem;
//             color: #64748b;
//             display: flex;
//             align-items: center;
//           }

//           .register-alert {
//             border-radius: 10px;
//             font-size: 0.875rem;
//           }


//           /* ==============================================
//              SUBMIT BUTTON (DARK TEAL COLOR APPLIED)
//              ============================================== */

//           .register-submit-btn {
//             background-color: #003847;
//             color: #ffffff;
//             border: none;
//             height: 48px;
//             border-radius: 10px;
//             font-weight: 600;
//             font-size: 0.95rem;
//             transition: all 0.2s ease;
//           }

//           .register-submit-btn:hover:not(:disabled) {
//             background-color: #002f3c;
//             color: #ffffff;
//             transform: translateY(-1px);
//             box-shadow: 0 4px 12px rgba(0, 56, 71, 0.25);
//           }

//           .register-submit-btn:disabled {
//             background-color: #64748b;
//             color: #ffffff;
//             opacity: 0.7;
//           }


//           /* ==============================================
//              LINKS & ANIMATIONS
//              ============================================== */

//           .register-login-link:hover {
//             text-decoration: underline !important;
//           }

//           @keyframes registerFloat {
//             0%, 100% {
//               transform: translateY(0px);
//             }
//             50% {
//               transform: translateY(-15px);
//             }
//           }

//           @keyframes registerCardEnter {
//             from {
//               opacity: 0;
//               transform: translateY(20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//         `}
//       </style>
//     </div>
//   );
// }






import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService.js";
import logo from "../../assets/images/s-logo.png";

export default function Register() {
  const navigate = useNavigate();

  // INDIAN STATES + UNION TERRITORIES
  const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    role: "",
    password: "",
    confirmPassword: "",
  });

  // UI STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // HANDLE NORMAL INPUT CHANGE
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  // HANDLE ADDRESS CHANGE
  function handleAddressChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      address: {
        ...previous.address,
        [name]: value,
      },
    }));

    if (error) {
      setError("");
    }
  }

  // VALIDATE FORM
  function validateForm() {
    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    if (formData.name.trim().length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;

    if (!phoneRegex.test(formData.phone.trim())) {
      return "Please enter a valid phone number.";
    }

    if (
      formData.phone.trim().length < 10 ||
      formData.phone.trim().length > 15
    ) {
      return "Phone number must be between 10 and 15 characters.";
    }

    if (!formData.role) {
      return "Please select a role.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  }

  // HANDLE SUBMIT
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          country: formData.address.country.trim(),
          postalCode: formData.address.postalCode.trim(),
        },
        role: formData.role,
        password: formData.password,
      });

      setSuccess(
        result?.message ||
          "Registration successful. Please verify your email."
      );

      setTimeout(() => {
        navigate(
          `/verify-email?email=${encodeURIComponent(
            formData.email.trim()
          )}`,
          {
            replace: true,
          }
        );
      }, 800);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  // RENDER
  return (
    <div
      className="register-page min-vh-100 d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        background:
          "linear-gradient(135deg, #eef4ff 0%, #f8f9ff 45%, #ffffff 100%)",
      }}
    >
      {/* MAIN CARD */}
      <div className="register-card bg-white shadow-lg">
        <div className="row g-0">
          {/* LEFT SIDE */}
          <div className="col-lg-5 d-none d-lg-flex">
            <div className="register-left-panel w-100 d-flex flex-column justify-content-center">
              <div className="px-5 py-5">
                {/* CENTERED CIRCULAR LOGO */}
                <div className="register-logo">
                  <img
                    src={logo}
                    alt="SVR EDTECH Logo"
                    className="register-logo-image"
                  />
                </div>

                <h2 className="fw-bold mb-3">
                  Start Your Learning Journey
                </h2>

                <p className="mb-4 register-description">
                  Create your LMS account and get access to courses,
                  assessments, learning resources, and more.
                </p>

                {/* FEATURES */}
                <div className="register-features">
                  <div className="register-feature">
                    <div className="feature-icon">
                      <i className="bi bi-book" />
                    </div>

                    <div>
                      <h6 className="mb-1 fw-semibold">
                        Learn at Your Pace
                      </h6>
                      <small>
                        Access your learning content anytime.
                      </small>
                    </div>
                  </div>

                  <div className="register-feature">
                    <div className="feature-icon">
                      <i className="bi bi-clipboard-check" />
                    </div>

                    <div>
                      <h6 className="mb-1 fw-semibold">
                        Take Assessments
                      </h6>
                      <small>
                        Track your learning progress and results.
                      </small>
                    </div>
                  </div>

                  <div className="register-feature">
                    <div className="feature-icon">
                      <i className="bi bi-bar-chart" />
                    </div>

                    <div>
                      <h6 className="mb-1 fw-semibold">
                        Track Progress
                      </h6>
                      <small>
                        Monitor your performance throughout your journey.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - REGISTER FORM */}
          <div className="col-lg-7">
            <div className="register-form-wrapper">
              {/* HEADER */}
              <div className="text-center mb-4">
                <div className="register-mobile-icon d-inline-flex d-lg-none align-items-center justify-content-center mb-3">
                  <i className="bi bi-person-plus-fill" />
                </div>

                <h1 className="register-title">Create Account</h1>

                <p className="text-muted mb-0">
                  Register for your LMS account
                </p>
              </div>

              {/* ALERTS */}
              {error && (
                <div
                  className="alert alert-danger register-alert d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle-fill me-2" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success register-alert d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2" />
                  <span>{success}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} noValidate>
                {/* PERSONAL INFORMATION */}
                <div className="section-heading">
                  <span className="section-number">1</span>
                  <span>Personal Information</span>
                </div>

                <div className="row g-3">
                  {/* NAME */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Full Name
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-person" />
                      </span>

                      <input
                        type="text"
                        name="name"
                        className="form-control custom-input"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Email Address
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-envelope" />
                      </span>

                      <input
                        type="email"
                        name="email"
                        className="form-control custom-input"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Phone Number
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-telephone" />
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        className="form-control custom-input"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* ROLE */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Account Role
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-person-badge" />
                      </span>

                      <select
                        name="role"
                        className="form-select custom-input custom-select"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select role</option>
                        <option value="STUDENT">Student</option>

                        {/*
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="ADMIN">Admin</option>
                        */}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ADDRESS INFORMATION */}
                <div className="section-heading mt-4">
                  <span className="section-number">2</span>
                  <span>Address Information</span>
                </div>

                <div className="row g-3">
                  {/* STREET */}
                  <div className="col-12">
                    <label className="form-label custom-label">
                      Current Location
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-geo-alt" />
                      </span>

                      <input
                        type="text"
                        name="street"
                        className="form-control custom-input"
                        placeholder="Enter street address"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        autoComplete="street-address"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* CITY */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      City
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-building" />
                      </span>

                      <input
                        type="text"
                        name="city"
                        className="form-control custom-input"
                        placeholder="Enter city"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        autoComplete="address-level2"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* STATE */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      State
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-map" />
                      </span>

                      <select
                        name="state"
                        className="form-select custom-input custom-select"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        disabled={loading}
                      >
                        <option value="">Select state</option>

                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* COUNTRY FIELD REMAINS COMMENTED OUT */}
                  {/*
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Country
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-globe" />
                      </span>

                      <input
                        type="text"
                        name="country"
                        className="form-control custom-input"
                        placeholder="Enter country"
                        value={formData.address.country}
                        onChange={handleAddressChange}
                        autoComplete="country-name"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  */}

                  {/* POSTAL CODE */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Postal Code
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-mailbox" />
                      </span>

                      <input
                        type="text"
                        name="postalCode"
                        className="form-control custom-input"
                        placeholder="Enter postal code"
                        value={formData.address.postalCode}
                        onChange={handleAddressChange}
                        autoComplete="postal-code"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* ACCOUNT SECURITY */}
                <div className="section-heading mt-4">
                  <span className="section-number">3</span>
                  <span>Account Security</span>
                </div>

                <div className="row g-3">
                  {/* PASSWORD */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Password
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-lock" />
                      </span>

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control custom-input password-input"
                        placeholder="Minimum 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        disabled={loading}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        <i
                          className={
                            showPassword
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        />
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      Confirm Password
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="custom-input-group">
                      <span className="custom-input-icon">
                        <i className="bi bi-shield-lock" />
                      </span>

                      <input
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        className="form-control custom-input password-input"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                        disabled={loading}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <i
                          className={
                            showConfirmPassword
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* PASSWORD INFO */}
                <div className="password-info mt-3">
                  <i className="bi bi-info-circle me-2" />
                  Password must contain at least 8 characters.
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="btn register-submit-btn w-100 mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus-fill me-2" />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              {/* LOGIN LINK */}
              <div className="text-center mt-4 pt-3 border-top">
                <span className="text-muted">
                  Already have an account?
                </span>{" "}

                <Link
                  to="/login"
                  className="fw-semibold text-primary text-decoration-none register-login-link"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE STYLES */}
      <style>{`
        /* PAGE */
        .register-page {
          position: relative;
          overflow: hidden;
        }

        /* MAIN CARD */
        .register-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1080px;
          border-radius: 24px;
          overflow: hidden;
          animation: registerCardEnter 0.7s ease-out;
        }

        /* LEFT PANEL */
        .register-left-panel {
          min-height: 680px;
          background: #FECA42;
          color: #002f3c;
          position: relative;
          overflow: hidden;
        }

        /* LEFT PANEL HEADING */
        .register-left-panel h2 {
          color: #002f3c;
        }

        /* CENTERED CIRCULAR WHITE LOGO */
        .register-logo {
          width: 220px;
          height: 220px;
          max-width: 100%;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          margin: 0 auto 2rem auto !important;
          box-shadow: 0 8px 24px rgba(0, 47, 60, 0.2);
          overflow: hidden;
        }

        .register-logo-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        /* DESCRIPTION */
        .register-description {
          color: #002f3c;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* FEATURES */
        .register-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .register-feature {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(0, 47, 60, 0.08);
          padding: 1rem 1.25rem;
          border-radius: 14px;
          backdrop-filter: blur(8px);
        }

        .register-feature h6 {
          color: #002f3c;
        }

        .register-feature small {
          color: #002f3c;
        }

        .feature-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(0, 47, 60, 0.1);
          color: #002f3c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        /* RIGHT PANEL & FORM */
        .register-form-wrapper {
          padding: 2.5rem;
        }

        .register-title {
          font-weight: 700;
          color: #1e293b;
          font-size: 1.75rem;
        }

        .register-mobile-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 56, 71, 0.1);
          color: #003847;
          font-size: 1.5rem;
        }

        /* SECTION HEADINGS */
        .section-heading {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .section-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        /* FORM CONTROLS */
        .custom-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #475569;
          margin-bottom: 0.4rem;
        }

        .custom-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .custom-input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
          font-size: 1.1rem;
          z-index: 4;
          pointer-events: none;
        }

        .custom-input {
          padding-left: 2.75rem !important;
          padding-right: 1rem;
          height: 46px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .custom-input:focus {
          border-color: #003847;
          box-shadow: 0 0 0 4px rgba(0, 56, 71, 0.1);
        }

        .password-input {
          padding-right: 2.75rem !important;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1.1rem;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          z-index: 4;
        }

        .password-toggle:hover {
          color: #475569;
        }

        /* DROPDOWN ARROW */
        .custom-select {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 16px 12px !important;
          padding-right: 2.5rem !important;
        }

        /* INFO & ALERTS */
        .password-info {
          font-size: 0.8rem;
          color: #64748b;
          display: flex;
          align-items: center;
        }

        .register-alert {
          border-radius: 10px;
          font-size: 0.875rem;
        }

        /* SUBMIT BUTTON */
        .register-submit-btn {
          background-color: #003847;
          color: #ffffff;
          border: none;
          height: 48px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .register-submit-btn:hover:not(:disabled) {
          background-color: #002f3c;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 56, 71, 0.25);
        }

        .register-submit-btn:disabled {
          background-color: #64748b;
          color: #ffffff;
          opacity: 0.7;
        }

        /* LINKS & ANIMATIONS */
        .register-login-link:hover {
          text-decoration: underline !important;
        }

        @keyframes registerCardEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 991.98px) {
          .register-form-wrapper {
            padding: 2rem;
          }
        }

        @media (max-width: 575.98px) {
          .register-form-wrapper {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}