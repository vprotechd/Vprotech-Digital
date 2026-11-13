
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { sendContactMessage } from "../../services/contactService";
import officeImage from "../../assets/vvv.png";

// Custom notification styles
const toastStyles = {
  success: {
    style: {
      background: "#10b981",
      color: "#fff",
      padding: "16px 24px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
    },
    icon: "✅",
    duration: 4000,
  },

  error: {
    style: {
      background: "#ef4444",
      color: "#fff",
      padding: "16px 24px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
    },
    icon: "❌",
    duration: 5000,
  },

  loading: {
    style: {
      background: "#3b82f6",
      color: "#fff",
      padding: "16px 24px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
    },
  },

  info: {
    style: {
      background: "#1769e0",
      color: "#fff",
      padding: "16px 24px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
    },
    icon: "ℹ️",
    duration: 3000,
  },
};

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // =========================
  // NOTIFICATION HELPERS
  // =========================

  const showSuccess = (message) => {
    toast.success(message, {
      style: toastStyles.success.style,
      icon: toastStyles.success.icon,
      duration: toastStyles.success.duration,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      style: toastStyles.error.style,
      icon: toastStyles.error.icon,
      duration: toastStyles.error.duration,
    });
  };

  const showLoading = (message) => {
    return toast.loading(message, {
      style: toastStyles.loading.style,
    });
  };

  const showInfo = (message) => {
    toast(message, {
      style: toastStyles.info.style,
      icon: toastStyles.info.icon,
      duration: toastStyles.info.duration,
    });
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // FORM VALIDATION
  // =========================

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      showError("Please enter your full name.");
      return false;
    }

    if (formData.fullname.trim().length < 2) {
      showError("Name must be at least 2 characters long.");
      return false;
    }

    if (!formData.email.trim()) {
      showError("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      showError("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      showError("Please enter your phone number.");
      return false;
    }

    if (formData.phone.trim().length < 10) {
      showError("Please enter a valid phone number.");
      return false;
    }

    if (!formData.subject.trim()) {
      showError("Please enter a subject.");
      return false;
    }

    if (!formData.message.trim()) {
      showError("Please enter your message.");
      return false;
    }

    if (formData.message.trim().length < 10) {
      showError("Message must be at least 10 characters long.");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const loadingToast = showLoading("Sending your message...");

    setLoading(true);

    try {
      await sendContactMessage(formData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Success message
      showSuccess(
        "Message sent successfully! Our team will contact you within 24 hours."
      );

      // Reset form
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Information notification
      setTimeout(() => {
        showInfo("📧 Check your email for confirmation.");
      }, 3000);
    } catch (error) {
      toast.dismiss(loadingToast);

      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STYLES
  // =========================

  const styles = {
    section: {
      background:
        "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8faff 100%)",
      padding: isMobile ? "70px 20px" : "120px 8%",
      position: "relative",
      overflow: "hidden",
    },

    container: {
      maxWidth: "1350px",
      margin: "auto",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "50px" : "80px",
      alignItems: "center",
    },

    left: {
      textAlign: isMobile ? "center" : "left",
    },

    right: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },

    tag: {
      color: "#1769e0",
      letterSpacing: "3px",
      fontWeight: "800",
      marginBottom: "15px",
      fontSize: isMobile ? "13px" : "15px",
      textAlign: isMobile ? "center" : "left",
    },

    heading: {
      color: "#172033",
      fontSize: isMobile ? "34px" : "50px",
      fontWeight: "800",
      marginBottom: "20px",
      lineHeight: "1.2",
    },

    highlight: {
      color: "#1769e0",
    },

    description: {
      color: "#64748B",
      lineHeight: "1.8",
      marginBottom: "35px",
      fontSize: isMobile ? "16px" : "18px",
      textAlign: isMobile ? "center" : "left",
      maxWidth: "650px",
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "15px" : "18px",
    },

    input: {
      width: "100%",
      padding: isMobile ? "15px 17px" : "17px 20px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      background: "#ffffff",
      color: "#172033",
      fontSize: isMobile ? "15px" : "16px",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
    },

    textarea: {
      width: "100%",
      padding: isMobile ? "15px 17px" : "17px 20px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      background: "#ffffff",
      color: "#172033",
      fontSize: isMobile ? "15px" : "16px",
      outline: "none",
      resize: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
    },

    button: {
      width: "100%",
      marginTop: "10px",
      padding: isMobile ? "16px" : "18px",
      border: "none",
      borderRadius: "50px",
      background:
        "linear-gradient(135deg, #1769e0, #6366F1)",
      color: "#fff",
      fontWeight: "700",
      fontSize: isMobile ? "16px" : "17px",
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow:
        "0 12px 30px rgba(79, 70, 229, 0.25)",
      transition: "all 0.3s ease",
      opacity: loading ? 0.7 : 1,
    },

    image: {
      width: "100%",
      maxWidth: isMobile ? "340px" : "600px",
      height: isMobile ? "350px" : "650px",
      objectFit: "cover",
      borderRadius: "25px",
      boxShadow:
        "0 25px 60px rgba(15, 23, 42, 0.15)",
      border: "1px solid #E2E8F0",
    },
  };

  return (
    <section style={styles.section}>
      {/* TOASTER */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            maxWidth: "450px",
          },
        }}
      />

      <div style={styles.container}>
        {/* =========================
            LEFT - FORM
        ========================= */}

        <motion.div
          style={styles.left}
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p style={styles.tag}>SEND US A MESSAGE</p>

          <h2 style={styles.heading}>
            Let's Discuss Your
            <span style={styles.highlight}> Concern</span>
          </h2>

          <p style={styles.description}>
            Fill out the form below and our team will get back to you
            within 24 hours.
          </p>

          <form
            autoComplete="off"
            style={styles.form}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              style={styles.input}
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
            />

            <motion.button
              type="submit"
              style={styles.button}
              disabled={loading}
              whileHover={
                !loading
                  ? {
                      scale: 1.03,
                      boxShadow:
                        "0 16px 35px rgba(79, 70, 229, 0.35)",
                    }
                  : {}
              }
              whileTap={
                !loading
                  ? {
                      scale: 0.97,
                    }
                  : {}
              }
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>

        {/* =========================
            RIGHT - IMAGE
        ========================= */}

        <motion.div
          style={styles.right}
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.img
            src={officeImage}
            alt="Office"
            style={styles.image}
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
