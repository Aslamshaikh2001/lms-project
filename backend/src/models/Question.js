import mongoose from "mongoose";


// ======================================================
// QUESTION OPTION SCHEMA
// ======================================================

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Option text is required"],
      trim: true,
      maxlength: 500,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);


// ======================================================
// QUESTION SCHEMA
// ======================================================

const questionSchema = new mongoose.Schema(
  {

    // ==================================================
    // ASSESSMENT
    // ==================================================

    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: [
        true,
        "Assessment is required",
      ],
      index: true,
    },


    // ==================================================
    // QUESTION TEXT
    // ==================================================

    questionText: {
      type: String,
      required: [
        true,
        "Question text is required",
      ],
      trim: true,
      minlength: 3,
      maxlength: 5000,
    },


    // ==================================================
    // QUESTION TYPE
    // ==================================================

    questionType: {
      type: String,
      enum: [
        "MCQ",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
        "SHORT_ANSWER",
        "LONG_ANSWER",
      ],
      required: [
        true,
        "Question type is required",
      ],
    },


    // ==================================================
    // OPTIONS
    // ==================================================

    options: {
      type: [optionSchema],
      default: [],
    },


    // ==================================================
    // CORRECT ANSWER
    //
    // Used mainly for:
    // SHORT_ANSWER
    // LONG_ANSWER
    // ==================================================

    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },


    // ==================================================
    // MARKS
    // ==================================================

    marks: {
      type: Number,
      required: [
        true,
        "Question marks are required",
      ],
      min: [
        1,
        "Marks must be at least 1",
      ],
    },


    // ==================================================
    // NEGATIVE MARKS
    // ==================================================

    negativeMarks: {
      type: Number,
      default: 0,
      min: [
        0,
        "Negative marks cannot be negative",
      ],
    },


    // ==================================================
    // EXPLANATION
    // ==================================================

    explanation: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },


    // ==================================================
    // QUESTION ORDER
    // ==================================================

    order: {
      type: Number,
      default: 0,
      min: [
        0,
        "Question order cannot be negative",
      ],
    },


    // ==================================================
    // REQUIRED QUESTION
    // ==================================================

    isRequired: {
      type: Boolean,
      default: true,
    },


    // ==================================================
    // STATUS
    // ==================================================

    status: {
      type: String,
      enum: [
        "DRAFT",
        "PUBLISHED",
        "UNPUBLISHED",
      ],
      default: "DRAFT",
    },


    // ==================================================
    // AUDIT
    // ==================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

  },

  {
    timestamps: true,
  }
);


// ======================================================
// VALIDATION
// ======================================================

questionSchema.pre(
  "validate",
  function (next) {

    // -----------------------------------------------
    // MCQ
    // -----------------------------------------------

    if (this.questionType === "MCQ") {

      if (
        !this.options ||
        this.options.length < 2
      ) {
        return next(
          new Error(
            "MCQ must have at least 2 options"
          )
        );
      }

      const correctOptions =
        this.options.filter(
          (option) =>
            option.isCorrect
        );

      if (
        correctOptions.length !== 1
      ) {
        return next(
          new Error(
            "MCQ must have exactly one correct option"
          )
        );
      }
    }


    // -----------------------------------------------
    // MULTIPLE SELECT
    // -----------------------------------------------

    if (
      this.questionType ===
      "MULTIPLE_SELECT"
    ) {

      if (
        !this.options ||
        this.options.length < 2
      ) {
        return next(
          new Error(
            "Multiple select question must have at least 2 options"
          )
        );
      }

      const correctOptions =
        this.options.filter(
          (option) =>
            option.isCorrect
        );

      if (
        correctOptions.length < 1
      ) {
        return next(
          new Error(
            "Multiple select question must have at least one correct option"
          )
        );
      }
    }


    // -----------------------------------------------
    // TRUE / FALSE
    // -----------------------------------------------

    if (
      this.questionType ===
      "TRUE_FALSE"
    ) {

      if (
        !this.options ||
        this.options.length !== 2
      ) {
        return next(
          new Error(
            "True/False question must have exactly 2 options"
          )
        );
      }

      const correctOptions =
        this.options.filter(
          (option) =>
            option.isCorrect
        );

      if (
        correctOptions.length !== 1
      ) {
        return next(
          new Error(
            "True/False question must have exactly one correct option"
          )
        );
      }
    }


    // -----------------------------------------------
    // SHORT ANSWER
    // -----------------------------------------------

    if (
      this.questionType ===
      "SHORT_ANSWER"
    ) {

      if (
        this.correctAnswer ===
          null ||
        this.correctAnswer ===
          undefined ||
        this.correctAnswer === ""
      ) {
        return next(
          new Error(
            "Correct answer is required for short answer question"
          )
        );
      }
    }


    // -----------------------------------------------
    // LONG ANSWER
    // -----------------------------------------------

    if (
      this.questionType ===
      "LONG_ANSWER"
    ) {

      // Long answer can optionally
      // have a reference answer.
      if (
        this.correctAnswer !== null &&
        this.correctAnswer !== undefined &&
        typeof this.correctAnswer !== "string"
      ) {
        return next(
          new Error(
            "Long answer correct answer must be text"
          )
        );
      }
    }


    // -----------------------------------------------
    // NEGATIVE MARKS
    // -----------------------------------------------

    if (
      this.negativeMarks >
      this.marks
    ) {
      return next(
        new Error(
          "Negative marks cannot be greater than question marks"
        )
      );
    }


    next();
  }
);


// ======================================================
// INDEX
// ======================================================

questionSchema.index({
  assessment: 1,
  order: 1,
});

questionSchema.index({
  status: 1,
});


// ======================================================
// MODEL
// ======================================================

const Question =
  mongoose.model(
    "Question",
    questionSchema
  );


export default Question;