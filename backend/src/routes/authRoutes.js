
import express from "express";

import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  me,
  verifyEmailOtp,
  resendVerificationOtp,

  forgotPassword,
  verifyResetOtp,
  resetPasswordController,
  changePasswordController,
} from "../controllers/authController.js";

import {
  authenticate,
} from "../middlewares/authMiddleware.js";

import {
  registerValidator,
  loginValidator,
  otpValidator,
  emailValidator,
  forgotPasswordValidator,
  resetOtpValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from "../validators/authValidator.js";

import {
  validateRequest,
} from "../middlewares/errorMiddleware.js";

const router = express.Router();


// Public
router.post(
  "/register",
  registerValidator,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
);

router.post(
  "/refresh-token",
  refreshToken
);

router.post(
  "/verify-email-otp",
  otpValidator,
  validateRequest,
  verifyEmailOtp
);

router.post(
  "/resend-verification-otp",
  emailValidator,
  validateRequest,
  resendVerificationOtp
);


router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  forgotPassword
);


router.post(
  "/verify-reset-otp",
  resetOtpValidator,
  validateRequest,
  verifyResetOtp
);


router.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  resetPasswordController
);


// Authenticated
router.post(
  "/logout",
  logout
);

router.post(
  "/logout-all",
  authenticate,
  logoutAll
);

router.get(
  "/me",
  authenticate,
  me
);


router.post(
  "/change-password",
  authenticate,
  changePasswordValidator,
  validateRequest,
  changePasswordController
);

export default router;