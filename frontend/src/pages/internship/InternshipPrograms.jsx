import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getInternshipPrograms } from "../../services/internshipService";
import InternshipCard from "../../components/internship/InternshipCard";
import "./InternshipPrograms.css";

export default function InternshipPrograms() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInternshipPrograms();

      setPrograms(data?.programs || []);
    } catch (err) {
      console.error("Internship API error:", err);
      console.error("Internship API response:", err?.response?.data);

      const message =
        err?.response?.data?.message ||
        `Unable to load internship programs${
          err?.response?.status
            ? ` (HTTP ${err.response.status})`
            : ""
        }. Please try again.`;

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (program) => {
    navigate(`/internship/${program._id}`);
  };

  return (
    <section className="internship-programs-page">
      <div className="internship-container">
        {/* Header */}
        <div className="internship-page-header">
          <span className="internship-label">INTERNSHIP PROGRAMS</span>

          <h1>Build Your Skills With Our Internship Programs</h1>

        

          <p>
            Please{" "}
            <Link to="/register">register yourself first</Link> to apply for
            an internship and become eligible to take its test.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="internship-state">
            <div className="internship-loader"></div>
            <p>Loading internship programs...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="internship-state internship-error">
            <h3>Something went wrong</h3>
            <p>{error}</p>

            <button onClick={fetchPrograms}>Try Again</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && programs.length === 0 && (
          <div className="internship-state internship-empty">
            <h3>No Internship Programs Available</h3>

            <p>
              New internship programs will be added soon. Please check back
              later.
            </p>
          </div>
        )}

        {/* Programs */}
        {!loading && !error && programs.length > 0 && (
          <div className="internship-programs-grid">
            {programs.map((program) => (
              <InternshipCard
                key={program._id}
                program={program}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}