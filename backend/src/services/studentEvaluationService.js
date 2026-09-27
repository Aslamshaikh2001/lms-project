import mongoose from "mongoose";
import AssessmentAttempt from "../models/AssessmentAttempt.js";

// ======================================================
// VALIDATE OBJECT ID
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

// ======================================================
// CHECK EMPTY ANSWER
// ======================================================

const isEmptyAnswer = (answer) => {
  if (
    answer === null ||
    answer === undefined
  ) {
    return true;
  }

  if (typeof answer === "string") {
    return normalizeText(answer) === "";
  }

  if (Array.isArray(answer)) {
    return answer.length === 0;
  }

  return false;
};

// ======================================================
// CONVERT ID TO STRING
// ======================================================

const idToString = (id) => {
  if (!id) {
    return "";
  }

  return String(id);
};

// ======================================================
// COMPARE OPTION SETS
// ======================================================

const areSameOptionSets = (
  selectedIds,
  correctIds
) => {
  const selected = [
    ...new Set(
      (Array.isArray(selectedIds)
        ? selectedIds
        : []
      ).map(idToString)
    ),
  ].sort();

  const correct = [
    ...new Set(
      (Array.isArray(correctIds)
        ? correctIds
        : []
      ).map(idToString)
    ),
  ].sort();

  if (selected.length !== correct.length) {
    return false;
  }

  return selected.every(
    (id, index) =>
      id === correct[index]
  );
};

// ======================================================
// GET CORRECT ANSWERS
// ======================================================

const getAcceptedShortAnswers = (
  correctAnswer
) => {
  if (Array.isArray(correctAnswer)) {
    return correctAnswer
      .map(normalizeText)
      .filter(Boolean);
  }

  if (
    correctAnswer === null ||
    correctAnswer === undefined
  ) {
    return [];
  }

  return [
    normalizeText(correctAnswer),
  ].filter(Boolean);
};

// ======================================================
// EVALUATE ONE QUESTION
// ======================================================

const evaluateQuestion = (
  question,
  answer
) => {
  const marks =
    Number(question.marks) || 0;

  const negativeMarks = Math.min(
    Math.max(
      Number(
        question.negativeMarks
      ) || 0,
      0
    ),
    marks
  );

  const gradingKey =
    question.gradingKey || {};

  const selectedAnswer =
    answer?.selectedAnswer;

  // ====================================================
  // UNANSWERED
  // ====================================================

  if (
    !answer ||
    isEmptyAnswer(selectedAnswer)
  ) {
    return {
      isCorrect: null,
      awardedMarks: 0,
      deductedMarks: 0,
      requiresManualReview: false,
      reviewed: false,
      outcome: "UNANSWERED",
    };
  }

  // ====================================================
  // MCQ
  // ====================================================

  if (
    question.questionType ===
    "MCQ"
  ) {
    const correctOptionIds =
      gradingKey.correctOptionIds || [];

    const selectedId =
      idToString(selectedAnswer);

    const correctId =
      correctOptionIds.length
        ? idToString(
            correctOptionIds[0]
          )
        : "";

    if (
      selectedId === correctId
    ) {
      return {
        isCorrect: true,
        awardedMarks: marks,
        deductedMarks: 0,
        requiresManualReview: false,
        reviewed: false,
        outcome: "CORRECT",
      };
    }

    return {
      isCorrect: false,
      awardedMarks: 0,
      deductedMarks: negativeMarks,
      requiresManualReview: false,
      reviewed: false,
      outcome: "WRONG",
    };
  }

  // ====================================================
  // TRUE / FALSE
  // ====================================================

  if (
    question.questionType ===
    "TRUE_FALSE"
  ) {
    const correctOptionIds =
      gradingKey.correctOptionIds || [];

    const selectedId =
      idToString(selectedAnswer);

    const correctId =
      correctOptionIds.length
        ? idToString(
            correctOptionIds[0]
          )
        : "";

    if (
      selectedId === correctId
    ) {
      return {
        isCorrect: true,
        awardedMarks: marks,
        deductedMarks: 0,
        requiresManualReview: false,
        reviewed: false,
        outcome: "CORRECT",
      };
    }

    return {
      isCorrect: false,
      awardedMarks: 0,
      deductedMarks: negativeMarks,
      requiresManualReview: false,
      reviewed: false,
      outcome: "WRONG",
    };
  }

  // ====================================================
  // MULTIPLE SELECT
  // ====================================================

  if (
    question.questionType ===
    "MULTIPLE_SELECT"
  ) {
    const correctOptionIds =
      gradingKey.correctOptionIds || [];

    const isCorrect =
      areSameOptionSets(
        selectedAnswer,
        correctOptionIds
      );

    if (isCorrect) {
      return {
        isCorrect: true,
        awardedMarks: marks,
        deductedMarks: 0,
        requiresManualReview: false,
        reviewed: false,
        outcome: "CORRECT",
      };
    }

    return {
      isCorrect: false,
      awardedMarks: 0,
      deductedMarks: negativeMarks,
      requiresManualReview: false,
      reviewed: false,
      outcome: "WRONG",
    };
  }

  // ====================================================
  // SHORT ANSWER
  // ====================================================

  if (
    question.questionType ===
    "SHORT_ANSWER"
  ) {
    const acceptedAnswers =
      getAcceptedShortAnswers(
        gradingKey.correctAnswer
      );

    const studentAnswer =
      normalizeText(
        selectedAnswer
      );

    const isCorrect =
      acceptedAnswers.includes(
        studentAnswer
      );

    if (isCorrect) {
      return {
        isCorrect: true,
        awardedMarks: marks,
        deductedMarks: 0,
        requiresManualReview: false,
        reviewed: false,
        outcome: "CORRECT",
      };
    }

    return {
      isCorrect: false,
      awardedMarks: 0,
      deductedMarks: negativeMarks,
      requiresManualReview: false,
      reviewed: false,
      outcome: "WRONG",
    };
  }

  // ====================================================
  // LONG ANSWER
  // ====================================================

  if (
    question.questionType ===
    "LONG_ANSWER"
  ) {
    return {
      isCorrect: null,
      awardedMarks: 0,
      deductedMarks: 0,
      requiresManualReview: true,
      reviewed: false,
      outcome: "MANUAL_REVIEW",
    };
  }

  // ====================================================
  // UNKNOWN QUESTION TYPE
  // ====================================================

  return {
    isCorrect: null,
    awardedMarks: 0,
    deductedMarks: 0,
    requiresManualReview: true,
    reviewed: false,
    outcome: "MANUAL_REVIEW",
  };
};

// ======================================================
// EVALUATE COMPLETE ATTEMPT
// ======================================================

export const evaluateAttempt = async (
  attemptId,
  studentId,
  submissionMode = "MANUAL"
) => {
  // ====================================================
  // VALIDATE IDS
  // ====================================================

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

  if (
    !isValidObjectId(studentId)
  ) {
    const error = new Error(
      "Invalid student ID."
    );

    error.code =
      "INVALID_STUDENT_ID";

    throw error;
  }

  // ====================================================
  // FIND STUDENT ATTEMPT
  // ====================================================

  const attempt =
    await AssessmentAttempt.findOne({
      _id: attemptId,
      student: studentId,
    });

  if (!attempt) {
    const error = new Error(
      "Assessment attempt not found."
    );

    error.code =
      "ATTEMPT_NOT_FOUND";

    throw error;
  }

  // ====================================================
  // IDEMPOTENT SUBMISSION
  // ====================================================

  if (
    attempt.status ===
      "SUBMITTED" ||
    attempt.status ===
      "AUTO_SUBMITTED"
  ) {
    return buildResult(attempt);
  }

  // ====================================================
  // ONLY IN-PROGRESS ATTEMPTS
  // ====================================================

  if (
    attempt.status !==
    "IN_PROGRESS"
  ) {
    const error = new Error(
      "This assessment attempt cannot be submitted."
    );

    error.code =
      "ATTEMPT_NOT_SUBMITTABLE";

    throw error;
  }

  // ====================================================
  // DETERMINE SUBMISSION MODE
  // ====================================================

  const now = new Date();

  const isExpired =
    attempt.expiresAt &&
    now >=
      new Date(
        attempt.expiresAt
      );

  const finalStatus =
    isExpired ||
    submissionMode ===
      "AUTO"
      ? "AUTO_SUBMITTED"
      : "SUBMITTED";

  // ====================================================
  // CREATE ANSWER MAP
  // ====================================================

  const answerMap =
    new Map();

  for (
    const answer of
      attempt.answers || []
  ) {
    answerMap.set(
      idToString(
        answer.question
      ),
      answer
    );
  }

  // ====================================================
  // EVALUATION COUNTERS
  // ====================================================

  let totalAwardedMarks = 0;
  let totalDeductedMarks = 0;

  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unansweredQuestions = 0;

  let manualReviewPending = 0;

  // ====================================================
  // EVALUATE EACH QUESTION
  // ====================================================

  for (
    const question of
      attempt.questionSnapshot
  ) {
    const questionId =
      idToString(
        question.question
      );

    const answer =
      answerMap.get(
        questionId
      );

    const evaluation =
      evaluateQuestion(
        question,
        answer
      );

    // --------------------------------------------------
    // NO ANSWER
    // --------------------------------------------------

    if (
      evaluation.outcome ===
      "UNANSWERED"
    ) {
      unansweredQuestions += 1;

      continue;
    }

    // --------------------------------------------------
    // UPDATE EXISTING ANSWER
    // --------------------------------------------------

    if (answer) {
      answer.isCorrect =
        evaluation.isCorrect;

      answer.awardedMarks =
        evaluation.awardedMarks;

      answer.deductedMarks =
        evaluation.deductedMarks;

      answer.requiresManualReview =
        evaluation.requiresManualReview;

      answer.reviewed =
        false;
    }

    // --------------------------------------------------
    // MANUAL REVIEW
    // --------------------------------------------------

    if (
      evaluation.requiresManualReview
    ) {
      manualReviewPending += 1;
    }

    // --------------------------------------------------
    // CORRECT / WRONG
    // --------------------------------------------------

    if (
      evaluation.isCorrect ===
      true
    ) {
      correctAnswers += 1;
    }

    if (
      evaluation.isCorrect ===
      false
    ) {
      wrongAnswers += 1;
    }

    // --------------------------------------------------
    // MARKS
    // --------------------------------------------------

    totalAwardedMarks +=
      evaluation.awardedMarks;

    totalDeductedMarks +=
      evaluation.deductedMarks;
  }

  // ====================================================
  // ANSWERED QUESTIONS
  // ====================================================

  const totalQuestions =
    attempt.questionSnapshot.length;

  const answeredQuestions =
    Math.max(
      totalQuestions -
        unansweredQuestions,
      0
    );

  // ====================================================
  // FINAL SCORE
  // ====================================================

  let score =
    totalAwardedMarks -
    totalDeductedMarks;

  // Score cannot be negative.
  score = Math.max(
    0,
    score
  );

  // Score cannot exceed total marks.
  score = Math.min(
    score,
    Number(
      attempt.totalMarks
    ) || 0
  );

  // ====================================================
  // PERCENTAGE
  // ====================================================

  const totalMarks =
    Number(
      attempt.totalMarks
    ) || 0;

  const percentage =
    totalMarks > 0
      ? Number(
          (
            (score /
              totalMarks) *
            100
          ).toFixed(2)
        )
      : 0;

  // ====================================================
  // RESULT STATUS
  // ====================================================

  const resultStatus =
    manualReviewPending > 0
      ? "PENDING_MANUAL_REVIEW"
      : "FINAL";

  // ====================================================
  // PASSED
  // ====================================================

  const passed =
    manualReviewPending > 0
      ? null
      : score >=
        Number(
          attempt.passingMarks
        );

  // ====================================================
  // UPDATE ATTEMPT
  // ====================================================

  attempt.status =
    finalStatus;

  attempt.resultStatus =
    resultStatus;

  attempt.submittedAt =
    now;

  attempt.score =
    Number(
      score.toFixed(2)
    );

  attempt.percentage =
    percentage;

  attempt.passed =
    passed;

  attempt.totalQuestions =
    totalQuestions;

  attempt.answeredQuestions =
    answeredQuestions;

  attempt.correctAnswers =
    correctAnswers;

  attempt.wrongAnswers =
    wrongAnswers;

  attempt.unansweredQuestions =
    unansweredQuestions;

  attempt.manualReviewPending =
    manualReviewPending;

  await attempt.save();

  // ====================================================
  // RETURN RESULT
  // ====================================================

  return buildResult(
    attempt
  );
};

// ======================================================
// BUILD SAFE RESULT
// ======================================================

export const buildResult = (
  attempt
) => {
  return {
    attemptId:
      attempt._id,

    assessmentId:
      attempt.assessment,

    attemptNumber:
      attempt.attemptNumber,

    status:
      attempt.status,

    resultStatus:
      attempt.resultStatus,

    startedAt:
      attempt.startedAt,

    submittedAt:
      attempt.submittedAt,

    expiresAt:
      attempt.expiresAt,

    totalQuestions:
      attempt.totalQuestions,

    answeredQuestions:
      attempt.answeredQuestions,

    unansweredQuestions:
      attempt.unansweredQuestions,

    correctAnswers:
      attempt.correctAnswers,

    wrongAnswers:
      attempt.wrongAnswers,

    totalMarks:
      attempt.totalMarks,

    passingMarks:
      attempt.passingMarks,

    score:
      attempt.score,

    percentage:
      attempt.percentage,

    passed:
      attempt.passed,

    manualReviewPending:
      attempt.manualReviewPending,
  };
};

// ======================================================
// GET RESULT
// ======================================================

export const getAttemptResult =
  async (
    attemptId,
    studentId
  ) => {
    if (
      !isValidObjectId(
        attemptId
      )
    ) {
      const error = new Error(
        "Invalid attempt ID."
      );

      error.code =
        "INVALID_ATTEMPT_ID";

      throw error;
    }

    if (
      !isValidObjectId(
        studentId
      )
    ) {
      const error = new Error(
        "Invalid student ID."
      );

      error.code =
        "INVALID_STUDENT_ID";

      throw error;
    }

    const attempt =
      await AssessmentAttempt.findOne(
        {
          _id: attemptId,
          student: studentId,
        }
      ).populate(
        "assessment",
        "title description durationMinutes totalMarks passingMarks maxAttempts"
      );

    if (!attempt) {
      const error = new Error(
        "Assessment attempt not found."
      );

      error.code =
        "ATTEMPT_NOT_FOUND";

      throw error;
    }

    // Student cannot see result before submission.
    if (
      attempt.status ===
      "IN_PROGRESS"
    ) {
      const error = new Error(
        "Assessment has not been submitted yet."
      );

      error.code =
        "RESULT_NOT_AVAILABLE";

      throw error;
    }

    return {
      ...buildResult(
        attempt
      ),

      assessment:
        attempt.assessment
          ? {
              _id:
                attempt
                  .assessment
                  ._id,

              title:
                attempt
                  .assessment
                  .title,

              description:
                attempt
                  .assessment
                  .description,

              durationMinutes:
                attempt
                  .assessment
                  .durationMinutes,

              totalMarks:
                attempt
                  .assessment
                  .totalMarks,

              passingMarks:
                attempt
                  .assessment
                  .passingMarks,

              maxAttempts:
                attempt
                  .assessment
                  .maxAttempts,
            }
          : null,
    };
  };