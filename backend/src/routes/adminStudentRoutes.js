// import express from "express";

// import {
//   getStudents,
//   getStudent,
// } from "../controllers/adminStudentController.js";

// import {
//   authenticate,
// } from "../middlewares/authMiddleware.js";

// const router = express.Router();


// // ======================================================
// // AUTHENTICATION
// // ======================================================

// router.use(authenticate);


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
// STUDENTS
// ======================================================

router.get(
  "/students",
  getStudents
);

router.get(
  "/students/:studentId",
  getStudent
);


export default router;