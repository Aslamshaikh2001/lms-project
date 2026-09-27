import mongoose from "mongoose";

import AssessmentAssignment from "../models/AssessmentAssignment.js";

// ======================================================
// VALIDATE OBJECT ID
// ======================================================

const validateObjectId = (
  id,
  fieldName
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    const error = new Error(
      `Invalid ${fieldName}.`
    );

    error.statusCode = 400;

    throw error;
  }
};

// ======================================================
// CHECK STUDENT ELIGIBILITY
// ======================================================
//
// This is the central security check.
//
// Every student assessment operation that requires
// access should use this function.
// ======================================================

export const checkStudentAssessmentEligibility =
  async (
    studentId,
    assessmentId
  ) => {
    validateObjectId(
      studentId,
      "student ID"
    );

    validateObjectId(
      assessmentId,
      "assessment ID"
    );

    const assignment =
      await AssessmentAssignment.findOne(
        {
          student: studentId,
          assessment: assessmentId,
        }
      );

    // ==================================================
    // NOT ASSIGNED
    // ==================================================

    if (!assignment) {
      const error = new Error(
        "You are not assigned to this assessment."
      );

      error.statusCode = 403;

      error.code =
        "ASSESSMENT_NOT_ASSIGNED";

      throw error;
    }

    // ==================================================
    // REVOKED
    // ==================================================

    if (
      assignment.status ===
      "REVOKED"
    ) {
      const error = new Error(
        "Your access to this assessment has been revoked."
      );

      error.statusCode = 403;

      error.code =
        "ASSESSMENT_ACCESS_REVOKED";

      throw error;
    }

    // ==================================================
    // EXPIRED STATUS
    // ==================================================

    if (
      assignment.status ===
      "EXPIRED"
    ) {
      const error = new Error(
        "Your assessment assignment has expired."
      );

      error.statusCode = 403;

      error.code =
        "ASSESSMENT_ASSIGNMENT_EXPIRED";

      throw error;
    }

    const now =
      new Date();

    // ==================================================
    // AVAILABLE FROM
    // ==================================================

    if (
      assignment.availableFrom &&
      now <
        new Date(
          assignment.availableFrom
        )
    ) {
      const error = new Error(
        "This assessment is not available yet."
      );

      error.statusCode = 403;

      error.code =
        "ASSESSMENT_NOT_AVAILABLE";

      error.availableFrom =
        assignment.availableFrom;

      throw error;
    }

    // ==================================================
    // DUE DATE
    // ==================================================

    if (
      assignment.dueDate &&
      now >
        new Date(
          assignment.dueDate
        )
    ) {
      assignment.status =
        "EXPIRED";

      await assignment.save();

      const error = new Error(
        "Your assessment assignment has expired."
      );

      error.statusCode = 403;

      error.code =
        "ASSESSMENT_ASSIGNMENT_EXPIRED";

      throw error;
    }

    // ==================================================
    // ELIGIBLE
    // ==================================================

    return assignment;
  };

// ======================================================
// GET ASSIGNMENT WITHOUT THROWING
// ======================================================
//
// Useful when building the student assessment list.
//

export const getStudentAssignment =
  async (
    studentId,
    assessmentId
  ) => {
    validateObjectId(
      studentId,
      "student ID"
    );

    validateObjectId(
      assessmentId,
      "assessment ID"
    );

    return AssessmentAssignment.findOne(
      {
        student: studentId,
        assessment: assessmentId,
      }
    ).lean();
  };