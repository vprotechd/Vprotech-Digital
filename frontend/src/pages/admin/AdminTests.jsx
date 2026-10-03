
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ClipboardList,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getAllTests,
  deleteTest,
} from "../../services/testService";

import "./AdminTests.css";

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =========================================================
  // FETCH TESTS
  // =========================================================

  const fetchTests = async () => {
    try {
      setLoading(true);

      const data = await getAllTests();

      if (data?.success) {
        setTests(data.tests || []);
      } else {
        toast.error(
          data?.message || "Failed to load tests."
        );
      }
    } catch (error) {
      console.error("Fetch tests error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load tests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // =========================================================
  // DELETE TEST
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test? All questions belonging to this test will also be deleted."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteTest(id);
      setTests((previousTests) =>
        previousTests.filter((test) => test._id !== id)
      );
      toast.success("Test deleted successfully");
    } catch (error) {
      console.error(
        "Delete test error:",
        error?.response?.data || error
      );

      if (error?.response?.status === 404) {
        setTests((previousTests) =>
          previousTests.filter((test) => test._id !== id)
        );
      }

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete test"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "published":
        return "admin-test-status published";

      case "draft":
        return "admin-test-status draft";

      case "closed":
        return "admin-test-status closed";

      default:
        return "admin-test-status";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="admin-tests-page">
        <div className="admin-tests-container">
          <div className="admin-tests-loading">
            <Loader2
              size={30}
              className="admin-tests-spinner"
            />

            <p>Loading tests...</p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <section className="admin-tests-page">
      <div className="admin-tests-container">

        {/* HEADER */}

        <div className="admin-tests-header">

          <div>
            <Link
              to="/admin"
              className="admin-tests-back"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>


            <Link
  to="/admin/test-attempts"
  className="test-results-btn"
>
  <ClipboardList size={18} />
  Test Results
</Link>

            <div className="admin-tests-title-row">
              <div className="admin-tests-icon">
                <ClipboardList size={28} />
              </div>

              <div>
                <h1>Internship Tests</h1>

                <p>
                  Create and manage internship tests
                  for students.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/admin/tests/create"
            className="admin-tests-create-btn"
          >
            <Plus size={19} />
            Create Test
          </Link>

        </div>

        {/* TEST COUNT */}

        <div className="admin-tests-summary">
          <div>
            <span>Total Tests</span>
            <strong>{tests.length}</strong>
          </div>
        </div>

        {/* EMPTY STATE */}

        {tests.length === 0 ? (
          <div className="admin-tests-empty">

            <ClipboardList size={48} />

            <h2>No Tests Found</h2>

            <p>
              You haven't created any internship tests
              yet.
            </p>

            <Link
              to="/admin/tests/create"
              className="admin-tests-create-btn"
            >
              <Plus size={18} />
              Create Your First Test
            </Link>

          </div>
        ) : (
          <div className="admin-tests-table-wrapper">

            <table className="admin-tests-table">

              <thead>
                <tr>
                  <th>Test</th>
                  <th>Internship</th>
                  <th>Duration</th>
                  <th>Marks</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {tests.map((test) => (
                  <tr key={test._id}>

                    {/* TEST */}

                    <td>
                      <div className="admin-test-name">

                        <div className="admin-test-small-icon">
                          <ClipboardList size={18} />
                        </div>

                        <div>
                          <strong>
                            {test.title}
                          </strong>

                          {test.description && (
                            <span>
                              {test.description.length >
                              70
                                ? `${test.description.substring(
                                    0,
                                    70
                                  )}...`
                                : test.description}
                            </span>
                          )}
                        </div>

                      </div>
                    </td>

                    {/* INTERNSHIP */}

                    <td>
                      <div className="admin-test-program">

                        <strong>
                          {test.program?.title ||
                            "N/A"}
                        </strong>

                        {test.program?.domain && (
                          <span>
                            {test.program.domain}
                          </span>
                        )}

                      </div>
                    </td>

                    {/* DURATION */}

                    <td>
                      {test.duration} min
                    </td>

                    {/* MARKS */}

                    <td>
                      <div className="admin-test-marks">
                        <strong>
                          {test.totalMarks}
                        </strong>

                        <span>
                          Pass: {test.passingMarks}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={getStatusClass(
                          test.status
                        )}
                      >
                        {test.status}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="admin-test-actions">

                        <Link
                          to={`/admin/tests/${test._id}`}
                          className="admin-test-action view"
                          title="View Test"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/admin/tests/edit/${test._id}`}
                          className="admin-test-action edit"
                          title="Edit Test"
                        >
                          <Edit size={17} />
                        </Link>

                        <button
                          type="button"
                          className="admin-test-action delete"
                          title="Delete Test"
                          onClick={() =>
                            handleDelete(test._id)
                          }
                          disabled={
                            deletingId === test._id
                          }
                        >
                          {deletingId === test._id ? (
                            <Loader2
                              size={17}
                              className="admin-tests-spinner"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </section>
  );
}