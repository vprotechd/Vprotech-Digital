
// src/pages/AndroidDevelopment.jsx

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AndroidDevelopment.css";

export default function AndroidDevelopment() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      number: "01",
      title: "Custom Android Apps",
      description:
        "Modern Android applications designed around your business requirements and users.",
    },
    {
      number: "02",
      title: "UI/UX Development",
      description:
        "Clean and intuitive mobile interfaces focused on usability and smooth experiences.",
    },
    {
      number: "03",
      title: "Backend Integration",
      description:
        "Secure integration with APIs, databases, authentication systems and cloud services.",
    },
    {
      number: "04",
      title: "Performance & Security",
      description:
        "Optimized applications with reliable performance, secure data handling and scalable architecture.",
    },
  ];

  const technologies = [
    "Kotlin",
    "Java",
    "Android SDK",
    "Jetpack Compose",
    "Firebase",
    "Room Database",
    "Retrofit",
    "Gradle",
  ];

  const process = [
    {
      number: "01",
      title: "Plan",
      desc: "Understand the idea, requirements and target users.",
    },
    {
      number: "02",
      title: "Design",
      desc: "Create a clear and engaging mobile experience.",
    },
    {
      number: "03",
      title: "Develop",
      desc: "Build the application using modern Android technologies.",
    },
    {
      number: "04",
      title: "Launch",
      desc: "Test, deploy and prepare the application for users.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* =====================================================
          SECTION 1 — HERO
      ===================================================== */}
      <section className="ad-hero">
        <div className="ad-hero-glow"></div>

        <div className="ad-container">
          <motion.div
            className="ad-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="ad-label">
              ANDROID DEVELOPMENT
            </span>

            <h1>
              Build Powerful
              <br />
              <span>Android Applications</span>
            </h1>

            <p>
              We create modern, scalable and user-focused Android
              applications built for real business needs.
            </p>

            <div className="ad-hero-buttons">
              <Link to="/contact" className="ad-primary-btn">
                Start Your Project
              </Link>

              <button
                className="ad-secondary-btn"
                onClick={() => navigate("/services")}
              >
                Back to Services
              </button>
            </div>
          </motion.div>

          <motion.div
            className="ad-hero-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="ad-card-inner">
              <span>ANDROID</span>

              <h2>
                Your idea.
                <br />
                <strong>Built better.</strong>
              </h2>

              <div className="ad-card-divider"></div>

              <div className="ad-mini-grid">
                <div>
                  <small>DESIGN</small>
                  <b>01</b>
                </div>

                <div>
                  <small>BUILD</small>
                  <b>02</b>
                </div>

                <div>
                  <small>LAUNCH</small>
                  <b>03</b>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SECTION 2 — SERVICES + TECHNOLOGY
      ===================================================== */}
      <section className="ad-services">
        <div className="ad-container">

          <motion.div
            className="ad-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ad-label">WHAT WE DO</span>

            <h2>
              Android development
              <br />
              <span>built around your product.</span>
            </h2>
          </motion.div>

          <div className="ad-services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.number}
                className="ad-service"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <span className="ad-number">
                  {service.number}
                </span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="ad-tech-section">
            <div className="ad-tech-heading">
              <span className="ad-label">TECHNOLOGY</span>

              <h3>Modern Android stack</h3>
            </div>

            <div className="ad-tech-list">
              {technologies.map((technology, index) => (
                <div className="ad-tech-item" key={technology}>
                  <span>0{index + 1}</span>
                  <strong>{technology}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          SECTION 3 — PROCESS + CTA
      ===================================================== */}
      <section className="ad-process">
        <div className="ad-container">

          <motion.div
            className="ad-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ad-label">OUR PROCESS</span>

            <h2>
              From concept
              <br />
              <span>to launch.</span>
            </h2>
          </motion.div>

          <div className="ad-process-grid">
            {process.map((step, index) => (
              <motion.div
                className="ad-process-item"
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <span>{step.number}</span>

                <h3>{step.title}</h3>

                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="ad-final-cta"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>HAVE AN APP IDEA?</span>

            <h2>
              Let's build it
              <strong> together.</strong>
            </h2>

            <p>
              Tell us about your Android application and let's
              discuss your project.
            </p>

            <Link to="/contact" className="ad-primary-btn">
              Start Your Project
            </Link>
          </motion.div>

        </div>
      </section>

   
    </>
  );
}
