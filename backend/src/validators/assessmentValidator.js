// import mongoose from "mongoose";


// // ========================================
// // VALIDATE OBJECT ID
// // ========================================

// const validateObjectId = (
//   value,
//   fieldName
// ) => {
//   if (
//     value !== undefined &&
//     value !== null &&
//     value !== "" &&
//     !mongoose.Types.ObjectId.isValid(value)
//   ) {
//     return `${fieldName} must be a valid ID`;
//   }

//   return null;
// };


// // ========================================
// // CREATE ASSESSMENT VALIDATION
// // ========================================

// export const validateCreateAssessment = (
//   req,
//   res,
//   next
// ) => {

//   const {
//     title,
//     description,
//     course,
//     category,
//     durationMinutes,
//     totalMarks,
//     passingMarks,
//     maxAttempts,
//     randomizeQuestions,
//     shuffleOptions,
//     negativeMarking,
//     negativeMarks,
//     startDate,
//     endDate,
//     instructions,
//   } = req.body;


//   const errors = [];


//   // ======================================
//   // TITLE
//   // ======================================

//   if (
//     !title ||
//     typeof title !== "string" ||
//     !title.trim()
//   ) {
//     errors.push(
//       "Assessment title is required"
//     );
//   }

//   if (
//     title &&
//     typeof title === "string" &&
//     title.trim().length < 3
//   ) {
//     errors.push(
//       "Assessment title must be at least 3 characters"
//     );
//   }

//   if (
//     title &&
//     typeof title === "string" &&
//     title.trim().length > 150
//   ) {
//     errors.push(
//       "Assessment title cannot exceed 150 characters"
//     );
//   }


//   // ======================================
//   // COURSE
//   // ======================================

//   if (!course) {

//     errors.push(
//       "Course is required"
//     );

//   } else {

//     const error =
//       validateObjectId(
//         course,
//         "Course"
//       );

//     if (error) {
//       errors.push(error);
//     }
//   }


//   // ======================================
//   // CATEGORY
//   // ======================================

//   if (category) {

//     const error =
//       validateObjectId(
//         category,
//         "Category"
//       );

//     if (error) {
//       errors.push(error);
//     }
//   }


//   // ======================================
//   // DURATION
//   // ======================================

//   if (
//     durationMinutes === undefined ||
//     durationMinutes === null ||
//     durationMinutes === ""
//   ) {

//     errors.push(
//       "Duration is required"
//     );

//   } else if (
//     !Number.isInteger(
//       Number(durationMinutes)
//     ) ||
//     Number(durationMinutes) < 1 ||
//     Number(durationMinutes) > 600
//   ) {

//     errors.push(
//       "Duration must be between 1 and 600 minutes"
//     );
//   }


//   // ======================================
//   // TOTAL MARKS
//   // ======================================

//   if (
//     totalMarks === undefined ||
//     totalMarks === null ||
//     totalMarks === ""
//   ) {

//     errors.push(
//       "Total marks are required"
//     );

//   } else if (
//     !Number.isFinite(
//       Number(totalMarks)
//     ) ||
//     Number(totalMarks) <= 0
//   ) {

//     errors.push(
//       "Total marks must be greater than 0"
//     );
//   }


//   // ======================================
//   // PASSING MARKS
//   // ======================================

//   if (
//     passingMarks === undefined ||
//     passingMarks === null ||
//     passingMarks === ""
//   ) {

//     errors.push(
//       "Passing marks are required"
//     );

//   } else if (
//     !Number.isFinite(
//       Number(passingMarks)
//     ) ||
//     Number(passingMarks) < 0
//   ) {

//     errors.push(
//       "Passing marks cannot be negative"
//     );
//   }


//   // ======================================
//   // PASSING MARKS <= TOTAL MARKS
//   // ======================================

//   if (
//     totalMarks !== undefined &&
//     passingMarks !== undefined &&
//     totalMarks !== "" &&
//     passingMarks !== "" &&
//     Number(passingMarks) >
//       Number(totalMarks)
//   ) {

//     errors.push(
//       "Passing marks cannot be greater than total marks"
//     );
//   }


//   // ======================================
//   // MAX ATTEMPTS
//   // ======================================

//   if (
//     maxAttempts !== undefined &&
//     maxAttempts !== null &&
//     maxAttempts !== ""
//   ) {

//     if (
//       !Number.isInteger(
//         Number(maxAttempts)
//       ) ||
//       Number(maxAttempts) < 1 ||
//       Number(maxAttempts) > 10
//     ) {

//       errors.push(
//         "Maximum attempts must be between 1 and 10"
//       );
//     }
//   }


//   // ======================================
//   // NEGATIVE MARKING
//   // ======================================

//   if (negativeMarking === true) {

//     if (
//       negativeMarks === undefined ||
//       negativeMarks === null ||
//       negativeMarks === ""
//     ) {

//       errors.push(
//         "Negative marks are required when negative marking is enabled"
//       );

//     } else if (
//       !Number.isFinite(
//         Number(negativeMarks)
//       ) ||
//       Number(negativeMarks) < 0
//     ) {

//       errors.push(
//         "Negative marks cannot be negative"
//       );
//     }
//   }


//   // ======================================
//   // START DATE
//   // ======================================

//   if (
//     startDate &&
//     isNaN(Date.parse(startDate))
//   ) {

//     errors.push(
//       "Invalid start date"
//     );
//   }


//   // ======================================
//   // END DATE
//   // ======================================

//   if (
//     endDate &&
//     isNaN(Date.parse(endDate))
//   ) {

//     errors.push(
//       "Invalid end date"
//     );
//   }


//   // ======================================
//   // DATE RANGE
//   // ======================================

//   if (
//     startDate &&
//     endDate &&
//     !isNaN(Date.parse(startDate)) &&
//     !isNaN(Date.parse(endDate))
//   ) {

//     const start =
//       new Date(startDate);

//     const end =
//       new Date(endDate);

//     if (end <= start) {

//       errors.push(
//         "End date must be after start date"
//       );
//     }
//   }


//   // ======================================
//   // DESCRIPTION
//   // ======================================

//   if (
//     description !== undefined &&
//     description !== null
//   ) {

//     if (
//       typeof description !== "string"
//     ) {

//       errors.push(
//         "Description must be a string"
//       );

//     } else if (
//       description.length > 1000
//     ) {

//       errors.push(
//         "Description cannot exceed 1000 characters"
//       );
//     }
//   }


//   // ======================================
//   // INSTRUCTIONS
//   // ======================================

//   if (
//     instructions !== undefined &&
//     instructions !== null
//   ) {

//     if (
//       typeof instructions !== "string"
//     ) {

//       errors.push(
//         "Instructions must be a string"
//       );

//     } else if (
//       instructions.length > 3000
//     ) {

//       errors.push(
//         "Instructions cannot exceed 3000 characters"
//       );
//     }
//   }


//   // ======================================
//   // BOOLEAN VALIDATION
//   // ======================================

//   if (
//     randomizeQuestions !== undefined &&
//     typeof randomizeQuestions !== "boolean"
//   ) {

//     errors.push(
//       "randomizeQuestions must be a boolean"
//     );
//   }


//   if (
//     shuffleOptions !== undefined &&
//     typeof shuffleOptions !== "boolean"
//   ) {

//     errors.push(
//       "shuffleOptions must be a boolean"
//     );
//   }


//   if (
//     negativeMarking !== undefined &&
//     typeof negativeMarking !== "boolean"
//   ) {

//     errors.push(
//       "negativeMarking must be a boolean"
//     );
//   }


//   // ======================================
//   // RETURN VALIDATION ERRORS
//   // ======================================

//   if (errors.length > 0) {

//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors,
//     });
//   }


//   next();
// };


// // ========================================
// // UPDATE ASSESSMENT VALIDATION
// // ========================================

// export const validateUpdateAssessment = (
//   req,
//   res,
//   next
// ) => {

//   const {
//     title,
//     course,
//     category,
//     durationMinutes,
//     totalMarks,
//     passingMarks,
//     maxAttempts,
//     randomizeQuestions,
//     shuffleOptions,
//     negativeMarking,
//     negativeMarks,
//     startDate,
//     endDate,
//     description,
//     instructions,
//   } = req.body;


//   const errors = [];


//   // ======================================
//   // TITLE
//   // ======================================

//   if (title !== undefined) {

//     if (
//       typeof title !== "string" ||
//       title.trim().length < 3
//     ) {

//       errors.push(
//         "Assessment title must be at least 3 characters"
//       );
//     }

//     if (
//       typeof title === "string" &&
//       title.trim().length > 150
//     ) {

//       errors.push(
//         "Assessment title cannot exceed 150 characters"
//       );
//     }
//   }


//   // ======================================
//   // COURSE
//   // ======================================

//   if (course !== undefined) {

//     const error =
//       validateObjectId(
//         course,
//         "Course"
//       );

//     if (error) {
//       errors.push(error);
//     }
//   }


//   // ======================================
//   // CATEGORY
//   // ======================================

//   if (
//     category !== undefined &&
//     category !== null &&
//     category !== ""
//   ) {

//     const error =
//       validateObjectId(
//         category,
//         "Category"
//       );

//     if (error) {
//       errors.push(error);
//     }
//   }


//   // ======================================
//   // DURATION
//   // ======================================

//   if (durationMinutes !== undefined) {

//     if (
//       !Number.isInteger(
//         Number(durationMinutes)
//       ) ||
//       Number(durationMinutes) < 1 ||
//       Number(durationMinutes) > 600
//     ) {

//       errors.push(
//         "Duration must be between 1 and 600 minutes"
//       );
//     }
//   }


//   // ======================================
//   // TOTAL MARKS
//   // ======================================

//   if (totalMarks !== undefined) {

//     if (
//       !Number.isFinite(
//         Number(totalMarks)
//       ) ||
//       Number(totalMarks) <= 0
//     ) {

//       errors.push(
//         "Total marks must be greater than 0"
//       );
//     }
//   }


//   // ======================================
//   // PASSING MARKS
//   // ======================================

//   if (passingMarks !== undefined) {

//     if (
//       !Number.isFinite(
//         Number(passingMarks)
//       ) ||
//       Number(passingMarks) < 0
//     ) {

//       errors.push(
//         "Passing marks cannot be negative"
//       );
//     }
//   }


//   // ======================================
//   // PASSING <= TOTAL
//   // ======================================

//   if (
//     totalMarks !== undefined &&
//     passingMarks !== undefined &&
//     Number(passingMarks) >
//       Number(totalMarks)
//   ) {

//     errors.push(
//       "Passing marks cannot be greater than total marks"
//     );
//   }


//   // ======================================
//   // MAX ATTEMPTS
//   // ======================================

//   if (maxAttempts !== undefined) {

//     if (
//       !Number.isInteger(
//         Number(maxAttempts)
//       ) ||
//       Number(maxAttempts) < 1 ||
//       Number(maxAttempts) > 10
//     ) {

//       errors.push(
//         "Maximum attempts must be between 1 and 10"
//       );
//     }
//   }


//   // ======================================
//   // NEGATIVE MARKING
//   // ======================================

//   if (negativeMarking === true) {

//     if (
//       negativeMarks === undefined ||
//       negativeMarks === null ||
//       negativeMarks === ""
//     ) {

//       errors.push(
//         "Negative marks are required when negative marking is enabled"
//       );

//     } else if (
//       !Number.isFinite(
//         Number(negativeMarks)
//       ) ||
//       Number(negativeMarks) < 0
//     ) {

//       errors.push(
//         "Negative marks cannot be negative"
//       );
//     }
//   }


//   // ======================================
//   // BOOLEAN FIELDS
//   // ======================================

//   if (
//     randomizeQuestions !== undefined &&
//     typeof randomizeQuestions !== "boolean"
//   ) {

//     errors.push(
//       "randomizeQuestions must be a boolean"
//     );
//   }


//   if (
//     shuffleOptions !== undefined &&
//     typeof shuffleOptions !== "boolean"
//   ) {

//     errors.push(
//       "shuffleOptions must be a boolean"
//     );
//   }


//   if (
//     negativeMarking !== undefined &&
//     typeof negativeMarking !== "boolean"
//   ) {

//     errors.push(
//       "negativeMarking must be a boolean"
//     );
//   }


//   // ======================================
//   // START DATE
//   // ======================================

//   if (
//     startDate &&
//     isNaN(Date.parse(startDate))
//   ) {

//     errors.push(
//       "Invalid start date"
//     );
//   }


//   // ======================================
//   // END DATE
//   // ======================================

//   if (
//     endDate &&
//     isNaN(Date.parse(endDate))
//   ) {

//     errors.push(
//       "Invalid end date"
//     );
//   }


//   // ======================================
//   // DATE RANGE
//   // ======================================

//   if (
//     startDate &&
//     endDate &&
//     !isNaN(Date.parse(startDate)) &&
//     !isNaN(Date.parse(endDate))
//   ) {

//     if (
//       new Date(endDate) <=
//       new Date(startDate)
//     ) {

//       errors.push(
//         "End date must be after start date"
//       );
//     }
//   }


//   // ======================================
//   // DESCRIPTION
//   // ======================================

//   if (
//     description !== undefined &&
//     description !== null
//   ) {

//     if (
//       typeof description !== "string"
//     ) {

//       errors.push(
//         "Description must be a string"
//       );

//     } else if (
//       description.length > 1000
//     ) {

//       errors.push(
//         "Description cannot exceed 1000 characters"
//       );
//     }
//   }


//   // ======================================
//   // INSTRUCTIONS
//   // ======================================

//   if (
//     instructions !== undefined &&
//     instructions !== null
//   ) {

//     if (
//       typeof instructions !== "string"
//     ) {

//       errors.push(
//         "Instructions must be a string"
//       );

//     } else if (
//       instructions.length > 3000
//     ) {

//       errors.push(
//         "Instructions cannot exceed 3000 characters"
//       );
//     }
//   }


//   // ======================================
//   // RETURN ERRORS
//   // ======================================

//   if (errors.length > 0) {

//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors,
//     });
//   }


//   next();
// };



// ========================================
// ASSESSMENT VALIDATOR
// Course and Category are NOT used
// ========================================


// ========================================
// CREATE ASSESSMENT
// ========================================

export const validateCreateAssessment = (
  req,
  res,
  next
) => {
  const {
    title,
    durationMinutes,
    totalMarks,
    passingMarks,
    maxAttempts,
    randomizeQuestions,
    shuffleOptions,
    negativeMarking,
    negativeMarks,
    startDate,
    endDate,
    description,
    instructions,
  } = req.body;

  const errors = [];


  // ========================================
  // TITLE
  // ========================================

  if (
    !title ||
    typeof title !== "string" ||
    !title.trim()
  ) {
    errors.push(
      "Assessment title is required"
    );
  } else {

    if (title.trim().length < 3) {
      errors.push(
        "Assessment title must be at least 3 characters"
      );
    }

    if (title.trim().length > 150) {
      errors.push(
        "Assessment title cannot exceed 150 characters"
      );
    }
  }


  // ========================================
  // DURATION
  // ========================================

  if (
    durationMinutes === undefined ||
    durationMinutes === null ||
    durationMinutes === ""
  ) {

    errors.push(
      "Duration is required"
    );

  } else if (
    !Number.isInteger(
      Number(durationMinutes)
    ) ||
    Number(durationMinutes) < 1 ||
    Number(durationMinutes) > 600
  ) {

    errors.push(
      "Duration must be between 1 and 600 minutes"
    );
  }


  // ========================================
  // TOTAL MARKS
  // ========================================

  if (
    totalMarks === undefined ||
    totalMarks === null ||
    totalMarks === ""
  ) {

    errors.push(
      "Total marks are required"
    );

  } else if (
    !Number.isFinite(
      Number(totalMarks)
    ) ||
    Number(totalMarks) <= 0
  ) {

    errors.push(
      "Total marks must be greater than 0"
    );
  }


  // ========================================
  // PASSING MARKS
  // ========================================

  if (
    passingMarks === undefined ||
    passingMarks === null ||
    passingMarks === ""
  ) {

    errors.push(
      "Passing marks are required"
    );

  } else if (
    !Number.isFinite(
      Number(passingMarks)
    ) ||
    Number(passingMarks) < 0
  ) {

    errors.push(
      "Passing marks cannot be negative"
    );
  }


  // ========================================
  // PASSING MARKS <= TOTAL MARKS
  // ========================================

  if (
    totalMarks !== undefined &&
    passingMarks !== undefined &&
    totalMarks !== "" &&
    passingMarks !== "" &&
    Number(passingMarks) >
      Number(totalMarks)
  ) {

    errors.push(
      "Passing marks cannot be greater than total marks"
    );
  }


  // ========================================
  // MAX ATTEMPTS
  // ========================================

  if (
    maxAttempts !== undefined &&
    maxAttempts !== null &&
    maxAttempts !== ""
  ) {

    if (
      !Number.isInteger(
        Number(maxAttempts)
      ) ||
      Number(maxAttempts) < 1 ||
      Number(maxAttempts) > 10
    ) {

      errors.push(
        "Maximum attempts must be between 1 and 10"
      );
    }
  }


  // ========================================
  // NEGATIVE MARKING
  // ========================================

  if (negativeMarking === true) {

    if (
      negativeMarks === undefined ||
      negativeMarks === null ||
      negativeMarks === ""
    ) {

      errors.push(
        "Negative marks are required when negative marking is enabled"
      );

    } else if (
      !Number.isFinite(
        Number(negativeMarks)
      ) ||
      Number(negativeMarks) < 0
    ) {

      errors.push(
        "Negative marks cannot be negative"
      );
    }
  }


  // ========================================
  // START DATE
  // ========================================

  if (
    startDate &&
    isNaN(Date.parse(startDate))
  ) {

    errors.push(
      "Invalid start date"
    );
  }


  // ========================================
  // END DATE
  // ========================================

  if (
    endDate &&
    isNaN(Date.parse(endDate))
  ) {

    errors.push(
      "Invalid end date"
    );
  }


  // ========================================
  // DATE VALIDATION
  // ========================================

  if (
    startDate &&
    endDate &&
    !isNaN(Date.parse(startDate)) &&
    !isNaN(Date.parse(endDate))
  ) {

    if (
      new Date(endDate) <=
      new Date(startDate)
    ) {

      errors.push(
        "End date must be after start date"
      );
    }
  }


  // ========================================
  // DESCRIPTION
  // ========================================

  if (
    description !== undefined &&
    description !== null
  ) {

    if (
      typeof description !== "string"
    ) {

      errors.push(
        "Description must be a string"
      );

    } else if (
      description.length > 1000
    ) {

      errors.push(
        "Description cannot exceed 1000 characters"
      );
    }
  }


  // ========================================
  // INSTRUCTIONS
  // ========================================

  if (
    instructions !== undefined &&
    instructions !== null
  ) {

    if (
      typeof instructions !== "string"
    ) {

      errors.push(
        "Instructions must be a string"
      );

    } else if (
      instructions.length > 3000
    ) {

      errors.push(
        "Instructions cannot exceed 3000 characters"
      );
    }
  }


  // ========================================
  // BOOLEAN VALIDATION
  // ========================================

  if (
    randomizeQuestions !== undefined &&
    typeof randomizeQuestions !== "boolean"
  ) {

    errors.push(
      "randomizeQuestions must be a boolean"
    );
  }


  if (
    shuffleOptions !== undefined &&
    typeof shuffleOptions !== "boolean"
  ) {

    errors.push(
      "shuffleOptions must be a boolean"
    );
  }


  if (
    negativeMarking !== undefined &&
    typeof negativeMarking !== "boolean"
  ) {

    errors.push(
      "negativeMarking must be a boolean"
    );
  }


  // ========================================
  // RETURN ERRORS
  // ========================================

  if (errors.length > 0) {

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }


  // ========================================
  // NEXT
  // ========================================

  next();
};



// ========================================
// UPDATE ASSESSMENT
// ========================================

export const validateUpdateAssessment = (
  req,
  res,
  next
) => {

  const {
    title,
    durationMinutes,
    totalMarks,
    passingMarks,
    maxAttempts,
    randomizeQuestions,
    shuffleOptions,
    negativeMarking,
    negativeMarks,
    startDate,
    endDate,
    description,
    instructions,
  } = req.body;

  const errors = [];


  // ========================================
  // TITLE
  // ========================================

  if (title !== undefined) {

    if (
      typeof title !== "string" ||
      title.trim().length < 3
    ) {

      errors.push(
        "Assessment title must be at least 3 characters"
      );
    }

    if (
      typeof title === "string" &&
      title.trim().length > 150
    ) {

      errors.push(
        "Assessment title cannot exceed 150 characters"
      );
    }
  }


  // ========================================
  // DURATION
  // ========================================

  if (
    durationMinutes !== undefined
  ) {

    if (
      !Number.isInteger(
        Number(durationMinutes)
      ) ||
      Number(durationMinutes) < 1 ||
      Number(durationMinutes) > 600
    ) {

      errors.push(
        "Duration must be between 1 and 600 minutes"
      );
    }
  }


  // ========================================
  // TOTAL MARKS
  // ========================================

  if (
    totalMarks !== undefined
  ) {

    if (
      !Number.isFinite(
        Number(totalMarks)
      ) ||
      Number(totalMarks) <= 0
    ) {

      errors.push(
        "Total marks must be greater than 0"
      );
    }
  }


  // ========================================
  // PASSING MARKS
  // ========================================

  if (
    passingMarks !== undefined
  ) {

    if (
      !Number.isFinite(
        Number(passingMarks)
      ) ||
      Number(passingMarks) < 0
    ) {

      errors.push(
        "Passing marks cannot be negative"
      );
    }
  }


  // ========================================
  // PASSING <= TOTAL
  // ========================================

  if (
    totalMarks !== undefined &&
    passingMarks !== undefined
  ) {

    if (
      Number(passingMarks) >
      Number(totalMarks)
    ) {

      errors.push(
        "Passing marks cannot be greater than total marks"
      );
    }
  }


  // ========================================
  // MAX ATTEMPTS
  // ========================================

  if (
    maxAttempts !== undefined
  ) {

    if (
      !Number.isInteger(
        Number(maxAttempts)
      ) ||
      Number(maxAttempts) < 1 ||
      Number(maxAttempts) > 10
    ) {

      errors.push(
        "Maximum attempts must be between 1 and 10"
      );
    }
  }


  // ========================================
  // NEGATIVE MARKING
  // ========================================

  if (
    negativeMarking === true
  ) {

    if (
      negativeMarks === undefined ||
      negativeMarks === null ||
      negativeMarks === ""
    ) {

      errors.push(
        "Negative marks are required when negative marking is enabled"
      );

    } else if (
      !Number.isFinite(
        Number(negativeMarks)
      ) ||
      Number(negativeMarks) < 0
    ) {

      errors.push(
        "Negative marks cannot be negative"
      );
    }
  }


  // ========================================
  // START DATE
  // ========================================

  if (
    startDate &&
    isNaN(Date.parse(startDate))
  ) {

    errors.push(
      "Invalid start date"
    );
  }


  // ========================================
  // END DATE
  // ========================================

  if (
    endDate &&
    isNaN(Date.parse(endDate))
  ) {

    errors.push(
      "Invalid end date"
    );
  }


  // ========================================
  // DATE VALIDATION
  // ========================================

  if (
    startDate &&
    endDate &&
    !isNaN(Date.parse(startDate)) &&
    !isNaN(Date.parse(endDate))
  ) {

    if (
      new Date(endDate) <=
      new Date(startDate)
    ) {

      errors.push(
        "End date must be after start date"
      );
    }
  }


  // ========================================
  // DESCRIPTION
  // ========================================

  if (
    description !== undefined &&
    description !== null
  ) {

    if (
      typeof description !== "string"
    ) {

      errors.push(
        "Description must be a string"
      );

    } else if (
      description.length > 1000
    ) {

      errors.push(
        "Description cannot exceed 1000 characters"
      );
    }
  }


  // ========================================
  // INSTRUCTIONS
  // ========================================

  if (
    instructions !== undefined &&
    instructions !== null
  ) {

    if (
      typeof instructions !== "string"
    ) {

      errors.push(
        "Instructions must be a string"
      );

    } else if (
      instructions.length > 3000
    ) {

      errors.push(
        "Instructions cannot exceed 3000 characters"
      );
    }
  }


  // ========================================
  // BOOLEAN VALIDATION
  // ========================================

  if (
    randomizeQuestions !== undefined &&
    typeof randomizeQuestions !== "boolean"
  ) {

    errors.push(
      "randomizeQuestions must be a boolean"
    );
  }


  if (
    shuffleOptions !== undefined &&
    typeof shuffleOptions !== "boolean"
  ) {

    errors.push(
      "shuffleOptions must be a boolean"
    );
  }


  if (
    negativeMarking !== undefined &&
    typeof negativeMarking !== "boolean"
  ) {

    errors.push(
      "negativeMarking must be a boolean"
    );
  }


  // ========================================
  // RETURN ERRORS
  // ========================================

  if (errors.length > 0) {

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }


  // ========================================
  // NEXT
  // ========================================

  next();
};