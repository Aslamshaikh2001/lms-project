
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
//         {/* TABLE HEADER */}
//         <div className="card-header bg-white border-bottom py-3 px-4">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h5 className="fw-bold mb-0 text-dark">Registered Students</h5>
//               <small className="text-muted">
//                 List of registered students in the system
//               </small>
//             </div>
//             <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold">
//               {students.length} Shown
//             </span>
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





import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiUserCheck,
  FiX,
  FiCalendar,
  FiUser,
  FiLayers,
  FiDownload,
} from "react-icons/fi";

import { getAdminStudents } from "../../../services/adminStudentService";
import { useNavigate } from "react-router-dom";


export default function StudentManagement() {
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalStudents: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ====================================================
  // QUICK VIEW CUSTOM MODAL STATE
  // ====================================================

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ====================================================
  // LOAD STUDENTS
  // ====================================================

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminStudents({
        page,
        limit,
        search,
        status,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to fetch students."
        );
      }

      const data = response.data || {};

      setStudents(data.students || []);

      setPagination(
        data.pagination || {
          currentPage: page,
          limit,
          totalStudents: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      console.error("STUDENT LIST ERROR:", err);

      setStudents([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // ====================================================
  // HANDLERS
  // ====================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleRefresh = () => {
    loadStudents();
  };

  // ====================================================
  // EXPORT ALL FILTERED STUDENTS TO EXCEL-COMPATIBLE CSV
  // ====================================================

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      setError("");

      // Fetch every page using the same search and status filters.
      const firstResponse = await getAdminStudents({
        page: 1,
        limit,
        search: search.trim(),
        status,
      });

      if (!firstResponse?.success) {
        throw new Error(
          firstResponse?.message || "Unable to fetch students for export."
        );
      }

      const firstData = firstResponse.data || {};
      const allStudents = [...(firstData.students || [])];
      const totalPages = Number(
        firstData.pagination?.totalPages ??
          Math.ceil((firstData.pagination?.totalStudents || allStudents.length) / limit)
      );

      for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
        const response = await getAdminStudents({
          page: currentPage,
          limit,
          search: search.trim(),
          status,
        });

        if (!response?.success) {
          throw new Error(
            response?.message || `Unable to fetch students from page ${currentPage}.`
          );
        }

        allStudents.push(...(response.data?.students || []));
      }

      if (allStudents.length === 0) {
        setError("No students found to export for the selected filters.");
        return;
      }

      const escapeCsvValue = (value) => {
        const text = value === null || value === undefined ? "" : String(value);
        // Prevent spreadsheet formula execution for values starting with formula characters.
        const safeText = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
        return `"${safeText.replace(/"/g, '""')}"`;
      };

      const headers = [
        "Sr. No.",
        "Student ID",
        "Student Name",
        "Email",
        "Phone",
        "Registration Date & Time",
        "Email Verified",
        "Account Status",
        "Suspended",
      ];

      const rows = allStudents.map((student, index) => {
        const accountStatus = student.isSuspended
          ? "Suspended"
          : !student.isActive
            ? "Inactive"
            : "Active";

        return [
          index + 1,
          student._id || student.id || "",
          student.name || "",
          student.email || "",
          student.phone || "",
          student.createdAt ? formatDateTime(student.createdAt) : "",
          student.isEmailVerified ? "Yes" : "No",
          accountStatus,
          student.isSuspended ? "Yes" : "No",
        ];
      });

      // UTF-8 BOM helps Excel open the CSV with the correct encoding.
      const csvContent = [headers, ...rows]
        .map((row) => row.map(escapeCsvValue).join(","))
        .join("\r\n");
      const blob = new Blob(["\uFEFF", csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);

      link.href = downloadUrl;
      link.download = `SVR_Registered_Students_${date}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("STUDENT EXPORT ERROR:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to export students. Please try again."
      );
    } finally {
      setExporting(false);
    }
  };

  const handleOpenQuickView = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStudent(null), 200);
  };

  // ====================================================
  // HELPERS
  // ====================================================

  const getStudentStatus = (student) => {
    if (student.isSuspended) {
      return {
        text: "Suspended",
        className: "bg-danger-subtle text-danger border border-danger-subtle",
        icon: <FiShield size={13} />,
      };
    }

    if (!student.isActive) {
      return {
        text: "Inactive",
        className:
          "bg-secondary-subtle text-secondary border border-secondary-subtle",
        icon: <FiXCircle size={13} />,
      };
    }

    return {
      text: "Active",
      className: "bg-success-subtle text-success border border-success-subtle",
      icon: <FiCheckCircle size={13} />,
    };
  };

  // ====================================================
  // DATE + TIME FORMAT
  // ====================================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ====================================================
  // PAGINATION
  // ====================================================

  const goToPreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="container-fluid px-3 px-md-4 py-4">

      {/* ==================================================
          HEADER
      ================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
      >
        <div>
          <div className="d-flex align-items-center gap-3 mb-1">
            <div
              className="rounded-3 text-white d-flex align-items-center justify-content-center shadow"
              style={{
                width: 48,
                height: 48,
                background:
                  "linear-gradient(135deg, #8B3A1C 0%, #A81D52 50%, #9B0F6A 100%)",
              }}
            >
              <FiUsers size={24} />
            </div>

            <div>
              <h2 className="fw-bold mb-0 text-dark">Students Management</h2>
              <p className="text-muted mb-0 small">
                Overview and quick details of registered students
              </p>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="btn btn-white border shadow-sm d-flex align-items-center justify-content-center gap-2 fw-semibold px-3 py-2 rounded-3"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw
            size={16}
            className={loading ? "spinner-border spinner-border-sm" : ""}
          />
          Refresh
        </motion.button>
      </motion.div>

      {/* ==================================================
          VIBRANT GRADIENT SUMMARY STATS CARDS
      ================================================== */}

      <div className="row g-3 mb-4">
        {/* CARD 1 */}
        <div className="col-12 col-md-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
            style={{
              background:
                "linear-gradient(135deg, #8B3A1C 0%, #A81D52 45%, #9B0F6A 100%)",
            }}
          >
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 58,
                  height: 58,
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FiUsers size={28} className="text-white" />
              </div>

              <div>
                <div
                  className="small fw-semibold text-uppercase"
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Students
                </div>
                <div className="fs-2 fw-bold text-white mb-0">
                  {pagination.totalStudents}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CARD 2 */}
        <div className="col-12 col-md-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
            style={{
              background:
                "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
            }}
          >
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 58,
                  height: 58,
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FiUserCheck size={28} className="text-white" />
              </div>

              <div>
                <div
                  className="small fw-semibold text-uppercase"
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Current Page
                </div>
                <div className="fs-2 fw-bold text-white mb-0">
                  {pagination.currentPage}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CARD 3 */}
        <div className="col-12 col-md-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
            style={{
              background:
                "linear-gradient(135deg, #701C46 0%, #5C1B5E 35%, #3F1B5C 70%, #B31238 100%)",
            }}
          >
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 58,
                  height: 58,
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FiLayers size={28} className="text-white" />
              </div>

              <div>
                <div
                  className="small fw-semibold text-uppercase"
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Pages
                </div>
                <div className="fs-2 fw-bold text-white mb-0">
                  {pagination.totalPages || 0}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="card border-0 shadow-sm mb-4 rounded-4"
      >
        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            {/* SEARCH */}
            <div className="col-12 col-lg-8">
              <label className="form-label fw-semibold small text-muted">
                Search Students
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 rounded-start-3">
                  <FiSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0 rounded-end-3 py-2"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* STATUS FILTER */}
            <div className="col-12 col-lg-4">
              <label className="form-label fw-semibold small text-muted">
                Status Filter
              </label>
              <select
                className="form-select bg-light rounded-3 py-2"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ==================================================
          ERROR ALERT
      ================================================== */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="alert alert-danger shadow-sm d-flex justify-content-between align-items-center mb-4 rounded-3"
          >
            <span>{error}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={loadStudents}
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================
          TABLE CARD (FULL SHADOW + ALIGNMENTS & CENTERING)
      ================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
      >
        {/* TABLE HEADER + EXPORT */}
        <div className="card-header bg-white border-bottom py-3 px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-0 text-dark">Registered Students</h5>
              <small className="text-muted">
                List of registered students in the system
              </small>
            </div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold">
                {students.length} Shown
              </span>
              <motion.button
                whileHover={{ scale: exporting ? 1 : 1.03 }}
                whileTap={{ scale: exporting ? 1 : 0.97 }}
                type="button"
                className="btn btn-success d-inline-flex align-items-center justify-content-center gap-2 fw-semibold rounded-3 px-3 py-2"
                onClick={handleExportExcel}
                disabled={exporting || loading}
                title="Download all students matching the current filters"
              >
                {exporting ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <FiDownload size={16} />
                )}
                {exporting ? "Preparing Excel..." : "Download Excel"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5 text-center">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
              />
              <div className="text-muted fw-medium">Loading students...</div>
            </div>
          ) : students.length === 0 ? (
            <div className="py-5 text-center px-3">
              <div
                className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 70, height: 70 }}
              >
                <FiUsers size={32} className="text-muted" />
              </div>
              <h5 className="fw-semibold text-dark">No students found</h5>
              <p className="text-muted mb-0 small">
                Try adjusting your search criteria or status filter.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th
                      className="ps-4 py-3 text-center text-secondary small fw-bold text-uppercase"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Name
                    </th>
                    <th
                      className="py-3 text-center text-secondary small fw-bold text-uppercase"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Email
                    </th>
                    <th
                      className="py-3 text-center text-secondary small fw-bold text-uppercase"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Contact No.
                    </th>
                    <th
                      className="py-3 text-center text-secondary small fw-bold text-uppercase"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Registered
                    </th>
                    <th
                      className="pe-4 py-3 text-center text-secondary small fw-bold text-uppercase"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    return (
                      <motion.tr
                        key={student._id || index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        {/* NAME COLUMN */}
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center justify-content-start gap-3">
                            <div
                              className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                              style={{
                                width: 42,
                                height: 42,
                                flexShrink: 0,
                                background:
                                  "linear-gradient(135deg, #8B3A1C 0%, #A81D52 100%)",
                                overflow: "hidden",
                              }}
                            >
                              {student.profileImage ? (
                                <img
                                  src={student.profileImage}
                                  alt={student.name || "Student"}
                                  className="rounded-circle w-100 h-100 object-fit-cover"
                                />
                              ) : (
                                (
                                  student.name?.charAt(0) || "S"
                                ).toUpperCase()
                              )}
                            </div>
                            <span className="fw-semibold text-dark text-truncate">
                              {student.name || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* EMAIL COLUMN */}
                        <td className="py-3 text-center">
                          <div className="d-inline-flex align-items-center justify-content-center gap-2 text-muted">
                            <FiMail
                              size={14}
                              className="text-primary opacity-75"
                            />
                            <span
                              className="small text-secondary fw-medium text-truncate"
                              style={{ maxWidth: 220 }}
                            >
                              {student.email || "No email provided"}
                            </span>
                          </div>
                        </td>

                        {/* CONTACT NUMBER COLUMN */}
                        <td className="py-3 text-center">
                          <div className="d-inline-flex align-items-center justify-content-center gap-2">
                            <FiPhone size={15} className="text-success" />
                            <span className="small text-secondary fw-medium">
                              {student.phone || "Not provided"}
                            </span>
                          </div>
                        </td>

                        {/* REGISTERED DATE + TIME COLUMN */}
                        <td className="py-3 text-center">
                          <div className="d-inline-flex align-items-center justify-content-center gap-2">
                            <FiCalendar size={14} className="text-muted" />
                            <span className="small text-secondary fw-medium">
                              {formatDateTime(student.createdAt)}
                            </span>
                          </div>
                        </td>

                        {/* ACTION COLUMN */}
                        <td className="pe-4 py-3 text-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="btn btn-sm text-white border-0 rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
                            style={{
                              background:
                                "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
                              boxShadow: "0 4px 12px rgba(233, 64, 87, 0.3)",
                            }}
                            onClick={() => handleOpenQuickView(student)}
                          >
                            <FiEye size={14} />
                            View
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ==================================================
            PAGINATION FOOTER
        ================================================== */}

        {!loading && students.length > 0 && (
          <div className="card-footer bg-white border-top py-3 px-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div className="small text-muted">
                Showing <strong>{students.length}</strong> of{" "}
                <strong>{pagination.totalStudents}</strong> students
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 rounded-2"
                  disabled={!pagination.hasPreviousPage}
                  onClick={goToPreviousPage}
                >
                  <FiChevronLeft />
                  Previous
                </button>

                <span className="px-2 small fw-semibold text-secondary">
                  Page {pagination.currentPage} of{" "}
                  {pagination.totalPages || 1}
                </span>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 rounded-2"
                  disabled={!pagination.hasNextPage}
                  onClick={goToNextPage}
                >
                  Next
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ====================================================
          CUSTOM POPUP MODAL
      ==================================================== */}

      <AnimatePresence>
        {isModalOpen && selectedStudent && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ zIndex: 1055 }}
          >
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ backdropFilter: "blur(4px)" }}
            />

            {/* MODAL CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="card border-0 position-relative w-100 rounded-4 overflow-hidden"
              style={{
                maxWidth: 500,
                zIndex: 1060,
                boxShadow:
                  "0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* MODAL HEADER */}
              <div
                className="px-4 py-3 text-white d-flex justify-content-between align-items-center"
                style={{
                  background:
                    "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FiUser size={18} />
                  <h5 className="fw-bold mb-0">Student Details</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white opacity-75 opacity-100-hover"
                  onClick={handleCloseModal}
                  aria-label="Close"
                />
              </div>

              {/* MODAL BODY */}
              <div className="card-body p-4 bg-white">
                {/* AVATAR & NAME */}
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle text-white fw-bold d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: 80,
                      height: 80,
                      fontSize: "2rem",
                      background:
                        "linear-gradient(135deg, #8B3A1C 0%, #A81D52 100%)",
                      boxShadow: "0 8px 20px rgba(139, 58, 28, 0.3)",
                      overflow: "hidden",
                    }}
                  >
                    {selectedStudent.profileImage ? (
                      <img
                        src={selectedStudent.profileImage}
                        alt={selectedStudent.name || "Student"}
                        className="rounded-circle w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      (
                        selectedStudent.name?.charAt(0) || "S"
                      ).toUpperCase()
                    )}
                  </div>

                  <h4 className="fw-bold text-dark mb-1">
                    {selectedStudent.name || "N/A"}
                  </h4>
                  <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill text-uppercase fw-semibold tracking-wide">
                    STUDENT
                  </span>
                </div>

                {/* INFORMATION GRID */}
                <div className="bg-light rounded-4 p-3 p-md-4">
                  <div className="row g-3">
                    {/* EMAIL */}
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
                        <FiMail size={14} className="text-secondary" />
                        <span>Email</span>
                      </div>
                      <div className="fw-bold text-dark text-break small">
                        {selectedStudent.email || "N/A"}
                      </div>
                    </div>

                    {/* CONTACT NO */}
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
                        <FiPhone size={14} className="text-secondary" />
                        <span>Contact No.</span>
                      </div>
                      <div className="fw-bold text-dark small">
                        {selectedStudent.phone || "N/A"}
                      </div>
                    </div>

                    {/* EMAIL VERIFICATION */}
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
                        <FiCheckCircle size={14} className="text-secondary" />
                        <span>Email Verification</span>
                      </div>
                      <div>
                        {selectedStudent.isEmailVerified ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-2 fw-semibold">
                            Verified
                          </span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1 rounded-2 fw-semibold">
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ACCOUNT STATUS */}
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
                        <FiShield size={14} className="text-secondary" />
                        <span>Account Status</span>
                      </div>
                      <div>
                        {(() => {
                          const statusInfo = getStudentStatus(selectedStudent);
                          return (
                            <span
                              className={`badge ${statusInfo.className} px-2.5 py-1 rounded-2 fw-semibold d-inline-flex align-items-center gap-1`}
                            >
                              {statusInfo.icon}
                              {statusInfo.text}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    {/* REGISTERED DATE & TIME */}
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-1.5 text-muted small fw-semibold mb-1">
                        <FiCalendar size={14} className="text-secondary" />
                        <span>Registered Date & Time</span>
                      </div>
                      <div className="fw-bold text-dark small">
                        {formatDateTime(selectedStudent.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="card-footer bg-white border-top-0 p-3 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-light px-4 fw-semibold rounded-3"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}