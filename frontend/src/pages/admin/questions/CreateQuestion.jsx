import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createQuestion } from "../../../services/questionService";
import { getAssessments } from "../../../services/assessmentService";

const QUESTION_TYPES = [
  { value: "MCQ", label: "Multiple Choice" },
  { value: "MULTIPLE_SELECT", label: "Multiple Select" },
  { value: "TRUE_FALSE", label: "True / False" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "LONG_ANSWER", label: "Long Answer" },
];

const createInitialOptions = () => [
  { text: "", isCorrect: true },
  { text: "", isCorrect: false },
];

export default function CreateQuestion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Custom Confirmation Modal State
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [form, setForm] = useState({
    assessment: searchParams.get("assessment") || "",
    questionText: "",
    questionType: "MCQ",
    options: createInitialOptions(),
    correctAnswer: "",
    marks: 1,
    negativeMarks: 0,
    explanation: "",
    order: 0,
    isRequired: true,
  });

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setLoadingAssessments(true);
        const response = await getAssessments({ page: 1, limit: 100 });
        setAssessments(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load assessments");
      } finally {
        setLoadingAssessments(false);
      }
    };
    loadAssessments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let options = [];
    let correctAnswer = "";

    if (type === "MCQ" || type === "MULTIPLE_SELECT") {
      options = createInitialOptions();
    }
    if (type === "TRUE_FALSE") {
      options = [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ];
    }

    setForm((previous) => ({
      ...previous,
      questionType: type,
      options,
      correctAnswer,
    }));
  };

  const handleOptionText = (index, value) => {
    setForm((previous) => {
      const options = [...previous.options];
      options[index] = { ...options[index], text: value };
      return { ...previous, options };
    });
  };

  const handleCorrectOption = (index) => {
    setForm((previous) => {
      const options = [...previous.options];
      if (previous.questionType === "MCQ") {
        options.forEach((option, optionIndex) => {
          option.isCorrect = optionIndex === index;
        });
      } else {
        options[index] = {
          ...options[index],
          isCorrect: !options[index].isCorrect,
        };
      }
      return { ...previous, options };
    });
  };

  const addOption = () => {
    setForm((previous) => ({
      ...previous,
      options: [...previous.options, { text: "", isCorrect: false }],
    }));
  };

  // Popup Modal Handlers
  const triggerRemoveOption = (index) => {
    if (form.options.length <= 2) return;
    setPopup({
      isOpen: true,
      title: "Remove Option",
      message: "Are you sure you want to remove this option?",
      onConfirm: () => {
        setForm((previous) => ({
          ...previous,
          options: previous.options.filter((_, i) => i !== index),
        }));
        closePopup();
      },
    });
  };

  const triggerCancel = () => {
    setPopup({
      isOpen: true,
      title: "Discard Changes",
      message: "Are you sure you want to cancel? Any unsaved changes will be lost.",
      onConfirm: () => navigate("/admin/questions"),
    });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      if (!form.assessment) throw new Error("Please select an assessment");

      if (
        form.questionType === "MCQ" ||
        form.questionType === "MULTIPLE_SELECT" ||
        form.questionType === "TRUE_FALSE"
      ) {
        const validOptions = form.options.filter((option) => option.text.trim());
        if (validOptions.length < 2) {
          throw new Error("At least 2 options are required");
        }
        const correctCount = validOptions.filter((option) => option.isCorrect).length;

        if (form.questionType === "MCQ" && correctCount !== 1) {
          throw new Error("MCQ must have exactly one correct answer");
        }
        if (form.questionType === "MULTIPLE_SELECT" && correctCount < 1) {
          throw new Error("Select at least one correct answer");
        }
      }

      const payload = {
        ...form,
        marks: Number(form.marks),
        negativeMarks: Number(form.negativeMarks),
        order: Number(form.order),
        options: form.options,
      };

      await createQuestion(payload);
      navigate("/admin/questions");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to create question"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .form-page-container {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .single-white-box {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
        }

        .form-section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        .form-control, .form-select {
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          transition: all 0.2s ease;
        }

        .form-control:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }

        .btn-modern {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-modern:hover {
          transform: translateY(-1px);
        }

        .custom-popup-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          animation: popupFade 0.2s ease-out forwards;
        }

        .custom-popup-box {
          background: #ffffff;
          border-radius: 14px;
          width: 90%;
          max-width: 420px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: popupZoom 0.2s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popupFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popupZoom {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="container py-4 form-page-container" style={{ maxWidth: "860px" }}>
        {/* Title Header */}
        <div className="mb-4">
          <h1 className="h3 fw-bold text-dark mb-1">Create Question</h1>
          <p className="text-secondary mb-0">Add a new question to an assessment</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4">
            {error}
          </div>
        )}

        {/* Unified Single White Box Container */}
        <div className="single-white-box p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Assessment Selection */}
            <div className="mb-4">
              <h5 className="form-section-title">Assessment</h5>
              <select
                className="form-select py-2"
                name="assessment"
                value={form.assessment}
                onChange={handleChange}
                disabled={loadingAssessments}
                required
              >
                <option value="">Select Assessment</option>
                {assessments.map((assessment) => (
                  <option key={assessment._id} value={assessment._id}>
                    {assessment.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Section 2: Question Content & Marking */}
            <div className="mb-4">
              <h5 className="form-section-title">Question Details</h5>
              
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  Question Text
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="questionText"
                  value={form.questionText}
                  onChange={handleChange}
                  placeholder="Enter question text..."
                  required
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary">
                    Question Type
                  </label>
                  <select
                    className="form-select py-2"
                    value={form.questionType}
                    onChange={handleTypeChange}
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-secondary">Marks</label>
                  <input
                    type="number"
                    className="form-control py-2"
                    name="marks"
                    min="1"
                    value={form.marks}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-secondary">
                    Negative Marks
                  </label>
                  <input
                    type="number"
                    className="form-control py-2"
                    name="negativeMarks"
                    min="0"
                    step="0.5"
                    value={form.negativeMarks}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Dynamic Options */}
            {(form.questionType === "MCQ" ||
              form.questionType === "MULTIPLE_SELECT" ||
              form.questionType === "TRUE_FALSE") && (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="form-section-title mb-0 border-0 pb-0">Options</h5>
                  {form.questionType !== "TRUE_FALSE" && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary btn-modern px-3"
                      onClick={addOption}
                    >
                      + Add Option
                    </button>
                  )}
                </div>
                <hr className="mt-2 mb-3 text-muted opacity-25" />

                {form.options.map((option, index) => (
                  <div key={index} className="d-flex gap-2 mb-3 align-items-center">
                    <input
                      type={form.questionType === "MCQ" ? "radio" : "checkbox"}
                      className="form-check-input mt-0"
                      name="correctOption"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectOption(index)}
                      disabled={form.questionType === "TRUE_FALSE"}
                    />

                    <input
                      type="text"
                      className="form-control py-2"
                      value={option.text}
                      onChange={(e) => handleOptionText(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      disabled={form.questionType === "TRUE_FALSE"}
                      required
                    />

                    {form.questionType !== "TRUE_FALSE" &&
                      form.options.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-modern"
                          onClick={() => triggerRemoveOption(index)}
                        >
                          Remove
                        </button>
                      )}
                  </div>
                ))}

                <small className="text-muted d-block mt-2">
                  Select the correct answer using the radio button or checkbox.
                </small>
              </div>
            )}

            {/* Section 4: Text Answer */}
            {(form.questionType === "SHORT_ANSWER" ||
              form.questionType === "LONG_ANSWER") && (
              <div className="mb-4">
                <h5 className="form-section-title">Correct Answer</h5>
                <textarea
                  className="form-control"
                  rows={form.questionType === "LONG_ANSWER" ? 5 : 3}
                  name="correctAnswer"
                  value={form.correctAnswer}
                  onChange={handleChange}
                  placeholder="Enter reference answer..."
                  required={form.questionType === "SHORT_ANSWER"}
                />
              </div>
            )}

            {/* Section 5: Additional Settings */}
            <div className="mb-4">
              <h5 className="form-section-title">Additional Settings</h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary">
                    Question Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control py-2"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-center mt-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isRequired"
                      checked={form.isRequired}
                      onChange={handleChange}
                      id="requiredQuestion"
                    />
                    <label
                      className="form-check-label fw-medium text-dark"
                      htmlFor="requiredQuestion"
                    >
                      Required Question
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label fw-semibold text-secondary">
                  Explanation
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="explanation"
                  value={form.explanation}
                  onChange={handleChange}
                  placeholder="Explain the correct answer..."
                />
              </div>
            </div>

            {/* Action Buttons Inside Container Bottom */}
            <div className="d-flex justify-content-end gap-3 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary btn-modern px-4"
                onClick={triggerCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-modern px-3 shadow-sm"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Question"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Popup Modal */}
      {popup.isOpen && (
        <div className="custom-popup-overlay">
          <div className="custom-popup-box p-4">
            <h5 className="fw-bold text-dark mb-2">{popup.title}</h5>
            <p className="text-secondary mb-4">{popup.message}</p>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light border btn-modern px-3"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-modern px-3"
                onClick={popup.onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}