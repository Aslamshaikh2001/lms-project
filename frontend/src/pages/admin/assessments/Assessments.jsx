import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  getAssessments,
  deleteAssessment,
  publishAssessment,
  unpublishAssessment,
} from "../../../services/assessmentService";

export default function Assessments() {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Modal State for custom popup operations
  const [actionModal, setActionModal] = useState({
    show: false,
    type: null, // "publish" | "unpublish" | "delete"
    targetId: null,
    targetTitle: "",
    actionLoading: false,
  });

  // ======================================================
  // FETCH ASSESSMENTS
  // ======================================================

  const fetchAssessments = async (searchQuery = search) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = {
        page: 1,
        limit: 20,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await getAssessments(params);

      let assessmentList = [];

      if (Array.isArray(response?.data)) {
        assessmentList = response.data;
      } else if (Array.isArray(response?.data?.assessments)) {
        assessmentList = response.data.assessments;
      } else if (Array.isArray(response?.assessments)) {
        assessmentList = response.assessments;
      } else if (Array.isArray(response)) {
        assessmentList = response;
      }

      setAssessments(assessmentList);
    } catch (error) {
      console.error("Fetch assessments error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load assessments.";

      setErrorMessage(message);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAssessments();
  }, []);

  // Live Search Effect (Triggers fetch as user types)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssessments(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ======================================================
  // ACTION MODAL HANDLERS
  // ======================================================

  const openActionModal = (type, id, title) => {
    setActionModal({
      show: true,
      type,
      targetId: id,
      targetTitle: title || "Selected Assessment",
      actionLoading: false,
    });
  };

  const closeActionModal = () => {
    setActionModal({
      show: false,
      type: null,
      targetId: null,
      targetTitle: "",
      actionLoading: false,
    });
  };

  const handleConfirmAction = async () => {
    const { type, targetId } = actionModal;
    if (!targetId) return;

    setActionModal((prev) => ({ ...prev, actionLoading: true }));

    try {
      if (type === "publish") {
        await publishAssessment(targetId);
      } else if (type === "unpublish") {
        await unpublishAssessment(targetId);
      } else if (type === "delete") {
        await deleteAssessment(targetId);
      }

      closeActionModal();
      await fetchAssessments(); // Refresh table data
    } catch (error) {
      console.error(`Error executing ${type}:`, error);
      alert(
        error?.response?.data?.message || `Failed to perform ${type} operation.`
      );
      setActionModal((prev) => ({ ...prev, actionLoading: false }));
    }
  };

  // ======================================================
  // FORMATTERS & HELPERS
  // ======================================================

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const formattedStatus = status ? status.toUpperCase() : "DRAFT";
    switch (formattedStatus) {
      case "PUBLISHED":
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 fw-medium small">
            ● Published
          </span>
        );

      case "UNPUBLISHED":
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2.5 py-1 fw-medium small">
            ● Unpublished
          </span>
        );

      case "DRAFT":
      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-2.5 py-1 fw-medium small">
            ● Draft
          </span>
        );
    }
  };

  // ======================================================
  // ANIMATIONS
  // ======================================================

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.2 } },
  };

  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContentVariants = {
    hidden: { scale: 0.85, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
    exit: { scale: 0.85, opacity: 0, y: 20, transition: { duration: 0.15 } },
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 px-4">
      {/* Custom Styles */}
      <style>{`
        .full-card-shadow {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04) !important;
          border-radius: 12px;
        }

        /* Action Buttons & Spacing */
        .action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff !important;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .action-icon-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .btn-action-view { background-color: #2563eb; }
        .btn-action-view:hover { background-color: #1d4ed8; }

        .btn-action-edit { background-color: #f59e0b; }
        .btn-action-edit:hover { background-color: #d97706; }

        .btn-action-publish { background-color: #10b981; }
        .btn-action-publish:hover { background-color: #059669; }

        .btn-action-unpublish { background-color: #64748b; }
        .btn-action-unpublish:hover { background-color: #475569; }

        .btn-action-delete { background-color: #ef4444; }
        .btn-action-delete:hover { background-color: #dc2626; }

        /* Compact Search Input */
        .search-input-wrapper {
          position: relative;
          width: 100%;
          max-width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .clear-search-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 50%;
        }

        .clear-search-btn:hover {
          color: #475569;
          background-color: #f1f5f9;
        }

        .search-input-field {
          padding-left: 32px !important;
          padding-right: 28px !important;
          padding-top: 5px !important;
          padding-bottom: 5px !important;
          font-size: 0.875rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .search-input-field:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
        }
      `}</style>

      {/* HEADER */}
      <motion.div
        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Assessments</h1>
          <p className="text-muted small mb-0">
            Manage assessments, tests, and examinations easily.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/assessments/create")}
          className="btn btn-primary px-3 py-2 full-card-shadow d-flex align-items-center justify-content-center gap-2 rounded-2 fw-semibold btn-sm"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Create Assessment</span>
        </button>
      </motion.div>

      {/* COMPACT SEARCH BAR */}
      <motion.div
        className="card border-0 full-card-shadow mb-4 bg-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="card-body p-2 px-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search assessments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control search-input-field shadow-none"
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
                title="Clear search"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="alert alert-danger full-card-shadow border-0 mb-4 d-flex align-items-center justify-content-between py-2 px-3">
          <div className="small">
            <strong>Failed to load assessments:</strong> {errorMessage}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3 rounded-2 py-1 px-2"
            onClick={() => fetchAssessments()}
          >
            Retry
          </button>
        </div>
      )}

      {/* TABLE DATA */}
      <motion.div
        className="card border-0 full-card-shadow bg-white overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <div className="card-body p-0">
          {loading ? (
            <div className="p-5 text-center text-muted">
              <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mb-0 fw-medium small">Loading assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="p-5 text-center">
              <div className="fs-2 text-secondary opacity-50 mb-2">📝</div>
              <h6 className="fw-bold text-dark">No Assessments Found</h6>
              <p className="text-muted small mb-3">
                {search
                  ? "No assessments matched your search query."
                  : "Get started by creating your first assessment."}
              </p>
              {!search && (
                <button
                  onClick={() => navigate("/admin/assessments/create")}
                  className="btn btn-outline-primary btn-sm px-3 rounded-2"
                >
                  Create Assessment
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="bg-light text-secondary border-bottom">
                  <tr className="text-uppercase small fw-bold">
                    <th className="ps-4 py-3 text-start">Assessment</th>
                    <th className="py-3 text-center">Duration</th>
                    <th className="py-3 text-center">Total Marks</th>
                    <th className="py-3 text-center">Passing Marks</th>
                    <th className="py-3 text-center">Status</th>
                    <th className="py-3 text-center">Published Date</th>
                    <th className="pe-4 py-3 text-center" style={{ minWidth: "180px" }}>Actions</th>
                  </tr>
                </thead>

                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {assessments.map((assessment) => {
                      const assessmentId = assessment._id || assessment.id;
                      const isPublished = assessment.status?.toUpperCase() === "PUBLISHED";
                      const publishedDate = assessment.publishedAt || assessment.publishedDate || (isPublished ? assessment.updatedAt : null);

                      return (
                        <motion.tr
                          key={assessmentId}
                          variants={rowVariants}
                          exit="exit"
                          layout
                          className="border-bottom"
                          style={{ transition: "background-color 0.2s ease" }}
                        >
                          {/* TITLE & DESCRIPTION */}
                          <td className="ps-4 py-3">
                            <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: "260px" }}>
                              {assessment.title || "Untitled Assessment"}
                            </div>
                            <div
                              className="text-muted small text-truncate"
                              style={{ maxWidth: "260px" }}
                            >
                              {assessment.description || "No description provided"}
                            </div>
                          </td>

                          {/* DURATION */}
                          <td className="py-3 text-center text-secondary">
                            <span className="fw-medium text-dark">
                              {assessment.durationMinutes ?? assessment.duration ?? 0}
                            </span>{" "}
                            <span className="small text-muted">mins</span>
                          </td>

                          {/* TOTAL MARKS */}
                          <td className="py-3 text-center text-secondary fw-medium text-dark">
                            {assessment.totalMarks ?? 0} pts
                          </td>

                          {/* PASSING MARKS COLUMN */}
                          <td className="py-3 text-center">
                            <span className="badge bg-light text-dark border px-2 py-1 fw-semibold small">
                              {assessment.passingMarks ?? 0} pts
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="py-3 text-center">
                            {getStatusBadge(assessment.status)}
                          </td>

                          {/* PUBLISHED DATE COLUMN */}
                          <td className="py-3 text-center text-secondary small">
                            {formatDate(publishedDate)}
                          </td>

                          {/* ACTIONS COLUMN WITH FIXED GAPS */}
                          <td className="pe-4 py-3 text-center">
                            <div className="d-flex align-items-center justify-content-center" style={{ gap: "8px" }}>
                              {/* View Button */}
                              <button
                                onClick={() => navigate(`/admin/assessments/${assessmentId}`)}
                                className="action-icon-btn btn-action-view"
                                title="View Details"
                              >
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => navigate(`/admin/assessments/${assessmentId}/edit`)}
                                className="action-icon-btn btn-action-edit"
                                title="Edit Assessment"
                              >
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>

                              {/* Publish / Unpublish Button */}
                              {!isPublished ? (
                                <button
                                  onClick={() =>
                                    openActionModal(
                                      "publish",
                                      assessmentId,
                                      assessment.title
                                    )
                                  }
                                  className="action-icon-btn btn-action-publish"
                                  title="Publish Assessment"
                                >
                                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    openActionModal(
                                      "unpublish",
                                      assessmentId,
                                      assessment.title
                                    )
                                  }
                                  className="action-icon-btn btn-action-unpublish"
                                  title="Unpublish Assessment"
                                >
                                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                  </svg>
                                </button>
                              )}

                              {/* Delete Button */}
                              <button
                                onClick={() =>
                                  openActionModal(
                                    "delete",
                                    assessmentId,
                                    assessment.title
                                  )
                                }
                                className="action-icon-btn btn-action-delete"
                                title="Delete Assessment"
                              >
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* ANIMATED CUSTOM POPUP MODAL */}
      <AnimatePresence>
        {actionModal.show && (
          <motion.div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)" }}
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
              <motion.div
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="modal-content border-0 full-card-shadow text-center p-4 bg-white"
              >
                <div className="modal-body p-2">
                  {/* Dynamic Modal Icon */}
                  {actionModal.type === "delete" && (
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle mb-3 shadow-sm"
                      style={{ width: "52px", height: "52px" }}
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </div>
                  )}

                  {actionModal.type === "publish" && (
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3 shadow-sm"
                      style={{ width: "52px", height: "52px" }}
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  )}

                  {actionModal.type === "unpublish" && (
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis rounded-circle mb-3 shadow-sm"
                      style={{ width: "52px", height: "52px" }}
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    </div>
                  )}

                  {/* Header */}
                  <h5 className="fw-bold text-dark mb-2">
                    {actionModal.type === "delete" && "Delete Assessment"}
                    {actionModal.type === "publish" && "Publish Assessment"}
                    {actionModal.type === "unpublish" && "Unpublish Assessment"}
                  </h5>

                  <p className="text-muted small mb-1">
                    Target: <strong className="text-dark">{actionModal.targetTitle}</strong>
                  </p>

                  <p className="text-muted small mb-4 px-2">
                    {actionModal.type === "delete" &&
                      "Are you sure you want to delete this assessment? This action cannot be undone."}
                    {actionModal.type === "publish" &&
                      "Are you sure you want to publish this assessment? It will become active and accessible."}
                    {actionModal.type === "unpublish" &&
                      "Are you sure you want to unpublish this assessment? It will no longer be visible to candidates."}
                  </p>

                  {/* Modal Action Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-light w-50 py-2 fw-semibold rounded-2 text-secondary btn-sm"
                      onClick={closeActionModal}
                      disabled={actionModal.actionLoading}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className={`btn w-50 py-2 fw-semibold rounded-2 text-white btn-sm d-flex align-items-center justify-content-center gap-2 ${
                        actionModal.type === "delete"
                          ? "btn-danger"
                          : actionModal.type === "publish"
                          ? "btn-success"
                          : "btn-warning text-dark"
                      }`}
                      onClick={handleConfirmAction}
                      disabled={actionModal.actionLoading}
                    >
                      {actionModal.actionLoading && (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}