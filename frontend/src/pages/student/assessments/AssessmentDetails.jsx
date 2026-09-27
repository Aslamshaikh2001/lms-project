

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { History } from "lucide-react";

// import {
//   getStudentAssessmentDetails,
//   startAssessment,
// } from "../../../services/studentAssessmentService.js";

// // ======================================================
// // ANIMATION VARIANTS
// // ======================================================

// const containerVariants = {
//   hidden: { opacity: 0, y: 10 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.4,
//       staggerChildren: 0.08,
//       delayChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 15 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.35, ease: "easeOut" },
//   },
// };

// // ======================================================
// // MAIN COMPONENT
// // ======================================================

// export default function AssessmentDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // ====================================================
//   // STATE
//   // ====================================================

//   const [assessment, setAssessment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [starting, setStarting] = useState(false);

//   // ====================================================
//   // FETCH ASSESSMENT DETAILS
//   // ====================================================

//   const fetchAssessment = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await getStudentAssessmentDetails(id);

//       if (!response?.success || !response?.data) {
//         throw new Error(
//           response?.message || "Assessment details not found."
//         );
//       }

//       setAssessment(response.data);
//     } catch (err) {
//       console.error("Student Assessment Details Error:", err);
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to load assessment details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchAssessment();
//     }
//   }, [id]);

//   // ====================================================
//   // HELPER FUNCTIONS
//   // ====================================================

//   const formatDate = (date) => {
//     if (!date) return "Not specified";

//     return new Date(date).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getAvailability = () => {
//     if (!assessment) return "UNKNOWN";

//     const now = new Date();

//     if (assessment.startDate && now < new Date(assessment.startDate)) {
//       return "UPCOMING";
//     }

//     if (assessment.endDate && now > new Date(assessment.endDate)) {
//       return "EXPIRED";
//     }

//     return "AVAILABLE";
//   };

//   const handleStartAssessment = async () => {
//     try {
//       setStarting(true);
//       const response = await startAssessment(id);

//       if (!response?.success || !response?.data?._id) {
//         throw new Error(
//           response?.message || "Failed to start assessment."
//         );
//       }

//       const attemptId = response.data._id;
//       navigate(`/student/attempts/${attemptId}`);
//     } catch (error) {
//       console.error("Start Assessment Error:", error);
//       alert(
//         error.response?.data?.message ||
//           error.message ||
//           "Unable to start assessment."
//       );
//     } finally {
//       setStarting(false);
//     }
//   };

//   const handleViewAttempts = () => {
//     navigate(`/student/assessments/${id}/attempts`);
//   };

//   // ======================================================
//   // CONDITIONAL STATES
//   // ======================================================

//   if (loading) {
//     return (
//       <div className="container-fluid px-0 py-5">
//         <div className="card border-0 shadow-sm rounded-4 text-center py-5">
//           <div className="card-body">
//             <div
//               className="spinner-border text-primary mb-3"
//               role="status"
//               style={{ width: "2.5rem", height: "2.5rem" }}
//             />
//             <p className="text-muted fw-medium mb-0">
//               Loading assessment details...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container-fluid px-0 py-4">
//         <div className="alert alert-danger rounded-4 shadow-sm border-0 p-4 mb-3">
//           <div className="d-flex justify-content-between align-items-center gap-3">
//             <div>
//               <h5 className="alert-heading fw-bold mb-1">
//                 Failed to load assessment
//               </h5>
//               <p className="mb-0 small opacity-75">{error}</p>
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               type="button"
//               className="btn btn-danger px-4 rounded-3 fw-medium"
//               onClick={fetchAssessment}
//             >
//               Retry
//             </motion.button>
//           </div>
//         </div>
//         <motion.button
//           whileHover={{ x: -3 }}
//           whileTap={{ scale: 0.97 }}
//           type="button"
//           className="btn btn-link text-decoration-none text-secondary p-0 fw-medium"
//           onClick={() => navigate("/student/assessments")}
//         >
//           <i className="bi bi-arrow-left me-2" />
//           Back to Assessments
//         </motion.button>
//       </div>
//     );
//   }

//   if (!assessment) {
//     return (
//       <div className="container-fluid px-0 py-5">
//         <div className="card border-0 shadow-sm rounded-4 text-center py-5">
//           <div className="card-body">
//             <div className="fs-1 mb-3">⚠️</div>
//             <h4 className="fw-bold mb-2">Assessment Not Found</h4>
//             <p className="text-muted mb-4">
//               This assessment is unavailable or may have been removed.
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="button"
//               className="btn btn-primary px-4 rounded-3 fw-medium"
//               onClick={() => navigate("/student/assessments")}
//             >
//               Back to Assessments
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const availability = getAvailability();
//   const isAvailable = availability === "AVAILABLE";

//   const getStartButtonStyles = () => {
//     switch (availability) {
//       case "AVAILABLE":
//         return "btn-success text-white shadow";
//       case "UPCOMING":
//         return "btn-warning text-dark";
//       case "EXPIRED":
//         return "btn-secondary opacity-75";
//       default:
//         return "btn-primary";
//     }
//   };

//   return (
//     <motion.div
//       className="container-fluid px-0 pb-5"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* ==================================================
//           HEADER & STATUS
//           ================================================== */}
//       <motion.div
//         variants={itemVariants}
//         className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"
//       >
//         <div>
//           <div className="d-flex align-items-center gap-2 mb-2">
//             <motion.button
//               whileHover={{ x: -3 }}
//               whileTap={{ scale: 0.9 }}
//               type="button"
//               className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
//               style={{ width: "32px", height: "32px" }}
//               onClick={() => navigate("/student/assessments")}
//             >
//               <i className="bi bi-arrow-left text-dark" />
//             </motion.button>
//             <span className="text-muted small fw-medium">
//               Assessments
//             </span>
//           </div>
//           <h1 className="h3 fw-bold text-dark mb-1">
//             {assessment.title}
//           </h1>
//           <p className="text-muted mb-0 small">Overview & Details</p>
//         </div>

//         {/* STATUS BADGE */}
//         <div>
//           {availability === "AVAILABLE" && (
//             <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1">
//               <i className="bi bi-record-fill fs-6" />
//               Available
//             </span>
//           )}
//           {availability === "UPCOMING" && (
//             <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1">
//               <i className="bi bi-clock-history fs-6" />
//               Upcoming
//             </span>
//           )}
//           {availability === "EXPIRED" && (
//             <span className="badge rounded-pill bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1">
//               <i className="bi bi-x-circle fs-6" />
//               Expired
//             </span>
//           )}
//         </div>
//       </motion.div>

//       {/* ==================================================
//           DESCRIPTION CARD
//           ================================================== */}
//       <motion.div
//         variants={itemVariants}
//         className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
//       >
//         <div className="card-body p-4">
//           <h2 className="h6 text-uppercase fw-bold text-muted tracking-wide mb-2">
//             About this Assessment
//           </h2>
//           <p
//             className="text-secondary mb-0"
//             style={{
//               whiteSpace: "pre-wrap",
//               lineHeight: "1.6",
//               fontSize: "0.95rem",
//             }}
//           >
//             {assessment.description || "No description provided."}
//           </p>
//         </div>
//       </motion.div>

//       {/* ==================================================
//           PRIMARY METRICS GRID
//           ================================================== */}
//       <motion.div variants={itemVariants} className="row g-3 mb-3">
//         <div className="col-12 col-sm-6 col-xl-3">
//           <InfoCard
//             icon="bi-clock"
//             label="Duration"
//             value={`${assessment.durationMinutes || 0} mins`}
//             badgeColor="bg-primary-subtle"
//             iconColor="text-primary"
//           />
//         </div>
//         <div className="col-12 col-sm-6 col-xl-3">
//           <InfoCard
//             icon="bi-question-circle"
//             label="Questions"
//             value={assessment.questionCount ?? 0}
//             badgeColor="bg-info-subtle"
//             iconColor="text-info-emphasis"
//           />
//         </div>
//         <div className="col-12 col-sm-6 col-xl-3">
//           <InfoCard
//             icon="bi-award"
//             label="Total Marks"
//             value={`${assessment.totalMarks || 0} pts`}
//             badgeColor="bg-warning-subtle"
//             iconColor="text-warning-emphasis"
//           />
//         </div>
//         <div className="col-12 col-sm-6 col-xl-3">
//           <InfoCard
//             icon="bi-check-circle"
//             label="Passing Marks"
//             value={`${assessment.passingMarks || 0} pts`}
//             badgeColor="bg-success-subtle"
//             iconColor="text-success"
//           />
//         </div>
//       </motion.div>

//       {/* ==================================================
//           SECONDARY METRICS GRID
//           ================================================== */}
//       <motion.div variants={itemVariants} className="row g-3 mb-4">
//         <div className="col-12 col-md-4">
//           <InfoCard
//             icon="bi-arrow-repeat"
//             label="Maximum Attempts"
//             value={assessment.maxAttempts ?? 1}
//             badgeColor="bg-light"
//             iconColor="text-secondary"
//           />
//         </div>
//         <div className="col-12 col-md-4">
//           <InfoCard
//             icon="bi-dash-circle"
//             label="Negative Marking"
//             value={
//               assessment.negativeMarking
//                 ? `Yes (${assessment.negativeMarks || 0} pts)`
//                 : "No"
//             }
//             badgeColor="bg-light"
//             iconColor="text-secondary"
//           />
//         </div>
//         <div className="col-12 col-md-4">
//           <InfoCard
//             icon="bi-file-earmark-check"
//             label="Assessment Status"
//             value="Published"
//             badgeColor="bg-light"
//             iconColor="text-secondary"
//           />
//         </div>
//       </motion.div>

//       {/* ==================================================
//           AVAILABILITY DATES
//           ================================================== */}
//       <motion.div
//         variants={itemVariants}
//         className="card border-0 shadow-sm rounded-4 mb-4"
//       >
//         <div className="card-body p-4">
//           <h2 className="h6 fw-bold text-dark mb-3">
//             Availability Windows
//           </h2>
//           <div className="row g-3">
//             <div className="col-12 col-md-6">
//               <div className="border border-start border-3 border-start-primary rounded-3 p-3 bg-light-subtle">
//                 <div className="d-flex align-items-center gap-2 mb-1">
//                   <i className="bi bi-calendar-event text-primary small" />
//                   <span className="small text-muted fw-medium">
//                     Start Date
//                   </span>
//                 </div>
//                 <div className="fw-bold text-dark ps-4">
//                   {formatDate(assessment.startDate)}
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-md-6">
//               <div className="border border-start border-3 border-start-danger rounded-3 p-3 bg-light-subtle">
//                 <div className="d-flex align-items-center gap-2 mb-1">
//                   <i className="bi bi-calendar-x text-danger small" />
//                   <span className="small text-muted fw-medium">
//                     End Date
//                   </span>
//                 </div>
//                 <div className="fw-bold text-dark ps-4">
//                   {formatDate(assessment.endDate)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* ==================================================
//           INSTRUCTIONS
//           ================================================== */}
//       <motion.div
//         variants={itemVariants}
//         className="card border-0 shadow-sm rounded-4 mb-4"
//       >
//         <div className="card-body p-4">
//           <h2 className="h6 fw-bold text-dark mb-3">Instructions</h2>
//           {assessment.instructions ? (
//             <div
//               className="text-secondary"
//               style={{
//                 whiteSpace: "pre-wrap",
//                 lineHeight: "1.6",
//                 fontSize: "0.95rem",
//               }}
//             >
//               {assessment.instructions}
//             </div>
//           ) : (
//             <p className="text-muted mb-0 small">
//               No specific instructions provided.
//             </p>
//           )}
//         </div>
//       </motion.div>

//       {/* ==================================================
//           ACTION FOOTER
//           ================================================== */}
//       <motion.div
//         variants={itemVariants}
//         className="card border-0 shadow-sm rounded-4"
//       >
//         <div className="card-body p-4">
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
//             <div>
//               <h2 className="h6 fw-bold text-dark mb-1">Ready to Begin?</h2>
//               <p className="text-muted small mb-0">
//                 Ensure you have a stable connection and enough uninterrupted time.
//               </p>
//             </div>

//             <div className="d-flex flex-wrap align-items-center gap-2">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="button"
//                 className="btn btn-outline-secondary px-3 py-2 rounded-3 fw-medium"
//                 onClick={() => navigate("/student/assessments")}
//                 disabled={starting}
//               >
//                 <i className="bi bi-arrow-left me-2" />
//                 Back
//               </motion.button>

//               {/* <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="button"
//                 className="btn btn-outline-primary px-3 py-2 rounded-3 fw-medium d-inline-flex align-items-center"
//                 onClick={handleViewAttempts}
//                 disabled={starting}
//               >
//                 <History size={16} className="me-2" />
//                 View My Attempts
//               </motion.button> */}

//               <motion.button
//                 whileHover={
//                   isAvailable && !starting ? { scale: 1.03 } : {}
//                 }
//                 whileTap={
//                   isAvailable && !starting ? { scale: 0.97 } : {}
//                 }
//                 type="button"
//                 className={`btn px-4 py-2 rounded-3 fw-medium d-inline-flex align-items-center ${getStartButtonStyles()}`}
//                 disabled={!isAvailable || starting}
//                 onClick={handleStartAssessment}
//               >
//                 {starting ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                       aria-hidden="true"
//                     />
//                     Starting...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-play-fill me-1 fs-5" />
//                     {availability === "UPCOMING"
//                       ? "Assessment Not Started"
//                       : availability === "EXPIRED"
//                       ? "Assessment Expired"
//                       : "Start Assessment"}
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ======================================================
// // INFO CARD REUSABLE COMPONENT
// // ======================================================

// function InfoCard({
//   icon,
//   label,
//   value,
//   badgeColor = "bg-light",
//   iconColor = "text-primary",
// }) {
//   return (
//     <motion.div
//       whileHover={{ y: -3 }}
//       transition={{ duration: 0.2 }}
//       className="card border-0 shadow-sm rounded-4 h-100"
//     >
//       <div className="card-body p-3 p-md-4">
//         <div className="d-flex align-items-center gap-3">
//           <div
//             className={`d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 ${badgeColor}`}
//             style={{
//               width: 48,
//               height: 48,
//             }}
//           >
//             <i className={`bi ${icon} ${iconColor} fs-5`} />
//           </div>

//           <div>
//             <span className="small text-muted d-block fw-medium mb-1">
//               {label}
//             </span>
//             <span className="fw-bold text-dark fs-6 d-block">
//               {value}
//             </span>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }







import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  getStudentAssessmentDetails,
  startAssessment,
} from "../../../services/studentAssessmentService.js";

// ======================================================
// ANIMATION VARIANTS
// ======================================================

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function AssessmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  // ====================================================
  // FETCH ASSESSMENT DETAILS
  // ====================================================

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStudentAssessmentDetails(id);

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message || "Assessment details not found."
        );
      }

      setAssessment(response.data);
    } catch (err) {
      console.error("Student Assessment Details Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load assessment details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  // ====================================================
  // HELPER FUNCTIONS
  // ====================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvailability = () => {
    if (!assessment) return "UNKNOWN";

    const now = new Date();

    if (assessment.startDate && now < new Date(assessment.startDate)) {
      return "UPCOMING";
    }

    if (assessment.endDate && now > new Date(assessment.endDate)) {
      return "EXPIRED";
    }

    return "AVAILABLE";
  };

  const handleStartAssessment = async () => {
    try {
      setStarting(true);
      const response = await startAssessment(id);

      if (!response?.success || !response?.data?._id) {
        throw new Error(
          response?.message || "Failed to start assessment."
        );
      }

      const attemptId = response.data._id;
      navigate(`/student/attempts/${attemptId}`);
    } catch (error) {
      console.error("Start Assessment Error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to start assessment."
      );
    } finally {
      setStarting(false);
    }
  };

  // Safe question count calculation across common backend schemas
  const getQuestionCount = () => {
    if (!assessment) return 0;
    if (typeof assessment.questionCount === "number") return assessment.questionCount;
    if (typeof assessment.totalQuestions === "number") return assessment.totalQuestions;
    if (Array.isArray(assessment.questions)) return assessment.questions.length;
    return 0;
  };

  // ======================================================
  // CONDITIONAL STATES
  // ======================================================

  if (loading) {
    return (
      <div className="container-fluid px-0 py-5">
        <div className="card border-0 shadow-sm rounded-4 text-center py-5">
          <div className="card-body">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "2.5rem", height: "2.5rem" }}
            />
            <p className="text-muted fw-medium mb-0">
              Loading assessment details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-0 py-4">
        <div className="alert alert-danger rounded-4 shadow-sm border-0 p-4 mb-3">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div>
              <h5 className="alert-heading fw-bold mb-1">
                Failed to load assessment
              </h5>
              <p className="mb-0 small opacity-75">{error}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className="btn btn-danger px-4 rounded-3 fw-medium"
              onClick={fetchAssessment}
            >
              Retry
            </motion.button>
          </div>
        </div>
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="btn btn-link text-decoration-none text-secondary p-0 fw-medium"
          onClick={() => navigate("/student/assessments")}
        >
          <i className="bi bi-arrow-left me-2" />
          Back to Assessments
        </motion.button>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container-fluid px-0 py-5">
        <div className="card border-0 shadow-sm rounded-4 text-center py-5">
          <div className="card-body">
            <div className="fs-1 mb-3">⚠️</div>
            <h4 className="fw-bold mb-2">Assessment Not Found</h4>
            <p className="text-muted mb-4">
              This assessment is unavailable or may have been removed.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="btn btn-primary px-4 rounded-3 fw-medium"
              onClick={() => navigate("/student/assessments")}
            >
              Back to Assessments
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const availability = getAvailability();
  const isAvailable = availability === "AVAILABLE";

  const getStartButtonStyles = () => {
    switch (availability) {
      case "AVAILABLE":
        return "btn-success text-white shadow";
      case "UPCOMING":
        return "btn-warning text-dark";
      case "EXPIRED":
        return "btn-secondary opacity-75";
      default:
        return "btn-primary";
    }
  };

  return (
    <motion.div
      className="container-fluid px-0 pb-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ==================================================
          HEADER & STATUS
          ================================================== */}
      <motion.div
        variants={itemVariants}
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
              style={{ width: "32px", height: "32px" }}
              onClick={() => navigate("/student/assessments")}
            >
              <i className="bi bi-arrow-left text-dark" />
            </motion.button>
            <span className="text-muted small fw-medium">
              Assessments
            </span>
          </div>
          <h1 className="h3 fw-bold text-dark mb-1">
            {assessment.title}
          </h1>
          <p className="text-muted mb-0 small">Overview & Details</p>
        </div>

        {/* STATUS BADGE */}
        <div>
          {availability === "AVAILABLE" && (
            <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1">
              <i className="bi bi-record-fill fs-6" />
              Available
            </span>
          )}
          {availability === "UPCOMING" && (
            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1">
              <i className="bi bi-clock-history fs-6" />
              Upcoming
            </span>
          )}
          {availability === "EXPIRED" && (
            <span className="badge rounded-pill bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1">
              <i className="bi bi-x-circle fs-6" />
              Expired
            </span>
          )}
        </div>
      </motion.div>

      {/* ==================================================
          DESCRIPTION CARD
          ================================================== */}
      <motion.div
        variants={itemVariants}
        className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
      >
        <div className="card-body p-4">
          <h2 className="h6 text-uppercase fw-bold text-muted tracking-wide mb-2">
            About this Assessment
          </h2>
          <p
            className="text-secondary mb-0"
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              fontSize: "0.95rem",
            }}
          >
            {assessment.description || "No description provided."}
          </p>
        </div>
      </motion.div>

      {/* ==================================================
          PRIMARY METRICS GRID
          ================================================== */}
      <motion.div variants={itemVariants} className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <InfoCard
            icon="bi-clock"
            label="Duration"
            value={`${assessment.durationMinutes || 0} mins`}
            badgeColor="bg-primary-subtle"
            iconColor="text-primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <InfoCard
            icon="bi-question-circle"
            label="Questions"
            value={getQuestionCount()}
            badgeColor="bg-info-subtle"
            iconColor="text-info-emphasis"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <InfoCard
            icon="bi-award"
            label="Total Marks"
            value={`${assessment.totalMarks || 0} pts`}
            badgeColor="bg-warning-subtle"
            iconColor="text-warning-emphasis"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <InfoCard
            icon="bi-check-circle"
            label="Passing Marks"
            value={`${assessment.passingMarks || 0} pts`}
            badgeColor="bg-success-subtle"
            iconColor="text-success"
          />
        </div>
      </motion.div>

      {/* ==================================================
          SECONDARY METRICS GRID
          ================================================== */}
      <motion.div variants={itemVariants} className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <InfoCard
            icon="bi-arrow-repeat"
            label="Maximum Attempts"
            value={assessment.maxAttempts ?? 1}
            badgeColor="bg-light"
            iconColor="text-secondary"
          />
        </div>
        <div className="col-12 col-md-4">
          <InfoCard
            icon="bi-dash-circle"
            label="Negative Marking"
            value={
              assessment.negativeMarking
                ? `Yes (${assessment.negativeMarks || 0} pts)`
                : "No"
            }
            badgeColor="bg-light"
            iconColor="text-secondary"
          />
        </div>
        <div className="col-12 col-md-4">
          <InfoCard
            icon="bi-file-earmark-check"
            label="Assessment Status"
            value="Published"
            badgeColor="bg-light"
            iconColor="text-secondary"
          />
        </div>
      </motion.div>

      {/* ==================================================
          AVAILABILITY DATES
          ================================================== */}
      <motion.div
        variants={itemVariants}
        className="card border-0 shadow-sm rounded-4 mb-4"
      >
        <div className="card-body p-4">
          <h2 className="h6 fw-bold text-dark mb-3">
            Availability Windows
          </h2>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="border border-start border-3 border-start-primary rounded-3 p-3 bg-light-subtle">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-calendar-event text-primary small" />
                  <span className="small text-muted fw-medium">
                    Start Date
                  </span>
                </div>
                <div className="fw-bold text-dark ps-4">
                  {formatDate(assessment.startDate)}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="border border-start border-3 border-start-danger rounded-3 p-3 bg-light-subtle">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-calendar-x text-danger small" />
                  <span className="small text-muted fw-medium">
                    End Date
                  </span>
                </div>
                <div className="fw-bold text-dark ps-4">
                  {formatDate(assessment.endDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ==================================================
          INSTRUCTIONS
          ================================================== */}
      <motion.div
        variants={itemVariants}
        className="card border-0 shadow-sm rounded-4 mb-4"
      >
        <div className="card-body p-4">
          <h2 className="h6 fw-bold text-dark mb-3">Instructions</h2>
          {assessment.instructions ? (
            <div
              className="text-secondary"
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                fontSize: "0.95rem",
              }}
            >
              {assessment.instructions}
            </div>
          ) : (
            <p className="text-muted mb-0 small">
              No specific instructions provided.
            </p>
          )}
        </div>
      </motion.div>

      {/* ==================================================
          ACTION FOOTER
          ================================================== */}
      <motion.div
        variants={itemVariants}
        className="card border-0 shadow-sm rounded-4"
      >
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h2 className="h6 fw-bold text-dark mb-1">Ready to Begin?</h2>
              <p className="text-muted small mb-0">
                Ensure you have a stable connection and enough uninterrupted time.
              </p>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="btn btn-outline-secondary px-3 py-2 rounded-3 fw-medium"
                onClick={() => navigate("/student/assessments")}
                disabled={starting}
              >
                <i className="bi bi-arrow-left me-2" />
                Back
              </motion.button>

              <motion.button
                whileHover={
                  isAvailable && !starting ? { scale: 1.03 } : {}
                }
                whileTap={
                  isAvailable && !starting ? { scale: 0.97 } : {}
                }
                type="button"
                className={`btn px-4 py-2 rounded-3 fw-medium d-inline-flex align-items-center ${getStartButtonStyles()}`}
                disabled={!isAvailable || starting}
                onClick={handleStartAssessment}
              >
                {starting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Starting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-play-fill me-1 fs-5" />
                    {availability === "UPCOMING"
                      ? "Assessment Not Started"
                      : availability === "EXPIRED"
                      ? "Assessment Expired"
                      : "Start Assessment"}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================================================
// INFO CARD REUSABLE COMPONENT
// ======================================================

function InfoCard({
  icon,
  label,
  value,
  badgeColor = "bg-light",
  iconColor = "text-primary",
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="card border-0 shadow-sm rounded-4 h-100"
    >
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className={`d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 ${badgeColor}`}
            style={{
              width: 48,
              height: 48,
            }}
          >
            <i className={`bi ${icon} ${iconColor} fs-5`} />
          </div>

          <div>
            <span className="small text-muted d-block fw-medium mb-1">
              {label}
            </span>
            <span className="fw-bold text-dark fs-6 d-block">
              {value}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}