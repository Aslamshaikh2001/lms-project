
// import crypto from "crypto";

// import User from "../models/User.js";
// import Otp from "../models/Otp.js";
// import RefreshSession from "../models/RefreshSession.js";
// import env from "../config/env.js";

// import {
//   hashPassword,
//   comparePassword,
// } from "../utils/password.js";

// import { generateOtp } from "../utils/generateOtp.js";

// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from "../utils/generateToken.js";

// import { hashToken } from "../utils/tokenHash.js";


// // ======================================================
// // OTP CONFIGURATION
// // ======================================================

// const OTP_RESEND_COOLDOWN_MS = 60 * 1000;


// // ======================================================
// // REGISTER
// // ======================================================

// export async function registerUser({
//   name,
//   email,
//   password,
//   role = "STUDENT",
// }) {
//   const normalizedEmail =
//     email.toLowerCase().trim();

//   const existingUser = await User.findOne({
//     email: normalizedEmail,
//   });

//   if (existingUser) {
//     throw new Error(
//       "An account with this email already exists."
//     );
//   }

//   const hashedPassword =
//     await hashPassword(password);

//   const user = await User.create({
//     name,
//     email: normalizedEmail,
//     password: hashedPassword,
//     role,
//   });

//   return {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     isEmailVerified:
//       user.isEmailVerified,
//   };
// }


// // ======================================================
// // LOGIN
// // ======================================================

// export async function loginUser({
//   email,
//   password,
//   userAgent,
//   ipAddress,
// }) {
//   const normalizedEmail =
//     email.toLowerCase().trim();

//   const user = await User.findOne({
//     email: normalizedEmail,
//   }).select("+password");

//   if (!user) {
//     throw new Error(
//       "Invalid email or password."
//     );
//   }

//   if (!user.isActive) {
//     throw new Error(
//       "Your account is inactive."
//     );
//   }

//   if (user.isSuspended) {
//     throw new Error(
//       "Your account has been suspended."
//     );
//   }

//   const passwordMatch =
//     await comparePassword(
//       password,
//       user.password
//     );

//   if (!passwordMatch) {
//     throw new Error(
//       "Invalid email or password."
//     );
//   }

//   user.lastLogin = new Date();

//   await user.save();

//   // Create refresh session first.
//   const session = await RefreshSession.create({
//     user: user._id,
//     tokenHash: crypto
//       .randomBytes(32)
//       .toString("hex"),

//     expiresAt: new Date(
//       Date.now() +
//         7 * 24 * 60 * 60 * 1000
//     ),

//     userAgent,
//     ipAddress,
//   });

//   // Generate actual refresh JWT.
//   const refreshToken =
//     generateRefreshToken({
//       userId: user._id,
//       sessionId: session._id,
//     });

//   // Store hash of actual JWT.
//   session.tokenHash =
//     hashToken(refreshToken);

//   await session.save();

//   const accessToken =
//     generateAccessToken(user);

//   return {
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isEmailVerified:
//         user.isEmailVerified,
//       isActive: user.isActive,
//     },

//     accessToken,

//     refreshToken,
//   };
// }


// // ======================================================
// // REFRESH TOKEN
// // ======================================================

// export async function refreshAccessToken(
//   refreshToken,
//   userAgent,
//   ipAddress
// ) {
//   if (!refreshToken) {
//     throw new Error(
//       "Refresh token is required."
//     );
//   }

//   let decoded;

//   try {
//     const jwt = await import(
//       "jsonwebtoken"
//     );

//     decoded = jwt.default.verify(
//       refreshToken,
//       process.env.JWT_REFRESH_SECRET
//     );
//   } catch {
//     throw new Error(
//       "Invalid or expired refresh token."
//     );
//   }

//   const session =
//     await RefreshSession.findById(
//       decoded.sessionId
//     );

//   if (!session) {
//     throw new Error(
//       "Refresh session not found."
//     );
//   }

//   // Token already revoked = possible replay.
//   if (session.revokedAt) {
//     throw new Error(
//       "Refresh token has already been revoked."
//     );
//   }

//   if (
//     session.expiresAt.getTime() <
//     Date.now()
//   ) {
//     throw new Error(
//       "Refresh session has expired."
//     );
//   }

//   const incomingTokenHash =
//     hashToken(refreshToken);

//   if (
//     incomingTokenHash !==
//     session.tokenHash
//   ) {
//     throw new Error(
//       "Invalid refresh token."
//     );
//   }

//   const user = await User.findById(
//     decoded.userId
//   );

//   if (!user) {
//     throw new Error("User not found.");
//   }

//   if (!user.isActive) {
//     throw new Error(
//       "Your account is inactive."
//     );
//   }

//   if (user.isSuspended) {
//     throw new Error(
//       "Your account has been suspended."
//     );
//   }

//   // --------------------------------------------------
//   // Create replacement session
//   // --------------------------------------------------

//   const newSession =
//     await RefreshSession.create({
//       user: user._id,

//       tokenHash: crypto
//         .randomBytes(32)
//         .toString("hex"),

//       expiresAt: new Date(
//         Date.now() +
//           7 * 24 * 60 * 60 * 1000
//       ),

//       userAgent,
//       ipAddress,
//     });

//   const newRefreshToken =
//     generateRefreshToken({
//       userId: user._id,
//       sessionId: newSession._id,
//     });

//   newSession.tokenHash =
//     hashToken(newRefreshToken);

//   await newSession.save();

//   // Revoke old session.
//   session.revokedAt = new Date();
//   session.replacedByTokenHash =
//     newSession.tokenHash;

//   await session.save();

//   const accessToken =
//     generateAccessToken(user);

//   return {
//     accessToken,
//     refreshToken: newRefreshToken,

//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isEmailVerified:
//         user.isEmailVerified,
//       isActive: user.isActive,
//     },
//   };
// }


// // ======================================================
// // LOGOUT
// // ======================================================

// export async function logoutUser(
//   refreshToken
// ) {
//   if (!refreshToken) {
//     return;
//   }

//   const tokenHash =
//     hashToken(refreshToken);

//   await RefreshSession.findOneAndUpdate(
//     {
//       tokenHash,
//       revokedAt: null,
//     },
//     {
//       $set: {
//         revokedAt: new Date(),
//       },
//     }
//   );
// }


// // ======================================================
// // LOGOUT ALL SESSIONS
// // ======================================================

// export async function logoutAllSessions(
//   userId
// ) {
//   await RefreshSession.updateMany(
//     {
//       user: userId,
//       revokedAt: null,
//     },
//     {
//       $set: {
//         revokedAt: new Date(),
//       },
//     }
//   );
// }


// // ======================================================
// // GET CURRENT USER
// // ======================================================

// export async function getCurrentUser(
//   userId
// ) {
//   const user = await User.findById(
//     userId
//   ).select("-password");

//   if (!user) {
//     throw new Error(
//       "User not found."
//     );
//   }

//   if (!user.isActive) {
//     throw new Error(
//       "Your account is inactive."
//     );
//   }

//   if (user.isSuspended) {
//     throw new Error(
//       "Your account is suspended."
//     );
//   }

//   return user;
// }


// // ======================================================
// // OTP
// // ======================================================

// export async function createOtp({
//   email,
//   purpose,
// }) {
//   const normalizedEmail =
//     email.toLowerCase().trim();

//   const latestOtp =
//     await Otp.findOne({
//       email: normalizedEmail,
//       purpose,
//     }).sort({
//       createdAt: -1,
//     });

//   // ---------------------------------------------
//   // Resend cooldown
//   // ---------------------------------------------

//   if (latestOtp?.lastSentAt) {
//     const timeSinceLastSent =
//       Date.now() -
//       latestOtp.lastSentAt.getTime();

//     if (
//       timeSinceLastSent <
//       OTP_RESEND_COOLDOWN_MS
//     ) {
//       const remainingSeconds =
//         Math.ceil(
//           (OTP_RESEND_COOLDOWN_MS -
//             timeSinceLastSent) /
//             1000
//         );

//       throw new Error(
//         `Please wait ${remainingSeconds} seconds before requesting another OTP.`
//       );
//     }
//   }

//   // ---------------------------------------------
//   // Invalidate previous OTPs
//   // ---------------------------------------------

//   await Otp.updateMany(
//     {
//       email: normalizedEmail,
//       purpose,
//       verified: false,
//       consumed: false,
//     },
//     {
//       $set: {
//         consumed: true,
//       },
//     }
//   );

//   // ---------------------------------------------
//   // Generate OTP
//   // ---------------------------------------------

//   const otp =
//     generateOtp();

//   const otpHash =
//     crypto
//       .createHash("sha256")
//       .update(otp)
//       .digest("hex");

//   const expiresAt =
//     new Date(
//       Date.now() +
//         10 * 60 * 1000
//     );

//   // ---------------------------------------------
//   // Save OTP
//   // ---------------------------------------------

//   await Otp.create({
//     email: normalizedEmail,
//     otpHash,
//     purpose,
//     attempts: 0,
//     maxAttempts: 5,
//     expiresAt,
//     verified: false,
//     consumed: false,
//     lastSentAt: new Date(),
//   });

//   return {
//     otp,
//     expiresAt,
//   };
// }


// // ======================================================
// // VERIFY OTP
// // ======================================================

// export async function verifyOtp({
//   email,
//   otp,
//   purpose,
// }) {
//   const normalizedEmail =
//     email.toLowerCase().trim();

//   const otpRecord =
//     await Otp.findOne({
//       email: normalizedEmail,
//       purpose,
//       verified: false,
//       consumed: false,
//     }).sort({
//       createdAt: -1,
//     });

//   if (!otpRecord) {
//     throw new Error(
//       "OTP not found or already used."
//     );
//   }

//   // Check expiration.
//   if (
//     otpRecord.expiresAt.getTime() <
//     Date.now()
//   ) {
//     throw new Error(
//       "OTP has expired."
//     );
//   }

//   // Check attempt limit.
//   if (
//     otpRecord.attempts >=
//     otpRecord.maxAttempts
//   ) {
//     throw new Error(
//       "Maximum OTP attempts exceeded."
//     );
//   }

//   const otpHash = crypto
//     .createHash("sha256")
//     .update(otp)
//     .digest("hex");

//   if (
//     otpHash !==
//     otpRecord.otpHash
//   ) {
//     otpRecord.attempts += 1;

//     await otpRecord.save();

//     throw new Error(
//       "Invalid OTP."
//     );
//   }

//   // OTP is verified but not consumed yet.
//   otpRecord.verified = true;

//   await otpRecord.save();

//   return true;
// }


// // ======================================================
// // FORGOT PASSWORD
// // ======================================================

// export async function requestForgotPasswordOtp(
//   email
// ) {
//   const normalizedEmail =
//     email.toLowerCase().trim();

//   const user =
//     await User.findOne({
//       email: normalizedEmail,
//     });

//   /*
//    * Important security rule:
//    *
//    * Do not reveal whether the email
//    * exists or not.
//    */

//   if (!user) {
//     return {
//       sent: false,
//     };
//   }

//   if (!user.isActive) {
//     return {
//       sent: false,
//     };
//   }

//   const { otp, expiresAt } =
//     await createOtp({
//       email: normalizedEmail,
//       purpose:
//         "FORGOT_PASSWORD",
//     });

//   return {
//     sent: true,
//     otp,
//     expiresAt,
//   };
// }


// // ======================================================
// // VERIFY FORGOT PASSWORD OTP
// // ======================================================

// export async function verifyForgotPasswordOtp({
//   email,
//   otp,
// }) {
//   const normalizedEmail =
//     email.toLowerCase().trim();

//   const verified =
//     await verifyOtp({
//       email: normalizedEmail,
//       otp,
//       purpose:
//         "FORGOT_PASSWORD",
//     });

//   if (!verified) {
//     throw new Error(
//       "OTP verification failed."
//     );
//   }

//   return true;
// }


// // ======================================================
// // RESET PASSWORD
// // ======================================================

// export async function resetPassword({
//   email,
//   newPassword,
// }) {
//   const normalizedEmail =
//     email.toLowerCase().trim();

//   const user =
//     await User.findOne({
//       email: normalizedEmail,
//     }).select("+password");

//   if (!user) {
//     throw new Error(
//       "Unable to reset password."
//     );
//   }

//   const hashedPassword =
//     await hashPassword(
//       newPassword
//     );

//   user.password =
//     hashedPassword;

//   await user.save();

//   // Invalidate every existing login session.
//   await logoutAllSessions(
//     user._id
//   );

//   return true;
// }


// // ======================================================
// // CHANGE PASSWORD
// // ======================================================

// export async function changePassword({
//   userId,
//   currentPassword,
//   newPassword,
// }) {
//   const user =
//     await User.findById(
//       userId
//     ).select("+password");

//   if (!user) {
//     throw new Error(
//       "User not found."
//     );
//   }

//   const currentPasswordValid =
//     await comparePassword(
//       currentPassword,
//       user.password
//     );

//   if (!currentPasswordValid) {
//     throw new Error(
//       "Current password is incorrect."
//     );
//   }

//   const isSamePassword =
//     await comparePassword(
//       newPassword,
//       user.password
//     );

//   if (isSamePassword) {
//     throw new Error(
//       "New password must be different from current password."
//     );
//   }

//   const hashedPassword =
//     await hashPassword(
//       newPassword
//     );

//   user.password =
//     hashedPassword;

//   await user.save();

//   // Invalidate all existing refresh sessions.
//   await logoutAllSessions(
//     user._id
//   );

//   return true;
// }





import crypto from "crypto";

import User from "../models/User.js";
import Otp from "../models/Otp.js";
import RefreshSession from "../models/RefreshSession.js";
import env from "../config/env.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

import { generateOtp } from "../utils/generateOtp.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import { hashToken } from "../utils/tokenHash.js";


// ======================================================
// OTP CONFIGURATION
// ======================================================

const OTP_RESEND_COOLDOWN_MS = 60 * 1000;


// ======================================================
// ROLE CONFIGURATION
// ======================================================
//
// These are the roles supported by the User model.
//
// IMPORTANT:
// Public registration controller should decide which
// roles are allowed for public registration.
//
// This service validates the role again so that even if
// this function is called from another place, an invalid
// role cannot be stored in MongoDB.
//

const ALLOWED_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "INSTRUCTOR",
  "STUDENT",
];


// ======================================================
// REGISTER
// ======================================================

export async function registerUser({
  name,
  email,
  phone,
  address,
  password,
  role = "STUDENT",
}) {
  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail = email
    .toLowerCase()
    .trim();


  // --------------------------------------------------
  // Normalize role
  // --------------------------------------------------

  const normalizedRole = String(role || "")
    .trim()
    .toUpperCase();


  // --------------------------------------------------
  // Validate role
  // --------------------------------------------------

  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    throw new Error("Invalid user role.");
  }


  // --------------------------------------------------
  // Check existing user
  // --------------------------------------------------

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });


  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
  }


  // --------------------------------------------------
  // Hash password
  // --------------------------------------------------

  const hashedPassword =
    await hashPassword(password);


  // --------------------------------------------------
  // Prepare user data
  // --------------------------------------------------

  const userData = {
    name: name?.trim(),

    email: normalizedEmail,

    password: hashedPassword,

    role: normalizedRole,
  };


  // --------------------------------------------------
  // Phone
  // --------------------------------------------------

  if (phone !== undefined) {
    userData.phone =
      phone === null
        ? null
        : String(phone).trim();
  }


  // --------------------------------------------------
  // Address
  // --------------------------------------------------
  //
  // Supports:
  //
  // {
  //   street,
  //   city,
  //   state,
  //   country,
  //   postalCode
  // }
  //
  // If address is not provided, MongoDB model defaults
  // will be used.
  //

  if (address !== undefined) {
    userData.address = address;
  }


  // --------------------------------------------------
  // Create user
  // --------------------------------------------------

  const user = await User.create(
    userData
  );


  // --------------------------------------------------
  // Return safe user data
  // --------------------------------------------------
  //
  // Never return password.
  //

  return {
    id: user._id,

    name: user.name,

    email: user.email,

    phone: user.phone,

    address: user.address,

    role: user.role,

    profileImage: user.profileImage,

    isEmailVerified:
      user.isEmailVerified,

    isActive:
      user.isActive,

    isSuspended:
      user.isSuspended,

    createdAt:
      user.createdAt,
  };
}


// ======================================================
// LOGIN
// ======================================================

export async function loginUser({
  email,
  password,
  userAgent,
  ipAddress,
}) {
  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail =
    email.toLowerCase().trim();


  // --------------------------------------------------
  // Find user including password
  // --------------------------------------------------

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");


  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }


  // --------------------------------------------------
  // Check active status
  // --------------------------------------------------

  if (!user.isActive) {
    throw new Error(
      "Your account is inactive."
    );
  }


  // --------------------------------------------------
  // Check suspended status
  // --------------------------------------------------

  if (user.isSuspended) {
    throw new Error(
      "Your account has been suspended."
    );
  }


  // --------------------------------------------------
  // Compare password
  // --------------------------------------------------

  const passwordMatch =
    await comparePassword(
      password,
      user.password
    );


  if (!passwordMatch) {
    throw new Error(
      "Invalid email or password."
    );
  }


  // --------------------------------------------------
  // Update last login
  // --------------------------------------------------

  user.lastLogin = new Date();

  await user.save();


  // --------------------------------------------------
  // Create refresh session first
  // --------------------------------------------------

  const session =
    await RefreshSession.create({
      user: user._id,

      tokenHash: crypto
        .randomBytes(32)
        .toString("hex"),

      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),

      userAgent,

      ipAddress,
    });


  // --------------------------------------------------
  // Generate actual refresh JWT
  // --------------------------------------------------

  const refreshToken =
    generateRefreshToken({
      userId: user._id,
      sessionId: session._id,
    });


  // --------------------------------------------------
  // Store hash of actual JWT
  // --------------------------------------------------

  session.tokenHash =
    hashToken(refreshToken);

  await session.save();


  // --------------------------------------------------
  // Generate access token
  // --------------------------------------------------

  const accessToken =
    generateAccessToken(user);


  // --------------------------------------------------
  // Return login response
  // --------------------------------------------------

  return {
    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      address: user.address,

      role: user.role,

      profileImage:
        user.profileImage,

      isEmailVerified:
        user.isEmailVerified,

      isActive:
        user.isActive,

      isSuspended:
        user.isSuspended,
    },

    accessToken,

    refreshToken,
  };
}


// ======================================================
// REFRESH TOKEN
// ======================================================

export async function refreshAccessToken(
  refreshToken,
  userAgent,
  ipAddress
) {
  // --------------------------------------------------
  // Check refresh token
  // --------------------------------------------------

  if (!refreshToken) {
    throw new Error(
      "Refresh token is required."
    );
  }


  // --------------------------------------------------
  // Verify JWT
  // --------------------------------------------------

  let decoded;

  try {
    const jwt = await import(
      "jsonwebtoken"
    );

    decoded = jwt.default.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new Error(
      "Invalid or expired refresh token."
    );
  }


  // --------------------------------------------------
  // Find refresh session
  // --------------------------------------------------

  const session =
    await RefreshSession.findById(
      decoded.sessionId
    );


  if (!session) {
    throw new Error(
      "Refresh session not found."
    );
  }


  // --------------------------------------------------
  // Check revoked token
  // --------------------------------------------------

  if (session.revokedAt) {
    throw new Error(
      "Refresh token has already been revoked."
    );
  }


  // --------------------------------------------------
  // Check expiration
  // --------------------------------------------------

  if (
    session.expiresAt.getTime() <
    Date.now()
  ) {
    throw new Error(
      "Refresh session has expired."
    );
  }


  // --------------------------------------------------
  // Compare token hash
  // --------------------------------------------------

  const incomingTokenHash =
    hashToken(refreshToken);


  if (
    incomingTokenHash !==
    session.tokenHash
  ) {
    throw new Error(
      "Invalid refresh token."
    );
  }


  // --------------------------------------------------
  // Find user
  // --------------------------------------------------

  const user = await User.findById(
    decoded.userId
  );


  if (!user) {
    throw new Error(
      "User not found."
    );
  }


  // --------------------------------------------------
  // Check active status
  // --------------------------------------------------

  if (!user.isActive) {
    throw new Error(
      "Your account is inactive."
    );
  }


  // --------------------------------------------------
  // Check suspended status
  // --------------------------------------------------

  if (user.isSuspended) {
    throw new Error(
      "Your account has been suspended."
    );
  }


  // ==================================================
  // CREATE REPLACEMENT SESSION
  // ==================================================

  const newSession =
    await RefreshSession.create({
      user: user._id,

      tokenHash: crypto
        .randomBytes(32)
        .toString("hex"),

      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),

      userAgent,

      ipAddress,
    });


  // --------------------------------------------------
  // Generate new refresh token
  // --------------------------------------------------

  const newRefreshToken =
    generateRefreshToken({
      userId: user._id,
      sessionId: newSession._id,
    });


  // --------------------------------------------------
  // Store new refresh token hash
  // --------------------------------------------------

  newSession.tokenHash =
    hashToken(newRefreshToken);

  await newSession.save();


  // --------------------------------------------------
  // Revoke old session
  // --------------------------------------------------

  session.revokedAt =
    new Date();

  session.replacedByTokenHash =
    newSession.tokenHash;

  await session.save();


  // --------------------------------------------------
  // Generate new access token
  // --------------------------------------------------

  const accessToken =
    generateAccessToken(user);


  // --------------------------------------------------
  // Return refreshed session
  // --------------------------------------------------

  return {
    accessToken,

    refreshToken:
      newRefreshToken,

    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      address: user.address,

      role: user.role,

      profileImage:
        user.profileImage,

      isEmailVerified:
        user.isEmailVerified,

      isActive:
        user.isActive,

      isSuspended:
        user.isSuspended,
    },
  };
}


// ======================================================
// LOGOUT
// ======================================================

export async function logoutUser(
  refreshToken
) {
  // --------------------------------------------------
  // No token means nothing to logout
  // --------------------------------------------------

  if (!refreshToken) {
    return;
  }


  // --------------------------------------------------
  // Hash refresh token
  // --------------------------------------------------

  const tokenHash =
    hashToken(refreshToken);


  // --------------------------------------------------
  // Revoke current session
  // --------------------------------------------------

  await RefreshSession.findOneAndUpdate(
    {
      tokenHash,

      revokedAt: null,
    },

    {
      $set: {
        revokedAt: new Date(),
      },
    }
  );
}


// ======================================================
// LOGOUT ALL SESSIONS
// ======================================================

export async function logoutAllSessions(
  userId
) {
  // --------------------------------------------------
  // Revoke all active sessions
  // --------------------------------------------------

  await RefreshSession.updateMany(
    {
      user: userId,

      revokedAt: null,
    },

    {
      $set: {
        revokedAt: new Date(),
      },
    }
  );
}


// ======================================================
// GET CURRENT USER
// ======================================================

export async function getCurrentUser(
  userId
) {
  // --------------------------------------------------
  // Get user without password
  // --------------------------------------------------

  const user = await User.findById(
    userId
  ).select("-password");


  // --------------------------------------------------
  // User not found
  // --------------------------------------------------

  if (!user) {
    throw new Error(
      "User not found."
    );
  }


  // --------------------------------------------------
  // Check active status
  // --------------------------------------------------

  if (!user.isActive) {
    throw new Error(
      "Your account is inactive."
    );
  }


  // --------------------------------------------------
  // Check suspended status
  // --------------------------------------------------

  if (user.isSuspended) {
    throw new Error(
      "Your account is suspended."
    );
  }


  return user;
}


// ======================================================
// OTP
// ======================================================

export async function createOtp({
  email,
  purpose,
}) {
  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail =
    email.toLowerCase().trim();


  // --------------------------------------------------
  // Get latest OTP
  // --------------------------------------------------

  const latestOtp =
    await Otp.findOne({
      email: normalizedEmail,

      purpose,
    }).sort({
      createdAt: -1,
    });


  // ==================================================
  // RESEND COOLDOWN
  // ==================================================

  if (latestOtp?.lastSentAt) {
    const timeSinceLastSent =
      Date.now() -
      latestOtp.lastSentAt.getTime();


    if (
      timeSinceLastSent <
      OTP_RESEND_COOLDOWN_MS
    ) {
      const remainingSeconds =
        Math.ceil(
          (
            OTP_RESEND_COOLDOWN_MS -
            timeSinceLastSent
          ) / 1000
        );


      throw new Error(
        `Please wait ${remainingSeconds} seconds before requesting another OTP.`
      );
    }
  }


  // ==================================================
  // INVALIDATE PREVIOUS OTPS
  // ==================================================

  await Otp.updateMany(
    {
      email: normalizedEmail,

      purpose,

      verified: false,

      consumed: false,
    },

    {
      $set: {
        consumed: true,
      },
    }
  );


  // ==================================================
  // GENERATE OTP
  // ==================================================

  const otp =
    generateOtp();


  // --------------------------------------------------
  // Hash OTP
  // --------------------------------------------------

  const otpHash =
    crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");


  // --------------------------------------------------
  // OTP expiration
  // --------------------------------------------------

  const expiresAt =
    new Date(
      Date.now() +
        10 * 60 * 1000
    );


  // ==================================================
  // SAVE OTP
  // ==================================================

  await Otp.create({
    email: normalizedEmail,

    otpHash,

    purpose,

    attempts: 0,

    maxAttempts: 5,

    expiresAt,

    verified: false,

    consumed: false,

    lastSentAt: new Date(),
  });


  // --------------------------------------------------
  // Return OTP
  // --------------------------------------------------

  return {
    otp,

    expiresAt,
  };
}


// ======================================================
// VERIFY OTP
// ======================================================

export async function verifyOtp({
  email,
  otp,
  purpose,
}) {
  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail =
    email.toLowerCase().trim();


  // --------------------------------------------------
  // Find latest valid OTP
  // --------------------------------------------------

  const otpRecord =
    await Otp.findOne({
      email: normalizedEmail,

      purpose,

      verified: false,

      consumed: false,
    }).sort({
      createdAt: -1,
    });


  // --------------------------------------------------
  // OTP not found
  // --------------------------------------------------

  if (!otpRecord) {
    throw new Error(
      "OTP not found or already used."
    );
  }


  // --------------------------------------------------
  // Check expiration
  // --------------------------------------------------

  if (
    otpRecord.expiresAt.getTime() <
    Date.now()
  ) {
    throw new Error(
      "OTP has expired."
    );
  }


  // --------------------------------------------------
  // Check attempt limit
  // --------------------------------------------------

  if (
    otpRecord.attempts >=
    otpRecord.maxAttempts
  ) {
    throw new Error(
      "Maximum OTP attempts exceeded."
    );
  }


  // --------------------------------------------------
  // Hash entered OTP
  // --------------------------------------------------

  const otpHash =
    crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");


  // --------------------------------------------------
  // Compare OTP
  // --------------------------------------------------

  if (
    otpHash !==
    otpRecord.otpHash
  ) {
    otpRecord.attempts += 1;

    await otpRecord.save();

    throw new Error(
      "Invalid OTP."
    );
  }


  // --------------------------------------------------
  // Mark OTP verified
  // --------------------------------------------------
  //
  // Do NOT consume it here because forgot-password
  // flow needs the verified OTP before password reset.
  //

  otpRecord.verified = true;

  await otpRecord.save();


  return true;
}


// ======================================================
// FORGOT PASSWORD
// ======================================================

export async function requestForgotPasswordOtp(
  email
) {
  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail =
    email.toLowerCase().trim();


  // --------------------------------------------------
  // Find user
  // --------------------------------------------------

  const user =
    await User.findOne({
      email: normalizedEmail,
    });


  /*
   * Important security rule:
   *
   * Do not reveal whether the email
   * exists or not.
   */


  // --------------------------------------------------
  // User doesn't exist
  // --------------------------------------------------

  if (!user) {
    return {
      sent: false,
    };
  }


  // --------------------------------------------------
  // User inactive
  // --------------------------------------------------

  if (!user.isActive) {
    return {
      sent: false,
    };
  }


  // --------------------------------------------------
  // Create forgot password OTP
  // --------------------------------------------------

  const {
    otp,
    expiresAt,
  } = await createOtp({
    email: normalizedEmail,

    purpose:
      "FORGOT_PASSWORD",
  });


  // --------------------------------------------------
  // Return result
  // --------------------------------------------------

  return {
    sent: true,

    otp,

    expiresAt,
  };
}


// ======================================================
// VERIFY FORGOT PASSWORD OTP
// ======================================================

export async function verifyForgotPasswordOtp({
  email,
  otp,
}) {
  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail =
    email.toLowerCase().trim();


  // --------------------------------------------------
  // Verify OTP
  // --------------------------------------------------

  const verified =
    await verifyOtp({
      email: normalizedEmail,

      otp,

      purpose:
        "FORGOT_PASSWORD",
    });


  // --------------------------------------------------
  // Verification failed
  // --------------------------------------------------

  if (!verified) {
    throw new Error(
      "OTP verification failed."
    );
  }


  return true;
}


// ======================================================
// RESET PASSWORD
// ======================================================

export async function resetPassword({
  email,
  newPassword,
}) {
  // --------------------------------------------------
  // Normalize email
  // --------------------------------------------------

  const normalizedEmail =
    email.toLowerCase().trim();


  // --------------------------------------------------
  // Find user
  // --------------------------------------------------

  const user =
    await User.findOne({
      email: normalizedEmail,
    }).select("+password");


  // --------------------------------------------------
  // User not found
  // --------------------------------------------------

  if (!user) {
    throw new Error(
      "Unable to reset password."
    );
  }


  // --------------------------------------------------
  // Hash new password
  // --------------------------------------------------

  const hashedPassword =
    await hashPassword(
      newPassword
    );


  // --------------------------------------------------
  // Update password
  // --------------------------------------------------

  user.password =
    hashedPassword;


  await user.save();


  // --------------------------------------------------
  // Invalidate every existing session
  // --------------------------------------------------

  await logoutAllSessions(
    user._id
  );


  return true;
}


// ======================================================
// CHANGE PASSWORD
// ======================================================

export async function changePassword({
  userId,
  currentPassword,
  newPassword,
}) {
  // --------------------------------------------------
  // Find user
  // --------------------------------------------------

  const user =
    await User.findById(
      userId
    ).select("+password");


  // --------------------------------------------------
  // User not found
  // --------------------------------------------------

  if (!user) {
    throw new Error(
      "User not found."
    );
  }


  // --------------------------------------------------
  // Compare current password
  // --------------------------------------------------

  const currentPasswordValid =
    await comparePassword(
      currentPassword,
      user.password
    );


  if (!currentPasswordValid) {
    throw new Error(
      "Current password is incorrect."
    );
  }


  // --------------------------------------------------
  // Check same password
  // --------------------------------------------------

  const isSamePassword =
    await comparePassword(
      newPassword,
      user.password
    );


  if (isSamePassword) {
    throw new Error(
      "New password must be different from current password."
    );
  }


  // --------------------------------------------------
  // Hash new password
  // --------------------------------------------------

  const hashedPassword =
    await hashPassword(
      newPassword
    );


  // --------------------------------------------------
  // Save new password
  // --------------------------------------------------

  user.password =
    hashedPassword;


  await user.save();


  // --------------------------------------------------
  // Invalidate all existing refresh sessions
  // --------------------------------------------------

  await logoutAllSessions(
    user._id
  );


  return true;
}