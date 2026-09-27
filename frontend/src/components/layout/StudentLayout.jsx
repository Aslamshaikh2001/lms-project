import React, { useState } from "react";
import StudentSidebar from "../sidebar/StudentSidebar.jsx";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import "./layout.css";

export default function StudentLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-layout d-flex min-vh-100 position-relative">
      {/* SIDEBAR */}
      <StudentSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* MAIN CONTAINER */}
      <div className={`admin-main flex-grow-1 d-flex flex-column ${collapsed ? "main-collapsed" : ""}`}>
        {/* NAVBAR */}
        <AdminNavbar
          sidebarCollapsed={collapsed}
          onMenuClick={() => {
            if (window.innerWidth < 992) {
              setMobileOpen(!mobileOpen);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        />

        {/* CONTENT AREA */}
        <main className="admin-content flex-grow-1 bg-light p-3 p-md-4">
          {children}
        </main>
      </div>
    </div>
  );
}