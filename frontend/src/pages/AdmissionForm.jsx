
import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  GraduationCap,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  BookOpen,
} from "lucide-react";

import API from ".././services/api";
import "./AdmissionForm.css";

const initialForm = {
  studentName: "",
  fatherName: "",
  dateOfBirth: "",
  gender: "",
  aadhaarLast4: "",
  contactNumber: "",
  email: "",
  qualification: "",
  trainingCourse: "",
  duration: "",
  previousExperience: "",
  batchTiming: "",
  temporaryAddress: "",
  permanentAddress: "",
};

const courses = [
  "C Programming",
  "C++ Programming",
  "Java Programming",
  "Python Programming",
  "Full Stack Development",
  "MERN Stack Development",
  "Web Development",
  "Web Designing",
  "Angular Development",
  "React Development",
  "ASP.NET Development",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Digital Marketing",
  "Android Development",
  "Other",
];

const durations = [
  "1 Month",
  "45 Days",
  "3 Months",
  "6 Months",
  "1 Year",
  "Other",
];

const AdmissionForm = () => {
  const [form, setForm] = useState(initialForm);
  const [sameAddress, setSameAddress] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "temporaryAddress" && sameAddress
        ? { permanentAddress: value }
        : {}),
    }));
  };

  const handleSameAddress = (checked) => {
    setSameAddress(checked);

    setForm((prev) => ({
      ...prev,
      permanentAddress: checked
        ? prev.temporaryAddress
        : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!declaration) {
      toast.error("Please accept the declaration.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.contactNumber)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (
      form.aadhaarLast4 &&
      !/^[0-9]{4}$/.test(form.aadhaarLast4)
    ) {
      toast.error("Enter only the last 4 Aadhaar digits.");
      return;
    }

    if (form.temporaryAddress.trim().length < 5) {
      toast.error("Please enter your temporary address.");
      return;
    }

    if (form.permanentAddress.trim().length < 5) {
      toast.error("Please enter your permanent address.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        studentName: form.studentName.trim(),
        fatherName: form.fatherName.trim(),
        email: form.email.trim().toLowerCase(),
        temporaryAddress: form.temporaryAddress.trim(),
        permanentAddress: form.permanentAddress.trim(),
      };

      const response = await API.post("/admissions", payload);

      const applicationNumber =
        response.data?.admission?.applicationNumber ||
        response.data?.applicationNumber ||
        response.data?.admission?._id ||
        response.data?.admission?._id;

      toast.success(
        applicationNumber
          ? `Admission submitted! Reference: ${applicationNumber}`
          : "Your admission form has been submitted successfully!"
      );

      setForm(initialForm);
      setSameAddress(false);
      setDeclaration(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {
      console.error("Admission submission error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to submit admission form. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admission-page">

      {/* HERO */}

      <section className="admission-hero">
        <div className="admission-hero-content">
          <span className="admission-eyebrow">
            VPROTECH DIGITAL
          </span>

          <h1>
            Start Your <span>Learning Journey</span>
          </h1>

          <p>
            Take the first step towards building your future.
            Complete the admission form to apply for our
            industrial training programs.
          </p>

          <div className="admission-hero-info">
            <span>
              <CheckCircle2 size={17} />
              Industry-Oriented Training
            </span>

            <span>
              <CheckCircle2 size={17} />
              Practical Learning
            </span>
          </div>
        </div>
      </section>

      {/* FORM */}

      <section className="admission-form-section">

        <div className="admission-form-heading">
          <div>
            <span className="admission-section-label">
              STUDENT REGISTRATION
            </span>

            <h2>Industrial Training Admission Form</h2>

            <p>
              Please provide accurate information in all
              required fields.
            </p>
          </div>

          <div className="admission-form-icon">
            <GraduationCap size={34} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admission-form">

          {/* PERSONAL DETAILS */}

          <div className="admission-form-group">

            <div className="admission-group-title">
              <div className="admission-group-icon">
                <User size={20} />
              </div>

              <div>
                <h3>Personal Information</h3>
                <p>Enter your basic personal details.</p>
              </div>
            </div>

            <div className="admission-grid">

              <div className="admission-field">
                <label>Student's Full Name *</label>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Enter your full name"
                  value={form.studentName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="admission-field">
                <label>Father's / Guardian's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Enter father's / guardian's name"
                  value={form.fatherName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="admission-field">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="admission-field">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              <div className="admission-field">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="10-digit mobile number"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      contactNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    }))
                  }
                  maxLength={10}
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="admission-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={150}
                  required
                />
              </div>

              <div className="admission-field">
                <label>Aadhaar Last 4 Digits (Optional)</label>
                <input
                  type="text"
                  name="aadhaarLast4"
                  placeholder="XXXX"
                  value={form.aadhaarLast4}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      aadhaarLast4: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4),
                    }))
                  }
                  maxLength={4}
                  inputMode="numeric"
                />
              </div>

            </div>
          </div>

          {/* EDUCATIONAL DETAILS */}

          <div className="admission-form-group">

            <div className="admission-group-title">
              <div className="admission-group-icon">
                <GraduationCap size={20} />
              </div>

              <div>
                <h3>Educational & Training Details</h3>
                <p>Choose your preferred training program.</p>
              </div>
            </div>

            <div className="admission-grid">

              <div className="admission-field">
                <label>Qualification *</label>
                <select
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Qualification</option>
                  <option>10th</option>
                  <option>12th</option>
                  <option>Diploma</option>
                  <option>BCA</option>
                  <option>B.Tech</option>
                  <option>BE</option>
                  <option>B.Sc</option>
                  <option>B.Com</option>
                  <option>BA</option>
                  <option>MCA</option>
                  <option>M.Tech</option>
                  <option>MBA</option>
                  <option>M.Sc</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="admission-field">
                <label>Training Course *</label>
                <select
                  name="trainingCourse"
                  value={form.trainingCourse}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Training Course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label>Training Duration *</label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Duration</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label>Preferred Batch / Timing *</label>
                <input
                  type="text"
                  name="batchTiming"
                  placeholder="e.g. Morning / 10 AM - 1 PM"
                  value={form.batchTiming}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="admission-field admission-full-width">
                <label>Previous Experience (If Any)</label>
                <textarea
                  name="previousExperience"
                  placeholder="Mention your previous training, internship or work experience..."
                  value={form.previousExperience}
                  onChange={handleChange}
                  rows={4}
                  maxLength={1000}
                />
              </div>

            </div>
          </div>

          {/* ADDRESS DETAILS */}

          <div className="admission-form-group">

            <div className="admission-group-title">
              <div className="admission-group-icon">
                <MapPin size={20} />
              </div>

              <div>
                <h3>Address Information</h3>
                <p>Provide your current and permanent address.</p>
              </div>
            </div>

            <div className="admission-grid">

              <div className="admission-field admission-full-width">
                <label>Temporary Address *</label>
                <textarea
                  name="temporaryAddress"
                  placeholder="Enter your current address"
                  value={form.temporaryAddress}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  required
                />
              </div>

              <div className="admission-field admission-full-width">

                <label className="admission-checkbox">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) =>
                      handleSameAddress(e.target.checked)
                    }
                  />
                  <span>
                    Permanent address is same as temporary address
                  </span>
                </label>

                <label>Permanent Address *</label>

                <textarea
                  name="permanentAddress"
                  placeholder="Enter your permanent address"
                  value={form.permanentAddress}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  required
                  disabled={sameAddress}
                />

              </div>

            </div>
          </div>

          {/* FEE INFORMATION */}

          <div className="admission-fee-note">
            <BookOpen size={22} />

            <div>
              <h4>Admission & Training Fees</h4>
              <p>
                Admission fee and training fee will be confirmed
                by the VProTech Digital admission office.
              </p>
            </div>
          </div>

          {/* DECLARATION */}

          <div className="admission-declaration">

            <div className="admission-group-title">
              <div className="admission-group-icon">
                <ClipboardList size={20} />
              </div>

              <div>
                <h3>Student Declaration</h3>
                <p>Please read before submitting.</p>
              </div>
            </div>

            <label className="admission-checkbox">
              <input
                type="checkbox"
                checked={declaration}
                onChange={(e) =>
                  setDeclaration(e.target.checked)
                }
              />

              <span>
                I hereby declare that the information provided
                in this admission form is true and correct to
                the best of my knowledge. I agree to follow
                the rules and regulations of VProTech Digital.
              </span>
            </label>

          </div>

          {/* SUBMIT */}

          <div className="admission-submit-area">

            <p>
              Please review all details before submitting
              your admission application.
            </p>

            <button
              type="submit"
              className="admission-submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  Submit Admission Form
                  <ArrowRight size={19} />
                </>
              )}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
};

export default AdmissionForm;
