import {
  getAllStudentResults,
  getAssessmentAttemptResult,
  deleteStudentAssessmentResult,
} from "../services/adminAssessmentResultService.js";


// ======================================================
// CHECK ADMIN ACCESS
// ======================================================

function checkAdminAccess(
  req,
  res
) {

  const role =
    req.user?.role ||
    req.user?.userRole;


  if (
    role !== "ADMIN" &&
    role !== "SUPER_ADMIN"
  ) {

    res.status(403).json({
      success: false,
      message:
        "Access denied. Only ADMIN and SUPER_ADMIN can manage student assessment results.",
    });

    return false;
  }


  return true;
}


// ======================================================
// GET ALL STUDENT RESULTS
//
// GET /api/admin/student-results
// ======================================================

export async function getStudentResults(
  req,
  res,
  next
) {

  try {

    // --------------------------------------------------
    // ADMIN ACCESS
    // --------------------------------------------------

    if (
      !checkAdminAccess(
        req,
        res
      )
    ) {
      return;
    }


    // --------------------------------------------------
    // QUERY PARAMETERS
    // --------------------------------------------------

    const {
      page = 1,
      limit = 10,
      search = "",
      assessmentId = "",
      status = "",
      resultStatus = "",
    } = req.query;


    // --------------------------------------------------
    // GET RESULTS
    // --------------------------------------------------

    const result =
      await getAllStudentResults({
        page,
        limit,
        search,
        assessmentId,
        status,
        resultStatus,
      });


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Student assessment results fetched successfully.",

      data: result,
    });

  } catch (error) {

    console.error(
      "GET STUDENT RESULTS ERROR:",
      error
    );

    next(error);
  }
}


// ======================================================
// GET SINGLE STUDENT RESULT
//
// GET
// /api/admin/assessments/attempts/:attemptId/result
// ======================================================

export async function getStudentResultDetails(
  req,
  res,
  next
) {

  try {

    // --------------------------------------------------
    // ADMIN ACCESS
    // --------------------------------------------------

    if (
      !checkAdminAccess(
        req,
        res
      )
    ) {
      return;
    }


    // --------------------------------------------------
    // GET ATTEMPT ID
    // --------------------------------------------------

    const {
      attemptId,
    } = req.params;


    // --------------------------------------------------
    // GET RESULT
    // --------------------------------------------------

    const result =
      await getAssessmentAttemptResult(
        attemptId
      );


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Student assessment result fetched successfully.",

      data: result,
    });

  } catch (error) {

    console.error(
      "GET STUDENT RESULT DETAILS ERROR:",
      error
    );

    next(error);
  }
}


// ======================================================
// DELETE STUDENT RESULT
//
// DELETE
// /api/admin/assessments/attempts/:attemptId/result
// ======================================================

export async function deleteStudentResult(
  req,
  res,
  next
) {

  try {

    // --------------------------------------------------
    // ADMIN ACCESS
    // --------------------------------------------------

    if (
      !checkAdminAccess(
        req,
        res
      )
    ) {
      return;
    }


    // --------------------------------------------------
    // GET ATTEMPT ID
    // --------------------------------------------------

    const {
      attemptId,
    } = req.params;


    // --------------------------------------------------
    // DELETE RESULT
    // --------------------------------------------------

    const result =
      await deleteStudentAssessmentResult(
        attemptId
      );


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Student assessment result deleted successfully.",

      data: result,
    });

  } catch (error) {

    console.error(
      "DELETE STUDENT RESULT ERROR:",
      error
    );


    // --------------------------------------------------
    // INVALID ATTEMPT ID
    // --------------------------------------------------

    if (
      error.code ===
      "INVALID_ATTEMPT_ID"
    ) {

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }


    // --------------------------------------------------
    // ATTEMPT NOT FOUND
    // --------------------------------------------------

    if (
      error.code ===
      "ATTEMPT_NOT_FOUND"
    ) {

      return res.status(404).json({
        success: false,
        message:
          error.message,
      });
    }


    // --------------------------------------------------
    // ATTEMPT NOT SUBMITTED
    // --------------------------------------------------

    if (
      error.code ===
      "ATTEMPT_NOT_SUBMITTED"
    ) {

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }


    // --------------------------------------------------
    // OTHER ERRORS
    // --------------------------------------------------

    next(error);
  }
}