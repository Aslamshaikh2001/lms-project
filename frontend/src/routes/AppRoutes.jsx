
// import React from "react";

// import {
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // ======================================================
// // LAYOUTS
// // ======================================================

// import AdminLayout from "../components/layout/AdminLayout.jsx";
// import InstructorLayout from "../components/layout/InstructorLayout.jsx";
// import StudentLayout from "../components/layout/StudentLayout.jsx";

// // ======================================================
// // ADMIN PAGES
// // ======================================================

// import AdminDashboard from "../pages/admin/dashboard/AdminDashboard.jsx";

// // ======================================================
// // ADMIN STUDENT MANAGEMENT
// // ======================================================

// import StudentManagement
//   from "../pages/admin/students/StudentManagement.jsx";

// import StudentDetails
//   from "../pages/admin/students/StudentDetails.jsx";

// // ======================================================
// // ASSESSMENT PAGES
// // ======================================================

// import Assessments
//   from "../pages/admin/assessments/Assessments.jsx";

// import CreateAssessment
//   from "../pages/admin/assessments/CreateAssessment.jsx";

// import AssessmentDetails
//   from "../pages/admin/assessments/AssessmentDetails.jsx";

// import EditAssessment
//   from "../pages/admin/assessments/EditAssessment.jsx";

// import AssessmentAssignments
//   from "../pages/admin/assessments/AssessmentAssignments.jsx";

// // ======================================================
// // STUDENT ASSESSMENT PAGES
// // ======================================================

// import StudentAssessments
//   from "../pages/student/assessments/Assessments.jsx";

// import StudentAssessmentDetails
//   from "../pages/student/assessments/AssessmentDetails.jsx";

// // ======================================================
// // STUDENT ATTEMPT PAGES
// // ======================================================

// import StudentAttempt
//   from "../pages/student/attempts/StudentAttempt.jsx";
  
//   import StudentResults
//   from "../pages/admin/StudentResults.jsx";
//   import AssessmentAttemptResult
//   from "../pages/admin/AssessmentAttemptResult.jsx";

// // ======================================================
// // QUESTION PAGES
// // ======================================================

// import Questions
//   from "../pages/admin/questions/Questions.jsx";

// import CreateQuestion
//   from "../pages/admin/questions/CreateQuestion.jsx";

// import QuestionDetails
//   from "../pages/admin/questions/QuestionDetails.jsx";

// import EditQuestion
//   from "../pages/admin/questions/EditQuestion.jsx";

// // ======================================================
// // AUTH PAGES
// // ======================================================

// import Login
//   from "../pages/auth/Login.jsx";

// import Register
//   from "../pages/auth/Register.jsx";

// import VerifyEmailOtp
//   from "../pages/auth/VerifyEmailOtp.jsx";

// import ForgotPassword
//   from "../pages/auth/ForgotPassword.jsx";

// import VerifyResetOtp
//   from "../pages/auth/VerifyResetOtp.jsx";

// import ResetPassword
//   from "../pages/auth/ResetPassword.jsx";

// import Unauthorized
//   from "../pages/auth/Unauthorized.jsx";

// // ======================================================
// // INSTRUCTOR
// // ======================================================

// import InstructorDashboard
//   from "../pages/instructor/InstructorDashboard.jsx";

// // ======================================================
// // STUDENT
// // ======================================================

// import StudentDashboard
//   from "../pages/student/StudentDashboard.jsx";

// // ======================================================
// // ROUTE PROTECTION
// // ======================================================

// import ProtectedRoute from "./ProtectedRoute.jsx";
// import RoleRoute from "./RoleRoute.jsx";

// // ======================================================
// // ADMIN PLACEHOLDER
// // ======================================================

// function AdminPlaceholder({ title }) {
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">

//       <div className="mb-6">

//         <h1 className="text-2xl font-semibold text-gray-800">
//           {title}
//         </h1>

//         <p className="mt-1 text-sm text-gray-500">
//           This module will be developed next.
//         </p>

//       </div>

//       <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white shadow-sm">

//         <div className="text-center">

//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

//             <span className="text-2xl text-blue-600">
//               🛠️
//             </span>

//           </div>

//           <h2 className="text-xl font-semibold text-gray-800">
//             {title}
//           </h2>

//           <p className="mt-2 text-sm text-gray-500">
//             Functionality coming soon.
//           </p>

//         </div>

//       </div>

//     </div>
//   );
// }

// // ======================================================
// // ADMIN ROLES
// // ======================================================

// const adminRoles = [
//   "ADMIN",
//   "SUPER_ADMIN",
// ];

// // ======================================================
// // APP ROUTES
// // ======================================================

// export default function AppRoutes() {

//   return (

//     <Routes>

//       {/* ==================================================
//           AUTH ROUTES
//           ================================================== */}

//       <Route
//         path="/login"
//         element={<Login />}
//       />

//       <Route
//         path="/register"
//         element={<Register />}
//       />

//       <Route
//         path="/verify-email"
//         element={<VerifyEmailOtp />}
//       />

//       <Route
//         path="/forgot-password"
//         element={<ForgotPassword />}
//       />

//       <Route
//         path="/verify-reset-otp"
//         element={<VerifyResetOtp />}
//       />

//       <Route
//         path="/reset-password"
//         element={<ResetPassword />}
//       />

//       <Route
//         path="/unauthorized"
//         element={<Unauthorized />}
//       />

//       {/* ==================================================
//           ROOT
//           ================================================== */}

//       <Route
//         path="/"
//         element={
//           <Navigate
//             to="/login"
//             replace
//           />
//         }
//       />

//       {/* ==================================================
//           ADMIN ROOT
//           ================================================== */}

//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <Navigate
//                   to="/admin/dashboard"
//                   replace
//                 />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ADMIN DASHBOARD
//           ================================================== */}

//       <Route
//         path="/admin/dashboard"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AdminDashboard />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ADMIN USERS
//           ================================================== */}

//       <Route
//         path="/admin/users"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AdminPlaceholder title="Users" />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ADMIN COURSES
//           ================================================== */}

//       <Route
//         path="/admin/courses"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AdminPlaceholder title="Courses" />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ADMIN CATEGORIES
//           ================================================== */}

//       <Route
//         path="/admin/categories"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AdminPlaceholder title="Categories" />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ADMIN INSTRUCTORS
//           ================================================== */}

//       <Route
//         path="/admin/instructors"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AdminPlaceholder title="Instructors" />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ADMIN STUDENTS
//           ================================================== */}

//       {/* --------------------------------------------------
//           STUDENT MANAGEMENT

//           URL:
//           /admin/students

//           Access:
//           ADMIN
//           SUPER_ADMIN
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/students"
//         element={
//           <ProtectedRoute>

//             <RoleRoute
//               allowedRoles={[
//                 "ADMIN",
//                 "SUPER_ADMIN",
//               ]}
//             >

//               <AdminLayout>

//                 <StudentManagement />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           STUDENT DETAILS

//           URL:
//           /admin/students/:studentId

//           Access:
//           ADMIN
//           SUPER_ADMIN
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/students/:studentId"
//         element={
//           <ProtectedRoute>

//             <RoleRoute
//               allowedRoles={[
//                 "ADMIN",
//                 "SUPER_ADMIN",
//               ]}
//             >

//               <AdminLayout>

//                 <StudentDetails />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />
//       {/* <Route
//   path="/admin/assessments/:assessmentId/results"
//   element={
//     <RoleRoute
//       allowedRoles={adminRoles}
//     >
//       <AssessmentResults />
//     </RoleRoute>
//   }
// /> */}

// <Route
//   path="/admin/student-results"
//   element={
//     <ProtectedRoute>

//       <RoleRoute
//         allowedRoles={adminRoles}
//       >

//         <AdminLayout>

//           <StudentResults />

//         </AdminLayout>

//       </RoleRoute>

//     </ProtectedRoute>
//   }
// />
// {/* ==================================================
//     ADMIN STUDENT RESULT DETAILS
//     ================================================== */}

// <Route
//   path="/admin/assessments/attempts/:attemptId/result"
//   element={
//     <ProtectedRoute>

//       <RoleRoute
//         allowedRoles={adminRoles}
//       >

//         <AdminLayout>

//           <AssessmentAttemptResult />

//         </AdminLayout>

//       </RoleRoute>

//     </ProtectedRoute>
//   }
// />


// {/* ==================================================
//     ADMIN STUDENT RESULT DETAILS
//     ================================================== */}

// <Route
//   path="/admin/assessments/attempts/:attemptId/result"
//   element={
//     <ProtectedRoute>

//       <RoleRoute
//         allowedRoles={adminRoles}
//       >

//         <AdminLayout>

//           <AssessmentAttemptResult />

//         </AdminLayout>

//       </RoleRoute>

//     </ProtectedRoute>
//   }
// />
//       {/* ==================================================
//           ADMIN REPORTS
//           ================================================== */}

//       <Route
//         path="/admin/reports"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AdminPlaceholder title="Reports" />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ADMIN SETTINGS
//           ================================================== */}

//       <Route
//         path="/admin/settings"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AdminPlaceholder title="Settings" />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           ASSESSMENT MODULE
//           ================================================== */}

//       {/* --------------------------------------------------
//           ASSESSMENT LIST

//           URL:
//           /admin/assessments
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/assessments"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <Assessments />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           CREATE ASSESSMENT

//           URL:
//           /admin/assessments/create
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/assessments/create"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <CreateAssessment />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           EDIT ASSESSMENT

//           URL:
//           /admin/assessments/:id/edit
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/assessments/:id/edit"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <EditAssessment />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           ASSIGN STUDENTS

//           URL:
//           /admin/assessments/:assessmentId/assign-students
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/assessments/:assessmentId/assign-students"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AssessmentAssignments />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           ASSESSMENT DETAILS

//           URL:
//           /admin/assessments/:id
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/assessments/:id"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <AssessmentDetails />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           STUDENT ASSESSMENT MODULE
//           ================================================== */}

//       {/* --------------------------------------------------
//           STUDENT ASSESSMENT LIST

//           URL:
//           /student/assessments
//           -------------------------------------------------- */}

//       <Route
//         path="/student/assessments"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={["STUDENT"]}>

//               <StudentLayout>

//                 <StudentAssessments />

//               </StudentLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           STUDENT ASSESSMENT DETAILS

//           URL:
//           /student/assessments/:id
//           -------------------------------------------------- */}

//       <Route
//         path="/student/assessments/:id"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={["STUDENT"]}>

//               <StudentLayout>

//                 <StudentAssessmentDetails />

//               </StudentLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           STUDENT ATTEMPT

//           URL:
//           /student/attempts/:attemptId

//           PURPOSE:
//           Student can take the assessment here.

//           IMPORTANT:
//           This route is intentionally kept.

//           After submission, StudentAttempt should NOT
//           navigate to a result/review page.
//           -------------------------------------------------- */}

//       <Route
//         path="/student/attempts/:attemptId"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={["STUDENT"]}>

//               <StudentLayout>

//                 <StudentAttempt />

//               </StudentLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           QUESTION MODULE
//           ================================================== */}

//       {/* --------------------------------------------------
//           QUESTION LIST

//           URL:
//           /admin/questions
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/questions"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <Questions />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           CREATE QUESTION

//           URL:
//           /admin/questions/create
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/questions/create"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <CreateQuestion />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           EDIT QUESTION

//           URL:
//           /admin/questions/:id/edit
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/questions/:id/edit"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <EditQuestion />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           QUESTION DETAILS

//           IMPORTANT:
//           Keep /:id/edit BEFORE /:id

//           URL:
//           /admin/questions/:id
//           -------------------------------------------------- */}

//       <Route
//         path="/admin/questions/:id"
//         element={
//           <ProtectedRoute>

//             <RoleRoute allowedRoles={adminRoles}>

//               <AdminLayout>

//                 <QuestionDetails />

//               </AdminLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           INSTRUCTOR
//           ================================================== */}

//       {/* --------------------------------------------------
//           INSTRUCTOR ROOT
//           -------------------------------------------------- */}

//       <Route
//         path="/instructor"
//         element={
//           <ProtectedRoute>

//             <RoleRoute
//               allowedRoles={[
//                 "INSTRUCTOR",
//               ]}
//             >

//               <InstructorLayout>

//                 <Navigate
//                   to="/instructor/dashboard"
//                   replace
//                 />

//               </InstructorLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           INSTRUCTOR DASHBOARD
//           -------------------------------------------------- */}

//       <Route
//         path="/instructor/dashboard"
//         element={
//           <ProtectedRoute>

//             <RoleRoute
//               allowedRoles={[
//                 "INSTRUCTOR",
//               ]}
//             >

//               <InstructorLayout>

//                 <InstructorDashboard />

//               </InstructorLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           STUDENT
//           ================================================== */}

//       {/* --------------------------------------------------
//           STUDENT ROOT
//           -------------------------------------------------- */}

//       <Route
//         path="/student"
//         element={
//           <ProtectedRoute>

//             <RoleRoute
//               allowedRoles={[
//                 "STUDENT",
//               ]}
//             >

//               <StudentLayout>

//                 <Navigate
//                   to="/student/dashboard"
//                   replace
//                 />

//               </StudentLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* --------------------------------------------------
//           STUDENT DASHBOARD
//           -------------------------------------------------- */}

//       <Route
//         path="/student/dashboard"
//         element={
//           <ProtectedRoute>

//             <RoleRoute
//               allowedRoles={[
//                 "STUDENT",
//               ]}
//             >

//               <StudentLayout>

//                 <StudentDashboard />

//               </StudentLayout>

//             </RoleRoute>

//           </ProtectedRoute>
//         }
//       />

//       {/* ==================================================
//           404
//           ================================================== */}

//       <Route
//         path="*"
//         element={
//           <Navigate
//             to="/login"
//             replace
//           />
//         }
//       />

//     </Routes>
//   );
// }






import React from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ======================================================
// LAYOUTS
// ======================================================

import AdminLayout
  from "../components/layout/AdminLayout.jsx";

import InstructorLayout
  from "../components/layout/InstructorLayout.jsx";

import StudentLayout
  from "../components/layout/StudentLayout.jsx";


// ======================================================
// ADMIN PAGES
// ======================================================

import AdminDashboard
  from "../pages/admin/dashboard/AdminDashboard.jsx";


// ======================================================
// ADMIN STUDENT MANAGEMENT
// ======================================================

import StudentManagement
  from "../pages/admin/students/StudentManagement.jsx";

import StudentDetails
  from "../pages/admin/students/StudentDetails.jsx";


// ======================================================
// ADMIN STUDENT RESULTS
// ======================================================

import StudentResults
  from "../pages/admin/StudentResults.jsx";

import AssessmentAttemptResult
  from "../pages/admin/AssessmentAttemptResult.jsx";


// ======================================================
// ASSESSMENT PAGES
// ======================================================

import Assessments
  from "../pages/admin/assessments/Assessments.jsx";

import CreateAssessment
  from "../pages/admin/assessments/CreateAssessment.jsx";

import AssessmentDetails
  from "../pages/admin/assessments/AssessmentDetails.jsx";

import EditAssessment
  from "../pages/admin/assessments/EditAssessment.jsx";

import AssessmentAssignments
  from "../pages/admin/assessments/AssessmentAssignments.jsx";


// ======================================================
// STUDENT ASSESSMENT PAGES
// ======================================================

import StudentAssessments
  from "../pages/student/assessments/Assessments.jsx";

import StudentAssessmentDetails
  from "../pages/student/assessments/AssessmentDetails.jsx";


// ======================================================
// STUDENT ATTEMPT PAGES
// ======================================================

import StudentAttempt
  from "../pages/student/attempts/StudentAttempt.jsx";


// ======================================================
// QUESTION PAGES
// ======================================================

import Questions
  from "../pages/admin/questions/Questions.jsx";

import CreateQuestion
  from "../pages/admin/questions/CreateQuestion.jsx";

import QuestionDetails
  from "../pages/admin/questions/QuestionDetails.jsx";

import EditQuestion
  from "../pages/admin/questions/EditQuestion.jsx";


// ======================================================
// AUTH PAGES
// ======================================================

import Login
  from "../pages/auth/Login.jsx";

import Register
  from "../pages/auth/Register.jsx";

import VerifyEmailOtp
  from "../pages/auth/VerifyEmailOtp.jsx";

import ForgotPassword
  from "../pages/auth/ForgotPassword.jsx";

import VerifyResetOtp
  from "../pages/auth/VerifyResetOtp.jsx";

import ResetPassword
  from "../pages/auth/ResetPassword.jsx";

import Unauthorized
  from "../pages/auth/Unauthorized.jsx";


// ======================================================
// INSTRUCTOR
// ======================================================

import InstructorDashboard
  from "../pages/instructor/InstructorDashboard.jsx";


// ======================================================
// STUDENT
// ======================================================

import StudentDashboard
  from "../pages/student/StudentDashboard.jsx";


// ======================================================
// ROUTE PROTECTION
// ======================================================

import ProtectedRoute
  from "./ProtectedRoute.jsx";

import RoleRoute
  from "./RoleRoute.jsx";


// ======================================================
// ADMIN PLACEHOLDER
// ======================================================

function AdminPlaceholder({
  title,
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mb-6">

        <h1 className="text-2xl font-semibold text-gray-800">
          {title}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          This module will be developed next.
        </p>

      </div>


      <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white shadow-sm">

        <div className="text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

            <span className="text-2xl text-blue-600">
              🛠️
            </span>

          </div>


          <h2 className="text-xl font-semibold text-gray-800">
            {title}
          </h2>


          <p className="mt-2 text-sm text-gray-500">
            Functionality coming soon.
          </p>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// ADMIN ROLES
// ======================================================

const adminRoles = [
  "ADMIN",
  "SUPER_ADMIN",
];


// ======================================================
// APP ROUTES
// ======================================================

export default function AppRoutes() {

  return (

    <Routes>


      {/* ==================================================
          AUTH ROUTES
          ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmailOtp />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-reset-otp"
        element={<VerifyResetOtp />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* ==================================================
          ROOT
          ================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* ==================================================
          ADMIN ROOT
          ================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <Navigate
                  to="/admin/dashboard"
                  replace
                />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN DASHBOARD
          ================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AdminDashboard />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN USERS
          ================================================== */}

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AdminPlaceholder
                  title="Users"
                />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN COURSES
          ================================================== */}

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AdminPlaceholder
                  title="Courses"
                />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN CATEGORIES
          ================================================== */}

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AdminPlaceholder
                  title="Categories"
                />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN INSTRUCTORS
          ================================================== */}

      <Route
        path="/admin/instructors"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AdminPlaceholder
                  title="Instructors"
                />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN STUDENTS
          ================================================== */}

      {/* --------------------------------------------------
          STUDENT MANAGEMENT

          URL:
          /admin/students

          Access:
          ADMIN
          SUPER_ADMIN
          -------------------------------------------------- */}

      <Route
        path="/admin/students"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "ADMIN",
                "SUPER_ADMIN",
              ]}
            >

              <AdminLayout>

                <StudentManagement />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          STUDENT DETAILS

          URL:
          /admin/students/:studentId

          Access:
          ADMIN
          SUPER_ADMIN
          -------------------------------------------------- */}

      <Route
        path="/admin/students/:studentId"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "ADMIN",
                "SUPER_ADMIN",
              ]}
            >

              <AdminLayout>

                <StudentDetails />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN STUDENT RESULTS
          ================================================== */}


      {/* --------------------------------------------------
          STUDENT RESULTS LIST

          URL:
          /admin/student-results

          PURPOSE:
          Shows all submitted student assessment results.

          Access:
          ADMIN
          SUPER_ADMIN
          -------------------------------------------------- */}

      <Route
        path="/admin/student-results"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <StudentResults />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          STUDENT RESULT DETAILS

          URL:
          /admin/assessments/attempts/:attemptId/result

          PURPOSE:
          Shows complete result of one student attempt.

          Includes:
          - Student information
          - Assessment information
          - Score
          - Percentage
          - Pass / Fail
          - Question review
          - Student answers
          - Correct answers
          - Marks
          - Security information

          Access:
          ADMIN
          SUPER_ADMIN
          -------------------------------------------------- */}

      <Route
        path="/admin/assessments/attempts/:attemptId/result"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AssessmentAttemptResult />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN REPORTS
          ================================================== */}

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AdminPlaceholder
                  title="Reports"
                />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ADMIN SETTINGS
          ================================================== */}

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AdminPlaceholder
                  title="Settings"
                />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ASSESSMENT MODULE
          ================================================== */}


      {/* --------------------------------------------------
          ASSESSMENT LIST

          URL:
          /admin/assessments
          -------------------------------------------------- */}

      <Route
        path="/admin/assessments"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <Assessments />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          CREATE ASSESSMENT

          URL:
          /admin/assessments/create
          -------------------------------------------------- */}

      <Route
        path="/admin/assessments/create"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <CreateAssessment />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          EDIT ASSESSMENT

          URL:
          /admin/assessments/:id/edit
          -------------------------------------------------- */}

      <Route
        path="/admin/assessments/:id/edit"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <EditAssessment />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          ASSIGN STUDENTS

          URL:
          /admin/assessments/:assessmentId/assign-students
          -------------------------------------------------- */}

      <Route
        path="/admin/assessments/:assessmentId/assign-students"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AssessmentAssignments />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          ASSESSMENT DETAILS

          URL:
          /admin/assessments/:id
          -------------------------------------------------- */}

      <Route
        path="/admin/assessments/:id"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <AssessmentDetails />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          STUDENT ASSESSMENT MODULE
          ================================================== */}


      {/* --------------------------------------------------
          STUDENT ASSESSMENT LIST

          URL:
          /student/assessments
          -------------------------------------------------- */}

      <Route
        path="/student/assessments"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "STUDENT",
              ]}
            >

              <StudentLayout>

                <StudentAssessments />

              </StudentLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          STUDENT ASSESSMENT DETAILS

          URL:
          /student/assessments/:id
          -------------------------------------------------- */}

      <Route
        path="/student/assessments/:id"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "STUDENT",
              ]}
            >

              <StudentLayout>

                <StudentAssessmentDetails />

              </StudentLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          STUDENT ATTEMPT

          URL:
          /student/attempts/:attemptId

          PURPOSE:
          Student can take the assessment here.

          IMPORTANT:
          After submission, StudentAttempt should NOT
          navigate to a result/review page.
          -------------------------------------------------- */}

      <Route
        path="/student/attempts/:attemptId"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "STUDENT",
              ]}
            >

              <StudentLayout>

                <StudentAttempt />

              </StudentLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          QUESTION MODULE
          ================================================== */}


      {/* --------------------------------------------------
          QUESTION LIST

          URL:
          /admin/questions
          -------------------------------------------------- */}

      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <Questions />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          CREATE QUESTION

          URL:
          /admin/questions/create
          -------------------------------------------------- */}

      <Route
        path="/admin/questions/create"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <CreateQuestion />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          EDIT QUESTION

          URL:
          /admin/questions/:id/edit
          -------------------------------------------------- */}

      <Route
        path="/admin/questions/:id/edit"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <EditQuestion />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          QUESTION DETAILS

          IMPORTANT:
          Keep /:id/edit BEFORE /:id

          URL:
          /admin/questions/:id
          -------------------------------------------------- */}

      <Route
        path="/admin/questions/:id"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={adminRoles}
            >

              <AdminLayout>

                <QuestionDetails />

              </AdminLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          INSTRUCTOR
          ================================================== */}


      {/* --------------------------------------------------
          INSTRUCTOR ROOT
          -------------------------------------------------- */}

      <Route
        path="/instructor"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "INSTRUCTOR",
              ]}
            >

              <InstructorLayout>

                <Navigate
                  to="/instructor/dashboard"
                  replace
                />

              </InstructorLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          INSTRUCTOR DASHBOARD
          -------------------------------------------------- */}

      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "INSTRUCTOR",
              ]}
            >

              <InstructorLayout>

                <InstructorDashboard />

              </InstructorLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          STUDENT
          ================================================== */}


      {/* --------------------------------------------------
          STUDENT ROOT
          -------------------------------------------------- */}

      <Route
        path="/student"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "STUDENT",
              ]}
            >

              <StudentLayout>

                <Navigate
                  to="/student/dashboard"
                  replace
                />

              </StudentLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* --------------------------------------------------
          STUDENT DASHBOARD
          -------------------------------------------------- */}

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>

            <RoleRoute
              allowedRoles={[
                "STUDENT",
              ]}
            >

              <StudentLayout>

                <StudentDashboard />

              </StudentLayout>

            </RoleRoute>

          </ProtectedRoute>
        }
      />


      {/* ==================================================
          404
          ================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}