// import express from "express";

// import {
//   getStudentAssessments,
// } from "../controllers/studentAssessmentController.js";

// import {
//   authenticate,
// } from "../middlewares/authMiddleware.js";


// const router = express.Router();


// // ======================================================
// // AUTHENTICATION
// // ======================================================

// router.use(authenticate);


// // ======================================================
// // GET STUDENT ASSESSMENTS
// // ======================================================

// router.get(
//   "/",
//   getStudentAssessments
// );


// export default router;







import express from "express";

import {
  getStudentAssessments,
  getStudentAssessmentDetails,
} from "../controllers/studentAssessmentController.js";

import {
  authenticate,
} from "../middlewares/authMiddleware.js";


const router = express.Router();


// ======================================================
// ALL STUDENT ASSESSMENT ROUTES REQUIRE LOGIN
// ======================================================

router.use(authenticate);


// ======================================================
// GET AVAILABLE ASSESSMENTS
// ======================================================

router.get(
  "/",
  getStudentAssessments
);


// ======================================================
// GET SINGLE ASSESSMENT DETAILS
// ======================================================

router.get(
  "/:id",
  getStudentAssessmentDetails
);


export default router;