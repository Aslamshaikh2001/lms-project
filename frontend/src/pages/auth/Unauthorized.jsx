import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">

      <div className="text-center">

        <i className="bi bi-shield-lock text-danger display-1"></i>

        <h1 className="fw-bold mt-3">
          Access Denied
        </h1>

        <p className="text-muted">
          You do not have permission to access this page.
        </p>

        <Link
          to="/login"
          className="btn btn-primary"
        >
          Back to Login
        </Link>

      </div>

    </div>
  );
}