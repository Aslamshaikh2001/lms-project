import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  getAssessmentById,
  updateAssessment,
} from "../../../services/assessmentService";

export default function EditAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  // ======================================================
  // LOAD ASSESSMENT
  // ======================================================

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAssessmentById(id);

        console.log("Assessment API Response:", response);

        const assessment = response?.data;

        if (!assessment) {
          throw new Error("Assessment not found");
        }

        setFormData({
          title: assessment.title || "",
          description: assessment.description || "",

          durationMinutes:
            assessment.durationMinutes ?? "",

          totalMarks:
            assessment.totalMarks ?? "",

          passingMarks:
            assessment.passingMarks ?? "",

          maxAttempts:
            assessment.maxAttempts ?? 1,

          randomizeQuestions:
            Boolean(assessment.randomizeQuestions),

          shuffleOptions:
            Boolean(assessment.shuffleOptions),

          negativeMarking:
            Boolean(assessment.negativeMarking),

          negativeMarks:
            assessment.negativeMarks ?? 0,

          startDate:
            convertToDateTimeLocal(assessment.startDate),

          endDate:
            convertToDateTimeLocal(assessment.endDate),

          instructions:
            assessment.instructions || "",
        });
      } catch (err) {
        console.error(
          "Get Assessment Details Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load assessment"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssessment();
    }
  }, [id]);

  // ======================================================
  // DATE CONVERSION
  // MongoDB ISO date -> datetime-local value
  // ======================================================

  const convertToDateTimeLocal = (date) => {
    if (!date) {
      return "";
    }

    try {
      const d = new Date(date);

      if (Number.isNaN(d.getTime())) {
        return "";
      }

      const year = d.getFullYear();

      const month = String(
        d.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        d.getDate()
      ).padStart(2, "0");

      const hours = String(
        d.getHours()
      ).padStart(2, "0");

      const minutes = String(
        d.getMinutes()
      ).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error(
        "Date conversion error:",
        error
      );

      return "";
    }
  };

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ======================================================
  // CLIENT SIDE VALIDATION
  // ======================================================

  const validateForm = () => {
    const errors = [];

    const title =
      formData.title.trim();

    const duration =
      Number(formData.durationMinutes);

    const totalMarks =
      Number(formData.totalMarks);

    const passingMarks =
      Number(formData.passingMarks);

    const maxAttempts =
      Number(formData.maxAttempts);

    const negativeMarks =
      Number(formData.negativeMarks);

    // Title
    if (!title) {
      errors.push(
        "Assessment title is required"
      );
    } else if (title.length < 3) {
      errors.push(
        "Assessment title must be at least 3 characters"
      );
    } else if (title.length > 150) {
      errors.push(
        "Assessment title cannot exceed 150 characters"
      );
    }

    // Duration
    if (
      !formData.durationMinutes ||
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 600
    ) {
      errors.push(
        "Duration must be between 1 and 600 minutes"
      );
    }

    // Total Marks
    if (
      !formData.totalMarks ||
      !Number.isFinite(totalMarks) ||
      totalMarks <= 0
    ) {
      errors.push(
        "Total marks must be greater than 0"
      );
    }

    // Passing Marks
    if (
      formData.passingMarks === "" ||
      !Number.isFinite(passingMarks) ||
      passingMarks < 0
    ) {
      errors.push(
        "Passing marks cannot be negative"
      );
    }

    if (
      Number.isFinite(passingMarks) &&
      Number.isFinite(totalMarks) &&
      passingMarks > totalMarks
    ) {
      errors.push(
        "Passing marks cannot be greater than total marks"
      );
    }

    // Max Attempts
    if (
      !Number.isInteger(maxAttempts) ||
      maxAttempts < 1 ||
      maxAttempts > 10
    ) {
      errors.push(
        "Maximum attempts must be between 1 and 10"
      );
    }

    // Negative Marks
    if (formData.negativeMarking) {
      if (
        !Number.isFinite(negativeMarks) ||
        negativeMarks < 0
      ) {
        errors.push(
          "Negative marks cannot be negative"
        );
      }
    }

    // Description
    if (
      formData.description.length > 1000
    ) {
      errors.push(
        "Description cannot exceed 1000 characters"
      );
    }

    // Instructions
    if (
      formData.instructions.length > 3000
    ) {
      errors.push(
        "Instructions cannot exceed 3000 characters"
      );
    }

    // Date validation
    if (formData.startDate) {
      if (
        Number.isNaN(
          Date.parse(formData.startDate)
        )
      ) {
        errors.push(
          "Invalid start date"
        );
      }
    }

    if (formData.endDate) {
      if (
        Number.isNaN(
          Date.parse(formData.endDate)
        )
      ) {
        errors.push(
          "Invalid end date"
        );
      }
    }

    if (
      formData.startDate &&
      formData.endDate
    ) {
      const start = new Date(
        formData.startDate
      );

      const end = new Date(
        formData.endDate
      );

      if (end <= start) {
        errors.push(
          "End date must be after start date"
        );
      }
    }

    return errors;
  };

  // ======================================================
  // UPDATE ASSESSMENT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationErrors =
      validateForm();

    if (validationErrors.length > 0) {
      setError(
        validationErrors.join(", ")
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSaving(true);

    try {
      // IMPORTANT:
      // Course and Category are NOT included.

      const payload = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        durationMinutes:
          Number(
            formData.durationMinutes
          ),

        totalMarks:
          Number(
            formData.totalMarks
          ),

        passingMarks:
          Number(
            formData.passingMarks
          ),

        maxAttempts:
          Number(
            formData.maxAttempts
          ),

        randomizeQuestions:
          Boolean(
            formData.randomizeQuestions
          ),

        shuffleOptions:
          Boolean(
            formData.shuffleOptions
          ),

        negativeMarking:
          Boolean(
            formData.negativeMarking
          ),

        negativeMarks:
          formData.negativeMarking
            ? Number(
                formData.negativeMarks
              )
            : 0,

        startDate:
          formData.startDate
            ? new Date(
                formData.startDate
              ).toISOString()
            : null,

        endDate:
          formData.endDate
            ? new Date(
                formData.endDate
              ).toISOString()
            : null,

        instructions:
          formData.instructions.trim(),
      };

      console.log(
        "Update Assessment Payload:",
        payload
      );

      const response =
        await updateAssessment(
          id,
          payload
        );

      console.log(
        "Update Assessment Response:",
        response
      );

      setShowSuccessModal(true);
    } catch (err) {
      console.error(
        "Update Assessment Error:",
        err
      );

      const message =
        err.response?.data?.errors?.join(
          ", "
        ) ||
        err.response?.data?.message ||
        "Failed to update assessment";

      setError(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // SUCCESS
  // ======================================================

  const handleSuccessClose = () => {
    setShowSuccessModal(false);

    navigate(
      "/admin/assessments"
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="text-muted">
          Loading assessment...
        </p>
      </div>
    );
  }

  // ======================================================
  // ANIMATION
  // ======================================================

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const alertVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
    },

    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 16,

      transition: {
        duration: 0.3,
      },
    },

    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },

    visible: {
      opacity: 1,
      scale: 1,

      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },

    exit: {
      opacity: 0,
      scale: 0.8,

      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="container py-4 position-relative">

      {/* ==================================================
          SUCCESS MODAL
      ================================================== */}

      <AnimatePresence>
        {showSuccessModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor:
                "rgba(0, 0, 0, 0.55)",
              zIndex: 1055,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                className="modal-content border-0 shadow-lg rounded-4 text-center p-4"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="modal-body">

                  <div className="display-4 text-success mb-3">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>

                  <h4 className="fw-bold text-dark mb-2">
                    Assessment Updated Successfully!
                  </h4>

                  <p className="text-muted small mb-4">
                    Your assessment has been
                    updated successfully.
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleSuccessClose
                    }
                    className="btn btn-success px-4 rounded-pill shadow-sm"
                  >
                    Continue
                  </button>

                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          HEADER
      ================================================== */}

      <motion.div
        className="mb-4"
        initial={{
          opacity: 0,
          x: -15,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <div className="d-flex justify-content-between align-items-center">

          <div>
            <h1 className="h3 fw-bold text-dark mb-1">
              Edit Assessment
            </h1>

            <p className="text-muted small m-0">
              Update assessment details and settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/assessments"
              )
            }
            className="btn btn-outline-secondary"
            disabled={saving}
          >
            Back
          </button>

        </div>
      </motion.div>

      {/* ==================================================
          MAIN FORM
      ================================================== */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="card shadow-sm border-0 rounded-3"
      >
        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>

            {/* ==================================================
                ERROR
            ================================================== */}

            <AnimatePresence>
              {error && (
                <motion.div
                  variants={alertVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>

                  {error}

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setError("")
                    }
                    aria-label="Close"
                  ></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <section className="mb-4">

              <h5 className="fw-semibold text-secondary mb-3 border-bottom pb-2">
                Basic Information
              </h5>

              <div className="row g-3">

                {/* TITLE */}

                <div className="col-12">

                  <label className="form-label fw-medium">
                    Assessment Title{" "}
                    <span className="text-danger">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter assessment title"
                    className="form-control"
                    maxLength={150}
                    required
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="col-12">

                  <label className="form-label fw-medium">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    rows="3"
                    maxLength={1000}
                    placeholder="Enter assessment description"
                    className="form-control"
                  />

                  <div className="form-text">
                    {
                      formData.description
                        .length
                    }{" "}
                    / 1000 characters
                  </div>

                </div>

              </div>

            </section>

            {/* ==================================================
                ASSESSMENT SETTINGS
            ================================================== */}

            <section className="mb-4">

              <h5 className="fw-semibold text-secondary mb-3 border-bottom pb-2">
                Assessment Settings
              </h5>

              <div className="row g-3">

                {/* DURATION */}

                <div className="col-sm-6 col-md-3">

                  <label className="form-label fw-medium">
                    Duration (Mins){" "}
                    <span className="text-danger">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    name="durationMinutes"
                    value={
                      formData.durationMinutes
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    max="600"
                    className="form-control"
                    required
                  />

                </div>

                {/* TOTAL MARKS */}

                <div className="col-sm-6 col-md-3">

                  <label className="form-label fw-medium">
                    Total Marks{" "}
                    <span className="text-danger">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    name="totalMarks"
                    value={
                      formData.totalMarks
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    className="form-control"
                    required
                  />

                </div>

                {/* PASSING MARKS */}

                <div className="col-sm-6 col-md-3">

                  <label className="form-label fw-medium">
                    Passing Marks{" "}
                    <span className="text-danger">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    name="passingMarks"
                    value={
                      formData.passingMarks
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    className="form-control"
                    required
                  />

                </div>

                {/* MAX ATTEMPTS */}

                <div className="col-sm-6 col-md-3">

                  <label className="form-label fw-medium">
                    Max Attempts
                  </label>

                  <input
                    type="number"
                    name="maxAttempts"
                    value={
                      formData.maxAttempts
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    max="10"
                    className="form-control"
                  />

                </div>

              </div>

            </section>

            {/* ==================================================
                QUESTION OPTIONS
            ================================================== */}

            <section className="mb-4">

              <h5 className="fw-semibold text-secondary mb-3 border-bottom pb-2">
                Question Options
              </h5>

              <div className="row g-3">

                {/* RANDOMIZE */}

                <div className="col-md-4">

                  <div className="card h-100 border p-3">

                    <div className="form-check m-0">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="randomizeQuestions"
                        name="randomizeQuestions"
                        checked={
                          formData.randomizeQuestions
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <label
                        className="form-check-label ms-2 user-select-none"
                        htmlFor="randomizeQuestions"
                      >
                        Randomize Questions
                      </label>

                    </div>

                  </div>

                </div>

                {/* SHUFFLE */}

                <div className="col-md-4">

                  <div className="card h-100 border p-3">

                    <div className="form-check m-0">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="shuffleOptions"
                        name="shuffleOptions"
                        checked={
                          formData.shuffleOptions
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <label
                        className="form-check-label ms-2 user-select-none"
                        htmlFor="shuffleOptions"
                      >
                        Shuffle Options
                      </label>

                    </div>

                  </div>

                </div>

                {/* NEGATIVE MARKING */}

                <div className="col-md-4">

                  <div className="card h-100 border p-3">

                    <div className="form-check m-0">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="negativeMarking"
                        name="negativeMarking"
                        checked={
                          formData.negativeMarking
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <label
                        className="form-check-label ms-2 user-select-none"
                        htmlFor="negativeMarking"
                      >
                        Negative Marking
                      </label>

                    </div>

                  </div>

                </div>

              </div>

              {/* NEGATIVE MARKS */}

              <AnimatePresence>

                {formData.negativeMarking && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      marginTop: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      marginTop: 16,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      marginTop: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="overflow-hidden"
                  >

                    <div className="row">

                      <div className="col-md-4">

                        <label className="form-label fw-medium">
                          Negative Marks per Wrong Answer
                        </label>

                        <input
                          type="number"
                          name="negativeMarks"
                          value={
                            formData.negativeMarks
                          }
                          onChange={
                            handleChange
                          }
                          min="0"
                          step="0.01"
                          className="form-control"
                        />

                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </section>

            {/* ==================================================
                SCHEDULE
            ================================================== */}

            <section className="mb-4">

              <h5 className="fw-semibold text-secondary mb-3 border-bottom pb-2">
                Schedule
              </h5>

              <div className="row g-3">

                <div className="col-md-6">

                  <label className="form-label fw-medium">
                    Start Date
                  </label>

                  <input
                    type="datetime-local"
                    name="startDate"
                    value={
                      formData.startDate
                    }
                    onChange={
                      handleChange
                    }
                    className="form-control"
                  />

                </div>

                <div className="col-md-6">

                  <label className="form-label fw-medium">
                    End Date
                  </label>

                  <input
                    type="datetime-local"
                    name="endDate"
                    value={
                      formData.endDate
                    }
                    onChange={
                      handleChange
                    }
                    className="form-control"
                  />

                </div>

              </div>

            </section>

            {/* ==================================================
                INSTRUCTIONS
            ================================================== */}

            <section className="mb-4">

              <label className="form-label fw-medium">
                Instructions
              </label>

              <textarea
                name="instructions"
                value={
                  formData.instructions
                }
                onChange={
                  handleChange
                }
                rows="4"
                maxLength={3000}
                placeholder="Enter instructions for students"
                className="form-control"
              />

              <div className="form-text">
                {
                  formData.instructions
                    .length
                }{" "}
                / 3000 characters
              </div>

            </section>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/assessments"
                  )
                }
                className="btn btn-outline-secondary px-4"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary px-4 d-flex align-items-center gap-2"
              >

                {saving && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}

                {saving
                  ? "Updating..."
                  : "Update Assessment"}

              </button>

            </div>

          </form>

        </div>
      </motion.div>

    </div>
  );
}