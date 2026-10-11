
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/student-navbar.css";

export default function StudentNavbar({
  currentUser,
  onLogout,
  onToggleSidebar,
}) {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Student details
  const displayName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.full_name ||
    currentUser?.username ||
    currentUser?.firstName ||
    currentUser?.first_name ||
    "Student";

  const displayEmail =
    currentUser?.email ||
    currentUser?.userEmail ||
    currentUser?.emailAddress ||
    "";

  const displayRole =
    String(
      currentUser?.role ||
      currentUser?.userRole ||
      currentUser?.roleName ||
      "STUDENT"
    )
      .trim()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const firstLetter = displayName.trim().charAt(0).toUpperCase() || "S";

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleOpenProfile() {
    setShowProfileMenu(false);
    navigate("/student/profile");
  }

  async function handleStudentLogout() {
    setShowProfileMenu(false);

    if (typeof onLogout === "function") {
      await onLogout();
    } else {
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="student-navbar">
      {/* Sidebar toggle */}
      <button
        type="button"
        className="student-navbar-menu-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle student sidebar"
        title="Toggle Sidebar"
      >
        <i className="bi bi-layout-sidebar" />
      </button>

      {/* Search */}
      <div className="student-navbar-search">
        <i className="bi bi-search" />
        <input
          type="search"
          placeholder="Search courses, assessments..."
          aria-label="Search courses and assessments"
        />
      </div>

      <div className="student-navbar-actions">
        {/* Notifications */}
        <button
          type="button"
          className="student-navbar-icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <i className="bi bi-bell" />
        </button>

        <div className="student-navbar-divider" />

        {/* Independent student profile dropdown */}
        <div className="student-profile-container" ref={profileRef}>
          <button
            type="button"
            className="student-profile-btn"
            onClick={() => {
              setShowProfileMenu((previous) => !previous);
            }}
            aria-expanded={showProfileMenu}
            aria-haspopup="menu"
            aria-label="Open student profile menu"
          >
            <span className="student-profile-avatar">{firstLetter}</span>

            <span className="student-profile-info">
              <span className="student-profile-name">{displayName}</span>
              <span className="student-profile-role">{displayRole}</span>
            </span>

            <i
              className={`bi ${
                showProfileMenu ? "bi-chevron-up" : "bi-chevron-down"
              } student-profile-arrow`}
            />
          </button>

          {showProfileMenu && (
            <div className="student-profile-dropdown" role="menu">
              {/* Student information */}
              <div className="student-dropdown-header">
                <span className="student-profile-avatar student-avatar-large">
                  {firstLetter}
                </span>

                <div className="student-dropdown-user-details">
                  <strong>{displayName}</strong>
                  <span>{displayRole}</span>
                  {displayEmail && <span>{displayEmail}</span>}
                </div>
              </div>

              <div className="student-dropdown-divider" />

              {/* My Profile */}
              <button
                type="button"
                className="student-dropdown-item"
                onClick={handleOpenProfile}
                role="menuitem"
              >
                <i className="bi bi-person" />
                <span>My Profile</span>
              </button>

              {/* Logout */}
              <button
                type="button"
                className="student-dropdown-item student-logout-item"
                onClick={handleStudentLogout}
                role="menuitem"
              >
                <i className="bi bi-box-arrow-right" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
