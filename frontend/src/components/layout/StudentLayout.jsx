
// import React, {
//   useState,
// } from "react";

// import {
//   useNavigate,
// } from "react-router-dom";

// import StudentSidebar from "../sidebar/StudentSidebar.jsx";
// import AdminNavbar from "../navbar/AdminNavbar.jsx";

// import {
//   useAuth,
// } from "../../context/AuthContext.jsx";

// import "./layout.css";


// export default function StudentLayout({
//   children,
// }) {

//   // ====================================================
//   // STATE
//   // ====================================================

//   const [
//     collapsed,
//     setCollapsed,
//   ] = useState(false);

//   const [
//     mobileOpen,
//     setMobileOpen,
//   ] = useState(false);


//   // ====================================================
//   // AUTH
//   // ====================================================

//   const {
//     user,
//     logout,
//   } = useAuth();


//   // ====================================================
//   // NAVIGATION
//   // ====================================================

//   const navigate =
//     useNavigate();


//   // ====================================================
//   // STUDENT LOGOUT
//   // ====================================================

//   async function handleStudentLogout() {

//     try {

//       // ------------------------------------------------
//       // Logout through AuthContext
//       //
//       // This calls your existing backend logout API,
//       // clears access token,
//       // clears user state,
//       // and sets isAuthenticated=false.
//       // ------------------------------------------------

//       await logout();

//     } catch (error) {

//       console.error(
//         "Student logout error:",
//         error
//       );

//     } finally {

//       // ------------------------------------------------
//       // Always go to login page
//       // ------------------------------------------------

//       navigate(
//         "/login",
//         {
//           replace: true,
//         }
//       );

//     }
//   }


//   // ====================================================
//   // SIDEBAR TOGGLE
//   // ====================================================

//   function handleMenuClick() {

//     if (
//       window.innerWidth < 992
//     ) {

//       setMobileOpen(
//         (previous) =>
//           !previous
//       );

//     } else {

//       setCollapsed(
//         (previous) =>
//           !previous
//       );

//     }
//   }


//   // ====================================================
//   // RENDER
//   // ====================================================

//   return (
//     <div className="admin-layout d-flex min-vh-100 position-relative">

//       {/* ==================================================
//           SIDEBAR
//       ================================================== */}

//       <StudentSidebar
//         collapsed={
//           collapsed
//         }

//         mobileOpen={
//           mobileOpen
//         }

//         onClose={() =>
//           setMobileOpen(false)
//         }
//       />


//       {/* ==================================================
//           MAIN CONTAINER
//       ================================================== */}

//       <div
//         className={`
//           admin-main
//           flex-grow-1
//           d-flex
//           flex-column
//           ${
//             collapsed
//               ? "main-collapsed"
//               : ""
//           }
//         `}
//       >

//         {/* ==================================================
//             NAVBAR
//         ================================================== */}

//         <AdminNavbar

//           /*
//            * IMPORTANT:
//            *
//            * Pass the logged-in student from AuthContext.
//            *
//            * Previously this was missing, which caused
//            * AdminNavbar to use:
//            *
//            * "Admin"
//            * "Super Admin"
//            */

//           currentUser={
//             user
//           }


//           /*
//            * Pass Student logout function.
//            *
//            * Previously onLogout was undefined.
//            */

//           onLogout={
//             handleStudentLogout
//           }


//           /*
//            * AdminNavbar expects onToggleSidebar,
//            * not onMenuClick.
//            */

//           onToggleSidebar={
//             handleMenuClick
//           }

//         />


//         {/* ==================================================
//             CONTENT AREA
//         ================================================== */}

//         <main className="admin-content flex-grow-1 bg-light p-3 p-md-4">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentSidebar from "../sidebar/StudentSidebar.jsx";
import StudentNavbar from "../navbar/StudentNavbar.jsx";

import { useAuth } from "../../context/AuthContext.jsx";

import "./layout.css";

export default function StudentLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Student logout
  async function handleStudentLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Student logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  }

  // Preserve desktop and mobile sidebar behavior
  function handleMenuClick() {
    if (window.innerWidth < 992) {
      setMobileOpen((previous) => !previous);
    } else {
      setCollapsed((previous) => !previous);
    }
  }

  return (
    <div className="admin-layout d-flex min-vh-100 position-relative">
      <StudentSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div
        className={`admin-main flex-grow-1 d-flex flex-column ${
          collapsed ? "main-collapsed" : ""
        }`}
      >
        <StudentNavbar
          currentUser={user}
          onLogout={handleStudentLogout}
          onToggleSidebar={handleMenuClick}
        />

        <main className="admin-content flex-grow-1 bg-light p-3 p-md-4">
          {children}
        </main>
      </div>
    </div>
  );
}


