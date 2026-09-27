import * as studentSecurityService
  from "../services/studentSecurityService.js";


const getStudentId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    req.user?.userId
  );
};


/* ============================================================
   RECORD SECURITY EVENT
   ============================================================ */

export const recordSecurityViolation =
  async (req, res) => {

    try {

      const studentId =
        getStudentId(req);

      if (!studentId) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Authentication required.",
          });
      }


      const {
        type,
      } = req.body;


      const data =
        await studentSecurityService
          .recordSecurityViolation({
            attemptId:
              req.params.attemptId,

            studentId,

            type,

            userAgent:
              req.headers[
                "user-agent"
              ] || "",
          });


      return res
        .status(200)
        .json({
          success: true,

          message:
            data.message ||
            "Security event recorded.",

          data,
        });

    } catch (error) {

      console.error(
        "SECURITY VIOLATION ERROR:",
        error
      );


      const badRequestMessages = [
        "Invalid attempt ID.",
        "Invalid student ID.",
        "Invalid security event.",
      ];


      if (
        badRequestMessages.includes(
          error.message
        )
      ) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              error.message,
          });
      }


      if (
        error.message ===
        "Assessment attempt not found."
      ) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              error.message,
          });
      }


      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Failed to record security event.",
        });
    }
  };


/* ============================================================
   SECURITY STATUS
   ============================================================ */

export const getSecurityStatus =
  async (req, res) => {

    try {

      const studentId =
        getStudentId(req);


      if (!studentId) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Authentication required.",
          });
      }


      const data =
        await studentSecurityService
          .getSecurityStatus(
            req.params.attemptId,
            studentId
          );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Security status fetched successfully.",

          data,
        });

    } catch (error) {

      console.error(
        "GET SECURITY STATUS ERROR:",
        error
      );


      return res
        .status(400)
        .json({
          success: false,

          message:
            error.message ||
            "Failed to get security status.",
        });
    }
  };