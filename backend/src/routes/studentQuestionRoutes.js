import express from "express";

import {
  getStudentAttemptQuestions,
  saveStudentAnswer,
} from "../controllers/studentQuestionController.js";

import {
  authenticate,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ======================================================
// AUTHENTICATION
// ======================================================

router.use(authenticate);

// ======================================================
// GET QUESTIONS
// ======================================================

router.get(
  "/attempts/:attemptId/questions",
  getStudentAttemptQuestions
);

// ======================================================
// SAVE ANSWER
// ======================================================

router.patch(
  "/attempts/:attemptId/answers",
  saveStudentAnswer
);

export default router;