// import axios from "axios";

// // ======================================================
// // API URL
// // ======================================================

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5016/api";

// // ======================================================
// // GET TOKEN
// // ======================================================

// const getAccessToken = () => {
//   // Your screenshot showed the JWT stored as "token"
//   const token = localStorage.getItem("token");

//   console.log("=================================");
//   console.log("GET ACCESS TOKEN");
//   console.log("Token exists:", !!token);
//   console.log(
//     "Token preview:",
//     token ? token.substring(0, 30) + "..." : "NO TOKEN"
//   );
//   console.log("=================================");

//   return token;
// };

// // ======================================================
// // AXIOS INSTANCE
// // ======================================================

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ======================================================
// // REQUEST INTERCEPTOR
// // ======================================================

// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();

//     console.log("=================================");
//     console.log("ASSESSMENT REQUEST");
//     console.log("URL:", `${API_URL}${config.url}`);
//     console.log("METHOD:", config.method);
//     console.log("TOKEN EXISTS:", !!token);

//     if (!token) {
//       console.error(
//         "❌ NO TOKEN FOUND IN LOCAL STORAGE"
//       );

//       return Promise.reject(
//         new Error(
//           "Authentication token not found. Please login again."
//         )
//       );
//     }

//     // Make sure headers object exists
//     config.headers = config.headers || {};

//     config.headers.Authorization = `Bearer ${token}`;

//     console.log(
//       "Authorization:",
//       "Bearer " + token.substring(0, 30) + "..."
//     );

//     console.log("=================================");

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ======================================================
// // RESPONSE INTERCEPTOR
// // ======================================================

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },

//   (error) => {
//     console.error("=================================");
//     console.error("ASSESSMENT API ERROR");
//     console.error("STATUS:", error.response?.status);
//     console.error(
//       "MESSAGE:",
//       error.response?.data?.message
//     );
//     console.error(
//       "RESPONSE:",
//       error.response?.data
//     );
//     console.error("=================================");

//     if (error.response?.status === 401) {
//       console.error(
//         "❌ 401 UNAUTHORIZED"
//       );

//       console.error(
//         "Backend did not accept authentication."
//       );
//     }

//     return Promise.reject(error);
//   }
// );

// // ======================================================
// // CREATE ASSESSMENT
// // POST /api/assessments
// // ======================================================

// export const createAssessment = async (
//   assessmentData
// ) => {
//   try {
//     const response = await api.post(
//       "/assessments",
//       assessmentData
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Create Assessment Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// // ======================================================
// // GET ALL ASSESSMENTS
// // GET /api/assessments
// // ======================================================

// export const getAssessments = async (
//   params = {}
// ) => {
//   try {
//     const response = await api.get(
//       "/assessments",
//       {
//         params,
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Get Assessments API Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// // ======================================================
// // GET ASSESSMENT BY ID
// // ======================================================

// export const getAssessmentById = async (id) => {
//   try {
//     const response = await api.get(
//       `/assessments/${id}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Get Assessment API Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// // ======================================================
// // UPDATE ASSESSMENT
// // ======================================================

// export const updateAssessment = async (
//   id,
//   assessmentData
// ) => {
//   try {
//     const response = await api.put(
//       `/assessments/${id}`,
//       assessmentData
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Update Assessment API Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// // ======================================================
// // DELETE ASSESSMENT
// // ======================================================

// export const deleteAssessment = async (id) => {
//   try {
//     const response = await api.delete(
//       `/assessments/${id}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Delete Assessment API Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// // ======================================================
// // PUBLISH
// // ======================================================

// export const publishAssessment = async (id) => {
//   try {
//     const response = await api.patch(
//       `/assessments/${id}/publish`,
//       {}
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Publish Assessment API Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// // ======================================================
// // UNPUBLISH
// // ======================================================

// export const unpublishAssessment = async (id) => {
//   try {
//     const response = await api.patch(
//       `/assessments/${id}/unpublish`,
//       {}
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Unpublish Assessment API Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// export default api;






import api from "../api/axios.js";

// ======================================================
// CREATE ASSESSMENT
// POST /api/assessments
// ======================================================

export const createAssessment = async (assessmentData) => {
  try {
    // Make a copy so we don't modify the original object
    const data = {
      ...assessmentData,
    };

    // Course and category are completely removed
    delete data.course;
    delete data.category;

    const response = await api.post(
      "/assessments",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create Assessment API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ======================================================
// GET ALL ASSESSMENTS
// GET /api/assessments
// ======================================================

export const getAssessments = async (params = {}) => {
  try {
    // Only send supported query parameters
    const cleanParams = {};

    if (
      params.search !== undefined &&
      params.search !== null &&
      params.search !== ""
    ) {
      cleanParams.search = params.search;
    }

    if (
      params.status !== undefined &&
      params.status !== null &&
      params.status !== ""
    ) {
      cleanParams.status = params.status;
    }

    if (
      params.page !== undefined &&
      params.page !== null
    ) {
      cleanParams.page = Number(params.page) || 1;
    }

    if (
      params.limit !== undefined &&
      params.limit !== null
    ) {
      cleanParams.limit = Number(params.limit) || 10;
    }

    // IMPORTANT:
    // Do NOT send course/category
    delete cleanParams.course;
    delete cleanParams.category;

    const response = await api.get(
      "/assessments",
      {
        params: cleanParams,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Assessments API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ======================================================
// GET ASSESSMENT BY ID
// GET /api/assessments/:id
// ======================================================

export const getAssessmentById = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Assessment ID is required"
      );
    }

    const response = await api.get(
      `/assessments/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Assessment By ID API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ======================================================
// UPDATE ASSESSMENT
// PUT /api/assessments/:id
// ======================================================

export const updateAssessment = async (
  id,
  assessmentData
) => {
  try {
    if (!id) {
      throw new Error(
        "Assessment ID is required"
      );
    }

    const data = {
      ...assessmentData,
    };

    // Course and category removed
    delete data.course;
    delete data.category;

    // Don't allow frontend to modify protected fields
    delete data._id;
    delete data.createdBy;
    delete data.updatedBy;
    delete data.status;

    const response = await api.put(
      `/assessments/${id}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Assessment API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ======================================================
// DELETE ASSESSMENT
// DELETE /api/assessments/:id
// ======================================================

export const deleteAssessment = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Assessment ID is required"
      );
    }

    const response = await api.delete(
      `/assessments/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete Assessment API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ======================================================
// PUBLISH ASSESSMENT
// PATCH /api/assessments/:id/publish
// ======================================================

export const publishAssessment = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Assessment ID is required"
      );
    }

    const response = await api.patch(
      `/assessments/${id}/publish`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Publish Assessment API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ======================================================
// UNPUBLISH ASSESSMENT
// PATCH /api/assessments/:id/unpublish
// ======================================================

export const unpublishAssessment = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Assessment ID is required"
      );
    }

    const response = await api.patch(
      `/assessments/${id}/unpublish`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Unpublish Assessment API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};