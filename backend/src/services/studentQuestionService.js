import mongoose from "mongoose";

import AssessmentAttempt from "../models/AssessmentAttempt.js";

// ======================================================
// VALIDATE ID
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// CHECK ATTEMPT
// ======================================================

const getValidAttempt = async (
  attemptId,
  studentId
) => {
  // ====================================================
  // VALIDATE ATTEMPT ID
  // ====================================================

  if (!isValidObjectId(attemptId)) {
    throw new Error(
      "Invalid attempt ID."
    );
  }

  // ====================================================
  // VALIDATE STUDENT ID
  // ====================================================

  if (!isValidObjectId(studentId)) {
    throw new Error(
      "Invalid student ID."
    );
  }

  // ====================================================
  // FIND ATTEMPT
  // ====================================================

  const attempt =
    await AssessmentAttempt.findOne({
      _id: attemptId,

      student: studentId,
    });

  // ====================================================
  // ATTEMPT NOT FOUND
  // ====================================================

  if (!attempt) {
    throw new Error(
      "Assessment attempt not found."
    );
  }

  // ====================================================
  // CHECK ATTEMPT STATUS
  // ====================================================

  if (
    attempt.status !==
    "IN_PROGRESS"
  ) {
    throw new Error(
      "This assessment attempt is no longer active."
    );
  }

  // ====================================================
  // CHECK EXPIRY
  //
  // IMPORTANT:
  //
  // We DO NOT mark the attempt AUTO_SUBMITTED here.
  //
  // Step 6 submission/evaluation service is responsible
  // for evaluating and saving the final result.
  // ====================================================

  const now = new Date();

  if (
    attempt.expiresAt &&
    now >=
      new Date(
        attempt.expiresAt
      )
  ) {
    const error =
      new Error(
        "Assessment time has expired."
      );

    // --------------------------------------------------
    // CUSTOM ERROR CODE
    // --------------------------------------------------

    error.code =
      "ATTEMPT_EXPIRED";

    throw error;
  }

  // ====================================================
  // RETURN VALID ATTEMPT
  // ====================================================

  return attempt;
};

// ======================================================
// GET ATTEMPT QUESTIONS
// ======================================================

export const getAttemptQuestions =
  async (
    attemptId,
    studentId
  ) => {
    // ==================================================
    // GET VALID ATTEMPT
    // ==================================================

    const attempt =
      await getValidAttempt(
        attemptId,
        studentId
      );

    // ==================================================
    // GET SAVED ANSWERS
    // ==================================================

    const answers =
      attempt.answers || [];

    // ==================================================
    // CREATE STUDENT-SAFE QUESTIONS
    //
    // IMPORTANT:
    //
    // We intentionally DO NOT return:
    //
    // gradingKey
    // correctOptionIds
    // correctAnswer
    // isCorrect
    //
    // Student must never receive correct answers.
    // ==================================================

    const questions =
      attempt.questionSnapshot.map(
        (
          question,
          index
        ) => {
          // ==========================================
          // FIND SAVED ANSWER
          // ==========================================

          const savedAnswer =
            answers.find(
              (answer) =>
                String(
                  answer.question
                ) ===
                String(
                  question.question
                )
            );

          // ==========================================
          // RETURN SAFE QUESTION
          // ==========================================

          return {
            // ----------------------------------------
            // QUESTION ID
            // ----------------------------------------

            _id:
              question.question,

            // ----------------------------------------
            // QUESTION TEXT
            // ----------------------------------------

            questionText:
              question.questionText,

            // ----------------------------------------
            // QUESTION TYPE
            // ----------------------------------------

            questionType:
              question.questionType,

            // ----------------------------------------
            // OPTIONS
            //
            // Only _id and text are present.
            //
            // isCorrect is NOT returned.
            // ----------------------------------------

            options:
              question.options ||
              [],

            // ----------------------------------------
            // MARKS
            // ----------------------------------------

            marks:
              question.marks,

            // ----------------------------------------
            // NEGATIVE MARKS
            // ----------------------------------------

            negativeMarks:
              question.negativeMarks ||
              0,

            // ----------------------------------------
            // REQUIRED
            // ----------------------------------------

            isRequired:
              question.isRequired !==
              false,

            // ----------------------------------------
            // QUESTION ORDER
            // ----------------------------------------

            order:
              question.order ||
              index + 1,

            // ----------------------------------------
            // STUDENT'S SAVED ANSWER
            // ----------------------------------------

            selectedAnswer:
              savedAnswer
                ? savedAnswer.selectedAnswer
                : null,

            // ----------------------------------------
            // ANSWERED TIME
            // ----------------------------------------

            answeredAt:
              savedAnswer
                ? savedAnswer.answeredAt
                : null,
          };
        }
      );

    // ==================================================
    // RETURN
    // ==================================================

    return {
      // =================================================
      // ATTEMPT INFORMATION
      // =================================================

      attempt: {
        _id:
          attempt._id,

        assessment:
          attempt.assessment,

        attemptNumber:
          attempt.attemptNumber,

        status:
          attempt.status,

        startedAt:
          attempt.startedAt,

        expiresAt:
          attempt.expiresAt,

        totalQuestions:
          attempt.totalQuestions,

        answeredQuestions:
          attempt.answeredQuestions,

        unansweredQuestions:
          attempt.unansweredQuestions,
      },

      // =================================================
      // QUESTIONS
      // =================================================

      questions,
    };
  };

// ======================================================
// SAVE ANSWER
// ======================================================

export const saveAnswer = async (
  attemptId,
  studentId,
  questionId,
  selectedAnswer
) => {
  // ====================================================
  // GET VALID ATTEMPT
  // ====================================================

  const attempt =
    await getValidAttempt(
      attemptId,
      studentId
    );

  // ====================================================
  // VALIDATE QUESTION ID
  // ====================================================

  if (
    !isValidObjectId(
      questionId
    )
  ) {
    throw new Error(
      "Invalid question ID."
    );
  }

  // ====================================================
  // FIND QUESTION IN ATTEMPT
  // ====================================================

  const question =
    attempt.questionSnapshot.find(
      (item) =>
        String(
          item.question
        ) ===
        String(
          questionId
        )
    );

  // ====================================================
  // QUESTION NOT FOUND
  // ====================================================

  if (!question) {
    throw new Error(
      "Question does not belong to this assessment attempt."
    );
  }

  // ====================================================
  // MCQ
  // ====================================================

  if (
    question.questionType ===
      "MCQ" ||
    question.questionType ===
      "TRUE_FALSE"
  ) {
    // -----------------------------------------------
    // NULL / EMPTY ANSWER IS ALLOWED
    // -----------------------------------------------

    if (
      selectedAnswer !==
        null &&
      selectedAnswer !==
        undefined &&
      selectedAnswer !== ""
    ) {
      const optionExists =
        question.options.some(
          (option) =>
            String(
              option._id
            ) ===
            String(
              selectedAnswer
            )
        );

      if (!optionExists) {
        throw new Error(
          "Invalid option selected."
        );
      }
    }
  }

  // ====================================================
  // MULTIPLE SELECT
  // ====================================================

  if (
    question.questionType ===
    "MULTIPLE_SELECT"
  ) {
    // -----------------------------------------------
    // ANSWER CAN BE EMPTY
    // -----------------------------------------------

    if (
      selectedAnswer !==
        null &&
      selectedAnswer !==
        undefined &&
      selectedAnswer !== ""
    ) {
      // ---------------------------------------------
      // MUST BE ARRAY
      // ---------------------------------------------

      if (
        !Array.isArray(
          selectedAnswer
        )
      ) {
        throw new Error(
          "Multiple select answer must be an array."
        );
      }

      // ---------------------------------------------
      // REMOVE DUPLICATE OPTION IDS
      // ---------------------------------------------

      const uniqueSelectedAnswers =
        [
          ...new Set(
            selectedAnswer.map(
              (answerId) =>
                String(
                  answerId
                )
            )
          ),
        ];

      // ---------------------------------------------
      // ALL OPTIONS MUST EXIST
      // ---------------------------------------------

      const allValid =
        uniqueSelectedAnswers.every(
          (answerId) =>
            question.options.some(
              (option) =>
                String(
                  option._id
                ) ===
                String(
                  answerId
                )
            )
        );

      if (!allValid) {
        throw new Error(
          "One or more selected options are invalid."
        );
      }

      // ---------------------------------------------
      // STORE CLEAN ARRAY
      // ---------------------------------------------

      selectedAnswer =
        uniqueSelectedAnswers;
    }
  }

  // ====================================================
  // SHORT / LONG ANSWER
  // ====================================================

  if (
    question.questionType ===
      "SHORT_ANSWER" ||
    question.questionType ===
      "LONG_ANSWER"
  ) {
    // -----------------------------------------------
    // TEXT MUST BE STRING
    // -----------------------------------------------

    if (
      selectedAnswer !==
        null &&
      selectedAnswer !==
        undefined &&
      typeof selectedAnswer !==
        "string"
    ) {
      throw new Error(
        "Text answer must be a string."
      );
    }
  }

  // ====================================================
  // FIND EXISTING ANSWER
  // ====================================================

  const existingIndex =
    attempt.answers.findIndex(
      (answer) =>
        String(
          answer.question
        ) ===
        String(
          questionId
        )
    );

  // ====================================================
  // CHECK EMPTY ANSWER
  // ====================================================

  const isEmptyAnswer =
    selectedAnswer ===
      null ||
    selectedAnswer ===
      undefined ||
    selectedAnswer ===
      "" ||
    (
      Array.isArray(
        selectedAnswer
      ) &&
      selectedAnswer.length ===
        0
    );

  // ====================================================
  // REMOVE ANSWER
  // ====================================================

  if (isEmptyAnswer) {
    if (
      existingIndex !==
      -1
    ) {
      attempt.answers.splice(
        existingIndex,
        1
      );
    }
  }

  // ====================================================
  // UPDATE EXISTING ANSWER
  // ====================================================

  else if (
    existingIndex !==
    -1
  ) {
    attempt.answers[
      existingIndex
    ].selectedAnswer =
      selectedAnswer;

    attempt.answers[
      existingIndex
    ].answeredAt =
      new Date();

    // -----------------------------------------------
    // RESET EVALUATION DATA
    //
    // If answer was previously evaluated, changing
    // the answer while attempt is active must reset
    // those fields.
    // -----------------------------------------------

    attempt.answers[
      existingIndex
    ].isCorrect =
      null;

    attempt.answers[
      existingIndex
    ].awardedMarks =
      0;

    attempt.answers[
      existingIndex
    ].deductedMarks =
      0;

    attempt.answers[
      existingIndex
    ].requiresManualReview =
      false;

    attempt.answers[
      existingIndex
    ].reviewed =
      false;
  }

  // ====================================================
  // CREATE NEW ANSWER
  // ====================================================

  else {
    attempt.answers.push({
      question:
        question.question,

      selectedAnswer,

      answeredAt:
        new Date(),

      // -----------------------------------------------
      // NOT YET EVALUATED
      // -----------------------------------------------

      isCorrect:
        null,

      awardedMarks:
        0,

      deductedMarks:
        0,

      requiresManualReview:
        false,

      reviewed:
        false,
    });
  }

  // ====================================================
  // UPDATE ANSWERED COUNT
  // ====================================================

  attempt.answeredQuestions =
    attempt.answers.length;

  // ====================================================
  // UPDATE UNANSWERED COUNT
  // ====================================================

  attempt.unansweredQuestions =
    Math.max(
      0,
      attempt.totalQuestions -
        attempt.answeredQuestions
    );

  // ====================================================
  // SAVE
  // ====================================================

  await attempt.save();

  // ====================================================
  // RETURN
  // ====================================================

  return {
    questionId,

    selectedAnswer,

    answeredQuestions:
      attempt.answeredQuestions,

    unansweredQuestions:
      attempt.unansweredQuestions,

    savedAt:
      new Date(),
  };
};