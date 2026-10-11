
import React, {
  useEffect,
  useState,
} from "react";


import {
  useNavigate,
} from "react-router-dom";

import "../../styles/admin-navbar.css";


export default function AdminNavbar({
  onToggleSidebar,
  currentUser,
  onLogout,
}) {

  // ====================================================
  // NAVIGATION
  // ====================================================

  const navigate =
    useNavigate();


  // ====================================================
  // PROFILE DROPDOWN
  // ====================================================

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);


  // ====================================================
  // PROFILE POPUP
  // ====================================================

  const [
    showProfilePopup,
    setShowProfilePopup,
  ] = useState(false);


  // ====================================================
  // DYNAMIC USER NAME
  // ====================================================

  const displayName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.full_name ||
    currentUser?.username ||
    currentUser?.firstName ||
    currentUser?.first_name ||
    currentUser?.adminName ||
    "Admin";


  // ====================================================
  // DYNAMIC EMAIL
  // ====================================================

  const displayEmail =
    currentUser?.email ||
    currentUser?.userEmail ||
    currentUser?.emailAddress ||
    currentUser?.mail ||
    currentUser?.adminEmail ||
    "";


  // ====================================================
  // DYNAMIC ROLE
  // ====================================================

  const rawRole =
    currentUser?.role ||
    currentUser?.userRole ||
    currentUser?.roleName ||
    currentUser?.designation ||
    "SUPER_ADMIN";


  // ====================================================
  // FORMAT ROLE
  // ====================================================

  const displayRole =
    String(rawRole)
      .trim()
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");


  // ====================================================
  // DYNAMIC PHONE
  // ====================================================

  const displayPhone =
    currentUser?.phone ||
    currentUser?.contactNumber ||
    currentUser?.mobile ||
    currentUser?.mobileNumber ||
    "Not provided";


  // ====================================================
  // DYNAMIC ADDRESS
  // ====================================================

  const address =
    currentUser?.address || {};


  const displayAddress = [
    address?.street,
    address?.city,
    address?.state,
    address?.country,
    address?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");


  // ====================================================
  // AVATAR LETTER
  // ====================================================

  const firstLetter =
    displayName
      .charAt(0)
      .toUpperCase() ||
    "A";


  // ====================================================
  // CLOSE PROFILE POPUP WITH ESC KEY
  // ====================================================

  useEffect(() => {

    function handleEscape(event) {

      if (
        event.key === "Escape"
      ) {

        setShowProfilePopup(
          false
        );

      }

    }

    if (
      showProfilePopup
    ) {

      document.addEventListener(
        "keydown",
        handleEscape
      );

    }

    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, [
    showProfilePopup,
  ]);


  // ====================================================
  // LOGOUT
  // ====================================================

  async function handleLogout() {

    // --------------------------------------------------
    // Close dropdown
    // --------------------------------------------------

    setShowProfileMenu(
      false
    );


    // --------------------------------------------------
    // Close profile popup
    // --------------------------------------------------

    setShowProfilePopup(
      false
    );


    // --------------------------------------------------
    // Call parent logout
    // --------------------------------------------------

    if (onLogout) {

      try {

        await onLogout();

      } catch (error) {

        console.error(
          "Logout error:",
          error
        );

      }

    } else {

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    }

  }


  // ====================================================
  // OPEN PROFILE
  // ====================================================

  function handleOpenProfile() {

    setShowProfileMenu(
      false
    );

    setShowProfilePopup(
      true
    );

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="admin-navbar">

        {/* ==================================================
            TOGGLE BUTTON
        ================================================== */}

        <button
          type="button"
          className="navbar-menu-btn"
          onClick={
            onToggleSidebar
          }
          title="Toggle Sidebar"
        >
          <i className="bi bi-layout-sidebar"></i>
        </button>


        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="navbar-search">

          <i className="bi bi-search"></i>

          <input
            type="text"
            className="form-control"
            placeholder="Search courses, assessments..."
          />

        </div>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="navbar-actions ms-auto d-flex align-items-center position-relative">

          {/* NOTIFICATION */}

          <button
            type="button"
            className="navbar-icon-btn"
            title="Notifications"
          >

            <i className="bi bi-bell"></i>

            <span className="notification-badge">
              3
            </span>

          </button>


          {/* DIVIDER */}

          <div className="navbar-divider"></div>


          {/* ==================================================
              PROFILE BUTTON
          ================================================== */}

          <div className="position-relative">

            <button
              type="button"
              className="profile-btn"
              onClick={() =>
                setShowProfileMenu(
                  (previous) =>
                    !previous
                )
              }
            >

              {/* AVATAR */}

              <div className="profile-avatar">
                {firstLetter}
              </div>


              {/* USER INFO */}

              <div className="profile-info">

                <span className="profile-name">
                  {displayName}
                </span>

                <span className="profile-role">
                  {displayRole}
                </span>

              </div>


              {/* ARROW */}

              <i
                className={`
                  bi
                  bi-chevron-${
                    showProfileMenu
                      ? "up"
                      : "down"
                  }
                  ms-1
                `}
              ></i>

            </button>


            {/* ==================================================
                PROFILE DROPDOWN
            ================================================== */}

            {showProfileMenu && (

              <div className="profile-dropdown position-absolute end-0 bg-white">

                {/* HEADER */}

                <div className="dropdown-profile-header border-bottom">

                  <div className="profile-avatar large">
                    {firstLetter}
                  </div>

                  <div>

                    <strong>
                      {displayName}
                    </strong>

                    <small className="d-block text-muted">
                      {displayRole}
                    </small>

                    {displayEmail && (
                      <small className="d-block text-muted">
                        {displayEmail}
                      </small>
                    )}

                  </div>

                </div>


                {/* BODY */}

                <div className="dropdown-body py-1">

                  {/* ==================================================
                      MY PROFILE
                  ================================================== */}

                  <button
                    type="button"
                    className="dropdown-item w-100 text-start border-0 bg-transparent"
                    onClick={
                      handleOpenProfile
                    }
                  >

                    <i className="bi bi-person"></i>

                    {" "}

                    My Profile

                  </button>


                  {/* ==================================================
                      DIVIDER
                  ================================================== */}

                  <div className="dropdown-divider my-1"></div>


                  {/* ==================================================
                      LOGOUT
                  ================================================== */}

                  <button
                    type="button"
                    className="dropdown-item logout-item w-100 text-start border-0 bg-transparent"
                    onClick={
                      handleLogout
                    }
                  >

                    <i className="bi bi-box-arrow-right"></i>

                    {" "}

                    Logout

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* ==========================================================
          PROFILE POPUP
      ========================================================== */}

      {showProfilePopup && (

        <div
          className="profile-modal-overlay"
          onMouseDown={(event) => {

            /*
             * Close only when clicking the overlay itself.
             * Clicking inside the popup will not close it.
             */

            if (
              event.target ===
              event.currentTarget
            ) {

              setShowProfilePopup(
                false
              );

            }

          }}
        >

          <div
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >

            {/* ==================================================
                POPUP HEADER
            ================================================== */}

            <div className="profile-modal-header">

              <div>

                <h4
                  id="profile-modal-title"
                  className="mb-1"
                >
                  My Profile
                </h4>

                <p className="mb-0">
                  View your account information
                </p>

              </div>


              <button
                type="button"
                className="profile-modal-close"
                onClick={() =>
                  setShowProfilePopup(
                    false
                  )
                }
                aria-label="Close profile"
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>


            {/* ==================================================
                PROFILE HERO
            ================================================== */}

            <div className="profile-modal-hero">

              <div className="profile-modal-avatar">
                {firstLetter}
              </div>

              <div className="profile-modal-user">

                <h3>
                  {displayName}
                </h3>

                <span className="profile-modal-role">
                  {displayRole}
                </span>

              </div>

            </div>


            {/* ==================================================
                PROFILE INFORMATION
            ================================================== */}

            <div className="profile-modal-body">

              {/* EMAIL */}

              <div className="profile-detail-card">

                <div className="profile-detail-icon">
                  <i className="bi bi-envelope"></i>
                </div>

                <div className="profile-detail-content">

                  <span className="profile-detail-label">
                    Email Address
                  </span>

                  <span className="profile-detail-value">
                    {displayEmail || "Not provided"}
                  </span>

                </div>

              </div>


              {/* PHONE */}

              <div className="profile-detail-card">

                <div className="profile-detail-icon">
                  <i className="bi bi-telephone"></i>
                </div>

                <div className="profile-detail-content">

                  <span className="profile-detail-label">
                    Phone Number
                  </span>

                  <span className="profile-detail-value">
                    {displayPhone}
                  </span>

                </div>

              </div>


              {/* ROLE */}

              <div className="profile-detail-card">

                <div className="profile-detail-icon">
                  <i className="bi bi-person-badge"></i>
                </div>

                <div className="profile-detail-content">

                  <span className="profile-detail-label">
                    Role
                  </span>

                  <span className="profile-detail-value">
                    {displayRole}
                  </span>

                </div>

              </div>


              {/* ADDRESS */}

              <div className="profile-detail-card">

                <div className="profile-detail-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div className="profile-detail-content">

                  <span className="profile-detail-label">
                    Address
                  </span>

                  <span className="profile-detail-value">
                    {displayAddress || "Not provided"}
                  </span>

                </div>

              </div>

            </div>


            {/* ==================================================
                POPUP FOOTER
            ================================================== */}

            <div className="profile-modal-footer">

              <button
                type="button"
                className="profile-modal-done-btn"
                onClick={() =>
                  setShowProfilePopup(
                    false
                  )
                }
              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}