// import mongoose from "mongoose";

// import User from "../models/User.js";
// import Assessment from "../models/Assessment.js";
// import AssessmentAttempt from "../models/AssessmentAttempt.js";

// /**
//  * ============================================================
//  * Helper: Validate MongoDB ObjectId
//  * ============================================================
//  */
// const isValidObjectId = (id) => {
//   return mongoose.Types.ObjectId.isValid(id);
// };

// /**
//  * ============================================================
//  * Helper: Get current student information
//  * ============================================================
//  */
// const buildStudentInfo = (user) => {
//   if (!user) {
//     return null;
//   }

//   const firstName = user.firstName || "";
//   const lastName = user.lastName || "";

//   const fullName =
//     user.name ||
//     `${firstName} ${lastName}`.trim() ||
//     user.email ||
//     "Student";

//   return {
//     id: user._id,
//     name: fullName,
//     firstName,
//     lastName,
//     email: user.email || "",
//     role: user.role || "STUDENT",
//     avatar:
//       user.avatar ||
//       user.profileImage ||
//       user.profilePicture ||
//       null,
//   };
// };

// /**
//  * ============================================================
//  * Get Student Dashboard
//  * ============================================================
//  */
// export const getStudentDashboard = async (studentId) => {
//   if (!studentId || !isValidObjectId(studentId)) {
//     throw new Error("Invalid student ID.");
//   }

//   /**
//    * ----------------------------------------------------------
//    * 1. Student information
//    * ----------------------------------------------------------
//    */
//   const student = await User.findById(studentId).lean();

//   if (!student) {
//     throw new Error("Student not found.");
//   }

//   /**
//    * ----------------------------------------------------------
//    * 2. Current date
//    * ----------------------------------------------------------
//    */
//   const now = new Date();

//   /**
//    * ----------------------------------------------------------
//    * 3. Assessment statistics
//    * ----------------------------------------------------------
//    *
//    * Total Assessments
//    * = all published assessments
//    *
//    * Available Assessments
//    * = published assessments which are currently available
//    *
//    * ----------------------------------------------------------
//    */
//   const totalAssessments = await Assessment.countDocuments({
//     status: "PUBLISHED",
//   });

//   const availableAssessments = await Assessment.countDocuments({
//     status: "PUBLISHED",
//     $and: [
//       {
//         $or: [
//           { startDate: { $exists: false } },
//           { startDate: null },
//           { startDate: { $lte: now } },
//         ],
//       },
//       {
//         $or: [
//           { endDate: { $exists: false } },
//           { endDate: null },
//           { endDate: { $gte: now } },
//         ],
//       },
//     ],
//   });

//   /**
//    * ----------------------------------------------------------
//    * 4. Attempt statistics
//    * ----------------------------------------------------------
//    */
//   const attemptStatistics = await AssessmentAttempt.aggregate([
//     {
//       $match: {
//         student: new mongoose.Types.ObjectId(studentId),
//       },
//     },
//     {
//       $group: {
//         _id: null,

//         completedAssessments: {
//           $sum: {
//             $cond: [
//               {
//                 $in: [
//                   "$status",
//                   ["SUBMITTED", "AUTO_SUBMITTED"],
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },

//         inProgressAssessments: {
//           $sum: {
//             $cond: [
//               {
//                 $eq: ["$status", "IN_PROGRESS"],
//               },
//               1,
//               0,
//             ],
//           },
//         },

//         passedAssessments: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   {
//                     $in: [
//                       "$status",
//                       ["SUBMITTED", "AUTO_SUBMITTED"],
//                     ],
//                   },
//                   {
//                     $eq: ["$passed", true],
//                   },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },

//         failedAssessments: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   {
//                     $in: [
//                       "$status",
//                       ["SUBMITTED", "AUTO_SUBMITTED"],
//                     ],
//                   },
//                   {
//                     $eq: ["$passed", false],
//                   },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },

//         totalPercentage: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   {
//                     $in: [
//                       "$status",
//                       ["SUBMITTED", "AUTO_SUBMITTED"],
//                     ],
//                   },
//                   {
//                     $ne: ["$percentage", null],
//                   },
//                 ],
//               },
//               "$percentage",
//               0,
//             ],
//           },
//         },

//         percentageCount: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   {
//                     $in: [
//                       "$status",
//                       ["SUBMITTED", "AUTO_SUBMITTED"],
//                     ],
//                   },
//                   {
//                     $ne: ["$percentage", null],
//                   },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//       },
//     },
//   ]);

//   const statistics = attemptStatistics[0] || {};

//   const completedAssessments =
//     statistics.completedAssessments || 0;

//   const inProgressAssessments =
//     statistics.inProgressAssessments || 0;

//   const passedAssessments =
//     statistics.passedAssessments || 0;

//   const failedAssessments =
//     statistics.failedAssessments || 0;

//   const averageScore =
//     statistics.percentageCount > 0
//       ? Number(
//           (
//             statistics.totalPercentage /
//             statistics.percentageCount
//           ).toFixed(2)
//         )
//       : 0;

//   /**
//    * ----------------------------------------------------------
//    * 5. Recent attempts
//    * ----------------------------------------------------------
//    */
//   const recentAttempts = await AssessmentAttempt.find({
//     student: studentId,
//   })
//     .populate({
//       path: "assessment",
//       select:
//         "title description durationMinutes totalMarks passingMarks",
//     })
//     .sort({
//       createdAt: -1,
//     })
//     .limit(5)
//     .lean();

//   /**
//    * ----------------------------------------------------------
//    * 6. Format recent attempts
//    * ----------------------------------------------------------
//    */
//   const formattedRecentAttempts = recentAttempts.map(
//     (attempt) => ({
//       id: attempt._id,

//       attemptNumber: attempt.attemptNumber,

//       status: attempt.status,

//       resultStatus:
//         attempt.resultStatus || "NOT_SUBMITTED",

//       assessment: attempt.assessment
//         ? {
//             id: attempt.assessment._id,
//             title: attempt.assessment.title,
//             description:
//               attempt.assessment.description || "",
//             durationMinutes:
//               attempt.assessment.durationMinutes || 0,
//             totalMarks:
//               attempt.assessment.totalMarks || 0,
//             passingMarks:
//               attempt.assessment.passingMarks || 0,
//           }
//         : null,

//       score:
//         typeof attempt.score === "number"
//           ? attempt.score
//           : 0,

//       totalMarks:
//         typeof attempt.totalMarks === "number"
//           ? attempt.totalMarks
//           : 0,

//       percentage:
//         typeof attempt.percentage === "number"
//           ? attempt.percentage
//           : 0,

//       passed:
//         attempt.passed === true,

//       startedAt: attempt.startedAt || null,

//       submittedAt:
//         attempt.submittedAt || null,

//       expiresAt:
//         attempt.expiresAt || null,

//       totalQuestions:
//         attempt.totalQuestions || 0,

//       answeredQuestions:
//         attempt.answeredQuestions || 0,

//       correctAnswers:
//         attempt.correctAnswers || 0,

//       wrongAnswers:
//         attempt.wrongAnswers || 0,

//       unansweredQuestions:
//         attempt.unansweredQuestions || 0,

//       manualReviewPending:
//         attempt.manualReviewPending === true,
//     })
//   );

//   /**
//    * ----------------------------------------------------------
//    * 7. Final dashboard response
//    * ----------------------------------------------------------
//    */
//   return {
//     student: buildStudentInfo(student),

//     statistics: {
//       totalAssessments,
//       availableAssessments,
//       completedAssessments,
//       inProgressAssessments,
//       passedAssessments,
//       failedAssessments,
//       averageScore,
//     },

//     recentAttempts: formattedRecentAttempts,
//   };
// };











import mongoose from "mongoose";

import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import AssessmentAssignment from "../models/AssessmentAssignment.js";

/**
 * ============================================================
 * Helper: Validate MongoDB ObjectId
 * ============================================================
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * ============================================================
 * Helper: Get current student information
 * ============================================================
 */
const buildStudentInfo = (user) => {
  if (!user) {
    return null;
  }

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  const fullName =
    user.name ||
    `${firstName} ${lastName}`.trim() ||
    user.email ||
    "Student";

  return {
    id: user._id,
    name: fullName,
    firstName,
    lastName,
    email: user.email || "",
    role: user.role || "STUDENT",

    avatar:
      user.avatar ||
      user.profileImage ||
      user.profilePicture ||
      null,
  };
};

/**
 * ============================================================
 * Get Student Dashboard
 * ============================================================
 */
export const getStudentDashboard = async (studentId) => {
  /**
   * ----------------------------------------------------------
   * 1. Validate Student ID
   * ----------------------------------------------------------
   */
  if (!studentId || !isValidObjectId(studentId)) {
    throw new Error("Invalid student ID.");
  }

  /**
   * ----------------------------------------------------------
   * 2. Get Student Information
   * ----------------------------------------------------------
   */
  const student = await User.findById(studentId).lean();

  if (!student) {
    throw new Error("Student not found.");
  }

  /**
   * ----------------------------------------------------------
   * 3. Current Date
   * ----------------------------------------------------------
   */
  const now = new Date();

  /**
   * ----------------------------------------------------------
   * 4. Get Student Assessment Assignments
   * ----------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Student should NOT see every published assessment.
   *
   * Student can only access assessments assigned to them.
   *
   * Assignment status:
   *
   * ASSIGNED
   * STARTED
   * COMPLETED
   *
   * are valid assignment records.
   *
   * REVOKED
   * EXPIRED
   *
   * are not considered active assignments.
   * ----------------------------------------------------------
   */

  const studentAssignments =
    await AssessmentAssignment.find({
      student: studentId,

      status: {
        $in: [
          "ASSIGNED",
          "STARTED",
          "COMPLETED",
        ],
      },
    })
      .select(
        "assessment status availableFrom dueDate maxAttempts assignedAt"
      )
      .lean();

  /**
   * ----------------------------------------------------------
   * 5. Get Assigned Assessment IDs
   * ----------------------------------------------------------
   */
  const assignedAssessmentIds =
    studentAssignments
      .map((assignment) => assignment.assessment)
      .filter(Boolean);

  /**
   * ----------------------------------------------------------
   * 6. Total Assigned Published Assessments
   * ----------------------------------------------------------
   *
   * Only assessments:
   *
   * 1. Assigned to this student
   * 2. Published
   * 3. Not expired by assignment dueDate
   *
   * are counted.
   * ----------------------------------------------------------
   */

  let totalAssessments = 0;

  if (assignedAssessmentIds.length > 0) {
    totalAssessments =
      await Assessment.countDocuments({
        _id: {
          $in: assignedAssessmentIds,
        },

        status: "PUBLISHED",

        $or: [
          {
            endDate: {
              $exists: false,
            },
          },
          {
            endDate: null,
          },
          {
            endDate: {
              $gte: now,
            },
          },
        ],
      });
  }

  /**
   * ----------------------------------------------------------
   * 7. Available Assigned Assessments
   * ----------------------------------------------------------
   *
   * Assessment must satisfy:
   *
   * Assessment:
   * - PUBLISHED
   * - startDate <= now OR no startDate
   * - endDate >= now OR no endDate
   *
   * Assignment:
   * - ASSIGNED / STARTED / COMPLETED
   * - availableFrom <= now OR no availableFrom
   * - dueDate >= now OR no dueDate
   *
   * ----------------------------------------------------------
   */

  let availableAssessments = 0;

  if (studentAssignments.length > 0) {
    const availableAssignmentIds =
      studentAssignments
        .filter((assignment) => {
          /**
           * ----------------------------------------------
           * Check Assignment Available From
           * ----------------------------------------------
           */
          if (
            assignment.availableFrom &&
            new Date(assignment.availableFrom) > now
          ) {
            return false;
          }

          /**
           * ----------------------------------------------
           * Check Assignment Due Date
           * ----------------------------------------------
           */
          if (
            assignment.dueDate &&
            new Date(assignment.dueDate) < now
          ) {
            return false;
          }

          return true;
        })
        .map((assignment) => assignment.assessment)
        .filter(Boolean);

    if (availableAssignmentIds.length > 0) {
      availableAssessments =
        await Assessment.countDocuments({
          _id: {
            $in: availableAssignmentIds,
          },

          status: "PUBLISHED",

          /**
           * Assessment Start Date
           */
          $and: [
            {
              $or: [
                {
                  startDate: {
                    $exists: false,
                  },
                },
                {
                  startDate: null,
                },
                {
                  startDate: {
                    $lte: now,
                  },
                },
              ],
            },

            /**
             * Assessment End Date
             */
            {
              $or: [
                {
                  endDate: {
                    $exists: false,
                  },
                },
                {
                  endDate: null,
                },
                {
                  endDate: {
                    $gte: now,
                  },
                },
              ],
            },
          ],
        });
    }
  }

  /**
   * ----------------------------------------------------------
   * 8. Attempt Statistics
   * ----------------------------------------------------------
   */
  const attemptStatistics =
    await AssessmentAttempt.aggregate([
      {
        $match: {
          student:
            new mongoose.Types.ObjectId(studentId),
        },
      },

      {
        $group: {
          _id: null,

          /**
           * ------------------------------------------------
           * Completed Assessments
           * ------------------------------------------------
           */
          completedAssessments: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    [
                      "SUBMITTED",
                      "AUTO_SUBMITTED",
                    ],
                  ],
                },
                1,
                0,
              ],
            },
          },

          /**
           * ------------------------------------------------
           * In Progress Assessments
           * ------------------------------------------------
           */
          inProgressAssessments: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "IN_PROGRESS",
                  ],
                },
                1,
                0,
              ],
            },
          },

          /**
           * ------------------------------------------------
           * Passed Assessments
           * ------------------------------------------------
           */
          passedAssessments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $in: [
                        "$status",
                        [
                          "SUBMITTED",
                          "AUTO_SUBMITTED",
                        ],
                      ],
                    },

                    {
                      $eq: [
                        "$passed",
                        true,
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },

          /**
           * ------------------------------------------------
           * Failed Assessments
           * ------------------------------------------------
           */
          failedAssessments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $in: [
                        "$status",
                        [
                          "SUBMITTED",
                          "AUTO_SUBMITTED",
                        ],
                      ],
                    },

                    {
                      $eq: [
                        "$passed",
                        false,
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },

          /**
           * ------------------------------------------------
           * Total Percentage
           * ------------------------------------------------
           */
          totalPercentage: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $in: [
                        "$status",
                        [
                          "SUBMITTED",
                          "AUTO_SUBMITTED",
                        ],
                      ],
                    },

                    {
                      $ne: [
                        "$percentage",
                        null,
                      ],
                    },
                  ],
                },

                "$percentage",

                0,
              ],
            },
          },

          /**
           * ------------------------------------------------
           * Percentage Count
           * ------------------------------------------------
           */
          percentageCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $in: [
                        "$status",
                        [
                          "SUBMITTED",
                          "AUTO_SUBMITTED",
                        ],
                      ],
                    },

                    {
                      $ne: [
                        "$percentage",
                        null,
                      ],
                    },
                  ],
                },

                1,

                0,
              ],
            },
          },
        },
      },
    ]);

  /**
   * ----------------------------------------------------------
   * 9. Prepare Statistics
   * ----------------------------------------------------------
   */
  const statistics =
    attemptStatistics[0] || {};

  const completedAssessments =
    statistics.completedAssessments || 0;

  const inProgressAssessments =
    statistics.inProgressAssessments || 0;

  const passedAssessments =
    statistics.passedAssessments || 0;

  const failedAssessments =
    statistics.failedAssessments || 0;

  /**
   * ----------------------------------------------------------
   * 10. Average Score
   * ----------------------------------------------------------
   */
  const averageScore =
    statistics.percentageCount > 0
      ? Number(
          (
            statistics.totalPercentage /
            statistics.percentageCount
          ).toFixed(2)
        )
      : 0;

  /**
   * ----------------------------------------------------------
   * 11. Recent Attempts
   * ----------------------------------------------------------
   */
  const recentAttempts =
    await AssessmentAttempt.find({
      student: studentId,
    })
      .populate({
        path: "assessment",

        select:
          "title description durationMinutes totalMarks passingMarks",
      })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

  /**
   * ----------------------------------------------------------
   * 12. Format Recent Attempts
   * ----------------------------------------------------------
   */
  const formattedRecentAttempts =
    recentAttempts.map((attempt) => ({
      /**
       * Attempt ID
       */
      id: attempt._id,

      /**
       * Attempt Number
       */
      attemptNumber:
        attempt.attemptNumber,

      /**
       * Attempt Status
       */
      status:
        attempt.status,

      /**
       * Result Status
       */
      resultStatus:
        attempt.resultStatus ||
        "NOT_SUBMITTED",

      /**
       * Assessment
       */
      assessment:
        attempt.assessment
          ? {
              id:
                attempt.assessment._id,

              title:
                attempt.assessment.title,

              description:
                attempt.assessment.description ||
                "",

              durationMinutes:
                attempt.assessment
                  .durationMinutes ||
                0,

              totalMarks:
                attempt.assessment
                  .totalMarks ||
                0,

              passingMarks:
                attempt.assessment
                  .passingMarks ||
                0,
            }
          : null,

      /**
       * Score
       */
      score:
        typeof attempt.score ===
        "number"
          ? attempt.score
          : 0,

      /**
       * Total Marks
       */
      totalMarks:
        typeof attempt.totalMarks ===
        "number"
          ? attempt.totalMarks
          : 0,

      /**
       * Percentage
       */
      percentage:
        typeof attempt.percentage ===
        "number"
          ? attempt.percentage
          : 0,

      /**
       * Passed
       */
      passed:
        attempt.passed === true,

      /**
       * Started At
       */
      startedAt:
        attempt.startedAt || null,

      /**
       * Submitted At
       */
      submittedAt:
        attempt.submittedAt || null,

      /**
       * Expires At
       */
      expiresAt:
        attempt.expiresAt || null,

      /**
       * Total Questions
       */
      totalQuestions:
        attempt.totalQuestions || 0,

      /**
       * Answered Questions
       */
      answeredQuestions:
        attempt.answeredQuestions || 0,

      /**
       * Correct Answers
       */
      correctAnswers:
        attempt.correctAnswers || 0,

      /**
       * Wrong Answers
       */
      wrongAnswers:
        attempt.wrongAnswers || 0,

      /**
       * Unanswered Questions
       */
      unansweredQuestions:
        attempt.unansweredQuestions || 0,

      /**
       * Manual Review
       */
      manualReviewPending:
        attempt.manualReviewPending ===
        true,
    }));

  /**
   * ----------------------------------------------------------
   * 13. Final Dashboard Response
   * ----------------------------------------------------------
   */
  return {
    student:
      buildStudentInfo(student),

    statistics: {
      /**
       * IMPORTANT:
       * This is now only assigned assessments.
       */
      totalAssessments,

      /**
       * IMPORTANT:
       * This is now only assigned + currently available
       * assessments.
       */
      availableAssessments,

      completedAssessments,

      inProgressAssessments,

      passedAssessments,

      failedAssessments,

      averageScore,
    },

    recentAttempts:
      formattedRecentAttempts,
  };
};