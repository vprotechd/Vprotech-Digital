
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  X,
  RefreshCw,
  GraduationCap,
  Users,
  ImagePlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_URL, studentService, employeeService } from "../../services/api";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import "./RecordManagement.css";

const STUDENT_FIELDS = [
  { name: "studentId", label: "Student ID", required: true },
  { name: "referenceNumber", label: "Reference Number", required: true },
  { name: "firstName", label: "First Name", required: true },
  { name: "lastName", label: "Last Name", required: true },
  { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
  { name: "fatherName", label: "Father's Name" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
  { name: "address", label: "Address", wide: true },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "pinCode", label: "PIN Code" },
  { name: "course", label: "Course", required: true },
  { name: "duration", label: "Duration" },
  { name: "batch", label: "Batch" },
  { name: "trainingMode", label: "Training Mode", type: "select", options: ["Online", "Offline", "Hybrid"] },
  { name: "joiningDate", label: "Joining Date", type: "date" },
  { name: "completionDate", label: "Completion Date", type: "date" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Completed", "Inactive"] },
  { name: "certificateNumber", label: "Certificate Number" },
  { name: "certificateIssueDate", label: "Certificate Issue Date", type: "date" },
  { name: "remarks", label: "Remarks", wide: true },
];

const EMPLOYEE_FIELDS = [
  { name: "employeeId", label: "Employee ID", required: true },
  { name: "firstName", label: "First Name", required: true },
  { name: "lastName", label: "Last Name", required: true },
  { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
  { name: "fatherName", label: "Father's Name" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
  { name: "address", label: "Address", wide: true },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "pinCode", label: "PIN Code" },
  { name: "designation", label: "Designation", required: true },
  { name: "department", label: "Department" },
  { name: "joiningDate", label: "Joining Date", type: "date" },
  { name: "employmentType", label: "Employment Type", type: "select", options: ["Full-time", "Part-time", "Contract", "Internship"] },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Resigned"] },
  { name: "salary", label: "Salary", type: "number" },
  { name: "remarks", label: "Remarks", wide: true },
];

const emptyForm = (type) => {
  const fields = type === "students" ? STUDENT_FIELDS : EMPLOYEE_FIELDS;
  return Object.fromEntries(fields.map((field) => [field.name, ""]));
};

const dateFields = [
  "dateOfBirth",
  "joiningDate",
  "completionDate",
  "certificateIssueDate",
];

const getDateValue = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const getPhotoUrl = (photo) => {
  if (!photo) return "";
  if (/^https?:\/\//i.test(photo)) return photo;

  const serverUrl = API_URL.replace(/\/api\/?$/, "");
  return `${serverUrl}${photo.startsWith("/") ? "" : "/"}${photo}`;
};

export default function RecordManagement({ type }) {
  const isStudent = type === "students";
  const title = isStudent ? "Student Management" : "Employee Management";
  const Service = isStudent ? studentService : employeeService;
  const fields = isStudent ? STUDENT_FIELDS : EMPLOYEE_FIELDS;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(() => emptyForm(type));
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const idField = isStudent ? "studentId" : "employeeId";
  const secondaryField = isStudent ? "course" : "designation";

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = isStudent
        ? await studentService.getAllStudents()
        : await employeeService.getAllEmployees();

      const list = isStudent
        ? response.students || response.data || []
        : response.employees || response.data || [];

      setRecords(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(`Failed to load ${type}:`, error);
      toast.error(error.response?.data?.message || `Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRecords([]);
    setSearch("");
    setStatusFilter("all");
    setShowForm(false);
    setEditingId(null);
    setRecordToDelete(null);
    setForm(emptyForm(type));
    setPhotoFile(null);
    setPhotoPreview("");
    fetchRecords();
    // Fetch when switching between the two management tabs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.firstName,
          record.lastName,
          record[idField],
          record.referenceNumber,
          record.email,
          record.phone,
          record[secondaryField],
        ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter, idField, secondaryField]);

  const resetForm = () => {
    setForm(emptyForm(type));
    setEditingId(null);
    setPhotoFile(null);
    setPhotoPreview("");
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm(emptyForm(type));
    setEditingId(null);
    setPhotoFile(null);
    setPhotoPreview("");
    setShowForm(true);
  };

  const openEditForm = (record) => {
    const nextForm = emptyForm(type);

    fields.forEach((field) => {
      const value = record[field.name];

      nextForm[field.name] = dateFields.includes(field.name)
        ? getDateValue(value)
        : value ?? "";
    });

    setForm(nextForm);
    setEditingId(record._id);
    setPhotoFile(null);
    setPhotoPreview(!isStudent && record.photo ? getPhotoUrl(record.photo) : "");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image");
      event.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = { ...form };

      // Avoid sending empty strings for MongoDB Date and Number fields.
      dateFields.forEach((field) => {
        if (field in payload && !payload[field]) payload[field] = null;
      });

      if (!isStudent && payload.salary === "") {
        payload.salary = null;
      }

      if (!isStudent && photoFile) payload.photo = photoFile;

      if (editingId) {
        if (isStudent) {
          await studentService.updateStudent(editingId, payload);
        } else {
          await employeeService.updateEmployee(editingId, payload);
        }
        toast.success(`${isStudent ? "Student" : "Employee"} updated successfully`);
      } else {
        if (isStudent) {
          await studentService.createStudent(payload);
        } else {
          await employeeService.createEmployee(payload);
        }
        toast.success(`${isStudent ? "Student" : "Employee"} added successfully`);
      }

      resetForm();
      await fetchRecords();
    } catch (error) {
      console.error(`Failed to save ${type}:`, error);
      toast.error(error.response?.data?.message || `Failed to save ${isStudent ? "student" : "employee"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete || deleting) return;

    const record = recordToDelete;
    const name = `${record.firstName || ""} ${record.lastName || ""}`.trim();

    try {
      setDeleting(true);
      if (isStudent) {
        await studentService.deleteStudent(record._id);
      } else {
        await employeeService.deleteEmployee(record._id);
      }

      toast.success(
        `${isStudent ? "Student" : "Employee"}${name ? ` "${name}"` : ""} deleted successfully.`
      );
      setRecordToDelete(null);
      await fetchRecords();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      toast.error(
        error.response?.data?.message ||
          `Failed to delete ${isStudent ? "student" : "employee"}${name ? ` "${name}"` : ""}. Please try again.`
      );
    } finally {
      setDeleting(false);
    }
  };

  const statusOptions = isStudent
    ? ["Active", "Completed", "Inactive"]
    : ["Active", "Inactive", "Resigned"];

  return (
    <section className="record-management">
      <ConfirmDialog
        isOpen={Boolean(recordToDelete)}
        onClose={() => {
          if (!deleting) setRecordToDelete(null);
        }}
        onConfirm={handleDelete}
        title={`Delete ${isStudent ? "student" : "employee"}?`}
        message={`Delete ${
          recordToDelete
            ? `${recordToDelete.firstName || ""} ${recordToDelete.lastName || ""}`.trim() ||
              "this record"
            : "this record"
        }? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmColor="red"
      />

      <div className="record-heading">
        <div>
          <h2>{title}</h2>
          <p>Add, view, update and manage {type} records.</p>
        </div>

        <button className="record-primary-btn" onClick={openCreateForm}>
          <PlusCircle size={18} />
          Add {isStudent ? "Student" : "Employee"}
        </button>
      </div>

      <div className="record-toolbar">
        <div className="record-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search by name, ${idField}, reference number...`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((status) => (
            <option value={status} key={status}>{status}</option>
          ))}
        </select>

        <button
          className="record-refresh-btn"
          onClick={fetchRecords}
          disabled={loading}
          type="button"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="record-count">
        Showing {filteredRecords.length} of {records.length} records
      </div>

      {showForm && (
        <div className="record-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) resetForm();
        }}>
          <div className="record-modal">
            <div className="record-modal-header">
              <div>
                <h3>{editingId ? "Edit" : "Add"} {isStudent ? "Student" : "Employee"}</h3>
                <p>Fields marked with * are required.</p>
              </div>
              <button type="button" onClick={resetForm} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {!isStudent && (
                <div className="record-photo-field">
                  <div className="record-photo-preview">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Selected profile" />
                    ) : (
                      <ImagePlus size={28} />
                    )}
                  </div>
                  <label className="record-upload-btn">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              )}

              <div className="record-form-grid">
                {fields.map((field) => (
                  <div
                    className={`record-form-field ${field.wide ? "wide" : ""}`}
                    key={field.name}
                  >
                    <label htmlFor={`${type}-${field.name}`}>
                      {field.label}{field.required ? " *" : ""}
                    </label>

                    {field.type === "select" ? (
                      <select
                        id={`${type}-${field.name}`}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option value={option} key={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.name === "address" || field.name === "remarks" ? (
                      <textarea
                        id={`${type}-${field.name}`}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        rows={field.name === "address" ? 2 : 3}
                      />
                    ) : (
                      <input
                        id={`${type}-${field.name}`}
                        name={field.name}
                        type={field.type || "text"}
                        value={form[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        min={field.type === "number" ? "0" : undefined}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="record-form-actions">
                <button type="button" className="record-cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="record-primary-btn" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="record-empty">
          <RefreshCw className="record-spin" size={25} />
          <p>Loading records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="record-empty">
          {isStudent ? <GraduationCap size={42} /> : <Users size={42} />}
          <h3>No {type} found</h3>
          <p>Try changing your search or add a new record.</p>
        </div>
      ) : (
        <div className="record-table-wrap">
          <table className="record-table">
            <thead>
              <tr>
                <th>{isStudent ? "Student" : "Employee"}</th>
                <th>{isStudent ? "Student ID" : "Employee ID"}</th>
                <th>Reference Number</th>
                <th>{isStudent ? "Course" : "Designation"}</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record._id}>
                  <td>
                    <div className="record-person">
                      {!isStudent && record.photo ? (
                        <img src={getPhotoUrl(record.photo)} alt="" />
                      ) : (
                        <div className="record-avatar">
                          {(record.firstName || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <strong>{record.firstName} {record.lastName}</strong>
                    </div>
                  </td>
                  <td>{record[idField]}</td>
                  <td>{record.referenceNumber}</td>
                  <td>{record[secondaryField] || "—"}</td>
                  <td>{record.email || "—"}</td>
                  <td>{record.phone || "—"}</td>
                  <td>
                    <span className={`record-status ${String(record.status || "").toLowerCase()}`}>
                      {record.status || "—"}
                    </span>
                  </td>
                  <td>
                    <div className="record-actions">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEditForm(record)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        className="delete"
                        onClick={() => setRecordToDelete(record)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
