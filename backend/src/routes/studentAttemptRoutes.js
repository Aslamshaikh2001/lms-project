// import express from "express";

// import {
//   startAssessment,
//   getMyAttempts,
//   getMyAttempt,
// } from "../controllers/studentAttemptController.js";

// import {
//   authenticate,
// } from "../middlewares/authMiddleware.js";


// const router = express.Router();


// // ======================================================
// // AUTHENTICATION
// // ======================================================

// router.use(
//   authenticate
// );


// // ======================================================
// // START ASSESSMENT
// // ======================================================

// router.post(
//   "/assessments/:id/start",
//   startAssessment
// );


// // ======================================================
// // MY ATTEMPTS FOR ASSESSMENT
// // ======================================================

// router.get(
//   "/assessments/:id/attempts",
//   getMyAttempts
// );


// // ======================================================
// // SINGLE ATTEMPT
// // ======================================================

// router.get(
//   "/attempts/:attemptId",
//   getMyAttempt
// );


// export default router;





import express from "express";

import {
  startAssessment,
  getMyAttempt,
} from "../controllers/studentAttemptController.js";

import {
  authenticate,
} from "../middlewares/authMiddleware.js";


const router = express.Router();


// ======================================================
// AUTHENTICATION
// ======================================================
// All student attempt routes require authentication.

router.use(
  authenticate
);


// ======================================================
// START ASSESSMENT
// ======================================================
// Student starts an assessment and creates/gets an attempt.

router.post(
  "/assessments/:id/start",
  startAssessment
);


// ======================================================
// SINGLE ACTIVE ATTEMPT
// ======================================================
// Used by the student while taking an assessment.
//
// We are keeping this route because the student needs
// the current attempt/question data to continue answering.
//
// The controller/service should later ensure that a
// submitted attempt cannot be used to expose result data.

router.get(
  "/attempts/:attemptId",
  getMyAttempt
);


// ======================================================
// ATTEMPT HISTORY REMOVED
// ======================================================
//
// The following route has intentionally been removed:
//
// GET /assessments/:id/attempts
//
// Reason:
// Students should NOT be able to see their previous
// attempts/history after submission.
//
// Admin/SUPER_ADMIN will get a separate admin result
// endpoint to view student submissions/results.
//
// ======================================================


export default router;