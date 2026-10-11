import mongoose from "mongoose";

import Question from "../models/Question.js";
import Assessment from "../models/Assessment.js";


// ======================================================
// GET USER ID
// ======================================================

const normalizeData = (data) => {

  const cleaned = {
    ...data,
  };

  delete cleaned._id;
  delete cleaned.createdBy;
  delete cleaned.updatedBy;

  return cleaned;
};


// ======================================================
// CREATE QUESTION
// ======================================================

export const createQuestion =
  async (
    data,
    userId
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        data.assessment
      )
    ) {
      throw new Error(
        "Invalid assessment ID"
      );
    }


    const assessment =
      await Assessment.findById(
        data.assessment
      );

    if (!assessment) {
      throw new Error(
        "Assessment not found"
      );
    }


    const cleanedData =
      normalizeData(data);


    const question =
      await Question.create({
        ...cleanedData,
        createdBy: userId,
      });


    return Question.findById(
      question._id
    )
      .populate(
        "assessment",
        "title status"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "updatedBy",
        "name email"
      );
  };


// ======================================================
// GET ALL QUESTIONS
// ======================================================

export const getQuestions =
  async (
    filters = {}
  ) => {

    const {
      search = "",
      assessment,
      questionType,
      status,
      page = 1,
      limit = 10,
    } = filters;


    const query = {};


    // -----------------------------------------------
    // SEARCH
    // -----------------------------------------------

    if (
      search &&
      typeof search === "string"
    ) {

      query.questionText = {
        $regex: search,
        $options: "i",
      };
    }


    // -----------------------------------------------
    // ASSESSMENT FILTER
    // -----------------------------------------------

    if (
      assessment &&
      assessment !== ""
    ) {

      if (
        !mongoose.Types.ObjectId.isValid(
          assessment
        )
      ) {
        throw new Error(
          "Invalid assessment ID"
        );
      }

      query.assessment =
        assessment;
    }


    // -----------------------------------------------
    // TYPE FILTER
    // -----------------------------------------------

    if (
      questionType &&
      questionType !== ""
    ) {

      const allowedTypes = [
        "MCQ",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
        "SHORT_ANSWER",
        "LONG_ANSWER",
      ];

      if (
        allowedTypes.includes(
          questionType
        )
      ) {
        query.questionType =
          questionType;
      }
    }


    // -----------------------------------------------
    // STATUS FILTER
    // -----------------------------------------------

    if (
      status &&
      status !== ""
    ) {

      const allowedStatuses = [
        "DRAFT",
        "PUBLISHED",
        "UNPUBLISHED",
      ];

      if (
        allowedStatuses.includes(
          status
        )
      ) {
        query.status =
          status;
      }
    }


    // -----------------------------------------------
    // PAGINATION
    // -----------------------------------------------

    const currentPage =
      Math.max(
        parseInt(page, 10) || 1,
        1
      );


    const perPage =
      Math.min(
        Math.max(
          parseInt(limit, 10) || 10,
          1
        ),
        100
      );


    const skip =
      (currentPage - 1) *
      perPage;


    // -----------------------------------------------
    // DATABASE
    // -----------------------------------------------

    const [
      questions,
      total,
    ] = await Promise.all([

      Question.find(query)
        .populate(
          "assessment",
          "title status"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "updatedBy",
          "name email"
        )
        .sort({
          assessment: 1,
          order: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Question.countDocuments(
        query
      ),
    ]);


    return {

      questions,

      pagination: {

        total,

        page: currentPage,

        limit: perPage,

        totalPages:
          total === 0
            ? 0
            : Math.ceil(
                total / perPage
              ),

      },

    };
  };


// ======================================================
// GET QUESTION BY ID
// ======================================================

export const getQuestionById =
  async (
    id
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      throw new Error(
        "Invalid question ID"
      );
    }


    const question =
      await Question.findById(
        id
      )
        .populate(
          "assessment",
          "title status"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "updatedBy",
          "name email"
        );


    if (!question) {
      throw new Error(
        "Question not found"
      );
    }


    return question;
  };


// ======================================================
// UPDATE QUESTION
// ======================================================

export const updateQuestion =
  async (
    id,
    data,
    userId
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      throw new Error(
        "Invalid question ID"
      );
    }


    const question =
      await Question.findById(
        id
      );


    if (!question) {
      throw new Error(
        "Question not found"
      );
    }


    const cleanedData =
      normalizeData(data);


    // -----------------------------------------------
    // STATUS IS UPDATED USING SEPARATE API
    // -----------------------------------------------

    delete cleanedData.status;


    // -----------------------------------------------
    // ASSESSMENT VALIDATION
    // -----------------------------------------------

    if (
      cleanedData.assessment
    ) {

      if (
        !mongoose.Types.ObjectId.isValid(
          cleanedData.assessment
        )
      ) {
        throw new Error(
          "Invalid assessment ID"
        );
      }


      const assessment =
        await Assessment.findById(
          cleanedData.assessment
        );


      if (!assessment) {
        throw new Error(
          "Assessment not found"
        );
      }
    }


    Object.assign(
      question,
      cleanedData
    );


    question.updatedBy =
      userId;


    await question.save();


    return Question.findById(
      question._id
    )
      .populate(
        "assessment",
        "title status"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "updatedBy",
        "name email"
      );
  };


// ======================================================
// DELETE QUESTION
// ======================================================

export const deleteQuestion =
  async (
    id
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      throw new Error(
        "Invalid question ID"
      );
    }


    const question =
      await Question.findById(
        id
      );


    if (!question) {
      throw new Error(
        "Question not found"
      );
    }


    await Question.findByIdAndDelete(
      id
    );


    return {
      message:
        "Question deleted successfully",
    };
  };


// ======================================================
// PUBLISH QUESTION
// ======================================================

export const publishQuestion =
  async (
    id,
    userId
  ) => {

    const question =
      await getQuestionById(
        id
      );


    // -----------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------

    if (
      !question.questionText
    ) {
      throw new Error(
        "Question text is required before publishing"
      );
    }


    if (
      !question.questionType
    ) {
      throw new Error(
        "Question type is required before publishing"
      );
    }


    if (
      !question.marks
    ) {
      throw new Error(
        "Question marks are required before publishing"
      );
    }


    question.status =
      "PUBLISHED";

    question.updatedBy =
      userId;


    await question.save();


    return question;
  };


// ======================================================
// UNPUBLISH QUESTION
// ======================================================

export const unpublishQuestion =
  async (
    id,
    userId
  ) => {

    const question =
      await getQuestionById(
        id
      );


    question.status =
      "UNPUBLISHED";

    question.updatedBy =
      userId;


    await question.save();


    return question;
  };


// ======================================================
// GET QUESTIONS BY ASSESSMENT
// ======================================================

export const getQuestionsByAssessment =
  async (
    assessmentId
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        assessmentId
      )
    ) {
      throw new Error(
        "Invalid assessment ID"
      );
    }


    const assessment =
      await Assessment.findById(
        assessmentId
      );


    if (!assessment) {
      throw new Error(
        "Assessment not found"
      );
    }


    return Question.find({
      assessment:
        assessmentId,
    })
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "updatedBy",
        "name email"
      )
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean();
  };




  
/**
 * ======================================================
 * BULK IMPORT QUESTIONS
 * ======================================================
 *
 * Supports:
 * MCQ, MULTIPLE_SELECT, TRUE_FALSE,
 * SHORT_ANSWER, LONG_ANSWER
 *
 * Duplicate rule:
 * Same normalized question text within the same assessment.
 *
 * Expected input:
 * assessmentId: MongoDB assessment ID
 * questions: Array of question objects
 * userId: Authenticated user ID
 */

export const bulkImportQuestions = async (
  assessmentId,
  questions,
  userId
) => {
  if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
    throw new Error("Invalid assessment ID");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Valid authenticated user ID is required");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Please provide at least one question");
  }

  if (questions.length > 500) {
    throw new Error("You can import a maximum of 500 questions at a time");
  }

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  const allowedTypes = [
    "MCQ",
    "MULTIPLE_SELECT",
    "TRUE_FALSE",
    "SHORT_ANSWER",
    "LONG_ANSWER",
  ];

  // Normalize text for duplicate detection.
  const normalizeQuestionText = (value) =>
    String(value ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  // Load existing questions for this assessment.
  const existingQuestions = await Question.find({
    assessment: assessmentId,
  })
    .select("questionText")
    .lean();

  const knownQuestions = new Set(
    existingQuestions.map((question) =>
      normalizeQuestionText(question.questionText)
    )
  );

  const imported = [];
  const duplicates = [];
  const invalid = [];

  for (let index = 0; index < questions.length; index += 1) {
    const rowNumber = index + 1;
    const input = questions[index];

    try {
      if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new Error("Question row must be an object");
      }

      const questionText = String(input.questionText ?? "").trim();
      const normalizedText = normalizeQuestionText(questionText);

      if (!normalizedText) {
        throw new Error("Question text is required");
      }

      if (!allowedTypes.includes(input.questionType)) {
        throw new Error(
          `Invalid question type. Allowed types: ${allowedTypes.join(", ")}`
        );
      }

      // Skip existing questions and repeated questions in this import.
      if (knownQuestions.has(normalizedText)) {
        duplicates.push({
          row: rowNumber,
          questionText,
          reason: "Duplicate question in this assessment",
        });
        continue;
      }

      const marks = Number(input.marks ?? 1);
      const negativeMarks = Number(input.negativeMarks ?? 0);
      const order =
        input.order === undefined || input.order === null || input.order === ""
          ? 0
          : Number(input.order);

      if (!Number.isFinite(marks) || marks < 1) {
        throw new Error("Marks must be a number greater than or equal to 1");
      }

      if (!Number.isFinite(negativeMarks) || negativeMarks < 0) {
        throw new Error("Negative marks must be a non-negative number");
      }

      if (negativeMarks > marks) {
        throw new Error("Negative marks cannot exceed marks");
      }

      if (!Number.isFinite(order) || order < 0) {
        throw new Error("Order must be a non-negative number");
      }

      const options = Array.isArray(input.options)
        ? input.options.map((option) => ({
            text: String(option?.text ?? "").trim(),
            isCorrect: option?.isCorrect === true,
          }))
        : [];

      const correctAnswer = input.correctAnswer ?? null;

      // Validate text-answer questions before model validation.
      if (
        input.questionType === "SHORT_ANSWER" &&
        !String(correctAnswer ?? "").trim()
      ) {
        throw new Error("Correct answer is required for SHORT_ANSWER");
      }

      if (
        input.questionType === "LONG_ANSWER" &&
        correctAnswer !== null &&
        typeof correctAnswer !== "string"
      ) {
        throw new Error("LONG_ANSWER correct answer must be text");
      }

      // Validate the full question using the existing Mongoose schema
      // and its pre-validation hook.
      const question = new Question({
        assessment: assessmentId,
        questionText,
        questionType: input.questionType,
        options,
        correctAnswer,
        marks,
        negativeMarks,
        explanation: String(input.explanation ?? "").trim(),
        order,
        isRequired:
          input.isRequired === undefined ? true : input.isRequired,
        status: "DRAFT",
        createdBy: userId,
      });

      await question.validate();
      await question.save();

      // Prevent duplicates later in this same import.
      knownQuestions.add(normalizedText);

      imported.push({
        row: rowNumber,
        questionId: question._id,
        questionText: question.questionText,
      });
    } catch (error) {
      invalid.push({
        row: rowNumber,
        questionText: String(input?.questionText ?? ""),
        reason: error.message || "Question validation failed",
      });
    }
  }

  return {
    assessment: assessmentId,
    summary: {
      total: questions.length,
      imported: imported.length,
      duplicatesSkipped: duplicates.length,
      invalid: invalid.length,
    },
    imported,
    duplicates,
    invalid,
  };
};
