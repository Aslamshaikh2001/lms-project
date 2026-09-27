import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * ======================================================
 * GET ALL STUDENTS
 * ======================================================
 */
export async function getAllStudents({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}) {
  const currentPage = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const skip = (currentPage - 1) * perPage;

  const filter = {
    role: "STUDENT",
  };

  // ----------------------------------------------------
  // Search
  // ----------------------------------------------------

  if (search && search.trim()) {
    const searchValue = search.trim();

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
  // Status filter
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
  // Query
  // ----------------------------------------------------

  const [students, totalStudents] =
    await Promise.all([
      User.find(filter)
        .select(
          "_id name email phone role profileImage isEmailVerified isActive isSuspended lastLogin createdAt updatedAt"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      User.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(
    totalStudents / perPage
  );

  return {
    students,

    pagination: {
      currentPage,
      limit: perPage,
      totalStudents,
      totalPages,
      hasNextPage:
        currentPage < totalPages,
      hasPreviousPage:
        currentPage > 1,
    },
  };
}


/**
 * ======================================================
 * GET SINGLE STUDENT
 * ======================================================
 */
export async function getStudentById(studentId) {
  if (
    !mongoose.Types.ObjectId.isValid(studentId)
  ) {
    const error = new Error(
      "Invalid student ID."
    );

    error.statusCode = 400;

    throw error;
  }

  const student = await User.findOne({
    _id: studentId,
    role: "STUDENT",
  })
    .select(
      "_id name email phone role profileImage isEmailVerified isActive isSuspended lastLogin createdAt updatedAt"
    )
    .lean();

  if (!student) {
    const error = new Error(
      "Student not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return student;
}