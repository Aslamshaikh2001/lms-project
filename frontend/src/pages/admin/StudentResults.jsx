import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getStudentResults,
  deleteStudentResult,
} from "../../services/adminAssessmentResultService.js";


// ======================================================
// CUSTOM STYLES
// ======================================================

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeInUp 0.3s ease-out forwards;
  }

  .no-horizontal-scroll {
    overflow-x: hidden !important;
  }

  .table-row-hover {
    transition: background-color 0.15s ease-in-out;
  }

  .table-row-hover:hover {
    background-color: #f8fafc !important;
  }

  .action-btn {
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .action-btn:hover {
    transform: translateY(-1px);
  }

  .action-btn:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    transform: none;
  }
`;


// ======================================================
// STUDENT RESULTS
// ======================================================

export default function StudentResults() {

  const navigate = useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [
    results,
    setResults,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // ====================================================
  // SEARCH
  // ====================================================

  const [
    searchInput,
    setSearchInput,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  // ====================================================
  // FILTERS
  // ====================================================

  const [
    status,
    setStatus,
  ] = useState("");


  const [
    resultStatus,
    setResultStatus,
  ] = useState("");


  // ====================================================
  // PAGINATION
  // ====================================================

  const [
    page,
    setPage,
  ] = useState(1);


  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });


  // ====================================================
  // DELETE STATE
  // ====================================================

  const [
    deletingAttemptId,
    setDeletingAttemptId,
  ] = useState(null);


  // ====================================================
  // FETCH RESULTS
  // ====================================================

  const fetchResults = useCallback(
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getStudentResults({
            page,
            limit: 10,
            search,
            status,
            resultStatus,
          });


        const data =
          response?.data || {};


        // ------------------------------------------------
        // RESULTS
        // ------------------------------------------------

        setResults(
          Array.isArray(
            data.results
          )
            ? data.results
            : []
        );


        // ------------------------------------------------
        // PAGINATION
        // ------------------------------------------------

        setPagination(
          data.pagination || {
            page,
            limit: 10,
            total: 0,
            totalPages: 1,
          }
        );

      } catch (err) {

        console.error(
          "FETCH STUDENT RESULTS ERROR:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch student results."
        );


        setResults([]);

      } finally {

        setLoading(false);

      }

    },
    [
      page,
      search,
      status,
      resultStatus,
    ]
  );


  // ====================================================
  // LOAD RESULTS
  // ====================================================

  useEffect(() => {

    fetchResults();

  }, [fetchResults]);


  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = () => {

    setPage(1);

    setSearch(
      searchInput.trim()
    );

  };


  // ====================================================
  // SEARCH ENTER
  // ====================================================

  const handleSearchKeyDown = (
    event
  ) => {

    if (
      event.key ===
      "Enter"
    ) {

      handleSearch();

    }

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
  // DELETE RESULT
  // ====================================================

  const handleDeleteResult =
    async (
      attemptId
    ) => {

      if (!attemptId) {
        return;
      }


      // ------------------------------------------------
      // CONFIRM DELETE
      // ------------------------------------------------

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this student assessment result?"
        );


      if (!confirmed) {
        return;
      }


      try {

        // ----------------------------------------------
        // SET DELETE LOADING
        // ----------------------------------------------

        setDeletingAttemptId(
          attemptId
        );


        setError("");


        // ----------------------------------------------
        // DELETE FROM BACKEND
        // ----------------------------------------------

        await deleteStudentResult(
          attemptId
        );


        // ----------------------------------------------
        // REFRESH DATA
        // ----------------------------------------------

        await fetchResults();

      } catch (err) {

        console.error(
          "DELETE STUDENT RESULT ERROR:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete student assessment result."
        );

      } finally {

        setDeletingAttemptId(
          null
        );

      }

    };


  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "-";
    }


    try {

      return new Date(
        date
      ).toLocaleString(
        undefined,
        {
          dateStyle: "short",
          timeStyle: "short",
        }
      );

    } catch {

      return "-";

    }

  };


  // ====================================================
  // STATUS CHANGE
  // ====================================================

  const handleStatusChange = (
    event
  ) => {

    setStatus(
      event.target.value
    );

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
  // PREVIOUS PAGE
  // ====================================================

  const handlePreviousPage = () => {

    setPage(
      (currentPage) =>
        Math.max(
          currentPage - 1,
          1
        )
    );

  };


  // ====================================================
  // NEXT PAGE
  // ====================================================

  const handleNextPage = () => {

    setPage(
      (currentPage) =>
        Math.min(
          currentPage + 1,
          pagination.totalPages
        )
    );

  };


  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          container-fluid
          py-5
          d-flex
          justify-content-center
          align-items-center
        "
      >

        <style>
          {styles}
        </style>


        <div
          className="
            text-center
            animate-fade-in
            p-5
            bg-white
            rounded-3
            shadow-lg
          "
        >

          <div
            className="
              spinner-border
              text-primary
              mb-3
            "
            style={{
              width: "2.8rem",
              height: "2.8rem",
            }}
            role="status"
          >

            <span className="visually-hidden">
              Loading...
            </span>

          </div>


          <h6
            className="
              fw-semibold
              text-dark
              mb-1
            "
          >
            Loading Results
          </h6>


          <p
            className="
              text-muted
              mb-0
              small
            "
          >
            Please wait...
          </p>

        </div>

      </div>

    );

  }


  // ====================================================
  // MAIN UI
  // ====================================================

  return (

    <div
      className="
        container-fluid
        py-4
        px-3
        px-md-4
        animate-fade-in
        no-horizontal-scroll
      "
    >

      <style>
        {styles}
      </style>


      {/* ==================================================
          HEADER
          ================================================== */}

      <div
        className="
          d-flex
          flex-column
          flex-md-row
          justify-content-between
          align-items-md-center
          mb-4
          gap-3
        "
      >

        <div>

          <h2
            className="
              fw-bold
              text-dark
              mb-1
            "
          >
            Student Results
          </h2>


          <p
            className="
              text-muted
              mb-0
            "
          >
            View all submitted student assessment results.
          </p>

        </div>


        <div>

          <span
            className="
              badge
              bg-primary
              bg-opacity-10
              text-primary
              border
              border-primary
              border-opacity-25
              px-3
              py-2
              fs-6
              rounded-pill
              shadow-sm
            "
          >

            Total Submissions:

            <strong className="ms-1">
              {pagination.total || 0}
            </strong>

          </span>

        </div>

      </div>


      {/* ==================================================
          ERROR ALERT
          ================================================== */}

      {error && (

        <div
          className="
            alert
            alert-danger
            shadow-sm
            rounded-3
            border-0
            d-flex
            align-items-center
            justify-content-between
            mb-4
          "
        >

          <div
            className="
              d-flex
              align-items-center
            "
          >

            <i
              className="
                bi
                bi-exclamation-triangle-fill
                me-2
              "
            />

            <span>
              {error}
            </span>

          </div>


          <button
            type="button"
            className="
              btn
              btn-sm
              btn-outline-danger
              rounded-2
              ms-3
            "
            onClick={
              fetchResults
            }
          >
            Retry
          </button>

        </div>

      )}


      {/* ==================================================
          FILTER CARD
          ================================================== */}

      <div
        className="
          card
          border-0
          shadow-lg
          rounded-3
          mb-4
        "
      >

        <div
          className="
            card-body
            p-3
            p-md-4
          "
        >

          <div
            className="
              row
              g-3
              align-items-end
            "
          >


            {/* ==================================================
                SEARCH
                ================================================== */}

            <div
              className="
                col-lg-6
                col-md-12
              "
            >

              <label
                className="
                  form-label
                  fw-semibold
                  text-secondary
                  small
                  mb-1
                "
              >
                SEARCH
              </label>


              <div
                className="
                  input-group
                  shadow-sm
                  rounded-2
                  overflow-hidden
                "
              >

                <span
                  className="
                    input-group-text
                    bg-white
                    border-end-0
                    text-muted
                  "
                >

                  <i
                    className="
                      bi
                      bi-search
                    "
                  />

                </span>


                <input
                  type="text"
                  className="
                    form-control
                    border-start-0
                    ps-0
                  "
                  placeholder="
                    Search student name or attempt ID...
                  "
                  value={
                    searchInput
                  }
                  onChange={(
                    event
                  ) =>
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
                  className="
                    btn
                    btn-primary
                    px-4
                    fw-medium
                  "
                  onClick={
                    handleSearch
                  }
                >
                  Search
                </button>

              </div>

            </div>


            {/* ==================================================
                STATUS FILTER
                ================================================== */}

            <div
              className="
                col-lg-3
                col-md-6
              "
            >

              <label
                className="
                  form-label
                  fw-semibold
                  text-secondary
                  small
                  mb-1
                "
              >
                SUBMISSION STATUS
              </label>


              <select
                className="
                  form-select
                  shadow-sm
                "
                value={
                  status
                }
                onChange={
                  handleStatusChange
                }
              >

                <option value="">
                  All Statuses
                </option>

                <option value="SUBMITTED">
                  Submitted
                </option>

                <option value="AUTO_SUBMITTED">
                  Auto Submitted
                </option>

              </select>

            </div>


            {/* ==================================================
                RESULT FILTER
                ================================================== */}

            <div
              className="
                col-lg-3
                col-md-6
              "
            >

              <label
                className="
                  form-label
                  fw-semibold
                  text-secondary
                  small
                  mb-1
                "
              >
                RESULT
              </label>


              <select
                className="
                  form-select
                  shadow-sm
                "
                value={
                  resultStatus
                }
                onChange={
                  handleResultStatusChange
                }
              >

                <option value="">
                  All Results
                </option>

                <option value="FINAL">
                  Final
                </option>

                <option value="PENDING_MANUAL_REVIEW">
                  Pending Review
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          RESULTS TABLE
          ================================================== */}

      <div
        className="
          card
          border-0
          shadow-lg
          rounded-3
          no-horizontal-scroll
        "
      >

        <div
          className="
            w-100
            no-horizontal-scroll
          "
        >

          <table
            className="
              table
              table-hover
              align-middle
              mb-0
              w-100
            "
          >

            {/* ==================================================
                TABLE HEADER
                ================================================== */}

            <thead
              className="
                bg-light
                border-bottom
              "
            >

              <tr
                className="
                  text-secondary
                  small
                  text-uppercase
                  fw-bold
                "
              >

                <th
                  className="
                    py-3
                    px-3
                  "
                  style={{
                    width: "45px",
                  }}
                >
                  #
                </th>


                <th
                  className="
                    py-3
                    px-2
                  "
                >
                  Student
                </th>


                <th
                  className="
                    py-3
                    px-2
                  "
                >
                  Assessment
                </th>


                <th
                  className="
                    py-3
                    px-2
                    text-center
                  "
                  style={{
                    width: "85px",
                  }}
                >
                  Score
                </th>


                <th
                  className="
                    py-3
                    px-2
                    text-center
                  "
                  style={{
                    width: "110px",
                  }}
                >
                  Result
                </th>


                <th
                  className="
                    py-3
                    px-2
                    text-center
                  "
                  style={{
                    width: "130px",
                  }}
                >
                  Status
                </th>


                <th
                  className="
                    py-3
                    px-2
                  "
                  style={{
                    width: "150px",
                  }}
                >
                  Submitted At
                </th>


                <th
                  className="
                    py-3
                    px-3
                    text-center
                  "
                  style={{
                    width: "125px",
                  }}
                >
                  Actions
                </th>

              </tr>

            </thead>


            {/* ==================================================
                TABLE BODY
                ================================================== */}

            <tbody>

              {results.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="
                      text-center
                      py-5
                    "
                  >

                    <div
                      className="py-3"
                    >

                      <i
                        className="
                          bi
                          bi-inbox
                          fs-2
                          text-muted
                          d-block
                          mb-2
                        "
                      />


                      <h6
                        className="
                          fw-bold
                          text-dark
                          mb-1
                        "
                      >
                        No student results found
                      </h6>


                      <p
                        className="
                          text-muted
                          small
                          mb-0
                        "
                      >
                        Submitted assessment results
                        will appear here.
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

                    const assessment =
                      result.assessment ||
                      {};


                    const itemIndex =
                      (
                        (
                          pagination.page -
                          1
                        ) *
                        pagination.limit
                      ) +
                      index +
                      1;


                    const isDeleting =
                      deletingAttemptId ===
                      result.attemptId;


                    return (

                      <tr
                        key={
                          result.attemptId ||
                          index
                        }
                        className="
                          table-row-hover
                          border-bottom
                        "
                      >

                        {/* ==================================================
                            INDEX
                            ================================================== */}

                        <td
                          className="
                            px-3
                            fw-medium
                            text-muted
                            small
                          "
                        >
                          {itemIndex}
                        </td>


                        {/* ==================================================
                            STUDENT
                            ================================================== */}

                        <td
                          className="px-2"
                        >

                          <div
                            className="
                              d-flex
                              align-items-center
                            "
                          >

                            <div
                              className="
                                rounded-circle
                                bg-primary
                                bg-opacity-10
                                text-primary
                                fw-bold
                                d-flex
                                align-items-center
                                justify-content-center
                                me-2
                                border
                                border-primary
                                border-opacity-25
                              "
                              style={{
                                width: "34px",
                                height: "34px",
                                minWidth: "34px",
                                fontSize: "14px",
                              }}
                            >

                              {(
                                student.name ||
                                "S"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div
                              className="
                                overflow-hidden
                              "
                            >

                              <div
                                className="
                                  fw-semibold
                                  text-dark
                                  text-truncate
                                "
                                style={{
                                  maxWidth:
                                    "160px",
                                }}
                              >
                                {student.name ||
                                  "Unknown Student"}
                              </div>


                              {student.email && (

                                <small
                                  className="
                                    text-muted
                                    text-truncate
                                    d-block
                                  "
                                  style={{
                                    maxWidth:
                                      "160px",
                                  }}
                                >
                                  {student.email}
                                </small>

                              )}

                            </div>

                          </div>

                        </td>


                        {/* ==================================================
                            ASSESSMENT
                            ================================================== */}

                        <td
                          className="px-2"
                        >

                          <span
                            className="
                              fw-semibold
                              text-secondary
                              text-truncate
                              d-block
                            "
                            style={{
                              maxWidth:
                                "180px",
                            }}
                          >
                            {assessment.title ||
                              "Untitled Assessment"}
                          </span>

                        </td>


                        {/* ==================================================
                            SCORE
                            ================================================== */}

                        <td
                          className="
                            px-2
                            text-center
                          "
                        >

                          <span
                            className="
                              badge
                              bg-light
                              text-dark
                              border
                              px-2
                              py-1
                              fs-6
                              fw-bold
                            "
                          >

                            {result.score ??
                              0}

                            <span
                              className="
                                text-muted
                                fw-normal
                              "
                            >
                              {" "}
                              /
                              {" "}
                              {result.totalMarks ??
                                0}
                            </span>

                          </span>

                        </td>


                        {/* ==================================================
                            RESULT
                            ================================================== */}

                        <td
                          className="
                            px-2
                            text-center
                          "
                        >

                          {result.passed ===
                            true && (

                            <span
                              className="
                                badge
                                bg-success
                                bg-opacity-10
                                text-success
                                border
                                border-success
                                border-opacity-25
                                px-2
                                py-1
                                rounded-pill
                                small
                              "
                            >

                              <i
                                className="
                                  bi
                                  bi-check-circle-fill
                                  me-1
                                "
                              />

                              Passed

                            </span>

                          )}


                          {result.passed ===
                            false && (

                            <span
                              className="
                                badge
                                bg-danger
                                bg-opacity-10
                                text-danger
                                border
                                border-danger
                                border-opacity-25
                                px-2
                                py-1
                                rounded-pill
                                small
                              "
                            >

                              <i
                                className="
                                  bi
                                  bi-x-circle-fill
                                  me-1
                                "
                              />

                              Failed

                            </span>

                          )}


                          {result.passed ===
                            undefined && (

                            <span
                              className="
                                badge
                                bg-warning
                                bg-opacity-10
                                text-warning-emphasis
                                border
                                border-warning
                                border-opacity-25
                                px-2
                                py-1
                                rounded-pill
                                small
                              "
                            >
                              Pending
                            </span>

                          )}

                        </td>


                        {/* ==================================================
                            STATUS
                            ================================================== */}

                        <td
                          className="
                            px-2
                            text-center
                          "
                        >

                          {result.status ===
                            "AUTO_SUBMITTED" ? (

                            <span
                              className="
                                badge
                                bg-warning
                                text-dark
                                border
                                border-warning
                                px-2
                                py-1
                                rounded-1
                                small
                              "
                            >
                              Auto Submitted
                            </span>

                          ) : (

                            <span
                              className="
                                badge
                                bg-info
                                bg-opacity-10
                                text-info-emphasis
                                border
                                border-info
                                border-opacity-25
                                px-2
                                py-1
                                rounded-1
                                small
                              "
                            >
                              Submitted
                            </span>

                          )}

                        </td>


                        {/* ==================================================
                            DATE
                            ================================================== */}

                        <td
                          className="px-2"
                        >

                          <small
                            className="
                              text-muted
                              fw-medium
                              text-nowrap
                            "
                          >
                            {formatDate(
                              result.submittedAt
                            )}
                          </small>

                        </td>


                        {/* ==================================================
                            ACTIONS
                            ================================================== */}

                        <td
                          className="
                            px-3
                            text-center
                          "
                        >

                          <div
                            className="
                              d-flex
                              justify-content-center
                              align-items-center
                              gap-1
                            "
                          >

                            {/* ==============================================
                                VIEW
                                ============================================== */}

                            <button
                              type="button"
                              className="
                                btn
                                btn-sm
                                btn-outline-primary
                                action-btn
                                p-1
                                px-2
                                rounded-2
                              "
                              title="View Result"
                              onClick={() =>
                                handleViewResult(
                                  result.attemptId
                                )
                              }
                              disabled={
                                isDeleting
                              }
                            >

                              <i
                                className="
                                  bi
                                  bi-eye-fill
                                "
                              />

                            </button>


                            {/* ==============================================
                                DELETE
                                ============================================== */}

                            <button
                              type="button"
                              className="
                                btn
                                btn-sm
                                btn-outline-danger
                                action-btn
                                p-1
                                px-2
                                rounded-2
                              "
                              title="Delete Result"
                              onClick={() =>
                                handleDeleteResult(
                                  result.attemptId
                                )
                              }
                              disabled={
                                isDeleting
                              }
                            >

                              {isDeleting ? (

                                <span
                                  className="
                                    spinner-border
                                    spinner-border-sm
                                  "
                                  role="status"
                                  aria-hidden="true"
                                />

                              ) : (

                                <i
                                  className="
                                    bi
                                    bi-trash-fill
                                  "
                                />

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>


        {/* ==================================================
            PAGINATION
            ================================================== */}

        <div
          className="
            card-footer
            bg-white
            border-top
            py-3
            px-3
            px-md-4
          "
        >

          <div
            className="
              d-flex
              flex-column
              flex-sm-row
              justify-content-between
              align-items-center
              gap-2
            "
          >

            <span
              className="
                text-muted
                small
              "
            >

              Showing page

              {" "}

              <strong
                className="text-dark"
              >
                {pagination.page}
              </strong>

              {" "}of{" "}

              <strong
                className="text-dark"
              >
                {pagination.totalPages}
              </strong>

            </span>


            <div
              className="
                btn-group
                shadow-sm
              "
            >

              {/* ==============================================
                  PREVIOUS
                  ============================================== */}

              <button
                type="button"
                className="
                  btn
                  btn-sm
                  btn-outline-secondary
                  px-3
                "
                disabled={
                  page <= 1 ||
                  loading
                }
                onClick={
                  handlePreviousPage
                }
              >

                <i
                  className="
                    bi
                    bi-chevron-left
                    me-1
                  "
                />

                Previous

              </button>


              {/* ==============================================
                  NEXT
                  ============================================== */}

              <button
                type="button"
                className="
                  btn
                  btn-sm
                  btn-outline-secondary
                  px-3
                "
                disabled={
                  page >=
                    pagination.totalPages ||
                  loading
                }
                onClick={
                  handleNextPage
                }
              >

                Next

                <i
                  className="
                    bi
                    bi-chevron-right
                    ms-1
                  "
                />

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}