import React from "react";

export default function InternshipCard({ program, onViewDetails }) {
  return (
    <div className="internship-card">
      <div className="internship-card-content">
        <div className="internship-card-top">
          <span className="internship-domain">
            {program.domain}
          </span>

          {program.status === "active" && (
            <span className="internship-active">
              Active
            </span>
          )}
        </div>

        <h2>{program.title}</h2>

        {program.description && (
          <p className="internship-description">
            {program.description}
          </p>
        )}

        <div className="internship-card-info">
          {program.duration && (
            <span>
              <strong>Duration:</strong> {program.duration}
            </span>
          )}

          {program.eligibility && (
            <span>
              <strong>Eligibility:</strong>{" "}
              {program.eligibility}
            </span>
          )}
        </div>

        <button
          type="button"
          className="internship-view-btn"
          onClick={() => onViewDetails(program)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}