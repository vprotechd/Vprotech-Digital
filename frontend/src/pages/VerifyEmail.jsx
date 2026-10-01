// src/pages/VerifyEmail.jsx

import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../services/api";
import "./Auth.css";

export default function VerifyEmail() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  // Prevent the verification API from being called more than once.
  const verificationStarted = useRef(false);

  useEffect(() => {
    // Important:
    // React StrictMode can run effects twice in development.
    // This prevents the same verification token from being
    // submitted twice.
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      try {
        // Make sure the token exists.
        if (!token) {
          throw new Error("Verification token is missing");
        }

        console.log("🔐 Verification token:", token);
        console.log("🔐 Token length:", token.length);

        // Call verification API ONLY ONCE.
        const data = await authService.verifyEmail(token);

        console.log("✅ Verification response:", data);

        // Handle successful verification.
        if (data?.success) {
          const successMessage =
            data.message || "Email verified successfully!";

          setStatus("success");
          setMessage(successMessage);

          toast.success(successMessage);
        } else {
          // Backend responded but verification was unsuccessful.
          const errorMessage =
            data?.message || "Invalid or expired verification link";

          setStatus("error");
          setMessage(errorMessage);

          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("❌ Email verification error:", error);
        console.error(
          "❌ Backend error:",
          error.response?.data
        );

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Invalid or expired verification link";

        setStatus("error");
        setMessage(errorMessage);

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  // Loading screen
  if (loading) {
    return (
      <div className="auth-container">
        <Toaster position="top-right" />

        <div
          className="auth-card"
          style={{ textAlign: "center" }}
        >
          <div className="spinner"></div>

          <p
            style={{
              color: "#e2e8f0",
              marginTop: "16px",
            }}
          >
            Verifying your email...
          </p>
        </div>
      </div>
    );
  }

  // Verification result
  return (
    <div className="auth-container">
      <Toaster position="top-right" />

      <motion.div
        className="auth-card"
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        {status === "success" ? (
          <>
            <h2 className="auth-title">
              ✅ Email Verified!
            </h2>

            <p className="auth-subtitle">
              {message ||
                "Your email has been verified successfully."}
            </p>

            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <Link
                to="/login"
                className="auth-btn"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Login Now
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="auth-title">
              ❌ Verification Failed
            </h2>

            <p className="auth-subtitle">
              {message ||
                "The verification link is invalid or has expired."}
            </p>

            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <Link
                to="/register"
                className="auth-btn"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Register Again
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}