// import mongoose from "mongoose";

// import Assessment from "../models/Assessment.js";
// import AssessmentAttempt from "../models/AssessmentAttempt.js";

// // ======================================================
// // VALIDATE OBJECT ID
// // ======================================================

// const isValidObjectId = (id) => {
//   return mongoose.Types.ObjectId.isValid(id);
// };

// // ======================================================
// // CONVERT ID TO STRING
// // ======================================================

// const idToString = (id) => {
//   if (!id) {
//     return "";
//   }

//   return String(id);
// };

// // ======================================================
// // NORMALIZE ANSWER
// // ======================================================

// const normalizeAnswer = (answer) => {
//   if (
//     answer === null ||
//     answer === undefined
//   ) {
//     return "";
//   }

//   if (Array.isArray(answer)) {
//     return answer.map(
//       (item) => idToString(item)
//     );
//   }

//   return String(answer).trim();
// };

// // ======================================================
// // CHECK OPTION SELECTED
// // ======================================================

// const isOptionSelected = (
//   selectedAnswer,
//   optionId
// ) => {
//   const normalized =
//     normalizeAnswer(
//       selectedAnswer
//     );

//   const normalizedOptionId =
//     idToString(optionId);

//   if (Array.isArray(normalized)) {
//     return normalized.includes(
//       normalizedOptionId
//     );
//   }

//   return (
//     normalized ===
//     normalizedOptionId
//   );
// };

// // ======================================================
// // BUILD ADMIN REVIEW OPTION
// // ======================================================

// const buildAdminReviewOption = ({
//   option,
//   selectedAnswer,
//   correctOptionIds,
// }) => {
//   const optionId =
//     idToString(option?._id);

//   const selected =
//     isOptionSelected(
//       selectedAnswer,
//       optionId
//     );

//   const correct =
//     correctOptionIds.includes(
//       optionId
//     );

//   return {
//     _id: option?._id,

//     text:
//       option?.text || "",

//     selected,

//     correct,
//   };
// };

// // ======================================================
// // BUILD ADMIN REVIEW QUESTION
// // ======================================================

// const buildAdminReviewQuestion = ({
//   snapshot,
//   answer,
// }) => {
//   const questionType =
//     snapshot.questionType;

//   const selectedAnswer =
//     answer?.selectedAnswer ??
//     null;

//   // ====================================================
//   // CORRECT OPTION IDS
//   // ====================================================

//   const correctOptionIds =
//     Array.isArray(
//       snapshot.gradingKey
//         ?.correctOptionIds
//     )
//       ? snapshot.gradingKey.correctOptionIds.map(
//           (id) =>
//             idToString(id)
//         )
//       : [];

//   // ====================================================
//   // ANSWERED
//   // ====================================================

//   const isAnswered =
//     answer !== undefined &&
//     answer !== null &&
//     answer.selectedAnswer !==
//       null &&
//     answer.selectedAnswer !==
//       undefined &&
//     !(
//       typeof answer.selectedAnswer ===
//         "string" &&
//       answer.selectedAnswer.trim() ===
//         ""
//     ) &&
//     !(
//       Array.isArray(
//         answer.selectedAnswer
//       ) &&
//       answer.selectedAnswer.length ===
//         0
//     );

//   // ====================================================
//   // OPTIONS
//   // ====================================================

//   const options =
//     Array.isArray(
//       snapshot.options
//     )
//       ? snapshot.options.map(
//           (option) =>
//             buildAdminReviewOption({
//               option,
//               selectedAnswer,
//               correctOptionIds,
//             })
//         )
//       : [];

//   // ====================================================
//   // CORRECT ANSWER
//   // ====================================================

//   let correctAnswer = null;

//   if (
//     questionType === "MCQ" ||
//     questionType ===
//       "MULTIPLE_SELECT" ||
//     questionType ===
//       "TRUE_FALSE"
//   ) {
//     correctAnswer =
//       correctOptionIds;
//   } else {
//     correctAnswer =
//       snapshot.gradingKey
//         ?.correctAnswer ??
//       null;
//   }

//   // ====================================================
//   // STUDENT ANSWER
//   // ====================================================

//   const studentAnswer =
//     selectedAnswer;

//   // ====================================================
//   // ANSWER STATUS
//   // ====================================================

//   let answerStatus =
//     "UNANSWERED";

//   if (isAnswered) {
//     if (
//       answer?.requiresManualReview
//     ) {
//       answerStatus =
//         "PENDING_REVIEW";
//     } else if (
//       answer?.isCorrect === true
//     ) {
//       answerStatus =
//         "CORRECT";
//     } else if (
//       answer?.isCorrect === false
//     ) {
//       answerStatus =
//         "WRONG";
//     } else {
//       answerStatus =
//         "PENDING_REVIEW";
//     }
//   }

//   // ====================================================
//   // MARKS
//   // ====================================================

//   const awardedMarks =
//     Number(
//       answer?.awardedMarks
//     ) || 0;

//   const deductedMarks =
//     Number(
//       answer?.deductedMarks
//     ) || 0;

//   // ====================================================
//   // RETURN QUESTION
//   // ====================================================

//   return {
//     question:
//       snapshot.question,

//     order:
//       snapshot.order,

//     questionText:
//       snapshot.questionText,

//     questionType,

//     options,

//     marks:
//       Number(
//         snapshot.marks
//       ) || 0,

//     negativeMarks:
//       Number(
//         snapshot.negativeMarks
//       ) || 0,

//     isRequired:
//       snapshot.isRequired !==
//       false,

//     studentAnswer,

//     correctAnswer,

//     isAnswered,

//     isCorrect:
//       answer?.isCorrect ??
//       null,

//     awardedMarks,

//     deductedMarks,

//     requiresManualReview:
//       answer?.requiresManualReview ||
//       false,

//     reviewed:
//       answer?.reviewed ||
//       false,

//     answerStatus,

//     answeredAt:
//       answer?.answeredAt ||
//       null,
//   };
// };

// // ======================================================
// // BUILD COMPLETE ADMIN REVIEW
// // ======================================================

// const buildAdminReview = (
//   attempt
// ) => {
//   const answers =
//     Array.isArray(
//       attempt.answers
//     )
//       ? attempt.answers
//       : [];

//   // ====================================================
//   // ANSWER MAP
//   // ====================================================

//   const answerMap =
//     new Map();

//   answers.forEach(
//     (answer) => {
//       answerMap.set(
//         idToString(
//           answer.question
//         ),
//         answer
//       );
//     }
//   );

//   // ====================================================
//   // QUESTION SNAPSHOT
//   // ====================================================

//   const snapshot =
//     Array.isArray(
//       attempt.questionSnapshot
//     )
//       ? attempt.questionSnapshot
//       : [];

//   // ====================================================
//   // BUILD QUESTIONS
//   // ====================================================

//   const questions =
//     snapshot.map(
//       (question) => {
//         const answer =
//           answerMap.get(
//             idToString(
//               question.question
//             )
//           );

//         return buildAdminReviewQuestion({
//           snapshot:
//             question,
//           answer,
//         });
//       }
//     );

//   // ====================================================
//   // COUNTERS
//   // ====================================================

//   const answeredQuestions =
//     questions.filter(
//       (question) =>
//         question.isAnswered
//     ).length;

//   const unansweredQuestions =
//     questions.length -
//     answeredQuestions;

//   const correctAnswers =
//     questions.filter(
//       (question) =>
//         question.isCorrect ===
//         true
//     ).length;

//   const wrongAnswers =
//     questions.filter(
//       (question) =>
//         question.isCorrect ===
//         false
//     ).length;

//   const manualReviewPending =
//     questions.filter(
//       (question) =>
//         question.requiresManualReview
//     ).length;

//   // ====================================================
//   // RETURN COMPLETE ADMIN REVIEW
//   // ====================================================

//   return {
//     attempt: {
//       _id:
//         attempt._id,

//       student:
//         attempt.student,

//       assessment:
//         attempt.assessment,

//       attemptNumber:
//         attempt.attemptNumber,

//       status:
//         attempt.status,

//       resultStatus:
//         attempt.resultStatus,

//       startedAt:
//         attempt.startedAt,

//       expiresAt:
//         attempt.expiresAt,

//       submittedAt:
//         attempt.submittedAt,

//       totalQuestions:
//         attempt.totalQuestions,

//       answeredQuestions,

//       correctAnswers,

//       wrongAnswers,

//       unansweredQuestions,

//       totalMarks:
//         attempt.totalMarks,

//       passingMarks:
//         attempt.passingMarks,

//       score:
//         attempt.score,

//       percentage:
//         attempt.percentage,

//       passed:
//         attempt.passed,

//       manualReviewPending:
//         attempt.manualReviewPending,

//       // ==================================================
//       // SECURITY INFORMATION
//       // ==================================================

//       securityViolationCount:
//         attempt.securityViolationCount,

//       tabSwitchCount:
//         attempt.tabSwitchCount,

//       fullscreenExitCount:
//         attempt.fullscreenExitCount,

//       securityAutoSubmitted:
//         attempt.securityAutoSubmitted,

//       securityAutoSubmitReason:
//         attempt.securityAutoSubmitReason,

//       lastSecurityViolationAt:
//         attempt.lastSecurityViolationAt,

//       securityViolations:
//         attempt.securityViolations ||
//         [],

//       createdAt:
//         attempt.createdAt,

//       updatedAt:
//         attempt.updatedAt,
//     },

//     questions,
//   };
// };

// // ======================================================
// // GET ALL STUDENT RESULTS
// // ======================================================
// // GET
// // /api/admin/assessments/:assessmentId/results
// // ======================================================

// export const getAssessmentResults =
//   async ({
//     assessmentId,
//     search = "",
//     status = "",
//     resultStatus = "",
//     page = 1,
//     limit = 10,
//   }) => {
//     // ====================================================
//     // VALIDATE ASSESSMENT ID
//     // ====================================================

//     if (
//       !isValidObjectId(
//         assessmentId
//       )
//     ) {
//       const error =
//         new Error(
//           "Invalid assessment ID."
//         );

//       error.code =
//         "INVALID_ASSESSMENT_ID";

//       throw error;
//     }

//     // ====================================================
//     // FIND ASSESSMENT
//     // ====================================================

//     const assessment =
//       await Assessment.findById(
//         assessmentId
//       )
//         .select(
//           "_id title description status durationMinutes totalMarks passingMarks maxAttempts"
//         )
//         .lean();

//     if (!assessment) {
//       const error =
//         new Error(
//           "Assessment not found."
//         );

//       error.code =
//         "ASSESSMENT_NOT_FOUND";

//       throw error;
//     }

//     // ====================================================
//     // NORMALIZE PAGINATION
//     // ====================================================

//     const currentPage =
//       Math.max(
//         Number(page) || 1,
//         1
//       );

//     const perPage =
//       Math.min(
//         Math.max(
//           Number(limit) || 10,
//           1
//         ),
//         100
//       );

//     // ====================================================
//     // FIND SUBMITTED ATTEMPTS
//     // ====================================================
//     //
//     // Students should only appear in admin results
//     // after submission.
//     //
//     // SUBMITTED
//     // AUTO_SUBMITTED
//     //
//     // IN_PROGRESS is intentionally excluded.
//     // ====================================================

//     const query = {
//       assessment:
//         assessmentId,

//       status: {
//         $in: [
//           "SUBMITTED",
//           "AUTO_SUBMITTED",
//         ],
//       },
//     };

//     // ====================================================
//     // OPTIONAL STATUS FILTER
//     // ====================================================

//     if (
//       status &&
//       [
//         "SUBMITTED",
//         "AUTO_SUBMITTED",
//       ].includes(
//         String(status).toUpperCase()
//       )
//     ) {
//       query.status =
//         String(
//           status
//         ).toUpperCase();
//     }

//     // ====================================================
//     // OPTIONAL RESULT STATUS FILTER
//     // ====================================================

//     if (
//       resultStatus &&
//       [
//         "FINAL",
//         "PENDING_MANUAL_REVIEW",
//       ].includes(
//         String(
//           resultStatus
//         ).toUpperCase()
//       )
//     ) {
//       query.resultStatus =
//         String(
//           resultStatus
//         ).toUpperCase();
//     }

//     // ====================================================
//     // FETCH ATTEMPTS
//     // ====================================================

//     const attempts =
//       await AssessmentAttempt.find(
//         query
//       )
//         .populate(
//           "student",
//           "name email role isActive isEmailVerified"
//         )
//         .sort({
//           submittedAt:
//             -1,
//           createdAt:
//             -1,
//         })
//         .lean();

//     // ====================================================
//     // SEARCH
//     // ====================================================

//     const normalizedSearch =
//       String(
//         search || ""
//       )
//         .trim()
//         .toLowerCase();

//     let filteredAttempts =
//       attempts;

//     if (
//       normalizedSearch
//     ) {
//       filteredAttempts =
//         attempts.filter(
//           (attempt) => {
//             const student =
//               attempt.student;

//             const studentName =
//               String(
//                 student?.name ||
//                   ""
//               ).toLowerCase();

//             const studentEmail =
//               String(
//                 student?.email ||
//                   ""
//               ).toLowerCase();

//             const attemptId =
//               String(
//                 attempt._id ||
//                   ""
//               ).toLowerCase();

//             return (
//               studentName.includes(
//                 normalizedSearch
//               ) ||
//               studentEmail.includes(
//                 normalizedSearch
//               ) ||
//               attemptId.includes(
//                 normalizedSearch
//               )
//             );
//           }
//         );
//     }

//     // ====================================================
//     // TOTAL
//     // ====================================================

//     const total =
//       filteredAttempts.length;

//     // ====================================================
//     // PAGINATION
//     // ====================================================

//     const totalPages =
//       Math.max(
//         Math.ceil(
//           total /
//             perPage
//         ),
//         1
//       );

//     const safePage =
//       Math.min(
//         currentPage,
//         totalPages
//       );

//     const skip =
//       (safePage - 1) *
//       perPage;

//     const paginatedAttempts =
//       filteredAttempts.slice(
//         skip,
//         skip +
//           perPage
//       );

//     // ====================================================
//     // RESULT LIST
//     // ====================================================

//     const results =
//       paginatedAttempts.map(
//         (attempt) => ({
//           attemptId:
//             attempt._id,

//           student: {
//             _id:
//               attempt.student?._id,

//             name:
//               attempt.student?.name ||
//               "Unknown Student",

//             email:
//               attempt.student?.email ||
//               "",

//             role:
//               attempt.student?.role ||
//               "STUDENT",

//             isActive:
//               attempt.student
//                 ?.isActive ??
//               true,

//             isEmailVerified:
//               attempt.student
//                 ?.isEmailVerified ??
//               false,
//           },

//           assessment: {
//             _id:
//               assessment._id,

//             title:
//               assessment.title,

//             status:
//               assessment.status,

//             totalMarks:
//               assessment.totalMarks,

//             passingMarks:
//               assessment.passingMarks,

//             durationMinutes:
//               assessment.durationMinutes,
//           },

//           attemptNumber:
//             attempt.attemptNumber,

//           status:
//             attempt.status,

//           resultStatus:
//             attempt.resultStatus,

//           startedAt:
//             attempt.startedAt,

//           expiresAt:
//             attempt.expiresAt,

//           submittedAt:
//             attempt.submittedAt,

//           totalQuestions:
//             attempt.totalQuestions,

//           answeredQuestions:
//             attempt.answeredQuestions,

//           correctAnswers:
//             attempt.correctAnswers,

//           wrongAnswers:
//             attempt.wrongAnswers,

//           unansweredQuestions:
//             attempt.unansweredQuestions,

//           totalMarks:
//             attempt.totalMarks,

//           passingMarks:
//             attempt.passingMarks,

//           score:
//             attempt.score,

//           percentage:
//             attempt.percentage,

//           passed:
//             attempt.passed,

//           manualReviewPending:
//             attempt.manualReviewPending,

//           // ==================================================
//           // SECURITY
//           // ==================================================

//           securityViolationCount:
//             attempt.securityViolationCount,

//           tabSwitchCount:
//             attempt.tabSwitchCount,

//           fullscreenExitCount:
//             attempt.fullscreenExitCount,

//           securityAutoSubmitted:
//             attempt.securityAutoSubmitted,

//           securityAutoSubmitReason:
//             attempt.securityAutoSubmitReason,

//           lastSecurityViolationAt:
//             attempt.lastSecurityViolationAt,

//           createdAt:
//             attempt.createdAt,

//           updatedAt:
//             attempt.updatedAt,
//         })
//       );

//     // ====================================================
//     // RETURN
//     // ====================================================

//     return {
//       assessment,

//       results,

//       pagination: {
//         page:
//           safePage,

//         limit:
//           perPage,

//         total,

//         totalPages,

//         hasNextPage:
//           safePage <
//           totalPages,

//         hasPreviousPage:
//           safePage > 1,
//       },
//     };
//   };

// // ======================================================
// // GET SINGLE STUDENT RESULT / REVIEW
// // ======================================================
// // GET
// // /api/admin/assessments/attempts/:attemptId/result
// // ======================================================

// export const getAssessmentAttemptResult =
//   async (
//     attemptId
//   ) => {
//     // ====================================================
//     // VALIDATE ATTEMPT ID
//     // ====================================================

//     if (
//       !isValidObjectId(
//         attemptId
//       )
//     ) {
//       const error =
//         new Error(
//           "Invalid attempt ID."
//         );

//       error.code =
//         "INVALID_ATTEMPT_ID";

//       throw error;
//     }

//     // ====================================================
//     // FIND ATTEMPT
//     // ====================================================

//     const attempt =
//       await AssessmentAttempt.findById(
//         attemptId
//       )
//         .populate(
//           "student",
//           "name email role isActive isEmailVerified"
//         )
//         .populate(
//           "assessment",
//           "title description durationMinutes totalMarks passingMarks maxAttempts status"
//         )
//         .lean();

//     // ====================================================
//     // NOT FOUND
//     // ====================================================

//     if (!attempt) {
//       const error =
//         new Error(
//           "Assessment attempt not found."
//         );

//       error.code =
//         "ATTEMPT_NOT_FOUND";

//       throw error;
//     }

//     // ====================================================
//     // ONLY SUBMITTED ATTEMPTS
//     // ====================================================

//     if (
//       attempt.status ===
//       "IN_PROGRESS"
//     ) {
//       const error =
//         new Error(
//           "Assessment must be submitted before the result can be viewed."
//         );

//       error.code =
//         "ATTEMPT_NOT_SUBMITTED";

//       throw error;
//     }

//     // ====================================================
//     // BUILD COMPLETE REVIEW
//     // ====================================================

//     const review =
//       buildAdminReview(
//         attempt
//       );

//     // ====================================================
//     // ADD STUDENT INFORMATION
//     // ====================================================

//     review.student =
//       attempt.student;

//     // ====================================================
//     // ADD ASSESSMENT INFORMATION
//     // ====================================================

//     review.assessment =
//       attempt.assessment;

//     // ====================================================
//     // RETURN
//     // ====================================================

//     return review;
//   };





import mongoose from "mongoose";

import Assessment from "../models/Assessment.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";


// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


const idToString = (value) => {
  if (!value) {
    return "";
  }

  return value.toString();
};


const normalizeAnswer = (answer) => {
  if (
    answer === null ||
    answer === undefined
  ) {
    return null;
  }

  if (
    typeof answer === "string" ||
    typeof answer === "number" ||
    typeof answer === "boolean"
  ) {
    return answer;
  }

  if (Array.isArray(answer)) {
    return answer;
  }

  if (typeof answer === "object") {
    return (
      answer.optionId ??
      answer.value ??
      answer.answer ??
      answer.text ??
      answer
    );
  }

  return answer;
};


const isOptionSelected = (
  selectedAnswer,
  optionId
) => {
  if (
    selectedAnswer === null ||
    selectedAnswer === undefined
  ) {
    return false;
  }

  if (Array.isArray(selectedAnswer)) {
    return selectedAnswer.some(
      (item) =>
        idToString(item) ===
        idToString(optionId)
    );
  }

  return (
    idToString(selectedAnswer) ===
    idToString(optionId)
  );
};


// ======================================================
// ADMIN RESULT LIST
// ======================================================
//
// Returns ALL submitted attempts across all assessments.
//
// Used by:
//
// GET /api/admin/student-results
//
// ======================================================

export const getAllStudentResults = async ({
  page = 1,
  limit = 10,
  search = "",
  assessmentId = "",
  status = "",
  resultStatus = "",
}) => {
  // ----------------------------------------------------
  // NORMALIZE PAGINATION
  // ----------------------------------------------------

  const currentPage =
    Math.max(Number(page) || 1, 1);

  const pageLimit =
    Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );


  // ----------------------------------------------------
  // VALIDATE ASSESSMENT ID
  // ----------------------------------------------------

  if (
    assessmentId &&
    !isValidObjectId(assessmentId)
  ) {
    const error = new Error(
      "Invalid assessment ID."
    );

    error.code = "INVALID_ASSESSMENT_ID";

    throw error;
  }


  // ----------------------------------------------------
  // BUILD FILTER
  // ----------------------------------------------------

  const filter = {
    status: {
      $in: [
        "SUBMITTED",
        "AUTO_SUBMITTED",
      ],
    },
  };


  if (assessmentId) {
    filter.assessment =
      assessmentId;
  }


  if (status) {
    if (
      [
        "SUBMITTED",
        "AUTO_SUBMITTED",
      ].includes(status)
    ) {
      filter.status = status;
    }
  }


  if (resultStatus) {
    if (
      [
        "FINAL",
        "PENDING_MANUAL_REVIEW",
        "NOT_SUBMITTED",
      ].includes(resultStatus)
    ) {
      filter.resultStatus =
        resultStatus;
    }
  }


  // ----------------------------------------------------
  // FETCH ATTEMPTS
  // ----------------------------------------------------

  const attempts =
    await AssessmentAttempt.find(
      filter
    )
      .populate(
        "student",
        "name email role isActive isEmailVerified"
      )
      .populate(
        "assessment",
        "title description"
      )
      .sort({
        submittedAt: -1,
        createdAt: -1,
      })
      .lean();


  // ----------------------------------------------------
  // SEARCH
  // ----------------------------------------------------

  const normalizedSearch =
    search
      ? search
          .trim()
          .toLowerCase()
      : "";


  let filteredAttempts =
    attempts;


  if (normalizedSearch) {
    filteredAttempts =
      attempts.filter(
        (attempt) => {
          const student =
            attempt.student || {};

          const assessment =
            attempt.assessment || {};

          const studentName =
            String(
              student.name || ""
            ).toLowerCase();

          const studentEmail =
            String(
              student.email || ""
            ).toLowerCase();

          const assessmentTitle =
            String(
              assessment.title || ""
            ).toLowerCase();

          const attemptId =
            idToString(
              attempt._id
            ).toLowerCase();

          return (
            studentName.includes(
              normalizedSearch
            ) ||
            studentEmail.includes(
              normalizedSearch
            ) ||
            assessmentTitle.includes(
              normalizedSearch
            ) ||
            attemptId.includes(
              normalizedSearch
            )
          );
        }
      );
  }


  // ----------------------------------------------------
  // TOTAL
  // ----------------------------------------------------

  const total =
    filteredAttempts.length;


  const totalPages =
    Math.max(
      Math.ceil(
        total / pageLimit
      ),
      1
    );


  // ----------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------

  const skip =
    (currentPage - 1) *
    pageLimit;


  const paginatedAttempts =
    filteredAttempts.slice(
      skip,
      skip + pageLimit
    );


  // ----------------------------------------------------
  // RESULT DATA
  // ----------------------------------------------------

  const results =
    paginatedAttempts.map(
      (attempt) => {
        const student =
          attempt.student || {};

        const assessment =
          attempt.assessment || {};

        return {
          attemptId:
            attempt._id,

          student: {
            _id:
              student._id,

            name:
              student.name || "",

            email:
              student.email || "",

            role:
              student.role || "",

            isActive:
              student.isActive,

            isEmailVerified:
              student.isEmailVerified,
          },

          assessment: {
            _id:
              assessment._id,

            title:
              assessment.title ||
              "Untitled Assessment",

            description:
              assessment.description ||
              "",
          },

          attemptNumber:
            attempt.attemptNumber,

          status:
            attempt.status,

          resultStatus:
            attempt.resultStatus,

          startedAt:
            attempt.startedAt,

          expiresAt:
            attempt.expiresAt,

          submittedAt:
            attempt.submittedAt,

          totalQuestions:
            attempt.totalQuestions || 0,

          answeredQuestions:
            attempt.answeredQuestions || 0,

          correctAnswers:
            attempt.correctAnswers || 0,

          wrongAnswers:
            attempt.wrongAnswers || 0,

          unansweredQuestions:
            attempt.unansweredQuestions || 0,

          totalMarks:
            attempt.totalMarks || 0,

          passingMarks:
            attempt.passingMarks || 0,

          score:
            attempt.score || 0,

          percentage:
            attempt.percentage || 0,

          passed:
            attempt.passed,

          manualReviewPending:
            Boolean(
              attempt.manualReviewPending
            ),

          securityViolationCount:
            attempt.securityViolationCount || 0,

          tabSwitchCount:
            attempt.tabSwitchCount || 0,

          fullscreenExitCount:
            attempt.fullscreenExitCount || 0,

          securityAutoSubmitted:
            Boolean(
              attempt.securityAutoSubmitted
            ),

          securityAutoSubmitReason:
            attempt.securityAutoSubmitReason ||
            "",

          lastSecurityViolationAt:
            attempt.lastSecurityViolationAt,

          createdAt:
            attempt.createdAt,

          updatedAt:
            attempt.updatedAt,
        };
      }
    );


  // ----------------------------------------------------
  // RESPONSE
  // ----------------------------------------------------

  return {
    results,

    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages,
    },
  };
};


// ======================================================
// GET ONE ATTEMPT RESULT
// ======================================================

export const getAssessmentAttemptResult =
  async (attemptId) => {
    // --------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------

    if (
      !isValidObjectId(attemptId)
    ) {
      const error = new Error(
        "Invalid attempt ID."
      );

      error.code =
        "INVALID_ATTEMPT_ID";

      throw error;
    }


    // --------------------------------------------------
    // FIND ATTEMPT
    // --------------------------------------------------

    const attempt =
      await AssessmentAttempt.findById(
        attemptId
      )
        .populate(
          "student",
          "name email role isActive isEmailVerified"
        )
        .populate(
          "assessment"
        )
        .lean();


    if (!attempt) {
      const error = new Error(
        "Assessment attempt not found."
      );

      error.code =
        "ATTEMPT_NOT_FOUND";

      throw error;
    }


    // --------------------------------------------------
    // ONLY SUBMITTED ATTEMPTS
    // --------------------------------------------------

    if (
      ![
        "SUBMITTED",
        "AUTO_SUBMITTED",
      ].includes(attempt.status)
    ) {
      const error = new Error(
        "Assessment attempt has not been submitted."
      );

      error.code =
        "ATTEMPT_NOT_SUBMITTED";

      throw error;
    }


    // --------------------------------------------------
    // BUILD QUESTION REVIEW
    // --------------------------------------------------

    const answers =
      Array.isArray(
        attempt.answers
      )
        ? attempt.answers
        : [];


    const answerMap =
      new Map();


    answers.forEach(
      (answer) => {
        const questionId =
          idToString(
            answer.questionId ||
            answer.question
          );

        if (questionId) {
          answerMap.set(
            questionId,
            answer
          );
        }
      }
    );


    const questionSnapshot =
      Array.isArray(
        attempt.questionSnapshot
      )
        ? attempt.questionSnapshot
        : [];


    const questions =
      questionSnapshot.map(
        (question, index) => {
          const questionId =
            idToString(
              question.questionId ||
              question._id
            );


          const answer =
            answerMap.get(
              questionId
            ) || {};


          const studentAnswer =
            normalizeAnswer(
              answer.answer ??
              answer.selectedAnswer ??
              answer.value
            );


          const options =
            Array.isArray(
              question.options
            )
              ? question.options.map(
                  (option) => {
                    const optionId =
                      option._id ||
                      option.id ||
                      option.optionId;

                    return {
                      _id:
                        optionId,

                      id:
                        option.id,

                      optionId:
                        option.optionId,

                      text:
                        option.text ||
                        option.label ||
                        option.value ||
                        "",

                      selected:
                        isOptionSelected(
                          studentAnswer,
                          optionId
                        ),

                      correct:
                        Boolean(
                          option.isCorrect ??
                          option.correct
                        ),
                    };
                  }
                )
              : [];


          const isAnswered =
            answer.isAnswered !==
              undefined
              ? Boolean(
                  answer.isAnswered
                )
              : studentAnswer !==
                  null &&
                studentAnswer !==
                  undefined &&
                studentAnswer !== "";


          return {
            questionId,

            order:
              question.order ??
              question.questionOrder ??
              index + 1,

            questionText:
              question.questionText ||
              question.text ||
              question.title ||
              "",

            questionType:
              question.questionType ||
              question.type ||
              "",

            options,

            marks:
              question.marks || 0,

            negativeMarks:
              question.negativeMarks ||
              0,

            isRequired:
              Boolean(
                question.isRequired
              ),

            studentAnswer,

            correctAnswer:
              question.correctAnswer ??
              question.correctOption ??
              null,

            isAnswered,

            isCorrect:
              answer.isCorrect,

            awardedMarks:
              answer.awardedMarks ??
              0,

            deductedMarks:
              answer.deductedMarks ??
              0,

            requiresManualReview:
              Boolean(
                answer.requiresManualReview
              ),

            reviewed:
              Boolean(
                answer.reviewed
              ),

            answerStatus:
              answer.answerStatus ||
              (
                !isAnswered
                  ? "UNANSWERED"
                  : answer.isCorrect ===
                      true
                    ? "CORRECT"
                    : answer.isCorrect ===
                        false
                      ? "WRONG"
                      : "PENDING_REVIEW"
              ),

            answeredAt:
              answer.answeredAt ||
              null,
          };
        }
      );


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return {
      attemptId:
        attempt._id,

      assessmentId:
        attempt.assessment?._id ||
        attempt.assessment,

      assessment:
        attempt.assessment || null,

      student:
        attempt.student || null,

      attemptNumber:
        attempt.attemptNumber,

      status:
        attempt.status,

      resultStatus:
        attempt.resultStatus,

      startedAt:
        attempt.startedAt,

      expiresAt:
        attempt.expiresAt,

      submittedAt:
        attempt.submittedAt,

      totalQuestions:
        attempt.totalQuestions || 0,

      answeredQuestions:
        attempt.answeredQuestions || 0,

      correctAnswers:
        attempt.correctAnswers || 0,

      wrongAnswers:
        attempt.wrongAnswers || 0,

      unansweredQuestions:
        attempt.unansweredQuestions || 0,

      totalMarks:
        attempt.totalMarks || 0,

      passingMarks:
        attempt.passingMarks || 0,

      score:
        attempt.score || 0,

      percentage:
        attempt.percentage || 0,

      passed:
        attempt.passed,

      manualReviewPending:
        Boolean(
          attempt.manualReviewPending
        ),

      // ------------------------------------------------
      // SECURITY
      // ------------------------------------------------

      security: {
        securityViolationCount:
          attempt.securityViolationCount ||
          0,

        tabSwitchCount:
          attempt.tabSwitchCount ||
          0,

        fullscreenExitCount:
          attempt.fullscreenExitCount ||
          0,

        securityAutoSubmitted:
          Boolean(
            attempt.securityAutoSubmitted
          ),

        securityAutoSubmitReason:
          attempt.securityAutoSubmitReason ||
          "",

        lastSecurityViolationAt:
          attempt.lastSecurityViolationAt ||
          null,

        securityViolations:
          Array.isArray(
            attempt.securityViolations
          )
            ? attempt.securityViolations
            : [],
      },

      questions,

      createdAt:
        attempt.createdAt,

      updatedAt:
        attempt.updatedAt,
    };
  };




  // ======================================================
// DELETE STUDENT ASSESSMENT RESULT
// ======================================================
//
// DELETE
// /api/admin/assessments/attempts/:attemptId/result
//
// Only submitted / auto-submitted attempts can be deleted.
// ======================================================

export const deleteStudentAssessmentResult =
  async (attemptId) => {

    // --------------------------------------------------
    // VALIDATE ATTEMPT ID
    // --------------------------------------------------

    if (!isValidObjectId(attemptId)) {

      const error =
        new Error(
          "Invalid attempt ID."
        );

      error.code =
        "INVALID_ATTEMPT_ID";

      throw error;
    }


    // --------------------------------------------------
    // FIND ATTEMPT
    // --------------------------------------------------

    const attempt =
      await AssessmentAttempt.findById(
        attemptId
      );


    // --------------------------------------------------
    // ATTEMPT NOT FOUND
    // --------------------------------------------------

    if (!attempt) {

      const error =
        new Error(
          "Assessment attempt not found."
        );

      error.code =
        "ATTEMPT_NOT_FOUND";

      throw error;
    }


    // --------------------------------------------------
    // ONLY SUBMITTED RESULTS CAN BE DELETED
    // --------------------------------------------------

    if (
      ![
        "SUBMITTED",
        "AUTO_SUBMITTED",
      ].includes(
        attempt.status
      )
    ) {

      const error =
        new Error(
          "Only submitted assessment results can be deleted."
        );

      error.code =
        "ATTEMPT_NOT_SUBMITTED";

      throw error;
    }


    // --------------------------------------------------
    // DELETE ATTEMPT
    // --------------------------------------------------

    await AssessmentAttempt.deleteOne({
      _id: attempt._id,
    });


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return {
      attemptId:
        attempt._id,

      deleted: true,
    };
  };