
import api from "../api/axios.js";


// ======================================================
// REGISTER
// ======================================================

export async function registerUser({
  name,
  email,
  phone,
  address,
  role,
  password,
}) {

  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      phone,
      address,
      role,
      password,
    }
  );

  return response.data;
}


// ======================================================
// LOGIN
// ======================================================

export async function loginUser({
  email,
  password,
}) {

  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
}


// ======================================================
// REFRESH TOKEN
// ======================================================

export async function refreshToken() {

  const response = await api.post(
    "/auth/refresh-token"
  );

  return response.data;
}


// ======================================================
// LOGOUT
// ======================================================

export async function logoutUser() {

  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
}


// ======================================================
// LOGOUT ALL DEVICES
// ======================================================

export async function logoutAllDevices() {

  const response = await api.post(
    "/auth/logout-all"
  );

  return response.data;
}


// ======================================================
// GET CURRENT USER
// ======================================================

export async function getMe() {

  const response = await api.get(
    "/auth/me"
  );

  return response.data;
}


// ======================================================
// VERIFY EMAIL OTP
// ======================================================

export async function verifyEmailOtp({
  email,
  otp,
}) {

  const response = await api.post(
    "/auth/verify-email-otp",
    {
      email,
      otp,
    }
  );

  return response.data;
}


// ======================================================
// RESEND EMAIL VERIFICATION OTP
// ======================================================

export async function resendVerificationOtp({
  email,
}) {

  const response = await api.post(
    "/auth/resend-verification-otp",
    {
      email,
    }
  );

  return response.data;
}


// ======================================================
// FORGOT PASSWORD
// ======================================================

export async function forgotPassword({
  email,
}) {

  const response = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;
}


// ======================================================
// VERIFY RESET OTP
// ======================================================

export async function verifyResetOtp({
  email,
  otp,
}) {

  const response = await api.post(
    "/auth/verify-reset-otp",
    {
      email,
      otp,
    }
  );

  return response.data;
}


// ======================================================
// RESET PASSWORD
// ======================================================

export async function resetPassword({
  email,
  newPassword,
}) {

  const response = await api.post(
    "/auth/reset-password",
    {
      email,
      newPassword,
    }
  );

  return response.data;
}


// ======================================================
// CHANGE PASSWORD
// ======================================================

export async function changePassword({
  currentPassword,
  newPassword,
}) {

  const response = await api.post(
    "/auth/change-password",
    {
      currentPassword,
      newPassword,
    }
  );

  return response.data;
}