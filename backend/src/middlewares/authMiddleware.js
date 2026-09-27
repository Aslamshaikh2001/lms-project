
// import jwt from "jsonwebtoken";
// import env from "../config/env.js";
// import User from "../models/User.js";

// export const authenticate = async (req, res, next) => {
//   try {
//     // ============================================
//     // 1. Get Authorization header
//     // ============================================

//     const authHeader = req.headers.authorization;

//     console.log("=================================");
//     console.log("AUTH MIDDLEWARE");
//     console.log("Authorization Header:", authHeader);
//     console.log("JWT Secret Exists:", !!env.jwtAccessSecret);
//     console.log("=================================");

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "Authorization header is missing.",
//       });
//     }

//     // ============================================
//     // 2. Check Bearer token
//     // ============================================

//     if (!authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Authorization format must be Bearer <token>.",
//       });
//     }

//     const token = authHeader.substring(7).trim();

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token is missing.",
//       });
//     }

//     console.log("Token received:", token.substring(0, 20) + "...");

//     // ============================================
//     // 3. Verify JWT
//     // ============================================

//     let decoded;

//     try {
//       decoded = jwt.verify(
//         token,
//         env.jwtAccessSecret
//       );

//       console.log("JWT decoded:", decoded);
//     } catch (jwtError) {
//       console.error("JWT VERIFY ERROR:");
//       console.error("Name:", jwtError.name);
//       console.error("Message:", jwtError.message);

//       if (jwtError.name === "TokenExpiredError") {
//         return res.status(401).json({
//           success: false,
//           message: "Access token expired. Please login again.",
//         });
//       }

//       if (jwtError.name === "JsonWebTokenError") {
//         return res.status(401).json({
//           success: false,
//           message: "Invalid access token.",
//         });
//       }

//       return res.status(401).json({
//         success: false,
//         message: "Unable to verify access token.",
//       });
//     }

//     // ============================================
//     // 4. Get user ID from JWT
//     // ============================================

//     const userId =
//       decoded.userId ||
//       decoded.id ||
//       decoded._id;

//     if (!userId) {
//       console.error("JWT does not contain user ID:", decoded);

//       return res.status(401).json({
//         success: false,
//         message: "Invalid token payload.",
//       });
//     }

//     // ============================================
//     // 5. Find user
//     // ============================================

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User account not found.",
//       });
//     }

//     // ============================================
//     // 6. Check account status
//     // ============================================

//     if (user.isActive === false) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is inactive.",
//       });
//     }

//     if (user.isSuspended === true) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is suspended.",
//       });
//     }

//     // ============================================
//     // 7. Attach user to request
//     // ============================================

//     req.user = {
//       id: user._id.toString(),
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isEmailVerified: user.isEmailVerified,
//     };

//     console.log("Authenticated user:", {
//       id: req.user.id,
//       email: req.user.email,
//       role: req.user.role,
//     });

//     // ============================================
//     // 8. Continue
//     // ============================================

//     next();

//   } catch (error) {
//     console.error("AUTH MIDDLEWARE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Authentication server error.",
//     });
//   }
// };

// // ============================================
// // ROLE AUTHORIZATION
// // ============================================

// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "Authentication required.",
//         });
//       }

//       if (!allowedRoles.includes(req.user.role)) {
//         return res.status(403).json({
//           success: false,
//           message: "You are not authorized to access this resource.",
//         });
//       }

//       next();
//     } catch (error) {
//       console.error(
//         "ROLE AUTHORIZATION ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message: "Authorization server error.",
//       });
//     }
//   };
// };




import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";


// ======================================================
// AUTHENTICATE
// ======================================================

export const authenticate = async (
  req,
  res,
  next
) => {
  try {

    // ==================================================
    // 1. GET AUTHORIZATION HEADER
    // ==================================================

    const authHeader =
      req.headers.authorization;


    console.log("=================================");
    console.log("AUTH MIDDLEWARE");
    console.log(
      "Authorization Header:",
      authHeader ? "Bearer token received" : "Missing"
    );
    console.log(
      "JWT Secret Exists:",
      !!env.jwtAccessSecret
    );
    console.log("=================================");


    // ==================================================
    // 2. CHECK AUTHORIZATION HEADER
    // ==================================================

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization header is missing.",
      });
    }


    // ==================================================
    // 3. CHECK BEARER FORMAT
    // ==================================================

    if (
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization format must be Bearer <token>.",
      });
    }


    // ==================================================
    // 4. GET TOKEN
    // ==================================================

    const token =
      authHeader.substring(7).trim();


    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access token is missing.",
      });
    }


    console.log(
      "Token received:",
      `${token.substring(0, 20)}...`
    );


    // ==================================================
    // 5. VERIFY JWT
    // ==================================================

    let decoded;


    try {

      decoded = jwt.verify(
        token,
        env.jwtAccessSecret
      );


      console.log(
        "JWT decoded:",
        decoded
      );

    } catch (jwtError) {

      console.error(
        "JWT VERIFY ERROR:"
      );

      console.error(
        "Name:",
        jwtError.name
      );

      console.error(
        "Message:",
        jwtError.message
      );


      // ----------------------------------------------
      // Token expired
      // ----------------------------------------------

      if (
        jwtError.name ===
        "TokenExpiredError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Access token expired. Please login again.",
        });
      }


      // ----------------------------------------------
      // Invalid token
      // ----------------------------------------------

      if (
        jwtError.name ===
        "JsonWebTokenError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid access token.",
        });
      }


      // ----------------------------------------------
      // Other JWT error
      // ----------------------------------------------

      return res.status(401).json({
        success: false,
        message:
          "Unable to verify access token.",
      });
    }


    // ==================================================
    // 6. GET USER ID FROM JWT
    // ==================================================
    //
    // Supports:
    //
    // userId
    // id
    // _id
    //
    // This preserves your existing compatibility.
    //

    const userId =
      decoded.userId ||
      decoded.id ||
      decoded._id;


    if (!userId) {

      console.error(
        "JWT does not contain user ID:",
        decoded
      );


      return res.status(401).json({
        success: false,
        message:
          "Invalid token payload.",
      });
    }


    // ==================================================
    // 7. FIND USER
    // ==================================================

    const user =
      await User.findById(userId);


    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account not found.",
      });
    }


    // ==================================================
    // 8. CHECK ACCOUNT STATUS
    // ==================================================

    if (
      user.isActive === false
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive.",
      });
    }


    // ==================================================
    // 9. CHECK SUSPENDED STATUS
    // ==================================================

    if (
      user.isSuspended === true
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is suspended.",
      });
    }


    // ==================================================
    // 10. ATTACH USER TO REQUEST
    // ==================================================

    req.user = {

      id:
        user._id.toString(),

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
    };


    // ==================================================
    // LOG AUTHENTICATED USER
    // ==================================================

    console.log(
      "Authenticated user:",
      {
        id:
          req.user.id,

        email:
          req.user.email,

        role:
          req.user.role,
      }
    );


    // ==================================================
    // 11. CONTINUE
    // ==================================================

    next();

  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Authentication server error.",
    });
  }
};


// ======================================================
// ROLE AUTHORIZATION
// ======================================================

export const authorizeRoles =
  (...allowedRoles) => {

    return (
      req,
      res,
      next
    ) => {

      try {

        // ==============================================
        // 1. CHECK AUTHENTICATION
        // ==============================================

        if (!req.user) {
          return res.status(401).json({
            success: false,
            message:
              "Authentication required.",
          });
        }


        // ==============================================
        // 2. NORMALIZE USER ROLE
        // ==============================================

        const userRole =
          String(
            req.user.role || ""
          )
            .trim()
            .toUpperCase();


        // ==============================================
        // 3. NORMALIZE ALLOWED ROLES
        // ==============================================

        const normalizedAllowedRoles =
          allowedRoles.map(
            (role) =>
              String(role)
                .trim()
                .toUpperCase()
          );


        // ==============================================
        // 4. CHECK ROLE
        // ==============================================

        if (
          !normalizedAllowedRoles.includes(
            userRole
          )
        ) {
          return res.status(403).json({
            success: false,
            message:
              "You are not authorized to access this resource.",
          });
        }


        // ==============================================
        // 5. CONTINUE
        // ==============================================

        next();

      } catch (error) {

        console.error(
          "ROLE AUTHORIZATION ERROR:",
          error
        );


        return res.status(500).json({
          success: false,
          message:
            "Authorization server error.",
        });
      }
    };
  };