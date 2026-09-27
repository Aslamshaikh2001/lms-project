import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getQuestions,
  deleteQuestion,
  publishQuestion,
  unpublishQuestion,
} from "../../../services/questionService";

const getTypeLabel = (type) => {
  const labels = {
    MCQ: "Multiple Choice",
    MULTIPLE_SELECT: "Multiple Select",
    TRUE_FALSE: "True / False",
    SHORT_ANSWER: "Short Answer",
    LONG_ANSWER: "Long Answer",
  };
  return labels[type] || type;
};

export default function Questions() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const [error, setError] = useState("");

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getQuestions({
        search,
        status,
        questionType,
        page,
        limit: 10,
      });

      setQuestions(response.data || []);
      setPagination(
        response.pagination || {
          total: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      console.error("Fetch questions error:", err);
      setError(err.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQuestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, status, questionType, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete question");
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishQuestion(id);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish question");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await unpublishQuestion(id);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unpublish question");
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 px-4">
      {/* Styles & Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animated-row {
          animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: background-color 0.2s ease;
        }

        .animated-row:hover {
          background-color: #f8fafc !important;
        }

        .full-card-shadow {
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04) !important;
          border-radius: 14px;
        }

        /* Colored Action Icons styling */
        .action-icon-btn {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff !important;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .action-icon-btn:hover {
          transform: translateY(-3px) scale(1.1);
        }

        /* Action background colors with soft colored glowing shadows */
        .btn-action-view {
          background-color: #2563eb;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }
        .btn-action-view:hover {
          background-color: #1d4ed8;
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.45);
        }

        .btn-action-edit {
          background-color: #f59e0b;
          box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
        }
        .btn-action-edit:hover {
          background-color: #d97706;
          box-shadow: 0 6px 14px rgba(245, 158, 11, 0.45);
        }

        .btn-action-publish {
          background-color: #10b981;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
        }
        .btn-action-publish:hover {
          background-color: #059669;
          box-shadow: 0 6px 14px rgba(16, 185, 129, 0.45);
        }

        .btn-action-unpublish {
          background-color: #64748b;
          box-shadow: 0 4px 10px rgba(100, 116, 139, 0.3);
        }
        .btn-action-unpublish:hover {
          background-color: #475569;
          box-shadow: 0 6px 14px rgba(100, 116, 139, 0.45);
        }

        .btn-action-delete {
          background-color: #ef4444;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.35);
        }
        .btn-action-delete:hover {
          background-color: #dc2626;
          box-shadow: 0 6px 14px rgba(239, 68, 68, 0.5);
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          display: flex;
          align-items: center;
        }

        .search-input-field {
          padding-left: 40px !important;
        }
      `}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Questions Management</h1>
          <p className="text-muted small mb-0">Organize and publish your assessment questions easily</p>
        </div>

        <button
          className="btn btn-primary px-4 py-2 full-card-shadow d-flex align-items-center gap-2 rounded-3 fw-semibold"
          onClick={() => navigate("/admin/questions/create")}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Question
        </button>
      </div>

      {error && <div className="alert alert-danger full-card-shadow border-0 mb-4">{error}</div>}

      {/* FILTERS */}
      <div className="card border-0 full-card-shadow mb-4 bg-white">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-6 search-input-wrapper">
              <span className="search-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                className="form-control border-light-subtle search-input-field rounded-3 shadow-none py-2"
                placeholder="Search question text..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select border-light-subtle rounded-3 shadow-none py-2"
                value={questionType}
                onChange={(e) => {
                  setQuestionType(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Question Types</option>
                <option value="MCQ">Multiple Choice</option>
                <option value="MULTIPLE_SELECT">Multiple Select</option>
                <option value="TRUE_FALSE">True / False</option>
                <option value="SHORT_ANSWER">Short Answer</option>
                <option value="LONG_ANSWER">Long Answer</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select border-light-subtle rounded-3 shadow-none py-2"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="UNPUBLISHED">Unpublished</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 full-card-shadow bg-white overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-3 mb-0 small">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-secondary opacity-50 mb-2">📝</div>
              <h6 className="fw-bold text-dark">No questions found</h6>
              <p className="text-muted small mb-0">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="bg-light text-secondary border-bottom">
                  <tr className="text-uppercase small fw-bold">
                    <th className="py-3 px-3 text-center" style={{ width: "60px" }}>#</th>
                    <th className="py-3 text-start">Question</th>
                    <th className="py-3 text-start">Assessment</th>
                    <th className="py-3 text-center">Type</th>
                    <th className="py-3 text-center">Marks</th>
                    <th className="py-3 text-center">Status</th>
                    <th className="py-3 text-center" style={{ minWidth: "180px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {questions.map((question, index) => (
                    <tr
                      key={question._id}
                      className="animated-row border-bottom"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      {/* # (Center Aligned) */}
                      <td className="text-muted small text-center px-3 fw-medium">
                        {(page - 1) * 10 + index + 1}
                      </td>

                      {/* Question Text (Left Aligned) */}
                      <td className="text-start pe-3">
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: "320px" }}>
                          {question.questionText}
                        </div>
                      </td>

                      {/* Assessment (Left Aligned) */}
                      <td className="text-start">
                        <span className="text-muted small">
                          {question.assessment?.title || "Java software developer"}
                        </span>
                      </td>

                      {/* Question Type (Center Aligned) */}
                      <td className="text-center">
                        <span className="badge bg-light text-dark border fw-normal px-2.5 py-1.5 rounded-2">
                          {getTypeLabel(question.questionType)}
                        </span>
                      </td>

                      {/* Marks (Center Aligned) */}
                      <td className="fw-bold text-dark text-center">
                        {question.marks}
                      </td>

                      {/* Status (Center Aligned) */}
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill fw-medium px-3 py-1.5 ${
                            question.status === "PUBLISHED"
                              ? "bg-success-subtle text-success border border-success-subtle"
                              : question.status === "UNPUBLISHED"
                              ? "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                              : "bg-secondary-subtle text-secondary border border-secondary-subtle"
                          }`}
                        >
                          {question.status}
                        </span>
                      </td>

                      {/* ACTIONS (INLINE FILLED COLORED ICON BUTTONS) */}
                      <td className="text-center py-2">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {/* View Button (Blue Background) */}
                          <button
                            className="action-icon-btn btn-action-view"
                            title="View Question"
                            onClick={() => navigate(`/admin/questions/${question._id}`)}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>

                          {/* Edit Button (Amber Background) */}
                          <button
                            className="action-icon-btn btn-action-edit"
                            title="Edit Question"
                            onClick={() => navigate(`/admin/questions/${question._id}/edit`)}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>

                          {/* Publish / Unpublish Button (Green or Slate Background) */}
                          {question.status !== "PUBLISHED" ? (
                            <button
                              className="action-icon-btn btn-action-publish"
                              title="Publish Question"
                              onClick={() => handlePublish(question._id)}
                            >
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            </button>
                          ) : (
                            <button
                              className="action-icon-btn btn-action-unpublish"
                              title="Unpublish Question"
                              onClick={() => handleUnpublish(question._id)}
                            >
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                              </svg>
                            </button>
                          )}

                          {/* Delete Button (Red Background) */}
                          <button
                            className="action-icon-btn btn-action-delete"
                            title="Delete Question"
                            onClick={() => handleDelete(question._id)}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && pagination.totalPages > 0 && (
          <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center py-3 px-4">
            <span className="text-muted small">
              Showing total <strong className="text-dark">{pagination.total}</strong> questions
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary px-3 rounded-2"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>

              <span className="badge bg-light text-dark border fw-normal px-3 py-2 rounded-2">
                Page {page} of {pagination.totalPages}
              </span>

              <button
                className="btn btn-sm btn-outline-secondary px-3 rounded-2"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}