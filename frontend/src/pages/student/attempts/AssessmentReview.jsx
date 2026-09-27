import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  getAttemptReview,
} from "../../../services/studentAssessmentService.js";

// ======================================================
// ASSESSMENT REVIEW
// ======================================================

export default function AssessmentReview() {
  const {
    attemptId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    review,
    setReview,
  ] = useState(null);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ====================================================
  // LOAD REVIEW
  // ====================================================

  const loadReview =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAttemptReview(
            attemptId
          );

        if (
          !response?.success ||
          !response?.data
        ) {
          throw new Error(
            response?.message ||
              "Failed to load assessment review."
          );
        }

        setReview(
          response.data
        );

        setCurrentIndex(0);
      } catch (error) {
        console.error(
          "Assessment Review Error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Failed to load assessment review."
        );
      } finally {
        setLoading(false);
      }
    };

  // ====================================================
  // LOAD ON PAGE LOAD
  // ====================================================

  useEffect(() => {
    if (attemptId) {
      loadReview();
    }
  }, [attemptId]);

  // ====================================================
  // QUESTIONS
  // ====================================================

  const questions =
    review?.questions || [];

  const currentQuestion =
    questions[currentIndex];

  // ====================================================
  // REVIEW STATISTICS
  // ====================================================

  const statistics =
    useMemo(() => {
      return {
        total:
          questions.length,

        answered:
          questions.filter(
            (question) =>
              question.isAnswered
          ).length,

        correct:
          questions.filter(
            (question) =>
              question.answerStatus ===
              "CORRECT"
          ).length,

        wrong:
          questions.filter(
            (question) =>
              question.answerStatus ===
              "WRONG"
          ).length,

        unanswered:
          questions.filter(
            (question) =>
              question.answerStatus ===
              "UNANSWERED"
          ).length,

        pending:
          questions.filter(
            (question) =>
              question.answerStatus ===
              "PENDING_REVIEW"
          ).length,
      };
    }, [questions]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="container-fluid px-0">

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            />

            <p className="text-muted mt-3 mb-0">
              Loading answer review...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="container-fluid px-0">

        <div className="alert alert-danger rounded-4">

          <h5 className="fw-bold">
            Unable to Load Review
          </h5>

          <p className="mb-3">
            {error}
          </p>

          <div className="d-flex gap-2 flex-wrap">

            <button
              type="button"
              className="btn btn-primary"
              onClick={loadReview}
            >
              Retry
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate(
                  `/student/attempts/${attemptId}/result`
                )
              }
            >
              Back to Result
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // NO REVIEW
  // ====================================================

  if (!review || !currentQuestion) {
    return (
      <div className="container-fluid px-0">

        <div className="alert alert-warning rounded-4">
          No review questions are available.
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(
              `/student/attempts/${attemptId}/result`
            )
          }
        >
          Back to Result
        </button>

      </div>
    );
  }

  // ====================================================
  // QUESTION STATUS
  // ====================================================

  const getStatusBadge =
    (question) => {
      if (
        question.answerStatus ===
        "CORRECT"
      ) {
        return (
          <span className="badge bg-success px-3 py-2">
            <i className="bi bi-check-circle me-1" />
            Correct
          </span>
        );
      }

      if (
        question.answerStatus ===
        "WRONG"
      ) {
        return (
          <span className="badge bg-danger px-3 py-2">
            <i className="bi bi-x-circle me-1" />
            Wrong
          </span>
        );
      }

      if (
        question.answerStatus ===
        "PENDING_REVIEW"
      ) {
        return (
          <span className="badge bg-warning text-dark px-3 py-2">
            <i className="bi bi-hourglass-split me-1" />
            Pending Review
          </span>
        );
      }

      return (
        <span className="badge bg-secondary px-3 py-2">
          Unanswered
        </span>
      );
    };

  // ====================================================
  // GET OPTION CLASS
  // ====================================================

  const getOptionClass =
    (option) => {
      if (
        option.correct &&
        option.selected
      ) {
        return "border-success bg-success-subtle";
      }

      if (
        option.correct
      ) {
        return "border-success bg-success-subtle";
      }

      if (
        option.selected
      ) {
        return "border-danger bg-danger-subtle";
      }

      return "border";
    };

  // ====================================================
  // NAVIGATION
  // ====================================================

  const goPrevious =
    () => {
      setCurrentIndex(
        (index) =>
          Math.max(
            index - 1,
            0
          )
      );
    };

  const goNext =
    () => {
      setCurrentIndex(
        (index) =>
          Math.min(
            index + 1,
            questions.length - 1
          )
      );
    };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <motion.div
      className="container-fluid px-0"
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
    >

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-body p-4">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

            <div>

              <h2 className="h4 fw-bold mb-1">
                Review Answers
              </h2>

              <p className="text-muted mb-0">
                {review.attempt?.assessment
                  ?.title ||
                  "Assessment Review"}
              </p>

            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                navigate(
                  `/student/attempts/${attemptId}/result`
                )
              }
            >
              <i className="bi bi-arrow-left me-2" />
              Back to Result
            </button>

          </div>

        </div>

      </div>

      {/* ==================================================
          STATISTICS
          ================================================== */}

      <div className="row g-3 mb-4">

        <ReviewStat
          label="Total"
          value={
            statistics.total
          }
          icon="bi-list-check"
        />

        <ReviewStat
          label="Correct"
          value={
            statistics.correct
          }
          icon="bi-check-circle"
        />

        <ReviewStat
          label="Wrong"
          value={
            statistics.wrong
          }
          icon="bi-x-circle"
        />

        <ReviewStat
          label="Unanswered"
          value={
            statistics.unanswered
          }
          icon="bi-dash-circle"
        />

      </div>

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <div className="row g-4">

        {/* ==================================================
            QUESTION NAVIGATION
            ================================================== */}

        <div className="col-12 col-lg-3">

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-3">

              <h5 className="fw-bold mb-3">
                Questions
              </h5>

              <div className="d-grid gap-2">

                {questions.map(
                  (
                    question,
                    index
                  ) => {

                    let buttonClass =
                      "btn-outline-secondary";

                    if (
                      question.answerStatus ===
                      "CORRECT"
                    ) {
                      buttonClass =
                        "btn-outline-success";
                    } else if (
                      question.answerStatus ===
                      "WRONG"
                    ) {
                      buttonClass =
                        "btn-outline-danger";
                    } else if (
                      question.answerStatus ===
                      "PENDING_REVIEW"
                    ) {
                      buttonClass =
                        "btn-outline-warning";
                    }

                    const active =
                      index ===
                      currentIndex;

                    return (
                      <button
                        key={
                          question.question
                        }
                        type="button"
                        className={`btn ${buttonClass} ${
                          active
                            ? "active"
                            : ""
                        } text-start`}
                        onClick={() =>
                          setCurrentIndex(
                            index
                          )
                        }
                      >
                        <span className="me-2">
                          {index + 1}.
                        </span>

                        {question.answerStatus ===
                        "CORRECT" ? (
                          <i className="bi bi-check-circle me-2" />
                        ) : question.answerStatus ===
                          "WRONG" ? (
                          <i className="bi bi-x-circle me-2" />
                        ) : question.answerStatus ===
                          "PENDING_REVIEW" ? (
                          <i className="bi bi-hourglass-split me-2" />
                        ) : (
                          <i className="bi bi-dash-circle me-2" />
                        )}

                        Question
                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            QUESTION
            ================================================== */}

        <div className="col-12 col-lg-9">

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

              {/* QUESTION HEADER */}

              <div className="d-flex justify-content-between align-items-start gap-3 mb-4">

                <div>

                  <div className="text-muted small mb-1">
                    Question{" "}
                    {currentIndex + 1} of{" "}
                    {questions.length}
                  </div>

                  <h3 className="h5 fw-bold mb-0">
                    {currentQuestion.questionText}
                  </h3>

                </div>

                <div className="flex-shrink-0">
                  {getStatusBadge(
                    currentQuestion
                  )}
                </div>

              </div>

              {/* QUESTION TYPE */}

              <div className="mb-4">

                <span className="badge bg-light text-dark border">
                  {currentQuestion.questionType}
                </span>

                <span className="badge bg-light text-dark border ms-2">
                  {currentQuestion.marks}{" "}
                  Marks
                </span>

                {currentQuestion.negativeMarks >
                  0 && (
                  <span className="badge bg-light text-dark border ms-2">
                    Negative:{" "}
                    {
                      currentQuestion.negativeMarks
                    }
                  </span>
                )}

              </div>

              {/* ==================================================
                  OPTIONS
                  ================================================== */}

              {currentQuestion.options
                ?.length > 0 && (

                <div className="mb-4">

                  {currentQuestion.options.map(
                    (option) => (
                      <div
                        key={
                          option._id
                        }
                        className={`border rounded-3 p-3 mb-2 ${getOptionClass(
                          option
                        )}`}
                      >

                        <div className="d-flex align-items-start gap-3">

                          <div className="flex-grow-1">

                            <div className="fw-medium">
                              {option.text}
                            </div>

                          </div>

                          <div className="d-flex flex-wrap gap-1">

                            {option.selected && (
                              <span className="badge bg-primary">
                                Your Answer
                              </span>
                            )}

                            {option.correct && (
                              <span className="badge bg-success">
                                Correct Answer
                              </span>
                            )}

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              )}

              {/* ==================================================
                  TEXT ANSWER
                  ================================================== */}

              {(currentQuestion.questionType ===
                "SHORT_ANSWER" ||
                currentQuestion.questionType ===
                  "LONG_ANSWER") && (

                <div className="mb-4">

                  <div className="small text-muted mb-2">
                    Your Answer
                  </div>

                  <div className="border rounded-3 p-3 bg-light">

                    {Array.isArray(
                      currentQuestion.studentAnswer
                    )
                      ? currentQuestion.studentAnswer.join(
                          ", "
                        )
                      : currentQuestion.studentAnswer ||
                        "Not answered"}

                  </div>

                  <div className="small text-muted mt-3 mb-2">
                    Correct Answer
                  </div>

                  <div className="border border-success rounded-3 p-3 bg-success-subtle">

                    {Array.isArray(
                      currentQuestion.correctAnswer
                    )
                      ? currentQuestion.correctAnswer.join(
                          ", "
                        )
                      : currentQuestion.correctAnswer ||
                        "Manual evaluation required"}

                  </div>

                </div>
              )}

              {/* ==================================================
                  MARKS INFORMATION
                  ================================================== */}

              <div className="row g-3 mb-4">

                <div className="col-12 col-md-4">

                  <div className="border rounded-3 p-3">

                    <div className="small text-muted">
                      Awarded Marks
                    </div>

                    <div className="fw-bold fs-5">
                      {
                        currentQuestion.awardedMarks
                      }
                    </div>

                  </div>

                </div>

                <div className="col-12 col-md-4">

                  <div className="border rounded-3 p-3">

                    <div className="small text-muted">
                      Deducted Marks
                    </div>

                    <div className="fw-bold fs-5">
                      {
                        currentQuestion.deductedMarks
                      }
                    </div>

                  </div>

                </div>

                <div className="col-12 col-md-4">

                  <div className="border rounded-3 p-3">

                    <div className="small text-muted">
                      Question Marks
                    </div>

                    <div className="fw-bold fs-5">
                      {
                        currentQuestion.marks
                      }
                    </div>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  MANUAL REVIEW
                  ================================================== */}

              {currentQuestion.requiresManualReview && (

                <div className="alert alert-warning rounded-3">

                  <i className="bi bi-hourglass-split me-2" />

                  This answer requires manual evaluation.

                </div>

              )}

              {/* ==================================================
                  NAVIGATION
                  ================================================== */}

              <div className="d-flex justify-content-between gap-2 mt-4">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={
                    currentIndex === 0
                  }
                  onClick={
                    goPrevious
                  }
                >
                  <i className="bi bi-arrow-left me-2" />
                  Previous
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={
                    currentIndex ===
                    questions.length - 1
                  }
                  onClick={
                    goNext
                  }
                >
                  Next
                  <i className="bi bi-arrow-right ms-2" />
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}

// ======================================================
// REVIEW STAT
// ======================================================

function ReviewStat({
  label,
  value,
  icon,
}) {
  return (
    <div className="col-6 col-lg-3">

      <div className="card border-0 shadow-sm rounded-4 h-100">

        <div className="card-body p-3">

          <div className="d-flex align-items-center gap-3">

            <div
              className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: 42,
                height: 42,
              }}
            >
              <i
                className={`bi ${icon}`}
              />
            </div>

            <div>

              <div className="small text-muted">
                {label}
              </div>

              <div className="fw-bold fs-5">
                {value}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}