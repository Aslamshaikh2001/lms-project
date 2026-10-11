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
  { id: 1, name: "Techasoft", type: "software development", hires: "30+ Placed", color: "#2874f0", bg: "#f0f5ff" },
  { id: 2, name: "Nextwebi IT Solutions", type: "IT services", hires: "35+ Placed", color: "#198754", bg: "#f0fdf4" },
  { id: 3, name: "Mindroit Technologies", type: "software development", hires: "20+ Placed", color: "#003366", bg: "#f0f8ff" },
  { id: 4, name: "cloud software Solutions", type: "web and mobile app development", hires: "30+ Placed", color: "#004080", bg: "#f0f4f8" },
  { id: 5, name: "Nextbrain Technologies", type: "web and mobile applications", hires: "20+ Placed", color: "#007cc3", bg: "#f0f9ff" },
  { id: 6, name: "Hexaware Technologies", type: "Java, React, backend", hires: "10+ Placed", color: "#34113f", bg: "#f9f0ff" },
  { id: 7, name: "Birlasoft", type: "Java,Web Developer", hires: "30+ Placed", color: "#a100ff", bg: "#fcf0ff" },
  { id: 8, name: "DxMinds", type: "Digital Services", hires: "25+ Placed", color: "#0033a0", bg: "#f0f4ff" },
  { id: 9, name: "Sonata Software", type: "Cloud & AI", hires: "25+ Placed", color: "#052fbe", bg: "#f0f3ff" },
];


/* ============================================================
   HELPERS
   ============================================================ */

const getInitials = (name) => {
  if (!name) return "S";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};


/* ============================================================
   MAIN DASHBOARD COMPONENT
   ============================================================ */

export default function StudentDashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

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
            TOP HIRING COMPANIES TICKER (FULL SHADOW ANIMATED CARDS)
            ===================================================== */}

        <motion.div variants={itemVariants} className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Building2 size={22} className="text-warning" />
            <h4 className="fw-bold text-dark mb-0">
              Our Hiring Partners
            </h4>
          </div>

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