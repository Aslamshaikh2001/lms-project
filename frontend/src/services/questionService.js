import api from "../api/axios.js";


// ======================================================
// CREATE
// ======================================================

export const createQuestion =
  async (
    questionData
  ) => {

    try {

      const response =
        await api.post(
          "/questions",
          questionData
        );

      return response.data;

    } catch (error) {

      console.error(
        "Create Question API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


// ======================================================
// GET ALL
// ======================================================

export const getQuestions =
  async (
    params = {}
  ) => {

    try {

      const response =
        await api.get(
          "/questions",
          {
            params,
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Get Questions API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


// ======================================================
// GET ONE
// ======================================================

export const getQuestionById =
  async (
    id
  ) => {

    try {

      const response =
        await api.get(
          `/questions/${id}`
        );

      return response.data;

    } catch (error) {

      console.error(
        "Get Question API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


// ======================================================
// UPDATE
// ======================================================

export const updateQuestion =
  async (
    id,
    questionData
  ) => {

    try {

      const response =
        await api.put(
          `/questions/${id}`,
          questionData
        );

      return response.data;

    } catch (error) {

      console.error(
        "Update Question API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


// ======================================================
// DELETE
// ======================================================

export const deleteQuestion =
  async (
    id
  ) => {

    try {

      const response =
        await api.delete(
          `/questions/${id}`
        );

      return response.data;

    } catch (error) {

      console.error(
        "Delete Question API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


// ======================================================
// PUBLISH
// ======================================================

export const publishQuestion =
  async (
    id
  ) => {

    try {

      const response =
        await api.patch(
          `/questions/${id}/publish`,
          {}
        );

      return response.data;

    } catch (error) {

      console.error(
        "Publish Question API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


// ======================================================
// UNPUBLISH
// ======================================================

export const unpublishQuestion =
  async (
    id
  ) => {

    try {

      const response =
        await api.patch(
          `/questions/${id}/unpublish`,
          {}
        );

      return response.data;

    } catch (error) {

      console.error(
        "Unpublish Question API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


// ======================================================
// GET QUESTIONS BY ASSESSMENT
// ======================================================

export const getQuestionsByAssessment =
  async (
    assessmentId
  ) => {

    try {

      const response =
        await api.get(
          `/questions/assessment/${assessmentId}`
        );

      return response.data;

    } catch (error) {

      console.error(
        "Get Assessment Questions API Error:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


  
/**
 * ======================================================
 * BULK IMPORT QUESTIONS
 * POST /api/questions/bulk-import
 * ======================================================
 *
 * assessmentId: Selected assessment ID
 * questions: Array of question objects
 */

export const bulkImportQuestions = async (
  assessmentId,
  questions
) => {
  try {
    const response = await api.post(
      "/questions/bulk-import",
      {
        assessmentId,
        questions,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Bulk Import Questions API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};
