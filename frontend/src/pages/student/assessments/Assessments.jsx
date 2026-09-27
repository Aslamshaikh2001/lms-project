import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getStudentAssessments } from "../../../services/studentAssessmentService.js";

export default function Assessments() {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // ======================================================
  // SAFE DATE FORMATTER
  // ======================================================
  const formatDate = (dateString) => {
    if (!dateString) return "Anytime";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Anytime";
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Anytime";
    }
  };

  // ======================================================
  // AVAILABILITY BADGE & BUTTON CALCULATOR
  // ======================================================
  const getAvailability = (assessment) => {
    const now = new Date();
    const startDate = assessment?.startDate ? new Date(assessment.startDate) : null;
    const endDate = assessment?.endDate ? new Date(assessment.endDate) : null;

    if (startDate && !isNaN(startDate.getTime()) && now < startDate) {
      return {
        text: "Upcoming",
        badgeStyle: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
        btnStyle: "btn-secondary opacity-75",
        isAvailable: true,
      };
    }

    if (endDate && !isNaN(endDate.getTime()) && now > endDate) {
      return {
        text: "Expired",
        badgeStyle: "bg-secondary-subtle text-secondary border border-secondary-subtle",
        btnStyle: "btn-secondary opacity-50",
        isAvailable: false,
      };
    }

    return {
      text: "Available",
      badgeStyle: "bg-success-subtle text-success border border-success-subtle",
      btnStyle: "btn-primary shadow-sm",
      isAvailable: true,
    };
  };

  // ======================================================
  // SAFE FETCH FUNCTION
  // ======================================================
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStudentAssessments({
        search: search ? search.trim() : "",
        page: page || 1,
        limit: 10,
      });

      // Defensive Extraction for API response variations
      let rawData = [];
      if (Array.isArray(response)) {
        rawData = response;
      } else if (Array.isArray(response?.data)) {
        rawData = response.data;
      } else if (Array.isArray(response?.assessments)) {
        rawData = response.assessments;
      } else if (Array.isArray(response?.data?.assessments)) {
        rawData = response.data.assessments;
      }

      setAssessments(rawData);

      const totalItems = response?.pagination?.total || response?.total || rawData.length || 0;
      const totalPages = response?.pagination?.totalPages || response?.totalPages || Math.ceil(totalItems / 10) || 1;

      setPagination({
        total: totalItems,
        page: page || 1,
        limit: 10,
        totalPages: totalPages,
      });
    } catch (err) {
      console.error("Fetch assessments error:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load assessments."
      );
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssessments();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search]);

  return (
    <div className="w-100 min-vh-100 bg-light p-4 p-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">Assessments</h1>
        <p className="text-muted small mb-0">
          View and complete your assigned assessment modules.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body p-2 p-md-3">
          <div className="position-relative">
            <span
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              style={{ fontSize: "1rem" }}
            >
              🔍
            </span>
            <input
              type="text"
              className="form-control border-0 bg-light py-2 ps-5 rounded-3 shadow-none"
              placeholder="Search assessments by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="alert alert-danger border-0 shadow-sm rounded-3 d-flex justify-content-between align-items-center mb-4">
          <span>
            <strong>Error:</strong> {error}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger rounded-2"
            onClick={fetchAssessments}
          >
            Retry
          </button>
        </div>
      )}

      {/* MAIN RENDER LOGIC */}
      {loading ? (
        <div className="card border-0 shadow-sm rounded-3 p-5 text-center">
          <div className="spinner-border text-primary mx-auto" role="status" />
          <p className="text-muted mt-3 mb-0 small">Loading assessments...</p>
        </div>
      ) : !Array.isArray(assessments) || assessments.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-3 p-5 text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#eef2ff",
              fontSize: "1.5rem",
            }}
          >
            📋
          </div>
          <h5 className="fw-bold text-dark mb-1">No Assessments Found</h5>
          <p className="text-muted small mb-0">
            {search
              ? "No assessments matched your search keyword."
              : "There are currently no active assessments assigned to you."}
          </p>
        </div>
      ) : (
        /* GRID CARDS */
        <div className="row g-4">
          <AnimatePresence>
            {assessments.map((assessment, index) => {
              if (!assessment) return null;
              const availability = getAvailability(assessment);

              return (
                <div
                  key={assessment._id || assessment.id || index}
                  className="col-12 col-md-6 col-xl-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="card border-0 shadow-sm rounded-3 h-100"
                  >
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      <div>
                        {/* TITLE & BADGE */}
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <h2 className="h5 fw-bold text-dark mb-0 text-capitalize">
                            {assessment.title || "Untitled Assessment"}
                          </h2>
                          <span
                            className={`badge rounded-pill px-3 py-2 fw-medium ${availability.badgeStyle}`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {availability.text}
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        <p
                          className="text-muted small mb-3"
                          style={{ minHeight: "2.5rem" }}
                        >
                          {assessment.description || "No description available."}
                        </p>

                        {/* METRICS */}
                        <div className="bg-light p-3 rounded-3 mb-3">
                          <div className="row g-2">
                            <div className="col-6">
                              <span className="text-muted d-block small">
                                Duration
                              </span>
                              <strong className="text-dark small">
                                {assessment.durationMinutes || 0} min
                              </strong>
                            </div>

                            <div className="col-6">
                              <span className="text-muted d-block small">
                                Total Marks
                              </span>
                              <strong className="text-dark small">
                                {assessment.totalMarks || 0}
                              </strong>
                            </div>

                            <div className="col-6">
                              <span className="text-muted d-block small">
                                Passing Marks
                              </span>
                              <strong className="text-dark small">
                                {assessment.passingMarks || 0}
                              </strong>
                            </div>

                            <div className="col-6">
                              <span className="text-muted d-block small">
                                Max Attempts
                              </span>
                              <strong className="text-dark small">
                                {assessment.maxAttempts || 1}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* START DATE */}
                        <div className="mb-3">
                          <span className="text-muted small">
                            Available from:{" "}
                            <strong className="text-dark">
                              {formatDate(assessment.startDate)}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* ACTION BUTTON */}
                      <button
                        type="button"
                        className={`btn w-100 py-2 fw-medium rounded-3 ${availability.btnStyle}`}
                        disabled={!availability.isAvailable}
                        onClick={() =>
                          navigate(
                            `/student/assessments/${
                              assessment._id || assessment.id
                            }`
                          )
                        }
                      >
                        {availability.text === "Available"
                          ? "View Assessment"
                          : availability.text}
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary px-3 py-1.5 rounded-3"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="small text-muted fw-medium">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            className="btn btn-outline-secondary px-3 py-1.5 rounded-3"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}