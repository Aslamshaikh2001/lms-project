import express from "express";

import {
  recordSecurityViolation,
  getSecurityStatus,
} from "../controllers/studentSecurityController.js";

import {
  authenticate,
} from "../middlewares/authMiddleware.js";


const router =
  express.Router();


router.use(
  authenticate
);


/* ============================================================
   POST SECURITY EVENT
   ============================================================ */

router.post(
  "/attempts/:attemptId/security-events",
  recordSecurityViolation
);


/* ============================================================
   GET SECURITY STATUS
   ============================================================ */

router.get(
  "/attempts/:attemptId/security-status",
  getSecurityStatus
);


export default router;