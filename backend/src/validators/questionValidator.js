import { body } from "express-validator";


// ======================================================
// CREATE VALIDATOR
// ======================================================

export const validateCreateQuestion = [

  body("assessment")
    .notEmpty()
    .withMessage(
      "Assessment is required"
    )
    .isMongoId()
    .withMessage(
      "Invalid assessment ID"
    ),


  body("questionText")
    .trim()
    .notEmpty()
    .withMessage(
      "Question text is required"
    )
    .isLength({
      min: 3,
      max: 5000,
    })
    .withMessage(
      "Question text must be between 3 and 5000 characters"
    ),


  body("questionType")
    .notEmpty()
    .withMessage(
      "Question type is required"
    )
    .isIn([
      "MCQ",
      "MULTIPLE_SELECT",
      "TRUE_FALSE",
      "SHORT_ANSWER",
      "LONG_ANSWER",
    ])
    .withMessage(
      "Invalid question type"
    ),


  body("marks")
    .notEmpty()
    .withMessage(
      "Marks are required"
    )
    .isNumeric()
    .withMessage(
      "Marks must be a number"
    )
    .custom(
      (value) => Number(value) >= 1
    )
    .withMessage(
      "Marks must be at least 1"
    ),


  body("negativeMarks")
    .optional()
    .isNumeric()
    .withMessage(
      "Negative marks must be a number"
    )
    .custom(
      (value) => Number(value) >= 0
    )
    .withMessage(
      "Negative marks cannot be negative"
    ),


  body("order")
    .optional()
    .isNumeric()
    .withMessage(
      "Order must be a number"
    ),


  body("isRequired")
    .optional()
    .isBoolean()
    .withMessage(
      "isRequired must be boolean"
    ),

];


// ======================================================
// UPDATE VALIDATOR
// ======================================================

export const validateUpdateQuestion = [

  body("assessment")
    .optional()
    .isMongoId()
    .withMessage(
      "Invalid assessment ID"
    ),


  body("questionText")
    .optional()
    .trim()
    .isLength({
      min: 3,
      max: 5000,
    })
    .withMessage(
      "Question text must be between 3 and 5000 characters"
    ),


  body("questionType")
    .optional()
    .isIn([
      "MCQ",
      "MULTIPLE_SELECT",
      "TRUE_FALSE",
      "SHORT_ANSWER",
      "LONG_ANSWER",
    ])
    .withMessage(
      "Invalid question type"
    ),


  body("marks")
    .optional()
    .isNumeric()
    .withMessage(
      "Marks must be a number"
    )
    .custom(
      (value) => Number(value) >= 1
    )
    .withMessage(
      "Marks must be at least 1"
    ),


  body("negativeMarks")
    .optional()
    .isNumeric()
    .withMessage(
      "Negative marks must be a number"
    )
    .custom(
      (value) => Number(value) >= 0
    )
    .withMessage(
      "Negative marks cannot be negative"
    ),


  body("order")
    .optional()
    .isNumeric()
    .withMessage(
      "Order must be a number"
    ),

];