import express from "express";

import {
  createAssignment,
  bulkAssign,
  getAssignments,
  getAssignment,
  getAssessmentStudents,
  revokeAssignment,
  reactivateAssignment,
  deleteAssignment,
} from "../controllers/adminAssessmentAssignmentController.js";

import {
  authenticate,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router =
  express.Router();

// ======================================================
// ADMIN AUTHORIZATION
// ======================================================

router.use(authenticate);

router.use(
  authorizeRoles(
    "ADMIN",
    "SUPER_ADMIN"
  )
);

// ======================================================
// CREATE SINGLE ASSIGNMENT
// ======================================================

router.post(
  "/assessment-assignments",
  createAssignment
);

// ======================================================
// BULK ASSIGN
// ======================================================

router.post(
  "/assessment-assignments/bulk",
  bulkAssign
);

// ======================================================
// GET ALL ASSIGNMENTS
// ======================================================

router.get(
  "/assessment-assignments",
  getAssignments
);

// ======================================================
// GET STUDENTS FOR SPECIFIC ASSESSMENT
// ======================================================

router.get(
  "/assessments/:assessmentId/assigned-students",
  getAssessmentStudents
);

// ======================================================
// GET SINGLE ASSIGNMENT
// ======================================================

router.get(
  "/assessment-assignments/:assignmentId",
  getAssignment
);

// ======================================================
// REVOKE
// ======================================================

router.patch(
  "/assessment-assignments/:assignmentId/revoke",
  revokeAssignment
);

// ======================================================
// REACTIVATE
// ======================================================

router.patch(
  "/assessment-assignments/:assignmentId/reactivate",
  reactivateAssignment
);

// ======================================================
// DELETE
// ======================================================

router.delete(
  "/assessment-assignments/:assignmentId",
  deleteAssignment
);

export default router;