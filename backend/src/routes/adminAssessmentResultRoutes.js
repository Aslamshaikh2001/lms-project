import express from "express";


import {
  getStudentResults,
  getStudentResultDetails,
  deleteStudentResult,
} from "../controllers/adminAssessmentResultController.js";


import {
  authenticate,
} from "../middlewares/authMiddleware.js";


const router =
  express.Router();


// ======================================================
// AUTHENTICATION
// ======================================================

router.use(
  authenticate
);


// ======================================================
// GET ALL STUDENT RESULTS
// ======================================================
//
// GET
// /api/admin/student-results
//
// ======================================================

router.get(
  "/student-results",
  getStudentResults
);


// ======================================================
// GET SINGLE STUDENT RESULT
// ======================================================
//
// GET
// /api/admin/assessments/attempts/:attemptId/result
//
// ======================================================

router.get(
  "/assessments/attempts/:attemptId/result",
  getStudentResultDetails
);


// ======================================================
// DELETE STUDENT RESULT
// ======================================================
//
// DELETE
// /api/admin/assessments/attempts/:attemptId/result
//
// ADMIN:
// ADMIN
// SUPER_ADMIN
//
// ======================================================

router.delete(
  "/assessments/attempts/:attemptId/result",
  deleteStudentResult
);


export default router;