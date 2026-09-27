import * as studentDashboardService from "../services/studentDashboardService.js";

/**
 * ============================================================
 * Get Student ID
 * ============================================================
 */
const getStudentId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    req.user?.userId
  );
};

/**
 * ============================================================
 * GET STUDENT DASHBOARD
 *
 * GET /api/student/dashboard
 * ============================================================
 */
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const dashboard =
      await studentDashboardService.getStudentDashboard(
        studentId
      );

    return res.status(200).json({
      success: true,
      message: "Student dashboard fetched successfully.",
      data: dashboard,
    });
  } catch (error) {
    console.error(
      "GET STUDENT DASHBOARD ERROR:",
      error
    );

    if (error.message === "Invalid student ID.") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Student not found.") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch student dashboard.",
    });
  }
};