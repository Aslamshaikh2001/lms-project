// import React, {
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// import {
//   useNavigate,
// } from "react-router-dom";

// import {
//   motion,
// } from "framer-motion";

// import {
//   BookOpen,
//   RefreshCw,
//   XCircle,
//   ArrowRight,
//   Code2,
//   Cpu,
//   Layers,
//   Briefcase,
//   GraduationCap,
//   Building2,
//   Award,
//   CheckCircle,
//   Sparkles,
//   ShieldCheck,
//   Mail,
// } from "lucide-react";

// import {
//   getStudentDashboard,
// } from "../../services/studentDashboardService";


// /* ============================================================
//    ANIMATION VARIANTS
//    ============================================================ */

// const containerVariants = {
//   hidden: {
//     opacity: 0,
//   },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: {
//     opacity: 0,
//     y: 20,
//   },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 15,
//     },
//   },
// };


// /* ============================================================
//    SVR COURSES DATA (Full Content & Expanded Height)
//    ============================================================ */

// const SVR_COURSES = [
//   {
//     id: 1,
//     title: "Full Stack Java Development",
//     duration: "6 Months",
//     mode: "Online / Offline",
//     description: "Comprehensive end-to-end training covering Java 17+, Spring Boot 3, Microservices, REST APIs, and React Frontend.",
//     highlights: ["100% Placement Support", "10+ Real-Time Projects", "Mock Interviews & Resume Preparation"],
//     tags: ["Java", "Spring Boot", "React", "MySQL"],
//     bgGradient: "linear-gradient(135deg, #ffffff 0%, #fff9e6 100%)",
//     borderColor: "#ffc107",
//     icon: <Code2 size={24} className="text-warning" />,
//   },
//   {
//     id: 2,
//     title: "Python & Data Science AI",
//     duration: "5 Months",
//     mode: "Online / Offline",
//     description: "Master Python programming, Data Analysis, Machine Learning algorithms, Deep Learning models, and AI integrations.",
//     highlights: ["Industry Case Studies", "Kaggle Competitions Support", "Dedicated Placement Drive"],
//     tags: ["Python", "Pandas", "Scikit-Learn", "TensorFlow"],
//     bgGradient: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
//     borderColor: "#0dcaf0",
//     icon: <Cpu size={24} className="text-info" />,
//   },
//   {
//     id: 3,
//     title: "React & Modern Web Frontend",
//     duration: "4 Months",
//     mode: "Online / Offline",
//     description: "Build ultra-fast, responsive web applications using JavaScript ES6+, TypeScript, React, Next.js, Redux, and Tailwind CSS.",
//     highlights: ["Live Enterprise Dashboard Build", "Code Review by Senior Devs", "100% Placement Drives"],
//     tags: ["React", "TypeScript", "Next.js", "Tailwind"],
//     bgGradient: "linear-gradient(135deg, #ffffff 0%, #f6ffed 100%)",
//     borderColor: "#198754",
//     icon: <Layers size={24} className="text-success" />,
//   },
//   {
//     id: 4,
//     title: "Software Testing & Automation QA",
//     duration: "3 Months",
//     mode: "Online / Offline",
//     description: "Complete testing program bridging Manual Testing, Selenium WebDriver, TestNG, Cucumber BDD, and REST API Testing.",
//     highlights: ["Live Bug Tracking Projects", "Automated Regression Frameworks", "Direct Hiring Partner Referrals"],
//     tags: ["Selenium", "Java QA", "API Testing", "JIRA"],
//     bgGradient: "linear-gradient(135deg, #ffffff 0%, #fff0f6 100%)",
//     borderColor: "#dc3545",
//     icon: <Briefcase size={24} className="text-danger" />,
//   },
//   {
//     id: 5,
//     title: "DevOps & Cloud Architecture",
//     duration: "5 Months",
//     mode: "Online / Offline",
//     description: "Master modern cloud infrastructure with AWS, Docker, Kubernetes, Terraform, Ansible, and Jenkins CI/CD pipelines.",
//     highlights: ["AWS Certified Curriculum", "Real Infrastructure Provisioning", "Top IT Placement Support"],
//     tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
//     bgGradient: "linear-gradient(135deg, #ffffff 0%, #f9f0ff 100%)",
//     borderColor: "#6f42c1",
//     icon: <GraduationCap size={24} className="text-primary" />,
//   },
// ];


// /* ============================================================
//    SVR PLACEMENT SUCCESS DATA (Screenshot Design)
//    ============================================================ */

// const SVR_PLACEMENTS = [
//   {
//     id: 1,
//     name: "Abhishek",
//     role: "SAP Associate Consultant",
//     company: "DxMinds",
//     lpa: "3.5",
    
//   },
//   {
//     id: 2,
//     name: "Venkatesh Pillay",
//     role: "SAP SD Executive",
//     company: "Hexaware Technologies",
//     lpa: "6.5",
//     avatar: null,
//   },
//   {
//     id: 3,
//     name: "Angela",
//     role: "SAP FI Process Associate",
//     company: "cloud software Solutions",
//     lpa: "4",
    
//   },
//   {
//     id: 4,
//     name: "Deepak Shinde",
//     role: "SAP FI Process Associate",
//     company: "Sonata Software",
//     lpa: "5",
    
//   },
//   {
//     id: 5,
//     name: "Pooja Sharma",
//     role: "Full Stack Developer",
//     company: "Techasoft",
//     lpa: "4.5",
    
//   },
//   {
//     id: 6,
//     name: "Rahul Verma",
//     role: "Java Backend Engineer",
//     company: "Hexaware Technologies",
//     lpa: "3.8",

//   },
// ];


// /* ============================================================
//    TOP RECRUITING COMPANIES DATA (Rich Card Layout)
//    ============================================================ */

// const HIRING_COMPANIES = [
//   { id: 1, name: "Techasoft", type: "software development", hires: "30+ Placed", color: "#2874f0", bg: "#f0f5ff" },
//   { id: 2, name: "Nextwebi IT Solutions", type: "IT services", hires: "35+ Placed", color: "#198754", bg: "#f0fdf4" },
//   { id: 3, name: "Mindroit Technologies", type: "software development", hires: "20+ Placed", color: "#003366", bg: "#f0f8ff" },
//   { id: 4, name: "cloud software Solutions", type: "web and mobile app development", hires: "30+ Placed", color: "#004080", bg: "#f0f4f8" },
//   { id: 5, name: "Nextbrain Technologies", type: "web and mobile applications", hires: "20+ Placed", color: "#007cc3", bg: "#f0f9ff" },
//   { id: 6, name: "Hexaware Technologies", type: "Java, React, backend", hires: "10+ Placed", color: "#34113f", bg: "#f9f0ff" },
//   { id: 7, name: "Birlasoft", type: "Java,Web Developer", hires: "30+ Placed", color: "#a100ff", bg: "#fcf0ff" },
//   { id: 8, name: "DxMinds", type: "Digital Services", hires: "25+ Placed", color: "#0033a0", bg: "#f0f4ff" },
//   { id: 9, name: "Sonata Software", type: "Cloud & AI", hires: "25+ Placed", color: "#052fbe", bg: "#f0f3ff" },
// ];


// /* ============================================================
//    HELPERS
//    ============================================================ */

// const getInitials = (name) => {
//   if (!name) return "S";
//   const parts = name.trim().split(/\s+/).filter(Boolean);
//   if (parts.length === 1) {
//     return parts[0].substring(0, 2).toUpperCase();
//   }
//   return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
// };


// /* ============================================================
//    MAIN DASHBOARD COMPONENT
//    ============================================================ */

// export default function StudentDashboard() {

//   const navigate = useNavigate();

//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");

//   /* ==========================================================
//      FETCH DASHBOARD DATA
//      ========================================================== */

//   const loadDashboard = useCallback(
//     async (showRefreshLoader = false) => {
//       try {
//         if (showRefreshLoader) {
//           setRefreshing(true);
//         } else {
//           setLoading(true);
//         }

//         setError("");

//         const response = await getStudentDashboard();

//         if (response?.success && response?.data) {
//           setDashboard(response.data);
//         } else {
//           throw new Error(response?.message || "Failed to load dashboard data.");
//         }
//       } catch (err) {
//         console.error("STUDENT DASHBOARD ERROR:", err);
//         setError(
//           err?.response?.data?.message ||
//           err?.message ||
//           "Failed to load dashboard."
//         );
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     loadDashboard();
//   }, [loadDashboard]);

//   /* ==========================================================
//      LOADING UI
//      ========================================================== */

//   if (loading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{
//           minHeight: "100vh",
//           background: "linear-gradient(180deg, #f8fbff 0%, #eef2f7 100%)",
//         }}
//       >
//         <div className="text-center p-5 bg-white shadow-lg rounded-5" style={{ maxWidth: "420px" }}>
//           <div
//             className="spinner-border text-warning mb-3"
//             style={{ width: "3.5rem", height: "3.5rem", borderWidth: "4px" }}
//           />
//           <h4 className="fw-bold text-dark mb-2">Loading Dashboard</h4>
//           <p className="text-muted small mb-0">Fetching SVR training content and placement data...</p>
//         </div>
//       </div>
//     );
//   }

//   /* ==========================================================
//      ERROR UI
//      ========================================================== */

//   if (error && !dashboard) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center p-4"
//         style={{
//           minHeight: "100vh",
//           background: "#f8fafc",
//         }}
//       >
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="card border-0 shadow-lg rounded-5 text-center p-5"
//           style={{ maxWidth: "480px" }}
//         >
//           <div
//             className="mx-auto mb-4 rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center"
//             style={{ width: "72px", height: "72px" }}
//           >
//             <XCircle size={36} className="text-danger" />
//           </div>
//           <h4 className="fw-bold text-dark mb-2">Unable to Load Dashboard</h4>
//           <p className="text-muted small mb-4">{error}</p>
//           <button
//             type="button"
//             className="btn btn-warning fw-bold rounded-3 px-4 py-2"
//             onClick={() => loadDashboard()}
//           >
//             <RefreshCw size={17} className="me-2" />
//             Try Again
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   /* ==========================================================
//      SAFE DATA ASSIGNMENT
//      ========================================================== */

//   const student = dashboard?.student || {};

//   return (
//     <div
//       className="container-fluid py-3 px-2 px-md-4"
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(180deg, #f4f7fc 0%, #eef2f8 100%)",
//       }}
//     >
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="container-fluid p-0"
//       >

//         {/* =====================================================
//             REDESIGNED PROFESSIONAL PROFILE BANNER / NAVBAR
//             ===================================================== */}

//         <motion.div
//           variants={itemVariants}
//           className="card border-0 shadow-lg mb-5 overflow-hidden position-relative"
//           style={{
//             borderRadius: "24px",
//             background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//             borderLeft: "8px solid #ffc107",
//           }}
//         >
//           {/* Subtle Background Glow Accent */}
//           <div
//             className="position-absolute"
//             style={{
//               top: "-60px",
//               right: "-60px",
//               width: "260px",
//               height: "260px",
//               background: "radial-gradient(circle, rgba(255,193,7,0.18) 0%, rgba(0,0,0,0) 70%)",
//               borderRadius: "50%",
//               pointerEvents: "none",
//             }}
//           />

//           <div className="card-body p-4 p-lg-4 position-relative" style={{ zIndex: 2 }}>
//             <div className="row align-items-center justify-content-between g-4">
              
//               {/* Profile Left: Avatar & Details */}
//               <div className="col-lg-7">
//                 <div className="d-flex align-items-center gap-3 gap-md-4">
                  
//                   {/* Glowing Circular Avatar */}
//                   <div className="position-relative flex-shrink-0">
//                     {student.avatar ? (
//                       <img
//                         src={student.avatar}
//                         alt={student.name}
//                         className="rounded-circle border border-3 border-warning shadow"
//                         style={{
//                           width: "78px",
//                           height: "78px",
//                           objectFit: "cover",
//                         }}
//                       />
//                     ) : (
//                       <div
//                         className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold shadow"
//                         style={{
//                           width: "78px",
//                           height: "78px",
//                           fontSize: "1.75rem",
//                         }}
//                       >
//                         {getInitials(student.name)}
//                       </div>
//                     )}
//                     <span
//                       className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
//                       style={{ width: "16px", height: "16px" }}
//                       title="Active Status"
//                     />
//                   </div>

//                   {/* Name, Role & Email */}
//                   <div>
//                     <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
//                       <h3 className="fw-extrabold text-white mb-0" style={{ letterSpacing: "-0.5px" }}>
//                         {student.name || "Student Portal"}
//                       </h3>
//                       <span
//                         className="badge bg-warning text-dark fw-extrabold px-3 py-1 rounded-pill shadow-sm"
//                         style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
//                       >
//                         {student.role || "SVR TRAINEE"}
//                       </span>
//                     </div>

//                     <div className="d-flex align-items-center gap-3 text-light opacity-75 small">
//                       <span className="d-flex align-items-center gap-1">
//                         <Mail size={14} className="text-warning" />
//                         {student.email || "student@svrportal.com"}
//                       </span>
//                       {/* <span className="d-flex align-items-center gap-1">
//                         <ShieldCheck size={14} className="text-success" />
//                         Verified Account
//                       </span> */}
//                     </div>
//                   </div>

//                 </div>
//               </div>

//               {/* Profile Right: Quick Actions */}
//               <div className="col-lg-5">
//                 <div className="d-flex justify-content-lg-end align-items-center gap-3 flex-wrap">
//                   <motion.button
//                     whileHover={{ scale: 1.04 }}
//                     whileTap={{ scale: 0.96 }}
//                     type="button"
//                     className="btn btn-warning fw-bold text-dark px-4 py-2.5 rounded-4 shadow-sm d-flex align-items-center gap-2"
//                     onClick={() => navigate("/student/assessments")}
//                   >
//                     <BookOpen size={17} />
//                     Assessments
//                   </motion.button>

//                   <motion.button
//                     whileHover={{ scale: 1.04 }}
//                     whileTap={{ scale: 0.96 }}
//                     type="button"
//                     className="btn btn-outline-light fw-semibold px-4 py-2.5 rounded-4 d-flex align-items-center gap-2"
//                     onClick={() => loadDashboard(true)}
//                     disabled={refreshing}
//                   >
//                     <RefreshCw size={17} className={refreshing ? "spin" : ""} />
//                     Refresh
//                   </motion.button>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </motion.div>


//         {/* =====================================================
//             SVR COURSES SECTION (FULL HEIGHT & RICH DETAIL CONTENT)
//             ===================================================== */}

//         <motion.div variants={itemVariants} className="mb-5">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div>
//               <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-1">
//                 Featured Programs
//               </span>
//               <h4 className="fw-bold text-dark mb-0">
//                 SVR Training Offerings
//               </h4>
//             </div>
//           </div>

//           {/* Marquee Carousel Container for Courses */}
//           <div
//             className="position-relative overflow-hidden py-3"
//             style={{
//               maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
//               WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
//             }}
//           >
//             <motion.div
//               className="d-flex gap-4"
//               animate={{
//                 x: ["0%", "-50%"],
//               }}
//               transition={{
//                 x: {
//                   repeat: Infinity,
//                   repeatType: "loop",
//                   duration: 35,
//                   ease: "linear",
//                 },
//               }}
//               style={{
//                 width: "max-content",
//               }}
//             >
//               {[...SVR_COURSES, ...SVR_COURSES].map((course, idx) => (
//                 <motion.div
//                   key={`${course.id}-${idx}`}
//                   whileHover={{ y: -10, scale: 1.02 }}
//                   className="card border-0 shadow-lg p-4 flex-shrink-0 position-relative d-flex flex-column"
//                   style={{
//                     width: "380px",
//                     borderRadius: "24px",
//                     background: course.bgGradient,
//                     borderTop: `5px solid ${course.borderColor}`,
//                   }}
//                 >
//                   {/* Header */}
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <div
//                       className="rounded-4 bg-white shadow-sm d-flex align-items-center justify-content-center p-2"
//                       style={{ width: "52px", height: "52px" }}
//                     >
//                       {course.icon}
//                     </div>
//                     <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill">
//                       {course.duration}
//                     </span>
//                   </div>

//                   {/* Title & Mode */}
//                   <h4 className="fw-bold text-dark mb-1">
//                     {course.title}
//                   </h4>
//                   <div className="text-muted small fw-medium mb-3">
//                     <span className="text-warning-emphasis fw-bold">Mode:</span> {course.mode}
//                   </div>

//                   <p className="text-secondary small mb-3" style={{ minHeight: "48px", lineHeight: "1.5" }}>
//                     {course.description}
//                   </p>

//                   {/* Highlights List */}
//                   <div className="mb-3 pt-2 border-top">
//                     <span className="d-block fw-bold small text-dark mb-2">Key Highlights:</span>
//                     {course.highlights.map((item, i) => (
//                       <div key={i} className="d-flex align-items-center gap-2 mb-1">
//                         <CheckCircle size={14} className="text-success flex-shrink-0" />
//                         <span className="small text-muted">{item}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Tech Stack Tags */}
//                   <div className="d-flex flex-wrap gap-1 mb-4 mt-auto">
//                     {course.tags.map((tag, tIdx) => (
//                       <span
//                         key={tIdx}
//                         className="badge bg-white text-dark shadow-sm px-2 py-1 border"
//                         style={{ fontSize: "0.75rem", borderRadius: "8px" }}
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Footer Action Button */}
//                   <div className="pt-3 border-top d-flex align-items-center justify-content-between">
//                     <span className="small text-success fw-bold">✓ Hiring Assistance</span>
//                     {/* <button
//                       type="button"
//                       className="btn btn-warning fw-bold text-dark px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
//                       onClick={() => navigate("/student/courses")}
//                     >
//                       More <ArrowRight size={15} />
//                     </button> */}
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </motion.div>


//         {/* =====================================================
//             SVR PLACEMENT CARDS
//             ===================================================== */}

//         <motion.div variants={itemVariants} className="mb-5">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div>
//               <span className="badge bg-success text-white fw-bold px-3 py-1 rounded-pill mb-1">
//                 <Award size={14} className="me-1" />
//                 Placement Success
//               </span>
//               <h4 className="fw-bold text-dark mb-0">
//                 Our Placed Students
//               </h4>
//             </div>
//           </div>

//           {/* Marquee Carousel Container for Placements */}
//           <div
//             className="position-relative overflow-hidden py-3"
//             style={{
//               maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
//               WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
//             }}
//           >
//             <motion.div
//               className="d-flex gap-4"
//               animate={{
//                 x: ["0%", "-50%"],
//               }}
//               transition={{
//                 x: {
//                   repeat: Infinity,
//                   repeatType: "loop",
//                   duration: 32,
//                   ease: "linear",
//                 },
//               }}
//               style={{
//                 width: "max-content",
//               }}
//             >
//               {[...SVR_PLACEMENTS, ...SVR_PLACEMENTS].map((studentItem, idx) => (
//                 <motion.div
//                   key={`${studentItem.id}-${idx}`}
//                   whileHover={{ y: -8, scale: 1.02 }}
//                   className="card border-0 shadow-lg flex-shrink-0 text-center overflow-hidden"
//                   style={{
//                     width: "280px",
//                     borderRadius: "24px",
//                     background: "#ffffff",
//                   }}
//                 >
//                   {/* Top Green Banner with LPA Badge Tag */}
//                   <div
//                     className="position-relative p-4"
//                     style={{
//                       background: "linear-gradient(180deg, #4d8c52 0%, #3d7241 100%)",
//                       height: "100px",
//                     }}
//                   >
//                     {/* Ribbon Tag in Top Right */}
//                     <div
//                       className="position-absolute end-0 top-0 text-dark fw-bold px-2 py-1 shadow-sm d-flex flex-column align-items-center justify-content-center"
//                       style={{
//                         background: "#cceabb",
//                         borderBottomLeftRadius: "8px",
//                         fontSize: "0.85rem",
//                         lineHeight: "1.1",
//                         minWidth: "55px",
//                         paddingTop: "6px",
//                       }}
//                     >
//                       <span className="fw-extrabold">{studentItem.lpa}</span>
//                       <span style={{ fontSize: "0.65rem" }}>LPA</span>
//                     </div>

//                     {/* Circular Avatar
//                     <div
//                       className="position-absolute start-50 translate-middle-x"
//                       style={{ bottom: "-42px" }}
//                     >
//                       {studentItem.avatar ? (
//                         <img
//                           src={studentItem.avatar}
//                           alt={studentItem.name}
//                           className="rounded-circle border border-4 border-white shadow"
//                           style={{ width: "84px", height: "84px", objectFit: "cover" }}
//                         />
//                       ) : (
//                         <div
//                           className="rounded-circle bg-secondary-subtle border border-4 border-white shadow text-secondary d-flex align-items-center justify-content-center fw-bold"
//                           style={{ width: "84px", height: "84px", fontSize: "1.8rem" }}
//                         >
//                           👤
//                         </div>
//                       )}
//                     </div> */}
//                   </div>

//                   {/* Card Body Information */}
//                   <div className="card-body pt-5 pb-3 px-3">
//                     <h5 className="fw-bold text-dark mb-0 mt-2">
//                       {studentItem.name}
//                     </h5>

//                     {/* Congratulation Cursive Script Text */}
//                     <div
//                       className="my-1 fw-normal"
//                       style={{
//                         fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
//                         fontSize: "1.5rem",
//                         color: "#539158",
//                       }}
//                     >
//                       Congratulation
//                     </div>

//                     {/* Role Pill Badge */}
//                     <div className="mb-3">
//                       <span
//                         className="badge bg-white text-success border border-success-subtle fw-semibold px-3 py-2 rounded-pill"
//                         style={{ fontSize: "0.78rem" }}
//                       >
//                         {studentItem.role}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Light Green Footer Bar */}
//                   <div
//                     className="py-2.5 px-3 fw-bold"
//                     style={{
//                       background: "#cceabb",
//                       color: "#1e4620",
//                       fontSize: "0.95rem",
//                     }}
//                   >
//                     Placed at: <span className="fw-extrabold text-uppercase">{studentItem.company}</span>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </motion.div>


//         {/* =====================================================
//             TOP HIRING COMPANIES TICKER (FULL SHADOW ANIMATED CARDS)
//             ===================================================== */}

//         <motion.div variants={itemVariants} className="mb-4">
//           <div className="d-flex align-items-center gap-2 mb-3">
//             <Building2 size={22} className="text-warning" />
//             <h4 className="fw-bold text-dark mb-0">
//               Our Hiring Partners
//             </h4>
//           </div>

//           <div
//             className="position-relative overflow-hidden py-3"
//             style={{
//               maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
//               WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
//             }}
//           >
//             <motion.div
//               className="d-flex gap-4"
//               animate={{
//                 x: ["0%", "-50%"],
//               }}
//               transition={{
//                 x: {
//                   repeat: Infinity,
//                   repeatType: "loop",
//                   duration: 25,
//                   ease: "linear",
//                 },
//               }}
//               style={{
//                 width: "max-content",
//               }}
//             >
//               {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((company, cIdx) => (
//                 <motion.div
//                   key={`${company.id}-${cIdx}`}
//                   whileHover={{ y: -6, scale: 1.03 }}
//                   className="card border-0 shadow-lg p-3 rounded-4 flex-shrink-0 d-flex flex-column justify-content-between"
//                   style={{
//                     background: company.bg,
//                     borderTop: `4px solid ${company.color}`,
//                     width: "220px",
//                     minHeight: "110px",
//                   }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <span className="fw-extrabold tracking-wide fs-5" style={{ color: company.color }}>
//                       {company.name}
//                     </span>
//                     <span className="badge bg-white text-dark shadow-sm px-2 py-1" style={{ fontSize: "0.7rem" }}>
//                       Active
//                     </span>
//                   </div>

//                   <div>
//                     <div className="small text-muted fw-medium">{company.type}</div>
//                     <div className="fw-bold text-dark small" style={{ fontSize: "0.8rem" }}>
//                       {company.hires}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </motion.div>

//       </motion.div>


//       {/* =======================================================
//           CUSTOM CSS FOR ANIMATION
//           ======================================================= */}
//       <style>
//         {`
//           .spin {
//             animation: dashboardSpin 0.9s linear infinite;
//           }

//           @keyframes dashboardSpin {
//             from {
//               transform: rotate(0deg);
//             }
//             to {
//               transform: rotate(360deg);
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// }


import React, {

  useCallback,

  useEffect,

  useState,

} from "react";



import {

  useNavigate,

} from "react-router-dom";



import {

  motion,

} from "framer-motion";



import {

  BookOpen,

  RefreshCw,

  XCircle,

  ArrowRight,

  Code2,

  Cpu,

  Layers,

  Briefcase,

  GraduationCap,

  Building2,

  Award,

  CheckCircle,

  Sparkles,

  ShieldCheck,

  Mail,

} from "lucide-react";



import {

  getStudentDashboard,

} from "../../services/studentDashboardService";





/* ============================================================

   ANIMATION VARIANTS

   ============================================================ */



const containerVariants = {

  hidden: {

    opacity: 0,

  },

  visible: {

    opacity: 1,

    transition: {

      staggerChildren: 0.1,

    },

  },

};



const itemVariants = {

  hidden: {

    opacity: 0,

    y: 20,

  },

  visible: {

    opacity: 1,

    y: 0,

    transition: {

      type: "spring",

      stiffness: 100,

      damping: 15,

    },

  },

};





/* ============================================================

   SVR COURSES DATA (Full Content & Expanded Height)

   ============================================================ */



const SVR_COURSES = [

  {

    id: 1,

    title: "Full Stack Java Development",

    duration: "6 Months",

    mode: "Online / Offline",

    description: "Comprehensive end-to-end training covering Java 17+, Spring Boot 3, Microservices, REST APIs, and React Frontend.",

    highlights: ["100% Placement Support", "10+ Real-Time Projects", "Mock Interviews & Resume Preparation"],

    tags: ["Java", "Spring Boot", "React", "MySQL"],

    bgGradient: "linear-gradient(135deg, #ffffff 0%, #fff9e6 100%)",

    borderColor: "#ffc107",

    icon: <Code2 size={24} className="text-warning" />,

  },

  {

    id: 2,

    title: "Python & Data Science AI",

    duration: "5 Months",

    mode: "Online / Offline",

    description: "Master Python programming, Data Analysis, Machine Learning algorithms, Deep Learning models, and AI integrations.",

    highlights: ["Industry Case Studies", "Kaggle Competitions Support", "Dedicated Placement Drive"],

    tags: ["Python", "Pandas", "Scikit-Learn", "TensorFlow"],

    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",

    borderColor: "#0dcaf0",

    icon: <Cpu size={24} className="text-info" />,

  },

  {

    id: 3,

    title: "React & Modern Web Frontend",

    duration: "4 Months",

    mode: "Online / Offline",

    description: "Build ultra-fast, responsive web applications using JavaScript ES6+, TypeScript, React, Next.js, Redux, and Tailwind CSS.",

    highlights: ["Live Enterprise Dashboard Build", "Code Review by Senior Devs", "100% Placement Drives"],

    tags: ["React", "TypeScript", "Next.js", "Tailwind"],

    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f6ffed 100%)",

    borderColor: "#198754",

    icon: <Layers size={24} className="text-success" />,

  },

  {

    id: 4,

    title: "Software Testing & Automation QA",

    duration: "3 Months",

    mode: "Online / Offline",

    description: "Complete testing program bridging Manual Testing, Selenium WebDriver, TestNG, Cucumber BDD, and REST API Testing.",

    highlights: ["Live Bug Tracking Projects", "Automated Regression Frameworks", "Direct Hiring Partner Referrals"],

    tags: ["Selenium", "Java QA", "API Testing", "JIRA"],

    bgGradient: "linear-gradient(135deg, #ffffff 0%, #fff0f6 100%)",

    borderColor: "#dc3545",

    icon: <Briefcase size={24} className="text-danger" />,

  },

  {

    id: 5,

    title: "DevOps & Cloud Architecture",

    duration: "5 Months",

    mode: "Online / Offline",

    description: "Master modern cloud infrastructure with AWS, Docker, Kubernetes, Terraform, Ansible, and Jenkins CI/CD pipelines.",

    highlights: ["AWS Certified Curriculum", "Real Infrastructure Provisioning", "Top IT Placement Support"],

    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],

    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f9f0ff 100%)",

    borderColor: "#6f42c1",

    icon: <GraduationCap size={24} className="text-primary" />,

  },

];





/* ============================================================

   SVR PLACEMENT SUCCESS DATA (Screenshot Design)

   ============================================================ */



const SVR_PLACEMENTS = [

  {

    id: 1,

    name: "Abhishek",

    role: "SAP Associate Consultant",

    company: "DxMinds",

    lpa: "3.5",



  },

  {

    id: 2,

    name: "Venkatesh Pillay",

    role: "SAP SD Executive",

    company: "Hexaware Technologies",

    lpa: "6.5",

    avatar: null,

  },

  {

    id: 3,

    name: "Angela",

    role: "SAP FI Process Associate",

    company: "cloud software Solutions",

    lpa: "4",



  },

  {

    id: 4,

    name: "Deepak Shinde",

    role: "SAP FI Process Associate",

    company: "Sonata Software",

    lpa: "5",



  },

  {

    id: 5,

    name: "Pooja Sharma",

    role: "Full Stack Developer",

    company: "Techasoft",

    lpa: "4.5",



  },

  {

    id: 6,

    name: "Rahul Verma",

    role: "Java Backend Engineer",

    company: "Hexaware Technologies",

    lpa: "3.8",



  },

];





/* ============================================================

   TOP RECRUITING COMPANIES DATA (Rich Card Layout)

   ============================================================ */



const HIRING_COMPANIES = [

  { id: 1, name: "Techasoft", type: "software development", color: "#2874f0", bg: "#f0f5ff" },

  { id: 2, name: "Nextwebi IT Solutions", type: "IT services", color: "#198754", bg: "#f0fdf4" },

  { id: 3, name: "Mindroit Technologies", type: "software development", color: "#003366", bg: "#f0f8ff" },

  { id: 4, name: "cloud software Solutions", type: "web and mobile app development", color: "#004080", bg: "#f0f4f8" },

  { id: 5, name: "Nextbrain Technologies", type: "web and mobile applications", color: "#007cc3", bg: "#f0f9ff" },

  { id: 6, name: "Hexaware Technologies", type: "Java, React, backend", color: "#34113f", bg: "#f9f0ff" },

  { id: 7, name: "Birlasoft", type: "Java,Web Developer", color: "#a100ff", bg: "#fcf0ff" },

  { id: 8, name: "DxMinds", type: "Digital Services", color: "#0033a0", bg: "#f0f4ff" },

  { id: 9, name: "Sonata Software", type: "Cloud & AI",  color: "#052fbe", bg: "#f0f3ff" },

];





/* ============================================================

   HELPERS

   ============================================================ */



/* ============================================================
   JOB OPENINGS DATA
   The Knowledge Sprint role is based on the job description supplied.
   Other entries are clearly marked as demo listings and should be
   replaced with verified employer details before publishing.
   ============================================================ */


const JOB_OPENINGS = [
  
  {
    id: 1,
    company: "ESN Technologies",
    title: "Full Stack Developer",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time, Permanent",
    roleCategory: "Software Development",
    education: "UG: B.Tech / B.E. in Computer Science, Computer Engineering, IT, or a relevant field",
    experience: "0–4 years",
    salary: "Not specified",
    location: "Not specified",
    tags: [".NET", "C#", "Angular", "SQL Server", "Azure", "REST APIs", "Agentic AI", "Microsoft Copilot"],
    description: [
      "Design, develop, test, and maintain scalable web applications using .NET and Angular.",
      "Develop and integrate RESTful APIs for application and system integrations.",
      "Work with SQL Server for database development, queries, and data management.",
      "Develop and deploy applications using Microsoft Azure services.",
      "Participate in the complete software development lifecycle, from requirements to deployment and maintenance.",
      "Collaborate with developers, technical teams, and stakeholders to deliver quality solutions.",
      "Troubleshoot, debug, and resolve application issues.",
      "Write clean, maintainable, and efficient code following development best practices.",
      "Explore AI-assisted development tools, including Microsoft Copilot, and gain exposure to Agentic AI.",
      "Participate in code reviews, testing, documentation, and continuous improvement.",
      "Required: C#, .NET, Angular or a similar frontend framework, REST APIs, SQL Server, Azure fundamentals, problem-solving, and communication skills.",
      "Preferred: Azure certifications, Azure App Services, Azure Functions, Azure SQL, Git, CI/CD, DevOps, Entity Framework, ASP.NET Core, and AI application development.",
      "Education: Bachelor's degree in Computer Science, Computer Engineering, IT, or a related field."
    ],
    disclaimer: "Verify the latest job details and availability directly with the employer before applying."
  },
  {
    id: 2,
    company: "Hawk Sense Business Solutions",
    title: "Full Stack Developer",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time, Permanent",
    roleCategory: "Software Development",
    education: "Any Graduate or Postgraduate",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Full Stack Development", "Software Engineering", "Debugging", "Code Reviews", "Application Development"],
    description: [
      "Collaborate with cross-functional teams to design, develop, and deploy software applications.",
      "Participate in code reviews and improve the overall quality of the codebase.",
      "Develop high-quality, scalable, and efficient code using various programming languages and frameworks.",
      "Troubleshoot issues and debug code to resolve defects and performance problems.",
      "Stay updated with industry trends and emerging technologies.",
      "Contribute to the development of new features and functionalities."
    ],
    disclaimer: "This job description was sourced from a public-domain listing and may have been modified for clarity. Verify details with the employer."
  },
  {
    id: 3,
    company: "Inspired Infotech",
    title: "Software Engineering Intern - Full Stack",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time / Internship details to be confirmed",
    roleCategory: "Front End Developer",
    education: "Final-year student or recent graduate in Computer Science or IT",
    experience: "Internship / Fresher",
    salary: "Not specified",
    location: "Hyderabad",
    tags: ["React", "JavaScript", "TypeScript", "Node.js", "SQL", "Git", "HTML", "CSS"],
    description: [
      "Learn to build modern web applications end to end alongside the software engineering team.",
      "Build user-interface components using React.",
      "Develop simple APIs and backend services.",
      "Write unit tests and fix bugs.",
      "Learn Git workflows and participate in code reviews.",
      "Document the features you build.",
      "Required: programming fundamentals in JavaScript, Java, or Python, plus basic HTML, CSS, and SQL.",
      "Preferred: personal or academic web projects and basic React knowledge.",
      "Technology stack: React, JavaScript/TypeScript, Node.js, SQL, and Git.",
      "Location: Hyderabad, India. Applicants must be legally eligible to work in India."
    ],
    disclaimer: "This job posting was aggregated from an external source. Confirm the latest role details and availability before applying."
  },
  {
    id: 4,
    company: "ONE Soft Systems",
    title: "Junior Full Stack Developer - .NET & React.js",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time, Permanent",
    roleCategory: "Software Development",
    education: "B.Tech / B.E. / BCA / MCA / M.Tech or equivalent",
    experience: "0–1 year; freshers welcome",
    salary: "Not specified",
    location: "Hyderabad",
    tags: ["C#", ".NET Core", "ASP.NET Core", "React.js", "SQL Server", "REST APIs", "JavaScript", "TypeScript", "Bootstrap"],
    description: [
      "Develop and maintain web applications using ASP.NET Core and C#.",
      "Build responsive user interfaces using React.js, HTML, CSS, JavaScript/TypeScript, and Bootstrap.",
      "Create and consume REST APIs.",
      "Work with SQL Server tables, queries, and stored procedures.",
      "Perform basic debugging, troubleshooting, application testing, and bug fixing.",
      "Work with senior developers to implement business requirements.",
      "Assist with technical documentation and application deployment.",
      "Work on modules such as user registration, login, role-based access, data management, reports, dashboards, notifications, API integrations, and workflow applications.",
      "Required: basic C#, ASP.NET Core, React.js, HTML, CSS, JavaScript, SQL Server, OOP concepts, and REST APIs.",
      "Preferred: TypeScript, Bootstrap, Entity Framework Core, Git/GitHub, JWT authentication, and Postman API testing.",
      "Graduates from 2024, 2025, and 2026 can apply."
    ],
    disclaimer: "The supplied listing includes a contact number. Verify the employer and role independently before sharing personal information or applying."
  },
  {
    id: 5,
    company: "Sirigiri Software Solutions",
    title: "Full Stack Developer",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time, Permanent",
    roleCategory: "Software Development",
    education: "Any Graduate",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["React.js", "JavaScript", "TypeScript", "Node.js", "HTML", "CSS", "Redux", "Next.js"],
    description: [
      "Design, develop, test, and deploy full-stack applications using React.js, JavaScript, TypeScript, Node.js, HTML, CSS, Redux, and Next.js.",
      "Collaborate with cross-functional teams to identify project requirements and deliver high-quality solutions.",
      "Participate in code reviews to ensure adherence to coding standards and best practices.",
      "Troubleshoot issues and debug code as needed.",
      "Stay updated with industry trends and emerging technologies."
    ],
    disclaimer: "Verify the latest job details and availability directly with the employer before applying."
  },
  {
    id: 6,
    company: "Sunlight IT",
    title: "Web Development Intern",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Internship",
    roleCategory: "Full Stack Developer",
    education: "Any Graduate",
    experience: "Fresher; prior commercial experience not required",
    salary: "Not specified",
    location: "Hyderabad",
    tags: ["HTML", "CSS", "JavaScript", "PHP", "WordPress", "CMS", "Web Development"],
    description: [
      "Work with HTML, CSS, JavaScript, and PHP on live projects.",
      "Learn how frontend and backend technologies work together.",
      "Receive code reviews from developers delivering client web development projects.",
      "Depending on project requirements, work on custom CMS builds, WordPress websites, or e-commerce features.",
      "Gain practical experience building and maintaining web applications.",
      "No prior commercial experience is expected."
    ],
    disclaimer: "This job posting was aggregated from an external source. Verify current internship details and availability before applying."
  },
  {
    id: 7,
    company: "Syntrex Technology",
    title: "Java Backend Developer",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time, Permanent",
    roleCategory: "Back End Developer",
    education: "B.E. / B.Tech / BCA / B.Sc. Computer Science / MCA or equivalent",
    experience: "Freshers and experienced candidates may apply",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Core Java", "OOP", "Data Structures", "Algorithms", "SQL", "REST APIs", "Git", "Backend Development"],
    description: [
      "Design, develop, test, and deploy software applications using Java and related technologies.",
      "Write clean, efficient, scalable, and reusable code following industry best practices.",
      "Apply Core Java, Object-Oriented Programming, and Data Structures concepts.",
      "Develop and maintain backend services, REST APIs, and application components.",
      "Work with SQL databases for data management, queries, and database optimization.",
      "Identify, troubleshoot, debug, and resolve software defects and technical issues.",
      "Collaborate with cross-functional teams to understand requirements and deliver solutions.",
      "Participate in code reviews, software testing, documentation, and application deployment.",
      "Maintain existing applications and implement enhancements based on business requirements.",
      "Ensure application performance, security, reliability, and code quality.",
      "Required: Core Java, OOP, data structures, SQL, REST APIs, Git, problem-solving, and communication skills."
    ],
    disclaimer: "Verify the latest job details and availability directly with the employer before applying."
  },
  {
    id: 8,
    company: "Tileti Eemeze Soft Tech",
    title: "Java Backend Developer",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time, Permanent",
    roleCategory: "Back End Developer",
    education: "UG: B.Tech / B.E.; postgraduate qualification not required",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Java", "Software Development", "Testing", "Code Reviews", "Debugging", "Documentation"],
    description: [
      "Collaborate with cross-functional teams to identify and prioritize project requirements.",
      "Design, develop, and test software applications using Java.",
      "Participate in code reviews and improve the overall quality of the codebase.",
      "Troubleshoot and resolve technical issues efficiently.",
      "Develop and maintain technical documentation for software applications.",
      "Stay updated with industry trends and emerging technologies."
    ],
    disclaimer: "This job posting was aggregated from an external source. Confirm the latest details and availability before applying."
  },
  {
    id: 9,
    company: "WebAxis Software Services",
    title: "Java Developer",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Full Time, Freelance/Homebased",
    roleCategory: "Software Development",
    education: "Any Graduate or Postgraduate",
    experience: "0–1 year",
    salary: "₹3.5–8 LPA",
    location: "Hyderabad, Chennai, Bengaluru; remote option requested in the supplied description",
    tags: ["Java", "Java EE", "Jakarta EE", "REST APIs", "Microservices", "Unit Testing", "TDD", "Databases"],
    description: [
      "Write clean, efficient, and well-documented Java and Java EE/Jakarta EE code.",
      "Build and maintain RESTful APIs and microservices.",
      "Integrate applications with external services and databases.",
      "Perform unit testing and test-driven development.",
      "Resolve production issues and performance bottlenecks.",
      "Collaborate with product managers, UI/UX designers, QA engineers, and DevOps specialists.",
      "The supplied description mentions a work-from-home or remote option; confirm availability with the employer.",
      "The original listing labels the role category as Data Science & Machine Learning and the role as Data Engineer, although the responsibilities describe Java development. Confirm the actual position before applying."
    ],
    disclaimer: "Salary, locations, remote-work availability, and role classification are based on the supplied description and should be verified."
  },
  {
    id: 10,
    company: "Yotta Techports",
    title: "Associate AI Forward Deployed Engineer (Associate AI FDE)",
    category: "IT",
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    employmentType: "Paid 6-month internship with potential full-time conversion",
    roleCategory: "Software Development - Other",
    education: "Any Graduate; relevant technical skills and end-to-end projects expected",
    experience: "Up to 3 years",
    salary: "₹20,000/month during internship; ₹7 LPA CTC on full-time conversion",
    location: "Hyderabad; work from office, 5 days a week",
    tags: ["Python", "Full Stack", "Complex SQL", "REST APIs", "LLMs", "Agentic AI", "Docker", "Kubernetes", "LangChain", "LangGraph"],
    description: [
      "Build and deploy end-to-end AI solutions, applications, and platforms using Agentic AI technologies.",
      "Work directly with clients to understand business problems and design, deploy, and refine solutions.",
      "Own development work from the first commit through production deployment.",
      "Required: strong Python and at least one additional programming language.",
      "Demonstrate full-stack development experience across frontend and backend.",
      "Write complex SQL queries and demonstrate strong database fundamentals.",
      "Build and integrate REST APIs.",
      "Have a working AI application to demonstrate, such as a retrieval system, agent, or LLM integration.",
      "Maintain a GitHub portfolio with end-to-end projects.",
      "Preferred: TypeScript, AWS or GCP, Docker, Kubernetes, vector databases, LangChain, LangGraph, CrewAI, LlamaIndex, LLM evaluation, observability, and MLOps.",
      "Selection process: application submission, aptitude test, AI screening, a three-day project build, an in-office hackathon, technical panel, and leadership round.",
      "The supplied description specifies a 6-month paid internship at ₹20,000 per month and ₹7,00,000 annual CTC on conversion to full-time employment.",
      "The supplied description states a 3-year-and-9-month service agreement beginning from full-time conversion. Read and verify the official terms before accepting."
    ],
    disclaimer: "Apply through the official careers page supplied in the job description: https://yottaflex.ai/ai-forward-deploy-engineer-ai-fde/. Verify all terms directly with the employer."
  },


  {
    id: 11,
    company: "AONE SEO",
    title: "Social Media Marketing",
    category: "Non-IT",
    industry: "Advertising & Marketing",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "UG: Any Graduate; PG: Any Postgraduate",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Facebook", "Instagram", "LinkedIn", "YouTube", "Canva", "Social Media"],
    description: [
      "Work with Facebook, Instagram, LinkedIn, and YouTube.",
      "Assist in planning and publishing social media content.",
      "Support reels, stories, and trending content ideas.",
      "Coordinate with design and content teams.",
      "Engage with followers and support social media activities.",
      "Use basic Canva skills to support content creation.",
      "Be an enthusiastic learner with attention to detail."
    ],
    disclaimer:
      "Job details and availability may change. Confirm the latest information with the company before applying."
  },
  {
    id: 12,
    company: "Apeiron Global",
    title: "Digital Marketing Fresher",
    category: "Non-IT",
    industry: "IT Services & Consulting",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Graduate or Postgraduate; digital marketing certification and live-project experience required",
    experience: "Fresher",
    salary: "Not specified",
    location: "Not specified",
    tags: ["SEO", "SEM", "Social Media", "Email Marketing", "Analytics", "Content Marketing"],
    description: [
      "Plan social media campaigns and create content for Facebook, Twitter, LinkedIn, and Instagram.",
      "Respond to customer comments and questions.",
      "Manage the official website and write blog or website content.",
      "Create newsletters and other email marketing content.",
      "Monitor and improve SEO performance.",
      "Help the marketing team improve its digital marketing strategy.",
      "Identify strategies to increase website traffic through organic search.",
      "Measure campaign performance using web analytics tools.",
      "Gain exposure to SEO, SEM, SMM, SMO, content marketing, and email marketing.",
      "Qualification: Any degree with a digital marketing certification and experience handling live projects."
    ],
    disclaimer:
      "This listing was aggregated from an external source. Verify current role details and availability with the company before applying."
  },
  {
    id: 13,
    company: "Aspire Proptech",
    title: "Digital Marketing - Paid Ads Specialist",
    category: "Non-IT",
    industry: "Real Estate",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Graduate or Postgraduate",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Google Ads", "Facebook Ads", "LinkedIn Ads", "Keyword Research", "A/B Testing", "ROI"],
    description: [
      "Develop and implement paid advertising strategies aligned with business goals.",
      "Optimize campaign performance through data analysis and A/B testing.",
      "Create, launch, and manage campaigns across Google Ads, Facebook, LinkedIn, and other platforms.",
      "Monitor and adjust budgets, bids, and audience targeting.",
      "Research high-performing keywords relevant to target audiences.",
      "Update keyword lists using campaign performance metrics.",
      "Collaborate with creative teams to develop effective ad copy and visuals.",
      "Ensure advertisements follow brand guidelines and appeal to the target audience.",
      "Analyze campaign results and prepare performance reports.",
      "Recommend improvements to increase ROI and achieve KPIs.",
      "Manage advertising budgets and identify opportunities to scale successful campaigns."
    ],
    disclaimer:
      "Job details and availability may change. Confirm the latest information with the company before applying."
  },
  {
    id: 14,
    company: "BK Arogyam",
    title: "Digital Marketing Executive",
    category: "Non-IT",
    industry: "Fitness & Wellness",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Graduate or Postgraduate; marketing, business, or a related field preferred",
    experience: "6 months–2 years; skilled freshers may apply",
    salary: "Not specified",
    location: "Not specified",
    tags: ["SEO", "SEM", "Google Ads", "Meta Ads", "Google Analytics", "Canva", "CRM"],
    description: [
      "Plan, execute, and manage online marketing campaigns.",
      "Increase brand awareness, generate leads, and drive website traffic.",
      "Apply basic knowledge of SEO and SEM.",
      "Support social media marketing and campaign management.",
      "Work with Google Ads and Meta Ads.",
      "Use tools such as Google Analytics and Canva or Photoshop.",
      "CRM tool knowledge is optional.",
      "Performance incentives, training, development, and growth opportunities are listed as benefits."
    ],
    disclaimer:
      "Job requirements and benefits should be confirmed with the employer before applying."
  },
  {
    id: 15,
    company: "Blip Snip Consulting",
    title: "SEO & Social Media Executive",
    category: "Non-IT",
    industry: "Miscellaneous",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Graduate",
    experience: "0–1 year",
    salary: "₹1.18–1.2 LPA",
    location: "7th Block, Jayanagar, Bengaluru",
    tags: ["SEO", "Social Media Marketing", "Content Creation", "Audience Engagement", "Search Rankings"],
    description: [
      "Manage the company's social media presence.",
      "Create and curate engaging social media content.",
      "Interact with audiences and improve engagement.",
      "Collaborate on SEO strategies to improve website search rankings.",
      "Help optimize website content and improve organic search visibility."
    ],
    disclaimer:
      "Salary, location, and availability are based on the supplied job description and should be verified before applying."
  },
  {
    id: 16,
    company: "Cumulations",
    title: "SEO Executive",
    category: "Non-IT",
    industry: "IT Services & Consulting",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Graduate or Postgraduate; an engineering degree is preferred",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Off-Page SEO", "Technical SEO", "Google Analytics", "Search Console", "Ahrefs", "HTML", "CSS", "WordPress"],
    description: [
      "Build backlinks and implement off-page SEO strategies.",
      "Apply technical SEO knowledge to identify website issues.",
      "Use Google Analytics, Google Search Console, Ahrefs, and other SEO tools.",
      "Understand basic HTML, CSS, and WordPress.",
      "Generate inbound leads through SEO activities.",
      "Manage and maintain the company website.",
      "Regularly identify and resolve website issues.",
      "Develop and execute a content strategy.",
      "Improve website rankings and organic traffic on search engine results pages.",
      "Coordinate and manage freelance content writers.",
      "Work independently and collaboratively with the team."
    ],
    disclaimer:
      "Job details and availability may change. Confirm the latest information with the company before applying."
  },
  {
    id: 17,
    company: "Dailyliv India",
    title: "Digital Marketing Executive",
    category: "Non-IT",
    industry: "Electronics Manufacturing",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Graduate or Postgraduate; marketing or communications preferred",
    experience: "0–3 years",
    salary: "Not specified",
    location: "Not specified",
    tags: ["SEO", "SEM", "Google Ads", "Meta Ads", "WhatsApp Marketing", "Analytics", "Canva"],
    description: [
      "Plan and execute SEO, SEM, and social media marketing campaigns.",
      "Manage the company's LinkedIn, Instagram, YouTube, and Facebook presence.",
      "Create engaging digital content, reels, and blogs.",
      "Run and optimize Google Ads, Meta Ads, and WhatsApp marketing campaigns.",
      "Track campaign performance using Google Analytics and Meta Business Suite.",
      "Research trends and strategies to improve digital presence.",
      "Collaborate with design and technical teams on website improvements and landing pages.",
      "Maintain marketing dashboards and prepare weekly reports.",
      "Use copywriting, storytelling, Canva, Excel, Google Sheets, and campaign tracking tools."
    ],
    disclaimer:
      "This listing was aggregated from an external source. Confirm the latest role details and availability before applying."
  },
  {
    id: 18,
    company: "Deevia Software India",
    title: "HR Intern - Recruitment & HR Operations",
    category: "Non-IT",
    industry: "Recruitment / Staffing",
    department: "Human Resources",
    employmentType: "Full Time, Permanent",
    roleCategory: "Recruitment & Talent Acquisition",
    education: "Any Graduate or Postgraduate in HR, Business Administration, Management, or a related field",
    experience: "0–1 year; freshers encouraged to apply",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Recruitment", "Talent Acquisition", "HR Operations", "MS Excel", "Onboarding", "Communication"],
    description: [
      "Source candidates through job portals, social media, referrals, and internal databases.",
      "Screen resumes and shortlist suitable candidates.",
      "Coordinate interviews with candidates and hiring managers.",
      "Communicate interview schedules, feedback, and offers.",
      "Maintain recruitment trackers and hiring reports.",
      "Support offer rollouts, joining follow-ups, and documentation.",
      "Assist with onboarding, document collection, and induction coordination.",
      "Maintain employee records, HR databases, attendance, and leave information.",
      "Assist with offer letters, appointment letters, HR communications, and basic HR MIS reporting.",
      "Support employee engagement initiatives and basic statutory documentation.",
      "Use MS Excel, Word, email etiquette, coordination, and follow-up skills.",
      "Maintain confidentiality and work effectively with the HR team."
    ],
    disclaimer:
      "Job details and availability may change. Confirm the latest information with the company before applying."
  },
  {
    id: 19,
    company: "Dietiq",
    title: "Digital Marketing Executive",
    category: "Non-IT",
    industry: "Software Product",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Postgraduate",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Digital Marketing", "Social Media", "Content Creation", "SEO", "SEM", "Email Marketing"],
    description: [
      "Support marketing campaigns for DietIQ, an AI-powered health and nutrition platform.",
      "Manage and grow the company's social media presence.",
      "Support digital content creation.",
      "Assist with SEO and SEM activities.",
      "Support email marketing campaigns and related marketing activities."
    ],
    disclaimer:
      "The supplied description does not specify salary, experience, or location. Confirm these details with the company before applying."
  },
  {
    id: 20,
    company: "ECS Fin",
    title: "Digital Marketing Executive",
    category: "Non-IT",
    industry: "IT Services & Consulting",
    department: "Marketing & Communication",
    employmentType: "Full Time, Permanent",
    roleCategory: "Digital Marketing",
    education: "Any Graduate or Postgraduate",
    experience: "Not specified",
    salary: "Not specified",
    location: "Not specified",
    tags: ["Digital Marketing", "Social Media", "Website Analytics", "Campaign Management", "KPI Reporting"],
    description: [
      "Develop and implement digital marketing strategies to achieve business goals.",
      "Analyze website traffic and online engagement metrics.",
      "Collaborate with cross-functional teams to execute marketing campaigns.",
      "Stay updated with digital marketing trends and best practices.",
      "Manage and optimize social media presence across platforms.",
      "Monitor key performance indicators and prepare reports.",
      "Use data-driven insights to recommend future campaign improvements."
    ],
    disclaimer:
      "This listing and its location details were aggregated from an external source. Verify current role details and availability before applying."
  }
];

const getInitials = (name) => {

  if (!name) return "S";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {

    return parts[0].substring(0, 2).toUpperCase();

  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();

};



/* ============================================================
   STATIC ENROLLMENT NOTIFICATION POPUP
   ============================================================ */

const STATIC_ENROLLMENT_STUDENTS = [
  { name: "Akash", course: "Full Stack Java Development" },
  { name: "manoj", course: "Python & Data Science AI" },
  { name: "Rahul", course: "React & Modern Web Frontend" },
  { name: "Priya", course: "Software Testing & Automation QA" },
  { name: "Sneha", course: "DevOps & Cloud Architecture" },
  { name: "Amit", course: "Full Stack Java Development" },
  { name: "Neha", course: "React & Modern Web Frontend" },
  { name: "Rohit", course: "Python & Data Science AI" },
  { name: "Pooja", course: "Software Testing & Automation QA" },
  { name: "Vikas", course: "DevOps & Cloud Architecture" },
];

function EnrollmentNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer;
    let showTimer;

    // Show the first notification after the dashboard loads.
    showTimer = setTimeout(() => {
      setVisible(true);
    }, 700);

    const interval = setInterval(() => {
      setVisible(false);

      hideTimer = setTimeout(() => {
        setCurrentIndex((previousIndex) => {
          return (
            (previousIndex + 1) % STATIC_ENROLLMENT_STUDENTS.length
          );
        });

        setVisible(true);
      }, 500);
    }, 4500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const student = STATIC_ENROLLMENT_STUDENTS[currentIndex];

  return (
    <div
      className="d-flex justify-content-end mb-3"
      aria-live="polite"
      aria-atomic="true"
    >
      <motion.div
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          x: visible ? 0 : 35,
          scale: visible ? 1 : 0.96,
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: "340px",
          maxWidth: "100%",
          pointerEvents: "none",
          visibility: visible ? "visible" : "hidden",
        }}
        className="bg-white border rounded-4 shadow-lg p-3"
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "46px",
              height: "46px",
              background: "#fff5d6",
              color: "#b8860b",
            }}
          >
            <GraduationCap size={25} />
          </div>

          <div className="flex-grow-1 overflow-hidden">
            <div
              className="fw-bold text-dark"
              style={{ fontSize: "14px" }}
            >
              {student.name} enrolled!
            </div>

            <div
              className="text-secondary mt-1"
              style={{
                fontSize: "12px",
                lineHeight: 1.5,
                overflowWrap: "anywhere",
              }}
            >
              Course: {student.course}
            </div>

            <div
              className="d-flex align-items-center gap-1 mt-2"
              style={{ fontSize: "11px", color: "#198754" }}
            >
              <CheckCircle size={13} />
              Welcome to SVR EdTech 
            </div>
          </div>

          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "25px",
              height: "25px",
              background: "#e8f8ee",
              color: "#198754",
              fontWeight: "bold",
            }}
          >
            ✓
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================

   MAIN DASHBOARD COMPONENT

   ============================================================ */



export default function StudentDashboard() {



  const navigate = useNavigate();



  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("All");
  const [jobSearch, setJobSearch] = useState("");
  const [expandedJobIds, setExpandedJobIds] = useState([1]);



  /* ==========================================================

     FETCH DASHBOARD DATA

     ========================================================== */



  const loadDashboard = useCallback(

    async (showRefreshLoader = false) => {

      try {

        if (showRefreshLoader) {

          setRefreshing(true);

        } else {

          setLoading(true);

        }



        setError("");



        const response = await getStudentDashboard();



        if (response?.success && response?.data) {

          setDashboard(response.data);

        } else {

          throw new Error(response?.message || "Failed to load dashboard data.");

        }

      } catch (err) {

        console.error("STUDENT DASHBOARD ERROR:", err);

        setError(

          err?.response?.data?.message ||

          err?.message ||

          "Failed to load dashboard."

        );

      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },

    []

  );



  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);



  /* ==========================================================

     LOADING UI

     ========================================================== */



  if (loading) {

    return (

      <div

        className="d-flex justify-content-center align-items-center"

        style={{

          minHeight: "100vh",

          background: "linear-gradient(180deg, #f8fbff 0%, #eef2f7 100%)",

        }}

      >

        <div className="text-center p-5 bg-white shadow-lg rounded-5" style={{ maxWidth: "420px" }}>

          <div

            className="spinner-border text-warning mb-3"

            style={{ width: "3.5rem", height: "3.5rem", borderWidth: "4px" }}

          />

          <h4 className="fw-bold text-dark mb-2">Loading Dashboard</h4>

          <p className="text-muted small mb-0">Fetching SVR training content and placement data...</p>

        </div>

      </div>

    );

  }



  /* ==========================================================

     ERROR UI

     ========================================================== */



  if (error && !dashboard) {

    return (

      <div

        className="d-flex justify-content-center align-items-center p-4"

        style={{

          minHeight: "100vh",

          background: "#f8fafc",

        }}

      >

        <motion.div

          initial={{ opacity: 0, scale: 0.9 }}

          animate={{ opacity: 1, scale: 1 }}

          className="card border-0 shadow-lg rounded-5 text-center p-5"

          style={{ maxWidth: "480px" }}

        >

          <div

            className="mx-auto mb-4 rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center"

            style={{ width: "72px", height: "72px" }}

          >

            <XCircle size={36} className="text-danger" />

          </div>

          <h4 className="fw-bold text-dark mb-2">Unable to Load Dashboard</h4>

          <p className="text-muted small mb-4">{error}</p>

          <button

            type="button"

            className="btn btn-warning fw-bold rounded-3 px-4 py-2"

            onClick={() => loadDashboard()}

          >

            <RefreshCw size={17} className="me-2" />

            Try Again

          </button>

        </motion.div>

      </div>

    );

  }



  /* ==========================================================

     SAFE DATA ASSIGNMENT

     ========================================================== */



  const student = dashboard?.student || {};

  const filteredJobs = JOB_OPENINGS.filter((job) => {
  const matchesCategory =
    jobCategoryFilter === "All" ||
    job.category === jobCategoryFilter;

  const query = jobSearch.trim().toLowerCase();

  const matchesSearch =
    !query ||
    [
      job.title,
      job.company,
      job.industry,
      job.department,
      job.roleCategory,
      job.education,
      job.experience,
      job.location,
      ...job.tags,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);

  return matchesCategory && matchesSearch;
});

function toggleJobDetails(jobId) {
  setExpandedJobIds((previous) =>
    previous.includes(jobId)
      ? previous.filter((id) => id !== jobId)
      : [...previous, jobId]
  );
}


  return (

    <div

      className="container-fluid py-3 px-2 px-md-4"

      style={{

        minHeight: "100vh",

        background: "linear-gradient(180deg, #f4f7fc 0%, #eef2f8 100%)",

      }}

    >

      <motion.div

        variants={containerVariants}

        initial="hidden"

        animate="visible"

        className="container-fluid p-0"

      >



        {/* =====================================================

            REDESIGNED PROFESSIONAL PROFILE BANNER / NAVBAR

            ===================================================== */}

{/* =====================================================
    SVR EDTECH ACADEMY WELCOME ANNOUNCEMENT TICKER
    ===================================================== */}

<motion.div
  variants={itemVariants}
  className="mb-4 overflow-hidden bg-white border rounded-3 shadow-sm"
  aria-label="SVR EdTech Academy announcements"
  style={{
    borderColor: "#f3e4b5",
    minHeight: "42px",
  }}
>
  <motion.div
    className="d-flex align-items-center gap-5 py-2 px-3"
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 28,
        ease: "linear",
      },
    }}
    style={{
      width: "max-content",
      whiteSpace: "nowrap",
    }}
  >
    {[1, 2].map((copy) => (
      <React.Fragment key={copy}>
        <span
          className="d-inline-flex align-items-center gap-2 fw-semibold small"
          style={{ color: "#b8860b" }}
        >
          <Sparkles size={15} />
          Welcome to SVR EdTech 
        </span>

        <span
          className="d-inline-flex align-items-center gap-2 fw-semibold small"
          style={{ color: "#b8860b" }}
        >
          <Award size={15} />
          Excellence in Online &amp; Classroom IT Training
        </span>

        <span
          className="d-inline-flex align-items-center gap-2 fw-semibold small"
          style={{ color: "#b8860b" }}
        >
          <GraduationCap size={15} />
          Hands-on training, expert mentorship, and placement assistance
        </span>

        <span
          className="d-inline-flex align-items-center gap-2 fw-semibold small"
          style={{ color: "#b8860b" }}
        >
          <Briefcase size={15} />
          Explore the latest career opportunities
        </span>
      </React.Fragment>
    ))}
  </motion.div>
</motion.div>

        <motion.div

          variants={itemVariants}

          className="card border-0 shadow-lg mb-5 overflow-hidden position-relative"

          style={{

            borderRadius: "24px",

            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",

            borderLeft: "8px solid #ffc107",

          }}

        >

          {/* Subtle Background Glow Accent */}

          <div

            className="position-absolute"

            style={{

              top: "-60px",

              right: "-60px",

              width: "260px",

              height: "260px",

              background: "radial-gradient(circle, rgba(255,193,7,0.18) 0%, rgba(0,0,0,0) 70%)",

              borderRadius: "50%",

              pointerEvents: "none",

            }}

          />



          <div className="card-body p-4 p-lg-4 position-relative" style={{ zIndex: 2 }}>

            <div className="row align-items-center justify-content-between g-4">



              {/* Profile Left: Avatar & Details */}

              <div className="col-lg-7">

                <div className="d-flex align-items-center gap-3 gap-md-4">



                  {/* Glowing Circular Avatar */}

                  <div className="position-relative flex-shrink-0">

                    {student.avatar ? (

                      <img

                        src={student.avatar}

                        alt={student.name}

                        className="rounded-circle border border-3 border-warning shadow"

                        style={{

                          width: "78px",

                          height: "78px",

                          objectFit: "cover",

                        }}

                      />

                    ) : (

                      <div

                        className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold shadow"

                        style={{

                          width: "78px",

                          height: "78px",

                          fontSize: "1.75rem",

                        }}

                      >

                        {getInitials(student.name)}

                      </div>

                    )}

                    <span

                      className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"

                      style={{ width: "16px", height: "16px" }}

                      title="Active Status"

                    />

                  </div>



                  {/* Name, Role & Email */}

                  <div>

                    <div className="d-flex align-items-center flex-wrap gap-2 mb-1">

                      <h3 className="fw-extrabold text-white mb-0" style={{ letterSpacing: "-0.5px" }}>

                        {student.name || "Student Portal"}

                      </h3>

                      <span

                        className="badge bg-warning text-dark fw-extrabold px-3 py-1 rounded-pill shadow-sm"

                        style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}

                      >

                        {student.role || "SVR TRAINEE"}

                      </span>

                    </div>



                    <div className="d-flex align-items-center gap-3 text-light opacity-75 small">

                      <span className="d-flex align-items-center gap-1">

                        <Mail size={14} className="text-warning" />

                        {student.email || "student@svrportal.com"}

                      </span>

                      {/* <span className="d-flex align-items-center gap-1">

                        <ShieldCheck size={14} className="text-success" />

                        Verified Account

                      </span> */}

                    </div>

                  </div>



                </div>

              </div>



              {/* Profile Right: Quick Actions */}

              <div className="col-lg-5">

                <div className="d-flex justify-content-lg-end align-items-center gap-3 flex-wrap">

                  <motion.button

                    whileHover={{ scale: 1.04 }}

                    whileTap={{ scale: 0.96 }}

                    type="button"

                    className="btn btn-warning fw-bold text-dark px-4 py-2.5 rounded-4 shadow-sm d-flex align-items-center gap-2"

                    onClick={() => navigate("/student/assessments")}

                  >

                    <BookOpen size={17} />

                    Assessments

                  </motion.button>



                  <motion.button

                    whileHover={{ scale: 1.04 }}

                    whileTap={{ scale: 0.96 }}

                    type="button"

                    className="btn btn-outline-light fw-semibold px-4 py-2.5 rounded-4 d-flex align-items-center gap-2"

                    onClick={() => loadDashboard(true)}

                    disabled={refreshing}

                  >

                    <RefreshCw size={17} className={refreshing ? "spin" : ""} />

                    Refresh

                  </motion.button>

                </div>

              </div>



            </div>

          </div>

        </motion.div>


<EnrollmentNotification />


        {/* =====================================================

            SVR COURSES SECTION (FULL HEIGHT & RICH DETAIL CONTENT)

            ===================================================== */}



        <motion.div variants={itemVariants} className="mb-5">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>

              <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-1">

                Featured Programs

              </span>

              <h4 className="fw-bold text-dark mb-0">

                SVR Training Offerings

              </h4>

            </div>

          </div>



          {/* Marquee Carousel Container for Courses */}

          <div

            className="position-relative overflow-hidden py-3"

            style={{

              maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",

              WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",

            }}

          >

            <motion.div

              className="d-flex gap-4"

              animate={{

                x: ["0%", "-50%"],

              }}

              transition={{

                x: {

                  repeat: Infinity,

                  repeatType: "loop",

                  duration: 35,

                  ease: "linear",

                },

              }}

              style={{

                width: "max-content",

              }}

            >

              {[...SVR_COURSES, ...SVR_COURSES].map((course, idx) => (

                <motion.div

                  key={`${course.id}-${idx}`}

                  whileHover={{ y: -10, scale: 1.02 }}

                  className="card border-0 shadow-lg p-4 flex-shrink-0 position-relative d-flex flex-column"

                  style={{

                    width: "380px",

                    borderRadius: "24px",

                    background: course.bgGradient,

                    borderTop: `5px solid ${course.borderColor}`,

                  }}

                >

                  {/* Header */}

                  <div className="d-flex justify-content-between align-items-start mb-3">

                    <div

                      className="rounded-4 bg-white shadow-sm d-flex align-items-center justify-content-center p-2"

                      style={{ width: "52px", height: "52px" }}

                    >

                      {course.icon}

                    </div>

                    <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill">

                      {course.duration}

                    </span>

                  </div>



                  {/* Title & Mode */}

                  <h4 className="fw-bold text-dark mb-1">

                    {course.title}

                  </h4>

                  <div className="text-muted small fw-medium mb-3">

                    <span className="text-warning-emphasis fw-bold">Mode:</span> {course.mode}

                  </div>



                  <p className="text-secondary small mb-3" style={{ minHeight: "48px", lineHeight: "1.5" }}>

                    {course.description}

                  </p>



                  {/* Highlights List */}

                  <div className="mb-3 pt-2 border-top">

                    <span className="d-block fw-bold small text-dark mb-2">Key Highlights:</span>

                    {course.highlights.map((item, i) => (

                      <div key={i} className="d-flex align-items-center gap-2 mb-1">

                        <CheckCircle size={14} className="text-success flex-shrink-0" />

                        <span className="small text-muted">{item}</span>

                      </div>

                    ))}

                  </div>



                  {/* Tech Stack Tags */}

                  <div className="d-flex flex-wrap gap-1 mb-4 mt-auto">

                    {course.tags.map((tag, tIdx) => (

                      <span

                        key={tIdx}

                        className="badge bg-white text-dark shadow-sm px-2 py-1 border"

                        style={{ fontSize: "0.75rem", borderRadius: "8px" }}

                      >

                        {tag}

                      </span>

                    ))}

                  </div>



                  {/* Footer Action Button */}

                  <div className="pt-3 border-top d-flex align-items-center justify-content-between">

                    <span className="small text-success fw-bold">✓ Hiring Assistance</span>

                    {/* <button

                      type="button"

                      className="btn btn-warning fw-bold text-dark px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"

                      onClick={() => navigate("/student/courses")}

                    >

                      More <ArrowRight size={15} />

                    </button> */}

                  </div>

                </motion.div>

              ))}

            </motion.div>

          </div>

        </motion.div>





        {/* =====================================================

            SVR PLACEMENT CARDS

            ===================================================== */}



        <motion.div variants={itemVariants} className="mb-5">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>

              <span className="badge bg-success text-white fw-bold px-3 py-1 rounded-pill mb-1">

                <Award size={14} className="me-1" />

                Placement Success

              </span>

              <h4 className="fw-bold text-dark mb-0">

                Our Placed Students

              </h4>

            </div>

          </div>



          {/* Marquee Carousel Container for Placements */}

          <div

            className="position-relative overflow-hidden py-3"

            style={{

              maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",

              WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",

            }}

          >

            <motion.div

              className="d-flex gap-4"

              animate={{

                x: ["0%", "-50%"],

              }}

              transition={{

                x: {

                  repeat: Infinity,

                  repeatType: "loop",

                  duration: 32,

                  ease: "linear",

                },

              }}

              style={{

                width: "max-content",

              }}

            >

              {[...SVR_PLACEMENTS, ...SVR_PLACEMENTS].map((studentItem, idx) => (

                <motion.div

                  key={`${studentItem.id}-${idx}`}

                  whileHover={{ y: -8, scale: 1.02 }}

                  className="card border-0 shadow-lg flex-shrink-0 text-center overflow-hidden"

                  style={{

                    width: "280px",

                    borderRadius: "24px",

                    background: "#ffffff",

                  }}

                >

                  {/* Top Green Banner with LPA Badge Tag */}

                  <div

                    className="position-relative p-4"

                    style={{

                      background: "linear-gradient(180deg, #4d8c52 0%, #3d7241 100%)",

                      height: "100px",

                    }}

                  >

                    {/* Ribbon Tag in Top Right */}

                    <div

                      className="position-absolute end-0 top-0 text-dark fw-bold px-2 py-1 shadow-sm d-flex flex-column align-items-center justify-content-center"

                      style={{

                        background: "#cceabb",

                        borderBottomLeftRadius: "8px",

                        fontSize: "0.85rem",

                        lineHeight: "1.1",

                        minWidth: "55px",

                        paddingTop: "6px",

                      }}

                    >

                      <span className="fw-extrabold">{studentItem.lpa}</span>

                      <span style={{ fontSize: "0.65rem" }}>LPA</span>

                    </div>



                    {/* Circular Avatar

                    <div

                      className="position-absolute start-50 translate-middle-x"

                      style={{ bottom: "-42px" }}

                    >

                      {studentItem.avatar ? (

                        <img

                          src={studentItem.avatar}

                          alt={studentItem.name}

                          className="rounded-circle border border-4 border-white shadow"

                          style={{ width: "84px", height: "84px", objectFit: "cover" }}

                        />

                      ) : (

                        <div

                          className="rounded-circle bg-secondary-subtle border border-4 border-white shadow text-secondary d-flex align-items-center justify-content-center fw-bold"

                          style={{ width: "84px", height: "84px", fontSize: "1.8rem" }}

                        >

                          👤

                        </div>

                      )}

                    </div> */}

                  </div>



                  {/* Card Body Information */}

                  <div className="card-body pt-5 pb-3 px-3">

                    <h5 className="fw-bold text-dark mb-0 mt-2">

                      {studentItem.name}

                    </h5>



                    {/* Congratulation Cursive Script Text */}

                    <div

                      className="my-1 fw-normal"

                      style={{

                        fontFamily: "'Brush Script MT', 'Dancing Script', cursive",

                        fontSize: "1.5rem",

                        color: "#539158",

                      }}

                    >

                      Congratulation

                    </div>



                    {/* Role Pill Badge */}

                    <div className="mb-3">

                      <span

                        className="badge bg-white text-success border border-success-subtle fw-semibold px-3 py-2 rounded-pill"

                        style={{ fontSize: "0.78rem" }}

                      >

                        {studentItem.role}

                      </span>

                    </div>

                  </div>



                  {/* Light Green Footer Bar */}

                  <div

                    className="py-2.5 px-3 fw-bold"

                    style={{

                      background: "#cceabb",

                      color: "#1e4620",

                      fontSize: "0.95rem",

                    }}

                  >

                    Placed at: <span className="fw-extrabold text-uppercase">{studentItem.company}</span>

                  </div>

                </motion.div>

              ))}

            </motion.div>

          </div>

        </motion.div>





                {/* =====================================================
            JOB OPENINGS — SEARCH + IT / NON-IT FILTER
            ===================================================== */}
        <motion.section variants={itemVariants} className="mb-5">
  <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
    <div>
      <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-2">
        Career Opportunities
      </span>
      <h4 className="fw-bold text-dark mb-1">Latest Job Openings</h4>
      
    </div>

    <div className="d-flex flex-wrap gap-2">
      <input
        type="search"
        className="form-control"
        style={{ minWidth: "220px", maxWidth: "100%" }}
        placeholder="Search company, role, skill..."
        aria-label="Search job openings"
        value={jobSearch}
        onChange={(event) => setJobSearch(event.target.value)}
      />

      <select
        className="form-select"
        style={{ width: "150px" }}
        aria-label="Filter jobs by category"
        value={jobCategoryFilter}
        onChange={(event) => setJobCategoryFilter(event.target.value)}
      >
        <option value="All">All Jobs</option>
        <option value="IT">IT</option>
        <option value="Non-IT">Non-IT</option>
      </select>
    </div>
  </div>

  <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
    {["All", "IT", "Non-IT"].map((category) => (
      <button
        key={category}
        type="button"
        className={`btn btn-sm rounded-pill px-3 ${
          jobCategoryFilter === category
            ? "btn-dark"
            : "btn-outline-secondary"
        }`}
        onClick={() => setJobCategoryFilter(category)}
      >
        {category === "All" ? "All Jobs" : category}
      </button>
    ))}

    {/* <span className="small text-muted ms-1">
      {filteredJobs.length} jobs found
    </span> */}
  </div>

  <style>{`
    @keyframes studentJobsMoveRight {
      from { transform: translateX(-50%); }
      to { transform: translateX(0); }
    }

    .student-jobs-viewport {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 18px 12px 30px;
      scrollbar-width: thin;
      scrollbar-color: #adb5bd transparent;
    }

    .student-jobs-track {
      display: flex;
      width: max-content;
      gap: 24px;
      animation: studentJobsMoveRight 48s linear infinite;
    }

    .student-jobs-viewport:hover .student-jobs-track,
    .student-jobs-viewport:focus-within .student-jobs-track {
      animation-play-state: paused;
    }

    .student-job-card {
      width: 360px;
      max-width: calc(100vw - 56px);
      flex: 0 0 360px;
      background: #fff;
      box-shadow:
        0 14px 34px rgba(15, 23, 42, 0.18),
        0 5px 12px rgba(15, 23, 42, 0.09);
      transition: box-shadow 0.25s ease, transform 0.25s ease;
    }

    .student-job-card:hover {
      box-shadow:
        0 22px 46px rgba(15, 23, 42, 0.25),
        0 8px 18px rgba(15, 23, 42, 0.13);
      transform: translateY(-5px);
    }

    .student-job-description {
      max-height: 300px;
      overflow-y: auto;
    }

    @media (max-width: 575.98px) {
      .student-job-card {
        width: 300px;
        flex-basis: 300px;
      }

      .student-jobs-track {
        gap: 16px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .student-jobs-track {
        animation: none;
        transform: none;
      }
    }
  `}</style>

  {filteredJobs.length === 0 ? (
    <div className="card border-0 shadow-lg rounded-4 p-5 text-center">
      <Briefcase size={34} className="text-muted mx-auto mb-3" />
      <h5 className="fw-bold">No jobs found</h5>
      <p className="text-muted mb-3">
        Try a different search term or category.
      </p>
      <button
        type="button"
        className="btn btn-outline-primary rounded-pill align-self-center"
        onClick={() => {
          setJobSearch("");
          setJobCategoryFilter("All");
        }}
      >
        Clear Filters
      </button>
    </div>
  ) : (
    <div className="student-jobs-viewport" aria-label="Moving job cards">
      <div className="student-jobs-track">
        {[...filteredJobs, ...filteredJobs].map((job, index) => {
          const isExpanded = expandedJobIds.includes(job.id);

          return (
            <motion.article
              key={`${job.id}-${index}`}
              whileHover={{ y: -5 }}
              className="card student-job-card border-0 rounded-4 overflow-hidden"
              style={{ 
                borderTop: `5px solid ${
                  job.category === "IT" ? "#5d59c8" : "#198754"
                }`,
              }}
            >
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        background:
                          job.category === "IT" ? "#efedff" : "#e8f7ee",
                        color:
                          job.category === "IT" ? "#5d59c8" : "#198754",
                      }}
                    >
                      {job.category === "IT" ? (
                        <Code2 size={23} />
                      ) : (
                        <Briefcase size={23} />
                      )}
                    </div>

                    <div>
                      <h5 className="fw-bold text-dark mb-1">
                        {job.title}
                      </h5>
                      <div className="text-muted small">
                        {job.company}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge rounded-pill ${
                      job.category === "IT"
                        ? "bg-primary-subtle text-primary"
                        : "bg-success-subtle text-success"
                    }`}
                  >
                    {job.category}
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-light text-secondary border">
                    {job.industry}
                  </span>
                  <span className="badge bg-light text-secondary border">
                    {job.employmentType}
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge rounded-pill bg-white text-dark border px-2 py-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="small text-muted mb-3">
                  {job.experience !== "Not specified" && (
                    <div>
                      <strong>Experience:</strong> {job.experience}
                    </div>
                  )}
                  {job.salary !== "Not specified" && (
                    <div>
                      <strong>Salary:</strong> {job.salary}
                    </div>
                  )}
                  {job.location !== "Not specified" && (
                    <div>
                      <strong>Location:</strong> {job.location}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill px-3 align-self-start mt-auto"
                  onClick={() => toggleJobDetails(job.id)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded
                    ? "Hide Job Description"
                    : "View Job Description"}
                  <i
                    className={`bi ${
                      isExpanded ? "bi-chevron-up" : "bi-chevron-down"
                    } ms-2`}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded && (
                  <div className="student-job-description mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-2">Job Description</h6>

                    <ul className="ps-3 mb-3">
                      {job.description.map((item, descriptionIndex) => (
                        <li
                          className="small text-secondary mb-2"
                          key={descriptionIndex}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="row g-3 small mb-3">
                      <div className="col-12">
                        <span className="text-muted d-block">
                          Department
                        </span>
                        <strong>{job.department}</strong>
                      </div>

                      <div className="col-12">
                        <span className="text-muted d-block">
                          Role Category
                        </span>
                        <strong>{job.roleCategory}</strong>
                      </div>

                      <div className="col-12">
                        <span className="text-muted d-block">
                          Education
                        </span>
                        <strong>{job.education}</strong>
                      </div>
                    </div>

                    <div className="alert alert-secondary small mb-0">
                      <strong>Disclaimer: </strong>
                      {job.disclaimer}
                    </div>
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  )}

  <p className="text-muted small text-center mt-2 mb-0">
    Cards move from left to right. Hover over the cards to pause the animation.
  </p>
</motion.section>

{/* Keep your existing TOP HIRING COMPANIES TICKER section below this */}

        {/* =====================================================
            TOP HIRING COMPANIES TICKER (FULL SHADOW ANIMATED CARDS)

            ===================================================== */}



        <motion.div variants={itemVariants} className="mb-4">

          <div className="d-flex align-items-center gap-2 mb-3">

            <Building2 size={22} className="text-warning" />

            <h4 className="fw-bold text-dark mb-0">

               Hiring Company
            </h4>

          </div >



          <div

            className="position-relative overflow-hidden py-3"

            style={{

              maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",

              WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",

            }}

          >

            <motion.div

              className="d-flex gap-4"

              animate={{

                x: ["0%", "-50%"],

              }}

              transition={{

                x: {

                  repeat: Infinity,

                  repeatType: "loop",

                  duration: 25,

                  ease: "linear",

                },

              }}

              style={{

                width: "max-content",

              }}

            >

              {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((company, cIdx) => (

                <motion.div

                  key={`${company.id}-${cIdx}`}

                  whileHover={{ y: -6, scale: 1.03 }}

                  className="card border-0 shadow-lg p-3 rounded-4 flex-shrink-0 d-flex flex-column justify-content-between"

                  style={{

                    background: company.bg,

                    borderTop: `4px solid ${company.color}`,

                    width: "220px",

                    minHeight: "110px",

                  }}

                >

                  <div className="d-flex justify-content-between align-items-center mb-2">

                    <span className="fw-extrabold tracking-wide fs-5" style={{ color: company.color }}>

                      {company.name}

                    </span>

                    <span className="badge bg-white text-dark shadow-sm px-2 py-1" style={{ fontSize: "0.7rem" }}>

                      Active

                    </span>

                  </div>



                  <div>

                    <div className="small text-muted fw-medium">{company.type}</div>

                    <div className="fw-bold text-dark small" style={{ fontSize: "0.8rem" }}>

                      {company.hires}

                    </div>

                  </div>

                </motion.div>

              ))}

            </motion.div>

          </div>

        </motion.div>


      </motion.div>





      {/* =======================================================

          CUSTOM CSS FOR ANIMATION

          ======================================================= */}

      <style>

        {`

          .spin {

            animation: dashboardSpin 0.9s linear infinite;

          }



          @keyframes dashboardSpin {

            from {

              transform: rotate(0deg);

            }

            to {

              transform: rotate(360deg);

            }

          }

        `}

      </style>

    </div>

  );

}