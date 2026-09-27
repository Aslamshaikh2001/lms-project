

// import React from "react";
// import { Navigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth.js";

// export default function RoleRoute({
//   allowedRoles = [],
//   children,
// }) {
//   const {
//     user,
//     loading,
//     isAuthenticated,
//   } = useAuth();

//   // Wait for AuthContext
//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
//         <div className="text-center">
//           <div
//             className="spinner-border text-primary mb-3"
//             role="status"
//           >
//             <span className="visually-hidden">
//               Loading...
//             </span>
//           </div>

//           <p className="text-muted mb-0">
//             Loading dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Not authenticated
//   if (!isAuthenticated || !user) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//       />
//     );
//   }

//   const userRole =
//     user.role?.toUpperCase();

//   const hasPermission =
//     allowedRoles.some(
//       (role) =>
//         role.toUpperCase() === userRole
//     );

//   // Authenticated but wrong role
//   if (!hasPermission) {
//     return (
//       <Navigate
//         to={getDashboardPath(userRole)}
//         replace
//       />
//     );
//   }

//   return children;
// }


// // ======================================================
// // ROLE → DASHBOARD
// // ======================================================

// function getDashboardPath(role) {
//   switch (role) {
//     case "SUPER_ADMIN":
//     case "ADMIN":
//       return "/admin/dashboard";

//     case "INSTRUCTOR":
//       return "/instructor/dashboard";

//     case "STUDENT":
//       return "/student/dashboard";

//     default:
//       return "/login";
//   }
// }



import React from "react";
import {
  Navigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth.js";


export default function RoleRoute({
  allowedRoles = [],
  children,
}) {

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();


  if (loading) {

    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">

        <div className="text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <p className="mt-3 text-muted">
            Loading...
          </p>

        </div>

      </div>
    );
  }


  if (
    !isAuthenticated ||
    !user
  ) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  const userRole =
    String(
      user.role || ""
    ).toUpperCase();


  const roles =
    allowedRoles.map((role) =>
      String(role).toUpperCase()
    );


  if (!roles.includes(userRole)) {

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }


  return children;
}