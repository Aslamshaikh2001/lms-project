
// import {
//   evaluateAttempt,
//   getAttemptResult,
// } from "../services/studentEvaluationService.js";

// // ======================================================
// // SUBMIT ASSESSMENT
// // ======================================================

// export const submitAssessment =
//   async (req, res) => {
//     try {
//       const {
//         attemptId,
//       } = req.params;

//       const studentId =
//         req.user?._id ||
//         req.user?.id ||
//         req.user?.userId;

//       if (!studentId) {
//         return res.status(401).json({
//           success: false,
//           message:
//             "Authenticated student not found.",
//         });
//       }

//       // ==================================================
//       // CHECK IF EXPIRED
//       // ==================================================

//       const result =
//         await evaluateAttempt(
//           attemptId,
//           studentId,
//           "MANUAL"
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           result.status ===
//           "AUTO_SUBMITTED"
//             ? "Assessment time expired. Assessment was automatically submitted."
//             : result.resultStatus ===
//               "PENDING_MANUAL_REVIEW"
//             ? "Assessment submitted. Some answers require manual review."
//             : "Assessment submitted successfully.",
//         data: result,
//       });
//     } catch (error) {
//       console.error(
//         "Submit Assessment Error:",
//         error
//       );

//       let statusCode = 500;

//       if (
//         error.code ===
//         "INVALID_ATTEMPT_ID"
//       ) {
//         statusCode = 400;
//       }

//       if (
//         error.code ===
//         "INVALID_STUDENT_ID"
//       ) {
//         statusCode = 400;
//       }

//       if (
//         error.code ===
//         "ATTEMPT_NOT_FOUND"
//       ) {
//         statusCode = 404;
//       }

//       if (
//         error.code ===
//         "ATTEMPT_NOT_SUBMITTABLE"
//       ) {
//         statusCode = 400;
//       }

//       return res.status(
//         statusCode
//       ).json({
//         success: false,
//         message:
//           error.message ||
//           "Failed to submit assessment.",
//       });
//     }
//   };

// // ======================================================
// // GET RESULT
// // ======================================================

// export const getResult =
//   async (req, res) => {
//     try {
//       const {
//         attemptId,
//       } = req.params;

//       const studentId =
//         req.user?._id ||
//         req.user?.id ||
//         req.user?.userId;

//       if (!studentId) {
//         return res.status(401).json({
//           success: false,
//           message:
//             "Authenticated student not found.",
//         });
//       }

//       const result =
//         await getAttemptResult(
//           attemptId,
//           studentId
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           "Assessment result fetched successfully.",
//         data: result,
//       });
//     } catch (error) {
//       console.error(
//         "Get Assessment Result Error:",
//         error
//       );

//       let statusCode = 500;

//       if (
//         error.code ===
//         "INVALID_ATTEMPT_ID"
//       ) {
//         statusCode = 400;
//       }

//       if (
//         error.code ===
//         "INVALID_STUDENT_ID"
//       ) {
//         statusCode = 400;
//       }

//       if (
//         error.code ===
//         "ATTEMPT_NOT_FOUND"
//       ) {
//         statusCode = 404;
//       }

//       if (
//         error.code ===
//         "RESULT_NOT_AVAILABLE"
//       ) {
//         statusCode = 400;
//       }

//       return res.status(
//         statusCode
//       ).json({
//         success: false,
//         message:
//           error.message ||
//           "Failed to fetch assessment result.",
//       });
//     }
//   };




import {
  evaluateAttempt,
} from "../services/studentEvaluationService.js";


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
// SUBMIT ASSESSMENT
// POST /api/student/attempts/:attemptId/submit
// ======================================================

export const submitAssessment =
  async (req, res) => {
    try {

      // --------------------------------------------------
      // GET ATTEMPT ID
      // --------------------------------------------------

      const {
        attemptId,
      } = req.params;


      // --------------------------------------------------
      // GET STUDENT ID
      // --------------------------------------------------

      const studentId =
        getStudentId(req);


      // --------------------------------------------------
      // CHECK AUTHENTICATION
      // --------------------------------------------------

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated student not found.",
        });
      }


      // ==================================================
      // EVALUATE ATTEMPT
      // ==================================================
      //
      // IMPORTANT:
      //
      // evaluateAttempt() will:
      //
      // 1. Validate attempt
      // 2. Check student ownership
      // 3. Evaluate answers
      // 4. Calculate score
      // 5. Calculate percentage
      // 6. Calculate correct answers
      // 7. Calculate wrong answers
      // 8. Save result in database
      //
      // BUT WE WILL NOT SEND THE RESULT
      // BACK TO THE STUDENT.
      //
      // ==================================================

      const result =
        await evaluateAttempt(
          attemptId,
          studentId,
          "MANUAL"
        );


      // ==================================================
      // STUDENT RESPONSE
      // ==================================================
      //
      // DO NOT SEND:
      //
      // result.score
      // result.percentage
      // result.correctAnswers
      // result.wrongAnswers
      // result.totalMarks
      // result.passed
      //
      // Only send submission information.
      // ==================================================

      let message =
        "Assessment submitted successfully.";


      if (
        result.status ===
        "AUTO_SUBMITTED"
      ) {

        message =
          "Assessment time expired. Assessment was automatically submitted.";

      } else if (
        result.resultStatus ===
        "PENDING_MANUAL_REVIEW"
      ) {

        message =
          "Assessment submitted successfully. Your submission has been recorded.";

      }


      return res.status(200).json({

        success: true,

        message,

        // ------------------------------------------------
        // ONLY NON-RESULT INFORMATION
        // ------------------------------------------------

        data: {

          attemptId:
            result.attemptId,

          status:
            result.status,

          resultStatus:
            result.resultStatus,

          submittedAt:
            result.submittedAt,

        },

      });

    } catch (error) {

      console.error(
        "Submit Assessment Error:",
        error
      );


      // ==================================================
      // ERROR STATUS
      // ==================================================

      let statusCode = 500;


      // --------------------------------------------------
      // INVALID ATTEMPT ID
      // --------------------------------------------------

      if (
        error.code ===
        "INVALID_ATTEMPT_ID"
      ) {

        statusCode = 400;

      }


      // --------------------------------------------------
      // INVALID STUDENT ID
      // --------------------------------------------------

      if (
        error.code ===
        "INVALID_STUDENT_ID"
      ) {

        statusCode = 400;

      }


      // --------------------------------------------------
      // ATTEMPT NOT FOUND
      // --------------------------------------------------

      if (
        error.code ===
        "ATTEMPT_NOT_FOUND"
      ) {

        statusCode = 404;

      }


      // --------------------------------------------------
      // ATTEMPT NOT SUBMITTABLE
      // --------------------------------------------------

      if (
        error.code ===
        "ATTEMPT_NOT_SUBMITTABLE"
      ) {

        statusCode = 400;

      }


      // ==================================================
      // ERROR RESPONSE
      // ==================================================

      return res.status(
        statusCode
      ).json({

        success: false,

        message:
          error.message ||
          "Failed to submit assessment.",

      });

    }
  };


// ======================================================
// GET RESULT
// ======================================================
//
// IMPORTANT:
//
// STUDENTS SHOULD NOT GET THEIR RESULT.
//
// Result will be displayed only on ADMIN SIDE.
//
// We are intentionally keeping this controller
// temporarily so existing imports do not immediately
// break.
//
// The route will be changed in the next step.
// ======================================================

export const getResult =
  async (req, res) => {

    try {

      // --------------------------------------------------
      // GET USER ROLE
      // --------------------------------------------------

      const role =
        req.user?.role ||
        req.user?.userRole;


      // --------------------------------------------------
      // STUDENT RESULT ACCESS BLOCKED
      // --------------------------------------------------

      if (
        role === "STUDENT"
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Assessment results are not available to students.",

        });

      }


      // --------------------------------------------------
      // RESULT ENDPOINT SHOULD NOT BE USED HERE
      // --------------------------------------------------
      //
      // Admin result functionality will be implemented
      // through a separate admin controller/service.
      //
      // --------------------------------------------------

      return res.status(403).json({

        success: false,

        message:
          "Use the admin assessment results endpoint.",

      });

    } catch (error) {

      console.error(
        "Get Assessment Result Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to process assessment result request.",

      });

    }
  };