import * as questionService
  from "../services/questionService.js";


// ======================================================
// USER ID
// ======================================================

const getUserId = (req) => {

  return (
    req.user?._id ||
    req.user?.id ||
    req.user?.userId
  );

};


// ======================================================
// CREATE
// ======================================================

export const createQuestion =
  async (
    req,
    res
  ) => {

    try {

      const userId =
        getUserId(req);


      if (!userId) {

        return res.status(401).json({
          success: false,
          message:
            "User authentication required",
        });

      }


      const question =
        await questionService.createQuestion(
          req.body,
          userId
        );


      return res.status(201).json({

        success: true,

        message:
          "Question created successfully",

        data: question,

      });

    } catch (error) {

      console.error(
        "Create Question Error:",
        error
      );


      return res.status(400).json({

        success: false,

        message:
          error.message ||
          "Failed to create question",

      });

    }
  };


// ======================================================
// GET ALL
// ======================================================

export const getQuestions =
  async (
    req,
    res
  ) => {

    try {

      console.log(
        "GET /api/questions QUERY:",
        req.query
      );


      const result =
        await questionService.getQuestions(
          req.query
        );


      return res.status(200).json({

        success: true,

        message:
          "Questions fetched successfully",

        data:
          result.questions,

        pagination:
          result.pagination,

      });

    } catch (error) {

      console.error(
        "Get Questions Error:",
        error
      );


      return res.status(400).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch questions",

      });

    }
  };


// ======================================================
// GET ONE
// ======================================================

export const getQuestionById =
  async (
    req,
    res
  ) => {

    try {

      const question =
        await questionService.getQuestionById(
          req.params.id
        );


      return res.status(200).json({

        success: true,

        message:
          "Question fetched successfully",

        data: question,

      });

    } catch (error) {

      console.error(
        "Get Question Error:",
        error
      );


      const statusCode =
        error.message ===
        "Question not found"
          ? 404
          : 400;


      return res.status(
        statusCode
      ).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch question",

      });

    }
  };


// ======================================================
// UPDATE
// ======================================================

export const updateQuestion =
  async (
    req,
    res
  ) => {

    try {

      const userId =
        getUserId(req);


      if (!userId) {

        return res.status(401).json({

          success: false,

          message:
            "User authentication required",

        });

      }


      const question =
        await questionService.updateQuestion(
          req.params.id,
          req.body,
          userId
        );


      return res.status(200).json({

        success: true,

        message:
          "Question updated successfully",

        data: question,

      });

    } catch (error) {

      console.error(
        "Update Question Error:",
        error
      );


      const statusCode =
        error.message ===
        "Question not found"
          ? 404
          : 400;


      return res.status(
        statusCode
      ).json({

        success: false,

        message:
          error.message ||
          "Failed to update question",

      });

    }
  };


// ======================================================
// DELETE
// ======================================================

export const deleteQuestion =
  async (
    req,
    res
  ) => {

    try {

      const result =
        await questionService.deleteQuestion(
          req.params.id
        );


      return res.status(200).json({

        success: true,

        ...result,

      });

    } catch (error) {

      console.error(
        "Delete Question Error:",
        error
      );


      const statusCode =
        error.message ===
        "Question not found"
          ? 404
          : 400;


      return res.status(
        statusCode
      ).json({

        success: false,

        message:
          error.message ||
          "Failed to delete question",

      });

    }
  };


// ======================================================
// PUBLISH
// ======================================================

export const publishQuestion =
  async (
    req,
    res
  ) => {

    try {

      const userId =
        getUserId(req);


      if (!userId) {

        return res.status(401).json({

          success: false,

          message:
            "User authentication required",

        });

      }


      const question =
        await questionService.publishQuestion(
          req.params.id,
          userId
        );


      return res.status(200).json({

        success: true,

        message:
          "Question published successfully",

        data: question,

      });

    } catch (error) {

      console.error(
        "Publish Question Error:",
        error
      );


      return res.status(400).json({

        success: false,

        message:
          error.message ||
          "Failed to publish question",

      });

    }
  };


// ======================================================
// UNPUBLISH
// ======================================================

export const unpublishQuestion =
  async (
    req,
    res
  ) => {

    try {

      const userId =
        getUserId(req);


      if (!userId) {

        return res.status(401).json({

          success: false,

          message:
            "User authentication required",

        });

      }


      const question =
        await questionService.unpublishQuestion(
          req.params.id,
          userId
        );


      return res.status(200).json({

        success: true,

        message:
          "Question unpublished successfully",

        data: question,

      });

    } catch (error) {

      console.error(
        "Unpublish Question Error:",
        error
      );


      return res.status(400).json({

        success: false,

        message:
          error.message ||
          "Failed to unpublish question",

      });

    }
  };


// ======================================================
// GET BY ASSESSMENT
// ======================================================

export const getQuestionsByAssessment =
  async (
    req,
    res
  ) => {

    try {

      const questions =
        await questionService.getQuestionsByAssessment(
          req.params.assessmentId
        );


      return res.status(200).json({

        success: true,

        message:
          "Assessment questions fetched successfully",

        data: questions,

      });

    } catch (error) {

      console.error(
        "Get Assessment Questions Error:",
        error
      );


      return res.status(400).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch assessment questions",

      });

    }
  };