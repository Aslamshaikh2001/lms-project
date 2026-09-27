import {
  createAssessmentAssignment,
  bulkAssignAssessment,
  getAssessmentAssignments,
  getAssessmentAssignmentById,
  getAssignedStudents,
  revokeAssessmentAssignment,
  reactivateAssessmentAssignment,
  deleteAssessmentAssignment,
} from "../services/assessmentAssignmentService.js";

// ======================================================
// GET ADMIN ID
// ======================================================

const getAdminId = (req) => {
  return req.user?.id;
};

// ======================================================
// CREATE SINGLE ASSIGNMENT
// ======================================================

export const createAssignment =
  async (req, res, next) => {
    try {
      const assignedBy =
        getAdminId(req);

      const {
        studentId,
        assessmentId,
        availableFrom,
        dueDate,
        maxAttempts,
        notes,
      } = req.body;

      const result =
        await createAssessmentAssignment({
          studentId,
          assessmentId,
          assignedBy,
          availableFrom,
          dueDate,
          maxAttempts,
          notes,
        });

      return res.status(201).json({
        success: true,

        message: result.reactivated
          ? "Assessment assignment reactivated successfully."
          : "Assessment assigned successfully.",

        data: result.assignment,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// BULK ASSIGN
// ======================================================

export const bulkAssign =
  async (req, res, next) => {
    try {
      const assignedBy =
        getAdminId(req);

      const {
        studentIds,
        assessmentId,
        availableFrom,
        dueDate,
        maxAttempts,
        notes,
      } = req.body;

      const result =
        await bulkAssignAssessment({
          studentIds,
          assessmentId,
          assignedBy,
          availableFrom,
          dueDate,
          maxAttempts,
          notes,
        });

      return res.status(201).json({
        success: true,

        message:
          "Assessment assignment process completed.",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// GET ALL ASSIGNMENTS
// ======================================================

export const getAssignments =
  async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        status = "",
        assessmentId = "",
        studentId = "",
      } = req.query;

      const result =
        await getAssessmentAssignments({
          page,
          limit,
          search,
          status,
          assessmentId,
          studentId,
        });

      return res.status(200).json({
        success: true,

        message:
          "Assessment assignments fetched successfully.",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// GET ASSIGNMENT BY ID
// ======================================================

export const getAssignment =
  async (req, res, next) => {
    try {
      const {
        assignmentId,
      } = req.params;

      const assignment =
        await getAssessmentAssignmentById(
          assignmentId
        );

      return res.status(200).json({
        success: true,

        message:
          "Assessment assignment fetched successfully.",

        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// GET STUDENTS ASSIGNED TO ASSESSMENT
// ======================================================

export const getAssessmentStudents =
  async (req, res, next) => {
    try {
      const {
        assessmentId,
      } = req.params;

      const {
        page = 1,
        limit = 10,
        search = "",
        status = "",
      } = req.query;

      const result =
        await getAssignedStudents({
          assessmentId,
          page,
          limit,
          search,
          status,
        });

      return res.status(200).json({
        success: true,

        message:
          "Assigned students fetched successfully.",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// REVOKE
// ======================================================

export const revokeAssignment =
  async (req, res, next) => {
    try {
      const {
        assignmentId,
      } = req.params;

      const assignment =
        await revokeAssessmentAssignment({
          assignmentId,
        });

      return res.status(200).json({
        success: true,

        message:
          "Assessment assignment revoked successfully.",

        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// REACTIVATE
// ======================================================

export const reactivateAssignment =
  async (req, res, next) => {
    try {
      const {
        assignmentId,
      } = req.params;

      const assignedBy =
        getAdminId(req);

      const assignment =
        await reactivateAssessmentAssignment({
          assignmentId,
          assignedBy,
        });

      return res.status(200).json({
        success: true,

        message:
          "Assessment assignment reactivated successfully.",

        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// DELETE
// ======================================================

export const deleteAssignment =
  async (req, res, next) => {
    try {
      const {
        assignmentId,
      } = req.params;

      await deleteAssessmentAssignment(
        assignmentId
      );

      return res.status(200).json({
        success: true,

        message:
          "Assessment assignment deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };