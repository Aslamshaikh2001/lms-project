import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getStudentResultDetails,
} from "../../services/adminAssessmentResultService.js";


// ======================================================
// HELPERS
// ======================================================

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  try {
    return new Date(date).toLocaleString();
  } catch {
    return "-";
  }
};


// ======================================================
// FORMAT PERCENTAGE
// ======================================================

const formatPercentage = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "0.00%";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0.00%";
  }

  return `${number.toFixed(2)}%`;
};


// ======================================================
// DISPLAY ANSWER
// ======================================================

const displayAnswer = (answer) => {
  if (
    answer === null ||
    answer === undefined ||
    answer === ""
  ) {
    return "Not Answered";
  }

  if (Array.isArray(answer)) {
    if (answer.length === 0) {
      return "Not Answered";
    }

    return answer.join(", ");
  }

  if (typeof answer === "object") {
    try {
      return JSON.stringify(answer);
    } catch {
      return String(answer);
    }
  }

  if (typeof answer === "boolean") {
    return answer ? "True" : "False";
  }

  return String(answer);
};


// ======================================================
// RESULT STATUS BADGE
// ======================================================

const ResultStatusBadge = ({
  passed,
}) => {
  if (passed === true) {
    return (
      <span className="badge bg-success px-3 py-2">
        <i className="bi bi-check-circle me-1"></i>
        Passed
      </span>
    );
  }

  if (passed === false) {
    return (
      <span className="badge bg-danger px-3 py-2">
        <i className="bi bi-x-circle me-1"></i>
        Failed
      </span>
    );
  }

  return (
    <span className="badge bg-warning text-dark px-3 py-2">
      Pending
    </span>
  );
};


// ======================================================
// SUBMISSION STATUS BADGE
// ======================================================

const SubmissionStatusBadge = ({
  status,
}) => {
  if (status === "AUTO_SUBMITTED") {
    return (
      <span className="badge bg-warning text-dark px-3 py-2">
        Auto Submitted
      </span>
    );
  }

  if (status === "SUBMITTED") {
    return (
      <span className="badge bg-info text-dark px-3 py-2">
        Submitted
      </span>
    );
  }

  return (
    <span className="badge bg-secondary px-3 py-2">
      {status || "-"}
    </span>
  );
};


// ======================================================
// QUESTION STATUS BADGE
// ======================================================

const QuestionStatusBadge = ({
  status,
}) => {
  if (status === "CORRECT") {
    return (
      <span className="badge bg-success px-3 py-2">
        <i className="bi bi-check-circle me-1"></i>
        Correct
      </span>
    );
  }

  if (status === "WRONG") {
    return (
      <span className="badge bg-danger px-3 py-2">
        <i className="bi bi-x-circle me-1"></i>
        Wrong
      </span>
    );
  }

  if (status === "UNANSWERED") {
    return (
      <span className="badge bg-secondary px-3 py-2">
        Unanswered
      </span>
    );
  }

  if (status === "PENDING_REVIEW") {
    return (
      <span className="badge bg-warning text-dark px-3 py-2">
        Pending Review
      </span>
    );
  }

  return (
    <span className="badge bg-secondary px-3 py-2">
      {status || "-"}
    </span>
  );
};


// ======================================================
// COMPONENT
// ======================================================

export default function AssessmentAttemptResult() {
  const navigate = useNavigate();

  const {
    attemptId,
  } = useParams();


  // ====================================================
  // STATE
  // ====================================================

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
  // FETCH RESULT
  // ====================================================

  const fetchResult = useCallback(
    async () => {
      if (!attemptId) {
        setError(
          "Assessment attempt ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getStudentResultDetails(
            attemptId
          );

        setResult(
          response?.data || null
        );
      } catch (err) {
        console.error(
          "FETCH STUDENT RESULT DETAILS ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch assessment result."
        );

        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [attemptId]
  );


  // ====================================================
  // LOAD RESULT
  // ====================================================

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="container-fluid py-5">

        <div className="d-flex justify-content-center align-items-center">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <span className="ms-3 text-muted">
            Loading student assessment result...
          </span>

        </div>

      </div>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="container-fluid py-4">

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4">

            <div className="alert alert-danger d-flex justify-content-between align-items-center">

              <div>
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={fetchResult}
              >
                Retry
              </button>

            </div>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate(
                  "/admin/student-results"
                )
              }
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Student Results
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
      <div className="container-fluid py-4">

        <div className="card border-0 shadow-sm">

          <div className="card-body text-center py-5">

            <i className="bi bi-file-earmark-x fs-1 text-muted"></i>

            <h5 className="mt-3">
              Result Not Found
            </h5>

            <p className="text-muted">
              The requested assessment result
              could not be found.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  "/admin/student-results"
                )
              }
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Student Results
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ====================================================
  // DATA
  // ====================================================

  const student =
    result.student || {};

  const assessment =
    result.assessment || {};

  const questions =
    Array.isArray(
      result.questions
    )
      ? result.questions
      : [];


  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="container-fluid py-4">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            Student Assessment Result
          </h2>

          <p className="text-muted mb-0">
            Complete assessment submission
            and question-by-question review.
          </p>

        </div>


        <button
          type="button"
          className="btn btn-outline-secondary mt-3 mt-md-0"
          onClick={() =>
            navigate(
              "/admin/student-results"
            )
          }
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Results
        </button>

      </div>


      {/* ==================================================
          STUDENT + ASSESSMENT INFORMATION
      ================================================== */}

      <div className="row g-4 mb-4">

        {/* ==================================================
            STUDENT INFORMATION
        ================================================== */}

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex align-items-center mb-4">

                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "52px",
                    height: "52px",
                    fontSize: "20px",
                  }}
                >
                  {(
                    student.name ||
                    "S"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    Student Information
                  </h5>

                  <small className="text-muted">
                    Student details
                  </small>

                </div>

              </div>


              <div className="row g-3">

                <div className="col-12">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-1">
                      Student Name
                    </small>

                    <strong>
                      {student.name || "-"}
                    </strong>

                  </div>

                </div>


                <div className="col-12">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-1">
                      Email Address
                    </small>

                    <strong className="text-break">
                      {student.email || "-"}
                    </strong>

                  </div>

                </div>


                <div className="col-md-6">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-1">
                      Role
                    </small>

                    <strong>
                      {student.role ||
                        "STUDENT"}
                    </strong>

                  </div>

                </div>


                <div className="col-md-6">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-1">
                      Attempt
                    </small>

                    <strong>
                      #
                      {result.attemptNumber ||
                        1}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            ASSESSMENT INFORMATION
        ================================================== */}

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex align-items-center mb-4">

                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "52px",
                    height: "52px",
                    fontSize: "20px",
                  }}
                >
                  <i className="bi bi-clipboard-check"></i>
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    Assessment Information
                  </h5>

                  <small className="text-muted">
                    Submission details
                  </small>

                </div>

              </div>


              <div className="row g-3">

                <div className="col-12">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-1">
                      Assessment
                    </small>

                    <strong>
                      {assessment.title ||
                        "Untitled Assessment"}
                    </strong>

                  </div>

                </div>


                <div className="col-md-6">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-2">
                      Submission Status
                    </small>

                    <SubmissionStatusBadge
                      status={
                        result.status
                      }
                    />

                  </div>

                </div>


                <div className="col-md-6">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-2">
                      Result
                    </small>

                    <ResultStatusBadge
                      passed={
                        result.passed
                      }
                    />

                  </div>

                </div>


                <div className="col-12">

                  <div className="bg-light rounded p-3">

                    <small className="text-muted d-block mb-1">
                      Submitted At
                    </small>

                    <strong>
                      {formatDate(
                        result.submittedAt
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          RESULT SUMMARY
      ================================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="d-flex align-items-center mb-4">

            <div
              className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center me-3"
              style={{
                width: "45px",
                height: "45px",
              }}
            >
              <i className="bi bi-graph-up"></i>
            </div>

            <div>

              <h5 className="fw-bold mb-1">
                Result Summary
              </h5>

              <small className="text-muted">
                Overall assessment performance
              </small>

            </div>

          </div>


          <div className="row g-3">

            {/* SCORE */}

            <div className="col-sm-6 col-lg-3">

              <div className="border rounded-3 p-4 h-100">

                <small className="text-muted d-block mb-2">
                  Score
                </small>

                <h3 className="fw-bold mb-0">

                  {result.score ?? 0}

                  <span className="fs-6 fw-normal text-muted">
                    {" "}
                    /{" "}
                    {result.totalMarks ?? 0}
                  </span>

                </h3>

              </div>

            </div>


            {/* PERCENTAGE */}

            <div className="col-sm-6 col-lg-3">

              <div className="border rounded-3 p-4 h-100">

                <small className="text-muted d-block mb-2">
                  Percentage
                </small>

                <h3 className="fw-bold mb-0">
                  {formatPercentage(
                    result.percentage
                  )}
                </h3>

              </div>

            </div>


            {/* PASSING MARKS */}

            <div className="col-sm-6 col-lg-3">

              <div className="border rounded-3 p-4 h-100">

                <small className="text-muted d-block mb-2">
                  Passing Marks
                </small>

                <h3 className="fw-bold mb-0">
                  {result.passingMarks ??
                    0}
                </h3>

              </div>

            </div>


            {/* RESULT */}

            <div className="col-sm-6 col-lg-3">

              <div className="border rounded-3 p-4 h-100">

                <small className="text-muted d-block mb-2">
                  Final Result
                </small>

                <ResultStatusBadge
                  passed={
                    result.passed
                  }
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          QUESTION SUMMARY
      ================================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="d-flex align-items-center mb-4">

            <div
              className="rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center me-3"
              style={{
                width: "45px",
                height: "45px",
              }}
            >
              <i className="bi bi-list-check"></i>
            </div>

            <div>

              <h5 className="fw-bold mb-1">
                Question Summary
              </h5>

              <small className="text-muted">
                Assessment question statistics
              </small>

            </div>

          </div>


          <div className="row g-3">

            {/* TOTAL */}

            <div className="col-6 col-md">

              <div className="border rounded-3 text-center p-3 h-100">

                <div className="fs-4 fw-bold">
                  {result.totalQuestions ??
                    0}
                </div>

                <small className="text-muted">
                  Total Questions
                </small>

              </div>

            </div>


            {/* ANSWERED */}

            <div className="col-6 col-md">

              <div className="border rounded-3 text-center p-3 h-100">

                <div className="fs-4 fw-bold text-primary">
                  {result.answeredQuestions ??
                    0}
                </div>

                <small className="text-muted">
                  Answered
                </small>

              </div>

            </div>


            {/* CORRECT */}

            <div className="col-6 col-md">

              <div className="border rounded-3 text-center p-3 h-100">

                <div className="fs-4 fw-bold text-success">
                  {result.correctAnswers ??
                    0}
                </div>

                <small className="text-muted">
                  Correct
                </small>

              </div>

            </div>


            {/* WRONG */}

            <div className="col-6 col-md">

              <div className="border rounded-3 text-center p-3 h-100">

                <div className="fs-4 fw-bold text-danger">
                  {result.wrongAnswers ??
                    0}
                </div>

                <small className="text-muted">
                  Wrong
                </small>

              </div>

            </div>


            {/* UNANSWERED */}

            <div className="col-6 col-md">

              <div className="border rounded-3 text-center p-3 h-100">

                <div className="fs-4 fw-bold text-warning">
                  {result.unansweredQuestions ??
                    0}
                </div>

                <small className="text-muted">
                  Unanswered
                </small>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          QUESTION-BY-QUESTION REVIEW
      ================================================== */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div className="d-flex align-items-center">

              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "45px",
                  height: "45px",
                }}
              >
                <i className="bi bi-file-earmark-text"></i>
              </div>

              <div>

                <h5 className="fw-bold mb-1">
                  Question-by-Question Review
                </h5>

                <small className="text-muted">
                  Review every student response
                </small>

              </div>

            </div>


            <span className="badge bg-light text-dark border px-3 py-2">
              {questions.length} Questions
            </span>

          </div>


          {/* =================================================
              NO QUESTIONS
          ================================================= */}

          {questions.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-inbox fs-1 text-muted"></i>

              <h6 className="mt-3">
                No Question Review Available
              </h6>

              <p className="text-muted mb-0">
                Question review data is not
                available for this attempt.
              </p>

            </div>

          ) : (

            <div>

              {questions.map(
                (
                  question,
                  index
                ) => {

                  const questionNumber =
                    question.order ||
                    index + 1;


                  return (
                    <div
                      key={
                        question.questionId ||
                        index
                      }
                      className="border rounded-3 mb-4 overflow-hidden"
                    >

                      {/* =========================================
                          QUESTION HEADER
                      ========================================= */}

                      <div className="bg-light border-bottom px-4 py-3">

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

                          <div className="d-flex align-items-center">

                            <span
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "38px",
                                height: "38px",
                              }}
                            >
                              {questionNumber}
                            </span>

                            <div>

                              <div className="fw-bold">
                                Question{" "}
                                {questionNumber}
                              </div>

                              <small className="text-muted">
                                {question.questionType ||
                                  "Question"}
                              </small>

                            </div>

                          </div>


                          <QuestionStatusBadge
                            status={
                              question.answerStatus
                            }
                          />

                        </div>

                      </div>


                      {/* =========================================
                          QUESTION BODY
                      ========================================= */}

                      <div className="p-4">

                        {/* QUESTION TEXT */}

                        <div className="mb-4">

                          <label className="form-label fw-bold">
                            Question
                          </label>

                          <div className="bg-light rounded-3 p-3">

                            <p className="mb-0">
                              {question.questionText ||
                                "Question text unavailable"}
                            </p>

                          </div>

                        </div>


                        {/* OPTIONS */}

                        {Array.isArray(
                          question.options
                        ) &&
                          question.options.length >
                            0 && (

                          <div className="mb-4">

                            <label className="form-label fw-bold">
                              Options
                            </label>


                            <div>

                              {question.options.map(
                                (
                                  option,
                                  optionIndex
                                ) => {

                                  const isCorrect =
                                    option.correct;

                                  const isSelected =
                                    option.selected;


                                  let optionClass =
                                    "border rounded-3 p-3 mb-2";


                                  if (
                                    isCorrect
                                  ) {
                                    optionClass +=
                                      " border-success bg-success-subtle";
                                  } else if (
                                    isSelected
                                  ) {
                                    optionClass +=
                                      " border-danger bg-danger-subtle";
                                  }


                                  return (
                                    <div
                                      key={
                                        option._id ||
                                        option.id ||
                                        option.optionId ||
                                        optionIndex
                                      }
                                      className={
                                        optionClass
                                      }
                                    >

                                      <div className="d-flex align-items-center justify-content-between gap-3">

                                        <div className="d-flex align-items-center">

                                          <span className="fw-semibold me-2">
                                            {String.fromCharCode(
                                              65 +
                                                optionIndex
                                            )}
                                            .
                                          </span>

                                          <span>
                                            {option.text ||
                                              `Option ${
                                                optionIndex +
                                                1
                                              }`}
                                          </span>

                                        </div>


                                        <div className="d-flex flex-wrap gap-1">

                                          {isSelected && (
                                            <span className="badge bg-primary">
                                              Student Answer
                                            </span>
                                          )}


                                          {isCorrect && (
                                            <span className="badge bg-success">
                                              Correct Answer
                                            </span>
                                          )}

                                        </div>

                                      </div>

                                    </div>
                                  );
                                }
                              )}

                            </div>

                          </div>
                        )}


                        {/* ======================================
                            ANSWER SECTION
                        ====================================== */}

                        <div className="row g-3 mb-4">

                          {/* STUDENT ANSWER */}

                          <div className="col-lg-6">

                            <div className="h-100 border rounded-3 p-3">

                              <div className="d-flex align-items-center mb-2">

                                <i className="bi bi-person-check text-primary me-2"></i>

                                <strong>
                                  Student Answer
                                </strong>

                              </div>

                              <div className="bg-light rounded-2 p-3">

                                {displayAnswer(
                                  question.studentAnswer
                                )}

                              </div>

                            </div>

                          </div>


                          {/* CORRECT ANSWER */}

                          <div className="col-lg-6">

                            <div className="h-100 border rounded-3 p-3">

                              <div className="d-flex align-items-center mb-2">

                                <i className="bi bi-check-circle text-success me-2"></i>

                                <strong>
                                  Correct Answer
                                </strong>

                              </div>

                              <div className="bg-light rounded-2 p-3">

                                {displayAnswer(
                                  question.correctAnswer
                                )}

                              </div>

                            </div>

                          </div>

                        </div>


                        {/* ======================================
                            MARKS
                        ====================================== */}

                        <div>

                          <label className="form-label fw-bold">
                            Marks
                          </label>

                          <div className="row g-3">

                            <div className="col-6 col-md-3">

                              <div className="border rounded-3 p-3">

                                <small className="text-muted d-block">
                                  Maximum Marks
                                </small>

                                <strong className="fs-5">
                                  {question.marks ??
                                    0}
                                </strong>

                              </div>

                            </div>


                            <div className="col-6 col-md-3">

                              <div className="border rounded-3 p-3">

                                <small className="text-muted d-block">
                                  Awarded
                                </small>

                                <strong className="fs-5 text-success">
                                  {question.awardedMarks ??
                                    0}
                                </strong>

                              </div>

                            </div>


                            <div className="col-6 col-md-3">

                              <div className="border rounded-3 p-3">

                                <small className="text-muted d-block">
                                  Deducted
                                </small>

                                <strong className="fs-5 text-danger">
                                  {question.deductedMarks ??
                                    0}
                                </strong>

                              </div>

                            </div>


                            <div className="col-6 col-md-3">

                              <div className="border rounded-3 p-3">

                                <small className="text-muted d-block">
                                  Manual Review
                                </small>

                                <strong className="fs-6">

                                  {question.requiresManualReview
                                    ? "Required"
                                    : "Not Required"}

                                </strong>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>


      {/* ==================================================
          BOTTOM ACTION
      ================================================== */}

      <div className="d-flex justify-content-between align-items-center mt-4">

        {/* <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate(
              "/admin/student-results"
            )
          }
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Student Results
        </button> */}


        {/* <button
          type="button"
          className="btn btn-primary"
          onClick={fetchResult}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh Result
        </button> */}

      </div>

    </div>
  );
}