// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     otpHash: {
//       type: String,
//       required: true,
//     },

//     purpose: {
//       type: String,
//       enum: [
//         "EMAIL_VERIFICATION",
//         "PASSWORD_RESET",
//         "LOGIN_VERIFICATION",
//       ],
//       required: true,
//     },

//     attempts: {
//       type: Number,
//       default: 0,
//     },

//     maxAttempts: {
//       type: Number,
//       default: 5,
//     },

//     expiresAt: {
//       type: Date,
//       required: true,
//       index: true,
//     },

//     verified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Automatically remove expired OTP documents.
// otpSchema.index(
//   { expiresAt: 1 },
//   { expireAfterSeconds: 0 }
// );

// export default mongoose.model("Otp", otpSchema);




import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: [
        "EMAIL_VERIFICATION",
        "FORGOT_PASSWORD",
      ],
      required: true,
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    maxAttempts: {
      type: Number,
      default: 5,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    verified: {
  type: Boolean,
  default: false,
},

consumed: {
  type: Boolean,
  default: false,
},

    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired OTP documents.
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model(
  "Otp",
  otpSchema
);