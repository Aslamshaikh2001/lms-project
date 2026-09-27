

// import * as attemptService from "../services/studentAttemptService.js";

// // ======================================================
// // GET STUDENT ID
// // ======================================================

// const getStudentId = (req) => {
//   return (
//     req.user?._id ||
//     req.user?.id ||
//     req.user?.userId
//   );
// };

// // ======================================================
// // START ASSESSMENT
// // POST /api/student/assessments/:id/start
// // ======================================================

// export const startAssessment = async (req, res) => {
//   try {
//     const studentId = getStudentId(req);

//     // --------------------------------------------------
//     // CHECK AUTHENTICATION
//     // --------------------------------------------------

//     if (!studentId) {
//       return res.status(401).json({
//         success: false,
//         message: "Student authentication required",
//       });
//     }

//     // --------------------------------------------------
//     // START ASSESSMENT
//     // --------------------------------------------------

//     const attempt = await attemptService.startAssessment(
//       req.params.id,
//       studentId
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Assessment started successfully",
//       data: attempt,
//     });
//   } catch (error) {
//     console.error(
//       "START ASSESSMENT ERROR:",
//       error
//     );

//     // --------------------------------------------------
//     // ERROR STATUS
//     // --------------------------------------------------

//     let statusCode = 400;

//     const message = error.message || "";

//     if (
//       message === "Invalid assessment ID." ||
//       message === "Invalid student ID."
//     ) {
//       statusCode = 400;
//     }

//     if (
//       message ===
//       "Assessment not found or is not published."
//     ) {
//       statusCode = 404;
//     }

//     if (
//       message ===
//       "Assessment has not started yet."
//     ) {
//       statusCode = 400;
//     }

//     if (
//       message ===
//       "Assessment has expired."
//     ) {
//       statusCode = 400;
//     }

//     if (
//       message ===
//       "Maximum assessment attempts reached."
//     ) {
//       statusCode = 400;
//     }

//     if (
//       message ===
//       "No published questions are available for this assessment."
//     ) {
//       statusCode = 400;
//     }

//     return res.status(statusCode).json({
//       success: false,
//       message:
//         message ||
//         "Failed to start assessment",
//     });
//   }
// };

// // ======================================================
// // GET MY ATTEMPTS
// // GET /api/student/assessments/:id/attempts
// // ======================================================

// export const getMyAttempts = async (req, res) => {
//   try {
//     const studentId = getStudentId(req);

//     // --------------------------------------------------
//     // CHECK AUTHENTICATION
//     // --------------------------------------------------

//     if (!studentId) {
//       return res.status(401).json({
//         success: false,
//         message: "Student authentication required",
//       });
//     }

//     // --------------------------------------------------
//     // GET ATTEMPTS
//     // --------------------------------------------------

//     const attempts =
//       await attemptService.getMyAttempts(
//         req.params.id,
//         studentId
//       );

//     return res.status(200).json({
//       success: true,
//       message: "Attempts fetched successfully",
//       data: attempts,
//     });
//   } catch (error) {
//     console.error(
//       "GET MY ATTEMPTS ERROR:",
//       error
//     );

//     const message = error.message || "";

//     // --------------------------------------------------
//     // ERROR STATUS
//     // --------------------------------------------------

//     let statusCode = 400;

//     if (
//       message === "Assessment not found"
//     ) {
//       statusCode = 404;
//     }

//     if (
//       message === "Invalid assessment ID."
//     ) {
//       statusCode = 400;
//     }

//     if (
//       message === "Invalid student ID."
//     ) {
//       statusCode = 400;
//     }

//     return res.status(statusCode).json({
//       success: false,
//       message:
//         message ||
//         "Failed to fetch attempts",
//     });
//   }
// };

// // ======================================================
// // GET SINGLE ATTEMPT
// // GET /api/student/attempts/:attemptId
// // ======================================================

// export const getMyAttempt = async (req, res) => {
//   try {
//     const studentId = getStudentId(req);

//     // --------------------------------------------------
//     // CHECK AUTHENTICATION
//     // --------------------------------------------------

//     if (!studentId) {
//       return res.status(401).json({
//         success: false,
//         message: "Student authentication required",
//       });
//     }

//     // --------------------------------------------------
//     // GET SINGLE ATTEMPT
//     // --------------------------------------------------

//     const attempt =
//       await attemptService.getMyAttempt(
//         req.params.attemptId,
//         studentId
//       );

//     return res.status(200).json({
//       success: true,
//       message: "Attempt fetched successfully",
//       data: attempt,
//     });
//   } catch (error) {
//     console.error(
//       "GET MY ATTEMPT ERROR:",
//       error
//     );

//     const message = error.message || "";

//     // --------------------------------------------------
//     // ERROR STATUS
//     // --------------------------------------------------

//     let statusCode = 400;

//     if (
//       message ===
//         "Assessment attempt not found." ||
//       message ===
//         "Attempt not found"
//     ) {
//       statusCode = 404;
//     }

//     if (
//       message === "Invalid attempt ID." ||
//       message === "Invalid student ID."
//     ) {
//       statusCode = 400;
//     }

//     return res.status(statusCode).json({
//       success: false,
//       message:
//         message ||
//         "Failed to fetch attempt",
//     });
//   }
// };









import * as attemptService from "../services/studentAttemptService.js";


// ======================================================
// GET STUDENT ID
// ======================================================

const getStudentId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    req.user?.userId
  );
};


// ======================================================
// START ASSESSMENT
// POST /api/student/assessments/:id/start
// ======================================================

export const startAssessment = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    // --------------------------------------------------
    // CHECK AUTHENTICATION
    // --------------------------------------------------

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    // --------------------------------------------------
    // START ASSESSMENT
    // --------------------------------------------------

    const attempt = await attemptService.startAssessment(
      req.params.id,
      studentId
    );

    return res.status(201).json({
      success: true,
      message: "Assessment started successfully",
      data: attempt,
    });
  } catch (error) {
    console.error(
      "START ASSESSMENT ERROR:",
      error
    );

    const message = error.message || "";

    // --------------------------------------------------
    // ERROR STATUS
    // --------------------------------------------------

    let statusCode = 400;

    if (
      message === "Invalid assessment ID." ||
      message === "Invalid student ID."
    ) {
      statusCode = 400;
    }

    if (
      message ===
      "Assessment not found or is not published."
    ) {
      statusCode = 404;
    }

    if (
      message ===
      "Assessment has not started yet."
    ) {
      statusCode = 400;
    }

    if (
      message ===
      "Assessment has expired."
    ) {
      statusCode = 400;
    }

    if (
      message ===
      "Maximum assessment attempts reached."
    ) {
      statusCode = 400;
    }

    if (
      message ===
      "No published questions are available for this assessment."
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message:
        message ||
        "Failed to start assessment",
    });
  }
};


// ======================================================
// GET SINGLE ATTEMPT
// GET /api/student/attempts/:attemptId
// ======================================================
//
// IMPORTANT:
//
// This endpoint is used while the student is taking
// the assessment.
//
// It must NOT expose:
//
// - Score
// - Percentage
// - Pass/fail
// - Correct answer count
// - Wrong answer count
// - Manual review information
// - Grading key
// - Correct options
// - Question-wise evaluation
//
// The actual sanitization is handled in
// studentAttemptService.js.
//

export const getMyAttempt = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    // --------------------------------------------------
    // CHECK AUTHENTICATION
    // --------------------------------------------------

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    // --------------------------------------------------
    // GET SINGLE ATTEMPT
    // --------------------------------------------------

    const attempt =
      await attemptService.getMyAttempt(
        req.params.attemptId,
        studentId
      );

    return res.status(200).json({
      success: true,
      message: "Attempt fetched successfully",
      data: attempt,
    });
  } catch (error) {
    console.error(
      "GET MY ATTEMPT ERROR:",
      error
    );

    const message = error.message || "";

    // --------------------------------------------------
    // ERROR STATUS
    // --------------------------------------------------

    let statusCode = 400;

    if (
      message ===
        "Assessment attempt not found." ||
      message ===
        "Attempt not found"
    ) {
      statusCode = 404;
    }

    if (
      message === "Invalid attempt ID." ||
      message === "Invalid student ID."
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message:
        message ||
        "Failed to fetch attempt",
    });
  }
};


// ======================================================
// GET MY ATTEMPTS
// ======================================================
//
// REMOVED FROM STUDENT API
//
// Previously:
//
// GET /api/student/assessments/:id/attempts
//
// Students should not be able to see their attempt
// history or previous submissions.
//
// Therefore this controller is intentionally removed.
//
// Admin/SUPER_ADMIN will later have a separate endpoint
// to view all submitted attempts/results.
//
