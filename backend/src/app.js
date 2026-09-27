
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/authRoutes.js";
// import assessmentRoutes from "./routes/assessmentRoutes.js";
// import questionRoutes from "./routes/questionRoutes.js";
// import studentAssessmentRoutes from "./routes/studentAssessmentRoutes.js";
// import studentAttemptRoutes from "./routes/studentAttemptRoutes.js";
// import studentQuestionRoutes from "./routes/studentQuestionRoutes.js";
// import studentSubmissionRoutes from "./routes/studentSubmissionRoutes.js";
// import studentReviewRoutes from "./routes/studentReviewRoutes.js";
// import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
// import studentSecurityRoutes from "./routes/studentSecurityRoutes.js";
// import adminStudentRoutes from "./routes/adminStudentRoutes.js";
// import adminAssessmentAssignmentRoutes from "./routes/adminAssessmentAssignmentRoutes.js";

// import {
//   errorHandler,
// } from "./middlewares/errorMiddleware.js";

// const app = express();


// // ===============================
// // CORS
// // ===============================

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );


// // ===============================
// // BODY PARSER
// // ===============================

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));


// // ===============================
// // COOKIE PARSER
// // ===============================

// app.use(cookieParser());


// // ===============================
// // HEALTH CHECK
// // ===============================

// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "LMS backend is running",
//   });
// });


// // ===============================
// // AUTH ROUTES
// // ===============================

// app.use("/api/auth", authRoutes);


// // ===============================
// // ASSESSMENT ROUTES
// // ===============================

// app.use(
//   "/api/assessments",
//   assessmentRoutes
// );

// app.use(
//   "/api/questions",
//   questionRoutes
// );


// app.use(
//   "/api/student/assessments",
//   studentAssessmentRoutes
// );

// app.use(
//   "/api/student",
//   studentAttemptRoutes
// );



// app.use(
//   "/api/student",
//   studentQuestionRoutes
// );


// app.use(
//   "/api/student",
//   studentSubmissionRoutes
// );

// app.use(
//   "/api/student",
//   studentReviewRoutes
// );

// app.use(
//   "/api/student",
//   studentDashboardRoutes
// );

// app.use(
//   "/api/student",
//   studentSecurityRoutes
// );

// app.use(
//   "/api/admin",
//   adminAssessmentAssignmentRoutes
// );



// app.use(
//   "/api/admin",
//   adminStudentRoutes
// );


// // ===============================
// // ERROR HANDLER
// // ===============================

// app.use(errorHandler);


// export default app;






import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

import studentAssessmentRoutes from "./routes/studentAssessmentRoutes.js";
import studentAttemptRoutes from "./routes/studentAttemptRoutes.js";
import studentQuestionRoutes from "./routes/studentQuestionRoutes.js";
import studentSubmissionRoutes from "./routes/studentSubmissionRoutes.js";
import studentReviewRoutes from "./routes/studentReviewRoutes.js";
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import studentSecurityRoutes from "./routes/studentSecurityRoutes.js";

import adminStudentRoutes from "./routes/adminStudentRoutes.js";
import adminAssessmentAssignmentRoutes from "./routes/adminAssessmentAssignmentRoutes.js";

// ======================================================
// NEW ADMIN ASSESSMENT RESULT ROUTES
// ======================================================

import adminAssessmentResultRoutes from "./routes/adminAssessmentResultRoutes.js";

import {
  errorHandler,
} from "./middlewares/errorMiddleware.js";

const app = express();


// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);


// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================================================
// COOKIE PARSER
// ======================================================

app.use(cookieParser());


// ======================================================
// HEALTH CHECK
// ======================================================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "LMS backend is running",
    });
  }
);


// ======================================================
// AUTH ROUTES
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);


// ======================================================
// ASSESSMENT ROUTES
// ======================================================

app.use(
  "/api/assessments",
  assessmentRoutes
);


// ======================================================
// QUESTION ROUTES
// ======================================================

app.use(
  "/api/questions",
  questionRoutes
);


// ======================================================
// STUDENT ASSESSMENT ROUTES
// ======================================================

app.use(
  "/api/student/assessments",
  studentAssessmentRoutes
);


// ======================================================
// STUDENT ATTEMPT ROUTES
// ======================================================

app.use(
  "/api/student",
  studentAttemptRoutes
);


// ======================================================
// STUDENT QUESTION ROUTES
// ======================================================

app.use(
  "/api/student",
  studentQuestionRoutes
);


// ======================================================
// STUDENT SUBMISSION ROUTES
// ======================================================

app.use(
  "/api/student",
  studentSubmissionRoutes
);


// ======================================================
// STUDENT REVIEW ROUTES
// ======================================================

app.use(
  "/api/student",
  studentReviewRoutes
);


// ======================================================
// STUDENT DASHBOARD ROUTES
// ======================================================

app.use(
  "/api/student",
  studentDashboardRoutes
);


// ======================================================
// STUDENT SECURITY ROUTES
// ======================================================

app.use(
  "/api/student",
  studentSecurityRoutes
);


// ======================================================
// ADMIN ASSESSMENT ASSIGNMENT ROUTES
// ======================================================

app.use(
  "/api/admin",
  adminAssessmentAssignmentRoutes
);


// ======================================================
// ADMIN STUDENT ROUTES
// ======================================================

app.use(
  "/api/admin",
  adminStudentRoutes
);


// ======================================================
// ADMIN ASSESSMENT RESULT ROUTES
// ======================================================
//
// Admin can:
//   1. View all submitted student results
//   2. View one student's complete result
//   3. View question-by-question review
//
// Base URL:
//
// /api/admin
//
// Endpoints:
//
// GET
// /api/admin/assessments/:assessmentId/results
//
// GET
// /api/admin/assessments/attempts/:attemptId/result
//
// ======================================================

app.use(
  "/api/admin",
  adminAssessmentResultRoutes
);


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(errorHandler);


export default app;