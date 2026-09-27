
import mongoose from "mongoose";

import Assessment from "../models/Assessment.js";
import Question from "../models/Question.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";

import {
  evaluateAttempt,
} from "./studentEvaluationService.js";

import {
  checkStudentAssessmentEligibility,
} from "./studentAssessmentEligibilityService.js";

// ======================================================
// HELPER
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// SAFE ATTEMPT RESPONSE
// ======================================================
//
// IMPORTANT:
// Never return questionSnapshot.gradingKey to the student.
//
// gradingKey contains:
// - correctOptionIds
// - correctAnswer
//
// Those values are required by the backend for evaluation,
// but they must NEVER be exposed through student APIs.
// ======================================================

const buildSafeAttempt = (attempt) => {
  if (!attempt) {
    return null;
  }

  return {
    _id: attempt._id,

    student:
      attempt.student,

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

    expiresAt:
      attempt.expiresAt,

    submittedAt:
      attempt.submittedAt,

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

    totalQuestions:
      attempt.totalQuestions,

    answeredQuestions:
      attempt.answeredQuestions,

    correctAnswers:
      attempt.correctAnswers,

    wrongAnswers:
      attempt.wrongAnswers,

    unansweredQuestions:
      attempt.unansweredQuestions,

    manualReviewPending:
      attempt.manualReviewPending,

    createdAt:
      attempt.createdAt,

    updatedAt:
      attempt.updatedAt,
  };
};

// ======================================================
// SHUFFLE ARRAY
// ======================================================

const shuffleArray = (array) => {
  const result = [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
};

// ======================================================
// START ASSESSMENT
// ======================================================

export const startAssessment = async (
  assessmentId,
  studentId
) => {
  // ====================================================
  // VALIDATE IDS
  // ====================================================

  if (!isValidObjectId(assessmentId)) {
    throw new Error(
      "Invalid assessment ID."
    );
  }

  if (!isValidObjectId(studentId)) {
    throw new Error(
      "Invalid student ID."
    );
  }

  // ====================================================
  // FIND PUBLISHED ASSESSMENT
  // ====================================================

  const assessment =
    await Assessment.findOne({
      _id: assessmentId,
      status: "PUBLISHED",
    });

  if (!assessment) {
    throw new Error(
      "Assessment not found or is not published."
    );
  }

  // ====================================================
  // CURRENT TIME
  // ====================================================

  const now = new Date();

  // ====================================================
  // CHECK START DATE
  // ====================================================

  if (
    assessment.startDate &&
    now <
      new Date(
        assessment.startDate
      )
  ) {
    throw new Error(
      "Assessment has not started yet."
    );
  }

  // ====================================================
  // CHECK END DATE
  // ====================================================

  if (
    assessment.endDate &&
    now >
      new Date(
        assessment.endDate
      )
  ) {
    throw new Error(
      "Assessment has expired."
    );
  }

  // ====================================================
  // CHECK EXISTING IN-PROGRESS ATTEMPT
  // ====================================================

  const existingAttempt =
    await AssessmentAttempt.findOne({
      student: studentId,
      assessment: assessmentId,
      status: "IN_PROGRESS",
    }).sort({
      createdAt: -1,
    });

  // ====================================================
  // EXISTING ATTEMPT FOUND
  // ====================================================

  if (existingAttempt) {
    // ==================================================
    // STILL ACTIVE
    // ==================================================

    if (
      existingAttempt.expiresAt &&
      new Date(
        existingAttempt.expiresAt
      ) > now
    ) {
      // IMPORTANT:
      // Do NOT return the complete attempt document.
      //
      // The complete document contains:
      // questionSnapshot.gradingKey
      //
      // Return only safe attempt information.

      return buildSafeAttempt(
        existingAttempt
      );
    }

    // ==================================================
    // EXPIRED
    // ==================================================
    //
    // evaluateAttempt() will:
    // - evaluate answers
    // - calculate score
    // - calculate percentage
    // - calculate correct answers
    // - calculate wrong answers
    // - calculate unanswered answers
    // - calculate negative marking
    // - handle manual review
    // - update resultStatus
    // - update passed
    // ==================================================

    await evaluateAttempt(
      existingAttempt._id,
      studentId,
      "AUTO"
    );
  }

  // ====================================================
  // PHASE 4
  // CHECK STUDENT ASSESSMENT ASSIGNMENT
  // ====================================================
  //
  // IMPORTANT:
  //
  // A student can start an assessment ONLY when:
  //
  // 1. Assignment exists
  // 2. Assignment is not revoked
  // 3. Assignment is not expired
  // 4. availableFrom has started
  // 5. dueDate has not passed
  //
  // This prevents a student from bypassing the
  // assignment system by directly calling the API.
  // ====================================================

  const assignment =
    await checkStudentAssessmentEligibility(
      studentId,
      assessmentId
    );

  // ====================================================
  // GET PREVIOUS ATTEMPTS
  // ====================================================

  const previousAttempts =
    await AssessmentAttempt.find({
      student: studentId,
      assessment: assessmentId,
    }).sort({
      attemptNumber: 1,
    });

  // ====================================================
  // MAX ATTEMPTS
  // ====================================================
  //
  // Assignment maxAttempts takes priority.
  //
  // If assignment.maxAttempts is null,
  // assessment.maxAttempts is used.
  // ====================================================

  const completedAttempts =
    previousAttempts.filter(
      (attempt) =>
        attempt.status !==
        "IN_PROGRESS"
    ).length;

  const maxAttempts =
    Number(
      assignment.maxAttempts ??
        assessment.maxAttempts
    ) || 1;

  if (
    completedAttempts >=
    maxAttempts
  ) {
    throw new Error(
      "Maximum assessment attempts reached."
    );
  }

  // ====================================================
  // GET PUBLISHED QUESTIONS
  // ====================================================
  //
  // IMPORTANT:
  //
  // Your Question model uses:
  //
  // assessment
  //
  // NOT:
  //
  // assessmentId
  // ====================================================

  let questions =
    await Question.find({
      assessment:
        assessment._id,

      status:
        "PUBLISHED",
    })
      .sort({
        order: 1,
        _id: 1,
      })
      .lean();

  // ====================================================
  // NO QUESTIONS
  // ====================================================

  if (!questions.length) {
    throw new Error(
      "No published questions are available for this assessment."
    );
  }

  // ====================================================
  // RANDOMIZE QUESTIONS
  // ====================================================

  if (
    assessment.randomizeQuestions
  ) {
    questions =
      shuffleArray(
        questions
      );
  }

  // ====================================================
  // CREATE QUESTION SNAPSHOT
  // ====================================================
  //
  // IMPORTANT:
  //
  // This snapshot contains:
  //
  // 1. Question information for student
  // 2. Private grading information
  //
  // The grading information MUST NOT be returned
  // by student APIs.
  // ====================================================

  const questionSnapshot =
    questions.map(
      (
        question,
        index
      ) => {
        // ==============================================
        // SAFE OPTIONS
        // ==============================================

        let safeOptions = [];

        if (
          Array.isArray(
            question.options
          ) &&
          question.options.length
        ) {
          // --------------------------------------------
          // REMOVE isCorrect
          // --------------------------------------------

          safeOptions =
            question.options.map(
              (option) => ({
                _id:
                  option._id,

                text:
                  option.text,
              })
            );

          // --------------------------------------------
          // SHUFFLE OPTIONS
          // --------------------------------------------

          if (
            assessment.shuffleOptions
          ) {
            safeOptions =
              shuffleArray(
                safeOptions
              );
          }
        }

        // ==============================================
        // CORRECT OPTION IDS
        // ==============================================
        //
        // Taken from original Question model.
        //
        // These are stored privately in the attempt.
        // ==============================================

        const correctOptionIds =
          Array.isArray(
            question.options
          )
            ? question.options
                .filter(
                  (option) =>
                    option.isCorrect
                )
                .map(
                  (option) =>
                    option._id
                )
            : [];

        // ==============================================
        // EFFECTIVE NEGATIVE MARKS
        // ==============================================

        const effectiveNegativeMarks =
          assessment.negativeMarking
            ? Number(
                question.negativeMarks ||
                  assessment.negativeMarks ||
                  0
              )
            : 0;

        // ==============================================
        // RETURN SNAPSHOT
        // ==============================================

        return {
          // --------------------------------------------
          // QUESTION
          // --------------------------------------------

          question:
            question._id,

          // --------------------------------------------
          // ORDER
          // --------------------------------------------

          order:
            index + 1,

          // --------------------------------------------
          // QUESTION TEXT
          // --------------------------------------------

          questionText:
            question.questionText,

          // --------------------------------------------
          // QUESTION TYPE
          // --------------------------------------------

          questionType:
            question.questionType,

          // --------------------------------------------
          // SAFE OPTIONS
          //
          // isCorrect is NOT included here.
          // --------------------------------------------

          options:
            safeOptions,

          // --------------------------------------------
          // MARKS
          // --------------------------------------------

          marks:
            Number(
              question.marks
            ) || 0,

          // --------------------------------------------
          // NEGATIVE MARKS
          // --------------------------------------------

          negativeMarks:
            effectiveNegativeMarks,

          // --------------------------------------------
          // REQUIRED
          // --------------------------------------------

          isRequired:
            question.isRequired !==
            false,

          // ==========================================
          // PRIVATE GRADING KEY
          //
          // DO NOT RETURN THIS TO STUDENT
          // ==========================================

          gradingKey: {
            // ----------------------------------------
            // MCQ / MULTIPLE SELECT / TRUE FALSE
            // ----------------------------------------

            correctOptionIds:
              correctOptionIds,

            // ----------------------------------------
            // SHORT / LONG ANSWER
            // ----------------------------------------

            correctAnswer:
              question.correctAnswer ??
              null,
          },
        };
      }
    );

  // ====================================================
  // CALCULATE TOTAL MARKS
  // ====================================================
  //
  // We calculate this from the actual published
  // questions instead of blindly trusting
  // assessment.totalMarks.
  // ====================================================

  const calculatedTotalMarks =
    questionSnapshot.reduce(
      (
        total,
        question
      ) => {
        return (
          total +
          Number(
            question.marks || 0
          )
        );
      },
      0
    );

  // ====================================================
  // CALCULATE ATTEMPT NUMBER
  // ====================================================

  const attemptNumber =
    previousAttempts.length +
    1;

  // ====================================================
  // START TIME
  // ====================================================

  const startedAt =
    new Date();

  // ====================================================
  // DURATION
  // ====================================================

  const durationMinutes =
    Number(
      assessment.durationMinutes
    ) || 1;

  // ====================================================
  // CALCULATE DURATION EXPIRY
  // ====================================================

  const durationExpiresAt =
    new Date(
      startedAt.getTime() +
        durationMinutes *
          60 *
          1000
    );

  // ====================================================
  // CALCULATE FINAL EXPIRY TIME
  // ====================================================
  //
  // The attempt must expire at the earlier of:
  //
  // 1. Assessment duration expiry
  // 2. Assessment endDate
  // ====================================================

  let expiresAt =
    durationExpiresAt;

  if (
    assessment.endDate
  ) {
    const assessmentEndDate =
      new Date(
        assessment.endDate
      );

    if (
      assessmentEndDate <
      durationExpiresAt
    ) {
      expiresAt =
        assessmentEndDate;
    }
  }

  // ====================================================
  // CREATE ATTEMPT
  // ====================================================

  const attempt =
    await AssessmentAttempt.create({
      // ==================================================
      // STUDENT
      // ==================================================

      student:
        studentId,

      // ==================================================
      // ASSESSMENT
      // ==================================================

      assessment:
        assessment._id,

      // ==================================================
      // ATTEMPT NUMBER
      // ==================================================

      attemptNumber,

      // ==================================================
      // STATUS
      // ==================================================

      status:
        "IN_PROGRESS",

      // ==================================================
      // RESULT STATUS
      // ==================================================

      resultStatus:
        "NOT_SUBMITTED",

      // ==================================================
      // TIME
      // ==================================================

      startedAt,

      expiresAt,

      // ==================================================
      // QUESTION SNAPSHOT
      // ==================================================

      questionSnapshot,

      // ==================================================
      // ANSWERS
      // ==================================================

      answers: [],

      // ==================================================
      // MARKS
      // ==================================================

      totalMarks:
        calculatedTotalMarks,

      passingMarks:
        Number(
          assessment.passingMarks
        ) || 0,

      // ==================================================
      // QUESTION COUNTERS
      // ==================================================

      totalQuestions:
        questionSnapshot.length,

      answeredQuestions:
        0,

      correctAnswers:
        0,

      wrongAnswers:
        0,

      unansweredQuestions:
        questionSnapshot.length,

      // ==================================================
      // RESULT
      // ==================================================

      score:
        0,

      percentage:
        0,

      passed:
        null,

      // ==================================================
      // MANUAL REVIEW
      // ==================================================

      manualReviewPending:
        false,
    });

  // ====================================================
  // UPDATE ASSIGNMENT STATUS
  // ====================================================
  //
  // ASSIGNED → STARTED
  //
  // This happens only after the attempt has been
  // successfully created.
  // ====================================================

  if (
    assignment.status ===
    "ASSIGNED"
  ) {
    assignment.status =
      "STARTED";

    await assignment.save();
  }

  // ====================================================
  // RETURN CREATED ATTEMPT
  // ====================================================
  //
  // IMPORTANT:
  // Never return the raw attempt because it contains
  // questionSnapshot.gradingKey.
  // ====================================================

  return buildSafeAttempt(
    attempt
  );
};

// ======================================================
// GET MY ATTEMPTS
// ======================================================

export const getMyAttempts = async (
  assessmentId,
  studentId
) => {
  // ====================================================
  // VALIDATE ASSESSMENT ID
  // ====================================================

  if (
    !isValidObjectId(
      assessmentId
    )
  ) {
    throw new Error(
      "Invalid assessment ID."
    );
  }

  // ====================================================
  // VALIDATE STUDENT ID
  // ====================================================

  if (
    !isValidObjectId(
      studentId
    )
  ) {
    throw new Error(
      "Invalid student ID."
    );
  }

  // ====================================================
  // FIND ATTEMPTS
  // ====================================================

  const attempts =
    await AssessmentAttempt.find({
      student:
        studentId,

      assessment:
        assessmentId,
    })
      .populate(
        "assessment",
        "title durationMinutes totalMarks passingMarks maxAttempts"
      )
      .sort({
        attemptNumber:
          -1,
      })
      .lean();

  // ====================================================
  // RETURN SAFE ATTEMPTS
  // ====================================================
  //
  // IMPORTANT:
  //
  // Do not return the complete attempt documents.
  //
  // questionSnapshot contains gradingKey.
  //
  // answers may also contain:
  // - isCorrect
  // - awardedMarks
  // - deductedMarks
  // - requiresManualReview
  //
  // These should not be exposed from this endpoint.
  // ====================================================

  return attempts.map(
    (attempt) =>
      buildSafeAttempt(
        attempt
      )
  );
};

// ======================================================
// GET SINGLE ATTEMPT
// ======================================================

export const getMyAttempt = async (
  attemptId,
  studentId
) => {
  // ====================================================
  // VALIDATE ATTEMPT ID
  // ====================================================

  if (
    !isValidObjectId(
      attemptId
    )
  ) {
    throw new Error(
      "Invalid attempt ID."
    );
  }

  // ====================================================
  // VALIDATE STUDENT ID
  // ====================================================

  if (
    !isValidObjectId(
      studentId
    )
  ) {
    throw new Error(
      "Invalid student ID."
    );
  }

  // ====================================================
  // FIND ATTEMPT
  // ====================================================

  const attempt =
    await AssessmentAttempt.findOne({
      _id:
        attemptId,

      student:
        studentId,
    })
      .populate(
        "assessment",
        "title description durationMinutes totalMarks passingMarks maxAttempts"
      )
      .lean();

  // ====================================================
  // NOT FOUND
  // ====================================================

  if (!attempt) {
    throw new Error(
      "Assessment attempt not found."
    );
  }

  // ====================================================
  // RETURN SAFE ATTEMPT
  // ====================================================
  //
  // IMPORTANT:
  // Do not return raw attempt.
  //
  // The raw attempt contains private gradingKey.
  // ====================================================

  return buildSafeAttempt(
    attempt
  );
};