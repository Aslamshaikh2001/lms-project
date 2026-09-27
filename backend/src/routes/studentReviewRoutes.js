// import express from "express";

// import {
//   getStudentAttemptReview,
// } from "../controllers/studentReviewController.js";

// import {
//   authenticate,
// } from "../middlewares/authMiddleware.js";

// const router =
//   express.Router();

// // ======================================================
// // AUTHENTICATION
// // ======================================================

// router.use(
//   authenticate
// );

// // ======================================================
// // GET ATTEMPT REVIEW
// // ======================================================
// //
// // GET
// // /attempts/:attemptId/review
// //
// // ======================================================

// router.get(
//   "/attempts/:attemptId/review",
//   getStudentAttemptReview
// );

// export default router;






import express from "express";

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
// Currently there are NO student review routes here
// because students should not be able to see:
//
// - Correct answers
// - Wrong answers
// - Question-wise review
// - Marks obtained
// - Explanation/review information
//
// Admin/SUPER_ADMIN review functionality will be added
// through separate admin routes.
//

router.use(
  authenticate
);


// ======================================================
// STUDENT REVIEW ROUTES REMOVED
// ======================================================
//
// Previously:
//
// GET /attempts/:attemptId/review
//
// This endpoint has intentionally been removed from the
// student API.
//
// Students should submit the assessment and leave.
// Assessment review/result information is available
// only to ADMIN/SUPER_ADMIN.
//

export default router;