// import mongoose from "mongoose";
// import User from "../models/User.js";

// /**
//  * ======================================================
//  * GET ALL STUDENTS
//  * ======================================================
//  */
// export async function getAllStudents({
//   page = 1,
//   limit = 10,
//   search = "",
//   status = "",
// }) {
//   const currentPage = Math.max(Number(page) || 1, 1);
//   const perPage = Math.min(
//     Math.max(Number(limit) || 10, 1),
//     100
//   );

//   const skip = (currentPage - 1) * perPage;

//   const filter = {
//     role: "STUDENT",
//   };

//   // ----------------------------------------------------
//   // Search
//   // ----------------------------------------------------

//   if (search && search.trim()) {
//     const searchValue = search.trim();

//     filter.$or = [
//       {
//         name: {
//           $regex: searchValue,
//           $options: "i",
//         },
//       },
//       {
//         email: {
//           $regex: searchValue,
//           $options: "i",
//         },
//       },
//       {
//         phone: {
//           $regex: searchValue,
//           $options: "i",
//         },
//       },
//     ];
//   }

//   // ----------------------------------------------------
//   // Status filter
//   // ----------------------------------------------------

//   if (status === "ACTIVE") {
//     filter.isActive = true;
//     filter.isSuspended = false;
//   }

//   if (status === "INACTIVE") {
//     filter.isActive = false;
//   }

//   if (status === "SUSPENDED") {
//     filter.isSuspended = true;
//   }

//   // ----------------------------------------------------
//   // Query
//   // ----------------------------------------------------

//   const [students, totalStudents] =
//     await Promise.all([
//       User.find(filter)
//         .select(
//           "_id name email phone role profileImage isEmailVerified isActive isSuspended lastLogin createdAt updatedAt"
//         )
//         .sort({
//           createdAt: -1,
//         })
//         .skip(skip)
//         .limit(perPage)
//         .lean(),

//       User.countDocuments(filter),
//     ]);

//   const totalPages = Math.ceil(
//     totalStudents / perPage
//   );

//   return {
//     students,

//     pagination: {
//       currentPage,
//       limit: perPage,
//       totalStudents,
//       totalPages,
//       hasNextPage:
//         currentPage < totalPages,
//       hasPreviousPage:
//         currentPage > 1,
//     },
//   };
// }


// /**
//  * ======================================================
//  * GET SINGLE STUDENT
//  * ======================================================
//  */
// export async function getStudentById(studentId) {
//   if (
//     !mongoose.Types.ObjectId.isValid(studentId)
//   ) {
//     const error = new Error(
//       "Invalid student ID."
//     );

//     error.statusCode = 400;

//     throw error;
//   }

//   const student = await User.findOne({
//     _id: studentId,
//     role: "STUDENT",
//   })
//     .select(
//       "_id name email phone role profileImage isEmailVerified isActive isSuspended lastLogin createdAt updatedAt"
//     )
//     .lean();

//   if (!student) {
//     const error = new Error(
//       "Student not found."
//     );

//     error.statusCode = 404;

//     throw error;
//   }

//   return student;
// }




import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * ======================================================
 * HELPER: CREATE ERROR
 * ======================================================
 */
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * ======================================================
 * HELPER: ESCAPE REGEX
 * ======================================================
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * ======================================================
 * GET ALL STUDENTS + FILTERS + COUNTS
 *
 * Supports:
 * - Pagination
 * - Search
 * - Status
 * - IT / NON-IT
 * - Education Level
 * - Course Name
 * - Branch / Specialization
 * - College Name
 * - Dashboard counts
 * ======================================================
 */
export async function getAllStudents({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  studentCategory = "",
  educationLevel = "",
  courseName = "",
  branch = "",
  collegeName = "",
}) {
  const currentPage = Math.max(Number(page) || 1, 1);

  const perPage = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const skip = (currentPage - 1) * perPage;

  // ----------------------------------------------------
  // BASE FILTER: STUDENTS ONLY
  // ----------------------------------------------------

  const filter = {
    role: "STUDENT",
  };

  // ----------------------------------------------------
  // SEARCH FILTER
  // ----------------------------------------------------

  if (search && String(search).trim()) {
    const searchValue = escapeRegex(
      String(search).trim()
    );

    filter.$or = [
      {
        name: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }

  // ----------------------------------------------------
  // STATUS FILTER
  // ----------------------------------------------------

  if (status === "ACTIVE") {
    filter.isActive = true;
    filter.isSuspended = false;
  }

  if (status === "INACTIVE") {
    filter.isActive = false;
  }

  if (status === "SUSPENDED") {
    filter.isSuspended = true;
  }

  // ----------------------------------------------------
  // STUDENT CATEGORY FILTER
  // IT / NON_IT
  // ----------------------------------------------------

  if (studentCategory) {
    filter.studentCategory = studentCategory;
  }

  // ----------------------------------------------------
  // EDUCATION LEVEL FILTER
  // UNDERGRADUATE / POSTGRADUATE
  // ----------------------------------------------------

  if (educationLevel) {
    filter.educationLevel = educationLevel;
  }

  // ----------------------------------------------------
  // COURSE NAME FILTER
  // ----------------------------------------------------

  if (courseName && String(courseName).trim()) {
    filter.courseName = {
      $regex: escapeRegex(String(courseName).trim()),
      $options: "i",
    };
  }

  // ----------------------------------------------------
  // BRANCH / SPECIALIZATION FILTER
  // ----------------------------------------------------

  if (branch && String(branch).trim()) {
    filter.branch = {
      $regex: escapeRegex(String(branch).trim()),
      $options: "i",
    };
  }

  // ----------------------------------------------------
  // COLLEGE NAME FILTER
  // ----------------------------------------------------

  if (collegeName && String(collegeName).trim()) {
    filter.collegeName = {
      $regex: escapeRegex(String(collegeName).trim()),
      $options: "i",
    };
  }

  // ----------------------------------------------------
  // STUDENT FIELDS
  // ----------------------------------------------------

  const studentFields = [
    "_id",
    "name",
    "email",
    "phone",
    "role",
    "profileImage",
    "studentCategory",
    "educationLevel",
    "courseName",
    "branch",
    "collegeName",
    "address",
    "isEmailVerified",
    "isActive",
    "isSuspended",
    "lastLogin",
    "createdAt",
    "updatedAt",
  ].join(" ");

  // ----------------------------------------------------
  // FETCH STUDENTS + FILTERED COUNT + GLOBAL SUMMARY
  // ----------------------------------------------------

  const [
    students,
    filteredStudents,
    summaryResult,
    courseWiseCounts,
    specializationWiseCounts,
  ] = await Promise.all([
    // Paginated students using all active filters
    User.find(filter)
      .select(studentFields)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage)
      .lean(),

    // Total matching the current filters
    User.countDocuments(filter),

    // Overall category and education counts
    // Independent of search, status and category filters
    User.aggregate([
      {
        $match: {
          role: "STUDENT",
        },
      },
      {
        $group: {
          _id: null,

          totalStudents: {
            $sum: 1,
          },

          itStudents: {
            $sum: {
              $cond: [
                {
                  $eq: ["$studentCategory", "IT"],
                },
                1,
                0,
              ],
            },
          },

          nonItStudents: {
            $sum: {
              $cond: [
                {
                  $eq: ["$studentCategory", "NON_IT"],
                },
                1,
                0,
              ],
            },
          },

          undergraduateStudents: {
            $sum: {
              $cond: [
                {
                  $eq: ["$educationLevel", "UNDERGRADUATE"],
                },
                1,
                0,
              ],
            },
          },

          postgraduateStudents: {
            $sum: {
              $cond: [
                {
                  $eq: ["$educationLevel", "POSTGRADUATE"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),

    // Course-wise student count
    User.aggregate([
      {
        $match: {
          role: "STUDENT",
          courseName: {
            $exists: true,
            $nin: ["", null],
          },
        },
      },
      {
        $group: {
          _id: "$courseName",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
          _id: 1,
        },
      },
    ]),

    // Branch / specialization-wise student count
    User.aggregate([
      {
        $match: {
          role: "STUDENT",
          branch: {
            $exists: true,
            $nin: ["", null],
          },
        },
      },
      {
        $group: {
          _id: "$branch",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
          _id: 1,
        },
      },
    ]),
  ]);

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------

  const summary = summaryResult[0] || {
    totalStudents: 0,
    itStudents: 0,
    nonItStudents: 0,
    undergraduateStudents: 0,
    postgraduateStudents: 0,
  };

  // ----------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------

  const totalPages = Math.ceil(
    filteredStudents / perPage
  );

  return {
    students,

    // Dashboard counts across all student accounts
    summary: {
      totalStudents: summary.totalStudents,
      itStudents: summary.itStudents,
      nonItStudents: summary.nonItStudents,
      undergraduateStudents:
        summary.undergraduateStudents,
      postgraduateStudents:
        summary.postgraduateStudents,
      courseWiseCounts,
      specializationWiseCounts,
    },

    // Number of records matching current filters
    pagination: {
      currentPage,
      limit: perPage,
      totalStudents: filteredStudents,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

/**
 * ======================================================
 * GET SINGLE STUDENT
 * ======================================================
 */
export async function getStudentById(studentId) {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw createError("Invalid student ID.", 400);
  }

  const student = await User.findOne({
    _id: studentId,
    role: "STUDENT",
  })
    .select(
      "_id name email phone role profileImage studentCategory educationLevel courseName branch collegeName address isEmailVerified isActive isSuspended lastLogin createdAt updatedAt"
    )
    .lean();

  if (!student) {
    throw createError("Student not found.", 404);
  }

  return student;
}

/**
 * ======================================================
 * DELETE SINGLE STUDENT
 * DELETE /api/admin/students/:studentId
 * ======================================================
 */
export async function deleteStudentById(studentId) {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw createError("Invalid student ID.", 400);
  }

  const deletedStudent = await User.findOneAndDelete({
    _id: studentId,
    role: "STUDENT",
  })
    .select("_id name email")
    .lean();

  if (!deletedStudent) {
    throw createError("Student not found.", 404);
  }

  return {
    deletedStudent,
  };
}

/**
 * ======================================================
 * DELETE ALL STUDENTS
 * DELETE /api/admin/students/all
 *
 * Only STUDENT accounts will be deleted.
 * ADMIN and SUPER_ADMIN accounts are protected.
 * ======================================================
 */
export async function deleteAllStudents() {
  const result = await User.deleteMany({
    role: "STUDENT",
  });

  return {
    deletedCount: result.deletedCount || 0,
  };
}
