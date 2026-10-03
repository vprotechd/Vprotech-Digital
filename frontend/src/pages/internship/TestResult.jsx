import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Trophy,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

import "./TestResult.css";

export default function TestResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;

  // If result data is missing
  if (!result) {
    return (
      <div className="test-result-page">
        <div className="result-card">
          <XCircle size={60} className="result-error-icon" />

          <h1>Result Not Available</h1>

          <p>
            Test result information could not be found.
          </p>

          <button
            onClick={() => navigate(`/internship/${id}`)}
            className="result-primary-btn"
          >
            <ArrowLeft size={18} />
            Back to Internship
          </button>
        </div>
      </div>
    );
  }

  const passed =
    result.passed === true ||
    result.status === "passed";

  return (
    <div className="test-result-page">

      <div className="result-card">

        {/* ICON */}
        <div
          className={`result-icon-wrapper ${
            passed ? "passed" : "failed"
          }`}
        >
          {passed ? (
            <Trophy size={55} />
          ) : (
            <XCircle size={55} />
          )}
        </div>

        {/* TITLE */}
        <h1>
          {passed
            ? "Congratulations!"
            : "Test Completed"}
        </h1>

        <p className="result-submission-confirmation">
          You have successfully submitted your test.
        </p>

        <p className="result-message">
          {passed
            ? "You have successfully passed the internship test."
            : "You did not achieve the required passing percentage."}
        </p>

        {/* STATUS */}
        <div
          className={`result-status ${
            passed ? "status-passed" : "status-failed"
          }`}
        >
          {passed ? (
            <>
              <CheckCircle size={18} />
              PASSED
            </>
          ) : (
            <>
              <XCircle size={18} />
              FAILED
            </>
          )}
        </div>

        {/* SCORE */}
        <div className="score-section">

          <div className="score-circle">

            <div className="score-number">
              {result.percentage ?? 0}%
            </div>

            <div className="score-label">
              Score
            </div>

          </div>

        </div>

        {/* RESULT DETAILS */}
        <div className="result-stats">

          <div className="result-stat">
            <span>Marks Obtained</span>
            <strong>
              {result.score ?? 0}
            </strong>
          </div>

          <div className="result-stat">
            <span>Total Marks</span>
            <strong>
              {result.totalMarks ?? 0}
            </strong>
          </div>

          <div className="result-stat">
            <span>Percentage</span>
            <strong>
              {result.percentage ?? 0}%
            </strong>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="result-actions">

          <button
            className="result-secondary-btn"
            onClick={() => navigate(`/internship/${id}`)}
          >
            <ArrowLeft size={18} />
            Back to Internship
          </button>

          {!passed && (
            <button
              className="result-primary-btn"
              onClick={() => navigate(`/internship/${id}/test`)}
            >
              <RotateCcw size={18} />
              View Test
            </button>
          )}

        </div>

      </div>

    </div>
  );
}