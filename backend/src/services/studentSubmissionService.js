import mongoose from "mongoose";

import AssessmentAttempt from "../models/AssessmentAttempt.js";
import Question from "../models/Question.js";

// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(
    id
  );
};

// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

// ======================================================
// COMPARE SETS
// ======================================================

const sameOptionSet = (
  first = [],
  second = []
) => {
  if (
    first.length !==
    second.length
  ) {
    return false;
  }

  const firstSet =
    new Set(
      first.map(String)
    );

  return second.every(
    (value) =>
      firstSet.has(
        String(value)
      )
  );
};

// ======================================================
// CHECK EMPTY ANSWER
// ======================================================

const isEmptyAnswer = (value) => {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (
      Array.isArray(value) &&
      value.length === 0
    )
  );
};

// ======================================================
// SHORT ANSWER COMPARISON
// ======================================================

const evaluateShortAnswer = (
  selectedAnswer,
  correctAnswer
) => {
  // ----------------------------------------------------
  // SUPPORT ARRAY OF ACCEPTABLE ANSWERS
  // ----------------------------------------------------

  if (
    Array.isArray(correctAnswer)
  ) {
    const selected =
      normalizeText(
        selectedAnswer
      );

    return correctAnswer.some(
      (answer) =>
        normalizeText(answer) ===
        selected
    );
  }

  return (
    normalizeText(
      selectedAnswer
    ) ===
    normalizeText(
      correctAnswer
    )
  );
};

// ======================================================
// RESULT PAYLOAD
// ======================================================

const createResultPayload = (
  attempt
) => {
  return {
    _id: attempt._id,

    assessment:
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

    answeredQuestions:
      attempt.answeredQuestions,

    unansweredQuestions:
      attempt.unansweredQuestions,

    correctAnswers:
      attempt.correctAnswers,

    wrongAnswers:
      attempt.wrongAnswers,

    manualReviewPending:
      attempt.manualReviewPending,
  };
};

// ======================================================
// SUBMIT / EVALUATE ATTEMPT
// ======================================================

export const submitAssessmentAttempt =
  async (
    attemptId,
    studentId
  ) => {
    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !isValidObjectId(
        attemptId
      )
    ) {
      throw new Error(
        "Invalid attempt ID."
      );
    }

    if (
      !isValidObjectId(
        studentId
      )
    ) {
      throw new Error(
        "Invalid student ID."
      );
    }

    // ==================================================
    // FIND ATTEMPT
    // ==================================================

    const attempt =
      await AssessmentAttempt.findOne({
        _id: attemptId,
        student: studentId,
      }).populate(
        "assessment",
        "title description"
      );

    if (!attempt) {
      throw new Error(
        "Assessment attempt not found."
      );
    }

    // ==================================================
    // ALREADY FULLY EVALUATED
    //
    // Makes submission idempotent.
    // ==================================================

    if (
      (
        attempt.status ===
          "SUBMITTED" ||
        attempt.status ===
          "AUTO_SUBMITTED"
      ) &&
      attempt.resultStatus !==
        "NOT_SUBMITTED"
    ) {
      return createResultPayload(
        attempt
      );
    }

    const now =
      new Date();

    // ==================================================
    // DETERMINE MANUAL OR AUTO SUBMIT
    // ==================================================

    const expired =
      attempt.expiresAt &&
      now >=
        new Date(
          attempt.expiresAt
        );

    // ==================================================
    // FALLBACK QUESTION DATA
    //
    // Useful for attempts created before gradingKey
    // was introduced.
    // ==================================================

    const questionIds =
      attempt.questionSnapshot.map(
        (item) =>
          item.question
      );

    const originalQuestions =
      await Question.find({
        _id: {
          $in: questionIds,
        },
      }).lean();

    const originalMap =
      new Map(
        originalQuestions.map(
          (question) => [
            String(
              question._id
            ),
            question,
          ]
        )
      );

    // ==================================================
    // STATISTICS
    // ==================================================

    let earnedMarks = 0;

    let deductedMarks = 0;

    let correctAnswers = 0;

    let wrongAnswers = 0;

    let answeredQuestions = 0;

    let unansweredQuestions = 0;

    let manualReviewPending = 0;

    // ==================================================
    // EVALUATE QUESTIONS
    // ==================================================

    for (
      const snapshot of
      attempt.questionSnapshot
    ) {
      const answer =
        attempt.answers.find(
          (item) =>
            String(
              item.question
            ) ===
            String(
              snapshot.question
            )
        );

      // ================================================
      // NO ANSWER
      // ================================================

      if (
        !answer ||
        isEmptyAnswer(
          answer.selectedAnswer
        )
      ) {
        unansweredQuestions += 1;

        if (answer) {
          answer.isCorrect =
            null;

          answer.awardedMarks =
            0;

          answer.deductedMarks =
            0;

          answer.requiresManualReview =
            false;
        }

        continue;
      }

      answeredQuestions += 1;

      // ================================================
      // ORIGINAL QUESTION FALLBACK
      // ================================================

      const originalQuestion =
        originalMap.get(
          String(
            snapshot.question
          )
        );

      let correctOptionIds =
        snapshot.gradingKey
          ?.correctOptionIds ||
        [];

      let correctAnswer =
        snapshot.gradingKey
          ?.correctAnswer;

      // ------------------------------------------------
      // OLD ATTEMPT FALLBACK
      // ------------------------------------------------

      if (
        !correctOptionIds.length &&
        originalQuestion?.options
      ) {
        correctOptionIds =
          originalQuestion.options
            .filter(
              (option) =>
                option.isCorrect
            )
            .map(
              (option) =>
                option._id
            );
      }

      if (
        (
          correctAnswer ===
            undefined ||
          correctAnswer ===
            null
        ) &&
        originalQuestion
      ) {
        correctAnswer =
          originalQuestion.correctAnswer;
      }

      const marks =
        Number(
          snapshot.marks
        ) || 0;

      const negativeMarks =
        Number(
          snapshot.negativeMarks
        ) || 0;

      let isCorrect = false;

      let needsManualReview =
        false;

      // ================================================
      // MCQ
      // ================================================

      if (
        snapshot.questionType ===
        "MCQ"
      ) {
        isCorrect =
          correctOptionIds.some(
            (correctId) =>
              String(
                correctId
              ) ===
              String(
                answer.selectedAnswer
              )
          );
      }

      // ================================================
      // TRUE / FALSE
      // ================================================

      else if (
        snapshot.questionType ===
        "TRUE_FALSE"
      ) {
        isCorrect =
          correctOptionIds.some(
            (correctId) =>
              String(
                correctId
              ) ===
              String(
                answer.selectedAnswer
              )
          );
      }

      // ================================================
      // MULTIPLE SELECT
      // ================================================

      else if (
        snapshot.questionType ===
        "MULTIPLE_SELECT"
      ) {
        const selected =
          Array.isArray(
            answer.selectedAnswer
          )
            ? answer.selectedAnswer
            : [];

        isCorrect =
          sameOptionSet(
            selected,
            correctOptionIds
          );
      }

      // ================================================
      // SHORT ANSWER
      // ================================================

      else if (
        snapshot.questionType ===
        "SHORT_ANSWER"
      ) {
        isCorrect =
          evaluateShortAnswer(
            answer.selectedAnswer,
            correctAnswer
          );
      }

      // ================================================
      // LONG ANSWER
      //
      // Requires instructor/admin review.
      // ================================================

      else if (
        snapshot.questionType ===
        "LONG_ANSWER"
      ) {
        needsManualReview =
          true;

        manualReviewPending +=
          1;
      }

      // ================================================
      // MANUAL REVIEW
      // ================================================

      if (
        needsManualReview
      ) {
        answer.isCorrect =
          null;

        answer.awardedMarks =
          0;

        answer.deductedMarks =
          0;

        answer.requiresManualReview =
          true;

        answer.reviewed =
          false;

        continue;
      }

      // ================================================
      // CORRECT ANSWER
      // ================================================

      if (isCorrect) {
        earnedMarks +=
          marks;

        correctAnswers += 1;

        answer.isCorrect =
          true;

        answer.awardedMarks =
          marks;

        answer.deductedMarks =
          0;

        answer.requiresManualReview =
          false;
      }

      // ================================================
      // WRONG ANSWER
      // ================================================

      else {
        wrongAnswers += 1;

        deductedMarks +=
          negativeMarks;

        answer.isCorrect =
          false;

        answer.awardedMarks =
          0;

        answer.deductedMarks =
          negativeMarks;

        answer.requiresManualReview =
          false;
      }
    }

    // ==================================================
    // SCORE
    //
    // Never allow result below 0.
    // ==================================================

    const finalScore =
      Math.max(
        0,
        earnedMarks -
          deductedMarks
      );

    // ==================================================
    // PERCENTAGE
    // ==================================================

    const totalMarks =
      Number(
        attempt.totalMarks
      ) || 0;

    const percentage =
      totalMarks > 0
        ? Number(
            (
              (
                finalScore /
                totalMarks
              ) *
              100
            ).toFixed(2)
          )
        : 0;

    // ==================================================
    // UPDATE ATTEMPT
    // ==================================================

    attempt.score =
      finalScore;

    attempt.percentage =
      percentage;

    attempt.answeredQuestions =
      answeredQuestions;

    attempt.unansweredQuestions =
      unansweredQuestions;

    attempt.correctAnswers =
      correctAnswers;

    attempt.wrongAnswers =
      wrongAnswers;

    attempt.manualReviewPending =
      manualReviewPending;

    attempt.submittedAt =
      now;

    // ==================================================
    // STATUS
    // ==================================================

    attempt.status =
      expired
        ? "AUTO_SUBMITTED"
        : "SUBMITTED";

    // ==================================================
    // RESULT STATUS
    // ==================================================

    if (
      manualReviewPending > 0
    ) {
      attempt.resultStatus =
        "PENDING_MANUAL_REVIEW";

      attempt.passed =
        null;
    } else {
      attempt.resultStatus =
        "FINAL";

      attempt.passed =
        finalScore >=
        Number(
          attempt.passingMarks ||
            0
        );
    }

    await attempt.save();

    // ==================================================
    // RESULT
    // ==================================================

    return createResultPayload(
      attempt
    );
  };

// ======================================================
// GET RESULT
// ======================================================

export const getAssessmentResult =
  async (
    attemptId,
    studentId
  ) => {
    if (
      !isValidObjectId(
        attemptId
      )
    ) {
      throw new Error(
        "Invalid attempt ID."
      );
    }

    if (
      !isValidObjectId(
        studentId
      )
    ) {
      throw new Error(
        "Invalid student ID."
      );
    }

    const attempt =
      await AssessmentAttempt.findOne({
        _id: attemptId,
        student: studentId,
      }).populate(
        "assessment",
        "title description"
      );

    if (!attempt) {
      throw new Error(
        "Assessment attempt not found."
      );
    }

    if (
      attempt.resultStatus ===
      "NOT_SUBMITTED"
    ) {
      throw new Error(
        "Assessment has not been submitted yet."
      );
    }

    return createResultPayload(
      attempt
    );
  };