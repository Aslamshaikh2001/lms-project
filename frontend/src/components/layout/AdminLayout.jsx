// import React, { useState } from "react";
// import AdminNavbar from "../navbar/AdminNavbar.jsx";
// import AdminSidebar from "../sidebar/AdminSidebar.jsx";

// export default function AdminLayout({ children }) {

//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const [mobileSidebarOpen, setMobileSidebarOpen] =
//     useState(false);

//   const handleMenuClick = () => {

//     if (window.innerWidth <= 991) {
//       setMobileSidebarOpen((previous) => !previous);
//     } else {
//       setSidebarCollapsed((previous) => !previous);
//     }

//   };

//   return (
//     <div className="admin-layout">

//       <AdminSidebar
//         collapsed={sidebarCollapsed}
//         mobileOpen={mobileSidebarOpen}
//         onClose={() => setMobileSidebarOpen(false)}
//       />

//       <div
//         className={`
//           admin-main-wrapper
//           ${sidebarCollapsed ? "main-collapsed" : ""}
//         `}
//       >

//         <AdminNavbar
//           onMenuClick={handleMenuClick}
//           sidebarCollapsed={sidebarCollapsed}
//         />

//         <main className="admin-main-content">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import AdminSidebar from "../sidebar/AdminSidebar.jsx";
import useAuth from "../../hooks/useAuth.js";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const auth = useAuth(); // Read directly from Auth Context if available
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      // 1. Check Auth Context first
      if (auth?.user) {
        setCurrentUser(auth.user);
        return;
      }

      // 2. Check Local / Session Storage as fallback
      const keys = ["currentUser", "user", "userData", "admin", "authUser", "auth"];
      let foundUser = null;

      for (const key of keys) {
        const item = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            foundUser = parsed?.user || parsed?.data?.user || parsed?.data || parsed?.admin || parsed;
            if (foundUser && (foundUser.email || foundUser.name || foundUser.username || foundUser.role)) {
              break;
            }
          } catch (e) {
            // String fallback
          }
        }
      }

      if (foundUser) {
        setCurrentUser(foundUser);
      }
    } catch (err) {
      console.error("Error reading user data in layout:", err);
    }
  }, [auth?.user]);

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const handleMenuClick = () => {
    if (window.innerWidth <= 991) {
      setMobileSidebarOpen((previous) => !previous);
    } else {
      setSidebarCollapsed((previous) => !previous);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className={`admin-main-wrapper ${sidebarCollapsed ? "main-collapsed" : ""}`}>
        <AdminNavbar
          onToggleSidebar={handleMenuClick}
          sidebarCollapsed={sidebarCollapsed}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}