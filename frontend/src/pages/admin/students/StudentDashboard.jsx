import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function StudentDashboard() {

  const { user } = useAuth();

  const studentName =
    user?.name ||
    "Student";

  return (
    <div className="container-fluid px-0">

      {/* ==================================================
          HEADER
          ================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="mb-4"
      >

        <h1 className="h3 fw-bold text-dark mb-1">
          Student Dashboard
        </h1>

        <p className="text-muted mb-0">
          Welcome back, {studentName}! Here's your
          learning overview.
        </p>

      </motion.div>


      {/* ==================================================
          STATISTICS
          ================================================== */}

      <div className="row g-4 mb-4">

        <StatCard
          title="Enrolled Courses"
          value="0"
          icon="bi-book"
        />

        <StatCard
          title="Completed Courses"
          value="0"
          icon="bi-check-circle"
        />

        <StatCard
          title="Assessments"
          value="0"
          icon="bi-file-earmark-text"
        />

        <StatCard
          title="Certificates"
          value="0"
          icon="bi-award"
        />

      </div>


      {/* ==================================================
          QUICK ACCESS
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-3 mb-4">

        <div className="card-body p-4">

          <h2 className="h5 fw-bold text-dark mb-1">
            Quick Access
          </h2>

          <p className="text-muted small mb-4">
            Quickly access your learning activities.
          </p>


          <div className="row g-3">

            <QuickLink
              title="My Courses"
              description="View your enrolled courses"
              icon="bi-book"
              path="/student/courses"
            />

            <QuickLink
              title="Assessments"
              description="View available assessments"
              icon="bi-file-earmark-text"
              path="/student/assessments"
            />

            <QuickLink
              title="My Results"
              description="View your assessment results"
              icon="bi-bar-chart"
              path="/student/results"
            />

            <QuickLink
              title="Certificates"
              description="View your certificates"
              icon="bi-award"
              path="/student/certificates"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          UPCOMING ASSESSMENTS
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-3 mb-4">

        <div className="card-body p-4">

          <h2 className="h5 fw-bold text-dark mb-1">
            Upcoming Assessments
          </h2>

          <p className="text-muted small mb-0">
            Your upcoming assessments will appear here.
          </p>


          <div className="text-center py-5">

            <i className="bi bi-file-earmark-text fs-1 text-secondary"></i>

            <h3 className="h6 fw-semibold mt-3">
              No Upcoming Assessments
            </h3>

            <p className="text-muted small mb-0">
              There are currently no upcoming assessments.
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================
          RECENT RESULTS
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-3">

        <div className="card-body p-4">

          <h2 className="h5 fw-bold text-dark mb-1">
            Recent Results
          </h2>

          <p className="text-muted small">
            Your latest assessment results will appear here.
          </p>


          <div className="text-center py-5">

            <i className="bi bi-bar-chart fs-1 text-secondary"></i>

            <h3 className="h6 fw-semibold mt-3">
              No Results Yet
            </h3>

            <p className="text-muted small mb-0">
              Complete an assessment to see your result.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ======================================================
   STAT CARD
   ====================================================== */

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <motion.div
      className="col-12 col-sm-6 col-xl-3"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
    >

      <div className="card border-0 shadow-sm rounded-3 h-100">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between">

            <div>

              <p className="text-muted small mb-2">
                {title}
              </p>

              <h2 className="fw-bold text-dark mb-0">
                {value}
              </h2>

            </div>


            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#eaf2ff",
              }}
            >

              <i
                className={`bi ${icon} text-primary fs-4`}
              ></i>

            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}


/* ======================================================
   QUICK LINK
   ====================================================== */

function QuickLink({
  title,
  description,
  icon,
  path,
}) {
  return (
    <div className="col-12 col-md-6 col-xl-3">

      <NavLink
        to={path}
        className="text-decoration-none"
      >

        <div className="border rounded-3 p-4 h-100">

          <div
            className="d-flex align-items-center justify-content-center rounded-3 mb-3"
            style={{
              width: "45px",
              height: "45px",
              backgroundColor: "#eaf2ff",
            }}
          >

            <i
              className={`bi ${icon} text-primary fs-5`}
            ></i>

          </div>


          <h3 className="h6 fw-bold text-dark mb-1">
            {title}
          </h3>


          <p className="small text-muted mb-0">
            {description}
          </p>

        </div>

      </NavLink>

    </div>
  );
}