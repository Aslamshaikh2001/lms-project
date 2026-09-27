// import mongoose from "mongoose";
// import Assessment from "../models/Assessment.js";


// // ========================================
// // CREATE ASSESSMENT
// // ========================================

// export const createAssessment = async (
//   data,
//   userId
// ) => {
//   const assessment =
//     await Assessment.create({
//       ...data,
//       createdBy: userId,
//     });

//   return assessment;
// };


// // ========================================
// // GET ALL ASSESSMENTS
// // ========================================

// export const getAssessments = async (
//   filters = {}
// ) => {
//   const {
//     search,
//     status,
//     course,
//     category,
//     page = 1,
//     limit = 10,
//   } = filters;

//   const query = {};


//   // Search
//   if (search) {
//     query.$or = [
//       {
//         title: {
//           $regex: search,
//           $options: "i",
//         },
//       },
//       {
//         description: {
//           $regex: search,
//           $options: "i",
//         },
//       },
//     ];
//   }


//   // Status
//   if (status) {
//     query.status = status;
//   }


//   // Course
//   if (course) {
//     if (
//       !mongoose.Types.ObjectId.isValid(course)
//     ) {
//       throw new Error(
//         "Invalid course ID"
//       );
//     }

//     query.course = course;
//   }


//   // Category
//   if (category) {
//     if (
//       !mongoose.Types.ObjectId.isValid(category)
//     ) {
//       throw new Error(
//         "Invalid category ID"
//       );
//     }

//     query.category = category;
//   }


//   // Pagination
//   const currentPage = Math.max(
//     Number(page) || 1,
//     1
//   );

//   const perPage = Math.min(
//     Math.max(Number(limit) || 10, 1),
//     100
//   );

//   const skip =
//     (currentPage - 1) * perPage;


//   const [
//     assessments,
//     total,
//   ] = await Promise.all([
//     Assessment.find(query)
//       .populate(
//         "course",
//         "title name"
//       )
//       .populate(
//         "category",
//         "name title"
//       )
//       .populate(
//         "createdBy",
//         "name email"
//       )
//       .populate(
//         "updatedBy",
//         "name email"
//       )
//       .sort({
//         createdAt: -1,
//       })
//       .skip(skip)
//       .limit(perPage),

//     Assessment.countDocuments(query),
//   ]);


//   return {
//     assessments,

//     pagination: {
//       total,
//       page: currentPage,
//       limit: perPage,
//       totalPages: Math.ceil(
//         total / perPage
//       ),
//     },
//   };
// };


// // ========================================
// // GET SINGLE ASSESSMENT
// // ========================================

// export const getAssessmentById =
//   async (id) => {

//     if (
//       !mongoose.Types.ObjectId.isValid(id)
//     ) {
//       throw new Error(
//         "Invalid assessment ID"
//       );
//     }


//     const assessment =
//       await Assessment.findById(id)
//         .populate(
//           "course",
//           "title name"
//         )
//         .populate(
//           "category",
//           "name title"
//         )
//         .populate(
//           "createdBy",
//           "name email"
//         )
//         .populate(
//           "updatedBy",
//           "name email"
//         );


//     if (!assessment) {
//       throw new Error(
//         "Assessment not found"
//       );
//     }


//     return assessment;
//   };


// // ========================================
// // UPDATE ASSESSMENT
// // ========================================

// export const updateAssessment =
//   async (
//     id,
//     data,
//     userId
//   ) => {

//     if (
//       !mongoose.Types.ObjectId.isValid(id)
//     ) {
//       throw new Error(
//         "Invalid assessment ID"
//       );
//     }


//     const assessment =
//       await Assessment.findById(id);


//     if (!assessment) {
//       throw new Error(
//         "Assessment not found"
//       );
//     }


//     // Don't allow createdBy to be changed
//     delete data.createdBy;


//     // Status has separate APIs
//     delete data.status;


//     Object.assign(
//       assessment,
//       data
//     );


//     assessment.updatedBy =
//       userId;


//     await assessment.save();


//     return assessment;
//   };


// // ========================================
// // DELETE ASSESSMENT
// // ========================================

// export const deleteAssessment =
//   async (id) => {

//     if (
//       !mongoose.Types.ObjectId.isValid(id)
//     ) {
//       throw new Error(
//         "Invalid assessment ID"
//       );
//     }


//     const assessment =
//       await Assessment.findById(id);


//     if (!assessment) {
//       throw new Error(
//         "Assessment not found"
//       );
//     }


//     await Assessment.findByIdAndDelete(
//       id
//     );


//     return {
//       message:
//         "Assessment deleted successfully",
//     };
//   };


// // ========================================
// // PUBLISH ASSESSMENT
// // ========================================

// export const publishAssessment =
//   async (
//     id,
//     userId
//   ) => {

//     if (
//       !mongoose.Types.ObjectId.isValid(id)
//     ) {
//       throw new Error(
//         "Invalid assessment ID"
//       );
//     }


//     const assessment =
//       await Assessment.findById(id);


//     if (!assessment) {
//       throw new Error(
//         "Assessment not found"
//       );
//     }


//     // ====================================
//     // Validate before publishing
//     // ====================================

//     if (!assessment.title) {
//       throw new Error(
//         "Assessment title is required before publishing"
//       );
//     }


//     if (!assessment.course) {
//       throw new Error(
//         "Course is required before publishing"
//       );
//     }


//     if (
//       !assessment.durationMinutes
//     ) {
//       throw new Error(
//         "Assessment duration is required before publishing"
//       );
//     }


//     if (
//       !assessment.totalMarks
//     ) {
//       throw new Error(
//         "Total marks are required before publishing"
//       );
//     }


//     if (
//       assessment.passingMarks ===
//         undefined ||
//       assessment.passingMarks ===
//         null
//     ) {
//       throw new Error(
//         "Passing marks are required before publishing"
//       );
//     }


//     if (
//       assessment.passingMarks >
//       assessment.totalMarks
//     ) {
//       throw new Error(
//         "Passing marks cannot be greater than total marks"
//       );
//     }


//     // ====================================
//     // Publish
//     // ====================================

//     assessment.status =
//       "PUBLISHED";

//     assessment.updatedBy =
//       userId;


//     await assessment.save();


//     return assessment;
//   };


// // ========================================
// // UNPUBLISH ASSESSMENT
// // ========================================

// export const unpublishAssessment =
//   async (
//     id,
//     userId
//   ) => {

//     if (
//       !mongoose.Types.ObjectId.isValid(id)
//     ) {
//       throw new Error(
//         "Invalid assessment ID"
//       );
//     }


//     const assessment =
//       await Assessment.findById(id);


//     if (!assessment) {
//       throw new Error(
//         "Assessment not found"
//       );
//     }


//     assessment.status =
//       "UNPUBLISHED";

//     assessment.updatedBy =
//       userId;


//     await assessment.save();


//     return assessment;
//   };



import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";

// ========================================
// CREATE ASSESSMENT
// ========================================

export const createAssessment = async (data, userId) => {
  if (!userId) {
    throw new Error("User authentication required");
  }

  // Only allow assessment fields
  const assessmentData = {
    title: data.title,
    description: data.description || "",
    durationMinutes: data.durationMinutes,
    totalMarks: data.totalMarks,
    passingMarks: data.passingMarks,
    maxAttempts: data.maxAttempts ?? 1,
    randomizeQuestions: data.randomizeQuestions ?? false,
    shuffleOptions: data.shuffleOptions ?? false,
    negativeMarking: data.negativeMarking ?? false,
    negativeMarks: data.negativeMarks ?? 0,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    instructions: data.instructions || "",
    createdBy: userId,
  };

  const assessment = await Assessment.create(
    assessmentData
  );

  return assessment;
};

// ========================================
// GET ALL ASSESSMENTS
// ========================================

export const getAssessments = async (filters = {}) => {
  const {
    search = "",
    status,
    page = 1,
    limit = 10,
  } = filters;

  const query = {};

  // ========================================
  // SEARCH
  // ========================================

  if (
    search &&
    typeof search === "string" &&
    search.trim()
  ) {
    query.$or = [
      {
        title: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        description: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  // ========================================
  // STATUS
  // ========================================

  if (status) {
    const allowedStatuses = [
      "DRAFT",
      "PUBLISHED",
      "UNPUBLISHED",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid assessment status");
    }

    query.status = status;
  }

  // ========================================
  // PAGINATION
  // ========================================

  const currentPage = Math.max(
    parseInt(page, 10) || 1,
    1
  );

  const perPage = Math.min(
    Math.max(parseInt(limit, 10) || 10, 1),
    100
  );

  const skip =
    (currentPage - 1) * perPage;

  // ========================================
  // DATABASE
  // ========================================

  const [
    assessments,
    total,
  ] = await Promise.all([
    Assessment.find(query)
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "updatedBy",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage)
      .lean(),

    Assessment.countDocuments(query),
  ]);

  return {
    assessments,

    pagination: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages:
        total === 0
          ? 0
          : Math.ceil(total / perPage),
    },
  };
};

// ========================================
// GET SINGLE ASSESSMENT
// ========================================

export const getAssessmentById = async (id) => {
  if (
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    throw new Error(
      "Invalid assessment ID"
    );
  }

  const assessment =
    await Assessment.findById(id)
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "updatedBy",
        "name email"
      );

  if (!assessment) {
    throw new Error(
      "Assessment not found"
    );
  }

  return assessment;
};

// ========================================
// UPDATE ASSESSMENT
// ========================================

export const updateAssessment = async (
  id,
  data,
  userId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    throw new Error(
      "Invalid assessment ID"
    );
  }

  const assessment =
    await Assessment.findById(id);

  if (!assessment) {
    throw new Error(
      "Assessment not found"
    );
  }

  // ========================================
  // PROTECTED FIELDS
  // ========================================

  delete data._id;
  delete data.createdBy;
  delete data.updatedBy;

  // Status is handled separately
  delete data.status;

  // Remove old fields if frontend
  // accidentally sends them
  delete data.course;
  delete data.category;

  // ========================================
  // UPDATE
  // ========================================

  Object.assign(
    assessment,
    data
  );

  assessment.updatedBy =
    userId;

  await assessment.save();

  return assessment;
};

// ========================================
// DELETE ASSESSMENT
// ========================================

export const deleteAssessment = async (
  id
) => {
  if (
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    throw new Error(
      "Invalid assessment ID"
    );
  }

  const assessment =
    await Assessment.findById(id);

  if (!assessment) {
    throw new Error(
      "Assessment not found"
    );
  }

  await Assessment.findByIdAndDelete(
    id
  );

  return {
    message:
      "Assessment deleted successfully",
  };
};

// ========================================
// PUBLISH ASSESSMENT
// ========================================

export const publishAssessment = async (
  id,
  userId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    throw new Error(
      "Invalid assessment ID"
    );
  }

  const assessment =
    await Assessment.findById(id);

  if (!assessment) {
    throw new Error(
      "Assessment not found"
    );
  }

  // ========================================
  // VALIDATION
  // ========================================

  if (!assessment.title) {
    throw new Error(
      "Assessment title is required before publishing"
    );
  }

  if (
    !assessment.durationMinutes
  ) {
    throw new Error(
      "Assessment duration is required before publishing"
    );
  }

  if (
    !assessment.totalMarks
  ) {
    throw new Error(
      "Total marks are required before publishing"
    );
  }

  if (
    assessment.passingMarks ===
      undefined ||
    assessment.passingMarks === null
  ) {
    throw new Error(
      "Passing marks are required before publishing"
    );
  }

  if (
    assessment.passingMarks >
    assessment.totalMarks
  ) {
    throw new Error(
      "Passing marks cannot be greater than total marks"
    );
  }

  // ========================================
  // PUBLISH
  // ========================================

  assessment.status =
    "PUBLISHED";

  assessment.updatedBy =
    userId;

  await assessment.save();

  return assessment;
};

// ========================================
// UNPUBLISH ASSESSMENT
// ========================================

export const unpublishAssessment =
  async (
    id,
    userId
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new Error(
        "Invalid assessment ID"
      );
    }

    const assessment =
      await Assessment.findById(id);

    if (!assessment) {
      throw new Error(
        "Assessment not found"
      );
    }

    assessment.status =
      "UNPUBLISHED";

    assessment.updatedBy =
      userId;

    await assessment.save();

    return assessment;
  };