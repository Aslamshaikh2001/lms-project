import "dotenv/config";

const env = {
  port: process.env.PORT || 5016,

  mongoUri: process.env.MONGO_URI,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

  jwtAccessExpiresIn:
    process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  jwtRefreshExpiresIn:
    process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  smtpHost: process.env.SMTP_HOST,

  smtpPort:
    process.env.SMTP_PORT || 587,

  smtpUser: process.env.SMTP_USER,

  smtpPassword: process.env.SMTP_PASSWORD,

  smtpFrom: process.env.SMTP_FROM,
};

export default env;