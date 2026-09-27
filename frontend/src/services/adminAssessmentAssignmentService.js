import api from "../api/axios";

// ======================================================
// CREATE SINGLE ASSIGNMENT
// ======================================================

export const createAssessmentAssignment = async ({
  studentId,
  assessmentId,
  availableFrom = null,
  dueDate = null,
  maxAttempts = null,
  notes = "",
}) => {
  const response = await api.post(
    "/admin/assessment-assignments",
    {
      studentId,
      assessmentId,
      availableFrom,
      dueDate,
      maxAttempts,
      notes,
    }
  );

  return response.data;
};

// ======================================================
// BULK ASSIGN STUDENTS
// ======================================================

export const bulkAssignAssessment = async ({
  studentIds,
  assessmentId,
  availableFrom = null,
  dueDate = null,
  maxAttempts = null,
  notes = "",
}) => {
  const response = await api.post(
    "/admin/assessment-assignments/bulk",
    {
      studentIds,
      assessmentId,
      availableFrom,
      dueDate,
      maxAttempts,
      notes,
    }
  );

  return response.data;
};

// ======================================================
// GET ALL ASSIGNMENTS
// ======================================================

export const getAssessmentAssignments =
  async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    assessmentId = "",
    studentId = "",
  } = {}) => {
    const response = await api.get(
      "/admin/assessment-assignments",
      {
        params: {
          page,
          limit,
          search,
          status,
          assessmentId,
          studentId,
        },
      }
    );

    return response.data;
  };

// ======================================================
// GET ASSIGNMENT BY ID
// ======================================================

export const getAssessmentAssignmentById =
  async (assignmentId) => {
    const response = await api.get(
      `/admin/assessment-assignments/${assignmentId}`
    );

    return response.data;
  };

// ======================================================
// GET STUDENTS ASSIGNED TO ASSESSMENT
// ======================================================

export const getAssessmentAssignedStudents =
  async ({
    assessmentId,
    page = 1,
    limit = 100,
    search = "",
    status = "",
  }) => {
    const response = await api.get(
      `/admin/assessments/${assessmentId}/assigned-students`,
      {
        params: {
          page,
          limit,
          search,
          status,
        },
      }
    );

    return response.data;
  };

// ======================================================
// REVOKE ASSIGNMENT
// ======================================================

export const revokeAssessmentAssignment =
  async (assignmentId) => {
    const response = await api.patch(
      `/admin/assessment-assignments/${assignmentId}/revoke`
    );

    return response.data;
  };

// ======================================================
// REACTIVATE ASSIGNMENT
// ======================================================

export const reactivateAssessmentAssignment =
  async (assignmentId) => {
    const response = await api.patch(
      `/admin/assessment-assignments/${assignmentId}/reactivate`
    );

    return response.data;
  };

// ======================================================
// DELETE ASSIGNMENT
// ======================================================

export const deleteAssessmentAssignment =
  async (assignmentId) => {
    const response = await api.delete(
      `/admin/assessment-assignments/${assignmentId}`
    );

    return response.data;
  };