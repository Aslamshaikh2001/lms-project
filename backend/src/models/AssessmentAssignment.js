import mongoose from "mongoose";

// ======================================================
// ASSESSMENT ASSIGNMENT SCHEMA
// ======================================================

const assessmentAssignmentSchema = new mongoose.Schema(
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
    // ASSIGNED BY ADMIN / SUPER ADMIN
    // ==================================================

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==================================================
    // ASSIGNMENT STATUS
    // ==================================================

    status: {
      type: String,

      enum: [
        "ASSIGNED",
        "STARTED",
        "COMPLETED",
        "REVOKED",
        "EXPIRED",
      ],

      default: "ASSIGNED",

      index: true,
    },

    // ==================================================
    // ASSIGNED DATE
    // ==================================================

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    // ==================================================
    // AVAILABLE FROM
    // ==================================================

    availableFrom: {
      type: Date,
      default: null,
    },

    // ==================================================
    // DUE DATE
    // ==================================================

    dueDate: {
      type: Date,
      default: null,
    },

    // ==================================================
    // CUSTOM MAX ATTEMPTS
    // ==================================================
    // null = use assessment.maxAttempts

    maxAttempts: {
      type: Number,
      default: null,
      min: 1,
    },

    // ==================================================
    // ADMIN NOTES
    // ==================================================

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// PREVENT DUPLICATE ASSIGNMENT
// ======================================================
//
// Same student cannot be assigned twice to the same
// assessment.
//

assessmentAssignmentSchema.index(
  {
    student: 1,
    assessment: 1,
  },
  {
    unique: true,
  }
);

// ======================================================
// USEFUL INDEXES
// ======================================================

assessmentAssignmentSchema.index({
  assessment: 1,
  status: 1,
});

assessmentAssignmentSchema.index({
  student: 1,
  status: 1,
});

assessmentAssignmentSchema.index({
  assignedAt: -1,
});

// ======================================================
// MODEL
// ======================================================

const AssessmentAssignment =
  mongoose.models.AssessmentAssignment ||
  mongoose.model(
    "AssessmentAssignment",
    assessmentAssignmentSchema
  );

export default AssessmentAssignment;