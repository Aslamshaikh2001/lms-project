import {
  getAttemptQuestions,
  saveAnswer,
} from "../services/studentQuestionService.js";

// ======================================================
// GET STUDENT QUESTIONS
// ======================================================

export const getStudentAttemptQuestions =
  async (req, res) => {
    try {
      const studentId =
        req.user?._id ||
        req.user?.id ||
        req.user?.userId;

      const { attemptId } = req.params;

      const data =
        await getAttemptQuestions(
          attemptId,
          studentId
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "Get Student Attempt Questions Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to load questions.",
      });
    }
  };

// ======================================================
// SAVE STUDENT ANSWER
// ======================================================

export const saveStudentAnswer =
  async (req, res) => {
    try {
      const studentId =
        req.user?._id ||
        req.user?.id ||
        req.user?.userId;

      const { attemptId } =
        req.params;

      const {
        questionId,
        selectedAnswer,
      } = req.body;

      if (!questionId) {
        return res.status(400).json({
          success: false,
          message:
            "Question ID is required.",
        });
      }

      const data =
        await saveAnswer(
          attemptId,
          studentId,
          questionId,
          selectedAnswer
        );

      return res.status(200).json({
        success: true,
        message: "Answer saved successfully.",
        data,
      });
    } catch (error) {
      console.error(
        "Save Student Answer Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to save answer.",
      });
    }
  };