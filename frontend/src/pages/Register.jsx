
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  ShieldCheck,
  BookOpen,
  Code2,
  ChevronDown,
} from "lucide-react";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    domain: "",
    password: "",
    confirmPassword: "",
  });

  // ============================================
  // LEARNING DOMAINS
  // ============================================

  const domains = [
    "C/C++",
    "Web Designing",
    "Digital Marketing",
    "Mobile App Development",
    "Web Graphic Design/ UI & UX Design",
    "Java/Python",
    "Data Analytics",
    "MERN Stack Development",
    "Machine Learning",
    "Networking",
    "Data Science",
    "Artificial Intelligence",
    "Ethical Hacking",
    "Cyber Security",
    "Full Stack Development",
    "Flutter",
    "AutoCAD 2D, 3D",
    "SolidWorks",
    "CATIA",
    "Pro-E / Creo",
    "CNC Programming",
    "ANSYS",
    "Inventor / Fusion",
    "Revit",
    "STAAD Pro",
    "3ds Max",
    "Google SketchUp",
    "Primavera",
    "ETABS",
    "Embedded System",
    "Automation",
    "MATLAB",
    "Robotics",
    "VLSI/VHDL",
    "PLC/SCADA",
    "Other",
  ];

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const handleChange = (e) => {
    const value =
      e.target.name === "phone"
        ? e.target.value.replace(/\D/g, "").slice(0, 10)
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // ============================================
  // HANDLE REGISTRATION
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.domain ||
      !formData.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;

    try {
      const result = await register({
        ...registerData,
        name: registerData.name.trim(),
        email: registerData.email.trim().toLowerCase(),
        phone: registerData.phone.trim(),
      });

      if (result.success) {
        toast.success(
          "Registration successful!"
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          domain: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // REGISTER PAGE
  // ============================================

  return (
    <div className="register-page">
      <Toaster position="top-right" />

      {/* BACKGROUND */}
      <div className="register-background">
        <div className="register-gradient-orb register-gradient-one"></div>

        <div className="register-gradient-orb register-gradient-two"></div>

        <div className="register-grid-pattern"></div>
      </div>

      <div className="register-layout">

        {/* LEFT SHOWCASE */}

        <motion.aside
          className="register-showcase"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="register-showcase-top">

            <h1>
              Build your
              <br />
              <span>future.</span>
            </h1>

            <p>
              Join VProTech Digital and start your learning
              journey with practical skills, industry-focused
              courses and modern technology.
            </p>

            <div className="register-showcase-features">

              {/* FEATURE 1 */}

              <div className="register-showcase-feature">
                <div className="register-showcase-feature-icon">
                  <GraduationCap size={20} />
                </div>

                <div>
                  <strong>Learn Practical Skills</strong>

                  <span>
                    Learn technologies used in real projects
                  </span>
                </div>
              </div>

              {/* FEATURE 2 */}

              <div className="register-showcase-feature">
                <div className="register-showcase-feature-icon">
                  <Briefcase size={20} />
                </div>

                <div>
                  <strong>Become Industry Ready</strong>

                  <span>
                    Build knowledge for your professional journey
                  </span>
                </div>
              </div>

              {/* FEATURE 3 */}

              <div className="register-showcase-feature">
                <div className="register-showcase-feature-icon">
                  <Code2 size={20} />
                </div>

                <div>
                  <strong>Choose Your Domain</strong>

                  <span>
                    Select the technology you want to explore
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="register-showcase-bottom">
            <div className="register-showcase-line"></div>
            START • LEARN • GROW
          </div>
        </motion.aside>

        {/* RIGHT REGISTER PANEL */}

        <motion.main
          className="register-panel"
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="register-box">

            {/* HEADER */}

            <div className="register-header">

              <div className="register-icon">
                <User size={23} />
              </div>

              <div className="register-heading">

                <span className="register-mini-label">
                  VPROTECH DIGITAL
                </span>

                <h2>
                  Enroll <span>Now</span>
                </h2>

                

              </div>
            </div>

            {/* REGISTRATION FORM */}

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >

              {/* NAME */}

              <div className="register-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="register-input-wrapper">

                  <User
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>
              </div>

              {/* EMAIL */}

              <div className="register-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="register-input-wrapper">

                  <Mail
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>
              </div>

              {/* PHONE */}

              <div className="register-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="register-input-wrapper">

                  <Phone
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />

                </div>
              </div>

              {/* DOMAIN */}

              <div className="register-field">

                <label htmlFor="domain">
                  Learning Domain
                </label>

                <div className="register-input-wrapper">

                  <BookOpen
                    size={17}
                    className="register-input-icon"
                  />

                  <select
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select your domain
                    </option>

                    {domains.map((domain) => (
                      <option
                        key={domain}
                        value={domain}
                      >
                        {domain}
                      </option>
                    ))}

                  </select>

                  <ChevronDown
                    size={16}
                    className="register-select-arrow"
                  />

                </div>
              </div>

              {/* PASSWORD */}

              <div className="register-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="register-input-wrapper">

                  <Lock
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                <div className="register-password-hint">
                  Use at least 6 characters
                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="register-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="register-input-wrapper">

                  <Lock
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* SECURITY NOTE */}

              <div className="register-security-note">

                <ShieldCheck size={15} />

                <span>
                  Your account information is securely protected.
                </span>

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="register-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <GraduationCap size={19} />
                    Enroll Now
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

          </div>
        </motion.main>

      </div>
    </div>
  );
}
