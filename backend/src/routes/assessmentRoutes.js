
// import express from "express";

// import {
//   createAssessment,
//   getAssessments,
//   getAssessmentById,
//   updateAssessment,
//   deleteAssessment,
//   publishAssessment,
//   unpublishAssessment,
// } from "../controllers/assessmentController.js";

// import {
//   validateCreateAssessment,
//   validateUpdateAssessment,
// } from "../validators/assessmentValidator.js";

// import { authenticate } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // ========================================
// // AUTHENTICATION
// // ========================================

// router.use(authenticate);

// // ========================================
// // CREATE ASSESSMENT
// // POST /api/assessments
// // ========================================

// router.post(
//   "/",
//   validateCreateAssessment,
//   createAssessment
// );

// // ========================================
// // GET ALL ASSESSMENTS
// // GET /api/assessments
// // ========================================

// router.get(
//   "/",
//   getAssessments
// );

// // ========================================
// // GET SINGLE ASSESSMENT
// // GET /api/assessments/:id
// // ========================================

// router.get(
//   "/:id",
//   getAssessmentById
// );

// // ========================================
// // UPDATE ASSESSMENT
// // PUT /api/assessments/:id
// // ========================================

// router.put(
//   "/:id",
//   validateUpdateAssessment,
//   updateAssessment
// );

// // ========================================
// // DELETE ASSESSMENT
// // DELETE /api/assessments/:id
// // ========================================

// router.delete(
//   "/:id",
//   deleteAssessment
// );

// // ========================================
// // PUBLISH ASSESSMENT
// // PATCH /api/assessments/:id/publish
// // ========================================

// router.patch(
//   "/:id/publish",
//   publishAssessment
// );

// // ========================================
// // UNPUBLISH ASSESSMENT
// // PATCH /api/assessments/:id/unpublish
// // ========================================

// router.patch(
//   "/:id/unpublish",
//   unpublishAssessment
// );

// export default router;





import express from "express";

import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  publishAssessment,
  unpublishAssessment,
} from "../controllers/assessmentController.js";

import {
  validateCreateAssessment,
  validateUpdateAssessment,
} from "../validators/assessmentValidator.js";

import {
  authenticate,
} from "../middlewares/authMiddleware.js";


const router = express.Router();


// ======================================================
// AUTHENTICATION
// ======================================================
//
// All assessment management routes require authentication.
//

router.use(
  authenticate
);


// ======================================================
// CREATE ASSESSMENT
// ======================================================
//
// POST
// /api/assessments
//
// Creates a new assessment.
//

router.post(
  "/",
  validateCreateAssessment,
  createAssessment
);


// ======================================================
// GET ALL ASSESSMENTS
// ======================================================
//
// GET
// /api/assessments
//
// Gets assessment records.
//

router.get(
  "/",
  getAssessments
);


// ======================================================
// GET SINGLE ASSESSMENT
// ======================================================
//
// GET
// /api/assessments/:id
//
// Gets a single assessment.
//

router.get(
  "/:id",
  getAssessmentById
);


// ======================================================
// UPDATE ASSESSMENT
// ======================================================
//
// PUT
// /api/assessments/:id
//
// Updates an existing assessment.
//

router.put(
  "/:id",
  validateUpdateAssessment,
  updateAssessment
);


// ======================================================
// DELETE ASSESSMENT
// ======================================================
//
// DELETE
// /api/assessments/:id
//
// Deletes an assessment.
//

router.delete(
  "/:id",
  deleteAssessment
);


// ======================================================
// PUBLISH ASSESSMENT
// ======================================================
//
// PATCH
// /api/assessments/:id/publish
//
// Publishes an assessment.
//

router.patch(
  "/:id/publish",
  publishAssessment
);


// ======================================================
// UNPUBLISH ASSESSMENT
// ======================================================
//
// PATCH
// /api/assessments/:id/unpublish
//
// Unpublishes an assessment.
//

router.patch(
  "/:id/unpublish",
  unpublishAssessment
);


export default router;