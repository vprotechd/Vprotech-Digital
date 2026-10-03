import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getTestById,
  updateTest,
} from "../../services/testService";

import {
  getInternshipPrograms,
} from "../../services/internshipService";

import "./EditTest.css";

export default function EditTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [programs, setPrograms] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    program: "",
    duration: 30,
    totalMarks: 1,
    passingMarks: 1,
    status: "draft",
    instructions: [],
    questions: [],
  });

  // =====================================================
  // LOAD TEST + PROGRAMS
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        const [testResponse, programsResponse] =
          await Promise.all([
            getTestById(id),
            getInternshipPrograms(),
          ]);

        const test = testResponse?.test;
        const questions =
          testResponse?.questions || [];

        const programsData =
          programsResponse?.programs ||
          programsResponse?.data ||
          [];

        setPrograms(programsData);

        if (!test) {
          toast.error("Test not found");
          navigate("/admin/tests");
          return;
        }

        if (programsData.length === 0) {
          toast.error(
            programsResponse?.message ||
              "No internship programs are available to assign to this test."
          );
        }

        setForm({
          title: test.title || "",
          description: test.description || "",
          program:
            typeof test.program === "object"
              ? test.program?._id
              : test.program || "",
          duration: test.duration || 30,
          totalMarks: test.totalMarks || 1,
          passingMarks:
            test.passingMarks || 1,
          status: test.status || "draft",
          instructions:
            test.instructions || [],
          questions: questions.map(
            (question, index) => ({
              questionText:
                question.questionText || "",
              options:
                question.options?.length
                  ? [...question.options]
                  : ["", ""],
              correctAnswer:
                question.correctAnswer || "",
              marks: question.marks || 1,
              explanation:
                question.explanation || "",
              order:
                question.order || index + 1,
            })
          ),
        });
      } catch (error) {
        console.error(
          "Load edit test error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load test"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  // =====================================================
  // BASIC CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // QUESTION
  // =====================================================

  const handleQuestionChange = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const questions = [...prev.questions];

      questions[index] = {
        ...questions[index],
        [field]: value,
      };

      return {
        ...prev,
        questions,
      };
    });
  };

  // =====================================================
  // OPTION
  // =====================================================

  const handleOptionChange = (
    questionIndex,
    optionIndex,
    value
  ) => {
    setForm((prev) => {
      const questions = [...prev.questions];

      const options = [
        ...questions[questionIndex].options,
      ];

      const oldValue = options[optionIndex];

      options[optionIndex] = value;

      const question = {
        ...questions[questionIndex],
        options,
      };

      // If the old option was the correct answer,
      // clear it when the option text changes.
      if (
        question.correctAnswer === oldValue &&
        oldValue !== value
      ) {
        question.correctAnswer = "";
      }

      questions[questionIndex] = question;

      return {
        ...prev,
        questions,
      };
    });
  };

  // =====================================================
  // ADD QUESTION
  // =====================================================

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
          explanation: "",
          order: prev.questions.length + 1,
        },
      ],
    }));
  };

  // =====================================================
  // DELETE QUESTION
  // =====================================================

  const removeQuestion = (index) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions
        .filter((_, i) => i !== index)
        .map((question, i) => ({
          ...question,
          order: i + 1,
        })),
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Test title is required");
      return false;
    }

    if (!form.program) {
      toast.error(
        "Please select an internship program"
      );
      return false;
    }

    if (
      !form.duration ||
      Number(form.duration) < 1
    ) {
      toast.error(
        "Duration must be at least 1 minute"
      );
      return false;
    }

    if (
      !form.totalMarks ||
      Number(form.totalMarks) < 1
    ) {
      toast.error(
        "Total marks must be at least 1"
      );
      return false;
    }

    if (
      form.passingMarks === "" ||
      Number(form.passingMarks) < 0
    ) {
      toast.error(
        "Passing marks cannot be negative"
      );
      return false;
    }

    if (
      Number(form.passingMarks) >
      Number(form.totalMarks)
    ) {
      toast.error(
        "Passing marks cannot be greater than total marks"
      );
      return false;
    }

    if (form.questions.length === 0) {
      toast.error(
        "At least one question is required"
      );
      return false;
    }

    let questionMarks = 0;

    for (
      let i = 0;
      i < form.questions.length;
      i++
    ) {
      const question = form.questions[i];

      if (!question.questionText.trim()) {
        toast.error(
          `Enter question ${i + 1}`
        );
        return false;
      }

      if (
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        toast.error(
          `Question ${i + 1} needs at least 2 options`
        );
        return false;
      }

      if (
        question.options.some(
          (option) => !option.trim()
        )
      ) {
        toast.error(
          `Complete all options for question ${i + 1}`
        );
        return false;
      }

      if (!question.correctAnswer) {
        toast.error(
          `Select correct answer for question ${
            i + 1
          }`
        );
        return false;
      }

      if (
        !question.options.includes(
          question.correctAnswer
        )
      ) {
        toast.error(
          `Correct answer is invalid for question ${
            i + 1
          }`
        );
        return false;
      }

      if (
        !question.marks ||
        Number(question.marks) < 1
      ) {
        toast.error(
          `Enter valid marks for question ${
            i + 1
          }`
        );
        return false;
      }

      questionMarks += Number(question.marks);
    }

    if (
      questionMarks !== Number(form.totalMarks)
    ) {
      toast.error(
        `Question marks total (${questionMarks}) must equal total marks (${form.totalMarks})`
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description:
          form.description.trim(),
        program: form.program,
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
        passingMarks: Number(
          form.passingMarks
        ),
        status: form.status,
        instructions: form.instructions,
        questions: form.questions.map(
          (question, index) => ({
            questionText:
              question.questionText.trim(),
            options: question.options.map(
              (option) => option.trim()
            ),
            correctAnswer:
              question.correctAnswer.trim(),
            marks: Number(question.marks),
            explanation:
              question.explanation?.trim() || "",
            order: index + 1,
          })
        ),
      };

      await updateTest(id, payload);

      toast.success(
        "Test updated successfully"
      );

      navigate(`/admin/tests/${id}`);
    } catch (error) {
      console.error(
        "Update test error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update test"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="edit-test-loading">
        <Loader2
          size={35}
          className="spin"
        />
        <p>Loading test...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="edit-test-page">

      {/* HEADER */}

      <div className="edit-test-header">

        <button
          className="edit-back-btn"
          onClick={() =>
            navigate(`/admin/tests/${id}`)
          }
        >
          <ArrowLeft size={18} />
          Back to Test
        </button>

        <div>
          <h1>Edit Test</h1>
          <p>
            Update test details and questions.
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>

        {/* TEST DETAILS */}

        <div className="edit-card">

          <h2>Test Details</h2>

          <div className="edit-form-grid">

            <div className="edit-form-group full">
              <label>Test Title *</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="edit-form-group full">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="edit-form-group">
              <label>Internship Program *</label>

              <select
                name="program"
                value={form.program}
                onChange={handleChange}
              >
                <option value="">
                  Select program
                </option>

                {programs.map((program) => (
                  <option
                    key={program._id}
                    value={program._id}
                  >
                    {program.title ||
                      program.name ||
                      program.programName}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-form-group">
              <label>Duration (Minutes) *</label>

              <input
                type="number"
                min="1"
                name="duration"
                value={form.duration}
                onChange={handleChange}
              />
            </div>

            <div className="edit-form-group">
              <label>Total Marks *</label>

              <input
                type="number"
                min="1"
                name="totalMarks"
                value={form.totalMarks}
                onChange={handleChange}
              />
            </div>

            <div className="edit-form-group">
              <label>Passing Marks *</label>

              <input
                type="number"
                min="0"
                name="passingMarks"
                value={form.passingMarks}
                onChange={handleChange}
              />
            </div>

            <div className="edit-form-group">
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

                <option value="closed">
                  Closed
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* QUESTIONS */}

        <div className="edit-card">

          <div className="edit-questions-header">

            <div>
              <h2>Questions</h2>

              <p>
                Update existing questions or add
                new ones.
              </p>
            </div>

            <button
              type="button"
              className="add-edit-question-btn"
              onClick={addQuestion}
            >
              <Plus size={18} />
              Add Question
            </button>

          </div>

          {form.questions.length === 0 ? (
            <div className="no-edit-questions">
              No questions added.
            </div>
          ) : (
            <div className="edit-question-list">

              {form.questions.map(
                (question, questionIndex) => (

                  <div
                    className="edit-question-card"
                    key={questionIndex}
                  >

                    <div className="edit-question-top">

                      <strong>
                        Question{" "}
                        {questionIndex + 1}
                      </strong>

                      <button
                        type="button"
                        className="remove-edit-question"
                        onClick={() =>
                          removeQuestion(
                            questionIndex
                          )
                        }
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Question *
                      </label>

                      <textarea
                        rows="3"
                        value={
                          question.questionText
                        }
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "questionText",
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <div className="edit-options-grid">

                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => {

                          const letter =
                            String.fromCharCode(
                              65 + optionIndex
                            );

                          return (
                            <div
                              className="edit-form-group"
                              key={optionIndex}
                            >

                              <label>
                                Option {letter} *
                              </label>

                              <input
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                              />

                            </div>
                          );
                        }
                      )}

                    </div>

                    <div className="edit-bottom-grid">

                      <div className="edit-form-group">

                        <label>
                          Correct Answer *
                        </label>

                        <select
                          value={
                            question.correctAnswer
                          }
                          onChange={(e) =>
                            handleQuestionChange(
                              questionIndex,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select correct answer
                          </option>

                          {question.options.map(
                            (
                              option,
                              optionIndex
                            ) => {

                              if (
                                !option.trim()
                              ) {
                                return null;
                              }

                              return (
                                <option
                                  key={
                                    optionIndex
                                  }
                                  value={option}
                                >
                                  Option{" "}
                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}{" "}
                                  - {option}
                                </option>
                              );
                            }
                          )}
                        </select>

                      </div>

                      <div className="edit-form-group">

                        <label>
                          Marks *
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={
                            question.marks
                          }
                          onChange={(e) =>
                            handleQuestionChange(
                              questionIndex,
                              "marks",
                              e.target.value
                            )
                          }
                        />

                      </div>

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Explanation
                      </label>

                      <textarea
                        rows="2"
                        value={
                          question.explanation
                        }
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "explanation",
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* ACTIONS */}

        <div className="edit-test-actions">

          <button
            type="button"
            className="edit-cancel-btn"
            onClick={() =>
              navigate(`/admin/tests/${id}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-save-btn"
            disabled={saving}
          >
            {saving ? (
              <Loader2
                size={18}
                className="spin"
              />
            ) : (
              <Save size={18} />
            )}

            {saving
              ? "Updating..."
              : "Update Test"}
          </button>

        </div>

      </form>
    </div>
  );
}