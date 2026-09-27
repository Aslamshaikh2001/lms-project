
// import { body } from "express-validator";

// export const registerValidator = [
//   body("name")
//     .trim()
//     .notEmpty()
//     .withMessage(
//       "Name is required."
//     )
//     .isLength({
//       min: 2,
//       max: 100,
//     })
//     .withMessage(
//       "Name must be between 2 and 100 characters."
//     ),

//   body("email")
//     .trim()
//     .notEmpty()
//     .withMessage(
//       "Email is required."
//     )
//     .isEmail()
//     .withMessage(
//       "Please provide a valid email."
//     )
//     .normalizeEmail(),

//   body("password")
//     .isString()
//     .isLength({
//       min: 8,
//     })
//     .withMessage(
//       "Password must be at least 8 characters."
//     ),
// ];

// export const loginValidator = [
//   body("email")
//     .trim()
//     .notEmpty()
//     .withMessage(
//       "Email is required."
//     )
//     .isEmail()
//     .withMessage(
//       "Please provide a valid email."
//     )
//     .normalizeEmail(),

//   body("password")
//     .notEmpty()
//     .withMessage(
//       "Password is required."
//     ),
// ];

// export const otpValidator = [
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage(
//       "Valid email is required."
//     )
//     .normalizeEmail(),

//   body("otp")
//     .trim()
//     .matches(/^[0-9]{6}$/)
//     .withMessage(
//       "OTP must contain exactly 6 digits."
//     ),
// ];

// export const emailValidator = [
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage(
//       "Valid email is required."
//     )
//     .normalizeEmail(),
// ];


// export const forgotPasswordValidator = [
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage(
//       "Valid email is required."
//     )
//     .normalizeEmail(),
// ];


// export const resetOtpValidator = [
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage(
//       "Valid email is required."
//     )
//     .normalizeEmail(),

//   body("otp")
//     .trim()
//     .matches(/^[0-9]{6}$/)
//     .withMessage(
//       "OTP must contain exactly 6 digits."
//     ),
// ];



// export const resetPasswordValidator = [
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage(
//       "Valid email is required."
//     )
//     .normalizeEmail(),

//   body("newPassword")
//     .isString()
//     .isLength({
//       min: 8,
//     })
//     .withMessage(
//       "Password must be at least 8 characters."
//     ),
// ];


// export const changePasswordValidator = [
//   body("currentPassword")
//     .notEmpty()
//     .withMessage(
//       "Current password is required."
//     ),

//   body("newPassword")
//     .isString()
//     .isLength({
//       min: 8,
//     })
//     .withMessage(
//       "New password must be at least 8 characters."
//     ),
// ];






import { body } from "express-validator";


// ======================================================
// COMMON ROLE VALUES
// ======================================================
//
// These are the roles supported by the User model.
//
// SUPER_ADMIN is intentionally NOT included in the
// public registration validator.
//
// SUPER_ADMIN should normally be created/assigned by
// an existing authorized administrator.
//

const PUBLIC_REGISTRATION_ROLES = [
  "STUDENT",
  "INSTRUCTOR",
  "ADMIN",
];


// ======================================================
// REGISTER VALIDATOR
// ======================================================

export const registerValidator = [

  // --------------------------------------------------
  // Name
  // --------------------------------------------------

  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Name is required."
    )
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Name must be between 2 and 100 characters."
    ),


  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Please provide a valid email."
    )
    .normalizeEmail(),


  // --------------------------------------------------
  // Phone
  // --------------------------------------------------

  body("phone")
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .trim()
    .isLength({
      min: 10,
      max: 15,
    })
    .withMessage(
      "Phone number must be between 10 and 15 characters."
    )
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage(
      "Please provide a valid phone number."
    ),


  // --------------------------------------------------
  // Address
  // --------------------------------------------------
  //
  // Expected format:
  //
  // {
  //   street,
  //   city,
  //   state,
  //   country,
  //   postalCode
  // }
  //

  body("address")
    .optional({
      nullable: true,
    })
    .isObject()
    .withMessage(
      "Address must be an object."
    ),


  // --------------------------------------------------
  // Address - Street
  // --------------------------------------------------

  body("address.street")
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .trim()
    .isLength({
      max: 200,
    })
    .withMessage(
      "Street address cannot exceed 200 characters."
    ),


  // --------------------------------------------------
  // Address - City
  // --------------------------------------------------

  body("address.city")
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "City cannot exceed 100 characters."
    ),


  // --------------------------------------------------
  // Address - State
  // --------------------------------------------------

  body("address.state")
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "State cannot exceed 100 characters."
    ),


  // --------------------------------------------------
  // Address - Country
  // --------------------------------------------------

  body("address.country")
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "Country cannot exceed 100 characters."
    ),


  // --------------------------------------------------
  // Address - Postal Code
  // --------------------------------------------------

  body("address.postalCode")
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .trim()
    .isLength({
      min: 3,
      max: 20,
    })
    .withMessage(
      "Postal code must be between 3 and 20 characters."
    ),


  // --------------------------------------------------
  // Role
  // --------------------------------------------------

  body("role")
    .trim()
    .notEmpty()
    .withMessage(
      "Role is required."
    )
    .customSanitizer((value) => {
      return String(value)
        .trim()
        .toUpperCase();
    })
    .isIn(PUBLIC_REGISTRATION_ROLES)
    .withMessage(
      "Please select a valid registration role."
    ),


  // --------------------------------------------------
  // Password
  // --------------------------------------------------

  body("password")
    .isString()
    .isLength({
      min: 8,
    })
    .withMessage(
      "Password must be at least 8 characters."
    ),

];


// ======================================================
// LOGIN VALIDATOR
// ======================================================

export const loginValidator = [

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Please provide a valid email."
    )
    .normalizeEmail(),


  // --------------------------------------------------
  // Password
  // --------------------------------------------------

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required."
    ),

];


// ======================================================
// OTP VALIDATOR
// ======================================================

export const otpValidator = [

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Valid email is required."
    )
    .normalizeEmail(),


  // --------------------------------------------------
  // OTP
  // --------------------------------------------------

  body("otp")
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage(
      "OTP must contain exactly 6 digits."
    ),

];


// ======================================================
// EMAIL VALIDATOR
// ======================================================

export const emailValidator = [

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Valid email is required."
    )
    .normalizeEmail(),

];


// ======================================================
// FORGOT PASSWORD VALIDATOR
// ======================================================

export const forgotPasswordValidator = [

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Valid email is required."
    )
    .normalizeEmail(),

];


// ======================================================
// RESET OTP VALIDATOR
// ======================================================

export const resetOtpValidator = [

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Valid email is required."
    )
    .normalizeEmail(),


  // --------------------------------------------------
  // OTP
  // --------------------------------------------------

  body("otp")
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage(
      "OTP must contain exactly 6 digits."
    ),

];


// ======================================================
// RESET PASSWORD VALIDATOR
// ======================================================

export const resetPasswordValidator = [

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Valid email is required."
    )
    .normalizeEmail(),


  // --------------------------------------------------
  // New password
  // --------------------------------------------------

  body("newPassword")
    .isString()
    .isLength({
      min: 8,
    })
    .withMessage(
      "Password must be at least 8 characters."
    ),

];


// ======================================================
// CHANGE PASSWORD VALIDATOR
// ======================================================

export const changePasswordValidator = [

  // --------------------------------------------------
  // Current password
  // --------------------------------------------------

  body("currentPassword")
    .notEmpty()
    .withMessage(
      "Current password is required."
    ),


  // --------------------------------------------------
  // New password
  // --------------------------------------------------

  body("newPassword")
    .isString()
    .isLength({
      min: 8,
    })
    .withMessage(
      "New password must be at least 8 characters."
    ),

];
