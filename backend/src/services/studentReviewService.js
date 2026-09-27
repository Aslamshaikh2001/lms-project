import mongoose from "mongoose";

import AssessmentAttempt from "../models/AssessmentAttempt.js";

// ======================================================
// VALIDATE OBJECT ID
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
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
// NORMALIZE ANSWER
// ======================================================

const normalizeAnswer = (answer) => {
  if (
    answer === null ||
    answer === undefined
  ) {
    return "";
  }

  if (Array.isArray(answer)) {
    return answer.map(
      (item) => idToString(item)
    );
  }

  return String(answer).trim();
};

// ======================================================
// CHECK OPTION SELECTED
// ======================================================

const isOptionSelected = (
  selectedAnswer,
  optionId
) => {
  const normalized =
    normalizeAnswer(
      selectedAnswer
    );

  const normalizedOptionId =
    idToString(optionId);

  if (Array.isArray(normalized)) {
    return normalized.includes(
      normalizedOptionId
    );
  }

  return (
    normalized ===
    normalizedOptionId
  );
};

// ======================================================
// BUILD REVIEW OPTION
// ======================================================

const buildReviewOption = ({
  option,
  selectedAnswer,
  correctOptionIds,
}) => {
  const optionId =
    idToString(option?._id);

  const selected =
    isOptionSelected(
      selectedAnswer,
      optionId
    );

  const correct =
    correctOptionIds.includes(
      optionId
    );

  return {
    _id: option?._id,

    text:
      option?.text || "",

    selected,

    correct,
  };
};

// ======================================================
// BUILD REVIEW QUESTION
// ======================================================

const buildReviewQuestion = ({
  snapshot,
  answer,
}) => {
  const questionType =
    snapshot.questionType;

  const selectedAnswer =
    answer?.selectedAnswer ??
    null;

  const correctOptionIds =
    Array.isArray(
      snapshot.gradingKey
        ?.correctOptionIds
    )
      ? snapshot.gradingKey.correctOptionIds.map(
          (id) =>
            idToString(id)
        )
      : [];

  const isAnswered =
    answer !== undefined &&
    answer !== null &&
    answer.selectedAnswer !==
      null &&
    answer.selectedAnswer !==
      undefined &&
    !(
      typeof answer.selectedAnswer ===
        "string" &&
      answer.selectedAnswer.trim() ===
        ""
    ) &&
    !(
      Array.isArray(
        answer.selectedAnswer
      ) &&
      answer.selectedAnswer.length ===
        0
    );

  // ====================================================
  // OPTIONS
  // ====================================================

  const options =
    Array.isArray(
      snapshot.options
    )
      ? snapshot.options.map(
          (option) =>
            buildReviewOption({
              option,
              selectedAnswer,
              correctOptionIds,
            })
        )
      : [];

  // ====================================================
  // CORRECT ANSWER
  // ====================================================

  let correctAnswer = null;

  if (
    questionType === "MCQ" ||
    questionType ===
      "MULTIPLE_SELECT" ||
    questionType ===
      "TRUE_FALSE"
  ) {
    correctAnswer =
      correctOptionIds;
  } else {
    correctAnswer =
      snapshot.gradingKey
        ?.correctAnswer ??
      null;
  }

  // ====================================================
  // STUDENT ANSWER
  // ====================================================

  let studentAnswer =
    selectedAnswer;

  // ====================================================
  // RESULT STATUS
  // ====================================================

  let answerStatus =
    "UNANSWERED";

  if (isAnswered) {
    if (
      answer?.requiresManualReview
    ) {
      answerStatus =
        "PENDING_REVIEW";
    } else if (
      answer?.isCorrect === true
    ) {
      answerStatus =
        "CORRECT";
    } else if (
      answer?.isCorrect === false
    ) {
      answerStatus =
        "WRONG";
    } else {
      answerStatus =
        "PENDING_REVIEW";
    }
  }

  // ====================================================
  // MARKS
  // ====================================================

  const awardedMarks =
    Number(
      answer?.awardedMarks
    ) || 0;

  const deductedMarks =
    Number(
      answer?.deductedMarks
    ) || 0;

  // ====================================================
  // RETURN REVIEW QUESTION
  // ====================================================

  return {
    question:
      snapshot.question,

    order:
      snapshot.order,

    questionText:
      snapshot.questionText,

    questionType,

    options,

    marks:
      Number(
        snapshot.marks
      ) || 0,

    negativeMarks:
      Number(
        snapshot.negativeMarks
      ) || 0,

    isRequired:
      snapshot.isRequired !==
      false,

    studentAnswer,

    correctAnswer,

    isAnswered,

    isCorrect:
      answer?.isCorrect ??
      null,

    awardedMarks,

    deductedMarks,

    requiresManualReview:
      answer?.requiresManualReview ||
      false,

    answerStatus,
  };
};

// ======================================================
// BUILD REVIEW RESPONSE
// ======================================================

const buildReviewResponse = (
  attempt
) => {
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
      answerMap.set(
        idToString(
          answer.question
        ),
        answer
      );
    }
  );

  const snapshot =
    Array.isArray(
      attempt.questionSnapshot
    )
      ? attempt.questionSnapshot
      : [];

  const questions =
    snapshot.map(
      (question) => {
        const answer =
          answerMap.get(
            idToString(
              question.question
            )
          );

        return buildReviewQuestion({
          snapshot: question,
          answer,
        });
      }
    );

  // ====================================================
  // COUNTERS
  // ====================================================

  const answeredQuestions =
    questions.filter(
      (question) =>
        question.isAnswered
    ).length;

  const unansweredQuestions =
    questions.length -
    answeredQuestions;

  const correctAnswers =
    questions.filter(
      (question) =>
        question.isCorrect ===
        true
    ).length;

  const wrongAnswers =
    questions.filter(
      (question) =>
        question.isCorrect ===
        false
    ).length;

  const manualReviewPending =
    questions.filter(
      (question) =>
        question.requiresManualReview
    ).length;

  // ====================================================
  // RETURN
  // ====================================================

  return {
    attempt: {
      _id:
        attempt._id,

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

      score:
        attempt.score,

      totalMarks:
        attempt.totalMarks,

      passingMarks:
        attempt.passingMarks,

      percentage:
        attempt.percentage,

      passed:
        attempt.passed,

      totalQuestions:
        attempt.totalQuestions,

      answeredQuestions,

      correctAnswers,

      wrongAnswers,

      unansweredQuestions,

      manualReviewPending:
        attempt.manualReviewPending,
    },

    questions,
  };
};

// ======================================================
// GET ATTEMPT REVIEW
// ======================================================

export const getAttemptReview =
  async (
    attemptId,
    studentId
  ) => {
    // ==================================================
    // VALIDATE ATTEMPT ID
    // ==================================================

    if (
      !isValidObjectId(
        attemptId
      )
    ) {
      const error =
        new Error(
          "Invalid attempt ID."
        );

      error.code =
        "INVALID_ATTEMPT_ID";

      throw error;
    }

    // ==================================================
    // VALIDATE STUDENT ID
    // ==================================================

    if (
      !isValidObjectId(
        studentId
      )
    ) {
      const error =
        new Error(
          "Invalid student ID."
        );

      error.code =
        "INVALID_STUDENT_ID";

      throw error;
    }

    // ==================================================
    // FIND STUDENT ATTEMPT
    // ==================================================

    const attempt =
      await AssessmentAttempt.findOne({
        _id:
          attemptId,

        student:
          studentId,
      }).lean();

    // ==================================================
    // NOT FOUND
    // ==================================================

    if (!attempt) {
      const error =
        new Error(
          "Assessment attempt not found."
        );

      error.code =
        "ATTEMPT_NOT_FOUND";

      throw error;
    }

    // ==================================================
    // ONLY SUBMITTED ATTEMPTS CAN BE REVIEWED
    // ==================================================

    if (
      attempt.status ===
      "IN_PROGRESS"
    ) {
      const error =
        new Error(
          "Assessment must be submitted before answers can be reviewed."
        );

      error.code =
        "ATTEMPT_NOT_SUBMITTED";

      throw error;
    }

    // ==================================================
    // BUILD REVIEW
    // ==================================================

    return buildReviewResponse(
      attempt
    );
  };