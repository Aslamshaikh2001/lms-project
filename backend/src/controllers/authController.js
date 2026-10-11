
// import User from "../models/User.js";
// import Otp from "../models/Otp.js";

// import {
//   registerUser,
//   loginUser,
//   createOtp,
//   verifyOtp,
//   refreshAccessToken,
//   logoutUser,
//   logoutAllSessions,
//   getCurrentUser,
//    requestForgotPasswordOtp,
//   verifyForgotPasswordOtp,
//   resetPassword,
//   changePassword,
// } from "../services/authService.js";

// import {
//   sendOtpEmail,
// } from "../services/emailService.js";

// import {
//   refreshCookieOptions,
// } from "../utils/cookieOptions.js";


// // ======================================================
// // REGISTER
// // ======================================================

// export async function register(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       name,
//       email,
//       password,
//     } = req.body;

//     const user =
//       await registerUser({
//         name,
//         email,
//         password,
//         role: "STUDENT",
//       });

//     const { otp } =
//       await createOtp({
//         email,
//         purpose:
//           "EMAIL_VERIFICATION",
//       });

//     await sendOtpEmail({
//       email,
//       otp,
//       purpose:
//         "EMAIL_VERIFICATION",
//     });

//     res.status(201).json({
//       success: true,
//       message:
//         "Account created. Verification OTP sent.",
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // LOGIN
// // ======================================================

// export async function login(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       email,
//       password,
//     } = req.body;

//     const result =
//       await loginUser({
//         email,
//         password,
//         userAgent:
//           req.get("user-agent"),
//         ipAddress:
//           req.ip,
//       });

//     res.cookie(
//       "refreshToken",
//       result.refreshToken,
//       refreshCookieOptions
//     );

//     res.status(200).json({
//       success: true,
//       message:
//         "Login successful.",
//       data: {
//         user: result.user,
//         accessToken:
//           result.accessToken,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // REFRESH TOKEN
// // ======================================================

// export async function refreshToken(
//   req,
//   res,
//   next
// ) {
//   try {
//     const token =
//       req.cookies.refreshToken;

//     const result =
//       await refreshAccessToken(
//         token,
//         req.get("user-agent"),
//         req.ip
//       );

//     res.cookie(
//       "refreshToken",
//       result.refreshToken,
//       refreshCookieOptions
//     );

//     res.status(200).json({
//       success: true,
//       message:
//         "Token refreshed successfully.",
//       data: {
//         accessToken:
//           result.accessToken,
//         user: result.user,
//       },
//     });
//   } catch (error) {
//     res.clearCookie(
//       "refreshToken",
//       refreshCookieOptions
//     );

//     next(error);
//   }
// }


// // ======================================================
// // LOGOUT
// // ======================================================

// export async function logout(
//   req,
//   res,
//   next
// ) {
//   try {
//     const token =
//       req.cookies.refreshToken;

//     await logoutUser(token);

//     res.clearCookie(
//       "refreshToken",
//       refreshCookieOptions
//     );

//     res.status(200).json({
//       success: true,
//       message:
//         "Logged out successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // LOGOUT ALL DEVICES
// // ======================================================

// export async function logoutAll(
//   req,
//   res,
//   next
// ) {
//   try {
//     await logoutAllSessions(
//       req.user.id
//     );

//     res.clearCookie(
//       "refreshToken",
//       refreshCookieOptions
//     );

//     res.status(200).json({
//       success: true,
//       message:
//         "Logged out from all devices.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // GET CURRENT USER
// // ======================================================

// export async function me(
//   req,
//   res,
//   next
// ) {
//   try {
//     const user =
//       await getCurrentUser(
//         req.user.id
//       );

//     res.status(200).json({
//       success: true,
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         profileImage:
//           user.profileImage,
//         isEmailVerified:
//           user.isEmailVerified,
//         isActive:
//           user.isActive,
//         createdAt:
//           user.createdAt,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // VERIFY EMAIL OTP
// // ======================================================

// export async function verifyEmailOtp(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       email,
//       otp,
//     } = req.body;

//     await verifyOtp({
//       email,
//       otp,
//       purpose:
//         "EMAIL_VERIFICATION",
//     });

//     const user =
//       await User.findOneAndUpdate(
//         {
//           email:
//             email.toLowerCase().trim(),
//         },
//         {
//           $set: {
//             isEmailVerified: true,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "User not found.",
//       });
//     }

//     res.json({
//       success: true,
//       message:
//         "Email verified successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // RESEND EMAIL OTP
// // ======================================================

// export async function resendVerificationOtp(
//   req,
//   res,
//   next
// ) {
//   try {
//     const { email } =
//       req.body;

//     const user =
//       await User.findOne({
//         email:
//           email.toLowerCase().trim(),
//       });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "User not found.",
//       });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Email is already verified.",
//       });
//     }

//     const { otp } =
//       await createOtp({
//         email,
//         purpose:
//           "EMAIL_VERIFICATION",
//       });

//     await sendOtpEmail({
//       email,
//       otp,
//       purpose:
//         "EMAIL_VERIFICATION",
//     });

//     res.json({
//       success: true,
//       message:
//         "Verification OTP resent.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // REQUEST FORGOT PASSWORD OTP
// // ======================================================

// export async function forgotPassword(
//   req,
//   res,
//   next
// ) {
//   try {
//     const { email } =
//       req.body;

//     const result =
//       await requestForgotPasswordOtp(
//         email
//       );

//     /*
//      * Always return the same response
//      * whether email exists or not.
//      *
//      * This prevents email enumeration.
//      */

//     if (result.sent) {
//       await sendOtpEmail({
//         email:
//           email.toLowerCase().trim(),
//         otp: result.otp,
//         purpose:
//           "FORGOT_PASSWORD",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message:
//         "If an account exists for this email, a password reset OTP has been sent.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// // ======================================================
// // VERIFY FORGOT PASSWORD OTP
// // ======================================================

// export async function verifyResetOtp(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       email,
//       otp,
//     } = req.body;

//     await verifyForgotPasswordOtp({
//       email,
//       otp,
//     });

//     res.status(200).json({
//       success: true,
//       message:
//         "OTP verified successfully. You can now reset your password.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // RESET PASSWORD
// // ======================================================

// export async function resetPasswordController(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       email,
//       newPassword,
//     } = req.body;

//     /*
//      * Important:
//      *
//      * We verify that the latest OTP
//      * has already been verified.
//      */

//     const otpRecord =
//       await Otp.findOne({
//         email:
//           email.toLowerCase().trim(),

//         purpose:
//           "FORGOT_PASSWORD",

//         verified: true,

//         consumed: false,

//       }).sort({
//         createdAt: -1,
//       });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Please verify the password reset OTP first.",
//       });
//     }

//    await resetPassword({
//   email,
//   newPassword,
// });

// otpRecord.consumed = true;
// await otpRecord.save();

//     res.status(200).json({
//       success: true,
//       message:
//         "Password reset successfully. Please login again.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // CHANGE PASSWORD
// // ======================================================

// export async function changePasswordController(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       currentPassword,
//       newPassword,
//     } = req.body;

//     await changePassword({
//       userId:
//         req.user.id,

//       currentPassword,

//       newPassword,
//     });

//     res.status(200).json({
//       success: true,
//       message:
//         "Password changed successfully. Please login again.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }






// import User from "../models/User.js";
// import Otp from "../models/Otp.js";

// import {
//   registerUser,
//   loginUser,
//   createOtp,
//   verifyOtp,
//   refreshAccessToken,
//   logoutUser,
//   logoutAllSessions,
//   getCurrentUser,
//   requestForgotPasswordOtp,
//   verifyForgotPasswordOtp,
//   resetPassword,
//   changePassword,
// } from "../services/authService.js";

// import { sendOtpEmail } from "../services/emailService.js";

// import { refreshCookieOptions } from "../utils/cookieOptions.js";


// // ======================================================
// // REGISTER
// // ======================================================

// export async function register(req, res, next) {
//   try {
//     // --------------------------------------------------
//     // Get registration data
//     // --------------------------------------------------

//     const {
//       name,
//       email,
//       phone,
//       address,
//       password,
//       role,
//     } = req.body;


//     // --------------------------------------------------
//     // Normalize role
//     // --------------------------------------------------

//     const normalizedRole = String(role || "")
//       .trim()
//       .toUpperCase();


//     // --------------------------------------------------
//     // Allowed roles for registration
//     //
//     // SUPER_ADMIN is intentionally not allowed from
//     // public registration.
//     // --------------------------------------------------

//     const allowedRegistrationRoles = [
//       "STUDENT",
//       "INSTRUCTOR",
//       "ADMIN",
//     ];


//     // --------------------------------------------------
//     // Validate role
//     // --------------------------------------------------

//     if (!normalizedRole) {
//       return res.status(400).json({
//         success: false,
//         message: "Role is required.",
//       });
//     }


//     if (!allowedRegistrationRoles.includes(normalizedRole)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid registration role.",
//       });
//     }


//     // --------------------------------------------------
//     // Register user
//     // --------------------------------------------------

//     const user = await registerUser({
//       name,
//       email,
//       phone,
//       address,
//       password,
//       role: normalizedRole,
//     });


//     // --------------------------------------------------
//     // Create email verification OTP
//     // --------------------------------------------------

//     const { otp } = await createOtp({
//       email,
//       purpose: "EMAIL_VERIFICATION",
//     });


//     // --------------------------------------------------
//     // Send email verification OTP
//     // --------------------------------------------------

//     await sendOtpEmail({
//       email,
//       otp,
//       purpose: "EMAIL_VERIFICATION",
//     });


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(201).json({
//       success: true,
//       message: "Account created. Verification OTP sent.",
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // LOGIN
// // ======================================================

// export async function login(req, res, next) {
//   try {
//     const {
//       email,
//       password,
//     } = req.body;


//     // --------------------------------------------------
//     // Login user
//     // --------------------------------------------------

//     const result = await loginUser({
//       email,
//       password,
//       userAgent: req.get("user-agent"),
//       ipAddress: req.ip,
//     });


//     // --------------------------------------------------
//     // Store refresh token in HTTP-only cookie
//     // --------------------------------------------------

//     res.cookie(
//       "refreshToken",
//       result.refreshToken,
//       refreshCookieOptions
//     );


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message: "Login successful.",
//       data: {
//         user: result.user,
//         accessToken: result.accessToken,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // REFRESH TOKEN
// // ======================================================

// export async function refreshToken(req, res, next) {
//   try {
//     // --------------------------------------------------
//     // Get refresh token from cookie
//     // --------------------------------------------------

//     const token = req.cookies.refreshToken;


//     // --------------------------------------------------
//     // Generate new access token
//     // --------------------------------------------------

//     const result = await refreshAccessToken(
//       token,
//       req.get("user-agent"),
//       req.ip
//     );


//     // --------------------------------------------------
//     // Rotate refresh token
//     // --------------------------------------------------

//     res.cookie(
//       "refreshToken",
//       result.refreshToken,
//       refreshCookieOptions
//     );


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message: "Token refreshed successfully.",
//       data: {
//         accessToken: result.accessToken,
//         user: result.user,
//       },
//     });
//   } catch (error) {
//     // --------------------------------------------------
//     // Clear invalid refresh token
//     // --------------------------------------------------

//     res.clearCookie(
//       "refreshToken",
//       refreshCookieOptions
//     );

//     next(error);
//   }
// }


// // ======================================================
// // LOGOUT
// // ======================================================

// export async function logout(req, res, next) {
//   try {
//     // --------------------------------------------------
//     // Get refresh token
//     // --------------------------------------------------

//     const token = req.cookies.refreshToken;


//     // --------------------------------------------------
//     // Logout current session
//     // --------------------------------------------------

//     await logoutUser(token);


//     // --------------------------------------------------
//     // Clear refresh token cookie
//     // --------------------------------------------------

//     res.clearCookie(
//       "refreshToken",
//       refreshCookieOptions
//     );


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message: "Logged out successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // LOGOUT ALL DEVICES
// // ======================================================

// export async function logoutAll(req, res, next) {
//   try {
//     // --------------------------------------------------
//     // Logout all sessions
//     // --------------------------------------------------

//     await logoutAllSessions(req.user.id);


//     // --------------------------------------------------
//     // Clear current refresh token
//     // --------------------------------------------------

//     res.clearCookie(
//       "refreshToken",
//       refreshCookieOptions
//     );


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message: "Logged out from all devices.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // GET CURRENT USER
// // ======================================================

// export async function me(req, res, next) {
//   try {
//     // --------------------------------------------------
//     // Get current user
//     // --------------------------------------------------

//     const user = await getCurrentUser(req.user.id);


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,

//       data: {
//         id: user._id,

//         name: user.name,

//         email: user.email,

//         phone: user.phone,

//         address: user.address,

//         role: user.role,

//         profileImage: user.profileImage,

//         isEmailVerified: user.isEmailVerified,

//         isActive: user.isActive,

//         isSuspended: user.isSuspended,

//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // VERIFY EMAIL OTP
// // ======================================================

// export async function verifyEmailOtp(req, res, next) {
//   try {
//     const {
//       email,
//       otp,
//     } = req.body;


//     // --------------------------------------------------
//     // Verify OTP
//     // --------------------------------------------------

//     await verifyOtp({
//       email,
//       otp,
//       purpose: "EMAIL_VERIFICATION",
//     });


//     // --------------------------------------------------
//     // Mark email as verified
//     // --------------------------------------------------

//     const user = await User.findOneAndUpdate(
//       {
//         email: email.toLowerCase().trim(),
//       },

//       {
//         $set: {
//           isEmailVerified: true,
//         },
//       },

//       {
//         new: true,
//       }
//     );


//     // --------------------------------------------------
//     // User not found
//     // --------------------------------------------------

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.json({
//       success: true,
//       message: "Email verified successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // RESEND EMAIL OTP
// // ======================================================

// export async function resendVerificationOtp(
//   req,
//   res,
//   next
// ) {
//   try {
//     const { email } = req.body;


//     // --------------------------------------------------
//     // Find user
//     // --------------------------------------------------

//     const user = await User.findOne({
//       email: email.toLowerCase().trim(),
//     });


//     // --------------------------------------------------
//     // User not found
//     // --------------------------------------------------

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }


//     // --------------------------------------------------
//     // Check email verification
//     // --------------------------------------------------

//     if (user.isEmailVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is already verified.",
//       });
//     }


//     // --------------------------------------------------
//     // Create new OTP
//     // --------------------------------------------------

//     const { otp } = await createOtp({
//       email,
//       purpose: "EMAIL_VERIFICATION",
//     });


//     // --------------------------------------------------
//     // Send OTP
//     // --------------------------------------------------

//     await sendOtpEmail({
//       email,
//       otp,
//       purpose: "EMAIL_VERIFICATION",
//     });


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.json({
//       success: true,
//       message: "Verification OTP resent.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // REQUEST FORGOT PASSWORD OTP
// // ======================================================

// export async function forgotPassword(req, res, next) {
//   try {
//     const { email } = req.body;


//     // --------------------------------------------------
//     // Request forgot password OTP
//     // --------------------------------------------------

//     const result = await requestForgotPasswordOtp(
//       email
//     );


//     /*
//      * Always return the same response
//      * whether email exists or not.
//      *
//      * This prevents email enumeration.
//      */


//     // --------------------------------------------------
//     // Send OTP only when account exists
//     // --------------------------------------------------

//     if (result.sent) {
//       await sendOtpEmail({
//         email: email.toLowerCase().trim(),
//         otp: result.otp,
//         purpose: "FORGOT_PASSWORD",
//       });
//     }


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message:
//         "If an account exists for this email, a password reset OTP has been sent.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // VERIFY FORGOT PASSWORD OTP
// // ======================================================

// export async function verifyResetOtp(req, res, next) {
//   try {
//     const {
//       email,
//       otp,
//     } = req.body;


//     // --------------------------------------------------
//     // Verify forgot password OTP
//     // --------------------------------------------------

//     await verifyForgotPasswordOtp({
//       email,
//       otp,
//     });


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message:
//         "OTP verified successfully. You can now reset your password.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // RESET PASSWORD
// // ======================================================

// export async function resetPasswordController(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       email,
//       newPassword,
//     } = req.body;


//     /*
//      * Important:
//      *
//      * We verify that the latest OTP
//      * has already been verified.
//      */


//     // --------------------------------------------------
//     // Find verified OTP
//     // --------------------------------------------------

//     const otpRecord = await Otp.findOne({
//       email: email.toLowerCase().trim(),

//       purpose: "FORGOT_PASSWORD",

//       verified: true,

//       consumed: false,
//     }).sort({
//       createdAt: -1,
//     });


//     // --------------------------------------------------
//     // OTP verification required
//     // --------------------------------------------------

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Please verify the password reset OTP first.",
//       });
//     }


//     // --------------------------------------------------
//     // Reset password
//     // --------------------------------------------------

//     await resetPassword({
//       email,
//       newPassword,
//     });


//     // --------------------------------------------------
//     // Consume OTP
//     // --------------------------------------------------

//     otpRecord.consumed = true;

//     await otpRecord.save();


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message:
//         "Password reset successfully. Please login again.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// // ======================================================
// // CHANGE PASSWORD
// // ======================================================

// export async function changePasswordController(
//   req,
//   res,
//   next
// ) {
//   try {
//     const {
//       currentPassword,
//       newPassword,
//     } = req.body;


//     // --------------------------------------------------
//     // Change password
//     // --------------------------------------------------

//     await changePassword({
//       userId: req.user.id,
//       currentPassword,
//       newPassword,
//     });


//     // --------------------------------------------------
//     // Response
//     // --------------------------------------------------

//     res.status(200).json({
//       success: true,
//       message:
//         "Password changed successfully. Please login again.",
//     });
//   } catch (error) {
//     next(error);
//   }
// }



import User from "../models/User.js";
import Otp from "../models/Otp.js";

import {
  registerUser,
  loginUser,
  createOtp,
  verifyOtp,
  refreshAccessToken,
  logoutUser,
  logoutAllSessions,
  getCurrentUser,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  changePassword,
} from "../services/authService.js";

import { sendOtpEmail } from "../services/emailService.js";

import { refreshCookieOptions } from "../utils/cookieOptions.js";


// ======================================================
// REGISTER
// ======================================================

export async function register(req, res, next) {
  let createdUser = null;

  try {
    // --------------------------------------------------
    // Get registration data
    // --------------------------------------------------

    const {
      name,
      email,
      phone,
      address,
      password,
      role,
    } = req.body;


    // --------------------------------------------------
    // Normalize email
    // --------------------------------------------------

    const normalizedEmail =
      String(email || "")
        .trim()
        .toLowerCase();


    // --------------------------------------------------
    // Normalize role
    // --------------------------------------------------

    const normalizedRole =
      String(role || "")
        .trim()
        .toUpperCase();


    // --------------------------------------------------
    // Allowed roles for registration
    //
    // SUPER_ADMIN is intentionally not allowed from
    // public registration.
    // --------------------------------------------------

    const allowedRegistrationRoles = [
      "STUDENT",
      "INSTRUCTOR",
      "ADMIN",
    ];


    // --------------------------------------------------
    // Validate role
    // --------------------------------------------------

    if (!normalizedRole) {
      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }


    if (
      !allowedRegistrationRoles.includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role.",
      });
    }


    // --------------------------------------------------
    // Register user
    //
    // registerUser() also validates email format
    // at service level.
    // --------------------------------------------------

    createdUser = await registerUser({
      name,
      email: normalizedEmail,
      phone,
      address,
      password,
      role: normalizedRole,
    });


    // --------------------------------------------------
    // Create email verification OTP
    // --------------------------------------------------

    const otpResult = await createOtp({
      email: normalizedEmail,
      purpose: "EMAIL_VERIFICATION",
    });


    // --------------------------------------------------
    // Send email verification OTP
    // --------------------------------------------------

    try {
      await sendOtpEmail({
        email: normalizedEmail,
        otp: otpResult.otp,
        purpose: "EMAIL_VERIFICATION",
      });
    } catch (emailError) {

      // ==================================================
      // EMAIL SENDING FAILED
      // ==================================================
      //
      // IMPORTANT:
      //
      // User was created before sending OTP.
      //
      // If SMTP rejects the recipient or email sending
      // fails, remove the newly created user and OTP.
      //
      // This prevents invalid registrations from staying
      // inside MongoDB.
      // ==================================================

      if (createdUser?.id) {
        await User.deleteOne({
          _id: createdUser.id,
        });
      }

      await Otp.deleteMany({
        email: normalizedEmail,
        purpose: "EMAIL_VERIFICATION",
        verified: false,
        consumed: false,
      });

      throw new Error(
        "Unable to send verification OTP. Please check your email address and try again."
      );
    }


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Account created. Verification OTP sent.",

      data: {
        email: normalizedEmail,

        expiresAt:
          otpResult.expiresAt,
      },
    });

  } catch (error) {

    // --------------------------------------------------
    // IMPORTANT CLEANUP
    //
    // This handles failures that happen AFTER the user
    // has been created but BEFORE registration succeeds.
    //
    // If sendOtpEmail() already handled cleanup,
    // deleting again is harmless because deleteOne()
    // simply affects zero documents.
    // --------------------------------------------------

    if (createdUser?.id) {
      try {
        await User.deleteOne({
          _id: createdUser.id,
        });
      } catch (cleanupError) {
        console.error(
          "Registration user cleanup failed:",
          cleanupError.message
        );
      }
    }

    next(error);
  }
}


// ======================================================
// LOGIN
// ======================================================

export async function login(req, res, next) {
  try {
    const {
      email,
      password,
    } = req.body;


    // --------------------------------------------------
    // Login user
    // --------------------------------------------------

    const result = await loginUser({
      email,
      password,
      userAgent: req.get("user-agent"),
      ipAddress: req.ip,
    });


    // --------------------------------------------------
    // Store refresh token in HTTP-only cookie
    // --------------------------------------------------

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Login successful.",

      data: {
        user: result.user,

        accessToken:
          result.accessToken,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// REFRESH TOKEN
// ======================================================

export async function refreshToken(
  req,
  res,
  next
) {
  try {

    // --------------------------------------------------
    // Get refresh token from cookie
    // --------------------------------------------------

    const token =
      req.cookies.refreshToken;


    // --------------------------------------------------
    // Generate new access token
    // --------------------------------------------------

    const result =
      await refreshAccessToken(
        token,
        req.get("user-agent"),
        req.ip
      );


    // --------------------------------------------------
    // Rotate refresh token
    // --------------------------------------------------

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Token refreshed successfully.",

      data: {
        accessToken:
          result.accessToken,

        user:
          result.user,
      },
    });

  } catch (error) {

    // --------------------------------------------------
    // Clear invalid refresh token
    // --------------------------------------------------

    res.clearCookie(
      "refreshToken",
      refreshCookieOptions
    );

    next(error);
  }
}


// ======================================================
// LOGOUT
// ======================================================

export async function logout(
  req,
  res,
  next
) {
  try {

    // --------------------------------------------------
    // Get refresh token
    // --------------------------------------------------

    const token =
      req.cookies.refreshToken;


    // --------------------------------------------------
    // Logout current session
    // --------------------------------------------------

    await logoutUser(token);


    // --------------------------------------------------
    // Clear refresh token cookie
    // --------------------------------------------------

    res.clearCookie(
      "refreshToken",
      refreshCookieOptions
    );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Logged out successfully.",
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// LOGOUT ALL DEVICES
// ======================================================

export async function logoutAll(
  req,
  res,
  next
) {
  try {

    // --------------------------------------------------
    // Logout all sessions
    // --------------------------------------------------

    await logoutAllSessions(
      req.user.id
    );


    // --------------------------------------------------
    // Clear current refresh token
    // --------------------------------------------------

    res.clearCookie(
      "refreshToken",
      refreshCookieOptions
    );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Logged out from all devices.",
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// GET CURRENT USER
// ======================================================

export async function me(
  req,
  res,
  next
) {
  try {

    // --------------------------------------------------
    // Get current user
    // --------------------------------------------------

    const user =
      await getCurrentUser(
        req.user.id
      );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      data: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        phone:
          user.phone,

        address:
          user.address,

        role:
          user.role,

        profileImage:
          user.profileImage,

        isEmailVerified:
          user.isEmailVerified,

        isActive:
          user.isActive,

        isSuspended:
          user.isSuspended,

        createdAt:
          user.createdAt,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// VERIFY EMAIL OTP
// ======================================================

export async function verifyEmailOtp(
  req,
  res,
  next
) {
  try {
    const {
      email,
      otp,
    } = req.body;


    // --------------------------------------------------
    // Normalize email
    // --------------------------------------------------

    const normalizedEmail =
      String(email || "")
        .trim()
        .toLowerCase();


    // --------------------------------------------------
    // Verify OTP
    // --------------------------------------------------

    await verifyOtp({
      email: normalizedEmail,

      otp,

      purpose:
        "EMAIL_VERIFICATION",
    });


    // --------------------------------------------------
    // Mark email as verified
    // --------------------------------------------------

    const user =
      await User.findOneAndUpdate(
        {
          email:
            normalizedEmail,
        },

        {
          $set: {
            isEmailVerified:
              true,
          },
        },

        {
          new: true,
        }
      );


    // --------------------------------------------------
    // User not found
    // --------------------------------------------------

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "User not found.",
      });
    }


    // --------------------------------------------------
    // Consume email verification OTP
    //
    // We consume it after successful verification.
    // This prevents the same OTP from being reused.
    // --------------------------------------------------

    await Otp.updateMany(
      {
        email:
          normalizedEmail,

        purpose:
          "EMAIL_VERIFICATION",

        verified:
          true,

        consumed:
          false,
      },

      {
        $set: {
          consumed:
            true,
        },
      }
    );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Email verified successfully.",
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// RESEND EMAIL OTP
// ======================================================

export async function resendVerificationOtp(
  req,
  res,
  next
) {
  try {
    const {
      email,
    } = req.body;


    // --------------------------------------------------
    // Normalize email
    // --------------------------------------------------

    const normalizedEmail =
      String(email || "")
        .trim()
        .toLowerCase();


    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user =
      await User.findOne({
        email:
          normalizedEmail,
      });


    // --------------------------------------------------
    // User not found
    // --------------------------------------------------

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "User not found.",
      });
    }


    // --------------------------------------------------
    // Check email verification
    // --------------------------------------------------

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,

        message:
          "Email is already verified.",
      });
    }


    // --------------------------------------------------
    // Create new OTP
    // --------------------------------------------------

    const otpResult =
      await createOtp({
        email:
          normalizedEmail,

        purpose:
          "EMAIL_VERIFICATION",
      });


    // --------------------------------------------------
    // Send OTP
    // --------------------------------------------------

    try {

      await sendOtpEmail({
        email:
          normalizedEmail,

        otp:
          otpResult.otp,

        purpose:
          "EMAIL_VERIFICATION",
      });

    } catch (emailError) {

      // ------------------------------------------------
      // Remove failed OTP
      // ------------------------------------------------

      await Otp.deleteMany({
        email:
          normalizedEmail,

        purpose:
          "EMAIL_VERIFICATION",

        verified:
          false,

        consumed:
          false,
      });

      throw emailError;
    }


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Verification OTP resent.",
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// REQUEST FORGOT PASSWORD OTP
// ======================================================

export async function forgotPassword(
  req,
  res,
  next
) {
  try {
    const {
      email,
    } = req.body;


    // --------------------------------------------------
    // Request forgot password OTP
    // --------------------------------------------------

    const result =
      await requestForgotPasswordOtp(
        email
      );


    /*
     * Always return the same response
     * whether email exists or not.
     *
     * This prevents email enumeration.
     */


    // --------------------------------------------------
    // Send OTP only when account exists
    // --------------------------------------------------

    if (result.sent) {

      await sendOtpEmail({
        email:
          email.toLowerCase().trim(),

        otp:
          result.otp,

        purpose:
          "FORGOT_PASSWORD",
      });
    }


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "If an account exists for this email, a password reset OTP has been sent.",
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// VERIFY FORGOT PASSWORD OTP
// ======================================================

export async function verifyResetOtp(
  req,
  res,
  next
) {
  try {
    const {
      email,
      otp,
    } = req.body;


    // --------------------------------------------------
    // Verify forgot password OTP
    // --------------------------------------------------

    await verifyForgotPasswordOtp({
      email,

      otp,
    });


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "OTP verified successfully. You can now reset your password.",
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// RESET PASSWORD
// ======================================================

export async function resetPasswordController(
  req,
  res,
  next
) {
  try {
    const {
      email,
      newPassword,
    } = req.body;


    /*
     * Important:
     *
     * We verify that the latest OTP
     * has already been verified.
     */


    // --------------------------------------------------
    // Normalize email
    // --------------------------------------------------

    const normalizedEmail =
      String(email || "")
        .trim()
        .toLowerCase();


    // --------------------------------------------------
    // Find verified OTP
    // --------------------------------------------------

    const otpRecord =
      await Otp.findOne({
        email:
          normalizedEmail,

        purpose:
          "FORGOT_PASSWORD",

        verified:
          true,

        consumed:
          false,
      }).sort({
        createdAt:
          -1,
      });


    // --------------------------------------------------
    // OTP verification required
    // --------------------------------------------------

    if (!otpRecord) {
      return res.status(400).json({
        success: false,

        message:
          "Please verify the password reset OTP first.",
      });
    }


    // --------------------------------------------------
    // Reset password
    // --------------------------------------------------

    await resetPassword({
      email:
        normalizedEmail,

      newPassword,
    });


    // --------------------------------------------------
    // Consume OTP
    // --------------------------------------------------

    otpRecord.consumed =
      true;

    await otpRecord.save();


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Password reset successfully. Please login again.",
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// CHANGE PASSWORD
// ======================================================

export async function changePasswordController(
  req,
  res,
  next
) {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;


    // --------------------------------------------------
    // Change password
    // --------------------------------------------------

    await changePassword({
      userId:
        req.user.id,

      currentPassword,

      newPassword,
    });


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Password changed successfully. Please login again.",
    });

  } catch (error) {
    next(error);
  }
}