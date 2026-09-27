import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  getAttemptResult,
} from "../../../services/studentAssessmentService.js";

// ======================================================
// RESULT PAGE
// ======================================================

export default function AssessmentResult() {
  const {
    attemptId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ====================================================
  // LOAD RESULT
  // ====================================================

  const loadResult =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAttemptResult(
            attemptId
          );

        if (
          !response?.success ||
          !response?.data
        ) {
          throw new Error(
            response?.message ||
              "Result not found."
          );
        }

        setResult(
          response.data
        );
      } catch (error) {
        console.error(
          "Load Result Error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Failed to load result."
        );
      } finally {
        setLoading(false);
      }
    };

  // ====================================================
  // LOAD RESULT ON PAGE LOAD
  // ====================================================

  useEffect(() => {
    if (attemptId) {
      loadResult();
    }
  }, [attemptId]);

  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "-";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

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
              aria-label="Loading"
            />

            <p className="text-muted mt-3 mb-0">
              Loading result...
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
            Unable to Load Result
          </h5>

          <p>
            {error}
          </p>

          <div className="d-flex flex-wrap gap-2">

            <button
              type="button"
              className="btn btn-primary"
              onClick={loadResult}
            >
              Retry
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate(
                  "/student/assessments"
                )
              }
            >
              Back to Assessments
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // NO RESULT
  // ====================================================

  if (!result) {
    return (
      <div className="container-fluid px-0">

        <div className="alert alert-warning rounded-4">
          Assessment result is not available.
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(
              "/student/assessments"
            )
          }
        >
          Back to Assessments
        </button>

      </div>
    );
  }

  // ====================================================
  // RESULT STATUS
  // ====================================================

  const pendingReview =
    result.resultStatus ===
    "PENDING_MANUAL_REVIEW";

  const passed =
    result.passed === true;

  const failed =
    result.passed === false;

  // ====================================================
  // SAFE DISPLAY VALUES
  // ====================================================

  const score =
    result.score ?? 0;

  const totalMarks =
    result.totalMarks ?? 0;

  const percentage =
    result.percentage ?? 0;

  const totalQuestions =
    result.totalQuestions ?? 0;

  const answeredQuestions =
    result.answeredQuestions ?? 0;

  const unansweredQuestions =
    result.unansweredQuestions ?? 0;

  const correctAnswers =
    result.correctAnswers ?? 0;

  const wrongAnswers =
    result.wrongAnswers ?? 0;

  const manualReviewPending =
    result.manualReviewPending ?? 0;

  const passingMarks =
    result.passingMarks ?? 0;

  // ====================================================
  // STATUS TEXT
  // ====================================================

  let resultTitle =
    "Assessment Completed";

  let resultIcon =
    "bi-check-circle";

  if (pendingReview) {
    resultTitle =
      "Pending Manual Review";

    resultIcon =
      "bi-hourglass-split";
  } else if (passed) {
    resultTitle =
      "Assessment Passed";

    resultIcon =
      "bi-trophy";
  } else if (failed) {
    resultTitle =
      "Assessment Completed";

    resultIcon =
      "bi-x-circle";
  }

  // ====================================================
  // STATUS CLASS
  // ====================================================

  let statusCircleClass =
    "bg-danger-subtle text-danger";

  if (pendingReview) {
    statusCircleClass =
      "bg-warning-subtle text-warning";
  } else if (passed) {
    statusCircleClass =
      "bg-success-subtle text-success";
  }

  // ====================================================
  // SUBMISSION TYPE
  // ====================================================

  const submissionType =
    result.status ===
    "AUTO_SUBMITTED"
      ? "Automatically Submitted"
      : "Submitted";

  // ====================================================
  // REVIEW ANSWERS
  // ====================================================

  const handleReviewAnswers =
    () => {
      navigate(
        `/student/attempts/${attemptId}/review`
      );
    };

  // ====================================================
  // DASHBOARD
  // ====================================================

  const handleDashboard =
    () => {
      navigate(
        "/student/dashboard"
      );
    };

  // ====================================================
  // ASSESSMENTS
  // ====================================================

  const handleAssessments =
    () => {
      navigate(
        "/student/assessments"
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
          HEADER CARD
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-body p-4 p-md-5 text-center">

          {/* STATUS ICON */}

          <div
            className={`rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center ${statusCircleClass}`}
            style={{
              width: 80,
              height: 80,
            }}
          >

            <i
              className={`bi ${resultIcon} fs-1`}
            />

          </div>

          {/* TITLE */}

          <h1 className="h3 fw-bold mb-2">
            {resultTitle}
          </h1>

          {/* ASSESSMENT NAME */}

          <p className="text-muted mb-0">
            {result.assessment?.title ||
              "Assessment Result"}
          </p>

          {/* AUTO SUBMITTED */}

          {result.status ===
            "AUTO_SUBMITTED" && (
            <div className="mt-3">

              <span className="badge bg-info-subtle text-info px-3 py-2">
                <i className="bi bi-clock-history me-1" />
                Automatically Submitted
              </span>

            </div>
          )}

        </div>

      </div>

      {/* ==================================================
          PENDING REVIEW MESSAGE
          ================================================== */}

      {pendingReview && (
        <div
          className="alert alert-warning rounded-4 border-0 shadow-sm mb-4"
          role="alert"
        >

          <div className="d-flex gap-3">

            <i className="bi bi-info-circle fs-4" />

            <div>

              <strong>
                Final result pending
              </strong>

              <div className="small mt-1">
                Your assessment has been
                submitted successfully.
                One or more answers require
                manual evaluation.
              </div>

              <div className="small mt-1">
                Current score:
                <strong className="ms-1">
                  {score} / {totalMarks}
                </strong>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          SCORE CARDS
          ================================================== */}

      <div className="row g-3 mb-4">

        {/* SCORE */}

        <div className="col-12 col-md-4">

          <ResultCard
            icon="bi-award"
            title="Score"
            value={`${score} / ${totalMarks}`}
          />

        </div>

        {/* PERCENTAGE */}

        <div className="col-12 col-md-4">

          <ResultCard
            icon="bi-percent"
            title="Percentage"
            value={`${percentage}%`}
          />

        </div>

        {/* PASSING MARKS */}

        <div className="col-12 col-md-4">

          <ResultCard
            icon="bi-check2-circle"
            title="Passing Marks"
            value={passingMarks}
          />

        </div>

      </div>

      {/* ==================================================
          RESULT STATUS CARD
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-body p-4">

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

            <div>

              <div className="small text-muted">
                Final Result
              </div>

              <div className="fw-bold fs-5 mt-1">
                {pendingReview
                  ? "Pending Manual Review"
                  : passed
                  ? "Passed"
                  : failed
                  ? "Failed"
                  : "Pending"}
              </div>

            </div>

            <div>

              {pendingReview ? (
                <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                  <i className="bi bi-hourglass-split me-1" />
                  Pending Review
                </span>
              ) : passed ? (
                <span className="badge bg-success fs-6 px-3 py-2">
                  <i className="bi bi-check-circle me-1" />
                  Passed
                </span>
              ) : failed ? (
                <span className="badge bg-danger fs-6 px-3 py-2">
                  <i className="bi bi-x-circle me-1" />
                  Failed
                </span>
              ) : (
                <span className="badge bg-secondary fs-6 px-3 py-2">
                  Pending
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          QUESTION STATISTICS
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-body p-4">

          <h2 className="h5 fw-bold mb-4">
            Question Summary
          </h2>

          <div className="row g-3">

            <SummaryItem
              label="Total Questions"
              value={
                totalQuestions
              }
            />

            <SummaryItem
              label="Answered"
              value={
                answeredQuestions
              }
            />

            <SummaryItem
              label="Unanswered"
              value={
                unansweredQuestions
              }
            />

            <SummaryItem
              label="Correct"
              value={
                correctAnswers
              }
            />

            <SummaryItem
              label="Wrong"
              value={
                wrongAnswers
              }
            />

            <SummaryItem
              label="Pending Review"
              value={
                manualReviewPending
              }
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          ATTEMPT INFORMATION
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-body p-4">

          <h2 className="h5 fw-bold mb-4">
            Attempt Information
          </h2>

          <div className="row g-3">

            {/* ATTEMPT NUMBER */}

            <InfoRow
              label="Attempt Number"
              value={
                result.attemptNumber
                  ? `#${result.attemptNumber}`
                  : "-"
              }
            />

            {/* SUBMISSION TYPE */}

            <InfoRow
              label="Submission Type"
              value={
                submissionType
              }
            />

            {/* STATUS */}

            <InfoRow
              label="Status"
              value={
                result.status ||
                "-"
              }
            />

            {/* RESULT STATUS */}

            <InfoRow
              label="Result Status"
              value={
                result.resultStatus ||
                "-"
              }
            />

            {/* STARTED AT */}

            <InfoRow
              label="Started At"
              value={
                formatDate(
                  result.startedAt
                )
              }
            />

            {/* SUBMITTED AT */}

            <InfoRow
              label="Submitted At"
              value={
                formatDate(
                  result.submittedAt
                )
              }
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          MANUAL REVIEW INFORMATION
          ================================================== */}

      {pendingReview && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="d-flex gap-3">

              <div
                className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                }}
              >
                <i className="bi bi-pencil-square fs-5" />
              </div>

              <div>

                <h5 className="fw-bold mb-1">
                  Manual Evaluation Required
                </h5>

                <p className="text-muted mb-2">
                  {manualReviewPending}{" "}
                  answer
                  {manualReviewPending !==
                  1
                    ? "s"
                    : ""}{" "}
                  require manual review.
                </p>

                <small className="text-muted">
                  The final result will be
                  available after the manual
                  evaluation is completed.
                </small>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          ACTIONS
          ================================================== */}

      <div className="d-flex flex-wrap gap-2 justify-content-end mb-4">

        {/* REVIEW ANSWERS */}

        <button
          type="button"
          className="btn btn-outline-primary px-4"
          onClick={
            handleReviewAnswers
          }
        >
          <i className="bi bi-eye me-2" />
          Review Answers
        </button>

        {/* DASHBOARD */}

        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={
            handleDashboard
          }
        >
          <i className="bi bi-speedometer2 me-2" />
          Dashboard
        </button>

        {/* ASSESSMENTS */}

        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={
            handleAssessments
          }
        >
          <i className="bi bi-journal-text me-2" />
          Assessments
        </button>

      </div>

    </motion.div>
  );
}

// ======================================================
// RESULT CARD
// ======================================================

function ResultCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">

      <div className="card-body p-4">

        <div className="d-flex align-items-center gap-3">

          <div
            className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
            style={{
              width: 48,
              height: 48,
            }}
          >
            <i
              className={`bi ${icon} fs-5`}
            />
          </div>

          <div>

            <div className="small text-muted">
              {title}
            </div>

            <div className="h5 fw-bold mb-0">
              {value}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// ======================================================
// SUMMARY ITEM
// ======================================================

function SummaryItem({
  label,
  value,
}) {
  return (
    <div className="col-6 col-md-4">

      <div className="border rounded-3 p-3 h-100">

        <div className="small text-muted">
          {label}
        </div>

        <div className="fs-5 fw-bold mt-1">
          {value ?? 0}
        </div>

      </div>

    </div>
  );
}

// ======================================================
// INFO ROW
// ======================================================

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="col-12 col-md-6">

      <div className="border rounded-3 p-3 h-100">

        <div className="small text-muted">
          {label}
        </div>

        <div className="fw-semibold mt-1">
          {value}
        </div>

      </div>

    </div>
  );
}