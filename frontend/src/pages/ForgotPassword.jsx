// src/pages/ForgotPassword.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Code2,
  Rocket,
  KeyRound,
  ArrowRight,
} from "lucide-react";

import { API_URL } from "../services/api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      console.log(
        "📧 Sending request to:",
        `${API_URL}/auth/forgot-password`
      );

      console.log("📧 Email:", trimmedEmail);

      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      console.log(
        "📧 Response status:",
        response.status
      );

      const data = await response.json();

      console.log(
        "📧 Response data:",
        data
      );

      if (response.ok && data.success) {
        setEmail(trimmedEmail);
        setSent(true);

        toast.success(
          "Password reset link sent to your email!"
        );
      } else {
        toast.error(
          data.message ||
            "Failed to send reset link"
        );
      }
    } catch (error) {
      console.error(
        "❌ Network error:",
        error
      );

      toast.error(
        "Network error. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-page">

      <Toaster position="top-right" />

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="forgot-background">

        <div className="forgot-gradient-orb forgot-gradient-one"></div>

        <div className="forgot-gradient-orb forgot-gradient-two"></div>

        <div className="forgot-grid-pattern"></div>

      </div>


      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="forgot-layout">


        {/* =====================================================
            LEFT SHOWCASE
        ===================================================== */}

        <motion.section
          className="forgot-showcase"
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

          <div className="forgot-showcase-top">

            


            <h1>
              Reset.
              <br />
              <span>Recover.</span>
              <br />
              Continue.
            </h1>


            <p>
              Forgot your password? No worries.
              Securely recover your VProTech Digital
              account and continue your learning journey.
            </p>

          </div>


          {/* FEATURES */}

          <div className="forgot-showcase-features">


            <div className="forgot-showcase-feature">

              <div className="forgot-showcase-feature-icon">
                <KeyRound size={19} />
              </div>

              <div>

                <strong>
                  Easy Recovery
                </strong>

                <span>
                  Reset your password using your registered email.
                </span>

              </div>

            </div>


            <div className="forgot-showcase-feature">

              <div className="forgot-showcase-feature-icon">
                <ShieldCheck size={19} />
              </div>

              <div>

                <strong>
                  Secure Process
                </strong>

                <span>
                  Your account recovery process stays protected.
                </span>

              </div>

            </div>


            <div className="forgot-showcase-feature">

              <div className="forgot-showcase-feature-icon">
                <Rocket size={19} />
              </div>

              <div>

                <strong>
                  Continue Learning
                </strong>

                <span>
                  Get back to your VProTech account quickly.
                </span>

              </div>

            </div>

          </div>


          {/* BOTTOM */}

          <div className="forgot-showcase-bottom">

            <div className="forgot-showcase-line"></div>

            <span>
              VPROTECH DIGITAL
            </span>

          </div>

        </motion.section>



        {/* =====================================================
            RIGHT FORGOT PASSWORD PANEL
        ===================================================== */}

        <motion.section
          className="forgot-panel"
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

          <div className="forgot-box">


            {!sent ? (

              <>
                {/* HEADER */}

                <div className="forgot-header">

                  <div className="forgot-icon">
                    <ShieldCheck size={21} />
                  </div>


                  <div className="forgot-heading">

                    <span className="forgot-mini-label">
                      ACCOUNT RECOVERY
                    </span>

                    <h2>
                      Forgot{" "}
                      <span>Password?</span>
                    </h2>

                    <p>
                      Enter your registered email and
                      we'll send you a secure password
                      reset link.
                    </p>

                  </div>

                </div>


                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="forgot-form"
                >

                  {/* EMAIL */}

                  <div className="forgot-field">

                    <label htmlFor="forgot-email">
                      Email Address
                    </label>


                    <div className="forgot-input-wrapper">

                      <Mail
                        className="forgot-input-icon"
                        size={19}
                      />

                      <input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        autoComplete="email"
                        disabled={loading}
                        required
                      />

                    </div>

                  </div>


                  {/* SECURITY ROW */}

                  <div className="forgot-trust-row">

                    <span>
                      <CheckCircle2 size={15} />
                      Secure recovery
                    </span>

                    <span>
                      <ShieldCheck size={15} />
                      Protected
                    </span>

                  </div>


                  {/* BUTTON */}

                  <button
                    type="submit"
                    className="forgot-btn"
                    disabled={loading}
                  >

                    {loading ? (

                      <>
                        <span className="forgot-spinner"></span>
                        Sending...
                      </>

                    ) : (

                      <>
                        <span>
                          Send Reset Link
                        </span>

                        <ArrowRight size={19} />
                      </>

                    )}

                  </button>

                </form>


                {/* BACK TO LOGIN */}

                <div className="forgot-login">

                  <span>
                    Remember your password?
                  </span>

                  <Link to="/login">

                    Back to Login
                    <ArrowRight size={15} />

                  </Link>

                </div>

              </>

            ) : (

              /* =================================================
                 SUCCESS STATE
              ================================================= */

              <motion.div
                className="forgot-success"
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                }}
              >

                <div className="forgot-success-icon">
                  <CheckCircle2 size={38} />
                </div>


                <span className="forgot-success-label">
                  EMAIL SENT
                </span>


                <h2>
                  Check Your{" "}
                  <span>Email.</span>
                </h2>


                <p>
                  We've sent a password reset link
                  to the following email address.
                </p>


                <div className="forgot-email-box">

                  <Mail size={18} />

                  <span>
                    {email}
                  </span>

                </div>


                <div className="forgot-success-info">

                  <ShieldCheck size={17} />

                  <span>
                    Please check your inbox and spam
                    folder. The reset link will allow
                    you to securely create a new password.
                  </span>

                </div>


                <Link
                  to="/login"
                  className="forgot-back-login"
                >

                  <ArrowLeft size={17} />

                  Back to Login

                </Link>


                <button
                  type="button"
                  className="forgot-try-again"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                >
                  Use a different email
                </button>

              </motion.div>

            )}

          </div>

        </motion.section>

      </div>

    </main>
  );
}