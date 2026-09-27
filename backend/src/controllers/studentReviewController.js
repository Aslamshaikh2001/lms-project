import {
  getAttemptReview,
} from "../services/studentReviewService.js";

// ======================================================
// GET ATTEMPT REVIEW
// ======================================================

export const getStudentAttemptReview =
  async (req, res) => {
    try {
      const {
        attemptId,
      } = req.params;

      const studentId =
        req.user?._id ||
        req.user?.id ||
        req.user?.userId;

      // ==================================================
      // AUTHENTICATION CHECK
      // ==================================================

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      // ==================================================
      // GET REVIEW
      // ==================================================

      const review =
        await getAttemptReview(
          attemptId,
          studentId
        );

      return res.status(200).json({
        success: true,

        message:
          "Assessment review loaded successfully.",

        data: review,
      });
    } catch (error) {
      console.error(
        "Get Student Attempt Review Error:",
        error
      );

      // ==================================================
      // INVALID ID
      // ==================================================

      if (
        error.code ===
          "INVALID_ATTEMPT_ID" ||
        error.code ===
          "INVALID_STUDENT_ID"
      ) {
        return res.status(400).json({
          success: false,
          message:
            error.message,
        });
      }

      // ==================================================
      // NOT FOUND
      // ==================================================

      if (
        error.code ===
        "ATTEMPT_NOT_FOUND"
      ) {
        return res.status(404).json({
          success: false,
          message:
            error.message,
        });
      }

      // ==================================================
      // NOT SUBMITTED
      // ==================================================

      if (
        error.code ===
        "ATTEMPT_NOT_SUBMITTED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            error.message,
        });
      }

      // ==================================================
      // SERVER ERROR
      // ==================================================

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to load assessment review.",
      });
    }
  };