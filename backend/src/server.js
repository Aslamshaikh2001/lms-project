// import app from "./app.js";
// import { connectDB } from "./config/db.js";
// import env from "./config/env.js";

// await connectDB();

// app.listen(env.port, () => {
//   console.log(
//     `LMS backend running on http://localhost:${env.port}`
//   );
// });



import app from "./app.js";
import env from "./config/env.js";

const port = env.port;

app.listen(port, () => {
  console.log(
    `LMS backend running on http://localhost:${port}`
  );
});