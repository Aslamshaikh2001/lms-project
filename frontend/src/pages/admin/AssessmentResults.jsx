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
  getAssessmentResults,
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


const formatPercentage = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "0%";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0%";
  }

  return `${number.toFixed(2)}%`;
};


// ======================================================
// COMPONENT
// ======================================================

export default function AssessmentResults() {
  const navigate = useNavigate();

  const {
    assessmentId,
  } = useParams();


  // ====================================================
  // STATE
  // ====================================================

  const [results, setResults] = useState([]);

  const [assessment, setAssessment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [resultStatus, setResultStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(10);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });


  // ====================================================
  // FETCH RESULTS
  // ====================================================

  const fetchResults = useCallback(
    async () => {
      if (!assessmentId) {
        setError(
          "Assessment ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getAssessmentResults(
            assessmentId,
            {
              page,
              limit,
              search,
              status,
              resultStatus,
            }
          );


        // ----------------------------------------------
        // RESPONSE DATA
        // ----------------------------------------------

        const data =
          response?.data || {};


        // ----------------------------------------------
        // RESULTS
        // ----------------------------------------------

        setResults(
          Array.isArray(data.results)
            ? data.results
            : []
        );


        // ----------------------------------------------
        // ASSESSMENT
        // ----------------------------------------------

        setAssessment(
          data.assessment ||
          null
        );


        // ----------------------------------------------
        // PAGINATION
        // ----------------------------------------------

        if (data.pagination) {
          setPagination(
            data.pagination
          );
        } else {
          setPagination({
            page,
            limit,
            total:
              Array.isArray(
                data.results
              )
                ? data.results.length
                : 0,
            totalPages: 1,
          });
        }

      } catch (err) {
        console.error(
          "FETCH ASSESSMENT RESULTS ERROR:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch assessment results.";

        setError(message);

        setResults([]);

      } finally {
        setLoading(false);
      }
    },
    [
      assessmentId,
      page,
      limit,
      search,
      status,
      resultStatus,
    ]
  );


  // ====================================================
  // INITIAL / FILTER FETCH
  // ====================================================

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);


  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };


  const handleSearchKeyDown = (
    event
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };


  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setResultStatus("");
    setPage(1);
  };


  // ====================================================
  // STATUS CHANGE
  // ====================================================

  const handleStatusChange = (
    event
  ) => {
    setStatus(event.target.value);
    setPage(1);
  };


  // ====================================================
  // RESULT STATUS CHANGE
  // ====================================================

  const handleResultStatusChange = (
    event
  ) => {
    setResultStatus(
      event.target.value
    );

    setPage(1);
  };


  // ====================================================
  // VIEW RESULT
  // ====================================================

  const handleViewResult = (
    attemptId
  ) => {
    if (!attemptId) {
      return;
    }

    navigate(
      `/admin/assessments/attempts/${attemptId}/result`
    );
  };


  // ====================================================
  // PAGE CHANGE
  // ====================================================

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    setPage(
      (currentPage) =>
        currentPage - 1
    );
  };


  const handleNextPage = () => {
    const totalPages =
      Number(
        pagination?.totalPages
      ) || 1;

    if (page >= totalPages) {
      return;
    }

    setPage(
      (currentPage) =>
        currentPage + 1
    );
  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="container-fluid py-4">

        <div className="d-flex justify-content-center align-items-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <span className="ms-3">
            Loading assessment results...
          </span>

        </div>

      </div>
    );
  }


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
            Assessment Results
          </h2>

          <p className="text-muted mb-0">
            View student assessment submissions
            and results.
          </p>

        </div>


        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate("/admin/assessments")
          }
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Assessments
        </button>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >

          <div>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={fetchResults}
          >
            Retry
          </button>

        </div>
      )}


      {/* ==================================================
          ASSESSMENT INFORMATION
      ================================================== */}

      {assessment && (
        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body">

            <div className="row align-items-center">

              <div className="col-md-8">

                <h4 className="fw-bold mb-1">
                  {assessment.title ||
                    "Assessment"}
                </h4>

                {assessment.description && (
                  <p className="text-muted mb-0">
                    {assessment.description}
                  </p>
                )}

              </div>


              <div className="col-md-4 text-md-end mt-3 mt-md-0">

                <span className="badge bg-primary fs-6">
                  {pagination?.total || 0} Submission
                  {Number(
                    pagination?.total || 0
                  ) === 1
                    ? ""
                    : "s"}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}


      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* SEARCH */}

            <div className="col-lg-5">

              <label className="form-label fw-semibold">
                Search Student
              </label>

              <div className="input-group">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by student name, email or attempt ID"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                />

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSearch}
                >
                  <i className="bi bi-search me-1"></i>
                  Search
                </button>

              </div>

            </div>


            {/* STATUS */}

            <div className="col-lg-2">

              <label className="form-label fw-semibold">
                Submission Status
              </label>

              <select
                className="form-select"
                value={status}
                onChange={
                  handleStatusChange
                }
              >

                <option value="">
                  All
                </option>

                <option value="SUBMITTED">
                  Submitted
                </option>

                <option value="AUTO_SUBMITTED">
                  Auto Submitted
                </option>

              </select>

            </div>


            {/* RESULT STATUS */}

            <div className="col-lg-2">

              <label className="form-label fw-semibold">
                Result Status
              </label>

              <select
                className="form-select"
                value={resultStatus}
                onChange={
                  handleResultStatusChange
                }
              >

                <option value="">
                  All
                </option>

                <option value="FINAL">
                  Final
                </option>

                <option value="PENDING_MANUAL_REVIEW">
                  Pending Review
                </option>

              </select>

            </div>


            {/* CLEAR */}

            <div className="col-lg-3 d-flex align-items-end">

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={
                  handleClearFilters
                }
              >
                <i className="bi bi-x-circle me-2"></i>
                Clear Filters
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          RESULT TABLE
      ================================================== */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>

                  <th className="px-3">
                    #
                  </th>

                  <th>
                    Student
                  </th>

                  <th>
                    Attempt
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Percentage
                  </th>

                  <th>
                    Result
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Submitted At
                  </th>

                  <th className="text-end px-3">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {results.length === 0 ? (

                  <tr>

                    <td
                      colSpan="9"
                      className="text-center py-5"
                    >

                      <div className="text-muted">

                        <i className="bi bi-inbox fs-1 d-block mb-3"></i>

                        <h5>
                          No results found
                        </h5>

                        <p className="mb-0">
                          No submitted assessment
                          attempts match your filters.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  results.map(
                    (
                      result,
                      index
                    ) => {

                      const student =
                        result.student ||
                        {};

                      const attemptNumber =
                        result.attemptNumber ??
                        "-";

                      const score =
                        result.score ??
                        0;

                      const totalMarks =
                        result.totalMarks ??
                        0;

                      const passed =
                        result.passed;

                      const isPassed =
                        passed === true;

                      const isFailed =
                        passed === false;


                      return (
                        <tr
                          key={
                            result.attemptId ||
                            `${index}`
                          }
                        >

                          {/* NUMBER */}

                          <td className="px-3">

                            {(
                              (page - 1) *
                                limit
                            ) +
                              index +
                              1}

                          </td>


                          {/* STUDENT */}

                          <td>

                            <div className="d-flex align-items-center">

                              <div
                                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
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

                                <div className="fw-semibold">
                                  {student.name ||
                                    "Unknown Student"}
                                </div>

                                <small className="text-muted">
                                  {student.email ||
                                    "-"}
                                </small>

                              </div>

                            </div>

                          </td>


                          {/* ATTEMPT */}

                          <td>

                            <span className="badge bg-secondary">
                              Attempt{" "}
                              {attemptNumber}
                            </span>

                          </td>


                          {/* SCORE */}

                          <td>

                            <strong>
                              {score}
                            </strong>

                            <span className="text-muted">
                              {" "}
                              / {totalMarks}
                            </span>

                          </td>


                          {/* PERCENTAGE */}

                          <td>

                            <strong>
                              {formatPercentage(
                                result.percentage
                              )}
                            </strong>

                          </td>


                          {/* RESULT */}

                          <td>

                            {isPassed && (
                              <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Passed
                              </span>
                            )}

                            {isFailed && (
                              <span className="badge bg-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                Failed
                              </span>
                            )}

                            {passed === null ||
                              passed ===
                                undefined ? (
                              <span className="badge bg-warning text-dark">
                                Pending
                              </span>
                            ) : null}

                          </td>


                          {/* STATUS */}

                          <td>

                            {result.status ===
                              "AUTO_SUBMITTED" ? (

                              <span className="badge bg-warning text-dark">
                                Auto Submitted
                              </span>

                            ) : (

                              <span className="badge bg-info text-dark">
                                Submitted
                              </span>

                            )}

                          </td>


                          {/* SUBMITTED */}

                          <td>

                            <small>
                              {formatDate(
                                result.submittedAt
                              )}
                            </small>

                          </td>


                          {/* ACTION */}

                          <td className="text-end px-3">

                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                handleViewResult(
                                  result.attemptId
                                )
                              }
                            >
                              <i className="bi bi-eye me-1"></i>
                              View Result
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>


          {/* =================================================
              PAGINATION
          ================================================= */}

          {results.length > 0 && (
            <div className="d-flex flex-wrap justify-content-between align-items-center p-3 border-top">

              <div className="text-muted small">

                Showing page{" "}
                <strong>
                  {pagination?.page ||
                    page}
                </strong>{" "}
                of{" "}
                <strong>
                  {pagination?.totalPages ||
                    1}
                </strong>

                {" • "}

                Total:{" "}
                <strong>
                  {pagination?.total ||
                    results.length}
                </strong>

              </div>


              <div className="btn-group">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={
                    page <= 1
                  }
                  onClick={
                    handlePreviousPage
                  }
                >
                  <i className="bi bi-chevron-left me-1"></i>
                  Previous
                </button>


                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={
                    page >=
                    (
                      Number(
                        pagination?.totalPages
                      ) || 1
                    )
                  }
                  onClick={
                    handleNextPage
                  }
                >
                  Next
                  <i className="bi bi-chevron-right ms-1"></i>
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}