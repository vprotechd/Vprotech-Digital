
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import API from "../../services/api";
import "./AdmissionManagement.css";

const getAdmissionNumber = (admission, index) => {
  const admissionNumber = String(admission.admissionNumber || "").trim();

  if (admissionNumber && !/^(?:ADM-)?[a-f\d]{24}$/i.test(admissionNumber)) {
    return admissionNumber;
  }

  return `ADM-${String(index + 1).padStart(3, "0")}`;
};

const getPreviousExperience = (admission) =>
  [
    admission.previousExperience,
    admission.experience,
    admission.workExperience,
  ].find((value) => typeof value === "string" && value.trim())?.trim() || "—";

const AdmissionManagement = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ALL ADMISSIONS
  const fetchAdmissions = async () => {
    try {
      setLoading(true);

      const response = await API.get("/admissions");

      setAdmissions(response.data.admissions || []);
    } catch (error) {
      console.error("Admission fetch error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to load admission records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // EXPORT ALL ADMISSIONS TO EXCEL
  const exportToExcel = () => {
    if (!admissions.length) {
      alert("No admission records available to export.");
      return;
    }

    const excelData = admissions.map((item, index) => ({
      "Sr. No.": index + 1,
      "Admission Number": getAdmissionNumber(item, index),
      "Student Name": item.studentName || "",
      "Father / Guardian Name": item.fatherName || "",
      "Date of Birth": item.dateOfBirth
        ? new Date(item.dateOfBirth).toLocaleDateString("en-IN")
        : "",
      Gender: item.gender || "",
      "Aadhaar Last 4 Digits": item.aadhaarLast4 || "",
      "Contact Number": item.contactNumber || "",
      Email: item.email || "",
      Qualification: item.qualification || "",
      "Training Course": item.trainingCourse || "",
      Duration: item.duration || "",
      "Previous Experience": getPreviousExperience(item),
      "Batch / Timing": item.batchTiming || "",
      "Admission Fee": item.admissionFee ?? 0,
      "Training Fee": item.trainingFee ?? 0,
      "Registration Fee": item.registrationFee ?? 0,
      "Temporary Address": item.temporaryAddress || "",
      "Permanent Address": item.permanentAddress || "",
      "Committee Report": item.committeeReport || "",
      "Application Date": item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-IN")
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 35 },
      { wch: 35 },
      { wch: 30 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Student Admissions"
    );

    const date = new Date().toISOString().split("T")[0];

    XLSX.writeFile(
      workbook,
      `VProTech_Admissions_${date}.xlsx`
    );
  };

  if (loading) {
    return (
      <div className="admission-loading">
        Loading admission records...
      </div>
    );
  }

  return (
    <div className="admission-management">

      {/* HEADER */}
      <div className="admission-header">
        <div>
          <h2>Admission Management</h2>
          <p>
            View all student admission details and download records.
          </p>
        </div>

        <div className="admission-header-actions">
          <button
            className="admission-refresh-btn"
            onClick={fetchAdmissions}
          >
            ↻ Refresh
          </button>

          <button
            className="export-excel-btn"
            onClick={exportToExcel}
            disabled={!admissions.length}
          >
            ↓ Export to Excel
          </button>
        </div>
      </div>

      {/* TOTAL RECORDS */}
      <div className="admission-total">
        <div>
          <h3>{admissions.length}</h3>
          <p>Total Student Admissions</p>
        </div>
      </div>

      {/* ALL ADMISSION DETAILS */}
      <div className="admission-table-wrapper">
        <table className="admission-table">

          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Admission No.</th>
              <th>Student Name</th>
              <th>Father / Guardian Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Aadhaar Last 4 Digits</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Qualification</th>
              <th>Training Course</th>
              <th>Duration</th>
              <th>Previous Experience</th>
              <th>Batch / Timing</th>
              <th>Admission Fee</th>
              <th>Training Fee</th>
              <th>Registration Fee</th>
              <th>Temporary Address</th>
              <th>Permanent Address</th>
              <th>Committee Report</th>
              <th>Application Date</th>
            </tr>
          </thead>

          <tbody>
            {admissions.length > 0 ? (
              admissions.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{getAdmissionNumber(item, index)}</td>
                  <td>{item.studentName || "—"}</td>
                  <td>{item.fatherName || "—"}</td>

                  <td>
                    {item.dateOfBirth
                      ? new Date(item.dateOfBirth).toLocaleDateString("en-IN")
                      : "—"}
                  </td>

                  <td>{item.gender || "—"}</td>
                  <td>{item.aadhaarLast4 || "—"}</td>
                  <td>{item.contactNumber || "—"}</td>
                  <td>{item.email || "—"}</td>
                  <td>{item.qualification || "—"}</td>
                  <td>{item.trainingCourse || "—"}</td>
                  <td>{item.duration || "—"}</td>
                  <td>{getPreviousExperience(item)}</td>
                  <td>{item.batchTiming || "—"}</td>
                  <td>₹{item.admissionFee ?? 0}</td>
                  <td>₹{item.trainingFee ?? 0}</td>
                  <td>₹{item.registrationFee ?? 0}</td>
                  <td>{item.temporaryAddress || "—"}</td>
                  <td>{item.permanentAddress || "—"}</td>
                  <td>{item.committeeReport || "—"}</td>

                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="21" className="admission-empty">
                  No admission records found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <p className="admission-record-count">
        Showing all {admissions.length} student admission records.
      </p>

    </div>
  );
};

export default AdmissionManagement;
