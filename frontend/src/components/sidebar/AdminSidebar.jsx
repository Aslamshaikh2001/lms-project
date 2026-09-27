import React from "react";
import { NavLink, useLocation } from "react-router-dom";

// Logo Image Path
import logoImg from "../../assets/images/s-logo.png";
import "../../styles/admin-sidebar.css";
const menuItems = [
  { title: "Dashboard", icon: "bi-speedometer2", path: "/admin/dashboard" },
  { title: "Assessments", icon: "bi-clipboard-check", path: "/admin/assessments" },
  { title: "Questions", icon: "bi-question-circle", path: "/admin/questions" },
  { title: "Registered Students", icon: "bi-mortarboard", path: "/admin/students" },
  { title: "Student Results", icon: "bi-bar-chart-line", path: "/admin/student-results" },
  { title: "Courses", icon: "bi-book", path: "/admin/courses" },
  { title: "Instructors", icon: "bi-person-video3", path: "/admin/instructors" },
  { title: "Reports", icon: "bi-bar-chart", path: "/admin/reports" },
];

const bottomMenuItems = [
  { title: "Settings", icon: "bi-gear", path: "/admin/settings" },
];

export default function AdminSidebar({ collapsed, mobileOpen, onClose }) {
  const location = useLocation();

  const isMenuActive = (path) => {
    if (path === "/admin/students") return location.pathname.startsWith("/admin/students");
    if (path === "/admin/questions") return location.pathname.startsWith("/admin/questions");
    if (path === "/admin/assessments") return location.pathname.startsWith("/admin/assessments");
    if (path === "/admin/student-results") return location.pathname.startsWith("/admin/student-results");
    return location.pathname === path;
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`admin-sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        
        {/* TOP BRAND HEADER AREA WITH CIRCLE LOGO */}
        <div className="sidebar-header-branding">
          <div className="sidebar-logo-circle">
            <img src={logoImg} alt="LMS Logo" className="sidebar-logo-img" />
          </div>
          <div className="branding-text">
            <span className="brand-title">LMS</span>
            <span className="brand-subtitle">Learning Management System</span>
          </div>
        </div>

        {/* MOBILE CLOSE BUTTON */}
        <button type="button" className="sidebar-mobile-close" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        {/* NAVIGATION AREA */}
        <div className="sidebar-navigation">
          <div className="sidebar-section-title">MAIN MENU</div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li className="sidebar-menu-item" key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={() => `sidebar-link ${isMenuActive(item.path) ? "active" : ""}`}
                >
                  <span className="sidebar-link-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </span>
                  <span className="sidebar-link-text">{item.title}</span>
                  <span className="sidebar-tooltip">{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="sidebar-section-title mt-4">SYSTEM</div>
          <ul className="sidebar-menu">
            {bottomMenuItems.map((item) => (
              <li className="sidebar-menu-item" key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={() => `sidebar-link ${isMenuActive(item.path) ? "active" : ""}`}
                >
                  <span className="sidebar-link-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </span>
                  <span className="sidebar-link-text">{item.title}</span>
                  <span className="sidebar-tooltip">{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* FOOTER */}
        <div className="sidebar-bottom">
          <div className="sidebar-help-card">
            <div className="help-icon">
              <i className="bi bi-question-circle"></i>
            </div>
            <div className="help-content">
              <strong>Need Help?</strong>
              <span>Contact support</span>
            </div>
          </div>

          <button type="button" className="sidebar-logout">
            <i className="bi bi-box-arrow-left"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}