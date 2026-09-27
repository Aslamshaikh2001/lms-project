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
  updateQuestion,
} from "../../../services/questionService";


export default function EditQuestion() {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    form,
    setForm,
  ] = useState(null);


  // ==================================================
  // LOAD QUESTION
  // ==================================================

  useEffect(() => {

    const loadQuestion =
      async () => {

        try {

          setLoading(true);


          const response =
            await getQuestionById(
              id
            );


          const data =
            response.data;


          setForm({

            assessment:
              data.assessment?._id ||
              data.assessment ||
              "",

            questionText:
              data.questionText ||
              "",

            questionType:
              data.questionType ||
              "MCQ",

            options:
              data.options ||
              [],

            correctAnswer:
              Array.isArray(
                data.correctAnswer
              )
                ? data.correctAnswer.join(
                    ", "
                  )
                : data.correctAnswer ||
                  "",

            marks:
              data.marks ?? 1,

            negativeMarks:
              data.negativeMarks ?? 0,

            explanation:
              data.explanation ||
              "",

            order:
              data.order ?? 0,

            isRequired:
              data.isRequired !== false,

          });

        } catch (err) {

          console.error(
            "Load question error:",
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


    if (id) {
      loadQuestion();
    }

  }, [id]);


  // ==================================================
  // FIELD CHANGE
  // ==================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;


      setForm(
        (previous) => ({

          ...previous,

          [name]:
            type === "checkbox"
              ? checked
              : value,

        })
      );
    };


  // ==================================================
  // OPTION TEXT
  // ==================================================

  const handleOptionText =
    (
      index,
      value
    ) => {

      setForm(
        (previous) => {

          const options =
            [
              ...previous.options,
            ];


          options[index] = {
            ...options[index],
            text: value,
          };


          return {
            ...previous,
            options,
          };

        }
      );
    };


  // ==================================================
  // CORRECT OPTION
  // ==================================================

  const handleCorrectOption =
    (index) => {

      setForm(
        (previous) => {

          const options =
            [
              ...previous.options,
            ];


          if (
            previous.questionType ===
            "MCQ"
          ) {

            options.forEach(
              (
                option,
                optionIndex
              ) => {

                option.isCorrect =
                  optionIndex ===
                  index;

              }
            );

          } else {

            options[index] = {

              ...options[index],

              isCorrect:
                !options[index]
                  .isCorrect,

            };

          }


          return {
            ...previous,
            options,
          };

        }
      );
    };


  // ==================================================
  // TYPE CHANGE
  // ==================================================

  const handleTypeChange =
    (e) => {

      const type =
        e.target.value;


      let options =
        [];

      let correctAnswer =
        "";


      if (
        type === "MCQ" ||
        type ===
          "MULTIPLE_SELECT"
      ) {

        options = [
          {
            text: "",
            isCorrect: true,
          },
          {
            text: "",
            isCorrect: false,
          },
        ];

      }


      if (
        type === "TRUE_FALSE"
      ) {

        options = [

          {
            text: "True",
            isCorrect: true,
          },

          {
            text: "False",
            isCorrect: false,
          },

        ];

      }


      setForm(
        (previous) => ({

          ...previous,

          questionType:
            type,

          options,

          correctAnswer,

        })
      );
    };


  // ==================================================
  // ADD OPTION
  // ==================================================

  const addOption =
    () => {

      setForm(
        (previous) => ({

          ...previous,

          options: [
            ...previous.options,

            {
              text: "",
              isCorrect: false,
            },

          ],

        })
      );
    };


  // ==================================================
  // REMOVE OPTION
  // ==================================================

  const removeOption =
    (index) => {

      if (
        form.options.length <= 2
      ) {
        return;
      }


      setForm(
        (previous) => ({

          ...previous,

          options:
            previous.options.filter(
              (
                _,
                optionIndex
              ) =>
                optionIndex !==
                index
            ),

        })
      );
    };


  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");


      try {

        setSubmitting(true);


        const payload = {

          assessment:
            form.assessment,

          questionText:
            form.questionText,

          questionType:
            form.questionType,

          options:
            form.options,

          correctAnswer:
            form.correctAnswer,

          marks:
            Number(form.marks),

          negativeMarks:
            Number(
              form.negativeMarks
            ),

          explanation:
            form.explanation,

          order:
            Number(form.order),

          isRequired:
            form.isRequired,

        };


        await updateQuestion(
          id,
          payload
        );


        navigate(
          `/admin/questions/${id}`
        );

      } catch (err) {

        console.error(
          "Update question error:",
          err
        );


        setError(
          err.response?.data
            ?.message ||
          "Failed to update question"
        );

      } finally {

        setSubmitting(false);

      }
    };


  // ==================================================
  // LOADING
  // ==================================================

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


  if (!form) {

    return (

      <div className="container py-5 text-center">

        <h4>
          Question not found
        </h4>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(
              "/admin/questions"
            )
          }
        >
          Back
        </button>

      </div>

    );
  }


  return (

    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h1 className="h3 fw-bold">
            Edit Question
          </h1>

          <p className="text-muted mb-0">
            Update question information
          </p>

        </div>


        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate(
              `/admin/questions/${id}`
            )
          }
        >
          Back
        </button>

      </div>


      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* QUESTION */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Question Text
              </label>

              <textarea
                className="form-control"
                rows="5"
                name="questionText"
                value={
                  form.questionText
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            <div className="row g-3">

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Question Type
                </label>

                <select
                  className="form-select"
                  value={
                    form.questionType
                  }
                  onChange={
                    handleTypeChange
                  }
                >

                  <option value="MCQ">
                    Multiple Choice
                  </option>

                  <option value="MULTIPLE_SELECT">
                    Multiple Select
                  </option>

                  <option value="TRUE_FALSE">
                    True / False
                  </option>

                  <option value="SHORT_ANSWER">
                    Short Answer
                  </option>

                  <option value="LONG_ANSWER">
                    Long Answer
                  </option>

                </select>

              </div>


              <div className="col-md-3">

                <label className="form-label fw-semibold">
                  Marks
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  name="marks"
                  value={
                    form.marks
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div className="col-md-3">

                <label className="form-label fw-semibold">
                  Negative Marks
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="form-control"
                  name="negativeMarks"
                  value={
                    form.negativeMarks
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

          </div>

        </div>


        {/* OPTIONS */}

        {(
          form.questionType ===
            "MCQ" ||
          form.questionType ===
            "MULTIPLE_SELECT" ||
          form.questionType ===
            "TRUE_FALSE"
        ) && (

          <div className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between mb-3">

                <h5 className="fw-bold">
                  Options
                </h5>


                {form.questionType !==
                  "TRUE_FALSE" && (

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={
                      addOption
                    }
                  >
                    + Add Option
                  </button>

                )}

              </div>


              {form.options.map(
                (
                  option,
                  index
                ) => (

                  <div
                    key={
                      option._id ||
                      index
                    }
                    className="d-flex gap-2 mb-3 align-items-center"
                  >

                    <input
                      type={
                        form.questionType ===
                        "MCQ"
                          ? "radio"
                          : "checkbox"
                      }
                      checked={
                        option.isCorrect
                      }
                      onChange={() =>
                        handleCorrectOption(
                          index
                        )
                      }
                    />


                    <input
                      type="text"
                      className="form-control"
                      value={
                        option.text
                      }
                      onChange={(e) =>
                        handleOptionText(
                          index,
                          e.target.value
                        )
                      }
                      required
                      disabled={
                        form.questionType ===
                        "TRUE_FALSE"
                      }
                    />


                    {form.questionType !==
                      "TRUE_FALSE" &&
                      form.options
                        .length > 2 && (

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          removeOption(
                            index
                          )
                        }
                      >
                        Remove
                      </button>

                    )}

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* SHORT/LONG ANSWER */}

        {(
          form.questionType ===
            "SHORT_ANSWER" ||
          form.questionType ===
            "LONG_ANSWER"
        ) && (

          <div className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-3">
                Correct Answer
              </h5>


              <textarea
                className="form-control"
                rows={
                  form.questionType ===
                  "LONG_ANSWER"
                    ? 6
                    : 3
                }
                name="correctAnswer"
                value={
                  form.correctAnswer
                }
                onChange={
                  handleChange
                }
                required={
                  form.questionType ===
                  "SHORT_ANSWER"
                }
              />

            </div>

          </div>

        )}


        {/* EXPLANATION */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <label className="form-label fw-semibold">
              Explanation
            </label>

            <textarea
              className="form-control"
              rows="4"
              name="explanation"
              value={
                form.explanation
              }
              onChange={
                handleChange
              }
            />

          </div>

        </div>


        {/* SETTINGS */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="row g-3">

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Question Order
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="order"
                  value={
                    form.order
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="col-md-6 d-flex align-items-end">

                <div className="form-check">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isRequired"
                    checked={
                      form.isRequired
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <label className="form-check-label">
                    Required Question
                  </label>

                </div>

              </div>

            </div>

          </div>

        </div>


        <div className="d-flex justify-content-end gap-2">

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() =>
              navigate(
                `/admin/questions/${id}`
              )
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              submitting
            }
          >
            {submitting
              ? "Updating..."
              : "Update Question"}
          </button>

        </div>

      </form>

    </div>
  );
}