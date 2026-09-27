import api from "../api/axios";

/**
 * ======================================================
 * GET ALL STUDENTS
 * ======================================================
 */
export const getAdminStudents = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  const response = await api.get("/admin/students", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
};


/**
 * ======================================================
 * GET SINGLE STUDENT
 * ======================================================
 */
export const getAdminStudentById = async (
  studentId
) => {
  const response = await api.get(
    `/admin/students/${studentId}`
  );

  return response.data;
};