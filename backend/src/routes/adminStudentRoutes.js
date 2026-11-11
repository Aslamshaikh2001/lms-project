

// import express from "express";

// import {
//   getStudents,
//   getStudent,
// } from "../controllers/adminStudentController.js";

// import {
//   authenticate,
//   authorizeRoles,
// } from "../middlewares/authMiddleware.js";

// const router = express.Router();


// // ======================================================
// // AUTHENTICATION
// // ======================================================

// router.use(authenticate);


// // ======================================================
// // ADMIN / SUPER ADMIN AUTHORIZATION
// // ======================================================

// router.use(
//   authorizeRoles(
//     "ADMIN",
//     "SUPER_ADMIN"
//   )
// );


// // ======================================================
// // STUDENTS
// // ======================================================

// router.get(
//   "/students",
//   getStudents
// );

// router.get(
//   "/students/:studentId",
//   getStudent
// );


// export default router;



import express from "express";

import {
  getStudents,
  getStudent,
  deleteStudent,
  deleteAllStudents,
} from "../controllers/adminStudentController.js";

import {
  authenticate,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ======================================================
// AUTHENTICATION
// ======================================================

router.use(authenticate);

// ======================================================
// ADMIN / SUPER ADMIN AUTHORIZATION
// ======================================================

router.use(
  authorizeRoles(
    "ADMIN",
    "SUPER_ADMIN"
  )
);

// ======================================================
// GET STUDENTS
// Supports:
// - Pagination
// - Search
// - Status filter
// - IT / NON-IT filter
// - Education level filter
// - Course-wise filter
// - Specialization / Branch-wise filter
// - College-wise filter
// - Student counts and category counts
// ======================================================

router.get(
  "/students",
  getStudents
);

// ======================================================
// GET SINGLE STUDENT
// ======================================================

router.get(
  "/students/:studentId",
  getStudent
);

// ======================================================
// DELETE ALL STUDENTS
// ======================================================

router.delete(
  "/students/all",
  deleteAllStudents
);

// ======================================================
// DELETE SINGLE STUDENT
// ======================================================

router.delete(
  "/students/:studentId",
  deleteStudent
);

export default router;
