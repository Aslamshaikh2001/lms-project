
// import React, {
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// import {
//   motion,
//   AnimatePresence,
// } from "framer-motion";

// import {
//   FiUsers,
//   FiSearch,
//   FiRefreshCw,
//   FiEye,
//   FiMail,
//   FiPhone,
//   FiCheckCircle,
//   FiXCircle,
//   FiShield,
//   FiChevronLeft,
//   FiChevronRight,
//   FiUserCheck,
//   FiX,
//   FiCalendar,
//   FiUser,
//   FiLayers,
//   FiDownload,
// } from "react-icons/fi";

// import { getAdminStudents } from "../../../services/adminStudentService";
// import { useNavigate } from "react-router-dom";


// export default function StudentManagement() {
//   const navigate = useNavigate();

//   // ====================================================
//   // STATE
//   // ====================================================

//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");

//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     limit: 10,
//     totalStudents: 0,
//     totalPages: 0,
//     hasNextPage: false,
//     hasPreviousPage: false,
//   });

//   // ====================================================
//   // QUICK VIEW CUSTOM MODAL STATE
//   // ====================================================

//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // ====================================================
//   // LOAD STUDENTS
//   // ====================================================

//   const loadStudents = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await getAdminStudents({
//         page,
//         limit,
//         search,
//         status,
//       });

//       if (!response?.success) {
//         throw new Error(
//           response?.message || "Unable to fetch students."
//         );
//       }

//       const data = response.data || {};

//       setStudents(data.students || []);

//       setPagination(
//         data.pagination || {
//           currentPage: page,
//           limit,
//           totalStudents: 0,
//           totalPages: 0,
//           hasNextPage: false,
//           hasPreviousPage: false,
//         }
//       );
//     } catch (err) {
//       console.error("STUDENT LIST ERROR:", err);

//       setStudents([]);

//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Unable to load students."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [page, limit, search, status]);

//   // ====================================================
//   // INITIAL LOAD
//   // ====================================================

//   useEffect(() => {
//     loadStudents();
//   }, [loadStudents]);

//   // ====================================================
//   // HANDLERS
//   // ====================================================

//   const handleSearchChange = (event) => {
//     setSearch(event.target.value);
//     setPage(1);
//   };

//   const handleStatusChange = (event) => {
//     setStatus(event.target.value);
//     setPage(1);
//   };

//   const handleRefresh = () => {
//     loadStudents();
//   };

//   // ====================================================
//   // EXPORT ALL FILTERED STUDENTS TO EXCEL-COMPATIBLE CSV
//   // ====================================================

//   const handleExportExcel = async () => {
//     try {
//       setExporting(true);
//       setError("");

//       // Fetch every page using the same search and status filters.
//       const firstResponse = await getAdminStudents({
//         page: 1,
//         limit,
//         search: search.trim(),
//         status,
//       });

//       if (!firstResponse?.success) {
//         throw new Error(
//           firstResponse?.message || "Unable to fetch students for export."
//         );
//       }

//       const firstData = firstResponse.data || {};
//       const allStudents = [...(firstData.students || [])];
//       const totalPages = Number(
//         firstData.pagination?.totalPages ??
//           Math.ceil((firstData.pagination?.totalStudents || allStudents.length) / limit)
//       );

//       for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
//         const response = await getAdminStudents({
//           page: currentPage,
//           limit,
//           search: search.trim(),
//           status,
//         });

//         if (!response?.success) {
//           throw new Error(
//             response?.message || `Unable to fetch students from page ${currentPage}.`
//           );
//         }

//         allStudents.push(...(response.data?.students || []));
//       }

//       if (allStudents.length === 0) {
//         setError("No students found to export for the selected filters.");
//         return;
//       }

//       const escapeCsvValue = (value) => {
//         const text = value === null || value === undefined ? "" : String(value);
//         // Prevent spreadsheet formula execution for values starting with formula characters.
//         const safeText = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
//         return `"${safeText.replace(/"/g, '""')}"`;
//       };

//       const headers = [
//         "Sr. No.",
//         "Student ID",
//         "Student Name",
//         "Email",
//         "Phone",
//         "Registration Date & Time",
//         "Email Verified",
//         "Account Status",
//         "Suspended",
//       ];

//       const rows = allStudents.map((student, index) => {
//         const accountStatus = student.isSuspended
//           ? "Suspended"
//           : !student.isActive
//             ? "Inactive"
//             : "Active";

//         return [
//           index + 1,
//           student._id || student.id || "",
//           student.name || "",
//           student.email || "",
//           student.phone || "",
//           student.createdAt ? formatDateTime(student.createdAt) : "",
//           student.isEmailVerified ? "Yes" : "No",
//           accountStatus,
//           student.isSuspended ? "Yes" : "No",
//         ];
//       });

//       // UTF-8 BOM helps Excel open the CSV with the correct encoding.
//       const csvContent = [headers, ...rows]
//         .map((row) => row.map(escapeCsvValue).join(","))
//         .join("\r\n");
//       const blob = new Blob(["\uFEFF", csvContent], {
//         type: "text/csv;charset=utf-8;",
//       });
//       const downloadUrl = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       const date = new Date().toISOString().slice(0, 10);

//       link.href = downloadUrl;
//       link.download = `SVR_Registered_Students_${date}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       URL.revokeObjectURL(downloadUrl);
//     } catch (err) {
//       console.error("STUDENT EXPORT ERROR:", err);
//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Unable to export students. Please try again."
//       );
//     } finally {
//       setExporting(false);
//     }
//   };

//   const handleOpenQuickView = (student) => {
//     setSelectedStudent(student);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelectedStudent(null), 200);
//   };

//   // ====================================================
//   // HELPERS
//   // ====================================================

//   const getStudentStatus = (student) => {
//     if (student.isSuspended) {
//       return {
//         text: "Suspended",
//         className: "bg-danger-subtle text-danger border border-danger-subtle",
//         icon: <FiShield size={13} />,
//       };
//     }

//     if (!student.isActive) {
//       return {
//         text: "Inactive",
//         className:
//           "bg-secondary-subtle text-secondary border border-secondary-subtle",
//         icon: <FiXCircle size={13} />,
//       };
//     }

//     return {
//       text: "Active",
//       className: "bg-success-subtle text-success border border-success-subtle",
//       icon: <FiCheckCircle size={13} />,
//     };
//   };

//   // ====================================================
//   // DATE + TIME FORMAT
//   // ====================================================

//   const formatDateTime = (date) => {
//     if (!date) return "-";

//     const parsedDate = new Date(date);

//     if (isNaN(parsedDate.getTime())) {
//       return "-";
//     }

//     return parsedDate.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // ====================================================
//   // PAGINATION
//   // ====================================================

//   const goToPreviousPage = () => {
//     if (pagination.hasPreviousPage) {
//       setPage((prev) => prev - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (pagination.hasNextPage) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   // ====================================================
//   // RENDER
//   // ====================================================

//   return (
//     <div className="container-fluid px-3 px-md-4 py-4">

//       {/* ==================================================
//           HEADER
//       ================================================== */}

//       <motion.div
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//         className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
//       >
//         <div>
//           <div className="d-flex align-items-center gap-3 mb-1">
//             <div
//               className="rounded-3 text-white d-flex align-items-center justify-content-center shadow"
//               style={{
//                 width: 48,
//                 height: 48,
//                 background:
//                   "linear-gradient(135deg, #8B3A1C 0%, #A81D52 50%, #9B0F6A 100%)",
//               }}
//             >
//               <FiUsers size={24} />
//             </div>

//             <div>
//               <h2 className="fw-bold mb-0 text-dark">Students Management</h2>
//               <p className="text-muted mb-0 small">
//                 Overview and quick details of registered students
//               </p>
//             </div>
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.97 }}
//           type="button"
//           className="btn btn-white border shadow-sm d-flex align-items-center justify-content-center gap-2 fw-semibold px-3 py-2 rounded-3"
//           onClick={handleRefresh}
//           disabled={loading}
//         >
//           <FiRefreshCw
//             size={16}
//             className={loading ? "spinner-border spinner-border-sm" : ""}
//           />
//           Refresh
//         </motion.button>
//       </motion.div>

//       {/* ==================================================
//           VIBRANT GRADIENT SUMMARY STATS CARDS
//       ================================================== */}

//       <div className="row g-3 mb-4">
//         {/* CARD 1 */}
//         <div className="col-12 col-md-4">
//           <motion.div
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ y: -6, scale: 1.02 }}
//             transition={{ duration: 0.3 }}
//             className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
//             style={{
//               background:
//                 "linear-gradient(135deg, #8B3A1C 0%, #A81D52 45%, #9B0F6A 100%)",
//             }}
//           >
//             <div className="card-body p-4 d-flex align-items-center gap-3">
//               <div
//                 className="rounded-circle d-flex align-items-center justify-content-center shadow"
//                 style={{
//                   width: 58,
//                   height: 58,
//                   background: "rgba(255, 255, 255, 0.22)",
//                   backdropFilter: "blur(10px)",
//                 }}
//               >
//                 <FiUsers size={28} className="text-white" />
//               </div>

//               <div>
//                 <div
//                   className="small fw-semibold text-uppercase"
//                   style={{
//                     color: "rgba(255, 255, 255, 0.85)",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   Total Students
//                 </div>
//                 <div className="fs-2 fw-bold text-white mb-0">
//                   {pagination.totalStudents}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* CARD 2 */}
//         <div className="col-12 col-md-4">
//           <motion.div
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ y: -6, scale: 1.02 }}
//             transition={{ duration: 0.3, delay: 0.05 }}
//             className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
//             style={{
//               background:
//                 "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
//             }}
//           >
//             <div className="card-body p-4 d-flex align-items-center gap-3">
//               <div
//                 className="rounded-circle d-flex align-items-center justify-content-center shadow"
//                 style={{
//                   width: 58,
//                   height: 58,
//                   background: "rgba(255, 255, 255, 0.22)",
//                   backdropFilter: "blur(10px)",
//                 }}
//               >
//                 <FiUserCheck size={28} className="text-white" />
//               </div>

//               <div>
//                 <div
//                   className="small fw-semibold text-uppercase"
//                   style={{
//                     color: "rgba(255, 255, 255, 0.85)",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   Current Page
//                 </div>
//                 <div className="fs-2 fw-bold text-white mb-0">
//                   {pagination.currentPage}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* CARD 3 */}
//         <div className="col-12 col-md-4">
//           <motion.div
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ y: -6, scale: 1.02 }}
//             transition={{ duration: 0.3, delay: 0.1 }}
//             className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
//             style={{
//               background:
//                 "linear-gradient(135deg, #701C46 0%, #5C1B5E 35%, #3F1B5C 70%, #B31238 100%)",
//             }}
//           >
//             <div className="card-body p-4 d-flex align-items-center gap-3">
//               <div
//                 className="rounded-circle d-flex align-items-center justify-content-center shadow"
//                 style={{
//                   width: 58,
//                   height: 58,
//                   background: "rgba(255, 255, 255, 0.22)",
//                   backdropFilter: "blur(10px)",
//                 }}
//               >
//                 <FiLayers size={28} className="text-white" />
//               </div>

//               <div>
//                 <div
//                   className="small fw-semibold text-uppercase"
//                   style={{
//                     color: "rgba(255, 255, 255, 0.85)",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   Total Pages
//                 </div>
//                 <div className="fs-2 fw-bold text-white mb-0">
//                   {pagination.totalPages || 0}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* ==================================================
//           FILTERS
//       ================================================== */}

//       <motion.div
//         initial={{ opacity: 0, y: 15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.45 }}
//         className="card border-0 shadow-sm mb-4 rounded-4"
//       >
//         <div className="card-body p-3 p-md-4">
//           <div className="row g-3">
//             {/* SEARCH */}
//             <div className="col-12 col-lg-8">
//               <label className="form-label fw-semibold small text-muted">
//                 Search Students
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-light border-end-0 rounded-start-3">
//                   <FiSearch className="text-muted" />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control bg-light border-start-0 rounded-end-3 py-2"
//                   placeholder="Search by name, email or phone..."
//                   value={search}
//                   onChange={handleSearchChange}
//                 />
//               </div>
//             </div>

//             {/* STATUS FILTER */}
//             <div className="col-12 col-lg-4">
//               <label className="form-label fw-semibold small text-muted">
//                 Status Filter
//               </label>
//               <select
//                 className="form-select bg-light rounded-3 py-2"
//                 value={status}
//                 onChange={handleStatusChange}
//               >
//                 <option value="">All Statuses</option>
//                 <option value="ACTIVE">Active</option>
//                 <option value="INACTIVE">Inactive</option>
//                 <option value="SUSPENDED">Suspended</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* ==================================================
//           ERROR ALERT
//       ================================================== */}

//       <AnimatePresence>
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="alert alert-danger shadow-sm d-flex justify-content-between align-items-center mb-4 rounded-3"
//           >
//             <span>{error}</span>
//             <button
//               type="button"
//               className="btn btn-sm btn-outline-danger"
//               onClick={loadStudents}
//             >
//               Retry
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ==================================================
//           TABLE CARD (FULL SHADOW + ALIGNMENTS & CENTERING)
//       ================================================== */}

//       <motion.div
//         initial={{ opacity: 0, y: 15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="card border-0 shadow-lg rounded-4 overflow-hidden"
//       >
//         {/* TABLE HEADER + EXPORT */}
//         <div className="card-header bg-white border-bottom py-3 px-4">
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
//             <div>
//               <h5 className="fw-bold mb-0 text-dark">Registered Students</h5>
//               <small className="text-muted">
//                 List of registered students in the system
//               </small>
//             </div>
//             <div className="d-flex flex-wrap align-items-center gap-2">
//               <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold">
//                 {students.length} Shown
//               </span>
//               <motion.button
//                 whileHover={{ scale: exporting ? 1 : 1.03 }}
//                 whileTap={{ scale: exporting ? 1 : 0.97 }}
//                 type="button"
//                 className="btn btn-success d-inline-flex align-items-center justify-content-center gap-2 fw-semibold rounded-3 px-3 py-2"
//                 onClick={handleExportExcel}
//                 disabled={exporting || loading}
//                 title="Download all students matching the current filters"
//               >
//                 {exporting ? (
//                   <span
//                     className="spinner-border spinner-border-sm"
//                     role="status"
//                     aria-hidden="true"
//                   />
//                 ) : (
//                   <FiDownload size={16} />
//                 )}
//                 {exporting ? "Preparing Excel..." : "Download Excel"}
//               </motion.button>
//             </div>
//           </div>
//         </div>

//         {/* TABLE BODY */}
//         <div className="card-body p-0">
//           {loading ? (
//             <div className="py-5 text-center">
//               <div
//                 className="spinner-border text-primary mb-3"
//                 role="status"
//               />
//               <div className="text-muted fw-medium">Loading students...</div>
//             </div>
//           ) : students.length === 0 ? (
//             <div className="py-5 text-center px-3">
//               <div
//                 className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
//                 style={{ width: 70, height: 70 }}
//               >
//                 <FiUsers size={32} className="text-muted" />
//               </div>
//               <h5 className="fw-semibold text-dark">No students found</h5>
//               <p className="text-muted mb-0 small">
//                 Try adjusting your search criteria or status filter.
//               </p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light border-bottom">
//                   <tr>
//                     <th
//                       className="ps-4 py-3 text-center text-secondary small fw-bold text-uppercase"
//                       style={{ letterSpacing: "0.5px" }}
//                     >
//                       Name
//                     </th>
//                     <th
//                       className="py-3 text-center text-secondary small fw-bold text-uppercase"
//                       style={{ letterSpacing: "0.5px" }}
//                     >
//                       Email
//                     </th>
//                     <th
//                       className="py-3 text-center text-secondary small fw-bold text-uppercase"
//                       style={{ letterSpacing: "0.5px" }}
//                     >
//                       Contact No.
//                     </th>
//                     <th
//                       className="py-3 text-center text-secondary small fw-bold text-uppercase"
//                       style={{ letterSpacing: "0.5px" }}
//                     >
//                       Registered
//                     </th>
//                     <th
//                       className="pe-4 py-3 text-center text-secondary small fw-bold text-uppercase"
//                       style={{ letterSpacing: "0.5px" }}
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map((student, index) => {
//                     return (
//                       <motion.tr
//                         key={student._id || index}
//                         initial={{ opacity: 0, y: 8 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.03 }}
//                       >
//                         {/* NAME COLUMN */}
//                         <td className="ps-4 py-3">
//                           <div className="d-flex align-items-center justify-content-start gap-3">
//                             <div
//                               className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
//                               style={{
//                                 width: 42,
//                                 height: 42,
//                                 flexShrink: 0,
//                                 background:
//                                   "linear-gradient(135deg, #8B3A1C 0%, #A81D52 100%)",
//                                 overflow: "hidden",
//                               }}
//                             >
//                               {student.profileImage ? (
//                                 <img
//                                   src={student.profileImage}
//                                   alt={student.name || "Student"}
//                                   className="rounded-circle w-100 h-100 object-fit-cover"
//                                 />
//                               ) : (
//                                 (
//                                   student.name?.charAt(0) || "S"
//                                 ).toUpperCase()
//                               )}
//                             </div>
//                             <span className="fw-semibold text-dark text-truncate">
//                               {student.name || "N/A"}
//                             </span>
//                           </div>
//                         </td>

//                         {/* EMAIL COLUMN */}
//                         <td className="py-3 text-center">
//                           <div className="d-inline-flex align-items-center justify-content-center gap-2 text-muted">
//                             <FiMail
//                               size={14}
//                               className="text-primary opacity-75"
//                             />
//                             <span
//                               className="small text-secondary fw-medium text-truncate"
//                               style={{ maxWidth: 220 }}
//                             >
//                               {student.email || "No email provided"}
//                             </span>
//                           </div>
//                         </td>

//                         {/* CONTACT NUMBER COLUMN */}
//                         <td className="py-3 text-center">
//                           <div className="d-inline-flex align-items-center justify-content-center gap-2">
//                             <FiPhone size={15} className="text-success" />
//                             <span className="small text-secondary fw-medium">
//                               {student.phone || "Not provided"}
//                             </span>
//                           </div>
//                         </td>

//                         {/* REGISTERED DATE + TIME COLUMN */}
//                         <td className="py-3 text-center">
//                           <div className="d-inline-flex align-items-center justify-content-center gap-2">
//                             <FiCalendar size={14} className="text-muted" />
//                             <span className="small text-secondary fw-medium">
//                               {formatDateTime(student.createdAt)}
//                             </span>
//                           </div>
//                         </td>

//                         {/* ACTION COLUMN */}
//                         <td className="pe-4 py-3 text-center">
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             type="button"
//                             className="btn btn-sm text-white border-0 rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
//                             style={{
//                               background:
//                                 "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
//                               boxShadow: "0 4px 12px rgba(233, 64, 87, 0.3)",
//                             }}
//                             onClick={() => handleOpenQuickView(student)}
//                           >
//                             <FiEye size={14} />
//                             View
//                           </motion.button>
//                         </td>
//                       </motion.tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* ==================================================
//             PAGINATION FOOTER
//         ================================================== */}

//         {!loading && students.length > 0 && (
//           <div className="card-footer bg-white border-top py-3 px-4">
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//               <div className="small text-muted">
//                 Showing <strong>{students.length}</strong> of{" "}
//                 <strong>{pagination.totalStudents}</strong> students
//               </div>

//               <div className="d-flex align-items-center gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 rounded-2"
//                   disabled={!pagination.hasPreviousPage}
//                   onClick={goToPreviousPage}
//                 >
//                   <FiChevronLeft />
//                   Previous
//                 </button>

//                 <span className="px-2 small fw-semibold text-secondary">
//                   Page {pagination.currentPage} of{" "}
//                   {pagination.totalPages || 1}
//                 </span>

//                 <button
//                   type="button"
//                   className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 rounded-2"
//                   disabled={!pagination.hasNextPage}
//                   onClick={goToNextPage}
//                 >
//                   Next
//                   <FiChevronRight />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </motion.div>

//       {/* ====================================================
//           CUSTOM POPUP MODAL
//       ==================================================== */}

//       <AnimatePresence>
//         {isModalOpen && selectedStudent && (
//           <div
//             className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//             style={{ zIndex: 1055 }}
//           >
//             {/* BACKDROP */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={handleCloseModal}
//               className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
//               style={{ backdropFilter: "blur(4px)" }}
//             />

//             {/* MODAL CARD */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{
//                 type: "spring",
//                 damping: 25,
//                 stiffness: 300,
//               }}
//               className="card border-0 position-relative w-100 rounded-4 overflow-hidden"
//               style={{
//                 maxWidth: 500,
//                 zIndex: 1060,
//                 boxShadow:
//                   "0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.1)",
//               }}
//             >
//               {/* MODAL HEADER */}
//               <div
//                 className="px-4 py-3 text-white d-flex justify-content-between align-items-center"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
//                 }}
//               >
//                 <div className="d-flex align-items-center gap-2">
//                   <FiUser size={18} />
//                   <h5 className="fw-bold mb-0">Student Details</h5>
//                 </div>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white opacity-75 opacity-100-hover"
//                   onClick={handleCloseModal}
//                   aria-label="Close"
//                 />
//               </div>

//               {/* MODAL BODY */}
//               <div className="card-body p-4 bg-white">
//                 {/* AVATAR & NAME */}
//                 <div className="text-center mb-4">
//                   <div
//                     className="rounded-circle text-white fw-bold d-inline-flex align-items-center justify-content-center mb-3"
//                     style={{
//                       width: 80,
//                       height: 80,
//                       fontSize: "2rem",
//                       background:
//                         "linear-gradient(135deg, #8B3A1C 0%, #A81D52 100%)",
//                       boxShadow: "0 8px 20px rgba(139, 58, 28, 0.3)",
//                       overflow: "hidden",
//                     }}
//                   >
//                     {selectedStudent.profileImage ? (
//                       <img
//                         src={selectedStudent.profileImage}
//                         alt={selectedStudent.name || "Student"}
//                         className="rounded-circle w-100 h-100 object-fit-cover"
//                       />
//                     ) : (
//                       (
//                         selectedStudent.name?.charAt(0) || "S"
//                       ).toUpperCase()
//                     )}
//                   </div>

//                   <h4 className="fw-bold text-dark mb-1">
//                     {selectedStudent.name || "N/A"}
//                   </h4>
//                   <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill text-uppercase fw-semibold tracking-wide">
//                     STUDENT
//                   </span>
//                 </div>

//                 {/* INFORMATION GRID */}
//                 <div className="bg-light rounded-4 p-3 p-md-4">
//                   <div className="row g-3">
//                     {/* EMAIL */}
//                     <div className="col-12 col-sm-6">
//                       <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
//                         <FiMail size={14} className="text-secondary" />
//                         <span>Email</span>
//                       </div>
//                       <div className="fw-bold text-dark text-break small">
//                         {selectedStudent.email || "N/A"}
//                       </div>
//                     </div>

//                     {/* CONTACT NO */}
//                     <div className="col-12 col-sm-6">
//                       <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
//                         <FiPhone size={14} className="text-secondary" />
//                         <span>Contact No.</span>
//                       </div>
//                       <div className="fw-bold text-dark small">
//                         {selectedStudent.phone || "N/A"}
//                       </div>
//                     </div>

//                     {/* EMAIL VERIFICATION */}
//                     <div className="col-12 col-sm-6">
//                       <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
//                         <FiCheckCircle size={14} className="text-secondary" />
//                         <span>Email Verification</span>
//                       </div>
//                       <div>
//                         {selectedStudent.isEmailVerified ? (
//                           <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-2 fw-semibold">
//                             Verified
//                           </span>
//                         ) : (
//                           <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1 rounded-2 fw-semibold">
//                             Unverified
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* ACCOUNT STATUS */}
//                     <div className="col-12 col-sm-6">
//                       <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
//                         <FiShield size={14} className="text-secondary" />
//                         <span>Account Status</span>
//                       </div>
//                       <div>
//                         {(() => {
//                           const statusInfo = getStudentStatus(selectedStudent);
//                           return (
//                             <span
//                               className={`badge ${statusInfo.className} px-2.5 py-1 rounded-2 fw-semibold d-inline-flex align-items-center gap-1`}
//                             >
//                               {statusInfo.icon}
//                               {statusInfo.text}
//                             </span>
//                           );
//                         })()}
//                       </div>
//                     </div>

//                     {/* REGISTERED DATE & TIME */}
//                     <div className="col-12">
//                       <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
//                         <FiCalendar size={14} className="text-secondary" />
//                         <span>Registered Date & Time</span>
//                       </div>
//                       <div className="fw-bold text-dark small">
//                         {formatDateTime(selectedStudent.createdAt)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* MODAL FOOTER */}
//               <div className="card-footer bg-white border-top-0 p-3 d-flex justify-content-end">
//                 <button
//                   type="button"
//                   className="btn btn-light px-4 fw-semibold rounded-3"
//                   onClick={handleCloseModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }


import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiUsers, FiSearch, FiEye, FiMail, FiPhone,
  FiCheckCircle, FiXCircle, FiShield, FiChevronLeft, FiChevronRight,
  FiUserCheck, FiCalendar, FiUser, FiLayers, FiDownload, FiTrash2,
  FiFilter, FiX, FiAlertTriangle,
} from "react-icons/fi";
import {
  getAdminStudents,
  getAdminStudentById,
  deleteAdminStudent,
  deleteAllAdminStudents,
} from "../../../services/adminStudentService";

const PAGE_SIZE = 10;
const HIDDEN_KEYS = new Set([
  "password", "passwordhash", "otp", "emailotp", "resettoken",
  "refreshtoken", "accesstoken", "token", "__v",
]);

const titleCase = (value = "") =>
  String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.map(displayValue).join(", ") : "Not provided";
  if (typeof value === "object") return Object.entries(value)
    .filter(([key]) => !HIDDEN_KEYS.has(key.toLowerCase()))
    .map(([key, val]) => `${titleCase(key)}: ${displayValue(val)}`)
    .join(" | ") || "Not provided";
  return String(value);
};

const formatDateTime = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not provided" : date.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const getStudentStatus = (student) => {
  if (student?.isSuspended) return "Suspended";
  if (student?.isActive === false) return "Inactive";
  return "Active";
};

const getAddress = (student) => {
  const address = student?.address;
  if (!address) return "Not provided";
  if (typeof address === "string") return address;
  return ["street", "addressLine1", "addressLine2", "city", "state", "country", "postalCode", "zipCode"]
    .map((key) => address[key])
    .filter(Boolean)
    .join(", ") || displayValue(address);
};

const getField = (student, ...keys) => {
  for (const key of keys) {
    const value = student?.[key] ?? student?.profile?.[key] ?? student?.academicDetails?.[key] ??
      student?.registration?.[key] ?? student?.registrationDetails?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

function Detail({ label, value }) {
  return (
    <div className="col-12 col-sm-6">
      <div className="small text-muted fw-semibold mb-1">{label}</div>
      <div className="text-dark fw-semibold text-break">{displayValue(value)}</div>
    </div>
  );
}

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1, limit: PAGE_SIZE, totalStudents: 0, totalPages: 0,
    hasNextPage: false, hasPreviousPage: false,
  });
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [deletingAll, setDeletingAll] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [studentCategory, setStudentCategory] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [courseName, setCourseName] = useState("");
  const [branch, setBranch] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Custom Confirmation Modal States
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: "", // "single" or "all"
    targetData: null,
    inputValue: "",
  });

  const filters = useMemo(() => ({
    page, limit: PAGE_SIZE, search: search.trim(), status,
    studentCategory, educationLevel, courseName, branch, collegeName,
  }), [page, search, status, studentCategory, educationLevel, courseName, branch, collegeName]);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminStudents(filters);
      if (!response?.success) throw new Error(response?.message || "Unable to fetch students.");
      const data = response.data || {};
      setStudents(Array.isArray(data.students) ? data.students : []);
      setPagination(data.pagination || {
        currentPage: page, limit: PAGE_SIZE, totalStudents: 0, totalPages: 0,
        hasNextPage: false, hasPreviousPage: false,
      });
      setSummary(data.summary || {});
    } catch (err) {
      console.error("STUDENT LIST ERROR:", err);
      setError(err?.response?.data?.message || err?.message || "Unable to load students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const resetPageAndSet = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
    setSuccess("");
  };

  const openStudent = async (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
    if (!student?._id) return;
    try {
      const response = await getAdminStudentById(student._id);
      if (response?.success && response.data) setSelectedStudent(response.data.student || response.data);
    } catch (err) {
      console.error("STUDENT DETAIL ERROR:", err);
    }
  };

  const executeDeleteStudent = async (student) => {
    const id = student?._id;
    if (!id) return setError("Student ID is missing. Cannot delete this record.");
    try {
      setDeletingId(id);
      setError("");
      setSuccess("");
      const response = await deleteAdminStudent(id);
      if (response?.success === false) throw new Error(response.message || "Delete failed.");
      setSuccess("Student deleted successfully.");
      setModalOpen(false);
      setSelectedStudent(null);
      if (students.length === 1 && page > 1) setPage((current) => current - 1);
      else await loadStudents();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to delete student.");
    } finally {
      setDeletingId("");
      setConfirmModal({ show: false, type: "", targetData: null, inputValue: "" });
    }
  };

  const executeDeleteAll = async () => {
    try {
      setDeletingAll(true);
      setError("");
      setSuccess("");
      const response = await deleteAllAdminStudents();
      if (response?.success === false) throw new Error(response.message || "Delete all failed.");
      setPage(1);
      setSearch("");
      setStatus("");
      setStudentCategory("");
      setEducationLevel("");
      setCourseName("");
      setBranch("");
      setCollegeName("");
      setModalOpen(false);
      setSelectedStudent(null);
      setSuccess("All student records deleted successfully.");
      setStudents([]);
      setPagination({ currentPage: 1, limit: PAGE_SIZE, totalStudents: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false });
      setSummary({});
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to delete all students.");
    } finally {
      setDeletingAll(false);
      setConfirmModal({ show: false, type: "", targetData: null, inputValue: "" });
    }
  };

  const csvEscape = (value) => {
    let text = value === null || value === undefined ? "" : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setError("");
      const first = await getAdminStudents({ ...filters, page: 1, limit: 100 });
      if (!first?.success) throw new Error(first?.message || "Unable to export students.");
      const all = [...(first.data?.students || [])];
      const pages = Number(first.data?.pagination?.totalPages || 1);
      for (let current = 2; current <= pages; current += 1) {
        const next = await getAdminStudents({ ...filters, page: current, limit: 100 });
        if (!next?.success) throw new Error(next?.message || `Unable to export page ${current}.`);
        all.push(...(next.data?.students || []));
      }
      if (!all.length) return setError("No students found for the selected filters.");
      const headers = [
        "Student ID", "Name", "Email", "Phone", "Role", "Student Category",
        "Education Level", "Course Name", "Branch / Specialization", "College Name",
        "Street", "City", "State", "Country", "Postal Code", "Full Address",
        "Email Verified", "Active", "Suspended", "Last Login", "Registered At", "Updated At",
      ];
      const rows = all.map((s) => {
        const a = s.address || {};
        return [
          s._id, s.name, s.email, s.phone, s.role,
          getField(s, "studentCategory"), getField(s, "educationLevel"),
          getField(s, "courseName"), getField(s, "branch", "specialization"),
          getField(s, "collegeName"), a.street || a.addressLine1, a.city, a.state,
          a.country, a.postalCode || a.zipCode, getAddress(s),
          s.isEmailVerified ? "Yes" : "No", s.isActive === false ? "No" : "Yes",
          s.isSuspended ? "Yes" : "No", formatDateTime(s.lastLogin),
          formatDateTime(s.createdAt), formatDateTime(s.updatedAt),
        ];
      });
      const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
      const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Registered_Students_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to export students.");
    } finally {
      setExporting(false);
    }
  };

  const courseOptions = summary.courseWiseCounts || summary.courses || [];
  const branchOptions = summary.specializationWiseCounts || summary.branches || [];
  const courses = courseOptions.map((item) => typeof item === "string" ? item : item?._id || item?.name).filter(Boolean);
  const branches = branchOptions.map((item) => typeof item === "string" ? item : item?._id || item?.name).filter(Boolean);

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 text-white d-flex align-items-center justify-content-center shadow"
            style={{ width: 48, height: 48, background: "linear-gradient(135deg,#8B3A1C,#A81D52,#9B0F6A)" }}>
            <FiUsers size={24} />
          </div>
          <div>
            <h2 className="fw-bold mb-0">Students Management</h2>
            <p className="text-muted small mb-0">Registered student details, filters and account actions</p>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-danger d-flex align-items-center gap-2" 
            onClick={() => setConfirmModal({ show: true, type: "all", targetData: null, inputValue: "" })} 
            disabled={deletingAll || loading || !pagination.totalStudents}>
            <FiTrash2 /> {deletingAll ? "Deleting..." : "Delete All Students"}
          </button>
        </div>
      </motion.div>

      {error && <div className="alert alert-danger d-flex justify-content-between align-items-center">{error}<button className="btn btn-sm btn-outline-danger" onClick={() => setError("")}><FiX /></button></div>}
      {success && <div className="alert alert-success d-flex justify-content-between align-items-center">{success}<button className="btn btn-sm btn-outline-success" onClick={() => setSuccess("")}><FiX /></button></div>}

      <div className="row g-3 mb-4">
        {[
          ["Total Students", summary.totalStudents ?? pagination.totalStudents, FiUsers],
          ["IT Students", summary.itStudents ?? summary.IT ?? "—", FiLayers],
          ["NON-IT Students", summary.nonItStudents ?? summary.NON_IT ?? "—", FiUserCheck],
          ["Undergraduate", summary.undergraduateStudents ?? "—", FiUsers],
          ["Postgraduate", summary.postgraduateStudents ?? "—", FiUsers],
        ].map(([label, value, Icon]) => (
          <div className="col-12 col-sm-6 col-xl" key={label}>
            <div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle bg-light p-3"><Icon size={22} /></div>
              <div><div className="small text-muted fw-semibold">{label}</div><div className="fs-4 fw-bold">{value}</div></div>
            </div></div>
          </div>
        ))}
      </div>

      {/* Perfectly Aligned Filters Section */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center gap-2 mb-3 fw-bold"><FiFilter /> Filter Registered Students</div>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-6 col-xl-4">
              <label className="form-label small fw-semibold">Search</label>
              <div className="input-group"><span className="input-group-text"><FiSearch /></span>
                <input className="form-control" value={search} onChange={resetPageAndSet(setSearch)} placeholder="Name, email or phone" />
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-2">
              <label className="form-label small fw-semibold">Student Type</label>
              <select className="form-select" value={studentCategory} onChange={resetPageAndSet(setStudentCategory)}>
                <option value="">All</option><option value="IT">IT</option><option value="NON_IT">NON-IT</option>
              </select>
            </div>
            <div className="col-12 col-md-6 col-xl-2">
              <label className="form-label small fw-semibold">Education</label>
              <select className="form-select" value={educationLevel} onChange={resetPageAndSet(setEducationLevel)}>
                <option value="">All Education</option><option value="UNDERGRADUATE">Undergraduate</option><option value="POSTGRADUATE">Postgraduate</option>
              </select>
            </div>
            <div className="col-12 col-md-6 col-xl-2">
              <label className="form-label small fw-semibold">Course</label>
              <select className="form-select" value={courseName} onChange={resetPageAndSet(setCourseName)}>
                <option value="">All Courses</option>{courses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6 col-xl-2">
              <label className="form-label small fw-semibold">Specialization / Branch</label>
              <select className="form-select" value={branch} onChange={resetPageAndSet(setBranch)}>
                <option value="">All</option>{branches.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label small fw-semibold">College Name</label>
              <input className="form-control" value={collegeName} onChange={resetPageAndSet(setCollegeName)} placeholder="Filter by college" />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label small fw-semibold">Account Status</label>
              <select className="form-select" value={status} onChange={resetPageAndSet(setStatus)}>
                <option value="">All Statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Properly Aligned Data Table */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div><h5 className="fw-bold mb-0">Registered Students</h5><small className="text-muted">{students.length} shown / {pagination.totalStudents || 0} matching records</small></div>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleExport} disabled={exporting || loading}>
            <FiDownload /> {exporting ? "Preparing..." : "Download Excel"}
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {["Student", "Email", "Phone", "IT / NON-IT", "Course", "Specialization", "College", "Registered", "Status", "Actions"].map((heading) =>
                  <th className="small text-nowrap py-3 px-3" key={heading}>{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="10" className="text-center py-5"><span className="spinner-border spinner-border-sm me-2" />Loading students...</td></tr>
                : students.length === 0 ? <tr><td colSpan="10" className="text-center text-muted py-5">No students found for the selected filters.</td></tr>
                : students.map((student) => (
                  <tr key={student._id}>
                    <td className="text-nowrap px-3">
                      <div className="d-flex align-items-center gap-2">
                        {student.profileImage ? <img src={student.profileImage} alt="" className="rounded-circle" style={{ width: 36, height: 36, objectFit: "cover" }} />
                          : <span className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36 }}>{(student.name || "S").charAt(0).toUpperCase()}</span>}
                        <span className="fw-semibold">{student.name || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-3">{student.email || "—"}</td>
                    <td className="px-3">{student.phone || "—"}</td>
                    <td className="px-3">{getField(student, "studentCategory") || "—"}</td>
                    <td className="px-3">{getField(student, "courseName") || "—"}</td>
                    <td className="px-3">{getField(student, "branch", "specialization") || "—"}</td>
                    <td className="px-3">{getField(student, "collegeName") || "—"}</td>
                    <td className="text-nowrap px-3">{formatDateTime(student.createdAt)}</td>
                    <td className="px-3">
                      <span className={`badge ${getStudentStatus(student) === "Active" ? "bg-success-subtle text-success" : getStudentStatus(student) === "Suspended" ? "bg-danger-subtle text-danger" : "bg-secondary-subtle text-secondary"}`}>
                        {getStudentStatus(student)}
                      </span>
                    </td>
                    <td className="px-3">
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" title="View all details" onClick={() => openStudent(student)}><FiEye /></button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete student" disabled={deletingId === student._id} onClick={() => setConfirmModal({ show: true, type: "single", targetData: student, inputValue: "" })}>
                          {deletingId === student._id ? <span className="spinner-border spinner-border-sm" /> : <FiTrash2 />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
          <small className="text-muted">Page {pagination.currentPage || page} of {pagination.totalPages || 1} · Total {pagination.totalStudents || 0}</small>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary" disabled={!pagination.hasPreviousPage || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}><FiChevronLeft /> Previous</button>
            <button className="btn btn-sm btn-outline-secondary" disabled={!pagination.hasNextPage || loading} onClick={() => setPage((p) => p + 1)}>Next <FiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      <AnimatePresence>
        {modalOpen && selectedStudent && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1060, background: "rgba(0,0,0,.55)" }} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
            <motion.div initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="card border-0 rounded-4 shadow-lg w-100" style={{ maxWidth: 850, maxHeight: "90vh", overflow: "auto" }}>
              <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg,#8A2387,#E94057,#F27121)" }}>
                <div className="d-flex align-items-center gap-2"><FiUser /><strong>Complete Student Registration Details</strong></div>
                <button className="btn btn-sm btn-light" onClick={() => setModalOpen(false)}><FiX /></button>
              </div>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  {selectedStudent.profileImage ? <img src={selectedStudent.profileImage} alt="" className="rounded-circle" style={{ width: 68, height: 68, objectFit: "cover" }} />
                    : <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: 68, height: 68 }}>{(selectedStudent.name || "S").charAt(0).toUpperCase()}</div>}
                  <div><h4 className="fw-bold mb-1">{selectedStudent.name || "N/A"}</h4><div className="text-muted small">{selectedStudent.email || "No email"} · {selectedStudent.phone || "No phone"}</div></div>
                </div>
                <h6 className="fw-bold border-bottom pb-2">Registration / Personal Details</h6>
                <div className="row g-3 mb-4">
                  <Detail label="Full Name" value={selectedStudent.name} />
                  <Detail label="Email" value={selectedStudent.email} />
                  <Detail label="Phone" value={selectedStudent.phone} />
                  <Detail label="Role" value={selectedStudent.role} />
                  <Detail label="Student Category" value={getField(selectedStudent, "studentCategory")} />
                  <Detail label="Education Level" value={getField(selectedStudent, "educationLevel")} />
                  <Detail label="Course Name" value={getField(selectedStudent, "courseName")} />
                  <Detail label="Branch / Specialization" value={getField(selectedStudent, "branch", "specialization")} />
                  <Detail label="College Name" value={getField(selectedStudent, "collegeName")} />
                  <Detail label="Address" value={getAddress(selectedStudent)} />
                  <Detail label="Street" value={selectedStudent.address?.street || selectedStudent.address?.addressLine1} />
                  <Detail label="City" value={selectedStudent.address?.city} />
                  <Detail label="State" value={selectedStudent.address?.state} />
                  <Detail label="Country" value={selectedStudent.address?.country} />
                  <Detail label="Postal Code" value={selectedStudent.address?.postalCode || selectedStudent.address?.zipCode} />
                </div>
                <h6 className="fw-bold border-bottom pb-2">Account / System Details</h6>
                <div className="row g-3 mb-4">
                  <Detail label="Email Verified" value={selectedStudent.isEmailVerified} />
                  <Detail label="Account Active" value={selectedStudent.isActive} />
                  <Detail label="Suspended" value={selectedStudent.isSuspended} />
                  <Detail label="Account Status" value={getStudentStatus(selectedStudent)} />
                  <Detail label="Last Login" value={formatDateTime(selectedStudent.lastLogin)} />
                  <Detail label="Registered At" value={formatDateTime(selectedStudent.createdAt)} />
                  <Detail label="Last Updated" value={formatDateTime(selectedStudent.updatedAt)} />
                  <Detail label="Student ID" value={selectedStudent._id} />
                </div>
                <h6 className="fw-bold border-bottom pb-2">Other Registration Fields</h6>
                <div className="row g-3">
                  {["profile", "academicDetails", "registration", "registrationDetails"].flatMap((group) =>
                    selectedStudent[group] && typeof selectedStudent[group] === "object" && !Array.isArray(selectedStudent[group])
                      ? Object.entries(selectedStudent[group]).map(([key, value]) => [`${group}.${key}`, value])
                      : []
                  ).concat(Object.entries(selectedStudent))
                    .filter(([key, value]) => !HIDDEN_KEYS.has(key.split(".").pop().toLowerCase()) &&
                      !["_id", "name", "email", "phone", "role", "studentCategory", "educationLevel", "courseName", "branch", "specialization", "collegeName", "address", "profileImage", "isEmailVerified", "isActive", "isSuspended", "lastLogin", "createdAt", "updatedAt"].includes(key) &&
                      value !== null && value !== undefined && typeof value !== "function")
                    .map(([key, value]) => <Detail key={key} label={titleCase(key)} value={value} />)}
                </div>
              </div>
              <div className="card-footer bg-white d-flex justify-content-between">
                <button className="btn btn-outline-danger" onClick={() => { setModalOpen(false); setConfirmModal({ show: true, type: "single", targetData: selectedStudent, inputValue: "" }); }} disabled={deletingId === selectedStudent._id}>
                  <FiTrash2 className="me-1" /> Delete Student
                </button>
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Animated Deletion Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1070, background: "rgba(0,0,0,.6)" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card border-0 rounded-4 shadow-lg w-100" style={{ maxWidth: 450 }}>
              <div className="card-body p-4 text-center">
                <div className="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                  <FiAlertTriangle size={28} />
                </div>
                <h4 className="fw-bold mb-2">Confirm Permanent Deletion</h4>
                <p className="text-muted small mb-4">
                  {confirmModal.type === "single"
                    ? `Are you sure you want to permanently delete ${confirmModal.targetData?.name || "this student"}? This action cannot be undone.`
                    : `This will permanently delete ALL ${pagination.totalStudents || 0} student records. Type "DELETE ALL STUDENTS" below to confirm.`}
                </p>

                {confirmModal.type === "all" && (
                  <input
                    type="text"
                    className="form-control mb-4 text-center"
                    placeholder="Type DELETE ALL STUDENTS"
                    value={confirmModal.inputValue}
                    onChange={(e) => setConfirmModal({ ...confirmModal, inputValue: e.target.value })}
                  />
                )}

                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-outline-secondary px-4" onClick={() => setConfirmModal({ show: false, type: "", targetData: null, inputValue: "" })}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    disabled={confirmModal.type === "all" && confirmModal.inputValue !== "DELETE ALL STUDENTS"}
                    onClick={() => {
                      if (confirmModal.type === "single") {
                        executeDeleteStudent(confirmModal.targetData);
                      } else {
                        executeDeleteAll();
                      }
                    }}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}