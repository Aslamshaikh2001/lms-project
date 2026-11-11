// import {
//   getAllStudents,
//   getStudentById,
// } from "../services/adminStudentService.js";


// /**
//  * ======================================================
//  * GET ALL STUDENTS
//  * GET /api/admin/students
//  * ======================================================
//  */
// export async function getStudents(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       status = "",
//     } = req.query;

//     const result =
//       await getAllStudents({
//         page,
//         limit,
//         search,
//         status,
//       });

//     res.status(200).json({
//       success: true,
//       message: "Students fetched successfully.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// /**
//  * ======================================================
//  * GET SINGLE STUDENT
//  * GET /api/admin/students/:studentId
//  * ======================================================
//  */
// export async function getStudent(
//   req,
//   res,
//   next
// ) {
//   try {
//     const { studentId } = req.params;

//     const student =
//       await getStudentById(studentId);

//     res.status(200).json({
//       success: true,
//       message: "Student fetched successfully.",
//       data: student,
//     });
//   } catch (error) {
//     next(error);
//   }
// }




import {
  getAllStudents,
  getStudentById,
  deleteStudentById,
  deleteAllStudents as deleteAllStudentsService,
} from "../services/adminStudentService.js";

/**
 * ======================================================
 * GET ALL STUDENTS
 * GET /api/admin/students
 *
 * Supports:
 * - Pagination
 * - Search
 * - Status filter
 * - IT / NON-IT filter
 * - Education level filter
 * - Course-wise filter
 * - Branch / Specialization filter
 * - College-wise filter
 * - Student summary counts
 * ======================================================
 */
export async function getStudents(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      studentCategory = "",
      educationLevel = "",
      courseName = "",
      branch = "",
      collegeName = "",
    } = req.query;

    const result = await getAllStudents({
      page,
      limit,
      search,
      status,
      studentCategory,
      educationLevel,
      courseName,
      branch,
      collegeName,
    });

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ======================================================
 * GET SINGLE STUDENT
 * GET /api/admin/students/:studentId
 * ======================================================
 */
export async function getStudent(req, res, next) {
  try {
    const { studentId } = req.params;

    const student = await getStudentById(studentId);

    return res.status(200).json({
      success: true,
      message: "Student fetched successfully.",
      data: student,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ======================================================
 * DELETE SINGLE STUDENT
 * DELETE /api/admin/students/:studentId
 * ======================================================
 */
export async function deleteStudent(req, res, next) {
  try {
    const { studentId } = req.params;

    const result = await deleteStudentById(studentId);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ======================================================
 * DELETE ALL STUDENTS
 * DELETE /api/admin/students/all
 * ======================================================
 */
export async function deleteAllStudents(req, res, next) {
  try {
    const result = await deleteAllStudentsService();

    return res.status(200).json({
      success: true,
      message: "All student records deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

