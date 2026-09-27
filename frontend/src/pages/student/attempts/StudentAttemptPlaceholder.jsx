import React from "react";

import {
  useParams,
} from "react-router-dom";


export default function StudentAttemptPlaceholder() {

  const {
    attemptId,
  } = useParams();


  return (

    <div className="container-fluid px-0">

      <div className="card border-0 shadow-sm">

        <div className="card-body text-center py-5">

          <div className="fs-1 mb-3">
            📝
          </div>

          <h2 className="h4 fw-bold">
            Assessment Started
          </h2>

          <p className="text-muted">
            Your attempt has been created successfully.
          </p>

          <div className="small text-muted">
            Attempt ID:
          </div>

          <div className="fw-semibold mt-1">
            {attemptId}
          </div>

        </div>

      </div>

    </div>

  );
}