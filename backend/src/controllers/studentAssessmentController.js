
// import mongoose from "mongoose";

// import Assessment from "../models/Assessment.js";
// import Question from "../models/Question.js";


// // ======================================================
// // GET PUBLISHED ASSESSMENTS FOR STUDENT
// // GET /api/student/assessments
// // ======================================================

// export const getStudentAssessments = async (
//   req,
//   res
// ) => {
//   try {

//     const {
//       search = "",
//       page = 1,
//       limit = 10,
//     } = req.query;


//     const currentPage = Math.max(
//       parseInt(page, 10) || 1,
//       1
//     );


//     const perPage = Math.min(
//       Math.max(
//         parseInt(limit, 10) || 10,
//         1
//       ),
//       100
//     );


//     const query = {
//       status: "PUBLISHED",
//     };


//     // ==================================================
//     // SEARCH
//     // ==================================================

//     if (
//       search &&
//       typeof search === "string"
//     ) {

//       query.$or = [
//         {
//           title: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           description: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//       ];

//     }


//     // ==================================================
//     // PAGINATION
//     // ==================================================

//     const skip =
//       (currentPage - 1) *
//       perPage;


//     const [
//       assessments,
//       total,
//     ] = await Promise.all([

//       Assessment.find(query)
//         .sort({
//           createdAt: -1,
//         })
//         .skip(skip)
//         .limit(perPage)
//         .lean(),

//       Assessment.countDocuments(query),

//     ]);


//     // ==================================================
//     // ADD QUESTION COUNT
//     // ==================================================

//     const assessmentIds =
//       assessments.map(
//         (assessment) =>
//           assessment._id
//       );


//     const questionCounts =
//       await Question.aggregate([

//         {
//           $match: {
//             assessmentId: {
//               $in: assessmentIds,
//             },
//           },
//         },

//         {
//           $group: {
//             _id: "$assessmentId",
//             count: {
//               $sum: 1,
//             },
//           },
//         },

//       ]);


//     const countMap = new Map();


//     questionCounts.forEach(
//       (item) => {

//         countMap.set(
//           item._id.toString(),
//           item.count
//         );

//       }
//     );


//     const formattedAssessments =
//       assessments.map(
//         (assessment) => ({

//           ...assessment,

//           questionCount:
//             countMap.get(
//               assessment._id.toString()
//             ) || 0,

//         })
//       );


//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     return res.status(200).json({

//       success: true,

//       message:
//         "Student assessments fetched successfully",

//       data: formattedAssessments,

//       pagination: {

//         total,

//         page: currentPage,

//         limit: perPage,

//         totalPages:
//           total === 0
//             ? 0
//             : Math.ceil(
//                 total / perPage
//               ),

//       },

//     });

//   } catch (error) {

//     console.error(
//       "Get Student Assessments Error:",
//       error
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         error.message ||
//         "Failed to fetch student assessments",

//     });

//   }
// };


// // ======================================================
// // GET STUDENT ASSESSMENT DETAILS
// // GET /api/student/assessments/:id
// // ======================================================

// export const getStudentAssessmentDetails =
//   async (req, res) => {

//     try {

//       const {
//         id,
//       } = req.params;


//       // ==================================================
//       // VALIDATE ID
//       // ==================================================

//       if (
//         !mongoose.Types.ObjectId.isValid(id)
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Invalid assessment ID",

//         });

//       }


//       // ==================================================
//       // ONLY PUBLISHED ASSESSMENTS
//       // ==================================================

//       const assessment =
//         await Assessment.findOne({

//           _id: id,

//           status: "PUBLISHED",

//         }).lean();


//       if (!assessment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Published assessment not found",

//         });

//       }


//       // ==================================================
//       // QUESTION COUNT
//       // ==================================================

//       const questionCount =
//         await Question.countDocuments({

//           assessmentId:
//             assessment._id,

//         });


//       // ==================================================
//       // RESPONSE
//       // ==================================================

//       return res.status(200).json({

//         success: true,

//         message:
//           "Assessment details fetched successfully",

//         data: {

//           ...assessment,

//           questionCount,

//         },

//       });

//     } catch (error) {

//       console.error(
//         "Get Student Assessment Details Error:",
//         error
//       );

//       return res.status(500).json({

//         success: false,

//         message:
//           error.message ||
//           "Failed to fetch assessment details",

//       });

//     }

//   };








import mongoose from "mongoose";

import Assessment from "../models/Assessment.js";
import Question from "../models/Question.js";
import AssessmentAssignment from "../models/AssessmentAssignment.js";

// ======================================================
// GET PUBLISHED ASSESSMENTS ASSIGNED TO CURRENT STUDENT
// GET /api/student/assessments
// ======================================================
//
// IMPORTANT:
//
// Published assessment alone is NOT enough.
//
// Student must have an AssessmentAssignment record.
//
// Example:
//
// Java Developer -> PUBLISHED
//
// Lithin -> ASSIGNED
// Aslam  -> NOT ASSIGNED
//
// Result:
//
// Lithin -> sees Java Developer
// Aslam  -> does NOT see Java Developer
//
// ======================================================

export const getStudentAssessments = async (
  req,
  res
) => {
  try {
    // ==================================================
    // 1. GET CURRENT LOGGED-IN STUDENT
    // ==================================================

    const studentId =
      req.user?._id ||
      req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ==================================================
    // 2. VALIDATE STUDENT ID
    // ==================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        studentId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid student ID.",
      });
    }

    // ==================================================
    // 3. QUERY PARAMETERS
    // ==================================================

    const {
      search = "",
      page = 1,
      limit = 10,
    } = req.query;

    // ==================================================
    // 4. PAGINATION
    // ==================================================

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        parseInt(limit, 10) || 10,
        1
      ),
      100
    );

    // ==================================================
    // 5. FIND ASSESSMENTS ASSIGNED TO THIS STUDENT
    // ==================================================
    //
    // Only these assignment statuses allow the
    // assessment to appear:
    //
    // ASSIGNED
    // STARTED
    // COMPLETED
    //
    // REVOKED and EXPIRED are intentionally excluded.
    //
    // ==================================================

    const assignments =
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
          "assessment status assignedAt availableFrom dueDate maxAttempts notes"
        )
        .lean();

    // ==================================================
    // 6. GET ASSESSMENT IDS
    // ==================================================

    const assessmentIds =
      assignments
        .map(
          (assignment) =>
            assignment.assessment
        )
        .filter(Boolean);

    // ==================================================
    // 7. NO ASSIGNMENTS
    // ==================================================
    //
    // This is important.
    //
    // If Aslam has no assignment:
    //
    // assessmentIds = []
    //
    // Therefore Aslam receives:
    //
    // data: []
    //
    // and Java Developer will NOT appear.
    //
    // ==================================================

    if (assessmentIds.length === 0) {
      return res.status(200).json({
        success: true,

        message:
          "Student assessments fetched successfully",

        data: [],

        pagination: {
          total: 0,
          page: currentPage,
          limit: perPage,
          totalPages: 0,
        },
      });
    }

    // ==================================================
    // 8. BUILD ASSESSMENT QUERY
    // ==================================================
    //
    // IMPORTANT:
    //
    // Assessment must satisfy BOTH:
    //
    // 1. _id belongs to student's assignment
    // 2. status = PUBLISHED
    //
    // This prevents published assessments assigned
    // to another student from appearing.
    //
    // ==================================================

    const query = {
      _id: {
        $in: assessmentIds,
      },

      status: "PUBLISHED",
    };

    // ==================================================
    // 9. SEARCH
    // ==================================================

    if (
      search &&
      typeof search === "string"
    ) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ==================================================
    // 10. PAGINATION
    // ==================================================

    const skip =
      (currentPage - 1) *
      perPage;

    // ==================================================
    // 11. GET ASSESSMENTS + TOTAL
    // ==================================================

    const [
      assessments,
      total,
    ] = await Promise.all([
      Assessment.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Assessment.countDocuments(
        query
      ),
    ]);

    // ==================================================
    // 12. QUESTION IDS
    // ==================================================

    const fetchedAssessmentIds =
      assessments.map(
        (assessment) =>
          assessment._id
      );

    // ==================================================
    // 13. QUESTION COUNT
    // ==================================================
    //
    // IMPORTANT:
    //
    // Question model uses:
    //
    // assessment
    //
    // NOT:
    //
    // assessmentId
    //
    // Also only PUBLISHED questions are counted.
    //
    // ==================================================

    let questionCounts = [];

    if (
      fetchedAssessmentIds.length >
      0
    ) {
      questionCounts =
        await Question.aggregate([
          {
            $match: {
              assessment: {
                $in:
                  fetchedAssessmentIds,
              },

              status: "PUBLISHED",
            },
          },

          {
            $group: {
              _id: "$assessment",

              count: {
                $sum: 1,
              },
            },
          },
        ]);
    }

    // ==================================================
    // 14. CREATE QUESTION COUNT MAP
    // ==================================================

    const countMap =
      new Map();

    questionCounts.forEach(
      (item) => {
        countMap.set(
          item._id.toString(),
          item.count
        );
      }
    );

    // ==================================================
    // 15. CREATE ASSIGNMENT MAP
    // ==================================================
    //
    // This lets us return assignment information
    // along with each assessment.
    //
    // ==================================================

    const assignmentMap =
      new Map();

    assignments.forEach(
      (assignment) => {
        if (
          assignment.assessment
        ) {
          assignmentMap.set(
            assignment.assessment.toString(),
            assignment
          );
        }
      }
    );

    // ==================================================
    // 16. FORMAT ASSESSMENTS
    // ==================================================

    const formattedAssessments =
      assessments.map(
        (assessment) => {
          const assessmentId =
            assessment._id.toString();

          const assignment =
            assignmentMap.get(
              assessmentId
            );

          return {
            ...assessment,

            // ------------------------------------------
            // Question count
            // ------------------------------------------

            questionCount:
              countMap.get(
                assessmentId
              ) || 0,

            // ------------------------------------------
            // Assignment information
            // ------------------------------------------

            assignment: assignment
              ? {
                  id:
                    assignment._id,

                  status:
                    assignment.status,

                  assignedAt:
                    assignment.assignedAt ||
                    null,

                  availableFrom:
                    assignment.availableFrom ||
                    null,

                  dueDate:
                    assignment.dueDate ||
                    null,

                  maxAttempts:
                    assignment.maxAttempts ||
                    null,

                  notes:
                    assignment.notes ||
                    "",
                }
              : null,
          };
        }
      );

    // ==================================================
    // 17. RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Student assessments fetched successfully",

      data: formattedAssessments,

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
    });
  } catch (error) {
    console.error(
      "Get Student Assessments Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch student assessments",
    });
  }
};

// ======================================================
// GET STUDENT ASSESSMENT DETAILS
// GET /api/student/assessments/:id
// ======================================================
//
// IMPORTANT:
//
// A student must be assigned to the assessment.
//
// This prevents a student from manually opening:
//
// /student/assessments/<some-other-assessment-id>
//
// ======================================================

export const getStudentAssessmentDetails =
  async (req, res) => {
    try {
      // ==================================================
      // 1. GET CURRENT STUDENT
      // ==================================================

      const studentId =
        req.user?._id ||
        req.user?.id;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      // ==================================================
      // 2. GET ASSESSMENT ID
      // ==================================================

      const {
        id,
      } = req.params;

      // ==================================================
      // 3. VALIDATE STUDENT ID
      // ==================================================

      if (
        !mongoose.Types.ObjectId.isValid(
          studentId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid student ID.",
        });
      }

      // ==================================================
      // 4. VALIDATE ASSESSMENT ID
      // ==================================================

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid assessment ID",
        });
      }

      // ==================================================
      // 5. CHECK ASSIGNMENT
      // ==================================================
      //
      // IMPORTANT:
      //
      // Student must have an active assignment.
      //
      // ==================================================

      const assignment =
        await AssessmentAssignment.findOne(
          {
            student: studentId,

            assessment: id,

            status: {
              $in: [
                "ASSIGNED",
                "STARTED",
                "COMPLETED",
              ],
            },
          }
        )
          .select(
            "status assignedAt availableFrom dueDate maxAttempts notes"
          )
          .lean();

      // ==================================================
      // 6. NOT ASSIGNED
      // ==================================================

      if (!assignment) {
        return res.status(403).json({
          success: false,

          message:
            "You are not assigned to this assessment.",
        });
      }

      // ==================================================
      // 7. GET ONLY PUBLISHED ASSESSMENT
      // ==================================================

      const assessment =
        await Assessment.findOne({
          _id: id,

          status: "PUBLISHED",
        }).lean();

      // ==================================================
      // 8. ASSESSMENT NOT FOUND
      // ==================================================

      if (!assessment) {
        return res.status(404).json({
          success: false,

          message:
            "Published assessment not found",
        });
      }

      // ==================================================
      // 9. CHECK ASSIGNMENT AVAILABLE FROM
      // ==================================================

      const now =
        new Date();

      if (
        assignment.availableFrom &&
        now <
          new Date(
            assignment.availableFrom
          )
      ) {
        return res.status(403).json({
          success: false,

          message:
            "This assessment is not available yet.",

          code:
            "ASSESSMENT_NOT_AVAILABLE",

          availableFrom:
            assignment.availableFrom,
        });
      }

      // ==================================================
      // 10. CHECK ASSIGNMENT DUE DATE
      // ==================================================

      if (
        assignment.dueDate &&
        now >
          new Date(
            assignment.dueDate
          )
      ) {
        return res.status(403).json({
          success: false,

          message:
            "Your assessment assignment has expired.",

          code:
            "ASSESSMENT_ASSIGNMENT_EXPIRED",

          dueDate:
            assignment.dueDate,
        });
      }

      // ==================================================
      // 11. CHECK ASSESSMENT START DATE
      // ==================================================

      if (
        assessment.startDate &&
        now <
          new Date(
            assessment.startDate
          )
      ) {
        return res.status(403).json({
          success: false,

          message:
            "This assessment is not available yet.",

          code:
            "ASSESSMENT_NOT_STARTED",

          startDate:
            assessment.startDate,
        });
      }

      // ==================================================
      // 12. CHECK ASSESSMENT END DATE
      // ==================================================

      if (
        assessment.endDate &&
        now >
          new Date(
            assessment.endDate
          )
      ) {
        return res.status(403).json({
          success: false,

          message:
            "This assessment has expired.",

          code:
            "ASSESSMENT_EXPIRED",

          endDate:
            assessment.endDate,
        });
      }

      // ==================================================
      // 13. QUESTION COUNT
      // ==================================================
      //
      // IMPORTANT:
      //
      // Question model uses:
      //
      // assessment
      //
      // NOT:
      //
      // assessmentId
      //
      // Only published questions are counted.
      //
      // ==================================================

      const questionCount =
        await Question.countDocuments({
          assessment:
            assessment._id,

          status: "PUBLISHED",
        });

      // ==================================================
      // 14. RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        message:
          "Assessment details fetched successfully",

        data: {
          ...assessment,

          questionCount,

          assignment: {
            id:
              assignment._id,

            status:
              assignment.status,

            assignedAt:
              assignment.assignedAt ||
              null,

            availableFrom:
              assignment.availableFrom ||
              null,

            dueDate:
              assignment.dueDate ||
              null,

            maxAttempts:
              assignment.maxAttempts ||
              null,

            notes:
              assignment.notes ||
              "",
          },
        },
      });
    } catch (error) {
      console.error(
        "Get Student Assessment Details Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to fetch assessment details",
      });
    }
  };