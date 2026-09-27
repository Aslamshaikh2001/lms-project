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