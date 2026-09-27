import express from "express";

import {
  getStudentDashboard,
} from "../controllers/studentDashboardController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ============================================================
 * All student dashboard routes require authentication
 * ============================================================
 */
router.use(authenticate);

/**
 * ============================================================
 * GET STUDENT DASHBOARD
 *
 * GET /api/student/dashboard
 * ============================================================
 */
router.get(
  "/dashboard",
  getStudentDashboard
);

export default router;