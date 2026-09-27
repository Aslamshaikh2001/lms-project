// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/admin-navbar.css";

// export default function AdminNavbar({
//   onToggleSidebar,
//   currentUser,
//   onLogout,
// }) {
//   const navigate = useNavigate();
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   // Extract dynamic values with full fallback checks
//   const displayName =
//     currentUser?.name ||
//     currentUser?.fullName ||
//     currentUser?.username ||
//     currentUser?.firstName ||
//     "Admin";

//   const displayEmail =
//     currentUser?.email ||
//     currentUser?.userEmail ||
//     currentUser?.mail ||
//     currentUser?.adminEmail ||
//     "";

//   const displayRole =
//     currentUser?.role ||
//     currentUser?.userRole ||
//     currentUser?.designation ||
//     "Super Admin";

//   const firstLetter = displayName.charAt(0).toUpperCase();

//   return (
//     <header className="admin-navbar">
//       {/* TOGGLE BUTTON */}
//       <button
//         type="button"
//         className="navbar-menu-btn"
//         onClick={onToggleSidebar}
//         title="Toggle Sidebar"
//       >
//         <i className="bi bi-layout-sidebar"></i>
//       </button>

//       {/* SEARCH BAR */}
//       <div className="navbar-search">
//         <i className="bi bi-search"></i>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search courses, assessments..."
//         />
//       </div>

//       {/* ACTIONS & PROFILE */}
//       <div className="navbar-actions ms-auto d-flex align-items-center position-relative">
//         <button type="button" className="navbar-icon-btn" title="Notifications">
//           <i className="bi bi-bell"></i>
//           <span className="notification-badge">3</span>
//         </button>

//         <div className="navbar-divider"></div>

//         {/* PROFILE BUTTON */}
//         <div className="position-relative">
//           <button
//             type="button"
//             className="profile-btn"
//             onClick={() => setShowProfileMenu(!showProfileMenu)}
//           >
//             <div className="profile-avatar">{firstLetter}</div>
//             <div className="profile-info">
//               <span className="profile-name">{displayName}</span>
//               <span className="profile-role">{displayRole}</span>
//             </div>
//             <i
//               className={`bi bi-chevron-${
//                 showProfileMenu ? "up" : "down"
//               } ms-1`}
//             ></i>
//           </button>

//           {/* DYNAMIC PROFILE DROPDOWN */}
//           {showProfileMenu && (
//             <div className="profile-dropdown position-absolute end-0 bg-white">
//               <div className="dropdown-profile-header border-bottom">
//                 <div className="profile-avatar large">{firstLetter}</div>
//                 <div>
//                   <strong>{displayName}</strong>
//                   {displayEmail ? (
//                     <small className="d-block text-muted">{displayEmail}</small>
//                   ) : (
//                     <small className="d-block text-muted">Admin User</small>
//                   )}
//                 </div>
//               </div>

//               <div className="dropdown-body py-1">
//                 {/* MY PROFILE - Navigates to Settings or Settings Page */}
//                 <button
//                   type="button"
//                   className="dropdown-item w-100 text-start border-0 bg-transparent"
//                   onClick={() => {
//                     setShowProfileMenu(false);
//                     navigate("/admin/settings");
//                   }}
//                 >
//                   <i className="bi bi-person"></i> My Profile
//                 </button>

//                 <button
//                   type="button"
//                   className="dropdown-item w-100 text-start border-0 bg-transparent"
//                   onClick={() => {
//                     setShowProfileMenu(false);
//                     navigate("/admin/settings");
//                   }}
//                 >
//                   <i className="bi bi-gear"></i> Account Settings
//                 </button>

//                 <div className="dropdown-divider my-1"></div>

//                 {/* LOGOUT */}
//                 <button
//                   type="button"
//                   className="dropdown-item logout-item w-100 text-start border-0 bg-transparent"
//                   onClick={() => {
//                     setShowProfileMenu(false);
//                     if (onLogout) onLogout();
//                   }}
//                 >
//                   <i className="bi bi-box-arrow-right"></i> Logout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin-navbar.css";

export default function AdminNavbar({
  onToggleSidebar,
  currentUser,
  onLogout,
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Extract dynamic values across all common API response property names
  const displayName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.full_name ||
    currentUser?.username ||
    currentUser?.firstName ||
    currentUser?.first_name ||
    currentUser?.adminName ||
    "Admin";

  const displayEmail =
    currentUser?.email ||
    currentUser?.userEmail ||
    currentUser?.emailAddress ||
    currentUser?.mail ||
    currentUser?.adminEmail ||
    "";

  const displayRole =
    currentUser?.role ||
    currentUser?.userRole ||
    currentUser?.roleName ||
    currentUser?.designation ||
    "Super Admin";

  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="admin-navbar">
      {/* TOGGLE BUTTON */}
      <button
        type="button"
        className="navbar-menu-btn"
        onClick={onToggleSidebar}
        title="Toggle Sidebar"
      >
        <i className="bi bi-layout-sidebar"></i>
      </button>

      {/* SEARCH BAR */}
      <div className="navbar-search">
        <i className="bi bi-search"></i>
        <input
          type="text"
          className="form-control"
          placeholder="Search courses, assessments..."
        />
      </div>

      {/* ACTIONS & PROFILE */}
      <div className="navbar-actions ms-auto d-flex align-items-center position-relative">
        <button type="button" className="navbar-icon-btn" title="Notifications">
          <i className="bi bi-bell"></i>
          <span className="notification-badge">3</span>
        </button>

        <div className="navbar-divider"></div>

        {/* PROFILE BUTTON */}
        <div className="position-relative">
          <button
            type="button"
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">{firstLetter}</div>
            <div className="profile-info">
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{displayRole}</span>
            </div>
            <i
              className={`bi bi-chevron-${
                showProfileMenu ? "up" : "down"
              } ms-1`}
            ></i>
          </button>

          {/* DYNAMIC PROFILE DROPDOWN */}
          {showProfileMenu && (
            <div className="profile-dropdown position-absolute end-0 bg-white">
              <div className="dropdown-profile-header border-bottom">
                <div className="profile-avatar large">{firstLetter}</div>
                <div>
                  <strong>{displayName}</strong>
                  {displayEmail ? (
                    <small className="d-block text-muted">{displayEmail}</small>
                  ) : (
                    <small className="d-block text-muted">{displayRole}</small>
                  )}
                </div>
              </div>

              <div className="dropdown-body py-1">
                {/* MY PROFILE */}
                <button
                  type="button"
                  className="dropdown-item w-100 text-start border-0 bg-transparent"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/admin/settings");
                  }}
                >
                  <i className="bi bi-person"></i> My Profile
                </button>

                <button
                  type="button"
                  className="dropdown-item w-100 text-start border-0 bg-transparent"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/admin/settings");
                  }}
                >
                  <i className="bi bi-gear"></i> Account Settings
                </button>

                <div className="dropdown-divider my-1"></div>

                {/* LOGOUT */}
                <button
                  type="button"
                  className="dropdown-item logout-item w-100 text-start border-0 bg-transparent"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}