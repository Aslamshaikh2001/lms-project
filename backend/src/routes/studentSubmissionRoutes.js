
// import express from "express";

// import {
//   submitAssessment,
//   getResult,
// } from "../controllers/studentSubmissionController.js";

// import {
//   authenticate,
// } from "../middlewares/authMiddleware.js";

// // ======================================================
// // CREATE ROUTER
// // ======================================================

// const router = express.Router();

// // ======================================================
// // AUTHENTICATION
// // ======================================================
// //
// // Every route in this file requires a logged-in user.
// //

// router.use(authenticate);

// // ======================================================
// // SUBMIT ASSESSMENT
// // ======================================================
// //
// // POST
// // /api/student/attempts/:attemptId/submit
// //
// // This will:
// // 1. Verify the student owns the attempt
// // 2. Evaluate answers
// // 3. Calculate marks
// // 4. Apply negative marking
// // 5. Calculate percentage
// // 6. Determine pass/fail
// // 7. Detect manual-review questions
// // 8. Mark expired attempts as AUTO_SUBMITTED
// //

// router.post(
//   "/attempts/:attemptId/submit",
//   submitAssessment
// );

// // ======================================================
// // GET ASSESSMENT RESULT
// // ======================================================
// //
// // GET
// // /api/student/attempts/:attemptId/result
// //
// // This returns the final/partial result after submission.
// //

// router.get(
//   "/attempts/:attemptId/result",
//   getResult
// );

// // ======================================================
// // EXPORT ROUTER
// // ======================================================

// export default router;






import express from "express";

import {
  submitAssessment,
} from "../controllers/studentSubmissionController.js";

import {
  authenticate,
} from "../middlewares/authMiddleware.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router = express.Router();


// ======================================================
// AUTHENTICATION
// ======================================================
//
// Every route in this file requires a logged-in user.
//

router.use(
  authenticate
);


// ======================================================
// SUBMIT ASSESSMENT
// ======================================================
//
// POST
// /api/student/attempts/:attemptId/submit
//
// This will:
//
// 1. Verify the student owns the attempt
// 2. Evaluate answers
// 3. Calculate marks
// 4. Apply negative marking
// 5. Calculate percentage
// 6. Determine pass/fail
// 7. Detect manual-review questions
// 8. Mark expired attempts as AUTO_SUBMITTED
// 9. Save the evaluation/result in the database
//
// IMPORTANT:
//
// The controller should NOT return the actual result,
// marks, percentage, correct answers, or review data
// to the student.
//
// It should only return submission information.
//

router.post(
  "/attempts/:attemptId/submit",
  submitAssessment
);


// ======================================================
// STUDENT RESULT ROUTE REMOVED
// ======================================================
//
// Previously:
//
// GET
// /api/student/attempts/:attemptId/result
//
// This endpoint has intentionally been removed.
//
// Students should NOT be able to:
//
// - View score
// - View percentage
// - View pass/fail
// - View correct answers
// - View wrong answers
// - View marks obtained
// - View question-wise result
// - View assessment review
//
// The result is still calculated and stored in the
// database by evaluateAttempt().
//
// ADMIN/SUPER_ADMIN will access results through a
// separate admin endpoint.
//

export default router;
