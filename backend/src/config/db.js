// import mongoose from "mongoose";
// import env from "./env.js";

// export async function connectDB() {
//   try {
//     await mongoose.connect(env.mongoUri);

//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error(
//       "MongoDB connection failed:",
//       error.message
//     );

//     process.exit(1);
//   }
// }



import mongoose from "mongoose";
import env from "./env.js";

// ======================================================
// MONGOOSE CONNECTION CACHE
// ======================================================

let cachedConnection = null;
let cachedPromise = null;


// ======================================================
// CONNECT DATABASE
// ======================================================

export async function connectDB() {
  // ----------------------------------------------------
  // Already connected
  // ----------------------------------------------------

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }


  // ----------------------------------------------------
  // Connection already in progress
  // ----------------------------------------------------

  if (cachedPromise) {
    return cachedPromise;
  }


  // ----------------------------------------------------
  // Validate Mongo URI
  // ----------------------------------------------------

  if (!env.mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }


  // ----------------------------------------------------
  // Create connection
  // ----------------------------------------------------

  cachedPromise = mongoose
    .connect(env.mongoUri)
    .then((mongooseInstance) => {
      cachedConnection = mongooseInstance.connection;

      console.log("MongoDB connected successfully");

      return cachedConnection;
    })
    .catch((error) => {
      console.error(
        "MongoDB connection failed:",
        error.message
      );

      cachedPromise = null;
      cachedConnection = null;

      throw error;
    });


  return cachedPromise;
}