import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getQuestionById,
} from "../../../services/questionService";


const typeLabels = {
  MCQ:
    "Multiple Choice",

  MULTIPLE_SELECT:
    "Multiple Select",

  TRUE_FALSE:
    "True / False",

  SHORT_ANSWER:
    "Short Answer",

  LONG_ANSWER:
    "Long Answer",
};


export default function QuestionDetails() {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();


  const [
    question,
    setQuestion,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    const fetchQuestion =
      async () => {

        try {

          const response =
            await getQuestionById(
              id
            );


          setQuestion(
            response.data
          );

        } catch (err) {

          console.error(
            err
          );


          setError(
            err.response?.data
              ?.message ||
            "Failed to load question"
          );

        } finally {

          setLoading(false);

        }
      };


    fetchQuestion();

  }, [id]);


  if (loading) {

    return (

      <div className="container py-5 text-center">

        <div className="spinner-border text-primary" />

        <p className="text-muted mt-3">
          Loading question...
        </p>

      </div>

    );
  }


  if (error || !question) {

    return (

      <div className="container py-5 text-center">

        <div className="fs-1">
          ⚠️
        </div>

        <h4>
          Question Not Found
        </h4>

        <p className="text-muted">
          {error}
        </p>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(
              "/admin/questions"
            )
          }
        >
          Back to Questions
        </button>

      </div>

    );
  }


  return (

    <div className="container py-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h1 className="h3 fw-bold">
            Question Details
          </h1>

          <p className="text-muted mb-0">
            View question information
          </p>

        </div>


        <div className="d-flex gap-2">

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/admin/questions/${id}/edit`
              )
            }
          >
            Edit
          </button>


          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              navigate(
                "/admin/questions"
              )
            }
          >
            Back
          </button>

        </div>

      </div>


      {/* QUESTION */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <h5 className="fw-bold mb-3">
            Question
          </h5>


          <p className="fs-5 mb-0">
            {
              question.questionText
            }
          </p>

        </div>

      </div>


      {/* INFORMATION */}

      <div className="row g-4 mb-4">

        <div className="col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <h5 className="fw-bold border-bottom pb-3">
                Basic Information
              </h5>


              <Info
                label="Assessment"
                value={
                  question
                    .assessment
                    ?.title ||
                  "-"
                }
              />


              <Info
                label="Question Type"
                value={
                  typeLabels[
                    question.questionType
                  ] ||
                  question.questionType
                }
              />


              <Info
                label="Marks"
                value={
                  question.marks
                }
              />


              <Info
                label="Negative Marks"
                value={
                  question.negativeMarks
                }
              />


              <Info
                label="Order"
                value={
                  question.order
                }
              />


              <Info
                label="Required"
                value={
                  question.isRequired
                    ? "Yes"
                    : "No"
                }
              />

            </div>

          </div>

        </div>


        <div className="col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <h5 className="fw-bold border-bottom pb-3">
                Status
              </h5>


              <span
                className={`badge rounded-pill px-3 py-2 ${
                  question.status ===
                  "PUBLISHED"
                    ? "bg-success-subtle text-success"
                    : question.status ===
                      "UNPUBLISHED"
                    ? "bg-warning-subtle text-warning-emphasis"
                    : "bg-secondary-subtle text-secondary"
                }`}
              >
                {
                  question.status
                }
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* OPTIONS */}

      {question.options?.length >
        0 && (

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <h5 className="fw-bold border-bottom pb-3">
              Options
            </h5>


            <div className="d-flex flex-column gap-2">

              {question.options.map(
                (
                  option,
                  index
                ) => (

                  <div
                    key={
                      option._id ||
                      index
                    }
                    className={`border rounded p-3 ${
                      option.isCorrect
                        ? "border-success bg-success-subtle"
                        : ""
                    }`}
                  >

                    <div className="d-flex justify-content-between">

                      <span>

                        <strong>
                          {String.fromCharCode(
                            65 + index
                          )}
                          .
                        </strong>{" "}

                        {
                          option.text
                        }

                      </span>


                      {option.isCorrect && (

                        <span className="badge bg-success">
                          Correct
                        </span>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}


      {/* ANSWER */}

      {question.correctAnswer && (

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <h5 className="fw-bold">
              Correct Answer
            </h5>

            <p className="text-secondary mb-0">
              {
                Array.isArray(
                  question.correctAnswer
                )
                  ? question.correctAnswer.join(
                      ", "
                    )
                  : question.correctAnswer
              }
            </p>

          </div>

        </div>

      )}


      {/* EXPLANATION */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <h5 className="fw-bold">
            Explanation
          </h5>

          <p className="text-secondary mb-0">
            {
              question.explanation ||
              "No explanation provided."
            }
          </p>

        </div>

      </div>

    </div>
  );
}


function Info({
  label,
  value,
}) {

  return (

    <div className="d-flex justify-content-between border-bottom py-3">

      <span className="text-muted">
        {label}
      </span>

      <span className="fw-semibold text-end">
        {value}
      </span>

    </div>

  );
}