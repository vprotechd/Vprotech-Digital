import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Clock,
  Award,
  CheckCircle,
  Loader2,
  BookOpen,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import { getTestById } from "../../services/testService";

import "./AdminTestDetails.css";

export default function AdminTestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD TEST
  // =====================================================

  useEffect(() => {
    const loadTest = async () => {
      try {
        const data = await getTestById(id);

        console.log("Test details response:", data);

        const testData =
          data?.test ||
          data?.data?.test ||
          data?.data ||
          data;

        setTest(testData);

        setQuestions(
          data?.questions ||
            data?.data?.questions ||
            testData?.questions ||
            []
        );
      } catch (error) {
        console.error("Failed to load test:", error);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load test"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-test-loading">
        <Loader2 size={35} className="spin" />
        <p>Loading test...</p>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!test) {
    return (
      <div className="admin-test-error">
        <h2>Test Not Found</h2>

        <p>
          The requested test could not be found.
        </p>

        <button
          onClick={() => navigate("/admin/tests")}
        >
          <ArrowLeft size={18} />
          Back to Tests
        </button>
      </div>
    );
  }

  // =====================================================
  // PROGRAM NAME
  // =====================================================

  const programName =
    typeof test.program === "object"
      ? test.program?.title ||
        test.program?.name ||
        test.program?.programName ||
        "Internship Program"
      : "Internship Program";

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-test-details-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-test-details-header">

        <button
          className="back-btn"
          onClick={() => navigate("/admin/tests")}
        >
          <ArrowLeft size={18} />
          Back to Tests
        </button>

        <div className="header-main">

          <div>
            <h1>{test.title}</h1>

            <p>
              View complete test information and questions.
            </p>
          </div>

          <button
            className="edit-test-btn"
            onClick={() =>
              navigate(`/admin/tests/edit/${test._id}`)
            }
          >
            <Edit size={18} />
            Edit Test
          </button>

        </div>

      </div>

      {/* =================================================
          TEST INFORMATION
      ================================================= */}

      <div className="test-info-card">

        <div className="test-info-item">

          <div className="info-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Internship Program</span>
            <strong>{programName}</strong>
          </div>

        </div>

        <div className="test-info-item">

          <div className="info-icon">
            <Clock size={20} />
          </div>

          <div>
            <span>Duration</span>
            <strong>
              {test.duration} minutes
            </strong>
          </div>

        </div>

        <div className="test-info-item">

          <div className="info-icon">
            <Award size={20} />
          </div>

          <div>
            <span>Total Marks</span>
            <strong>
              {test.totalMarks}
            </strong>
          </div>

        </div>

        <div className="test-info-item">

          <div className="info-icon">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Passing Marks</span>
            <strong>
              {test.passingMarks}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          STATUS / DATES
      ================================================= */}

      <div className="test-meta-card">

        <div className="meta-item">
          <span>Status</span>

          <span
            className={`test-status status-${test.status}`}
          >
            {test.status}
          </span>
        </div>

        <div className="meta-item">

          <span>
            <Calendar size={16} />
            Start Date
          </span>

          <strong>
            {formatDate(test.startDate)}
          </strong>

        </div>

        <div className="meta-item">

          <span>
            <Calendar size={16} />
            End Date
          </span>

          <strong>
            {formatDate(test.endDate)}
          </strong>

        </div>

      </div>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      {test.description && (
        <div className="details-section">

          <h2>Description</h2>

          <p>{test.description}</p>

        </div>
      )}

      {/* =================================================
          INSTRUCTIONS
      ================================================= */}

      {test.instructions?.length > 0 && (
        <div className="details-section">

          <h2>Instructions</h2>

          <ul>
            {test.instructions.map(
              (instruction, index) => (
                <li key={index}>
                  {instruction}
                </li>
              )
            )}
          </ul>

        </div>
      )}

      {/* =================================================
          QUESTIONS
      ================================================= */}

      <div className="questions-details-section">

        <div className="questions-title">

          <div>
            <h2>Test Questions</h2>

            <p>
              {questions.length} question
              {questions.length !== 1 ? "s" : ""}
            </p>
          </div>

        </div>

        {questions.length === 0 ? (
          <div className="no-questions">
            No questions found for this test.
          </div>
        ) : (
          <div className="admin-question-list">

            {questions.map((question, index) => (

              <div
                className="admin-question-card"
                key={question._id || index}
              >

                <div className="question-heading">

                  <span>
                    Question {index + 1}
                  </span>

                  <span className="question-marks">
                    {question.marks}{" "}
                    {question.marks === 1
                      ? "Mark"
                      : "Marks"}
                  </span>

                </div>

                <h3>
                  {question.questionText}
                </h3>

                <div className="admin-options">

                  {question.options?.map(
                    (option, optionIndex) => {

                      const isCorrect =
                        option ===
                        question.correctAnswer;

                      return (
                        <div
                          key={optionIndex}
                          className={`admin-option ${
                            isCorrect
                              ? "correct-option"
                              : ""
                          }`}
                        >

                          <span className="option-letter">
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                          </span>

                          <span className="option-text">
                            {option}
                          </span>

                          {isCorrect && (
                            <CheckCircle
                              size={18}
                              className="correct-icon"
                            />
                          )}

                        </div>
                      );
                    }
                  )}

                </div>

                {question.explanation && (
                  <div className="question-explanation">

                    <strong>
                      Explanation:
                    </strong>

                    <span>
                      {question.explanation}
                    </span>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}