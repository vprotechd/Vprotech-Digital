import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { getInternshipPrograms } from "../../services/internshipService";
import { createTest } from "../../services/testService";

import "./CreateTest.css";

export default function CreateTest() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    program: "",
    duration: 30,
    passingPercentage: 50,
    status: "draft",
    questions: [],
  });

  // =====================================================
  // LOAD INTERNSHIP PROGRAMS
  // =====================================================

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await getInternshipPrograms();

        const availablePrograms =
          data?.programs || data?.data || [];

        setPrograms(availablePrograms);

        if (availablePrograms.length === 0) {
          toast.error(
            data?.message ||
              "No internship programs are available. Create a program before creating a test."
          );
        }
      } catch (error) {
        console.error("Failed to load internship programs:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to load internship programs"
        );
      } finally {
        setLoadingPrograms(false);
      }
    };

    loadPrograms();
  }, []);

  // =====================================================
  // BASIC FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          order: prev.questions.length + 1,
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE QUESTION
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
  // QUESTION CHANGE
  // =====================================================

  const handleQuestionChange = (index, field, value) => {
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
  // OPTION CHANGE
  // =====================================================

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setForm((prev) => {
      const questions = [...prev.questions];

      const options = [...questions[questionIndex].options];

      options[optionIndex] = value;

      questions[questionIndex] = {
        ...questions[questionIndex],
        options,
      };

      return {
        ...prev,
        questions,
      };
    });
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Please enter test title");
      return false;
    }

    if (!form.program) {
      toast.error("Please select an internship program");
      return false;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      toast.error("Please enter a valid test duration");
      return false;
    }

    if (
      form.passingPercentage === "" ||
      Number(form.passingPercentage) < 0 ||
      Number(form.passingPercentage) > 100
    ) {
      toast.error("Passing percentage must be between 0 and 100");
      return false;
    }

    if (form.questions.length === 0) {
      toast.error("Please add at least one question");
      return false;
    }

    for (let i = 0; i < form.questions.length; i++) {
      const question = form.questions[i];

      if (!question.questionText.trim()) {
        toast.error(`Please enter question ${i + 1}`);
        return false;
      }

      if (question.options.some((option) => !option.trim())) {
        toast.error(`Please complete all options for question ${i + 1}`);
        return false;
      }

      if (!question.correctAnswer) {
        toast.error(`Please select correct answer for question ${i + 1}`);
        return false;
      }

      if (!question.marks || Number(question.marks) <= 0) {
        toast.error(`Please enter valid marks for question ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const totalMarks = form.questions.reduce(
        (total, question) => total + Number(question.marks),
        0
      );
      const payload = {
        title: form.title.trim(),
        program: form.program,
        duration: Number(form.duration),
        totalMarks,
        passingMarks: Math.ceil(
          (totalMarks * Number(form.passingPercentage)) / 100
        ),
        status: form.status,

        questions: form.questions.map((question, index) => ({
          questionText: question.questionText.trim(),
          options: question.options.map((option) => option.trim()),
          correctAnswer: question.correctAnswer,
          marks: Number(question.marks),
          order: index + 1,
        })),
      };

      await createTest(payload);

      toast.success(
        form.status === "published"
          ? "Test published successfully"
          : "Test saved as draft"
      );

      navigate("/admin/tests");
    } catch (error) {
      console.error("Create test error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create test"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="create-test-page">

      {/* HEADER */}
      <div className="create-test-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/admin/tests")}
        >
          <ArrowLeft size={18} />
          Back to Tests
        </button>

        <div>
          <h1>Create Internship Test</h1>
          <p>
            Create questions and publish an online test for students.
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>

        {/* =================================================
            TEST DETAILS
        ================================================= */}

        <div className="test-card">

          <div className="card-title">
            <h2>Test Details</h2>
            <p>Basic information about this test</p>
          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>Test Title *</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. MERN Stack Internship Test"
              />
            </div>

            <div className="form-group">

              <label>Internship Program *</label>

              {loadingPrograms ? (
                <div className="loading-select">
                  <Loader2 size={18} className="spin" />
                  Loading programs...
                </div>
              ) : (
                <select
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                >
                  <option value="">
                    Select internship program
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
              )}

            </div>

            <div className="form-group">

              <label>Duration (Minutes) *</label>

              <input
                type="number"
                name="duration"
                min="1"
                value={form.duration}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>Passing Percentage *</label>

              <input
                type="number"
                name="passingPercentage"
                min="0"
                max="100"
                value={form.passingPercentage}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

            </div>

          </div>

        </div>

        {/* =================================================
            QUESTIONS
        ================================================= */}

        <div className="questions-section">

          <div className="questions-header">

            <div>
              <h2>Questions</h2>

              <p>
                Add MCQ questions for this internship test.
              </p>
            </div>

            <button
              type="button"
              className="add-question-btn"
              onClick={addQuestion}
            >
              <Plus size={18} />
              Add Question
            </button>

          </div>

          {form.questions.length === 0 ? (
            <div className="empty-questions">

              <div className="empty-icon">
                <Plus size={28} />
              </div>

              <h3>No Questions Added</h3>

              <p>
                Click "Add Question" to create the first question.
              </p>

              <button
                type="button"
                className="empty-add-btn"
                onClick={addQuestion}
              >
                <Plus size={17} />
                Add First Question
              </button>

            </div>
          ) : (
            <div className="questions-list">

              {form.questions.map((question, questionIndex) => (

                <div
                  className="question-card"
                  key={questionIndex}
                >

                  <div className="question-card-header">

                    <div className="question-number">
                      Question {questionIndex + 1}
                    </div>

                    <button
                      type="button"
                      className="delete-question"
                      onClick={() =>
                        removeQuestion(questionIndex)
                      }
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>

                  </div>

                  <div className="form-group">

                    <label>Question *</label>

                    <textarea
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "questionText",
                          e.target.value
                        )
                      }
                      placeholder="Enter your question..."
                      rows="3"
                    />

                  </div>

                  <div className="options-grid">

                    {question.options.map(
                      (option, optionIndex) => {

                        const optionLetter =
                          String.fromCharCode(
                            65 + optionIndex
                          );

                        return (
                          <div
                            className="option-group"
                            key={optionIndex}
                          >

                            <label>
                              Option {optionLetter} *
                            </label>

                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter option ${optionLetter}`}
                            />

                          </div>
                        );
                      }
                    )}

                  </div>

                  <div className="question-bottom">

                    <div className="form-group">

                      <label>Correct Answer *</label>

                      <select
                        value={question.correctAnswer}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select correct option
                        </option>

                        {question.options.map(
                          (option, optionIndex) => {

                            if (!option.trim()) return null;

                            const letter =
                              String.fromCharCode(
                                65 + optionIndex
                              );

                            return (
                              <option
                                key={optionIndex}
                                value={option}
                              >
                                Option {letter}: {option}
                              </option>
                            );
                          }
                        )}

                      </select>

                    </div>

                    <div className="form-group marks-group">

                      <label>Marks *</label>

                      <input
                        type="number"
                        min="1"
                        value={question.marks}
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

                </div>

              ))}

            </div>
          )}

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="create-test-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/tests")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="draft-btn"
            disabled={saving}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                status: "draft",
              }))
            }
          >
            {saving ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <Save size={18} />
            )}

            Save Draft
          </button>

          <button
            type="submit"
            className="publish-btn"
            disabled={saving}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                status: "published",
              }))
            }
          >
            {saving ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <Send size={18} />
            )}

            Publish Test
          </button>

        </div>

      </form>

    </div>
  );
}