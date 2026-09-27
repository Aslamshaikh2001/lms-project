import api from "../api/axios";

/**
 * ============================================================
 * Get Student Dashboard
 * ============================================================
 */
export const getStudentDashboard = async () => {
  const response = await api.get(
    "/student/dashboard"
  );

  return response.data;
};