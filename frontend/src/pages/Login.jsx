// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";
import {
  Mail,
  Lock,
  ArrowRight,
  LogIn,
  Sparkles,
  ShieldCheck,
  Code2,
  Rocket,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { API_URL } from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resendVerification = async () => {
    if (!unverifiedEmail) {
      toast.error("No email to resend verification to");
      return;
    }

    setResending(true);

    try {
  const response = await authService.resendVerification(
  unverifiedEmail
);
      const data = await response.json();

      if (data.success) {
        toast.success(
          "Verification email resent! Please check your inbox."
        );
        setShowResendVerification(false);
      } else {
        toast.error(
          data.message || "Failed to resend verification email"
        );
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    // EXISTING LOGIN API / AUTH FUNCTIONALITY
    const result = await login(
      formData.email,
      formData.password
    );

    setLoading(false);

    if (result.success) {
      toast.success("🎉 Login successful! Welcome back!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      if (
        result.error &&
        result.error
          .toLowerCase()
          .includes("verify your email")
      ) {
        setUnverifiedEmail(formData.email);
        setShowResendVerification(true);

        toast.error("Please verify your email first.");
      } else {
        toast.error(result.error || "Login failed");
      }
    }
  };

  return (
    <main className="login-page">

      <Toaster position="top-right" />

      {/* BACKGROUND */}
      <div className="login-background">
        <div className="login-gradient-orb login-gradient-one"></div>
        <div className="login-gradient-orb login-gradient-two"></div>
        <div className="login-grid-pattern"></div>
      </div>

      <div className="login-layout">

        {/* =====================================================
            LEFT BRAND AREA
        ===================================================== */}

        <motion.section
          className="login-showcase"
          initial={{
            opacity: 0,
            x: -35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          <div className="showcase-top">

            <div className="showcase-label">
              <Sparkles size={15} />
              <span>WELCOME TO VPROTECH DIGITAL</span>
            </div>

            <h1>
              Build.
              <br />
              <span>Learn.</span>
              <br />
              Grow.
            </h1>

            <p>
              Continue your journey with VProTech Digital
              and explore technology, creativity and
              industry-focused learning.
            </p>

          </div>

          {/* FEATURE LIST */}

          <div className="showcase-features">

            <div className="showcase-feature">
              <div className="showcase-feature-icon">
                <Code2 size={19} />
              </div>

              <div>
                <strong>Modern Technology</strong>
                <span>
                  Learn with practical digital solutions.
                </span>
              </div>
            </div>

            <div className="showcase-feature">
              <div className="showcase-feature-icon">
                <Rocket size={19} />
              </div>

              <div>
                <strong>Career Focused</strong>
                <span>
                  Build skills for real-world opportunities.
                </span>
              </div>
            </div>

            <div className="showcase-feature">
              <div className="showcase-feature-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>Secure Experience</strong>
                <span>
                  Your account and learning journey stay protected.
                </span>
              </div>
            </div>

          </div>

          <div className="showcase-bottom">
            <div className="showcase-line"></div>
            <span>VPROTECH DIGITAL</span>
          </div>

        </motion.section>


        {/* =====================================================
            LOGIN AREA
        ===================================================== */}

        <motion.section
          className="login-panel"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.1,
          }}
        >

          <div className="login-box">

            {/* HEADER */}

            <div className="login-header">

              <div className="login-icon">
                <LogIn size={21} />
              </div>

              <div className="login-heading">

                <span className="login-mini-label">
                  ACCOUNT ACCESS
                </span>

                <h2>
                  Welcome <span>Back.</span>
                </h2>

                <p>
                  Sign in to continue to your VProTech account.
                </p>

              </div>

            </div>


            {/* VERIFICATION */}

            {showResendVerification && (
              <motion.div
                className="verification-warning"
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
              >

                <div className="verification-warning-icon">
                  ⚠
                </div>

                <div className="verification-warning-content">

                  <strong>
                    Email verification required
                  </strong>

                  <p>
                    We sent a verification link to{" "}
                    <b>{unverifiedEmail}</b>
                  </p>

                  <button
                    type="button"
                    onClick={resendVerification}
                    disabled={resending}
                  >
                    {resending
                      ? "Sending..."
                      : "Resend verification email"}
                  </button>

                </div>

              </motion.div>
            )}


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {/* EMAIL */}

              <div className="login-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <Mail
                    className="login-input-icon"
                    size={19}
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


              {/* PASSWORD */}

              <div className="login-field">

                <div className="password-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>

                </div>

                <div className="login-input-wrapper">

                  <Lock
                    className="login-input-icon"
                    size={19}
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
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
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* TRUST ROW */}

              <div className="login-trust-row">

                <span>
                  <CheckCircle2 size={15} />
                  Secure account access
                </span>

                <span>
                  <ShieldCheck size={15} />
                  Protected
                </span>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>Login to Account</span>
                    <ArrowRight size={19} />
                  </>
                )}

              </button>

            </form>


            {/* REGISTER */}

            <div className="login-register">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create an account
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

        </motion.section>

      </div>

    </main>
  );
}