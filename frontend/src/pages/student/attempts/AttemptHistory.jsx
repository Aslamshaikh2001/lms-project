import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  History,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { getMyAttempts } from "../../../services/studentAssessmentService";

export default function AttemptHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [assessment, setAssessment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttempts();
  }, [id]);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyAttempts(id);

      console.log("ATTEMPT HISTORY RESPONSE:", response);

      const data =
        response?.data?.attempts ||
        response?.data ||
        [];

      const attemptList = Array.isArray(data)
        ? data
        : [];

      setAttempts(attemptList);

      if (attemptList.length > 0) {
        setAssessment(
          attemptList[0]?.assessment || null
        );
      }
    } catch (err) {
      console.error(
        "LOAD ATTEMPT HISTORY ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load attempt history."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <span className="badge bg-warning text-dark">
            In Progress
          </span>
        );

      case "SUBMITTED":
        return (
          <span className="badge bg-success">
            Submitted
          </span>
        );

      case "AUTO_SUBMITTED":
        return (
          <span className="badge bg-info text-dark">
            Auto Submitted
          </span>
        );

      case "ABANDONED":
        return (
          <span className="badge bg-secondary">
            Abandoned
          </span>
        );

      default:
        return (
          <span className="badge bg-secondary">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const getResultBadge = (attempt) => {
    if (attempt.resultStatus === "PENDING_MANUAL_REVIEW") {
      return (
        <span className="badge bg-warning text-dark">
          Pending Review
        </span>
      );
    }

    if (attempt.status === "IN_PROGRESS") {
      return (
        <span className="badge bg-light text-dark border">
          Not Submitted
        </span>
      );
    }

    if (attempt.passed === true) {
      return (
        <span className="badge bg-success">
          Passed
        </span>
      );
    }

    if (attempt.passed === false) {
      return (
        <span className="badge bg-danger">
          Failed
        </span>
      );
    }

    return (
      <span className="badge bg-secondary">
        Result Pending
      </span>
    );
  };

  const isCompleted = (attempt) => {
    return (
      attempt.status === "SUBMITTED" ||
      attempt.status === "AUTO_SUBMITTED"
    );
  };

  const handleResume = (attempt) => {
    navigate(
      `/student/attempts/${attempt._id}`
    );
  };

  const handleResult = (attempt) => {
    navigate(
      `/student/attempts/${attempt._id}/result`
    );
  };

  const handleReview = (attempt) => {
    navigate(
      `/student/attempts/${attempt._id}/review`
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-lg-4">

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

        <div className="d-flex align-items-center gap-3">

          <button
            type="button"
            className="btn btn-light border"
            onClick={() =>
              navigate(`/student/assessments/${id}`)
            }
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="d-flex align-items-center gap-2">
              <History
                size={26}
                className="text-primary"
              />

              <h2 className="fw-bold mb-0">
                Attempt History
              </h2>
            </div>

            <p className="text-muted mb-0 mt-1">
              View all your attempts for this assessment
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadAttempts}
        >
          <RefreshCw size={17} className="me-2" />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={loadAttempts}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Assessment information */}
      {assessment && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">

            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">

              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FileText
                    size={22}
                    className="text-primary"
                  />

                  <h4 className="fw-bold mb-0">
                    {assessment.title ||
                      "Assessment"}
                  </h4>
                </div>

                {assessment.description && (
                  <p className="text-muted mb-0">
                    {assessment.description}
                  </p>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2">

                {assessment.maxAttempts && (
                  <span className="badge bg-light text-dark border">
                    Max Attempts:{" "}
                    {assessment.maxAttempts}
                  </span>
                )}

                {assessment.totalMarks !== undefined && (
                  <span className="badge bg-light text-dark border">
                    Total Marks:{" "}
                    {assessment.totalMarks}
                  </span>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Total Attempts
                  </p>

                  <h3 className="fw-bold mb-0">
                    {attempts.length}
                  </h3>
                </div>

                <History
                  size={30}
                  className="text-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Completed
                  </p>

                  <h3 className="fw-bold mb-0">
                    {
                      attempts.filter((attempt) =>
                        isCompleted(attempt)
                      ).length
                    }
                  </h3>
                </div>

                <CheckCircle
                  size={30}
                  className="text-success"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Passed
                  </p>

                  <h3 className="fw-bold mb-0">
                    {
                      attempts.filter(
                        (attempt) =>
                          attempt.passed === true
                      ).length
                    }
                  </h3>
                </div>

                <Award
                  size={30}
                  className="text-success"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Failed
                  </p>

                  <h3 className="fw-bold mb-0">
                    {
                      attempts.filter(
                        (attempt) =>
                          attempt.passed === false
                      ).length
                    }
                  </h3>
                </div>

                <XCircle
                  size={30}
                  className="text-danger"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* No attempts */}
      {attempts.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">

            <History
              size={55}
              className="text-muted mb-3"
            />

            <h4 className="fw-bold">
              No Attempts Found
            </h4>

            <p className="text-muted mb-4">
              You have not attempted this assessment yet.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate(`/student/assessments/${id}`)
              }
            >
              Back to Assessment
            </button>

          </div>
        </div>
      )}

      {/* Attempt table */}
      {attempts.length > 0 && (
        <div className="card border-0 shadow-sm">

          <div className="card-header bg-white border-0 p-4">
            <div className="d-flex align-items-center gap-2">
              <BarChart3
                size={22}
                className="text-primary"
              />

              <h5 className="fw-bold mb-0">
                Your Attempts
              </h5>
            </div>
          </div>

          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                  <tr>
                    <th className="px-4">
                      Attempt
                    </th>

                    <th>Status</th>

                    <th>Result</th>

                    <th>Score</th>

                    <th>Percentage</th>

                    <th>Questions</th>

                    <th>Started</th>

                    <th>Submitted</th>

                    <th className="text-end px-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {attempts.map((attempt) => {

                    const completed =
                      isCompleted(attempt);

                    return (
                      <tr key={attempt._id}>

                        <td className="px-4">
                          <div className="fw-bold">
                            Attempt #
                            {attempt.attemptNumber}
                          </div>
                        </td>

                        <td>
                          {getStatusBadge(
                            attempt.status
                          )}
                        </td>

                        <td>
                          {getResultBadge(
                            attempt
                          )}
                        </td>

                        <td>
                          {completed
                            ? `${attempt.score ?? 0} / ${
                                attempt.totalMarks ?? 0
                              }`
                            : "-"}
                        </td>

                        <td>
                          {completed &&
                          attempt.percentage !== null &&
                          attempt.percentage !== undefined
                            ? `${attempt.percentage}%`
                            : "-"}
                        </td>

                        <td>
                          <div className="small">
                            <strong>
                              {attempt.answeredQuestions ??
                                0}
                            </strong>{" "}
                            /{" "}
                            {attempt.totalQuestions ??
                              0}
                          </div>

                          <div className="text-muted small">
                            Correct:{" "}
                            {attempt.correctAnswers ??
                              0}
                            {" · "}
                            Wrong:{" "}
                            {attempt.wrongAnswers ??
                              0}
                          </div>
                        </td>

                        <td>
                          <div className="small text-nowrap">
                            <Clock
                              size={14}
                              className="me-1"
                            />

                            {formatDate(
                              attempt.startedAt
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="small text-nowrap">
                            {formatDate(
                              attempt.submittedAt
                            )}
                          </div>
                        </td>

                        <td className="text-end px-4">

                          <div className="d-flex justify-content-end gap-2">

                            {attempt.status ===
                              "IN_PROGRESS" && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  handleResume(
                                    attempt
                                  )
                                }
                              >
                                <RefreshCw
                                  size={15}
                                  className="me-1"
                                />
                                Resume
                              </button>
                            )}

                            {completed && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    handleResult(
                                      attempt
                                    )
                                  }
                                >
                                  <Eye
                                    size={15}
                                    className="me-1"
                                  />
                                  Result
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() =>
                                    handleReview(
                                      attempt
                                    )
                                  }
                                >
                                  Review
                                </button>
                              </>
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}