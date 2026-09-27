// import jwt from "jsonwebtoken";
// import env from "../config/env.js";

// export function generateAccessToken(user) {
//   return jwt.sign(
//     {
//       userId: user._id.toString(),
//       role: user.role,
//     },
//     env.jwtAccessSecret,
//     {
//       expiresIn: env.jwtAccessExpiresIn,
//     }
//   );
// }

// export function generateRefreshToken(user) {
//   return jwt.sign(
//     {
//       userId: user._id.toString(),
//       tokenVersion: user.refreshTokenVersion,
//     },
//     env.jwtRefreshSecret,
//     {
//       expiresIn: env.jwtRefreshExpiresIn,
//     }
//   );
// }






import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.jwtAccessSecret,
    {
      expiresIn: env.jwtAccessExpiresIn,
    }
  );
}

export function generateRefreshToken({
  userId,
  sessionId,
}) {
  return jwt.sign(
    {
      userId: userId.toString(),
      sessionId: sessionId.toString(),
    },
    env.jwtRefreshSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn,
    }
  );
}