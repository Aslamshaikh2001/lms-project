import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileCheck2,
  History,
  LayoutDashboard,
  RefreshCw,
  Trophy,
  User,
  XCircle,
  ArrowRight,
  PlayCircle,
  Eye,
  ClipboardList,
} from "lucide-react";

import {
  getStudentDashboard,
} from "../../services/studentDashboardService";


/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.08,
    },
  },
};


const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
    },
  },
};


/* ============================================================
   HELPERS
   ============================================================ */

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "—";
  }
};


const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  try {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "—";
  }
};


const getInitials = (name) => {
  if (!name) {
    return "S";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`
    .toUpperCase();
};


const getStatusLabel = (status) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";

    case "SUBMITTED":
      return "Submitted";

    case "AUTO_SUBMITTED":
      return "Auto Submitted";

    case "ABANDONED":
      return "Abandoned";

    default:
      return status || "Unknown";
  }
};


/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  title,
  value,
  description,
  icon,
  iconClass,
  borderClass,
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`card border-0 shadow-sm h-100 ${borderClass || ""}`}
      style={{
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <p className="text-muted mb-2 fw-medium">
              {title}
            </p>

            <h2
              className="fw-bold mb-1"
              style={{
                fontSize: "2rem",
                color: "#1f2937",
              }}
            >
              {value}
            </h2>

            <small className="text-muted">
              {description}
            </small>
          </div>

          <div
            className={`rounded-4 d-flex align-items-center justify-content-center ${iconClass}`}
            style={{
              width: "52px",
              height: "52px",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

        </div>

      </div>
    </motion.div>
  );
}


/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({
  status,
}) {
  if (status === "IN_PROGRESS") {
    return (
      <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2">
        <Clock3 size={13} className="me-1" />
        In Progress
      </span>
    );
  }

  if (status === "SUBMITTED") {
    return (
      <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
        <CheckCircle2 size={13} className="me-1" />
        Submitted
      </span>
    );
  }

  if (status === "AUTO_SUBMITTED") {
    return (
      <span className="badge rounded-pill bg-info-subtle text-info-emphasis px-3 py-2">
        <FileCheck2 size={13} className="me-1" />
        Auto Submitted
      </span>
    );
  }

  if (status === "ABANDONED") {
    return (
      <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
        <XCircle size={13} className="me-1" />
        Abandoned
      </span>
    );
  }

  return (
    <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2">
      {getStatusLabel(status)}
    </span>
  );
}


/* ============================================================
   RESULT BADGE
   ============================================================ */

function ResultBadge({
  attempt,
}) {
  if (
    attempt?.resultStatus ===
    "PENDING_MANUAL_REVIEW"
  ) {
    return (
      <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2">
        Pending Review
      </span>
    );
  }

  if (attempt?.status === "IN_PROGRESS") {
    return (
      <span className="text-muted">
        Not submitted
      </span>
    );
  }

  if (attempt?.passed === true) {
    return (
      <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
        <Trophy size={13} className="me-1" />
        Passed
      </span>
    );
  }

  return (
    <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
      <XCircle size={13} className="me-1" />
      Failed
    </span>
  );
}


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function StudentDashboard() {

  const navigate = useNavigate();

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* ==========================================================
     FETCH DASHBOARD
     ========================================================== */

  const loadDashboard = useCallback(
    async (
      showRefreshLoader = false
    ) => {

      try {

        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await getStudentDashboard();

        if (
          response?.success &&
          response?.data
        ) {
          setDashboard(response.data);
        } else {
          throw new Error(
            response?.message ||
            "Failed to load dashboard."
          );
        }

      } catch (err) {

        console.error(
          "STUDENT DASHBOARD ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load student dashboard."
        );

      } finally {

        setLoading(false);
        setRefreshing(false);

      }

    },
    []
  );


  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  /* ==========================================================
     LOADING UI
     ========================================================== */

  if (loading) {
    return (
      <div
        className="container-fluid py-5"
        style={{
          background:
            "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
          minHeight: "100vh",
        }}
      >

        <div className="container-fluid">

          <div className="d-flex justify-content-center align-items-center py-5">

            <div className="text-center">

              <div
                className="spinner-border text-primary mb-3"
                style={{
                  width: "3rem",
                  height: "3rem",
                }}
              />

              <h5 className="fw-semibold">
                Loading your dashboard...
              </h5>

              <p className="text-muted mb-0">
                Please wait a moment.
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }


  /* ==========================================================
     ERROR UI
     ========================================================== */

  if (error && !dashboard) {
    return (
      <div
        className="container-fluid py-5"
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="card border-0 shadow-sm rounded-4"
          >

            <div className="card-body text-center py-5">

              <div
                className="mx-auto mb-4 rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center"
                style={{
                  width: "72px",
                  height: "72px",
                }}
              >
                <XCircle
                  size={34}
                  className="text-danger"
                />
              </div>

              <h4 className="fw-bold">
                Unable to load dashboard
              </h4>

              <p className="text-muted">
                {error}
              </p>

              <button
                type="button"
                className="btn btn-primary rounded-3 px-4"
                onClick={() =>
                  loadDashboard()
                }
              >
                <RefreshCw
                  size={17}
                  className="me-2"
                />
                Try Again
              </button>

            </div>

          </motion.div>

        </div>

      </div>
    );
  }


  /* ==========================================================
     SAFE DATA
     ========================================================== */

  const student =
    dashboard?.student || {};

  const statistics =
    dashboard?.statistics || {};

  const recentAttempts =
    Array.isArray(
      dashboard?.recentAttempts
    )
      ? dashboard.recentAttempts
      : [];


  const averageScore =
    Number(
      statistics.averageScore || 0
    );


  /* ==========================================================
     MAIN UI
     ========================================================== */

  return (
    <div
      className="container-fluid py-4"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #ffffff 55%, #f8fafc 100%)",
      }}
    >

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container-fluid px-2 px-md-4"
      >

        {/* =====================================================
            HEADER
            ===================================================== */}

        <motion.div
          variants={itemVariants}
          className="card border-0 shadow-sm mb-4 overflow-hidden"
          style={{
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, #0d6efd 0%, #4f46e5 100%)",
          }}
        >

          <div className="card-body p-4 p-lg-5 text-white">

            <div className="row align-items-center">

              <div className="col-lg-8">

                <div className="d-flex align-items-center gap-3 mb-3">

                  {/* Avatar */}

                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="rounded-circle border border-3 border-white"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "70px",
                        height: "70px",
                        fontSize: "1.35rem",
                      }}
                    >
                      {getInitials(
                        student.name
                      )}
                    </div>
                  )}

                  <div>

                    <div className="small opacity-75 mb-1">
                      Welcome back
                    </div>

                    <h1 className="fw-bold mb-1">
                      {student.name ||
                        "Student"}
                    </h1>

                    <div className="small opacity-75">
                      {student.email ||
                        "Student account"}
                    </div>

                  </div>

                </div>

                <p className="mb-0 opacity-75">
                  Track your assessments,
                  monitor your progress, and
                  continue your learning journey.
                </p>

              </div>


              <div className="col-lg-4 mt-4 mt-lg-0">

                <div className="d-flex justify-content-lg-end gap-2 flex-wrap">

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    className="btn btn-light rounded-3 px-4"
                    onClick={() =>
                      navigate(
                        "/student/assessments"
                      )
                    }
                  >
                    <BookOpen
                      size={17}
                      className="me-2"
                    />
                    Assessments
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    className="btn btn-outline-light rounded-3 px-4"
                    onClick={() =>
                      loadDashboard(true)
                    }
                    disabled={refreshing}
                  >
                    <RefreshCw
                      size={17}
                      className={`me-2 ${
                        refreshing
                          ? "spin"
                          : ""
                      }`}
                    />

                    Refresh
                  </motion.button>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* =====================================================
            STUDENT INFORMATION
            ===================================================== */}

        <motion.div
          variants={itemVariants}
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "18px",
          }}
        >

          <div className="card-body p-4">

            <div className="d-flex align-items-center mb-4">

              <div
                className="rounded-3 bg-primary-subtle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "45px",
                  height: "45px",
                }}
              >
                <User
                  size={21}
                  className="text-primary"
                />
              </div>

              <div>

                <h5 className="fw-bold mb-1">
                  Student Information
                </h5>

                <p className="text-muted mb-0 small">
                  Your account information
                </p>

              </div>

            </div>

            <div className="row g-3">

              <div className="col-md-4">

                <div className="bg-light rounded-3 p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Name
                  </small>

                  <span className="fw-semibold">
                    {student.name ||
                      "—"}
                  </span>

                </div>

              </div>

              <div className="col-md-4">

                <div className="bg-light rounded-3 p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Email
                  </small>

                  <span className="fw-semibold text-break">
                    {student.email ||
                      "—"}
                  </span>

                </div>

              </div>

              <div className="col-md-4">

                <div className="bg-light rounded-3 p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Role
                  </small>

                  <span className="badge bg-primary-subtle text-primary px-3 py-2">
                    {student.role ||
                      "STUDENT"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* =====================================================
            STATISTICS
            ===================================================== */}

        <div className="row g-4 mb-4">

          <div className="col-sm-6 col-xl-3">

            <StatCard
              title="Total Assessments"
              value={
                statistics.totalAssessments ||
                0
              }
              description="Published assessments"
              icon={
                <ClipboardList
                  size={24}
                  className="text-primary"
                />
              }
              iconClass="bg-primary-subtle"
            />

          </div>


          <div className="col-sm-6 col-xl-3">

            <StatCard
              title="Available"
              value={
                statistics.availableAssessments ||
                0
              }
              description="Currently available"
              icon={
                <BookOpen
                  size={24}
                  className="text-info"
                />
              }
              iconClass="bg-info-subtle"
            />

          </div>


          <div className="col-sm-6 col-xl-3">

            <StatCard
              title="Completed"
              value={
                statistics.completedAssessments ||
                0
              }
              description="Submitted attempts"
              icon={
                <CheckCircle2
                  size={24}
                  className="text-success"
                />
              }
              iconClass="bg-success-subtle"
            />

          </div>


          <div className="col-sm-6 col-xl-3">

            <StatCard
              title="In Progress"
              value={
                statistics.inProgressAssessments ||
                0
              }
              description="Active attempts"
              icon={
                <Clock3
                  size={24}
                  className="text-warning"
                />
              }
              iconClass="bg-warning-subtle"
            />

          </div>


          <div className="col-sm-6 col-xl-3">

            <StatCard
              title="Passed"
              value={
                statistics.passedAssessments ||
                0
              }
              description="Successful attempts"
              icon={
                <Trophy
                  size={24}
                  className="text-success"
                />
              }
              iconClass="bg-success-subtle"
            />

          </div>


          <div className="col-sm-6 col-xl-3">

            <StatCard
              title="Failed"
              value={
                statistics.failedAssessments ||
                0
              }
              description="Attempts below passing"
              icon={
                <XCircle
                  size={24}
                  className="text-danger"
                />
              }
              iconClass="bg-danger-subtle"
            />

          </div>


          <div className="col-sm-6 col-xl-6">

            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -6,
              }}
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
              }}
            >

              <div className="card-body p-4">

                <div className="row align-items-center">

                  <div className="col-md-5">

                    <div className="d-flex align-items-center">

                      <div
                        className="rounded-4 bg-warning-subtle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "55px",
                          height: "55px",
                        }}
                      >
                        <Award
                          size={27}
                          className="text-warning"
                        />
                      </div>

                      <div>

                        <p className="text-muted mb-1">
                          Average Score
                        </p>

                        <h2 className="fw-bold mb-0">
                          {averageScore}%
                        </h2>

                      </div>

                    </div>

                  </div>

                  <div className="col-md-7 mt-3 mt-md-0">

                    <div className="d-flex justify-content-between mb-2">

                      <small className="text-muted">
                        Overall performance
                      </small>

                      <small className="fw-semibold">
                        {averageScore}%
                      </small>

                    </div>

                    <div
                      className="progress"
                      style={{
                        height: "9px",
                        borderRadius: "20px",
                      }}
                    >

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${Math.min(
                            averageScore,
                            100
                          )}%`,
                        }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                        }}
                        className="progress-bar bg-warning"
                        role="progressbar"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>


        {/* =====================================================
            RECENT ATTEMPTS
            ===================================================== */}

        <motion.div
          variants={itemVariants}
          className="card border-0 shadow-sm"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >

          <div className="card-header bg-white border-0 p-4">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div className="d-flex align-items-center">

                <div
                  className="rounded-3 bg-primary-subtle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "45px",
                    height: "45px",
                  }}
                >
                  <History
                    size={21}
                    className="text-primary"
                  />
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    Recent Attempts
                  </h5>

                  <p className="text-muted mb-0 small">
                    Your latest assessment activity
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="btn btn-outline-primary rounded-3 px-3"
                onClick={() =>
                  navigate(
                    "/student/assessments"
                  )
                }
              >
                View Assessments
                <ArrowRight
                  size={16}
                  className="ms-2"
                />
              </button>

            </div>

          </div>


          <div className="card-body p-0">

            {recentAttempts.length === 0 ? (

              <div className="text-center py-5 px-3">

                <div
                  className="mx-auto mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{
                    width: "65px",
                    height: "65px",
                  }}
                >
                  <ClipboardList
                    size={28}
                    className="text-muted"
                  />
                </div>

                <h5 className="fw-semibold">
                  No Attempts Yet
                </h5>

                <p className="text-muted mb-4">
                  You have not started any
                  assessments yet.
                </p>

                <button
                  type="button"
                  className="btn btn-primary rounded-3 px-4"
                  onClick={() =>
                    navigate(
                      "/student/assessments"
                    )
                  }
                >
                  <BookOpen
                    size={17}
                    className="me-2"
                  />
                  Browse Assessments
                </button>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle mb-0">

                  <thead
                    style={{
                      background: "#f8fafc",
                    }}
                  >

                    <tr>

                      <th className="px-4 py-3 border-0">
                        Assessment
                      </th>

                      <th className="py-3 border-0">
                        Attempt
                      </th>

                      <th className="py-3 border-0">
                        Status
                      </th>

                      <th className="py-3 border-0">
                        Result
                      </th>

                      <th className="py-3 border-0">
                        Score
                      </th>

                      <th className="py-3 border-0">
                        Date
                      </th>

                      <th className="px-4 py-3 border-0 text-end">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentAttempts.map(
                      (attempt, index) => (

                        <motion.tr
                          key={
                            attempt.id ||
                            attempt._id ||
                            index
                          }
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index * 0.05,
                          }}
                        >

                          <td className="px-4">

                            <div>

                              <div className="fw-semibold">
                                {attempt.assessment
                                  ?.title ||
                                  "Assessment"}
                              </div>

                              <small className="text-muted">
                                {attempt.totalQuestions ||
                                  0}{" "}
                                questions
                              </small>

                            </div>

                          </td>


                          <td>

                            <span className="fw-semibold">
                              #
                              {attempt.attemptNumber ||
                                1}
                            </span>

                          </td>


                          <td>
                            <StatusBadge
                              status={
                                attempt.status
                              }
                            />
                          </td>


                          <td>
                            <ResultBadge
                              attempt={
                                attempt
                              }
                            />
                          </td>


                          <td>

                            {attempt.status ===
                            "IN_PROGRESS" ? (
                              <span className="text-muted">
                                —
                              </span>
                            ) : (
                              <div>

                                <span className="fw-bold">
                                  {attempt.score ||
                                    0}
                                  /
                                  {attempt.totalMarks ||
                                    0}
                                </span>

                                <small className="text-muted ms-2">
                                  (
                                  {attempt.percentage ||
                                    0}
                                  %)
                                </small>

                              </div>
                            )}

                          </td>


                          <td>

                            <small className="text-muted">
                              {formatDateTime(
                                attempt.startedAt
                              )}
                            </small>

                          </td>


                          <td className="px-4 text-end">

                            {attempt.status ===
                            "IN_PROGRESS" ? (

                              <button
                                type="button"
                                className="btn btn-sm btn-warning rounded-3 px-3"
                                onClick={() =>
                                  navigate(
                                    `/student/attempts/${attempt.id}`
                                  )
                                }
                              >
                                <PlayCircle
                                  size={15}
                                  className="me-1"
                                />
                                Resume
                              </button>

                            ) : (

                              <div className="d-flex justify-content-end gap-2">

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary rounded-3"
                                  title="View Result"
                                  onClick={() =>
                                    navigate(
                                      `/student/attempts/${attempt.id}/result`
                                    )
                                  }
                                >
                                  <Eye
                                    size={15}
                                  />
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary rounded-3"
                                  title="Review Answers"
                                  onClick={() =>
                                    navigate(
                                      `/student/attempts/${attempt.id}/review`
                                    )
                                  }
                                >
                                  <History
                                    size={15}
                                  />
                                </button>

                              </div>

                            )}

                          </td>

                        </motion.tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </motion.div>


        {/* =====================================================
            FOOTER INFORMATION
            ===================================================== */}

        <motion.div
          variants={itemVariants}
          className="mt-4 text-center"
        >

          <small className="text-muted">
            Keep learning, keep practicing, and
            keep improving your assessment scores.
          </small>

        </motion.div>

      </motion.div>


      {/* =======================================================
          SMALL ANIMATION STYLE
          ======================================================= */}

      <style>
        {`
          .spin {
            animation: dashboardSpin 0.9s linear infinite;
          }

          @keyframes dashboardSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          .table tbody tr {
            transition: background-color 0.2s ease;
          }

          .table tbody tr:hover {
            background-color: #f8fafc;
          }
        `}
      </style>

    </div>
  );
}