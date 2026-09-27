import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { createAssessment } from "../../../services/assessmentService";

export default function CreateAssessment() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ========================================
  // FORM DATA
  // ========================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    totalMarks: "",
    passingMarks: "",
    maxAttempts: 1,
    randomizeQuestions: false,
    shuffleOptions: false,
    negativeMarking: false,
    negativeMarks: 0,
    startDate: "",
    endDate: "",
    instructions: "",
  });

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ========================================
  // HANDLE SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!formData.title.trim()) {
      setError("Assessment title is required.");
      return;
    }

    if (!formData.durationMinutes) {
      setError("Assessment duration is required.");
      return;
    }

    if (!formData.totalMarks) {
      setError("Total marks are required.");
      return;
    }

    if (formData.passingMarks === "" || formData.passingMarks === null) {
      setError("Passing marks are required.");
      return;
    }

    const durationMinutes = Number(formData.durationMinutes);
    const totalMarks = Number(formData.totalMarks);
    const passingMarks = Number(formData.passingMarks);
    const maxAttempts = Number(formData.maxAttempts);

    if (durationMinutes < 1 || durationMinutes > 600) {
      setError("Duration must be between 1 and 600 minutes.");
      return;
    }

    if (totalMarks < 1) {
      setError("Total marks must be greater than 0.");
      return;
    }

    if (passingMarks < 0) {
      setError("Passing marks cannot be negative.");
      return;
    }

    if (passingMarks > totalMarks) {
      setError("Passing marks cannot be greater than total marks.");
      return;
    }

    if (maxAttempts < 1 || maxAttempts > 10) {
      setError("Maximum attempts must be between 1 and 10.");
      return;
    }

    if (formData.negativeMarking && Number(formData.negativeMarks) < 0) {
      setError("Negative marks cannot be negative.");
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        durationMinutes,
        totalMarks,
        passingMarks,
        maxAttempts,
        randomizeQuestions: Boolean(formData.randomizeQuestions),
        shuffleOptions: Boolean(formData.shuffleOptions),
        negativeMarking: Boolean(formData.negativeMarking),
        negativeMarks: formData.negativeMarking
          ? Number(formData.negativeMarks)
          : 0,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        instructions: formData.instructions.trim(),
      };

      await createAssessment(payload);
      setShowSuccessModal(true);

      setTimeout(() => {
        navigate("/admin/assessments");
      }, 2200);
    } catch (err) {
      console.error("Create Assessment Error:", err);
      const message =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create assessment";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate("/admin/assessments");
  };

  // ========================================
  // ANIMATION VARIANTS
  // ========================================

  const containerVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] },
    },
  };

  const alertVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 20,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, height: 0, marginBottom: 0 },
  };

  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContentVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
    exit: { scale: 0.85, opacity: 0, y: 15, transition: { duration: 0.15 } },
  };

  return (
    <div className="container py-4 bg-light min-vh-100 position-relative">
      {/* Custom Styling for Full Shadows & Form Controls */}
      <style>{`
        .full-card-shadow {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04) !important;
          border-radius: 16px;
        }

        .section-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }

        .custom-form-control {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 0.65rem 1rem;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background-color: #ffffff;
        }

        .custom-form-control:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
          background-color: #ffffff;
        }

        .checkbox-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1rem;
          background-color: #ffffff;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .checkbox-card:hover {
          border-color: #93c5fd;
          background-color: #f8fafc;
        }

        .btn-animated-primary {
          background-color: #2563eb;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
          border: none;
        }

        .btn-animated-primary:hover:not(:disabled) {
          background-color: #1d4ed8;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.45);
        }

        .btn-animated-secondary {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .btn-animated-secondary:hover:not(:disabled) {
          background-color: #e2e8f0;
          color: #1e293b;
        }
      `}</style>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.55)",
              backdropFilter: "blur(5px)",
              zIndex: 1055,
            }}
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
              <motion.div
                className="modal-content border-0 full-card-shadow text-center p-4 bg-white"
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="modal-body p-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3 shadow-sm"
                    style={{ width: "68px", height: "68px" }}
                  >
                    <svg width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </motion.div>

                  <h4 className="fw-bold text-dark mb-2">Assessment Created!</h4>
                  <p className="text-muted small mb-4">
                    Your assessment has been created and saved successfully. Redirecting to the assessments dashboard...
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleSuccessClose}
                    className="btn btn-animated-primary w-100 py-2.5 rounded-3 fw-semibold"
                  >
                    Continue Now
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="h3 fw-bold text-dark mb-1">Create Assessment</h1>
        <p className="text-muted small m-0">
          Configure new assessment parameters, time windows, and scoring parameters.
        </p>
      </motion.div>

      {/* MAIN FORM CARD */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="card full-card-shadow border-0 bg-white"
      >
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            {/* ERROR ALERT */}
            <AnimatePresence>
              {error && (
                <motion.div
                  variants={alertVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="alert alert-danger border-0 shadow-sm d-flex align-items-center justify-content-between rounded-3 px-3 py-3"
                  role="alert"
                >
                  <div className="d-flex align-items-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="fw-medium small">{error}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setError("")}
                    aria-label="Close"
                  ></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BASIC INFORMATION SECTION */}
            <div className="section-card mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Basic Information
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">
                    Assessment Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Mid-Term Software Architecture Examination"
                    className="form-control custom-form-control"
                    minLength={3}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Provide a short summary outlining the scope of this assessment..."
                    className="form-control custom-form-control"
                    maxLength={1000}
                  />
                </div>
              </div>
            </div>

            {/* ASSESSMENT SETTINGS SECTION */}
            <div className="section-card mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Assessment Settings
              </h5>

              <div className="row g-3">
                <div className="col-sm-6 col-md-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Duration (Mins) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    placeholder="60"
                    min="1"
                    max="600"
                    className="form-control custom-form-control"
                    required
                  />
                </div>

                <div className="col-sm-6 col-md-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Total Marks <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    className="form-control custom-form-control"
                    required
                  />
                </div>

                <div className="col-sm-6 col-md-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Passing Marks <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="passingMarks"
                    value={formData.passingMarks}
                    onChange={handleChange}
                    placeholder="40"
                    min="0"
                    className="form-control custom-form-control"
                    required
                  />
                </div>

                <div className="col-sm-6 col-md-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    name="maxAttempts"
                    value={formData.maxAttempts}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="form-control custom-form-control"
                  />
                </div>
              </div>
            </div>

            {/* QUESTION OPTIONS SECTION */}
            <div className="section-card mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="16 3 21 3 21 8"></polyline>
                  <line x1="4" y1="20" x2="21" y2="3"></line>
                  <polyline points="21 16 21 21 16 21"></polyline>
                  <line x1="15" y1="15" x2="21" y2="21"></line>
                  <line x1="4" y1="4" x2="9" y2="9"></line>
                </svg>
                Question Options
              </h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="checkbox-card h-100">
                    <div className="form-check m-0 d-flex align-items-center gap-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="randomizeQuestions"
                        name="randomizeQuestions"
                        checked={formData.randomizeQuestions}
                        onChange={handleChange}
                        style={{ width: "1.15em", height: "1.15em", cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label user-select-none fw-medium text-dark small"
                        htmlFor="randomizeQuestions"
                        style={{ cursor: "pointer" }}
                      >
                        Randomize Questions
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="checkbox-card h-100">
                    <div className="form-check m-0 d-flex align-items-center gap-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="shuffleOptions"
                        name="shuffleOptions"
                        checked={formData.shuffleOptions}
                        onChange={handleChange}
                        style={{ width: "1.15em", height: "1.15em", cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label user-select-none fw-medium text-dark small"
                        htmlFor="shuffleOptions"
                        style={{ cursor: "pointer" }}
                      >
                        Shuffle Options
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="checkbox-card h-100">
                    <div className="form-check m-0 d-flex align-items-center gap-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="negativeMarking"
                        name="negativeMarking"
                        checked={formData.negativeMarking}
                        onChange={handleChange}
                        style={{ width: "1.15em", height: "1.15em", cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label user-select-none fw-medium text-dark small"
                        htmlFor="negativeMarking"
                        style={{ cursor: "pointer" }}
                      >
                        Negative Marking
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC NEGATIVE MARKS INPUT */}
              <AnimatePresence>
                {formData.negativeMarking && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">
                          Negative Marks per Wrong Answer
                        </label>
                        <input
                          type="number"
                          name="negativeMarks"
                          value={formData.negativeMarks}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="form-control custom-form-control"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SCHEDULE SECTION */}
            <div className="section-card mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Schedule
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-control custom-form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="form-control custom-form-control"
                  />
                </div>
              </div>
            </div>

            {/* INSTRUCTIONS SECTION */}
            <div className="section-card mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Instructions
              </h5>

              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="4"
                placeholder="Enter rules, guidance, or details for candidates taking this assessment..."
                className="form-control custom-form-control"
                maxLength={3000}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="d-flex justify-content-end align-items-center gap-3 pt-3 border-top">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate("/admin/assessments")}
                className="btn btn-animated-secondary px-4 py-2.5 rounded-3 fw-semibold"
                disabled={loading}
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn btn-animated-primary px-4 py-2.5 rounded-3 fw-semibold d-flex align-items-center gap-2"
              >
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                <span>{loading ? "Creating..." : "Create Assessment"}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}