import { validationResult } from "express-validator";

export function validateRequest(
  req,
  res,
  next
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array(),
    });
  }

  next();
}

export function errorHandler(
  error,
  req,
  res,
  next
) {
  console.error(error);

  res.status(500).json({
    success: false,
    message:
      error.message ||
      "Internal server error.",
  });
}