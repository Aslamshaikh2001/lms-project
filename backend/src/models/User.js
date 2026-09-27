// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
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

//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//       select: false,
//     },

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

//     profileImage: {
//       type: String,
//       default: null,
//     },

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

//     lastLogin: {
//       type: Date,
//       default: null,
//     },

//     passwordChangedAt: {
//       type: Date,
//       default: null,
//     },

//     refreshTokenVersion: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("User", userSchema);





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

export default mongoose.model(
  "User",
  userSchema
);