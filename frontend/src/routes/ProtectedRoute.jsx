
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import useAuth from "../hooks/useAuth.js";

// export default function ProtectedRoute({ children }) {
//   const {
//     user,
//     loading,
//     isAuthenticated,
//   } = useAuth();

//   const location = useLocation();

//   // Wait until AuthContext finishes restoring session
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
//             Checking authentication...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // User is not logged in
//   if (!isAuthenticated || !user) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{
//           from: location.pathname,
//         }}
//       />
//     );
//   }

//   // User is authenticated
//   return children;
// }




import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";


export default function ProtectedRoute({
  children,
}) {

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();


  if (loading) {

    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">

        <div className="text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <p className="mt-3 text-muted">
            Checking authentication...
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
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  return children;
}

