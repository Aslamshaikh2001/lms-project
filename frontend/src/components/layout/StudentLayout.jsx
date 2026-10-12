
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import StudentSidebar from "../sidebar/StudentSidebar.jsx";
// import StudentNavbar from "../navbar/StudentNavbar.jsx";

// import { useAuth } from "../../context/AuthContext.jsx";

// import "./layout.css";

// export default function StudentLayout({ children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   // Student logout
//   async function handleStudentLogout() {
//     try {
//       await logout();
//     } catch (error) {
//       console.error("Student logout error:", error);
//     } finally {
//       navigate("/login", { replace: true });
//     }
//   }

//   // Preserve desktop and mobile sidebar behavior
//   function handleMenuClick() {
//     if (window.innerWidth < 992) {
//       setMobileOpen((previous) => !previous);
//     } else {
//       setCollapsed((previous) => !previous);
//     }
//   }

//   return (
//     <div className="admin-layout d-flex min-vh-100 position-relative">
//       <StudentSidebar
//         collapsed={collapsed}
//         mobileOpen={mobileOpen}
//         onClose={() => setMobileOpen(false)}
//       />

//       <div
//         className={`admin-main flex-grow-1 d-flex flex-column ${
//           collapsed ? "main-collapsed" : ""
//         }`}
//       >
//         <StudentNavbar
//           currentUser={user}
//           onLogout={handleStudentLogout}
//           onToggleSidebar={handleMenuClick}
//         />

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

  async function handleStudentLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Student logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  }

  function handleMenuClick() {
    if (window.innerWidth < 992) {
      setMobileOpen((previous) => !previous);
    } else {
      setCollapsed((previous) => !previous);
    }
  }

  return (
    <div
      className={`admin-layout ${
        collapsed ? "sidebar-collapsed" : ""
      } ${mobileOpen ? "mobile-sidebar-open" : ""}`}
    >
      {/* Sidebar */}
      <StudentSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main application area */}
      <div
        className={`admin-main ${
          collapsed ? "main-collapsed" : ""
        }`}
      >
        {/* Fixed navbar */}
        <StudentNavbar
          currentUser={user}
          onLogout={handleStudentLogout}
          onToggleSidebar={handleMenuClick}
        />

        {/* Independently scrollable dashboard */}
        <main className="admin-content">
          <div className="student-content-inner">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <button
          type="button"
          className="student-sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}

