import React from "react";

export default function InstructorLayout({
  children,
}) {
  return (
    <div className="min-vh-100 bg-light">

      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">

          <span className="navbar-brand fw-bold text-primary">
            <i className="bi bi-mortarboard-fill me-2"></i>
            LMS Instructor
          </span>

        </div>
      </nav>

      <main className="container-fluid p-4">
        {children}
      </main>

    </div>
  );
}