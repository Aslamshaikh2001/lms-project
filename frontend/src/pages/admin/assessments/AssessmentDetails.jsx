// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// import {
//   getAssessmentById,
//   deleteAssessment,
//   publishAssessment,
//   unpublishAssessment,
// } from "../../../services/assessmentService";

// export default function AssessmentDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [assessment, setAssessment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   // Modal State
//   const [actionModal, setActionModal] = useState({
//     show: false,
//     type: null, // "publish" | "unpublish" | "delete"
//     actionLoading: false,
//   });

//   useEffect(() => {
//     if (!id) {
//       setErrorMessage("Assessment ID is missing.");
//       setLoading(false);
//       return;
//     }

//     fetchAssessment();
//   }, [id]);

//   const fetchAssessment = async () => {
//     try {
//       setLoading(true);
//       setErrorMessage("");

//       const response = await getAssessmentById(id);
//       const assessmentData = response?.data || response;

//       if (!assessmentData || typeof assessmentData !== "object") {
//         throw new Error("Assessment data was not returned by the server.");
//       }

//       setAssessment(assessmentData);
//     } catch (error) {
//       console.error(
//         "Assessment details error:",
//         error.response?.data || error.message
//       );
//       setAssessment(null);
//       setErrorMessage(
//         error.response?.data?.message || "Unable to load assessment details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // ACTION HANDLERS (Modal Trigger & API Execution)
//   // =====================================================

//   const openActionModal = (type) => {
//     setActionModal({ show: true, type, actionLoading: false });
//   };

//   const closeActionModal = () => {
//     setActionModal({ show: false, type: null, actionLoading: false });
//   };

//   const handleConfirmAction = async () => {
//     setActionModal((prev) => ({ ...prev, actionLoading: true }));

//     try {
//       if (actionModal.type === "publish") {
//         await publishAssessment(id);
//         await fetchAssessment(); // Refresh details
//       } else if (actionModal.type === "unpublish") {
//         await unpublishAssessment(id);
//         await fetchAssessment(); // Refresh details
//       } else if (actionModal.type === "delete") {
//         await deleteAssessment(id);
//         navigate("/admin/assessments"); // Redirect back on delete
//         return;
//       }
//       closeActionModal();
//     } catch (err) {
//       console.error(`Failed to ${actionModal.type} assessment:`, err);
//       alert(
//         err.response?.data?.message || `Failed to ${actionModal.type} assessment.`
//       );
//       setActionModal((prev) => ({ ...prev, actionLoading: false }));
//     }
//   };

//   // =====================================================
//   // STATUS BADGE HELPER
//   // =====================================================

//   const getStatusBadge = (status) => {
//     const formattedStatus = status ? status.toUpperCase() : "DRAFT";
//     switch (formattedStatus) {
//       case "PUBLISHED":
//         return (
//           <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fw-medium">
//             ● Published
//           </span>
//         );
//       case "UNPUBLISHED":
//         return (
//           <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-2 fw-medium">
//             ● Unpublished
//           </span>
//         );
//       case "DRAFT":
//       default:
//         return (
//           <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-2 fw-medium">
//             ● Draft
//           </span>
//         );
//     }
//   };

//   // =====================================================
//   // ANIMATIONS
//   // =====================================================

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.08, delayChildren: 0.1 },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 15 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
//   };

//   const modalBackdropVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 },
//   };

//   const modalContentVariants = {
//     hidden: { scale: 0.85, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 300, damping: 25 },
//     },
//     exit: { scale: 0.85, opacity: 0 },
//   };

//   // =====================================================
//   // LOADING / ERROR STATES
//   // =====================================================

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary mb-3" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="text-muted fw-medium">Loading assessment details...</p>
//       </div>
//     );
//   }

//   if (!assessment) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="fs-1 mb-3">⚠️</div>
//         <h4 className="fw-semibold text-dark">Assessment Not Found</h4>
//         <p className="text-muted small mb-2">
//           {errorMessage || "The requested assessment could not be found."}
//         </p>
//         <p className="text-muted small mb-4">Assessment ID: {id}</p>
//         <button
//           onClick={() => navigate("/admin/assessments")}
//           className="btn btn-primary px-4 rounded-3"
//         >
//           Back to Assessments
//         </button>
//       </div>
//     );
//   }

//   // Determine current status state
//   const isPublished = assessment?.status?.toUpperCase() === "PUBLISHED";

//   // =====================================================
//   // MAIN RENDER
//   // =====================================================

//   return (
//     <motion.div
//       className="container py-4"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* HEADER & ACTIONS */}
//       <motion.div
//         variants={itemVariants}
//         className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"
//       >
//         <div>
//           <div className="d-flex align-items-center gap-3 mb-1">
//             <h1 className="h3 fw-bold text-dark m-0">
//               {assessment.title || "Untitled Assessment"}
//             </h1>
//             {getStatusBadge(assessment.status)}
//           </div>
//           <p className="text-muted small m-0">
//             View and manage assessment details and configuration.
//           </p>
//         </div>

//         <div className="d-flex flex-wrap gap-2">
//           {/* Toggle Publish / Unpublish Button */}
//           {isPublished ? (
//             <button
//               onClick={() => openActionModal("unpublish")}
//               className="btn btn-outline-warning px-3 rounded-3"
//             >
//               Unpublish
//             </button>
//           ) : (
//             <button
//               onClick={() => openActionModal("publish")}
//               className="btn btn-success px-3 rounded-3"
//             >
//               Publish
//             </button>
//           )}

//           <button
//             onClick={() => navigate(`/admin/assessments/${id}/edit`)}
//             className="btn btn-primary px-3 rounded-3"
//           >
//             Edit
//           </button>

//           <button
//             onClick={() => openActionModal("delete")}
//             className="btn btn-outline-danger px-3 rounded-3"
//           >
//             Delete
//           </button>

//           <button
//             onClick={() => navigate("/admin/assessments")}
//             className="btn btn-outline-secondary px-3 rounded-3"
//           >
//             Back
//           </button>
//         </div>
//       </motion.div>

//       {/* OVERVIEW STATS CARDS */}
//       <motion.div variants={itemVariants} className="row g-3 mb-4">
//         <div className="col-6 col-md-3">
//           <StatCard
//             icon="bi-clock-history"
//             label="Duration"
//             value={
//               assessment.durationMinutes != null
//                 ? `${assessment.durationMinutes} mins`
//                 : "-"
//             }
//           />
//         </div>
//         <div className="col-6 col-md-3">
//           <StatCard
//             icon="bi-award"
//             label="Total Marks"
//             value={
//               assessment.totalMarks != null ? `${assessment.totalMarks} pts` : "-"
//             }
//           />
//         </div>
//         <div className="col-6 col-md-3">
//           <StatCard
//             icon="bi-check2-circle"
//             label="Passing Marks"
//             value={
//               assessment.passingMarks != null
//                 ? `${assessment.passingMarks} pts`
//                 : "-"
//             }
//           />
//         </div>
//         <div className="col-6 col-md-3">
//           <StatCard
//             icon="bi-arrow-repeat"
//             label="Max Attempts"
//             value={assessment.maxAttempts || "-"}
//           />
//         </div>
//       </motion.div>

//       {/* MAIN INFORMATION GRID */}
//       <div className="row g-4">
//         {/* BASIC INFORMATION & METADATA */}
//         <motion.div variants={itemVariants} className="col-12 col-md-6">
//           <div className="card shadow-sm border-0 h-100 rounded-3">
//             <div className="card-body p-4">
//               <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
//                 Basic Information
//               </h2>
//               <div className="d-flex flex-column gap-3">
//                 <Info label="Title" value={assessment.title || "-"} />
//                 <Info
//                   label="Status"
//                   value={getStatusBadge(assessment.status)}
//                 />
//                 <Info
//                   label="Created At"
//                   value={
//                     assessment.createdAt
//                       ? new Date(assessment.createdAt).toLocaleString()
//                       : "-"
//                   }
//                 />
//                 <Info
//                   label="Updated At"
//                   value={
//                     assessment.updatedAt
//                       ? new Date(assessment.updatedAt).toLocaleString()
//                       : "-"
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* SCHEDULE */}
//         <motion.div variants={itemVariants} className="col-12 col-md-6">
//           <div className="card shadow-sm border-0 h-100 rounded-3">
//             <div className="card-body p-4">
//               <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
//                 Schedule
//               </h2>
//               <div className="d-flex flex-column gap-3">
//                 <Info
//                   label="Start Date"
//                   value={
//                     assessment.startDate
//                       ? new Date(assessment.startDate).toLocaleString()
//                       : "Not Scheduled"
//                   }
//                 />
//                 <Info
//                   label="End Date"
//                   value={
//                     assessment.endDate
//                       ? new Date(assessment.endDate).toLocaleString()
//                       : "No Expiration"
//                   }
//                 />
//                 <Info
//                   label="Negative Marking"
//                   value={
//                     assessment.negativeMarking
//                       ? `Yes (${assessment.negativeMarks || 0} pts)`
//                       : "No"
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* QUESTION OPTIONS */}
//       <motion.div
//         variants={itemVariants}
//         className="card shadow-sm border-0 mt-4 rounded-3"
//       >
//         <div className="card-body p-4">
//           <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
//             Question Options
//           </h2>
//           <div className="row g-3">
//             <div className="col-12 col-md-4">
//               <Option
//                 label="Randomize Questions"
//                 value={assessment.randomizeQuestions}
//               />
//             </div>
//             <div className="col-12 col-md-4">
//               <Option
//                 label="Shuffle Options"
//                 value={assessment.shuffleOptions}
//               />
//             </div>
//             <div className="col-12 col-md-4">
//               <Option
//                 label="Negative Marking"
//                 value={assessment.negativeMarking}
//               />
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* DESCRIPTION */}
//       <motion.div
//         variants={itemVariants}
//         className="card shadow-sm border-0 mt-4 rounded-3"
//       >
//         <div className="card-body p-4">
//           <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
//             Description
//           </h2>
//           <p
//             className="text-secondary mb-0 text-break"
//             style={{ whiteSpace: "pre-wrap" }}
//           >
//             {assessment.description || "No description provided."}
//           </p>
//         </div>
//       </motion.div>

//       {/* INSTRUCTIONS */}
//       <motion.div
//         variants={itemVariants}
//         className="card shadow-sm border-0 mt-4 rounded-3"
//       >
//         <div className="card-body p-4">
//           <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
//             Instructions
//           </h2>
//           <p
//             className="text-secondary mb-0 text-break"
//             style={{ whiteSpace: "pre-wrap" }}
//           >
//             {assessment.instructions || "No instructions provided."}
//           </p>
//         </div>
//       </motion.div>

//       {/* CUSTOM CONFIRMATION MODAL */}
//       <AnimatePresence>
//         {actionModal.show && (
//           <div
//             className="modal fade show d-block"
//             tabIndex="-1"
//             style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//           >
//             <motion.div
//               variants={modalBackdropVariants}
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               className="modal-dialog modal-dialog-centered"
//             >
//               <motion.div
//                 variants={modalContentVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//                 className="modal-content border-0 shadow-lg text-center p-4 rounded-4"
//               >
//                 <div className="modal-body">
//                   {/* Modal Header Icon */}
//                   {actionModal.type === "delete" && (
//                     <div
//                       className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle mb-3"
//                       style={{ width: "64px", height: "64px", fontSize: "28px" }}
//                     >
//                       <i className="bi bi-trash"></i>
//                     </div>
//                   )}

//                   {actionModal.type === "publish" && (
//                     <div
//                       className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3"
//                       style={{ width: "64px", height: "64px", fontSize: "28px" }}
//                     >
//                       <i className="bi bi-upload"></i>
//                     </div>
//                   )}

//                   {actionModal.type === "unpublish" && (
//                     <div
//                       className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis rounded-circle mb-3"
//                       style={{ width: "64px", height: "64px", fontSize: "28px" }}
//                     >
//                       <i className="bi bi-download"></i>
//                     </div>
//                   )}

//                   {/* Dynamic Modal Titles & Content */}
//                   <h4 className="fw-bold text-dark mb-2">
//                     {actionModal.type === "delete" && "Delete Assessment"}
//                     {actionModal.type === "publish" && "Publish Assessment"}
//                     {actionModal.type === "unpublish" && "Unpublish Assessment"}
//                   </h4>

//                   <p className="text-muted small mb-4">
//                     {actionModal.type === "delete" &&
//                       "Are you sure you want to delete this assessment? This action cannot be undone."}
//                     {actionModal.type === "publish" &&
//                       "Are you sure you want to publish this assessment? It will become visible to students."}
//                     {actionModal.type === "unpublish" &&
//                       "Are you sure you want to unpublish this assessment? Students will no longer access it."}
//                   </p>

//                   <div className="d-flex gap-2">
//                     <button
//                       type="button"
//                       className="btn btn-light w-50 py-2 fw-medium rounded-3"
//                       onClick={closeActionModal}
//                       disabled={actionModal.actionLoading}
//                     >
//                       Cancel
//                     </button>

//                     <button
//                       type="button"
//                       className={`btn w-50 py-2 fw-medium rounded-3 text-white d-flex align-items-center justify-content-center gap-2 ${
//                         actionModal.type === "delete"
//                           ? "btn-danger"
//                           : actionModal.type === "publish"
//                           ? "btn-success"
//                           : "btn-warning"
//                       }`}
//                       onClick={handleConfirmAction}
//                       disabled={actionModal.actionLoading}
//                     >
//                       {actionModal.actionLoading && (
//                         <span
//                           className="spinner-border spinner-border-sm"
//                           role="status"
//                           aria-hidden="true"
//                         ></span>
//                       )}
//                       Confirm
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// // =======================================================
// // HELPER COMPONENTS
// // =======================================================

// function StatCard({ icon, label, value }) {
//   return (
//     <div className="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
//       <div className="d-flex align-items-center gap-3">
//         <div
//           className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3"
//           style={{ width: "42px", height: "42px", fontSize: "20px" }}
//         >
//           <i className={`bi ${icon}`}></i>
//         </div>
//         <div>
//           <div className="text-muted small fw-medium">{label}</div>
//           <div className="fw-bold text-dark fs-6">{value}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
//       <span className="small text-muted">{label}</span>
//       <span className="small fw-semibold text-dark text-end">{value}</span>
//     </div>
//   );
// }

// function Option({ label, value }) {
//   return (
//     <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center bg-light-subtle">
//       <span className="small text-secondary fw-medium">{label}</span>
//       <span
//         className={`badge rounded-pill ${
//           value
//             ? "bg-success-subtle text-success border border-success-subtle"
//             : "bg-secondary-subtle text-secondary border border-secondary-subtle"
//         }`}
//       >
//         {value ? "Enabled" : "Disabled"}
//       </span>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// =====================================================
// ASSESSMENT SERVICE
// =====================================================

import {
  getAssessmentById,
  deleteAssessment,
  publishAssessment,
  unpublishAssessment,
} from "../../../services/assessmentService";

// =====================================================
// ASSESSMENT DETAILS
// =====================================================

export default function AssessmentDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [assessment, setAssessment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [actionModal, setActionModal] =
    useState({
      show: false,
      type: null, // "publish" | "unpublish" | "delete"
      actionLoading: false,
    });

  // =====================================================
  // FETCH ASSESSMENT
  // =====================================================

  useEffect(() => {
    if (!id) {
      setErrorMessage(
        "Assessment ID is missing."
      );

      setLoading(false);

      return;
    }

    fetchAssessment();
  }, [id]);

  // =====================================================
  // FETCH ASSESSMENT DETAILS
  // =====================================================

  const fetchAssessment = async () => {
    try {
      setLoading(true);

      setErrorMessage("");

      const response =
        await getAssessmentById(id);

      const assessmentData =
        response?.data || response;

      if (
        !assessmentData ||
        typeof assessmentData !==
          "object"
      ) {
        throw new Error(
          "Assessment data was not returned by the server."
        );
      }

      setAssessment(
        assessmentData
      );
    } catch (error) {
      console.error(
        "Assessment details error:",
        error.response?.data ||
          error.message
      );

      setAssessment(null);

      setErrorMessage(
        error.response?.data
          ?.message ||
          "Unable to load assessment details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ACTION HANDLERS
  // =====================================================

  const openActionModal = (
    type
  ) => {
    setActionModal({
      show: true,
      type,
      actionLoading: false,
    });
  };

  // =====================================================
  // CLOSE ACTION MODAL
  // =====================================================

  const closeActionModal = () => {
    setActionModal({
      show: false,
      type: null,
      actionLoading: false,
    });
  };

  // =====================================================
  // CONFIRM ACTION
  // =====================================================

  const handleConfirmAction =
    async () => {
      setActionModal(
        (prev) => ({
          ...prev,
          actionLoading: true,
        })
      );

      try {
        // ===============================================
        // PUBLISH
        // ===============================================

        if (
          actionModal.type ===
          "publish"
        ) {
          await publishAssessment(
            id
          );

          await fetchAssessment();
        }

        // ===============================================
        // UNPUBLISH
        // ===============================================

        else if (
          actionModal.type ===
          "unpublish"
        ) {
          await unpublishAssessment(
            id
          );

          await fetchAssessment();
        }

        // ===============================================
        // DELETE
        // ===============================================

        else if (
          actionModal.type ===
          "delete"
        ) {
          await deleteAssessment(
            id
          );

          navigate(
            "/admin/assessments"
          );

          return;
        }

        closeActionModal();
      } catch (err) {
        console.error(
          `Failed to ${actionModal.type} assessment:`,
          err
        );

        alert(
          err.response?.data
            ?.message ||
            `Failed to ${actionModal.type} assessment.`
        );

        setActionModal(
          (prev) => ({
            ...prev,
            actionLoading: false,
          })
        );
      }
    };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (
    status
  ) => {
    const formattedStatus =
      status
        ? status.toUpperCase()
        : "DRAFT";

    switch (
      formattedStatus
    ) {
      // ===============================================
      // PUBLISHED
      // ===============================================

      case "PUBLISHED":
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fw-medium">
            ● Published
          </span>
        );

      // ===============================================
      // UNPUBLISHED
      // ===============================================

      case "UNPUBLISHED":
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-2 fw-medium">
            ● Unpublished
          </span>
        );

      // ===============================================
      // DRAFT
      // ===============================================

      case "DRAFT":
      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-2 fw-medium">
            ● Draft
          </span>
        );
    }
  };

  // =====================================================
  // ANIMATIONS
  // =====================================================

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.3,
      },
    },
  };

  const modalBackdropVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  };

  const modalContentVariants = {
    hidden: {
      scale: 0.85,
      opacity: 0,
    },

    visible: {
      scale: 1,
      opacity: 1,

      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },

    exit: {
      scale: 0.85,
      opacity: 0,
    },
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary mb-3"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="text-muted fw-medium">
          Loading assessment details...
        </p>

      </div>
    );
  }

  // =====================================================
  // ASSESSMENT NOT FOUND
  // =====================================================

  if (!assessment) {
    return (
      <div className="container py-5 text-center">

        <div className="fs-1 mb-3">
          ⚠️
        </div>

        <h4 className="fw-semibold text-dark">
          Assessment Not Found
        </h4>

        <p className="text-muted small mb-2">
          {errorMessage ||
            "The requested assessment could not be found."}
        </p>

        <p className="text-muted small mb-4">
          Assessment ID: {id}
        </p>

        <button
          onClick={() =>
            navigate(
              "/admin/assessments"
            )
          }
          className="btn btn-primary px-4 rounded-3"
        >
          Back to Assessments
        </button>

      </div>
    );
  }

  // =====================================================
  // CURRENT STATUS
  // =====================================================

  const isPublished =
    assessment?.status?.toUpperCase() ===
    "PUBLISHED";

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <motion.div
      className="container py-4"
      variants={
        containerVariants
      }
      initial="hidden"
      animate="visible"
    >

      {/* ==================================================
          HEADER & ACTIONS
          ================================================== */}

      <motion.div
        variants={itemVariants}
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"
      >

        {/* ==================================================
            TITLE
            ================================================== */}

        <div>

          <div className="d-flex align-items-center gap-3 mb-1">

            <h1 className="h3 fw-bold text-dark m-0">
              {assessment.title ||
                "Untitled Assessment"}
            </h1>

            {getStatusBadge(
              assessment.status
            )}

          </div>

          <p className="text-muted small m-0">
            View and manage assessment
            details and configuration.
          </p>

        </div>

        {/* ==================================================
            ACTION BUTTONS
            ================================================== */}

        <div className="d-flex flex-wrap gap-2">

          {/* ==================================================
              PUBLISH / UNPUBLISH
              ================================================== */}

          {isPublished ? (
            <button
              onClick={() =>
                openActionModal(
                  "unpublish"
                )
              }
              className="btn btn-outline-warning px-3 rounded-3"
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={() =>
                openActionModal(
                  "publish"
                )
              }
              className="btn btn-success px-3 rounded-3"
            >
              Publish
            </button>
          )}

          {/* ==================================================
              ASSIGN STUDENTS
              ================================================== */}

          <button
            type="button"
            className="btn btn-primary px-3 rounded-3"
            onClick={() =>
              navigate(
                `/admin/assessments/${id}/assign-students`
              )
            }
          >
            <i className="bi bi-person-plus me-2"></i>

            Assign Students
          </button>

          {/* ==================================================
              EDIT
              ================================================== */}

          <button
            onClick={() =>
              navigate(
                `/admin/assessments/${id}/edit`
              )
            }
            className="btn btn-primary px-3 rounded-3"
          >
            Edit
          </button>

          {/* ==================================================
              DELETE
              ================================================== */}

          <button
            onClick={() =>
              openActionModal(
                "delete"
              )
            }
            className="btn btn-outline-danger px-3 rounded-3"
          >
            Delete
          </button>

          {/* ==================================================
              BACK
              ================================================== */}

          <button
            onClick={() =>
              navigate(
                "/admin/assessments"
              )
            }
            className="btn btn-outline-secondary px-3 rounded-3"
          >
            Back
          </button>

        </div>

      </motion.div>

      {/* ==================================================
          OVERVIEW STATS CARDS
          ================================================== */}

      <motion.div
        variants={itemVariants}
        className="row g-3 mb-4"
      >

        <div className="col-6 col-md-3">

          <StatCard
            icon="bi-clock-history"
            label="Duration"
            value={
              assessment.durationMinutes !=
              null
                ? `${assessment.durationMinutes} mins`
                : "-"
            }
          />

        </div>

        <div className="col-6 col-md-3">

          <StatCard
            icon="bi-award"
            label="Total Marks"
            value={
              assessment.totalMarks !=
              null
                ? `${assessment.totalMarks} pts`
                : "-"
            }
          />

        </div>

        <div className="col-6 col-md-3">

          <StatCard
            icon="bi-check2-circle"
            label="Passing Marks"
            value={
              assessment.passingMarks !=
              null
                ? `${assessment.passingMarks} pts`
                : "-"
            }
          />

        </div>

        <div className="col-6 col-md-3">

          <StatCard
            icon="bi-arrow-repeat"
            label="Max Attempts"
            value={
              assessment.maxAttempts ||
              "-"
            }
          />

        </div>

      </motion.div>

      {/* ==================================================
          MAIN INFORMATION GRID
          ================================================== */}

      <div className="row g-4">

        {/* ==================================================
            BASIC INFORMATION
            ================================================== */}

        <motion.div
          variants={itemVariants}
          className="col-12 col-md-6"
        >

          <div className="card shadow-sm border-0 h-100 rounded-3">

            <div className="card-body p-4">

              <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
                Basic Information
              </h2>

              <div className="d-flex flex-column gap-3">

                <Info
                  label="Title"
                  value={
                    assessment.title ||
                    "-"
                  }
                />

                <Info
                  label="Status"
                  value={getStatusBadge(
                    assessment.status
                  )}
                />

                <Info
                  label="Created At"
                  value={
                    assessment.createdAt
                      ? new Date(
                          assessment.createdAt
                        ).toLocaleString()
                      : "-"
                  }
                />

                <Info
                  label="Updated At"
                  value={
                    assessment.updatedAt
                      ? new Date(
                          assessment.updatedAt
                        ).toLocaleString()
                      : "-"
                  }
                />

              </div>

            </div>

          </div>

        </motion.div>

        {/* ==================================================
            SCHEDULE
            ================================================== */}

        <motion.div
          variants={itemVariants}
          className="col-12 col-md-6"
        >

          <div className="card shadow-sm border-0 h-100 rounded-3">

            <div className="card-body p-4">

              <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
                Schedule
              </h2>

              <div className="d-flex flex-column gap-3">

                <Info
                  label="Start Date"
                  value={
                    assessment.startDate
                      ? new Date(
                          assessment.startDate
                        ).toLocaleString()
                      : "Not Scheduled"
                  }
                />

                <Info
                  label="End Date"
                  value={
                    assessment.endDate
                      ? new Date(
                          assessment.endDate
                        ).toLocaleString()
                      : "No Expiration"
                  }
                />

                <Info
                  label="Negative Marking"
                  value={
                    assessment.negativeMarking
                      ? `Yes (${
                          assessment.negativeMarks ||
                          0
                        } pts)`
                      : "No"
                  }
                />

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ==================================================
          QUESTION OPTIONS
          ================================================== */}

      <motion.div
        variants={itemVariants}
        className="card shadow-sm border-0 mt-4 rounded-3"
      >

        <div className="card-body p-4">

          <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
            Question Options
          </h2>

          <div className="row g-3">

            <div className="col-12 col-md-4">

              <Option
                label="Randomize Questions"
                value={
                  assessment.randomizeQuestions
                }
              />

            </div>

            <div className="col-12 col-md-4">

              <Option
                label="Shuffle Options"
                value={
                  assessment.shuffleOptions
                }
              />

            </div>

            <div className="col-12 col-md-4">

              <Option
                label="Negative Marking"
                value={
                  assessment.negativeMarking
                }
              />

            </div>

          </div>

        </div>

      </motion.div>

      {/* ==================================================
          DESCRIPTION
          ================================================== */}

      <motion.div
        variants={itemVariants}
        className="card shadow-sm border-0 mt-4 rounded-3"
      >

        <div className="card-body p-4">

          <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
            Description
          </h2>

          <p
            className="text-secondary mb-0 text-break"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {assessment.description ||
              "No description provided."}
          </p>

        </div>

      </motion.div>

      {/* ==================================================
          INSTRUCTIONS
          ================================================== */}

      <motion.div
        variants={itemVariants}
        className="card shadow-sm border-0 mt-4 rounded-3"
      >

        <div className="card-body p-4">

          <h2 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">
            Instructions
          </h2>

          <p
            className="text-secondary mb-0 text-break"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {assessment.instructions ||
              "No instructions provided."}
          </p>

        </div>

      </motion.div>

      {/* ==================================================
          CUSTOM CONFIRMATION MODAL
          ================================================== */}

      <AnimatePresence>

        {actionModal.show && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor:
                "rgba(0, 0, 0, 0.5)",
            }}
          >

            <motion.div
              variants={
                modalBackdropVariants
              }
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="modal-dialog modal-dialog-centered"
            >

              <motion.div
                variants={
                  modalContentVariants
                }
                initial="hidden"
                animate="visible"
                exit="exit"
                className="modal-content border-0 shadow-lg text-center p-4 rounded-4"
              >

                <div className="modal-body">

                  {/* ==================================================
                      DELETE ICON
                      ================================================== */}

                  {actionModal.type ===
                    "delete" && (
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle mb-3"
                      style={{
                        width: "64px",
                        height: "64px",
                        fontSize: "28px",
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </div>
                  )}

                  {/* ==================================================
                      PUBLISH ICON
                      ================================================== */}

                  {actionModal.type ===
                    "publish" && (
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3"
                      style={{
                        width: "64px",
                        height: "64px",
                        fontSize: "28px",
                      }}
                    >
                      <i className="bi bi-upload"></i>
                    </div>
                  )}

                  {/* ==================================================
                      UNPUBLISH ICON
                      ================================================== */}

                  {actionModal.type ===
                    "unpublish" && (
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis rounded-circle mb-3"
                      style={{
                        width: "64px",
                        height: "64px",
                        fontSize: "28px",
                      }}
                    >
                      <i className="bi bi-download"></i>
                    </div>
                  )}

                  {/* ==================================================
                      MODAL TITLE
                      ================================================== */}

                  <h4 className="fw-bold text-dark mb-2">

                    {actionModal.type ===
                      "delete" &&
                      "Delete Assessment"}

                    {actionModal.type ===
                      "publish" &&
                      "Publish Assessment"}

                    {actionModal.type ===
                      "unpublish" &&
                      "Unpublish Assessment"}

                  </h4>

                  {/* ==================================================
                      MODAL MESSAGE
                      ================================================== */}

                  <p className="text-muted small mb-4">

                    {actionModal.type ===
                      "delete" &&
                      "Are you sure you want to delete this assessment? This action cannot be undone."}

                    {actionModal.type ===
                      "publish" &&
                      "Are you sure you want to publish this assessment? It will become visible to students."}

                    {actionModal.type ===
                      "unpublish" &&
                      "Are you sure you want to unpublish this assessment? Students will no longer access it."}

                  </p>

                  {/* ==================================================
                      MODAL BUTTONS
                      ================================================== */}

                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-light w-50 py-2 fw-medium rounded-3"
                      onClick={
                        closeActionModal
                      }
                      disabled={
                        actionModal.actionLoading
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className={`btn w-50 py-2 fw-medium rounded-3 text-white d-flex align-items-center justify-content-center gap-2 ${
                        actionModal.type ===
                        "delete"
                          ? "btn-danger"
                          : actionModal.type ===
                            "publish"
                          ? "btn-success"
                          : "btn-warning"
                      }`}
                      onClick={
                        handleConfirmAction
                      }
                      disabled={
                        actionModal.actionLoading
                      }
                    >

                      {actionModal.actionLoading && (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}

                      Confirm

                    </button>

                  </div>

                </div>

              </motion.div>

            </motion.div>

          </div>
        )}

      </AnimatePresence>

    </motion.div>
  );
}

// =======================================================
// STAT CARD
// =======================================================

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">

      <div className="d-flex align-items-center gap-3">

        <div
          className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3"
          style={{
            width: "42px",
            height: "42px",
            fontSize: "20px",
          }}
        >
          <i
            className={`bi ${icon}`}
          ></i>
        </div>

        <div>

          <div className="text-muted small fw-medium">
            {label}
          </div>

          <div className="fw-bold text-dark fs-6">
            {value}
          </div>

        </div>

      </div>

    </div>
  );
}

// =======================================================
// INFO
// =======================================================

function Info({
  label,
  value,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">

      <span className="small text-muted">
        {label}
      </span>

      <span className="small fw-semibold text-dark text-end">
        {value}
      </span>

    </div>
  );
}

// =======================================================
// OPTION
// =======================================================

function Option({
  label,
  value,
}) {
  return (
    <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center bg-light-subtle">

      <span className="small text-secondary fw-medium">
        {label}
      </span>

      <span
        className={`badge rounded-pill ${
          value
            ? "bg-success-subtle text-success border border-success-subtle"
            : "bg-secondary-subtle text-secondary border border-secondary-subtle"
        }`}
      >
        {value
          ? "Enabled"
          : "Disabled"}
      </span>

    </div>
  );
}