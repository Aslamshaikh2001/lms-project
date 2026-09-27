import mongoose from "mongoose";

import AssessmentAssignment from "../models/AssessmentAssignment.js";
import Assessment from "../models/Assessment.js";
import User from "../models/User.js";

// ======================================================
// VALIDATE OBJECT ID
// ======================================================

const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(
      `Invalid ${fieldName}.`
    );

    error.statusCode = 400;

    throw error;
  }
};

// ======================================================
// VALIDATE DATES
// ======================================================

const validateDates = (
  availableFrom,
  dueDate
) => {
  const parsedAvailableFrom =
    availableFrom
      ? new Date(availableFrom)
      : null;

  const parsedDueDate =
    dueDate
      ? new Date(dueDate)
      : null;

  if (
    parsedAvailableFrom &&
    Number.isNaN(
      parsedAvailableFrom.getTime()
    )
  ) {
    const error = new Error(
      "Invalid availableFrom date."
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    parsedDueDate &&
    Number.isNaN(
      parsedDueDate.getTime()
    )
  ) {
    const error = new Error(
      "Invalid dueDate."
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    parsedAvailableFrom &&
    parsedDueDate &&
    parsedDueDate <=
      parsedAvailableFrom
  ) {
    const error = new Error(
      "Due date must be after available date."
    );

    error.statusCode = 400;

    throw error;
  }

  return {
    availableFrom: parsedAvailableFrom,
    dueDate: parsedDueDate,
  };
};

// ======================================================
// VALIDATE MAX ATTEMPTS
// ======================================================

const validateMaxAttempts = (
  maxAttempts
) => {
  if (
    maxAttempts === null ||
    maxAttempts === undefined ||
    maxAttempts === ""
  ) {
    return null;
  }

  const parsed =
    Number(maxAttempts);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1
  ) {
    const error = new Error(
      "Max attempts must be at least 1."
    );

    error.statusCode = 400;

    throw error;
  }

  return parsed;
};

// ======================================================
// GET STUDENT
// ======================================================

const getStudent = async (
  studentId
) => {
  validateObjectId(
    studentId,
    "student ID"
  );

  const student =
    await User.findOne({
      _id: studentId,
      role: "STUDENT",
    });

  if (!student) {
    const error =
      new Error("Student not found.");

    error.statusCode = 404;

    throw error;
  }

  if (student.isActive === false) {
    const error = new Error(
      "Inactive student cannot be assigned."
    );

    error.statusCode = 400;

    throw error;
  }

  if (student.isSuspended === true) {
    const error = new Error(
      "Suspended student cannot be assigned."
    );

    error.statusCode = 400;

    throw error;
  }

  return student;
};

// ======================================================
// GET ASSESSMENT
// ======================================================

const getAssessment = async (
  assessmentId
) => {
  validateObjectId(
    assessmentId,
    "assessment ID"
  );

  const assessment =
    await Assessment.findById(
      assessmentId
    );

  if (!assessment) {
    const error =
      new Error(
        "Assessment not found."
      );

    error.statusCode = 404;

    throw error;
  }

  return assessment;
};

// ======================================================
// CREATE SINGLE ASSIGNMENT
// ======================================================

export const createAssessmentAssignment =
  async ({
    studentId,
    assessmentId,
    assignedBy,
    availableFrom = null,
    dueDate = null,
    maxAttempts = null,
    notes = "",
  }) => {
    validateObjectId(
      assignedBy,
      "admin ID"
    );

    await getStudent(studentId);

    await getAssessment(
      assessmentId
    );

    const dates =
      validateDates(
        availableFrom,
        dueDate
      );

    const parsedMaxAttempts =
      validateMaxAttempts(
        maxAttempts
      );

    // ==================================================
    // CHECK DUPLICATE
    // ==================================================

    const existingAssignment =
      await AssessmentAssignment.findOne(
        {
          student: studentId,
          assessment: assessmentId,
        }
      );

    if (existingAssignment) {
      // ----------------------------------------------
      // Reactivate revoked / expired assignment
      // ----------------------------------------------

      if (
        existingAssignment.status ===
          "REVOKED" ||
        existingAssignment.status ===
          "EXPIRED"
      ) {
        existingAssignment.status =
          "ASSIGNED";

        existingAssignment.assignedBy =
          assignedBy;

        existingAssignment.assignedAt =
          new Date();

        existingAssignment.availableFrom =
          dates.availableFrom;

        existingAssignment.dueDate =
          dates.dueDate;

        existingAssignment.maxAttempts =
          parsedMaxAttempts;

        existingAssignment.notes =
          notes?.trim() || "";

        await existingAssignment.save();

        return {
          assignment:
            existingAssignment,
          created: false,
          reactivated: true,
        };
      }

      const error = new Error(
        "Student is already assigned to this assessment."
      );

      error.statusCode = 409;

      throw error;
    }

    // ==================================================
    // CREATE
    // ==================================================

    const assignment =
      await AssessmentAssignment.create({
        student: studentId,
        assessment: assessmentId,
        assignedBy,

        status: "ASSIGNED",

        assignedAt: new Date(),

        availableFrom:
          dates.availableFrom,

        dueDate:
          dates.dueDate,

        maxAttempts:
          parsedMaxAttempts,

        notes:
          notes?.trim() || "",
      });

    return {
      assignment,
      created: true,
      reactivated: false,
    };
  };

// ======================================================
// BULK ASSIGN STUDENTS
// ======================================================

export const bulkAssignAssessment =
  async ({
    studentIds,
    assessmentId,
    assignedBy,
    availableFrom = null,
    dueDate = null,
    maxAttempts = null,
    notes = "",
  }) => {
    // ==================================================
    // VALIDATE
    // ==================================================

    if (
      !Array.isArray(studentIds) ||
      studentIds.length === 0
    ) {
      const error = new Error(
        "At least one student is required."
      );

      error.statusCode = 400;

      throw error;
    }

    if (studentIds.length > 500) {
      const error = new Error(
        "You can assign a maximum of 500 students at once."
      );

      error.statusCode = 400;

      throw error;
    }

    validateObjectId(
      assignedBy,
      "admin ID"
    );

    await getAssessment(
      assessmentId
    );

    const dates =
      validateDates(
        availableFrom,
        dueDate
      );

    const parsedMaxAttempts =
      validateMaxAttempts(
        maxAttempts
      );

    // ==================================================
    // REMOVE DUPLICATE STUDENT IDS
    // ==================================================

    const uniqueStudentIds = [
      ...new Set(
        studentIds.map(
          (id) => String(id)
        )
      ),
    ];

    // ==================================================
    // VALIDATE ALL STUDENTS
    // ==================================================

    const validStudentIds = [];

    const skipped = [];

    for (const studentId of uniqueStudentIds) {
      try {
        await getStudent(
          studentId
        );

        validStudentIds.push(
          studentId
        );
      } catch (error) {
        skipped.push({
          studentId,
          reason: error.message,
        });
      }
    }

    if (
      validStudentIds.length === 0
    ) {
      const error = new Error(
        "No valid students available for assignment."
      );

      error.statusCode = 400;

      error.details = {
        skipped,
      };

      throw error;
    }

    // ==================================================
    // FIND EXISTING ASSIGNMENTS
    // ==================================================

    const existingAssignments =
      await AssessmentAssignment.find({
        assessment: assessmentId,
        student: {
          $in: validStudentIds,
        },
      }).select(
        "_id student status"
      );

    const existingMap =
      new Map();

    existingAssignments.forEach(
      (assignment) => {
        existingMap.set(
          String(
            assignment.student
          ),
          assignment
        );
      }
    );

    // ==================================================
    // PREPARE OPERATIONS
    // ==================================================

    const operations = [];

    const assigned = [];

    const reactivated = [];

    const alreadyAssigned = [];

    for (const studentId of validStudentIds) {
      const existing =
        existingMap.get(
          String(studentId)
        );

      // ----------------------------------------------
      // No existing assignment
      // ----------------------------------------------

      if (!existing) {
        operations.push({
          insertOne: {
            document: {
              student: studentId,
              assessment:
                assessmentId,
              assignedBy,

              status: "ASSIGNED",

              assignedAt:
                new Date(),

              availableFrom:
                dates.availableFrom,

              dueDate:
                dates.dueDate,

              maxAttempts:
                parsedMaxAttempts,

              notes:
                notes?.trim() || "",
            },
          },
        });

        assigned.push(
          studentId
        );

        continue;
      }

      // ----------------------------------------------
      // Revoke / expired
      // ----------------------------------------------

      if (
        existing.status ===
          "REVOKED" ||
        existing.status ===
          "EXPIRED"
      ) {
        operations.push({
          updateOne: {
            filter: {
              _id: existing._id,
            },

            update: {
              $set: {
                status: "ASSIGNED",

                assignedBy,

                assignedAt:
                  new Date(),

                availableFrom:
                  dates.availableFrom,

                dueDate:
                  dates.dueDate,

                maxAttempts:
                  parsedMaxAttempts,

                notes:
                  notes?.trim() || "",
              },
            },
          },
        });

        reactivated.push(
          studentId
        );

        continue;
      }

      // ----------------------------------------------
      // Already assigned / started / completed
      // ----------------------------------------------

      alreadyAssigned.push({
        studentId,
        status:
          existing.status,
      });
    }

    // ==================================================
    // EXECUTE
    // ==================================================

    if (operations.length > 0) {
      await AssessmentAssignment.bulkWrite(
        operations
      );
    }

    return {
      totalRequested:
        uniqueStudentIds.length,

      assignedCount:
        assigned.length,

      reactivatedCount:
        reactivated.length,

      alreadyAssignedCount:
        alreadyAssigned.length,

      skippedCount:
        skipped.length,

      assigned,

      reactivated,

      alreadyAssigned,

      skipped,
    };
  };

// ======================================================
// GET ALL ASSIGNMENTS
// ======================================================

export const getAssessmentAssignments =
  async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    assessmentId = "",
    studentId = "",
  }) => {
    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );

    const perPage =
      Math.min(
        Math.max(
          Number(limit) || 10,
          1
        ),
        100
      );

    const skip =
      (currentPage - 1) *
      perPage;

    const filter = {};

    // ==================================================
    // ASSESSMENT FILTER
    // ==================================================

    if (assessmentId) {
      validateObjectId(
        assessmentId,
        "assessment ID"
      );

      filter.assessment =
        assessmentId;
    }

    // ==================================================
    // STUDENT FILTER
    // ==================================================

    if (studentId) {
      validateObjectId(
        studentId,
        "student ID"
      );

      filter.student =
        studentId;
    }

    // ==================================================
    // STATUS FILTER
    // ==================================================

    if (status) {
      const allowedStatuses = [
        "ASSIGNED",
        "STARTED",
        "COMPLETED",
        "REVOKED",
        "EXPIRED",
      ];

      if (
        allowedStatuses.includes(
          status
        )
      ) {
        filter.status =
          status;
      }
    }

    // ==================================================
    // SEARCH
    // ==================================================

    let studentIds = null;

    if (
      search &&
      search.trim()
    ) {
      const searchValue =
        search.trim();

      const students =
        await User.find({
          role: "STUDENT",
          $or: [
            {
              name: {
                $regex:
                  searchValue,
                $options: "i",
              },
            },
            {
              email: {
                $regex:
                  searchValue,
                $options: "i",
              },
            },
            {
              phone: {
                $regex:
                  searchValue,
                $options: "i",
              },
            },
          ],
        }).select("_id");

      studentIds =
        students.map(
          (student) =>
            student._id
        );

      filter.student = {
        $in: studentIds,
      };
    }

    // ==================================================
    // QUERY
    // ==================================================

    const [
      assignments,
      totalAssignments,
    ] = await Promise.all([
      AssessmentAssignment.find(
        filter
      )
        .populate(
          "student",
          "name email phone profileImage isEmailVerified isActive isSuspended"
        )
        .populate(
          "assessment",
          "title description status durationMinutes totalMarks passingMarks maxAttempts"
        )
        .populate(
          "assignedBy",
          "name email role"
        )
        .sort({
          assignedAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      AssessmentAssignment.countDocuments(
        filter
      ),
    ]);

    const totalPages =
      Math.ceil(
        totalAssignments /
          perPage
      );

    return {
      assignments,

      pagination: {
        currentPage,
        limit: perPage,
        totalAssignments,
        totalPages,

        hasNextPage:
          currentPage <
          totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    };
  };

// ======================================================
// GET ASSIGNMENT BY ID
// ======================================================

export const getAssessmentAssignmentById =
  async (assignmentId) => {
    validateObjectId(
      assignmentId,
      "assignment ID"
    );

    const assignment =
      await AssessmentAssignment.findById(
        assignmentId
      )
        .populate(
          "student",
          "name email phone profileImage isEmailVerified isActive isSuspended"
        )
        .populate(
          "assessment",
          "title description status durationMinutes totalMarks passingMarks maxAttempts"
        )
        .populate(
          "assignedBy",
          "name email role"
        )
        .lean();

    if (!assignment) {
      const error =
        new Error(
          "Assessment assignment not found."
        );

      error.statusCode = 404;

      throw error;
    }

    return assignment;
  };

// ======================================================
// GET STUDENTS ASSIGNED TO ASSESSMENT
// ======================================================

export const getAssignedStudents =
  async ({
    assessmentId,
    page = 1,
    limit = 10,
    search = "",
    status = "",
  }) => {
    validateObjectId(
      assessmentId,
      "assessment ID"
    );

    await getAssessment(
      assessmentId
    );

    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );

    const perPage =
      Math.min(
        Math.max(
          Number(limit) || 10,
          1
        ),
        100
      );

    const skip =
      (currentPage - 1) *
      perPage;

    const filter = {
      assessment:
        assessmentId,
    };

    if (status) {
      filter.status =
        status;
    }

    let matchingStudentIds =
      null;

    if (
      search &&
      search.trim()
    ) {
      const value =
        search.trim();

      const students =
        await User.find({
          role: "STUDENT",
          $or: [
            {
              name: {
                $regex: value,
                $options: "i",
              },
            },
            {
              email: {
                $regex: value,
                $options: "i",
              },
            },
            {
              phone: {
                $regex: value,
                $options: "i",
              },
            },
          ],
        }).select("_id");

      matchingStudentIds =
        students.map(
          (student) =>
            student._id
        );

      filter.student = {
        $in: matchingStudentIds,
      };
    }

    const [
      assignments,
      total,
    ] = await Promise.all([
      AssessmentAssignment.find(
        filter
      )
        .populate(
          "student",
          "name email phone profileImage isEmailVerified isActive isSuspended"
        )
        .populate(
          "assignedBy",
          "name email"
        )
        .sort({
          assignedAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      AssessmentAssignment.countDocuments(
        filter
      ),
    ]);

    return {
      assignments,

      pagination: {
        currentPage,
        limit: perPage,
        totalAssignments: total,
        totalPages: Math.ceil(
          total / perPage
        ),
        hasNextPage:
          currentPage <
          Math.ceil(
            total / perPage
          ),
        hasPreviousPage:
          currentPage > 1,
      },
    };
  };

// ======================================================
// REVOKE ASSIGNMENT
// ======================================================

export const revokeAssessmentAssignment =
  async ({
    assignmentId,
  }) => {
    validateObjectId(
      assignmentId,
      "assignment ID"
    );

    const assignment =
      await AssessmentAssignment.findById(
        assignmentId
      );

    if (!assignment) {
      const error =
        new Error(
          "Assessment assignment not found."
        );

      error.statusCode = 404;

      throw error;
    }

    if (
      assignment.status ===
      "REVOKED"
    ) {
      return assignment;
    }

    // ==================================================
    // DO NOT REVOKE ACTIVE ATTEMPT HERE
    // ==================================================
    //
    // Existing attempt remains a separate record.
    // Assignment only controls future eligibility.
    //

    assignment.status =
      "REVOKED";

    await assignment.save();

    return assignment;
  };

// ======================================================
// REACTIVATE ASSIGNMENT
// ======================================================

export const reactivateAssessmentAssignment =
  async ({
    assignmentId,
    assignedBy,
  }) => {
    validateObjectId(
      assignmentId,
      "assignment ID"
    );

    validateObjectId(
      assignedBy,
      "admin ID"
    );

    const assignment =
      await AssessmentAssignment.findById(
        assignmentId
      );

    if (!assignment) {
      const error =
        new Error(
          "Assessment assignment not found."
        );

      error.statusCode = 404;

      throw error;
    }

    if (
      assignment.status !==
        "REVOKED" &&
      assignment.status !==
        "EXPIRED"
    ) {
      const error =
        new Error(
          "Only revoked or expired assignments can be reactivated."
        );

      error.statusCode = 400;

      throw error;
    }

    assignment.status =
      "ASSIGNED";

    assignment.assignedBy =
      assignedBy;

    assignment.assignedAt =
      new Date();

    await assignment.save();

    return assignment;
  };

// ======================================================
// DELETE ASSIGNMENT
// ======================================================

export const deleteAssessmentAssignment =
  async (assignmentId) => {
    validateObjectId(
      assignmentId,
      "assignment ID"
    );

    const assignment =
      await AssessmentAssignment.findByIdAndDelete(
        assignmentId
      );

    if (!assignment) {
      const error =
        new Error(
          "Assessment assignment not found."
        );

      error.statusCode = 404;

      throw error;
    }

    return assignment;
  };

// ======================================================
// STUDENT ELIGIBILITY
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
      await AssessmentAssignment.findOne({
        student: studentId,
        assessment: assessmentId,
      });

    if (!assignment) {
      return {
        eligible: false,
        reason: "NOT_ASSIGNED",
        message:
          "You are not assigned to this assessment.",
        assignment: null,
      };
    }

    if (
      assignment.status ===
      "REVOKED"
    ) {
      return {
        eligible: false,
        reason: "REVOKED",
        message:
          "Your access to this assessment has been revoked.",
        assignment,
      };
    }

    if (
      assignment.status ===
      "EXPIRED"
    ) {
      return {
        eligible: false,
        reason: "EXPIRED",
        message:
          "Your assessment assignment has expired.",
        assignment,
      };
    }

    const now =
      new Date();

    if (
      assignment.availableFrom &&
      now <
        new Date(
          assignment.availableFrom
        )
    ) {
      return {
        eligible: false,
        reason:
          "NOT_AVAILABLE_YET",
        message:
          "This assessment is not available yet.",
        assignment,
      };
    }

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

      return {
        eligible: false,
        reason: "EXPIRED",
        message:
          "The assessment assignment has expired.",
        assignment,
      };
    }

    return {
      eligible: true,
      reason: null,
      message:
        "Student is eligible for this assessment.",
      assignment,
    };
  };

// ======================================================
// GET STUDENT ASSIGNMENT
// ======================================================

export const getStudentAssessmentAssignment =
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

    return AssessmentAssignment.findOne({
      student: studentId,
      assessment: assessmentId,
    })
      .populate(
        "student",
        "name email phone"
      )
      .populate(
        "assessment",
        "title description status durationMinutes totalMarks passingMarks maxAttempts"
      )
      .populate(
        "assignedBy",
        "name email role"
      );
  };