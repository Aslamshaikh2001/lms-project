// import axios from "axios";


// // ======================================================
// // API URL
// // ======================================================

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5016/api";


// // ======================================================
// // AXIOS INSTANCE
// // ======================================================

// const adminAssessmentResultApi =
//   axios.create({
//     baseURL: API_URL,
//     headers: {
//       "Content-Type":
//         "application/json",
//     },
//   });


// // ======================================================
// // TOKEN
// // ======================================================

// const getAccessToken = () => {
//   return (
//     localStorage.getItem(
//       "accessToken"
//     ) ||
//     localStorage.getItem(
//       "authToken"
//     ) ||
//     localStorage.getItem(
//       "access_token"
//     ) ||
//     localStorage.getItem(
//       "token"
//     )
//   );
// };


// // ======================================================
// // REQUEST INTERCEPTOR
// // ======================================================

// adminAssessmentResultApi.interceptors.request.use(
//   (config) => {
//     const token =
//       getAccessToken();

//     if (token) {
//       config.headers.Authorization =
//         `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) =>
//     Promise.reject(error)
// );


// // ======================================================
// // RESPONSE INTERCEPTOR
// // ======================================================

// adminAssessmentResultApi.interceptors.response.use(
//   (response) =>
//     response,

//   (error) => {
//     console.error(
//       "ADMIN RESULT API ERROR:",
//       error
//     );

//     if (error.response) {
//       console.error(
//         "STATUS:",
//         error.response.status
//       );

//       console.error(
//         "MESSAGE:",
//         error.response.data?.message
//       );
//     }

//     return Promise.reject(
//       error
//     );
//   }
// );


// // ======================================================
// // GET ALL STUDENT RESULTS
// // ======================================================

// export const getStudentResults =
//   async ({
//     page = 1,
//     limit = 10,
//     search = "",
//     assessmentId = "",
//     status = "",
//     resultStatus = "",
//   } = {}) => {
//     const response =
//       await adminAssessmentResultApi.get(
//         "/admin/student-results",
//         {
//           params: {
//             page,
//             limit,
//             search,
//             assessmentId,
//             status,
//             resultStatus,
//           },
//         }
//       );

//     return response.data;
//   };


// // ======================================================
// // GET INDIVIDUAL RESULT
// // ======================================================

// export const getStudentResultDetails =
//   async (
//     attemptId
//   ) => {
//     if (!attemptId) {
//       throw new Error(
//         "Attempt ID is required."
//       );
//     }

//     const response =
//       await adminAssessmentResultApi.get(
//         `/admin/assessments/attempts/${attemptId}/result`
//       );

//     return response.data;
//   };


// export default {
//   getStudentResults,
//   getStudentResultDetails,
// };






import axios from "axios";


// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5016/api";


// ======================================================
// AXIOS INSTANCE
// ======================================================

const adminAssessmentResultApi =
  axios.create({
    baseURL: API_URL,

    headers: {
      "Content-Type":
        "application/json",
    },
  });


// ======================================================
// TOKEN
// ======================================================

const getAccessToken = () => {
  return (
    localStorage.getItem(
      "accessToken"
    ) ||

    localStorage.getItem(
      "authToken"
    ) ||

    localStorage.getItem(
      "access_token"
    ) ||

    localStorage.getItem(
      "token"
    )
  );
};


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

adminAssessmentResultApi.interceptors.request.use(
  (config) => {
    const token =
      getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

adminAssessmentResultApi.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    console.error(
      "ADMIN RESULT API ERROR:",
      error
    );

    if (error.response) {
      console.error(
        "STATUS:",
        error.response.status
      );

      console.error(
        "MESSAGE:",
        error.response.data?.message
      );
    }

    return Promise.reject(
      error
    );
  }
);


// ======================================================
// GET ALL STUDENT RESULTS
// ======================================================
// GET
// /api/admin/student-results
// ======================================================

export const getStudentResults =
  async ({
    page = 1,
    limit = 10,
    search = "",
    assessmentId = "",
    status = "",
    resultStatus = "",
  } = {}) => {

    const response =
      await adminAssessmentResultApi.get(
        "/admin/student-results",
        {
          params: {
            page,
            limit,
            search,
            assessmentId,
            status,
            resultStatus,
          },
        }
      );

    return response.data;
  };


// ======================================================
// GET INDIVIDUAL RESULT
// ======================================================
// GET
// /api/admin/assessments/attempts/:attemptId/result
// ======================================================

export const getStudentResultDetails =
  async (
    attemptId
  ) => {

    if (!attemptId) {
      throw new Error(
        "Attempt ID is required."
      );
    }

    const response =
      await adminAssessmentResultApi.get(
        `/admin/assessments/attempts/${attemptId}/result`
      );

    return response.data;
  };


// ======================================================
// DELETE STUDENT RESULT
// ======================================================
// DELETE
// /api/admin/assessments/attempts/:attemptId/result
//
// PURPOSE:
// Admin can permanently delete the student's
// assessment attempt/result.
//
// ADMIN ONLY:
// The backend must verify ADMIN / SUPER_ADMIN.
// ======================================================

export const deleteStudentResult =
  async (
    attemptId
  ) => {

    if (!attemptId) {
      throw new Error(
        "Attempt ID is required."
      );
    }

    const response =
      await adminAssessmentResultApi.delete(
        `/admin/assessments/attempts/${attemptId}/result`
      );

    return response.data;
  };


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  getStudentResults,
  getStudentResultDetails,
  deleteStudentResult,
};