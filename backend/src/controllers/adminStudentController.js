import {
  getAllStudents,
  getStudentById,
} from "../services/adminStudentService.js";


/**
 * ======================================================
 * GET ALL STUDENTS
 * GET /api/admin/students
 * ======================================================
 */
export async function getStudents(
  req,
  res,
  next
) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
    } = req.query;

    const result =
      await getAllStudents({
        page,
        limit,
        search,
        status,
      });

    res.status(200).json({
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
export async function getStudent(
  req,
  res,
  next
) {
  try {
    const { studentId } = req.params;

    const student =
      await getStudentById(studentId);

    res.status(200).json({
      success: true,
      message: "Student fetched successfully.",
      data: student,
    });
  } catch (error) {
    next(error);
  }
}