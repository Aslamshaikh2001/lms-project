import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;


// ======================================================
// INITIAL LMS USERS
// ======================================================

const users = [
  {
    name: "LMS Super Admin",
    email: "superadmin@lms.com",
    password: "SuperAdmin@123",
    role: "SUPER_ADMIN",
  },

  {
    name: "LMS Admin",
    email: "admin@lms.com",
    password: "Admin@123",
    role: "ADMIN",
  },

  {
    name: "LMS Instructor",
    email: "instructor@lms.com",
    password: "Instructor@123",
    role: "INSTRUCTOR",
  },
];


// ======================================================
// CREATE USERS
// ======================================================

async function createUsers() {
  try {

    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in .env"
      );
    }

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB connected successfully."
    );


    for (const userData of users) {

      const existingUser =
        await User.findOne({
          email: userData.email,
        });


      if (existingUser) {

        console.log(
          `User already exists: ${userData.email}`
        );

        continue;
      }


      const hashedPassword =
        await bcrypt.hash(
          userData.password,
          12
        );


      const user =
        await User.create({
          name: userData.name,

          email:
            userData.email
              .toLowerCase()
              .trim(),

          password:
            hashedPassword,

          role:
            userData.role,

          isEmailVerified: true,

          isActive: true,

          isSuspended: false,
        });


      console.log(
        `Created ${user.role}: ${user.email}`
      );
    }


    console.log(
      "\nInitial LMS users setup completed."
    );

  } catch (error) {

    console.error(
      "Error creating users:",
      error.message
    );

    process.exitCode = 1;

  } finally {

    await mongoose.disconnect();

    console.log(
      "MongoDB connection closed."
    );
  }
}


createUsers();