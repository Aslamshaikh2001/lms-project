
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     // ======================================================
//     // BASIC INFORMATION
//     // ======================================================

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 100,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     phone: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     // ======================================================
//     // ADDRESS
//     // ======================================================

//     address: {
//       street: {
//         type: String,
//         trim: true,
//         default: null,
//       },

//       city: {
//         type: String,
//         trim: true,
//         default: null,
//       },

//       state: {
//         type: String,
//         trim: true,
//         default: null,
//       },

//       country: {
//         type: String,
//         trim: true,
//         default: null,
//       },

//       postalCode: {
//         type: String,
//         trim: true,
//         default: null,
//       },
//     },

//     // ======================================================
//     // AUTHENTICATION
//     // ======================================================

//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//       select: false,
//     },

//     // ======================================================
//     // ROLE
//     // ======================================================

//     role: {
//       type: String,
//       enum: [
//         "SUPER_ADMIN",
//         "ADMIN",
//         "INSTRUCTOR",
//         "STUDENT",
//       ],
//       default: "STUDENT",
//       index: true,
//     },

//     // ======================================================
//     // PROFILE
//     // ======================================================

//     profileImage: {
//       type: String,
//       default: null,
//     },

//     // ======================================================
//     // ACCOUNT STATUS
//     // ======================================================

//     isEmailVerified: {
//       type: Boolean,
//       default: false,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     isSuspended: {
//       type: Boolean,
//       default: false,
//     },

//     // ======================================================
//     // LOGIN INFORMATION
//     // ======================================================

//     lastLogin: {
//       type: Date,
//       default: null,
//     },

//     // ======================================================
//     // PASSWORD INFORMATION
//     // ======================================================

//     passwordChangedAt: {
//       type: Date,
//       default: null,
//     },

//     // ======================================================
//     // REFRESH TOKEN
//     // ======================================================

//     refreshTokenVersion: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model(
//   "User",
//   userSchema
// );



import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ======================================================
    // BASIC INFORMATION
    // ======================================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    // ======================================================
    // STUDENT ACADEMIC INFORMATION
    // These fields are required only for STUDENT accounts
    // where specifically mentioned.
    // ======================================================

    studentCategory: {
      type: String,
      enum: ["IT", "NON_IT"],
      required: function () {
        return this.role === "STUDENT";
      },
      default: null,
      trim: true,
    },

    educationLevel: {
      type: String,
      enum: ["UNDERGRADUATE", "POSTGRADUATE"],
      required: function () {
        return this.role === "STUDENT";
      },
      default: null,
      trim: true,
    },

    // Example: B.Tech, B.E., BCA, B.Sc., MCA, MBA
    // Required for Undergraduate students.
    // Optional for Postgraduate students, as requested.

    courseName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
      required: function () {
        return (
          this.role === "STUDENT" &&
          this.educationLevel === "UNDERGRADUATE"
        );
      },
    },

    // Example: Computer Science, CSE, ENTC,
    // Mechanical, Civil, Information Technology, etc.

    branch: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    // Student's college or institution name

    collegeName: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },

    // ======================================================
    // ADDRESS
    // ======================================================

    address: {
      street: {
        type: String,
        trim: true,
        default: null,
      },

      city: {
        type: String,
        trim: true,
        default: null,
      },

      state: {
        type: String,
        trim: true,
        default: null,
      },

      country: {
        type: String,
        trim: true,
        default: null,
      },

      postalCode: {
        type: String,
        trim: true,
        default: null,
      },
    },

    // ======================================================
    // AUTHENTICATION
    // ======================================================

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    // ======================================================
    // ROLE
    // ======================================================

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "INSTRUCTOR",
        "STUDENT",
      ],
      default: "STUDENT",
      index: true,
    },

    // ======================================================
    // PROFILE
    // ======================================================

    profileImage: {
      type: String,
      default: null,
    },

    // ======================================================
    // ACCOUNT STATUS
    // ======================================================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isSuspended: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // LOGIN INFORMATION
    // ======================================================

    lastLogin: {
      type: Date,
      default: null,
    },

    // ======================================================
    // PASSWORD INFORMATION
    // ======================================================

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    // ======================================================
    // REFRESH TOKEN
    // ======================================================

    refreshTokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
