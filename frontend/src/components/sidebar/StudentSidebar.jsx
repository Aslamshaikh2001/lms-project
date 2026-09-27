// import React from "react";
// import { NavLink } from "react-router-dom";


// const menuItems = [
//   {
//     title: "Dashboard",
//     icon: "bi-speedometer2",
//     path: "/student/dashboard",
//   },
//   {
//     title: "Assessments",
//     icon: "bi-file-earmark-text",
//     path: "/student/assessments",
//   },
//   {
//     title: "My Courses",
//     icon: "bi-book",
//     path: "/student/courses",
//   },
//   {
//     title: "Results",
//     icon: "bi-bar-chart",
//     path: "/student/results",
//   },
//   {
//     title: "Certificates",
//     icon: "bi-award",
//     path: "/student/certificates",
//   },
// ];

// const accountItems = [
//   {
//     title: "Profile",
//     icon: "bi-person",
//     path: "/student/profile",
//   },
//   {
//     title: "Settings",
//     icon: "bi-gear",
//     path: "/student/settings",
//   },
// ];

// export default function StudentSidebar({ collapsed, mobileOpen, onClose }) {
//   return (
//     <>
//       {/* MOBILE OVERLAY */}
//       {mobileOpen && (
//         <div className="sidebar-overlay" onClick={onClose} />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`admin-sidebar ${collapsed ? "sidebar-collapsed" : ""} ${
//           mobileOpen ? "sidebar-mobile-open" : ""
//         }`}
//       >
//         {/* LOGO */}
//         <div className="sidebar-logo">
//           <div className="logo-icon">
//             <i className="bi bi-mortarboard-fill"></i>
//           </div>
//           <div className="logo-content">
//             <span className="logo-title">SVR</span>
//             <span className="logo-subtitle">Learning Portal</span>
//           </div>
//         </div>

//         {/* MOBILE CLOSE */}
//         <button
//           type="button"
//           className="sidebar-mobile-close d-lg-none"
//           onClick={onClose}
//         >
//           <i className="bi bi-x-lg"></i>
//         </button>

//         {/* NAVIGATION */}
//         <div className="sidebar-navigation">
//           {/* LEARNING */}
//           <div className="sidebar-section-title">LEARNING</div>
//           <ul className="sidebar-menu">
//             {menuItems.map((item) => (
//               <li className="sidebar-menu-item" key={item.path}>
//                 <NavLink
//                   to={item.path}
//                   onClick={onClose}
//                   className={({ isActive }) =>
//                     `sidebar-link ${isActive ? "active" : ""}`
//                   }
//                 >
//                   <span className="sidebar-link-icon">
//                     <i className={`bi ${item.icon}`}></i>
//                   </span>
//                   <span className="sidebar-link-text">{item.title}</span>
//                   <span className="sidebar-tooltip">{item.title}</span>
//                 </NavLink>
//               </li>
//             ))}
//           </ul>

//           {/* ACCOUNT */}
//           <div className="sidebar-section-title mt-4">ACCOUNT</div>
//           <ul className="sidebar-menu">
//             {accountItems.map((item) => (
//               <li className="sidebar-menu-item" key={item.path}>
//                 <NavLink
//                   to={item.path}
//                   onClick={onClose}
//                   className={({ isActive }) =>
//                     `sidebar-link ${isActive ? "active" : ""}`
//                   }
//                 >
//                   <span className="sidebar-link-icon">
//                     <i className={`bi ${item.icon}`}></i>
//                   </span>
//                   <span className="sidebar-link-text">{item.title}</span>
//                   <span className="sidebar-tooltip">{item.title}</span>
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* SIDEBAR BOTTOM */}
//         <div className="sidebar-bottom">
//           <div className="sidebar-help-card">
//             <div className="help-icon">
//               <i className="bi bi-question-circle"></i>
//             </div>
//             <div className="help-content">
//               <strong>Need Help?</strong>
//               <span>Contact support</span>
//             </div>
//           </div>

//           <button type="button" className="sidebar-logout">
//             <i className="bi bi-box-arrow-left"></i>
//             <span className="sidebar-link-text">Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }



import React from "react";
import { NavLink } from "react-router-dom";
import logoImg from "../../assets/images/s-logo.png";

const menuItems = [
  {
    title: "Dashboard",
    icon: "bi-speedometer2",
    path: "/student/dashboard",
  },
  {
    title: "Assessments",
    icon: "bi-file-earmark-text",
    path: "/student/assessments",
  },
  {
    title: "My Courses",
    icon: "bi-book",
    path: "/student/courses",
  },
  {
    title: "Results",
    icon: "bi-bar-chart",
    path: "/student/results",
  },
  {
    title: "Certificates",
    icon: "bi-award",
    path: "/student/certificates",
  },
];

const accountItems = [
  {
    title: "Profile",
    icon: "bi-person",
    path: "/student/profile",
  },
  {
    title: "Settings",
    icon: "bi-gear",
    path: "/student/settings",
  },
];

export default function StudentSidebar({ collapsed, mobileOpen, onClose }) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${collapsed ? "sidebar-collapsed" : ""} ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >
        {/* LOGO BRANDING HEADER */}
        <div className="sidebar-header-branding">
          <div className="sidebar-logo-circle">
            <img src={logoImg} alt="LMS Logo" className="sidebar-logo-img" />
          </div>
          <div className="branding-text">
            <span className="brand-title">LMS</span>
            <span className="brand-subtitle">Learning Management System</span>
          </div>
        </div>

        {/* MOBILE CLOSE */}
        <button
          type="button"
          className="sidebar-mobile-close d-lg-none"
          onClick={onClose}
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* NAVIGATION */}
        <div className="sidebar-navigation">
          {/* LEARNING */}
          <div className="sidebar-section-title">LEARNING</div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li className="sidebar-menu-item" key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
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

          {/* ACCOUNT */}
          <div className="sidebar-section-title mt-4">ACCOUNT</div>
          <ul className="sidebar-menu">
            {accountItems.map((item) => (
              <li className="sidebar-menu-item" key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
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

        {/* SIDEBAR BOTTOM */}
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
            <span className="sidebar-link-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}