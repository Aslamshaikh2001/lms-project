import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiPlus,
  FiEye,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiTrendingUp,
  FiActivity,
  FiBarChart2,
  FiPieChart,
  FiBookOpen,
  FiCheckSquare,
} from "react-icons/fi";

// Mock Student Data
const MOCK_STUDENTS = [
  {
    _id: "1",
    name: "Vanessa Smith",
    email: "vanessa.smith@example.com",
    phone: "+1 000 1234 567 89",
    status: "ACTIVE",
    isActive: true,
    isSuspended: false,
    isEmailVerified: true,
    createdAt: "2025-09-15",
    role: "Graphic Designer",
    course: "UI/UX Masterclass",
  },
  {
    _id: "2",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+1 987 6543 210",
    status: "ACTIVE",
    isActive: true,
    isSuspended: false,
    isEmailVerified: true,
    createdAt: "2025-10-02",
    role: "Web Developer",
    course: "Fullstack React & Node",
  },
  {
    _id: "3",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "+1 555 0192 834",
    status: "INACTIVE",
    isActive: false,
    isSuspended: false,
    isEmailVerified: false,
    createdAt: "2025-11-12",
    role: "Student",
    course: "Python Essentials",
  },
  {
    _id: "4",
    name: "Robert Chen",
    email: "robert.chen@example.com",
    phone: "+1 444 8881 222",
    status: "SUSPENDED",
    isActive: false,
    isSuspended: true,
    isEmailVerified: true,
    createdAt: "2026-01-20",
    role: "Student",
    course: "Data Science Bootcamp",
  },
  {
    _id: "5",
    name: "Emily Watson",
    email: "emily.watson@example.com",
    phone: "+1 333 7772 111",
    status: "ACTIVE",
    isActive: true,
    isSuspended: false,
    isEmailVerified: true,
    createdAt: "2026-02-18",
    role: "Product Designer",
    course: "Figma Advanced",
  },
];

export default function AdminDashboard() {
  // Student Data States
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Quick View Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "ACTIVE" && s.isActive) ||
      (statusFilter === "INACTIVE" && !s.isActive && !s.isSuspended) ||
      (statusFilter === "SUSPENDED" && s.isSuspended);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStatusBadge = (student) => {
    if (student.isSuspended) {
      return {
        text: "Suspended",
        badgeClass: "bg-danger-subtle text-danger border border-danger-subtle",
        icon: <FiShield size={13} />,
      };
    }
    if (!student.isActive) {
      return {
        text: "Inactive",
        badgeClass: "bg-secondary-subtle text-secondary border border-secondary-subtle",
        icon: <FiXCircle size={13} />,
      };
    }
    return {
      text: "Active",
      badgeClass: "bg-success-subtle text-success border border-success-subtle",
      icon: <FiCheckCircle size={13} />,
    };
  };

  const handleOpenQuickView = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStudent(null), 200);
  };

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student._id !== id));
  };

  return (
    <div className="min-vh-100 bg-light p-3 p-md-4">
      {/* PAGE HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark">Dashboard</h1>
          <p className="text-muted small mb-0">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-white border shadow-sm btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-2"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
          >
            <FiRefreshCw size={14} /> Refresh
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-2 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
              border: "none",
            }}
          >
            <FiPlus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* ====================================================
          MULTI-COLOR GRADIENT STAT CARDS
      ==================================================== */}
      <div className="row g-3 mb-4">
        {/* CARD 1: Warm Copper Brown to Deep Magenta/Purple Mix */}
        <div className="col-12 col-sm-6 col-xl-3">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
            style={{
              background:
                "linear-gradient(135deg, #8B3A1C 0%, #A81D52 45%, #9B0F6A 100%)",
            }}
          >
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <div
                  className="small fw-semibold text-uppercase mb-1"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  Total Students
                </div>
                <div className="fs-2 fw-bold mb-0">{students.length}</div>
                <div className="small text-white-50 mt-1 d-flex align-items-center gap-1">
                  <FiTrendingUp className="text-warning" /> +12% this month
                </div>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <FiUsers size={28} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CARD 2: Vibrant Magenta, Pink & Orange Mix */}
        <div className="col-12 col-sm-6 col-xl-3">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
            style={{
              background:
                "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
            }}
          >
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <div
                  className="small fw-semibold text-uppercase mb-1"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  Active Courses
                </div>
                <div className="fs-2 fw-bold mb-0">24</div>
                <div className="small text-white-50 mt-1 d-flex align-items-center gap-1">
                  <FiActivity /> 8 active now
                </div>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <FiBookOpen size={28} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CARD 3: Deep Plum Purple to Crimson Mix */}
        <div className="col-12 col-sm-6 col-xl-3">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
            style={{
              background:
                "linear-gradient(135deg, #701C46 0%, #5C1B5E 35%, #3F1B5C 70%, #B31238 100%)",
            }}
          >
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <div
                  className="small fw-semibold text-uppercase mb-1"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  Assessments
                </div>
                <div className="fs-2 fw-bold mb-0">142</div>
                <div className="small text-white-50 mt-1 d-flex align-items-center gap-1">
                  <FiCheckCircle /> 94% passed
                </div>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <FiCheckSquare size={28} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CARD 4: Vibrant Emerald Mint Green */}
        <div className="col-12 col-sm-6 col-xl-3">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden text-white"
            style={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            }}
          >
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <div
                  className="small fw-semibold text-uppercase mb-1"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  Completion Rate
                </div>
                <div className="fs-2 fw-bold mb-0">88.5%</div>
                <div className="small text-white-50 mt-1 d-flex align-items-center gap-1">
                  <FiTrendingUp /> +4.2% overall
                </div>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <FiBarChart2 size={28} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ====================================================
          ANALYTICS & STATS WIDGETS
      ==================================================== */}
      <div className="row g-3 mb-4">
        {/* Chart Widget 1 */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <FiBarChart2 className="text-primary" size={20} />
                <h6 className="fw-bold mb-0 text-dark">
                  Student Registration Analytics
                </h6>
              </div>
              <span className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-pill small">
                Monthly
              </span>
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center min-vh-25">
              <div className="w-100 d-flex align-items-end justify-content-between gap-2 px-3 pt-4 pb-2" style={{ height: 180 }}>
                {[40, 65, 30, 85, 95, 60, 75, 90, 50, 80, 100, 70].map((val, idx) => (
                  <div key={idx} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.04 }}
                      className="w-100 rounded-top"
                      style={{
                        background: "linear-gradient(180deg, #4f46e5 0%, #818cf8 100%)",
                      }}
                    />
                    <span className="text-muted mt-2" style={{ fontSize: "10px" }}>
                      {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Widget 2 */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center gap-2">
              <FiPieChart className="text-danger" size={20} />
              <h6 className="fw-bold mb-0 text-dark">Course Status Distribution</h6>
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="d-flex justify-content-between small fw-semibold mb-1">
                    <span>UI/UX Design</span>
                    <span className="text-primary">42%</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar bg-primary" style={{ width: "42%" }} />
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between small fw-semibold mb-1">
                    <span>Web Development</span>
                    <span className="text-danger">35%</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div
                      className="progress-bar"
                      style={{ width: "35%", backgroundColor: "#E94057" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between small fw-semibold mb-1">
                    <span>Data Science</span>
                    <span className="text-warning">23%</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar bg-warning" style={{ width: "23%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          REGISTERED STUDENTS DATA TABLE
      ==================================================== */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white border-bottom py-3 px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-0 text-dark">Registered Students</h5>
              <small className="text-muted">
                Manage and inspect student account profiles
              </small>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              {/* Search Input */}
              <div className="input-group input-group-sm" style={{ width: 220 }}>
                <span className="input-group-text bg-light border-end-0">
                  <FiSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Status Dropdown */}
              <select
                className="form-select form-select-sm bg-light"
                style={{ width: 140 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom border-light">
                <tr>
                  <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">
                    Name & Role
                  </th>
                  <th className="py-3 text-secondary small fw-bold text-uppercase">
                    Email & Phone
                  </th>
                  <th className="py-3 text-secondary small fw-bold text-uppercase">
                    Enrolled Course
                  </th>
                  <th className="py-3 text-secondary small fw-bold text-uppercase">
                    Status
                  </th>
                  <th className="text-end px-4 py-3 text-secondary small fw-bold text-uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <FiUsers size={32} className="mb-2 opacity-50" />
                      <div>No student records match your search filter.</div>
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((student, index) => {
                    const statusInfo = getStatusBadge(student);
                    return (
                      <tr key={student._id || index}>
                        {/* NAME */}
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                              style={{
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                                background:
                                  "linear-gradient(135deg, #8B3A1C 0%, #A81D52 100%)",
                              }}
                            >
                              {(student.name.charAt(0) || "S").toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">
                                {student.name}
                              </div>
                              <div className="text-muted small">
                                {student.role}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL & PHONE */}
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-1 text-muted small">
                            <FiMail className="text-primary" /> {student.email}
                          </div>
                          <div className="d-flex align-items-center gap-1 text-muted small mt-1">
                            <FiPhone /> {student.phone}
                          </div>
                        </td>

                        {/* COURSE */}
                        <td className="py-3">
                          <span className="badge bg-light text-dark border fw-medium px-2.5 py-1.5 rounded-2">
                            {student.course}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="py-3">
                          <span
                            className={`badge px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-medium ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.icon}
                            {statusInfo.text}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="text-end px-4 py-3">
                          <div className="d-inline-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-light border text-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                              onClick={() => handleOpenQuickView(student)}
                              title="Quick View"
                            >
                              <FiEye size={15} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-light border text-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                              onClick={() => handleDeleteStudent(student._id)}
                              title="Delete Record"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="card-footer bg-white border-top py-3 px-4 d-flex justify-content-between align-items-center">
          <span className="small text-muted">
            Page {page} of {totalPages}
          </span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary px-3"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <FiChevronLeft /> Prev
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary px-3"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================
          POPUP MODAL
      ==================================================== */}
      <AnimatePresence>
        {isModalOpen && selectedStudent && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ zIndex: 1055 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ backdropFilter: "blur(4px)" }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card border-0 shadow-lg position-relative w-100 rounded-4 overflow-hidden"
              style={{ maxWidth: 480, zIndex: 1060 }}
            >
              <div
                className="card-header text-white border-0 py-3 px-4 d-flex align-items-center justify-content-between"
                style={{
                  background:
                    "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FiUser className="fs-5" />
                  <h5 className="fw-bold mb-0">Student Profile</h5>
                </div>
                <button
                  type="button"
                  className="btn btn-sm text-white-50 border-0 p-1"
                  onClick={handleCloseModal}
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle text-white fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center shadow"
                    style={{
                      width: 72,
                      height: 72,
                      background:
                        "linear-gradient(135deg, #8B3A1C 0%, #A81D52 100%)",
                    }}
                  >
                    <span className="fs-2">
                      {selectedStudent.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h4 className="fw-bold text-dark mb-1">
                    {selectedStudent.name}
                  </h4>
                  <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill small">
                    {selectedStudent.role}
                  </span>
                </div>

                <div className="bg-light rounded-3 p-3 mb-3">
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small mb-1">Email</div>
                      <div className="fw-semibold text-dark text-truncate small">
                        {selectedStudent.email}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small mb-1">Phone</div>
                      <div className="fw-semibold text-dark small">
                        {selectedStudent.phone}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small mb-1">Course</div>
                      <div className="fw-semibold text-dark small">
                        {selectedStudent.course}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small mb-1">Registered</div>
                      <div className="fw-semibold text-dark small">
                        {selectedStudent.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer bg-white border-top py-3 px-4 text-end">
                <button
                  type="button"
                  className="btn btn-light border px-4 fw-medium rounded-3"
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