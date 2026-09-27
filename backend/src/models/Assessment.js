// import mongoose from "mongoose";


// const assessmentSchema =
//   new mongoose.Schema(
//     {
//       // ====================================
//       // BASIC INFORMATION
//       // ====================================

//       title: {
//         type: String,
//         required: [
//           true,
//           "Assessment title is required",
//         ],
//         trim: true,
//         minlength: 3,
//         maxlength: 150,
//       },


//       description: {
//         type: String,
//         trim: true,
//         maxlength: 1000,
//         default: "",
//       },


//       // ====================================
//       // COURSE
//       // ====================================

//       course: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: "Course",
//         required: [
//           true,
//           "Course is required",
//         ],
//       },


//       // ====================================
//       // CATEGORY
//       // ====================================

//       category: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: "Category",
//         default: null,
//       },


//       // ====================================
//       // MARKS & DURATION
//       // ====================================

//       durationMinutes: {
//         type: Number,
//         required: [
//           true,
//           "Assessment duration is required",
//         ],
//         min: [
//           1,
//           "Duration must be at least 1 minute",
//         ],
//         max: [
//           600,
//           "Duration cannot exceed 600 minutes",
//         ],
//       },


//       totalMarks: {
//         type: Number,
//         required: [
//           true,
//           "Total marks are required",
//         ],
//         min: [
//           1,
//           "Total marks must be greater than 0",
//         ],
//       },


//       passingMarks: {
//         type: Number,
//         required: [
//           true,
//           "Passing marks are required",
//         ],
//         min: [
//           0,
//           "Passing marks cannot be negative",
//         ],
//       },


//       // ====================================
//       // ATTEMPTS
//       // ====================================

//       maxAttempts: {
//         type: Number,
//         default: 1,
//         min: [
//           1,
//           "Maximum attempts must be at least 1",
//         ],
//         max: [
//           10,
//           "Maximum attempts cannot exceed 10",
//         ],
//       },


//       // ====================================
//       // QUESTION SETTINGS
//       // ====================================

//       randomizeQuestions: {
//         type: Boolean,
//         default: false,
//       },


//       shuffleOptions: {
//         type: Boolean,
//         default: false,
//       },


//       // ====================================
//       // NEGATIVE MARKING
//       // ====================================

//       negativeMarking: {
//         type: Boolean,
//         default: false,
//       },


//       negativeMarks: {
//         type: Number,
//         default: 0,
//         min: [
//           0,
//           "Negative marks cannot be negative",
//         ],
//       },


//       // ====================================
//       // SCHEDULE
//       // ====================================

//       startDate: {
//         type: Date,
//         default: null,
//       },


//       endDate: {
//         type: Date,
//         default: null,
//       },


//       // ====================================
//       // INSTRUCTIONS
//       // ====================================

//       instructions: {
//         type: String,
//         trim: true,
//         maxlength: 3000,
//         default: "",
//       },


//       // ====================================
//       // STATUS
//       // ====================================

//       status: {
//         type: String,
//         enum: [
//           "DRAFT",
//           "PUBLISHED",
//           "UNPUBLISHED",
//         ],
//         default: "DRAFT",
//       },


//       // ====================================
//       // AUDIT
//       // ====================================

//       createdBy: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },


//       updatedBy: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null,
//       },
//     },

//     {
//       timestamps: true,
//     }
//   );


// // ========================================
// // SCHEMA VALIDATION
// // ========================================

// assessmentSchema.pre(
//   "validate",
//   function (next) {

//     // Passing marks cannot exceed total marks
//     if (
//       this.passingMarks >
//       this.totalMarks
//     ) {
//       return next(
//         new Error(
//           "Passing marks cannot be greater than total marks"
//         )
//       );
//     }


//     // If negative marking is disabled,
//     // negative marks should always be zero
//     if (!this.negativeMarking) {
//       this.negativeMarks = 0;
//     }


//     // End date must be after start date
//     if (
//       this.startDate &&
//       this.endDate &&
//       this.endDate <=
//         this.startDate
//     ) {
//       return next(
//         new Error(
//           "End date must be after start date"
//         )
//       );
//     }


//     next();
//   }
// );


// // ========================================
// // MODEL
// // ========================================

// const Assessment =
//   mongoose.model(
//     "Assessment",
//     assessmentSchema
//   );


// export default Assessment;




import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    // ========================================
    // BASIC INFORMATION
    // ========================================

    title: {
      type: String,
      required: [true, "Assessment title is required"],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // ========================================
    // MARKS & DURATION
    // ========================================

    durationMinutes: {
      type: Number,
      required: [true, "Assessment duration is required"],
      min: [1, "Duration must be at least 1 minute"],
      max: [600, "Duration cannot exceed 600 minutes"],
    },

    totalMarks: {
      type: Number,
      required: [true, "Total marks are required"],
      min: [1, "Total marks must be greater than 0"],
    },

    passingMarks: {
      type: Number,
      required: [true, "Passing marks are required"],
      min: [0, "Passing marks cannot be negative"],
    },

    // ========================================
    // ATTEMPTS
    // ========================================

    maxAttempts: {
      type: Number,
      default: 1,
      min: [1, "Maximum attempts must be at least 1"],
      max: [10, "Maximum attempts cannot exceed 10"],
    },

    // ========================================
    // QUESTION SETTINGS
    // ========================================

    randomizeQuestions: {
      type: Boolean,
      default: false,
    },

    shuffleOptions: {
      type: Boolean,
      default: false,
    },

    // ========================================
    // NEGATIVE MARKING
    // ========================================

    negativeMarking: {
      type: Boolean,
      default: false,
    },

    negativeMarks: {
      type: Number,
      default: 0,
      min: [0, "Negative marks cannot be negative"],
    },

    // ========================================
    // SCHEDULE
    // ========================================

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    // ========================================
    // INSTRUCTIONS
    // ========================================

    instructions: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    // ========================================
    // STATUS
    // ========================================

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "UNPUBLISHED"],
      default: "DRAFT",
    },

    // ========================================
    // AUDIT
    // ========================================

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

// ========================================
// SCHEMA VALIDATION
// ========================================

assessmentSchema.pre("validate", function (next) {
  // Passing marks cannot exceed total marks
  if (
    this.passingMarks !== undefined &&
    this.totalMarks !== undefined &&
    this.passingMarks > this.totalMarks
  ) {
    return next(
      new Error(
        "Passing marks cannot be greater than total marks"
      )
    );
  }

  // Negative marking disabled = negative marks zero
  if (!this.negativeMarking) {
    this.negativeMarks = 0;
  }

  // End date must be after start date
  if (
    this.startDate &&
    this.endDate &&
    this.endDate <= this.startDate
  ) {
    return next(
      new Error("End date must be after start date")
    );
  }

  next();
});

// ========================================
// MODEL
// ========================================

const Assessment = mongoose.model(
  "Assessment",
  assessmentSchema
);

export default Assessment;