// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import {
//   bulkAssignAssessment,
//   getAssessmentAssignedStudents,
//   revokeAssessmentAssignment,
//   reactivateAssessmentAssignment,
// } from "../../../services/adminAssessmentAssignmentService";

// import {
//   getAdminStudents,
// } from "../../../services/adminStudentService";

// // ======================================================
// // COMPONENT
// // ======================================================

// export default function AssessmentAssignments() {
//   const { assessmentId } = useParams();

//   const navigate = useNavigate();

//   // ====================================================
//   // STUDENTS
//   // ====================================================

//   const [students, setStudents] = useState([]);

//   const [assignedStudents, setAssignedStudents] =
//     useState([]);

//   // ====================================================
//   // LOADING
//   // ====================================================

//   const [loadingStudents, setLoadingStudents] =
//     useState(true);

//   const [loadingAssigned, setLoadingAssigned] =
//     useState(true);

//   const [assigning, setAssigning] =
//     useState(false);

//   const [actionLoading, setActionLoading] =
//     useState(null);

//   // ====================================================
//   // ERROR / SUCCESS
//   // ====================================================

//   const [error, setError] =
//     useState("");

//   const [success, setSuccess] =
//     useState("");

//   // ====================================================
//   // SEARCH
//   // ====================================================

//   const [studentSearch, setStudentSearch] =
//     useState("");

//   const [assignedSearch, setAssignedSearch] =
//     useState("");

//   // ====================================================
//   // SELECTED STUDENTS
//   // ====================================================

//   const [selectedStudents, setSelectedStudents] =
//     useState([]);

//   // ====================================================
//   // ASSIGNMENT FORM
//   // ====================================================

//   const [availableFrom, setAvailableFrom] =
//     useState("");

//   const [dueDate, setDueDate] =
//     useState("");

//   const [maxAttempts, setMaxAttempts] =
//     useState("");

//   const [notes, setNotes] =
//     useState("");

//   // ====================================================
//   // SELECT ALL CHECKBOX REF
//   // ====================================================

//   const selectAllRef = useRef(null);

//   // ====================================================
//   // LOAD REGISTERED STUDENTS
//   // ====================================================

//   const loadStudents = useCallback(async () => {
//     try {
//       setLoadingStudents(true);
//       setError("");

//       const response = await getAdminStudents({
//         page: 1,
//         limit: 100,
//         search: studentSearch,
//         status: "",
//       });

//       setStudents(
//         response?.data?.students || []
//       );
//     } catch (err) {
//       console.error(
//         "LOAD STUDENTS ERROR:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Failed to load students."
//       );
//     } finally {
//       setLoadingStudents(false);
//     }
//   }, [studentSearch]);

//   // ====================================================
//   // LOAD ASSIGNED STUDENTS
//   // ====================================================

//   const loadAssignedStudents =
//     useCallback(async () => {
//       if (!assessmentId) {
//         setAssignedStudents([]);
//         return;
//       }

//       try {
//         setLoadingAssigned(true);

//         const response =
//           await getAssessmentAssignedStudents({
//             assessmentId,
//             page: 1,
//             limit: 1000,
//             search: "",
//             status: "",
//           });

//         setAssignedStudents(
//           response?.data?.assignments || []
//         );
//       } catch (err) {
//         console.error(
//           "LOAD ASSIGNED STUDENTS ERROR:",
//           err
//         );

//         setError(
//           err?.response?.data?.message ||
//             "Failed to load assigned students."
//         );
//       } finally {
//         setLoadingAssigned(false);
//       }
//     }, [assessmentId]);

//   // ====================================================
//   // INITIAL LOAD
//   // ====================================================

//   useEffect(() => {
//     loadStudents();
//   }, [loadStudents]);

//   useEffect(() => {
//     loadAssignedStudents();
//   }, [loadAssignedStudents]);

//   // ====================================================
//   // ASSIGNED STUDENT IDS
//   // ====================================================
//   //
//   // Active assignment:
//   //
//   // ASSIGNED
//   // STARTED
//   // COMPLETED
//   //
//   // These students should not appear in the new
//   // assignment selection list.
//   //
//   // REVOKED / EXPIRED can be selected again through
//   // Reactivate.
//   // ====================================================

//   const assignedStudentIds = useMemo(() => {
//     return new Set(
//       assignedStudents
//         .filter(
//           (assignment) =>
//             assignment.status !== "REVOKED" &&
//             assignment.status !== "EXPIRED"
//         )
//         .map((assignment) =>
//           String(
//             assignment.student?._id ||
//               assignment.student
//           )
//         )
//         .filter(Boolean)
//     );
//   }, [assignedStudents]);

//   // ====================================================
//   // AVAILABLE STUDENTS
//   // ====================================================

//   const availableStudents = useMemo(() => {
//     return students.filter(
//       (student) =>
//         !assignedStudentIds.has(
//           String(student._id)
//         )
//     );
//   }, [
//     students,
//     assignedStudentIds,
//   ]);

//   // ====================================================
//   // FILTER ASSIGNED STUDENTS
//   // ====================================================

//   const filteredAssignedStudents =
//     useMemo(() => {
//       const search =
//         assignedSearch
//           .trim()
//           .toLowerCase();

//       if (!search) {
//         return assignedStudents;
//       }

//       return assignedStudents.filter(
//         (assignment) => {
//           const student =
//             assignment.student || {};

//           const name =
//             student.name || "";

//           const email =
//             student.email || "";

//           const phone =
//             student.phone || "";

//           return (
//             name
//               .toLowerCase()
//               .includes(search) ||
//             email
//               .toLowerCase()
//               .includes(search) ||
//             phone
//               .toLowerCase()
//               .includes(search)
//           );
//         }
//       );
//     }, [
//       assignedStudents,
//       assignedSearch,
//     ]);

//   // ====================================================
//   // SELECTED AVAILABLE IDS
//   // ====================================================

//   const availableStudentIds = useMemo(() => {
//     return availableStudents.map(
//       (student) => String(student._id)
//     );
//   }, [availableStudents]);

//   // ====================================================
//   // SELECTED COUNT
//   // ====================================================

//   const selectedCount =
//     selectedStudents.length;

//   // ====================================================
//   // SELECT ALL STATE
//   // ====================================================

//   const allAvailableSelected =
//     availableStudentIds.length > 0 &&
//     availableStudentIds.every((id) =>
//       selectedStudents.includes(id)
//     );

//   const someAvailableSelected =
//     availableStudentIds.some((id) =>
//       selectedStudents.includes(id)
//     ) &&
//     !allAvailableSelected;

//   // ====================================================
//   // SET INDETERMINATE CHECKBOX
//   // ====================================================

//   useEffect(() => {
//     if (selectAllRef.current) {
//       selectAllRef.current.indeterminate =
//         someAvailableSelected;
//     }
//   }, [someAvailableSelected]);

//   // ====================================================
//   // SELECT / DESELECT STUDENT
//   // ====================================================

//   const toggleStudent = (studentId) => {
//     const id = String(studentId);

//     setSelectedStudents((previous) => {
//       if (previous.includes(id)) {
//         return previous.filter(
//           (selectedId) =>
//             selectedId !== id
//         );
//       }

//       return [
//         ...previous,
//         id,
//       ];
//     });
//   };

//   // ====================================================
//   // SELECT ALL
//   // ====================================================

//   const toggleSelectAll = () => {
//     if (availableStudentIds.length === 0) {
//       return;
//     }

//     if (allAvailableSelected) {
//       setSelectedStudents([]);
//       return;
//     }

//     setSelectedStudents(
//       availableStudentIds
//     );
//   };

//   // ====================================================
//   // CLEAR SELECTION
//   // ====================================================

//   const clearSelection = () => {
//     setSelectedStudents([]);
//   };

//   // ====================================================
//   // VALIDATE ASSIGNMENT FORM
//   // ====================================================

//   const validateAssignmentForm = () => {
//     // -----------------------------------------------
//     // Student selection
//     // -----------------------------------------------

//     if (selectedStudents.length === 0) {
//       return "Please select at least one student.";
//     }

//     // -----------------------------------------------
//     // Available From / Due Date
//     // -----------------------------------------------

//     if (availableFrom && dueDate) {
//       const availableDate =
//         new Date(availableFrom);

//       const dueDateValue =
//         new Date(dueDate);

//       if (
//         Number.isNaN(
//           availableDate.getTime()
//         ) ||
//         Number.isNaN(
//           dueDateValue.getTime()
//         )
//       ) {
//         return "Please provide valid assignment dates.";
//       }

//       if (dueDateValue < availableDate) {
//         return "Due date cannot be earlier than the available-from date.";
//       }
//     }

//     // -----------------------------------------------
//     // Max Attempts
//     // -----------------------------------------------

//     if (maxAttempts !== "") {
//       const attempts =
//         Number(maxAttempts);

//       if (
//         !Number.isInteger(attempts) ||
//         attempts < 1
//       ) {
//         return "Max attempts must be a whole number greater than or equal to 1.";
//       }
//     }

//     // -----------------------------------------------
//     // Notes
//     // -----------------------------------------------

//     if (notes.length > 500) {
//       return "Notes cannot exceed 500 characters.";
//     }

//     return null;
//   };

//   // ====================================================
//   // ASSIGN STUDENTS
//   // ====================================================

//   const handleAssign = async () => {
//     const validationError =
//       validateAssignmentForm();

//     if (validationError) {
//       setError(validationError);
//       setSuccess("");
//       return;
//     }

//     try {
//       setAssigning(true);

//       setError("");
//       setSuccess("");

//       const response =
//         await bulkAssignAssessment({
//           studentIds:
//             selectedStudents,

//           assessmentId,

//           availableFrom:
//             availableFrom ||
//             null,

//           dueDate:
//             dueDate ||
//             null,

//           maxAttempts:
//             maxAttempts !== ""
//               ? Number(maxAttempts)
//               : null,

//           notes:
//             notes.trim(),
//         });

//       const assignedCount =
//         response?.data
//           ?.assignedCount || 0;

//       const reactivatedCount =
//         response?.data
//           ?.reactivatedCount || 0;

//       const skippedCount =
//         response?.data
//           ?.skippedCount || 0;

//       setSuccess(
//         `Assessment assignment completed. ${assignedCount} assigned, ${reactivatedCount} reactivated${
//           skippedCount > 0
//             ? `, ${skippedCount} skipped`
//             : ""
//         }.`
//       );

//       // -----------------------------------------------
//       // Clear selected students
//       // -----------------------------------------------

//       setSelectedStudents([]);

//       // -----------------------------------------------
//       // Refresh data
//       // -----------------------------------------------

//       await loadStudents();

//       await loadAssignedStudents();
//     } catch (err) {
//       console.error(
//         "ASSIGN ASSESSMENT ERROR:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Failed to assign assessment."
//       );
//     } finally {
//       setAssigning(false);
//     }
//   };

//   // ====================================================
//   // REVOKE ASSIGNMENT
//   // ====================================================

//   const handleRevoke =
//     async (assignmentId) => {
//       const confirmed =
//         window.confirm(
//           "Are you sure you want to revoke this student's assessment access?"
//         );

//       if (!confirmed) {
//         return;
//       }

//       try {
//         setActionLoading(
//           assignmentId
//         );

//         setError("");
//         setSuccess("");

//         await revokeAssessmentAssignment(
//           assignmentId
//         );

//         setSuccess(
//           "Assessment assignment revoked successfully."
//         );

//         await loadAssignedStudents();

//         // Remove from selection if present
//         setSelectedStudents(
//           (previous) =>
//             previous.filter(
//               (id) =>
//                 id !==
//                 String(
//                   assignmentId
//                 )
//             )
//         );
//       } catch (err) {
//         console.error(
//           "REVOKE ERROR:",
//           err
//         );

//         setError(
//           err?.response?.data?.message ||
//             "Failed to revoke assignment."
//         );
//       } finally {
//         setActionLoading(null);
//       }
//     };

//   // ====================================================
//   // REACTIVATE ASSIGNMENT
//   // ====================================================

//   const handleReactivate =
//     async (assignmentId) => {
//       try {
//         setActionLoading(
//           assignmentId
//         );

//         setError("");
//         setSuccess("");

//         await reactivateAssessmentAssignment(
//           assignmentId
//         );

//         setSuccess(
//           "Assessment assignment reactivated successfully."
//         );

//         await loadAssignedStudents();
//       } catch (err) {
//         console.error(
//           "REACTIVATE ERROR:",
//           err
//         );

//         setError(
//           err?.response?.data?.message ||
//             "Failed to reactivate assignment."
//         );
//       } finally {
//         setActionLoading(null);
//       }
//     };

//   // ====================================================
//   // STATUS BADGE
//   // ====================================================

//   const getStatusBadge =
//     (status) => {
//       const config = {
//         ASSIGNED: {
//           className:
//             "bg-primary-subtle text-primary",
//           label: "Assigned",
//         },

//         STARTED: {
//           className:
//             "bg-warning-subtle text-warning-emphasis",
//           label: "Started",
//         },

//         COMPLETED: {
//           className:
//             "bg-success-subtle text-success",
//           label: "Completed",
//         },

//         REVOKED: {
//           className:
//             "bg-danger-subtle text-danger",
//           label: "Revoked",
//         },

//         EXPIRED: {
//           className:
//             "bg-secondary-subtle text-secondary",
//           label: "Expired",
//         },
//       };

//       const item =
//         config[status] ||
//         config.ASSIGNED;

//       return (
//         <span
//           className={`badge ${item.className}`}
//         >
//           {item.label}
//         </span>
//       );
//     };

//   // ====================================================
//   // DATE FORMAT
//   // ====================================================

//   const formatDate = (date) => {
//     if (!date) {
//       return "—";
//     }

//     const parsedDate =
//       new Date(date);

//     if (
//       Number.isNaN(
//         parsedDate.getTime()
//       )
//     ) {
//       return "—";
//     }

//     return parsedDate.toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   // ====================================================
//   // DATE TIME FORMAT
//   // ====================================================

//   const formatDateTime = (date) => {
//     if (!date) {
//       return "—";
//     }

//     const parsedDate =
//       new Date(date);

//     if (
//       Number.isNaN(
//         parsedDate.getTime()
//       )
//     ) {
//       return "—";
//     }

//     return parsedDate.toLocaleString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       }
//     );
//   };

//   // ====================================================
//   // RENDER
//   // ====================================================

//   return (
//     <div className="container-fluid py-4">

//       {/* ==================================================
//           HEADER
//           ================================================== */}

//       <div className="d-flex justify-content-between align-items-center mb-4">

//         <div>
//           <button
//             type="button"
//             className="btn btn-light border mb-3"
//             onClick={() =>
//               navigate(
//                 "/admin/assessments"
//               )
//             }
//           >
//             <i className="bi bi-arrow-left me-2"></i>
//             Back to Assessments
//           </button>

//           <h2 className="fw-bold mb-1">
//             Assign Students
//           </h2>

//           <p className="text-muted mb-0">
//             Select students who are eligible
//             to take this assessment.
//           </p>
//         </div>

//       </div>

//       {/* ==================================================
//           ALERTS
//           ================================================== */}

//       {error && (
//         <div
//           className="alert alert-danger d-flex justify-content-between align-items-center"
//           role="alert"
//         >
//           <span>
//             <i className="bi bi-exclamation-triangle me-2"></i>
//             {error}
//           </span>

//           <button
//             type="button"
//             className="btn-close"
//             onClick={() =>
//               setError("")
//             }
//           ></button>
//         </div>
//       )}

//       {success && (
//         <div
//           className="alert alert-success d-flex justify-content-between align-items-center"
//           role="alert"
//         >
//           <span>
//             <i className="bi bi-check-circle me-2"></i>
//             {success}
//           </span>

//           <button
//             type="button"
//             className="btn-close"
//             onClick={() =>
//               setSuccess("")
//             }
//           ></button>
//         </div>
//       )}

//       {/* ==================================================
//           ASSIGNMENT SETTINGS
//           ================================================== */}

//       <div className="card border-0 shadow-sm mb-4">

//         <div className="card-header bg-white py-3">
//           <h5 className="mb-0 fw-bold">
//             Assignment Settings
//           </h5>
//         </div>

//         <div className="card-body">

//           <div className="row g-3">

//             {/* Available From */}

//             <div className="col-md-4">

//               <label className="form-label fw-semibold">
//                 Available From
//               </label>

//               <input
//                 type="datetime-local"
//                 className="form-control"
//                 value={
//                   availableFrom
//                 }
//                 onChange={(e) =>
//                   setAvailableFrom(
//                     e.target.value
//                   )
//                 }
//               />

//               <small className="text-muted">
//                 Optional. Student can start
//                 from this time.
//               </small>

//             </div>

//             {/* Due Date */}

//             <div className="col-md-4">

//               <label className="form-label fw-semibold">
//                 Due Date
//               </label>

//               <input
//                 type="datetime-local"
//                 className="form-control"
//                 value={dueDate}
//                 onChange={(e) =>
//                   setDueDate(
//                     e.target.value
//                   )
//                 }
//               />

//               <small className="text-muted">
//                 Optional. Access expires
//                 after this date.
//               </small>

//             </div>

//             {/* Max Attempts */}

//             <div className="col-md-4">

//               <label className="form-label fw-semibold">
//                 Max Attempts
//               </label>

//               <input
//                 type="number"
//                 min="1"
//                 step="1"
//                 className="form-control"
//                 placeholder="Use assessment setting"
//                 value={
//                   maxAttempts
//                 }
//                 onChange={(e) =>
//                   setMaxAttempts(
//                     e.target.value
//                   )
//                 }
//               />

//               <small className="text-muted">
//                 Leave empty to use the
//                 assessment setting.
//               </small>

//             </div>

//             {/* Notes */}

//             <div className="col-12">

//               <label className="form-label fw-semibold">
//                 Notes
//               </label>

//               <textarea
//                 className="form-control"
//                 rows="2"
//                 maxLength="500"
//                 placeholder="Optional assignment notes..."
//                 value={notes}
//                 onChange={(e) =>
//                   setNotes(
//                     e.target.value
//                   )
//                 }
//               />

//               <div className="text-end small text-muted mt-1">
//                 {notes.length}/500
//               </div>

//             </div>

//           </div>

//         </div>
//       </div>

//       {/* ==================================================
//           SELECT STUDENTS
//           ================================================== */}

//       <div className="card border-0 shadow-sm mb-4">

//         <div className="card-header bg-white py-3">

//           <div className="d-flex justify-content-between align-items-center">

//             <div>

//               <h5 className="mb-1 fw-bold">
//                 Select Students
//               </h5>

//               <small className="text-muted">
//                 {selectedCount} selected
//                 {" • "}
//                 {availableStudents.length} available
//               </small>

//             </div>

//             <div className="d-flex gap-2">

//               <button
//                 type="button"
//                 className="btn btn-sm btn-outline-primary"
//                 onClick={
//                   toggleSelectAll
//                 }
//                 disabled={
//                   availableStudents.length ===
//                   0
//                 }
//               >
//                 <i
//                   className={`bi ${
//                     allAvailableSelected
//                       ? "bi-check-square"
//                       : "bi-square"
//                   } me-1`}
//                 ></i>

//                 {allAvailableSelected
//                   ? "Deselect All"
//                   : "Select All"}
//               </button>

              

//             </div>

//           </div>

//         </div>

//         <div className="card-body">

//           {/* Search */}

//           <div className="input-group mb-3">

//             <span className="input-group-text bg-white">
//               <i className="bi bi-search"></i>
//             </span>

//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search students by name, email or phone..."
//               value={
//                 studentSearch
//               }
//               onChange={(e) =>
//                 setStudentSearch(
//                   e.target.value
//                 )
//               }
//             />

//           </div>

//           {/* Students */}

//           {loadingStudents ? (
//             <div className="text-center py-5">

//               <div
//                 className="spinner-border text-primary"
//                 role="status"
//               ></div>

//               <p className="text-muted mt-2 mb-0">
//                 Loading students...
//               </p>

//             </div>
//           ) : availableStudents.length ===
//             0 ? (
//             <div className="text-center py-5">

//               <i className="bi bi-people fs-1 text-muted"></i>

//               <h6 className="mt-3">
//                 No available students
//               </h6>

//               <p className="text-muted mb-0">
//                 All matching students are
//                 already assigned.
//               </p>

//             </div>
//           ) : (
//             <div className="table-responsive">

//               <table className="table table-hover align-middle mb-0">

//                 <thead className="table-light">

//                   <tr>

//                     {/* Select All Checkbox */}

//                     <th
//                       style={{
//                         width: "55px",
//                       }}
//                     >
//                       <input
//                         ref={
//                           selectAllRef
//                         }
//                         type="checkbox"
//                         className="form-check-input"
//                         checked={
//                           allAvailableSelected
//                         }
//                         onChange={
//                           toggleSelectAll
//                         }
//                         aria-label="Select all students"
//                       />
//                     </th>

//                     <th>
//                       Student
//                     </th>

//                     <th>
//                       Email
//                     </th>

//                     <th>
//                       Phone
//                     </th>

//                     <th>
//                       Status
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {availableStudents.map(
//                     (student) => {
//                       const id =
//                         String(
//                           student._id
//                         );

//                       const selected =
//                         selectedStudents.includes(
//                           id
//                         );

//                       const suspended =
//                         student.isSuspended ===
//                         true;

//                       const inactive =
//                         student.isActive ===
//                         false;

//                       return (
//                         <tr
//                           key={id}
//                           className={
//                             selected
//                               ? "table-primary"
//                               : ""
//                           }
//                           style={{
//                             cursor:
//                               "pointer",
//                           }}
//                           onClick={() =>
//                             toggleStudent(
//                               id
//                             )
//                           }
//                         >

//                           {/* Checkbox */}

//                           <td>

//                             <input
//                               type="checkbox"
//                               className="form-check-input"
//                               checked={
//                                 selected
//                               }
//                               onChange={() =>
//                                 toggleStudent(
//                                   id
//                                 )
//                               }
//                               onClick={(e) =>
//                                 e.stopPropagation()
//                               }
//                               aria-label={`Select ${student.name}`}
//                             />

//                           </td>

//                           {/* Student */}

//                           <td>

//                             <div className="d-flex align-items-center gap-3">

//                               {student.profileImage ? (
//                                 <img
//                                   src={
//                                     student.profileImage
//                                   }
//                                   alt={
//                                     student.name ||
//                                     "Student"
//                                   }
//                                   width="42"
//                                   height="42"
//                                   className="rounded-circle object-fit-cover"
//                                 />
//                               ) : (
//                                 <div
//                                   className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
//                                   style={{
//                                     width:
//                                       "42px",
//                                     height:
//                                       "42px",
//                                   }}
//                                 >
//                                   {student.name
//                                     ?.charAt(
//                                       0
//                                     )
//                                     ?.toUpperCase() ||
//                                     "S"}
//                                 </div>
//                               )}

//                               <div>

//                                 <div className="fw-semibold">
//                                   {student.name ||
//                                     "Unnamed Student"}
//                                 </div>

//                                 <small className="text-muted">
//                                   {student.role ||
//                                     "STUDENT"}
//                                 </small>

//                               </div>

//                             </div>

//                           </td>

//                           {/* Email */}

//                           <td>
//                             {student.email ||
//                               "—"}
//                           </td>

//                           {/* Phone */}

//                           <td>
//                             {student.phone ||
//                               "Not provided"}
//                           </td>

//                           {/* Status */}

//                           <td>

//                             {suspended ? (
//                               <span className="badge bg-danger-subtle text-danger">
//                                 Suspended
//                               </span>
//                             ) : inactive ? (
//                               <span className="badge bg-secondary-subtle text-secondary">
//                                 Inactive
//                               </span>
//                             ) : (
//                               <span className="badge bg-success-subtle text-success">
//                                 Active
//                               </span>
//                             )}

//                           </td>

//                         </tr>
//                       );
//                     }
//                   )}

//                 </tbody>

//               </table>

//             </div>
//           )}

//         </div>

//         {/* ==================================================
//             ASSIGN BUTTON
//             ================================================== */}

//         <div className="card-footer bg-white py-3">

//           <div className="d-flex justify-content-between align-items-center">

//             <span className="text-muted">
//               <strong>
//                 {selectedCount}
//               </strong>{" "}
//               student(s) selected
//             </span>

//             <button
//               type="button"
//               className="btn btn-primary"
//               disabled={
//                 assigning ||
//                 selectedCount ===
//                   0
//               }
//               onClick={
//                 handleAssign
//               }
//             >

//               {assigning ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                   ></span>

//                   Assigning...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-person-check me-2"></i>

//                   Assign Assessment
//                 </>
//               )}

//             </button>

//           </div>

//         </div>

//       </div>

//       {/* ==================================================
//           ASSIGNED STUDENTS
//           ================================================== */}

//       <div className="card border-0 shadow-sm">

//         <div className="card-header bg-white py-3">

//           <div className="d-flex justify-content-between align-items-center">

//             <div>

//               <h5 className="mb-1 fw-bold">
//                 Assigned Students
//               </h5>

//               <small className="text-muted">
//                 Students currently associated
//                 with this assessment.
//               </small>

//             </div>

//             <span className="badge bg-primary-subtle text-primary px-3 py-2">
//               {assignedStudents.length}
//               {" "}
//               Assigned
//             </span>

//           </div>

//         </div>

//         <div className="card-body">

//           {/* Search */}

//           <div className="input-group mb-3">

//             <span className="input-group-text bg-white">
//               <i className="bi bi-search"></i>
//             </span>

//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search assigned students..."
//               value={
//                 assignedSearch
//               }
//               onChange={(e) =>
//                 setAssignedSearch(
//                   e.target.value
//                 )
//               }
//             />

//           </div>

//           {loadingAssigned ? (
//             <div className="text-center py-5">

//               <div
//                 className="spinner-border text-primary"
//                 role="status"
//               ></div>

//               <p className="text-muted mt-2">
//                 Loading assigned students...
//               </p>

//             </div>
//           ) : filteredAssignedStudents.length ===
//             0 ? (
//             <div className="text-center py-5">

//               <i className="bi bi-person-plus fs-1 text-muted"></i>

//               <h6 className="mt-3">
//                 {assignedSearch
//                   ? "No matching assigned students"
//                   : "No students assigned"}
//               </h6>

//               <p className="text-muted">
//                 {assignedSearch
//                   ? "Try another search."
//                   : "Select students above to assign this assessment."}
//               </p>

//             </div>
//           ) : (
//             <div className="table-responsive">

//               <table className="table table-hover align-middle">

//                 <thead className="table-light">

//                   <tr>

//                     <th>
//                       Student Name 
//                     </th>

//                     <th>
//                       Email
//                     </th>

//                     <th>
//                       Status
//                     </th>

//                     <th>
//                       Assigned
//                     </th>


//                     <th className="text-end">
//                       Action
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredAssignedStudents.map(
//                     (assignment) => {

//                       const student =
//                         assignment.student ||
//                         {};

//                       return (
//                         <tr
//                           key={
//                             assignment._id
//                           }
//                         >

//                           {/* Student */}

//                           <td>

//                             <div className="d-flex align-items-center gap-3">

//                               {student.profileImage ? (
//                                 <img
//                                   src={
//                                     student.profileImage
//                                   }
//                                   alt={
//                                     student.name ||
//                                     "Student"
//                                   }
//                                   width="40"
//                                   height="40"
//                                   className="rounded-circle object-fit-cover"
//                                 />
//                               ) : (
//                                 <div
//                                   className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
//                                   style={{
//                                     width:
//                                       "40px",
//                                     height:
//                                       "40px",
//                                   }}
//                                 >
//                                   {student.name
//                                     ?.charAt(
//                                       0
//                                     )
//                                     ?.toUpperCase() ||
//                                     "S"}
//                                 </div>
//                               )}

//                               <div>

//                                 <div className="fw-semibold">
//                                   {student.name ||
//                                     "Unnamed Student"}
//                                 </div>

//                                 <small className="text-muted">
//                                   {student.phone ||
//                                     "Not provided"}
//                                 </small>

//                               </div>

//                             </div>

//                           </td>

//                           {/* Email */}

//                           <td>
//                             {student.email ||
//                               "—"}
//                           </td>

//                           {/* Status */}

//                           <td>
//                             {getStatusBadge(
//                               assignment.status
//                             )}
//                           </td>

//                           {/* Assigned */}

//                           <td>
//                             {formatDate(
//                               assignment.assignedAt
//                             )}
//                           </td>

//                           {/* Available From */}

//                           {/* <td>
//                             {formatDateTime(
//                               assignment.availableFrom
//                             )}
//                           </td> */}

//                           {/* Due Date */}

//                           {/* <td>
//                             {formatDateTime(
//                               assignment.dueDate
//                             )}
//                           </td> */}

//                           {/* Max Attempts */}

//                           {/* <td>
//                             {assignment.maxAttempts ||
//                               "Assessment default"}
//                           </td> */}

//                           {/* Action */}

//                           <td className="text-end">

//                             {assignment.status ===
//                               "REVOKED" ||
//                             assignment.status ===
//                               "EXPIRED" ? (
//                               <button
//                                 type="button"
//                                 className="btn btn-sm btn-outline-success"
//                                 disabled={
//                                   actionLoading ===
//                                   assignment._id
//                                 }
//                                 onClick={() =>
//                                   handleReactivate(
//                                     assignment._id
//                                   )
//                                 }
//                               >

//                                 {actionLoading ===
//                                 assignment._id ? (
//                                   <span
//                                     className="spinner-border spinner-border-sm"
//                                     role="status"
//                                   ></span>
//                                 ) : (
//                                   <>
//                                     <i className="bi bi-arrow-clockwise me-1"></i>
//                                     Reactivate
//                                   </>
//                                 )}

//                               </button>
//                             ) : (
//                               <button
//                                 type="button"
//                                 className="btn btn-sm btn-outline-danger"
//                                 disabled={
//                                   actionLoading ===
//                                   assignment._id
//                                 }
//                                 onClick={() =>
//                                   handleRevoke(
//                                     assignment._id
//                                   )
//                                 }
//                               >

//                                 {actionLoading ===
//                                 assignment._id ? (
//                                   <span
//                                     className="spinner-border spinner-border-sm"
//                                     role="status"
//                                   ></span>
//                                 ) : (
//                                   <>
//                                     <i className="bi bi-person-x me-1"></i>
//                                     Revoke
//                                   </>
//                                 )}

//                               </button>
//                             )}

//                           </td>

//                         </tr>
//                       );
//                     }
//                   )}

//                 </tbody>

//               </table>

//             </div>
//           )}

//         </div>

//       </div>

//     </div>
//   );
// }






import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  bulkAssignAssessment,
  getAssessmentAssignedStudents,
  revokeAssessmentAssignment,
  reactivateAssessmentAssignment,
} from "../../../services/adminAssessmentAssignmentService";

import {
  getAdminStudents,
} from "../../../services/adminStudentService";

// ======================================================
// COMPONENT
// ======================================================

export default function AssessmentAssignments() {
  const { assessmentId } = useParams();

  const navigate = useNavigate();

  // ====================================================
  // STUDENTS
  // ====================================================

  const [students, setStudents] = useState([]);

  const [assignedStudents, setAssignedStudents] =
    useState([]);

  // ====================================================
  // LOADING
  // ====================================================

  const [loadingStudents, setLoadingStudents] =
    useState(true);

  const [loadingAssigned, setLoadingAssigned] =
    useState(true);

  const [assigning, setAssigning] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  // ====================================================
  // ERROR / SUCCESS
  // ====================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ====================================================
  // SEARCH
  // ====================================================

  const [studentSearch, setStudentSearch] =
    useState("");

  const [assignedSearch, setAssignedSearch] =
    useState("");

  // ====================================================
  // SELECTED STUDENTS
  // ====================================================

  const [selectedStudents, setSelectedStudents] =
    useState([]);

  // ====================================================
  // ASSIGNMENT FORM
  // ====================================================

  const [availableFrom, setAvailableFrom] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [maxAttempts, setMaxAttempts] =
    useState("");

  const [notes, setNotes] =
    useState("");

  // ====================================================
  // SELECT ALL CHECKBOX REF
  // ====================================================

  const selectAllRef = useRef(null);

  // ====================================================
  // LOAD REGISTERED STUDENTS
  // ====================================================

  const loadStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      setError("");

      const response = await getAdminStudents({
        page: 1,
        limit: 100,
        search: studentSearch,
        status: "",
      });

      setStudents(
        response?.data?.students || []
      );
    } catch (err) {
      console.error(
        "LOAD STUDENTS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  }, [studentSearch]);

  // ====================================================
  // LOAD ASSIGNED STUDENTS
  // ====================================================

  const loadAssignedStudents =
    useCallback(async () => {
      if (!assessmentId) {
        setAssignedStudents([]);
        return;
      }

      try {
        setLoadingAssigned(true);

        const response =
          await getAssessmentAssignedStudents({
            assessmentId,
            page: 1,
            limit: 1000,
            search: "",
            status: "",
          });

        setAssignedStudents(
          response?.data?.assignments || []
        );
      } catch (err) {
        console.error(
          "LOAD ASSIGNED STUDENTS ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load assigned students."
        );
      } finally {
        setLoadingAssigned(false);
      }
    }, [assessmentId]);

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadAssignedStudents();
  }, [loadAssignedStudents]);

  // ====================================================
  // ASSIGNED STUDENT IDS
  // ====================================================

  const assignedStudentIds = useMemo(() => {
    return new Set(
      assignedStudents
        .filter(
          (assignment) =>
            assignment.status !== "REVOKED" &&
            assignment.status !== "EXPIRED"
        )
        .map((assignment) =>
          String(
            assignment.student?._id ||
              assignment.student
          )
        )
        .filter(Boolean)
    );
  }, [assignedStudents]);

  // ====================================================
  // AVAILABLE STUDENTS
  // ====================================================

  const availableStudents = useMemo(() => {
    return students.filter(
      (student) =>
        !assignedStudentIds.has(
          String(student._id)
        )
    );
  }, [
    students,
    assignedStudentIds,
  ]);

  // ====================================================
  // FILTER ASSIGNED STUDENTS
  // ====================================================

  const filteredAssignedStudents =
    useMemo(() => {
      const search =
        assignedSearch
          .trim()
          .toLowerCase();

      if (!search) {
        return assignedStudents;
      }

      return assignedStudents.filter(
        (assignment) => {
          const student =
            assignment.student || {};

          const name =
            student.name || "";

          const email =
            student.email || "";

          const phone =
            student.phone || "";

          return (
            name
              .toLowerCase()
              .includes(search) ||
            email
              .toLowerCase()
              .includes(search) ||
            phone
              .toLowerCase()
              .includes(search)
          );
        }
      );
    }, [
      assignedStudents,
      assignedSearch,
    ]);

  // ====================================================
  // SELECTED AVAILABLE IDS
  // ====================================================

  const availableStudentIds = useMemo(() => {
    return availableStudents.map(
      (student) => String(student._id)
    );
  }, [availableStudents]);

  // ====================================================
  // SELECTED COUNT
  // ====================================================

  const selectedCount =
    selectedStudents.length;

  // ====================================================
  // SELECT ALL STATE
  // ====================================================

  const allAvailableSelected =
    availableStudentIds.length > 0 &&
    availableStudentIds.every((id) =>
      selectedStudents.includes(id)
    );

  const someAvailableSelected =
    availableStudentIds.some((id) =>
      selectedStudents.includes(id)
    ) &&
    !allAvailableSelected;

  // ====================================================
  // SET INDETERMINATE CHECKBOX
  // ====================================================

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        someAvailableSelected;
    }
  }, [someAvailableSelected]);

  // ====================================================
  // SELECT / DESELECT STUDENT
  // ====================================================

  const toggleStudent = (studentId) => {
    const id = String(studentId);

    setSelectedStudents((previous) => {
      if (previous.includes(id)) {
        return previous.filter(
          (selectedId) =>
            selectedId !== id
        );
      }

      return [
        ...previous,
        id,
      ];
    });
  };

  // ====================================================
  // SELECT ALL
  // ====================================================

  const toggleSelectAll = () => {
    if (availableStudentIds.length === 0) {
      return;
    }

    if (allAvailableSelected) {
      setSelectedStudents([]);
      return;
    }

    setSelectedStudents(
      availableStudentIds
    );
  };

  // ====================================================
  // VALIDATE ASSIGNMENT FORM
  // ====================================================

  const validateAssignmentForm = () => {
    if (selectedStudents.length === 0) {
      return "Please select at least one student.";
    }

    if (availableFrom && dueDate) {
      const availableDate =
        new Date(availableFrom);

      const dueDateValue =
        new Date(dueDate);

      if (
        Number.isNaN(
          availableDate.getTime()
        ) ||
        Number.isNaN(
          dueDateValue.getTime()
        )
      ) {
        return "Please provide valid assignment dates.";
      }

      if (dueDateValue < availableDate) {
        return "Due date cannot be earlier than the available-from date.";
      }
    }

    if (maxAttempts !== "") {
      const attempts =
        Number(maxAttempts);

      if (
        !Number.isInteger(attempts) ||
        attempts < 1
      ) {
        return "Max attempts must be a whole number greater than or equal to 1.";
      }
    }

    if (notes.length > 500) {
      return "Notes cannot exceed 500 characters.";
    }

    return null;
  };

  // ====================================================
  // ASSIGN STUDENTS
  // ====================================================

  const handleAssign = async () => {
    const validationError =
      validateAssignmentForm();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setAssigning(true);

      setError("");
      setSuccess("");

      const response =
        await bulkAssignAssessment({
          studentIds:
            selectedStudents,

          assessmentId,

          availableFrom:
            availableFrom ||
            null,

          dueDate:
            dueDate ||
            null,

          maxAttempts:
            maxAttempts !== ""
              ? Number(maxAttempts)
              : null,

          notes:
            notes.trim(),
        });

      const assignedCount =
        response?.data
          ?.assignedCount || 0;

      const reactivatedCount =
        response?.data
          ?.reactivatedCount || 0;

      const skippedCount =
        response?.data
          ?.skippedCount || 0;

      setSuccess(
        `Assessment assignment completed. ${assignedCount} assigned, ${reactivatedCount} reactivated${
          skippedCount > 0
            ? `, ${skippedCount} skipped`
            : ""
        }.`
      );

      setSelectedStudents([]);

      await loadStudents();
      await loadAssignedStudents();
    } catch (err) {
      console.error(
        "ASSIGN ASSESSMENT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to assign assessment."
      );
    } finally {
      setAssigning(false);
    }
  };

  // ====================================================
  // REVOKE ASSIGNMENT
  // ====================================================

  const handleRevoke =
    async (assignmentId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to revoke this student's assessment access?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          assignmentId
        );

        setError("");
        setSuccess("");

        await revokeAssessmentAssignment(
          assignmentId
        );

        setSuccess(
          "Assessment assignment revoked successfully."
        );

        await loadAssignedStudents();

        setSelectedStudents(
          (previous) =>
            previous.filter(
              (id) =>
                id !==
                String(
                  assignmentId
                )
            )
        );
      } catch (err) {
        console.error(
          "REVOKE ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to revoke assignment."
        );
      } finally {
        setActionLoading(null);
      }
    };

  // ====================================================
  // REACTIVATE ASSIGNMENT
  // ====================================================

  const handleReactivate =
    async (assignmentId) => {
      try {
        setActionLoading(
          assignmentId
        );

        setError("");
        setSuccess("");

        await reactivateAssessmentAssignment(
          assignmentId
        );

        setSuccess(
          "Assessment assignment reactivated successfully."
        );

        await loadAssignedStudents();
      } catch (err) {
        console.error(
          "REACTIVATE ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to reactivate assignment."
        );
      } finally {
        setActionLoading(null);
      }
    };

  // ====================================================
  // STATUS BADGE
  // ====================================================

  const getStatusBadge =
    (status) => {
      const config = {
        ASSIGNED: {
          className:
            "bg-primary-subtle text-primary",
          label: "Assigned",
        },

        STARTED: {
          className:
            "bg-warning-subtle text-warning-emphasis",
          label: "Started",
        },

        COMPLETED: {
          className:
            "bg-success-subtle text-success",
          label: "Completed",
        },

        REVOKED: {
          className:
            "bg-danger-subtle text-danger",
          label: "Revoked",
        },

        EXPIRED: {
          className:
            "bg-secondary-subtle text-secondary",
          label: "Expired",
        },
      };

      const item =
        config[status] ||
        config.ASSIGNED;

      return (
        <span
          className={`badge ${item.className}`}
        >
          {item.label}
        </span>
      );
    };

  // ====================================================
  // DATE FORMAT
  // ====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            type="button"
            className="btn btn-light border mb-3"
            onClick={() =>
              navigate("/admin/assessments")
            }
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Assessments
          </button>

          <h2 className="fw-bold mb-1">
            Assign Students
          </h2>

          <p className="text-muted mb-0">
            Select students who are eligible to take this assessment.
          </p>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </span>
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {success && (
        <div
          className="alert alert-success d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </span>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {/* ASSIGNMENT SETTINGS CARD */}
      {/* <div className="card border-0 shadow mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">
            Assignment Settings
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Available From
              </label>
              <input
                type="datetime-local"
                className="form-control"
                value={availableFrom}
                onChange={(e) =>
                  setAvailableFrom(e.target.value)
                }
              />
              <small className="text-muted">
                Optional. Student can start from this time.
              </small>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Due Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />
              <small className="text-muted">
                Optional. Access expires after this date.
              </small>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Max Attempts
              </label>
              <input
                type="number"
                min="1"
                step="1"
                className="form-control"
                placeholder="Use assessment setting"
                value={maxAttempts}
                onChange={(e) =>
                  setMaxAttempts(e.target.value)
                }
              />
              <small className="text-muted">
                Leave empty to use the assessment setting.
              </small>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Notes
              </label>
              <textarea
                className="form-control"
                rows="2"
                maxLength="500"
                placeholder="Optional assignment notes..."
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />
              <div className="text-end small text-muted mt-1">
                {notes.length}/500
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* SELECT AVAILABLE STUDENTS CARD */}
      <div className="card border-0 shadow mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 fw-bold">
                Select Students
              </h5>
              <small className="text-muted">
                {selectedCount} selected • {availableStudents.length} available
              </small>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={toggleSelectAll}
                disabled={availableStudents.length === 0}
              >
                <i
                  className={`bi ${
                    allAvailableSelected
                      ? "bi-check-square"
                      : "bi-square"
                  } me-1`}
                ></i>
                {allAvailableSelected ? "Deselect All" : "Select All"}
              </button>

              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAssign}
                disabled={assigning || selectedStudents.length === 0}
              >
                {assigning ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Assigning...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-1"></i>
                    Assign Selected ({selectedCount})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Search Box for Available Students */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search students by name, email or phone..."
              value={studentSearch}
              onChange={(e) =>
                setStudentSearch(e.target.value)
              }
            />
          </div>

          {loadingStudents ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              ></div>
              <p className="text-muted mt-2 mb-0">
                Loading students...
              </p>
            </div>
          ) : availableStudents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted"></i>
              <h6 className="mt-3">
                No available students
              </h6>
              <p className="text-muted mb-0">
                All matching students are already assigned.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "55px" }}>
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        className="form-check-input"
                        checked={allAvailableSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all students"
                      />
                    </th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {availableStudents.map((student) => {
                    const id = String(student._id);
                    const selected = selectedStudents.includes(id);
                    const suspended = student.isSuspended === true;
                    const inactive = student.isActive === false;

                    return (
                      <tr
                        key={id}
                        className={selected ? "table-primary" : ""}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleStudent(id)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selected}
                            onChange={() => toggleStudent(id)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select ${student.name}`}
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {student.profileImage ? (
                              <img
                                src={student.profileImage}
                                alt={student.name || "Student"}
                                width="42"
                                height="42"
                                className="rounded-circle object-fit-cover"
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                  width: "42px",
                                  height: "42px",
                                }}
                              >
                                {student.name?.charAt(0)?.toUpperCase() || "S"}
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">
                                {student.name || "Unnamed Student"}
                              </div>
                              <small className="text-muted">
                                {student.role || "STUDENT"}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{student.email || "—"}</td>
                        <td>{student.phone || "Not provided"}</td>
                        <td>
                          {suspended ? (
                            <span className="badge bg-danger-subtle text-danger">
                              Suspended
                            </span>
                          ) : inactive ? (
                            <span className="badge bg-secondary-subtle text-secondary">
                              Inactive
                            </span>
                          ) : (
                            <span className="badge bg-success-subtle text-success">
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ASSIGNED STUDENTS CARD WITH FULL SHADOW */}
      <div className="card border-0 shadow">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              Assigned Students
            </h5>
            <span className="badge bg-primary rounded-pill">
              {assignedStudents.length} Assigned
            </span>
          </div>
        </div>

        <div className="card-body">
          {/* Search Box in Assigned Students */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search assigned students by name, email or phone..."
              value={assignedSearch}
              onChange={(e) => setAssignedSearch(e.target.value)}
            />
          </div>

          {loadingAssigned ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              ></div>
              <p className="text-muted mt-2 mb-0">
                Loading assigned students...
              </p>
            </div>
          ) : filteredAssignedStudents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x fs-1 text-muted"></i>
              <h6 className="mt-3">No assigned students found</h6>
              <p className="text-muted mb-0">
                {assignedSearch
                  ? "No assigned students match your search criteria."
                  : "No students have been assigned to this assessment yet."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Assign Date</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignedStudents.map((assignment) => {
                    const student = assignment.student || {};
                    const assignmentId = assignment._id;
                    const isRevoked = assignment.status === "REVOKED";
                    const isLoading = actionLoading === assignmentId;

                    return (
                      <tr key={assignmentId}>
                        {/* Student Name */}
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {student.profileImage ? (
                              <img
                                src={student.profileImage}
                                alt={student.name || "Student"}
                                width="40"
                                height="40"
                                className="rounded-circle object-fit-cover"
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-bold"
                                style={{ width: "40px", height: "40px" }}
                              >
                                {student.name?.charAt(0)?.toUpperCase() || "S"}
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">
                                {student.name || "Unnamed Student"}
                              </div>
                              <small className="text-muted">
                                {student.phone || "No Phone"}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td>{student.email || "—"}</td>

                        {/* Status */}
                        <td>{getStatusBadge(assignment.status)}</td>

                        {/* Assign Date */}
                        <td>{formatDate(assignment.createdAt || assignment.assignedAt)}</td>

                        {/* Action */}
                        <td className="text-end">
                          {isRevoked ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleReactivate(assignmentId)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                <>
                                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                                  Reactivate
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRevoke(assignmentId)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                <>
                                  <i className="bi bi-x-circle me-1"></i>
                                  Revoke
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}