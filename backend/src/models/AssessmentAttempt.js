// import mongoose from "mongoose";

// // ======================================================
// // ATTEMPT ANSWER SCHEMA
// // ======================================================

// const attemptAnswerSchema = new mongoose.Schema(
//   {
//     question: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Question",
//       required: true,
//     },

//     selectedAnswer: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     answeredAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     _id: false,
//   }
// );

// // ======================================================
// // QUESTION SNAPSHOT SCHEMA
// // ======================================================

// const questionSnapshotSchema = new mongoose.Schema(
//   {
//     question: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Question",
//       required: true,
//     },

//     order: {
//       type: Number,
//       required: true,
//     },

//     questionText: {
//       type: String,
//       required: true,
//     },

//     questionType: {
//       type: String,
//       enum: [
//         "MCQ",
//         "MULTIPLE_SELECT",
//         "TRUE_FALSE",
//         "SHORT_ANSWER",
//         "LONG_ANSWER",
//       ],
//       required: true,
//     },

//     options: {
//       type: [
//         {
//           _id: {
//             type: mongoose.Schema.Types.ObjectId,
//             required: true,
//           },

//           text: {
//             type: String,
//             required: true,
//           },
//         },
//       ],
//       default: [],
//     },

//     marks: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     negativeMarks: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     isRequired: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     _id: false,
//   }
// );

// // ======================================================
// // ASSESSMENT ATTEMPT SCHEMA
// // ======================================================

// const assessmentAttemptSchema = new mongoose.Schema(
//   {
//     // ==================================================
//     // STUDENT
//     // ==================================================

//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     // ==================================================
//     // ASSESSMENT
//     // ==================================================

//     assessment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Assessment",
//       required: true,
//       index: true,
//     },

//     // ==================================================
//     // ATTEMPT NUMBER
//     // ==================================================

//     attemptNumber: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     // ==================================================
//     // STATUS
//     // ==================================================

//     status: {
//       type: String,
//       enum: [
//         "IN_PROGRESS",
//         "SUBMITTED",
//         "AUTO_SUBMITTED",
//         "ABANDONED",
//       ],
//       default: "IN_PROGRESS",
//       index: true,
//     },

//     // ==================================================
//     // TIME
//     // ==================================================

//     startedAt: {
//       type: Date,
//       required: true,
//     },

//     expiresAt: {
//       type: Date,
//       required: true,
//     },

//     submittedAt: {
//       type: Date,
//       default: null,
//     },

//     // ==================================================
//     // QUESTION SNAPSHOT
//     // ==================================================

//     questionSnapshot: {
//       type: [questionSnapshotSchema],
//       default: [],
//     },

//     // ==================================================
//     // STUDENT ANSWERS
//     // ==================================================

//     answers: {
//       type: [attemptAnswerSchema],
//       default: [],
//     },

//     // ==================================================
//     // RESULT FIELDS
//     // ==================================================

//     score: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     totalMarks: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     percentage: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 100,
//     },

//     passed: {
//       type: Boolean,
//       default: false,
//     },

//     // ==================================================
//     // QUESTION STATISTICS
//     // ==================================================

//     totalQuestions: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     answeredQuestions: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     correctAnswers: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     wrongAnswers: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     unansweredQuestions: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // ======================================================
// // INDEX
// // ======================================================

// assessmentAttemptSchema.index(
//   {
//     student: 1,
//     assessment: 1,
//     attemptNumber: 1,
//   },
//   {
//     unique: true,
//   }
// );

// // ======================================================
// // MODEL
// // ======================================================

// const AssessmentAttempt = mongoose.model(
//   "AssessmentAttempt",
//   assessmentAttemptSchema
// );

// export default AssessmentAttempt;







import mongoose from "mongoose";

// ======================================================
// SECURITY VIOLATION SCHEMA
// ======================================================
//
// IMPORTANT:
// Security events are stored in the assessment attempt.
//
// Examples:
// - Student changes browser tab
// - Student leaves fullscreen
// - Student copies content
// - Student uses print shortcut
// - Student uses DevTools shortcut
//
// This information is stored on the backend so that
// refreshing the frontend cannot reset the violation count.
// ======================================================

const securityViolationSchema = new mongoose.Schema(
  {
    type: {
      type: String,

      enum: [
        "TAB_SWITCH",
        "WINDOW_BLUR",
        "FULLSCREEN_EXIT",
        "COPY",
        "CUT",
        "PASTE",
        "RIGHT_CLICK",
        "PRINT_SHORTCUT",
        "SAVE_SHORTCUT",
        "DEVTOOLS_SHORTCUT",
      ],

      required: true,
    },

    occurredAt: {
      type: Date,
      default: Date.now,
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);


// ======================================================
// ATTEMPT ANSWER SCHEMA
// ======================================================

const attemptAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedAnswer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    answeredAt: {
      type: Date,
      default: Date.now,
    },

    // ==================================================
    // EVALUATION RESULT
    // ==================================================

    isCorrect: {
      type: Boolean,
      default: null,
    },

    awardedMarks: {
      type: Number,
      default: 0,
    },

    deductedMarks: {
      type: Number,
      default: 0,
    },

    requiresManualReview: {
      type: Boolean,
      default: false,
    },

    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);


// ======================================================
// GRADING KEY
//
// IMPORTANT:
// This stays only in MongoDB.
// Never return this through the student question API.
// ======================================================

const gradingKeySchema = new mongoose.Schema(
  {
    correctOptionIds: {
      type: [
        mongoose.Schema.Types.ObjectId,
      ],

      default: [],
    },

    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  }
);


// ======================================================
// QUESTION SNAPSHOT
// ======================================================

const questionSnapshotSchema =
  new mongoose.Schema(
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },

      order: {
        type: Number,
        required: true,
      },

      questionText: {
        type: String,
        required: true,
      },

      questionType: {
        type: String,

        enum: [
          "MCQ",
          "MULTIPLE_SELECT",
          "TRUE_FALSE",
          "SHORT_ANSWER",
          "LONG_ANSWER",
        ],

        required: true,
      },

      options: {
        type: [
          {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },

            text: {
              type: String,
              required: true,
            },
          },
        ],

        default: [],
      },

      marks: {
        type: Number,
        required: true,
        min: 0,
      },

      negativeMarks: {
        type: Number,
        default: 0,
        min: 0,
      },

      isRequired: {
        type: Boolean,
        default: true,
      },

      // ================================================
      // PRIVATE GRADING INFORMATION
      // ================================================
      //
      // IMPORTANT:
      //
      // This information is required by the backend
      // during evaluation.
      //
      // It must NEVER be returned through student APIs.
      //
      // Contains:
      // - correctOptionIds
      // - correctAnswer
      //
      // ================================================

      gradingKey: {
        type: gradingKeySchema,

        default: () => ({
          correctOptionIds: [],
          correctAnswer: null,
        }),
      },
    },

    {
      _id: false,
    }
  );


// ======================================================
// ASSESSMENT ATTEMPT
// ======================================================

const assessmentAttemptSchema =
  new mongoose.Schema(
    {
      // ==================================================
      // STUDENT
      // ==================================================

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },


      // ==================================================
      // ASSESSMENT
      // ==================================================

      assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true,
        index: true,
      },


      // ==================================================
      // ATTEMPT NUMBER
      // ==================================================

      attemptNumber: {
        type: Number,
        required: true,
        min: 1,
      },


      // ==================================================
      // ATTEMPT STATUS
      // ==================================================

      status: {
        type: String,

        enum: [
          "IN_PROGRESS",
          "SUBMITTED",
          "AUTO_SUBMITTED",
          "ABANDONED",
        ],

        default: "IN_PROGRESS",

        index: true,
      },


      // ==================================================
      // RESULT STATUS
      // ==================================================

      resultStatus: {
        type: String,

        enum: [
          "NOT_SUBMITTED",
          "FINAL",
          "PENDING_MANUAL_REVIEW",
        ],

        default: "NOT_SUBMITTED",
      },


      // ==================================================
      // TIME
      // ==================================================

      startedAt: {
        type: Date,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      submittedAt: {
        type: Date,
        default: null,
      },


      // ==================================================
      // QUESTIONS
      // ==================================================

      questionSnapshot: {
        type: [
          questionSnapshotSchema,
        ],

        default: [],
      },


      // ==================================================
      // ANSWERS
      // ==================================================

      answers: {
        type: [
          attemptAnswerSchema,
        ],

        default: [],
      },


      // ==================================================
      // RESULT
      // ==================================================

      score: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalMarks: {
        type: Number,
        required: true,
        min: 0,
      },

      passingMarks: {
        type: Number,
        default: 0,
        min: 0,
      },

      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      passed: {
        type: Boolean,
        default: null,
      },


      // ==================================================
      // COUNTERS
      // ==================================================

      totalQuestions: {
        type: Number,
        default: 0,
        min: 0,
      },

      answeredQuestions: {
        type: Number,
        default: 0,
        min: 0,
      },

      correctAnswers: {
        type: Number,
        default: 0,
        min: 0,
      },

      wrongAnswers: {
        type: Number,
        default: 0,
        min: 0,
      },

      unansweredQuestions: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ==================================================
      // MANUAL REVIEW
      // ==================================================

      manualReviewPending: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ==================================================
      // SECURITY
      // ==================================================
      //
      // These fields store the security state of the
      // current assessment attempt.
      //
      // IMPORTANT:
      //
      // Security state is stored in MongoDB.
      //
      // Therefore:
      //
      // Student refreshes page
      //       ↓
      // Security count remains
      //
      // Student opens another tab
      //       ↓
      // Backend receives event
      //
      // Second tab switch
      //       ↓
      // Backend can automatically submit attempt
      //
      // ==================================================


      // ==================================================
      // TOTAL SECURITY VIOLATIONS
      // ==================================================

      securityViolationCount: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ==================================================
      // TAB SWITCH COUNT
      // ==================================================
      //
      // Your required rule:
      //
      // 1st tab switch
      //      → warning
      //
      // 2nd tab switch
      //      → auto submit
      //
      // This value is maintained separately from the
      // total security violation count.
      // ==================================================

      tabSwitchCount: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ==================================================
      // FULLSCREEN EXIT COUNT
      // ==================================================

      fullscreenExitCount: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ==================================================
      // SECURITY VIOLATION HISTORY
      // ==================================================
      //
      // Stores individual security events.
      //
      // Example:
      //
      // [
      //   {
      //     type: "TAB_SWITCH",
      //     occurredAt: "...",
      //     userAgent: "Chrome..."
      //   },
      //   {
      //     type: "FULLSCREEN_EXIT",
      //     occurredAt: "...",
      //     userAgent: "Chrome..."
      //   }
      // ]
      //
      // ==================================================

      securityViolations: {
        type: [
          securityViolationSchema,
        ],

        default: [],
      },


      // ==================================================
      // SECURITY AUTO SUBMITTED
      // ==================================================
      //
      // true when the assessment was automatically
      // submitted because of a security rule.
      //
      // ==================================================

      securityAutoSubmitted: {
        type: Boolean,
        default: false,
      },


      // ==================================================
      // SECURITY AUTO SUBMIT REASON
      // ==================================================
      //
      // Examples:
      //
      // "TAB_SWITCH_LIMIT_REACHED"
      // "DEVTOOLS_DETECTED"
      // "FULLSCREEN_VIOLATION"
      //
      // ==================================================

      securityAutoSubmitReason: {
        type: String,
        default: null,
      },


      // ==================================================
      // LAST SECURITY VIOLATION
      // ==================================================
      //
      // Useful for:
      //
      // - Admin reports
      // - Audit logs
      // - Security monitoring
      //
      // ==================================================

      lastSecurityViolationAt: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );


// ======================================================
// UNIQUE ATTEMPT INDEX
// ======================================================

assessmentAttemptSchema.index(
  {
    student: 1,
    assessment: 1,
    attemptNumber: 1,
  },
  {
    unique: true,
  }
);


// ======================================================
// SECURITY INDEXES
// ======================================================
//
// These indexes are useful when an admin later wants to
// find attempts that were automatically submitted because
// of security violations.
// ======================================================

assessmentAttemptSchema.index({
  securityAutoSubmitted: 1,
});

assessmentAttemptSchema.index({
  tabSwitchCount: 1,
});

assessmentAttemptSchema.index({
  lastSecurityViolationAt: 1,
});


// ======================================================
// MODEL
// ======================================================

const AssessmentAttempt =
  mongoose.model(
    "AssessmentAttempt",
    assessmentAttemptSchema
  );


export default AssessmentAttempt;