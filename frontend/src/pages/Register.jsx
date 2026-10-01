// src/pages/Register.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { authService } from "../services/api";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Briefcase,
  Send,
  Eye,
  EyeOff,
  ShieldCheck,
  BookOpen,
  Code2,
  ChevronDown,
} from "lucide-react";

import "./Register.css";

export default function Register() {
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showVerificationMessage, setShowVerificationMessage] =
    useState(false);

  const [registeredEmail, setRegisteredEmail] = useState("");

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
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Digital Marketing",
    "Data Analytics",
    "Cloud Computing",
    "Cyber Security",
    "Artificial Intelligence",
    "Full Stack Development",
    "Python Development",
    "Java Development",
    "Other",
  ];

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================
  // HANDLE REGISTRATION
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
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

    // Validate password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...registerData } = formData;

    try {
      const result = await register({
        ...registerData,
        name: registerData.name.trim(),
        email: registerData.email.trim().toLowerCase(),
        phone: registerData.phone.trim(),
      });

      // ============================================
      // REGISTRATION SUCCESS
      // ============================================

      if (result.success) {
        const email = registerData.email.trim().toLowerCase();

        setRegisteredEmail(email);
        setShowVerificationMessage(true);

        toast.success(
          "Registration successful! Please check your email."
        );

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          domain: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        // ============================================
        // REGISTRATION FAILED
        // ============================================

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
  // RESEND VERIFICATION EMAIL
  // ============================================

  const resendVerification = async () => {
    if (!registeredEmail) {
      toast.error("No registered email found");
      return;
    }

    try {
      const email = registeredEmail.trim().toLowerCase();

      const response = await authService.resendVerification(email);

      if (response.success) {
        toast.success(
          "Verification email resent! Please check your inbox."
        );
      } else {
        toast.error(
          response.message || "Failed to resend verification email"
        );
      }
    } catch (error) {
      console.error("Resend verification error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to resend verification email"
      );
    }
  };

  // ============================================
  // VERIFICATION SCREEN
  // ============================================

  if (showVerificationMessage) {
    return (
      <div className="register-page">
        <Toaster position="top-right" />

        <div className="register-background">
          <div className="register-gradient-orb register-gradient-one"></div>

          <div className="register-gradient-orb register-gradient-two"></div>

          <div className="register-grid-pattern"></div>
        </div>

        <motion.div
          className="register-verification"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <motion.div
            className="register-verification-icon"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 12,
            }}
          >
            <CheckCircle size={38} />
          </motion.div>

          <span className="register-mini-label">
            ACCOUNT CREATED
          </span>

          <h2>
            Verify Your <span>Email</span>
          </h2>

          <p>
            We've sent a verification link to your registered email
            address. Please verify your email before logging in.
          </p>

          <div className="register-verification-email">
            <Mail size={16} />
            {registeredEmail}
          </div>

          <p className="verification-small-text">
            Please check your inbox and spam folder.
          </p>

          <div className="register-verification-actions">
            <button
              type="button"
              onClick={resendVerification}
              className="register-resend-btn"
            >
              <Send size={17} />
              Resend Verification
            </button>

            <Link
              to="/login"
              className="register-login-btn"
            >
              Go to Login
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // REGISTER PAGE
  // ============================================

  return (
    <div className="register-page">
      <Toaster position="top-right" />

      {/* Background */}
      <div className="register-background">
        <div className="register-gradient-orb register-gradient-one"></div>

        <div className="register-gradient-orb register-gradient-two"></div>

        <div className="register-grid-pattern"></div>
      </div>

      <div className="register-layout">

        {/* ==========================================
            LEFT SHOWCASE
        ========================================== */}

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

              {/* Feature 1 */}
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

              {/* Feature 2 */}
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

              {/* Feature 3 */}
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

        {/* ==========================================
            RIGHT REGISTER PANEL
        ========================================== */}

        <motion.main
          className="register-panel"
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="register-box">

            {/* Header */}

            <div className="register-header">

              <div className="register-icon">
                <User size={23} />
              </div>

              <div className="register-heading">

                <span className="register-mini-label">
                  VPROTECH DIGITAL
                </span>

                <h2>
                  Create <span>Account</span>
                </h2>

                <p>
                  Create your account and begin your learning
                  journey today.
                </p>

              </div>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >

              {/* Name */}

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

              {/* Email */}

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

              {/* Phone */}

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
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>
              </div>

              {/* Domain */}

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

              {/* Password */}

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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
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

              {/* Confirm Password */}

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
                      showConfirmPassword
                        ? "text"
                        : "password"
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

              {/* Security Note */}

              <div className="register-security-note">

                <ShieldCheck size={15} />

                <span>
                  Your account information is securely protected.
                </span>

              </div>

              {/* Register Button */}

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
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* Login */}

            <div className="register-login">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Login here
                <ArrowRight size={14} />
              </Link>

            </div>

          </div>
        </motion.main>

      </div>
    </div>
  );
}