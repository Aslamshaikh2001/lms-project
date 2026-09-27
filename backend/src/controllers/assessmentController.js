// import * as assessmentService from "../services/assessmentService.js";


// // ========================================
// // Helper: Get Logged-in User ID
// // ========================================

// const getUserId = (req) => {
//   return req.user?._id || req.user?.id;
// };


// // ========================================
// // CREATE ASSESSMENT
// // POST /api/assessments
// // ========================================

// export const createAssessment = async (req, res) => {
//   try {
//     const userId = getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "User authentication required",
//       });
//     }

//     const assessment =
//       await assessmentService.createAssessment(
//         req.body,
//         userId
//       );

//     return res.status(201).json({
//       success: true,
//       message: "Assessment created successfully",
//       data: assessment,
//     });

//   } catch (error) {
//     console.error(
//       "Create Assessment Error:",
//       error
//     );

//     return res.status(400).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to create assessment",
//     });
//   }
// };


// // ========================================
// // GET ALL ASSESSMENTS
// // GET /api/assessments
// // ========================================

// export const getAssessments = async (req, res) => {
//   try {
//     const result =
//       await assessmentService.getAssessments(
//         req.query
//       );

//     return res.status(200).json({
//       success: true,
//       message:
//         "Assessments fetched successfully",
//       data: result.assessments,
//       pagination: result.pagination,
//     });

//   } catch (error) {
//     console.error(
//       "Get Assessments Error:",
//       error
//     );

//     return res.status(400).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to fetch assessments",
//     });
//   }
// };


// // ========================================
// // GET SINGLE ASSESSMENT
// // GET /api/assessments/:id
// // ========================================

// export const getAssessmentById = async (
//   req,
//   res
// ) => {
//   try {
//     const assessment =
//       await assessmentService.getAssessmentById(
//         req.params.id
//       );

//     return res.status(200).json({
//       success: true,
//       message:
//         "Assessment fetched successfully",
//       data: assessment,
//     });

//   } catch (error) {
//     console.error(
//       "Get Assessment Error:",
//       error
//     );

//     const statusCode =
//       error.message === "Assessment not found"
//         ? 404
//         : 400;

//     return res.status(statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ========================================
// // UPDATE ASSESSMENT
// // PUT /api/assessments/:id
// // ========================================

// export const updateAssessment = async (
//   req,
//   res
// ) => {
//   try {
//     const userId = getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User authentication required",
//       });
//     }

//     const assessment =
//       await assessmentService.updateAssessment(
//         req.params.id,
//         req.body,
//         userId
//       );

//     return res.status(200).json({
//       success: true,
//       message:
//         "Assessment updated successfully",
//       data: assessment,
//     });

//   } catch (error) {
//     console.error(
//       "Update Assessment Error:",
//       error
//     );

//     const statusCode =
//       error.message === "Assessment not found"
//         ? 404
//         : 400;

//     return res.status(statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ========================================
// // DELETE ASSESSMENT
// // DELETE /api/assessments/:id
// // ========================================

// export const deleteAssessment = async (
//   req,
//   res
// ) => {
//   try {
//     const result =
//       await assessmentService.deleteAssessment(
//         req.params.id
//       );

//     return res.status(200).json({
//       success: true,
//       ...result,
//     });

//   } catch (error) {
//     console.error(
//       "Delete Assessment Error:",
//       error
//     );

//     const statusCode =
//       error.message === "Assessment not found"
//         ? 404
//         : 400;

//     return res.status(statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ========================================
// // PUBLISH ASSESSMENT
// // PATCH /api/assessments/:id/publish
// // ========================================

// export const publishAssessment = async (
//   req,
//   res
// ) => {
//   try {
//     const userId = getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User authentication required",
//       });
//     }

//     const assessment =
//       await assessmentService.publishAssessment(
//         req.params.id,
//         userId
//       );

//     return res.status(200).json({
//       success: true,
//       message:
//         "Assessment published successfully",
//       data: assessment,
//     });

//   } catch (error) {
//     console.error(
//       "Publish Assessment Error:",
//       error
//     );

//     const statusCode =
//       error.message === "Assessment not found"
//         ? 404
//         : 400;

//     return res.status(statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ========================================
// // UNPUBLISH ASSESSMENT
// // PATCH /api/assessments/:id/unpublish
// // ========================================

// export const unpublishAssessment = async (
//   req,
//   res
// ) => {
//   try {
//     const userId = getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User authentication required",
//       });
//     }

//     const assessment =
//       await assessmentService.unpublishAssessment(
//         req.params.id,
//         userId
//       );

//     return res.status(200).json({
//       success: true,
//       message:
//         "Assessment unpublished successfully",
//       data: assessment,
//     });

//   } catch (error) {
//     console.error(
//       "Unpublish Assessment Error:",
//       error
//     );

//     const statusCode =
//       error.message === "Assessment not found"
//         ? 404
//         : 400;

//     return res.status(statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };





import * as assessmentService
  from "../services/assessmentService.js";

// ========================================
// GET LOGGED-IN USER ID
// ========================================

const getUserId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    req.user?.userId
  );
};

// ========================================
// CREATE
// ========================================

export const createAssessment = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication required",
      });
    }

    const assessment =
      await assessmentService.createAssessment(
        req.body,
        userId
      );

    return res.status(201).json({
      success: true,
      message:
        "Assessment created successfully",
      data: assessment,
    });
  } catch (error) {
    console.error(
      "Create Assessment Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create assessment",
    });
  }
};

// ========================================
// GET ALL
// ========================================

export const getAssessments = async (
  req,
  res
) => {
  try {
    console.log(
      "GET /api/assessments QUERY:",
      req.query
    );

    const result =
      await assessmentService.getAssessments(
        req.query
      );

    return res.status(200).json({
      success: true,
      message:
        "Assessments fetched successfully",
      data: result.assessments,
      pagination:
        result.pagination,
    });
  } catch (error) {
    console.error(
      "Get Assessments Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch assessments",
    });
  }
};

// ========================================
// GET ONE
// ========================================

export const getAssessmentById =
  async (req, res) => {
    try {
      const assessment =
        await assessmentService.getAssessmentById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Assessment fetched successfully",
        data: assessment,
      });
    } catch (error) {
      console.error(
        "Get Assessment Error:",
        error
      );

      const statusCode =
        error.message ===
        "Assessment not found"
          ? 404
          : error.message?.includes(
              "Invalid assessment ID"
            )
          ? 400
          : 500;

      return res.status(statusCode).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch assessment",
      });
    }
  };

// ========================================
// UPDATE
// ========================================

export const updateAssessment =
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User authentication required",
        });
      }

      const assessment =
        await assessmentService.updateAssessment(
          req.params.id,
          req.body,
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Assessment updated successfully",
        data: assessment,
      });
    } catch (error) {
      console.error(
        "Update Assessment Error:",
        error
      );

      const statusCode =
        error.message ===
        "Assessment not found"
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message:
          error.message ||
          "Failed to update assessment",
      });
    }
  };

// ========================================
// DELETE
// ========================================

export const deleteAssessment =
  async (req, res) => {
    try {
      const result =
        await assessmentService.deleteAssessment(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error(
        "Delete Assessment Error:",
        error
      );

      const statusCode =
        error.message ===
        "Assessment not found"
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message:
          error.message ||
          "Failed to delete assessment",
      });
    }
  };

// ========================================
// PUBLISH
// ========================================

export const publishAssessment =
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User authentication required",
        });
      }

      const assessment =
        await assessmentService.publishAssessment(
          req.params.id,
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Assessment published successfully",
        data: assessment,
      });
    } catch (error) {
      console.error(
        "Publish Assessment Error:",
        error
      );

      const statusCode =
        error.message ===
        "Assessment not found"
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message:
          error.message ||
          "Failed to publish assessment",
      });
    }
  };

// ========================================
// UNPUBLISH
// ========================================

export const unpublishAssessment =
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User authentication required",
        });
      }

      const assessment =
        await assessmentService.unpublishAssessment(
          req.params.id,
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Assessment unpublished successfully",
        data: assessment,
      });
    } catch (error) {
      console.error(
        "Unpublish Assessment Error:",
        error
      );

      const statusCode =
        error.message ===
        "Assessment not found"
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message:
          error.message ||
          "Failed to unpublish assessment",
      });
    }
  };