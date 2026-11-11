// import api from "../api/axios";

// /**
//  * ======================================================
//  * GET ALL STUDENTS
//  * ======================================================
//  */
// export const getAdminStudents = async ({
//   page = 1,
//   limit = 10,
//   search = "",
//   status = "",
// } = {}) => {
//   const response = await api.get("/admin/students", {
//     params: {
//       page,
//       limit,
//       search,
//       status,
//     },
//   });

//   return response.data;
// };


// /**
//  * ======================================================
//  * GET SINGLE STUDENT
//  * ======================================================
//  */
// export const getAdminStudentById = async (
//   studentId
// ) => {
//   const response = await api.get(
//     `/admin/students/${studentId}`
//   );

//   return response.data;
// };



import api from "../api/axios";

/**
 * ======================================================
 * GET ALL STUDENTS
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
 * - Student counts and summary
 * ======================================================
 */
export const getAdminStudents = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  studentCategory = "",
  educationLevel = "",
  courseName = "",
  branch = "",
  collegeName = "",
} = {}) => {
  const response = await api.get("/admin/students", {
    params: {
      page,
      limit,
      search,
      status,
      studentCategory,
      educationLevel,
      courseName,
      branch,
      collegeName,
    },
  });

  return response.data;
};

/**
 * ======================================================
 * GET SINGLE STUDENT
 * GET /admin/students/:studentId
 * ======================================================
 */
export const getAdminStudentById = async (studentId) => {
  const response = await api.get(
    `/admin/students/${studentId}`
  );

  return response.data;
};

/**
 * ======================================================
 * DELETE SINGLE STUDENT
 * DELETE /admin/students/:studentId
 * ======================================================
 */
export const deleteAdminStudent = async (studentId) => {
  const response = await api.delete(
    `/admin/students/${studentId}`
  );

  return response.data;
};

/**
 * ======================================================
 * DELETE ALL STUDENTS
 * DELETE /admin/students/all
 * ======================================================
 */
export const deleteAllAdminStudents = async () => {
  const response = await api.delete(
    "/admin/students/all"
  );

  return response.data;
};
