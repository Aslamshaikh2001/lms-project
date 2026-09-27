import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import {
  getAdminStudentById,
} from "../../../services/adminStudentService";


export default function StudentDetails() {

  const {
    studentId,
  } = useParams();

  const navigate =
    useNavigate();

  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ====================================================
  // LOAD STUDENT
  // ====================================================

  useEffect(() => {

    const loadStudent =
      async () => {

        try {

          setLoading(true);
          setError("");

          const response =
            await getAdminStudentById(
              studentId
            );

          if (!response?.success) {
            throw new Error(
              response?.message ||
              "Unable to fetch student."
            );
          }

          setStudent(
            response.data
          );

        } catch (err) {

          console.error(
            "STUDENT DETAILS ERROR:",
            err
          );

          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Unable to load student."
          );

        } finally {

          setLoading(false);

        }

      };

    loadStudent();

  }, [studentId]);


  // ====================================================
  // DATE FORMAT
  // ====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "-";
    }

    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="container-fluid py-5 text-center"
      >

        <div
          className="spinner-border text-primary mb-3"
        />

        <div
          className="text-muted"
        >
          Loading student...
        </div>

      </div>

    );

  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (

      <div
        className="container-fluid px-4 py-4"
      >

        <button
          type="button"
          className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2"
          onClick={() =>
            navigate(
              "/admin/students"
            )
          }
        >

          <FiArrowLeft />

          Back to Students

        </button>


        <div
          className="alert alert-danger"
        >
          {error}
        </div>

      </div>

    );

  }


  if (!student) {
    return null;
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="container-fluid px-3 px-md-4 py-4"
    >

      {/* BACK */}

      <button
        type="button"
        className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2"
        onClick={() =>
          navigate(
            "/admin/students"
          )
        }
      >

        <FiArrowLeft />

        Back to Students

      </button>


      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="card border-0 shadow-sm mb-4"
      >

        <div
          className="card-body p-4"
        >

          <div
            className="d-flex flex-column flex-md-row align-items-md-center gap-4"
          >

            {/* PROFILE */}

            <div
              className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center overflow-hidden"
              style={{
                width: 90,
                height: 90,
                flexShrink: 0,
              }}
            >

              {student.profileImage ? (

                <img
                  src={
                    student.profileImage
                  }
                  alt={
                    student.name
                  }
                  className="w-100 h-100 object-fit-cover"
                />

              ) : (

                <span
                  className="fs-1 fw-bold"
                >
                  {student.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </span>

              )}

            </div>


            <div
              className="flex-grow-1"
            >

              <h2
                className="fw-bold mb-1"
              >
                {student.name}
              </h2>

              <p
                className="text-muted mb-2"
              >
                {student.email}
              </p>


              <div
                className="d-flex flex-wrap gap-2"
              >

                <span
                  className="badge bg-primary-subtle text-primary"
                >
                  {student.role}
                </span>


                {student.isEmailVerified ? (

                  <span
                    className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1"
                  >
                    <FiCheckCircle />
                    Email Verified
                  </span>

                ) : (

                  <span
                    className="badge bg-warning-subtle text-warning d-inline-flex align-items-center gap-1"
                  >
                    <FiXCircle />
                    Email Not Verified
                  </span>

                )}


                {student.isSuspended ? (

                  <span
                    className="badge bg-danger-subtle text-danger d-inline-flex align-items-center gap-1"
                  >
                    <FiShield />
                    Suspended
                  </span>

                ) : student.isActive ? (

                  <span
                    className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1"
                  >
                    <FiCheckCircle />
                    Active
                  </span>

                ) : (

                  <span
                    className="badge bg-secondary-subtle text-secondary d-inline-flex align-items-center gap-1"
                  >
                    <FiXCircle />
                    Inactive
                  </span>

                )}

              </div>

            </div>

          </div>

        </div>

      </motion.div>


      {/* DETAILS */}

      <div
        className="row g-4"
      >

        {/* PERSONAL INFORMATION */}

        <div
          className="col-12 col-lg-6"
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="card border-0 shadow-sm h-100"
          >

            <div
              className="card-header bg-white border-0"
            >

              <h5
                className="fw-bold mb-0"
              >
                Personal Information
              </h5>

            </div>


            <div
              className="card-body"
            >

              <DetailRow
                icon={<FiUser />}
                label="Full Name"
                value={
                  student.name
                }
              />

              <DetailRow
                icon={<FiMail />}
                label="Email"
                value={
                  student.email
                }
              />

              <DetailRow
                icon={<FiPhone />}
                label="Phone"
                value={
                  student.phone ||
                  "Not provided"
                }
              />

              <DetailRow
                icon={<FiShield />}
                label="Role"
                value={
                  student.role
                }
              />

            </div>

          </motion.div>

        </div>


        {/* ACCOUNT INFORMATION */}

        <div
          className="col-12 col-lg-6"
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 0,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="card border-0 shadow-sm h-100"
          >

            <div
              className="card-header bg-white border-0"
            >

              <h5
                className="fw-bold mb-0"
              >
                Account Information
              </h5>

            </div>


            <div
              className="card-body"
            >

              <DetailRow
                icon={<FiCheckCircle />}
                label="Email Verification"
                value={
                  student.isEmailVerified
                    ? "Verified"
                    : "Not Verified"
                }
              />

              <DetailRow
                icon={<FiShield />}
                label="Account Status"
                value={
                  student.isSuspended
                    ? "Suspended"
                    : student.isActive
                    ? "Active"
                    : "Inactive"
                }
              />

              <DetailRow
                icon={<FiCalendar />}
                label="Registered On"
                value={
                  formatDate(
                    student.createdAt
                  )
                }
              />

              <DetailRow
                icon={<FiCalendar />}
                label="Last Login"
                value={
                  formatDate(
                    student.lastLogin
                  )
                }
              />

            </div>

          </motion.div>

        </div>

      </div>

    </div>

  );
}


// ======================================================
// DETAIL ROW
// ======================================================

function DetailRow({
  icon,
  label,
  value,
}) {

  return (

    <div
      className="d-flex align-items-center gap-3 py-3 border-bottom"
    >

      <div
        className="rounded-3 bg-light text-primary d-flex align-items-center justify-content-center"
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div
        className="flex-grow-1"
      >

        <div
          className="small text-muted"
        >
          {label}
        </div>

        <div
          className="fw-semibold"
        >
          {value}
        </div>

      </div>

    </div>

  );
}