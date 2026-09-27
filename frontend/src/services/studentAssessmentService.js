import api from "../api/axios.js";

// ======================================================
// GET STUDENT ASSESSMENTS
// ======================================================

export const getStudentAssessments = async (
  params = {}
) => {
  try {
    const response =
      await api.get(
        "/student/assessments",
        {
          params,
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "Get Student Assessments Error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

// ======================================================
// GET STUDENT ASSESSMENT DETAILS
// ======================================================

export const getStudentAssessmentDetails =
  async (id) => {
    try {
      const response =
        await api.get(
          `/student/assessments/${id}`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Get Student Assessment Details Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ======================================================
// START ASSESSMENT
// ======================================================

export const startAssessment =
  async (assessmentId) => {
    try {
      const response =
        await api.post(
          `/student/assessments/${assessmentId}/start`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Start Assessment Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ======================================================
// GET MY ATTEMPTS
// ======================================================

export const getMyAttempts =
  async (assessmentId) => {
    try {
      const response =
        await api.get(
          `/student/assessments/${assessmentId}/attempts`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Get My Attempts Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ======================================================
// GET SINGLE ATTEMPT
// ======================================================

export const getMyAttempt =
  async (attemptId) => {
    try {
      const response =
        await api.get(
          `/student/attempts/${attemptId}`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Get My Attempt Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ======================================================
// GET ATTEMPT QUESTIONS
// ======================================================

export const getAttemptQuestions =
  async (attemptId) => {
    try {
      const response =
        await api.get(
          `/student/attempts/${attemptId}/questions`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Get Attempt Questions Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ======================================================
// SAVE ANSWER
// ======================================================

export const saveAttemptAnswer =
  async (
    attemptId,
    questionId,
    selectedAnswer
  ) => {
    try {
      const response =
        await api.patch(
          `/student/attempts/${attemptId}/answers`,
          {
            questionId,
            selectedAnswer,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "Save Attempt Answer Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ======================================================
// SUBMIT ASSESSMENT ATTEMPT
// ======================================================
//
// This API submits the student's current attempt.
//
// Backend endpoint:
// POST /student/attempts/:attemptId/submit
//
// Backend will:
// - evaluate answers
// - calculate score
// - calculate percentage
// - apply negative marking
// - calculate correct answers
// - calculate wrong answers
// - calculate unanswered questions
// - handle manual review
// - finalize the attempt
// ======================================================

export const submitAssessmentAttempt =
  async (attemptId) => {
    try {
      const response =
        await api.post(
          `/student/attempts/${attemptId}/submit`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Submit Assessment Attempt API Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ======================================================
// GET ATTEMPT RESULT
// ======================================================
//
// This API gets the result after submission.
//
// Backend endpoint:
// GET /student/attempts/:attemptId/result
//
// Result can contain:
// - score
// - total marks
// - percentage
// - passed
// - correct answers
// - wrong answers
// - unanswered questions
// - manual review status
// ======================================================

export const getAttemptResult =
  async (attemptId) => {
    try {
      const response =
        await api.get(
          `/student/attempts/${attemptId}/result`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Get Attempt Result API Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };





  // ======================================================
// GET ATTEMPT REVIEW
// ======================================================

export const getAttemptReview =
  async (attemptId) => {
    try {
      const response =
        await api.get(
          `/student/attempts/${attemptId}/review`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Get Attempt Review API Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };



  export const recordAttemptSecurityEvent =
  async (
    attemptId,
    type
  ) => {

    const response =
      await api.post(
        `/student/attempts/${attemptId}/security-events`,
        {
          type,
        }
      );

    return response.data;
  };


export const getAttemptSecurityStatus =
  async (
    attemptId
  ) => {

    const response =
      await api.get(
        `/student/attempts/${attemptId}/security-status`
      );

    return response.data;
  };