import express from "express";

import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  publishQuestion,
  unpublishQuestion,
  getQuestionsByAssessment,
} from "../controllers/questionController.js";

import {
  validateCreateQuestion,
  validateUpdateQuestion,
} from "../validators/questionValidator.js";

import {
  handleValidationErrors,
} from "../middlewares/validationMiddleware.js";

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
// CREATE
// POST /api/questions
// ======================================================

router.post(
  "/",
  validateCreateQuestion,
  handleValidationErrors,
  createQuestion
);


// ======================================================
// GET ALL
// GET /api/questions
// ======================================================

router.get(
  "/",
  getQuestions
);


// ======================================================
// GET QUESTIONS BY ASSESSMENT
//
// IMPORTANT:
// This must come BEFORE /:id
//
// GET
// /api/questions/assessment/:assessmentId
// ======================================================

router.get(
  "/assessment/:assessmentId",
  getQuestionsByAssessment
);


// ======================================================
// GET ONE
// GET /api/questions/:id
// ======================================================

router.get(
  "/:id",
  getQuestionById
);


// ======================================================
// UPDATE
// PUT /api/questions/:id
// ======================================================

router.put(
  "/:id",
  validateUpdateQuestion,
  handleValidationErrors,
  updateQuestion
);


// ======================================================
// DELETE
// DELETE /api/questions/:id
// ======================================================

router.delete(
  "/:id",
  deleteQuestion
);


// ======================================================
// PUBLISH
// PATCH /api/questions/:id/publish
// ======================================================

router.patch(
  "/:id/publish",
  publishQuestion
);


// ======================================================
// UNPUBLISH
// PATCH /api/questions/:id/unpublish
// ======================================================

router.patch(
  "/:id/unpublish",
  unpublishQuestion
);


export default router;