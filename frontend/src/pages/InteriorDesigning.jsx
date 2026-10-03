// src/pages/InteriorDesigning.jsx

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./InteriorDesigning.css";

export default function InteriorDesigning() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      number: "01",
      title: "Residential Interiors",
      description:
        "Thoughtful home interiors that balance comfort, functionality, and your personal style.",
    },
    {
      number: "02",
      title: "Commercial Interiors",
      description:
        "Professional spaces designed to create the right atmosphere for customers, teams, and businesses.",
    },
    {
      number: "03",
      title: "Office Interiors",
      description:
        "Modern workspaces designed to support productivity, collaboration, and a strong professional identity.",
    },
    {
      number: "04",
      title: "Kitchen & Living Spaces",
      description:
        "Beautiful, practical spaces designed around everyday living and comfortable experiences.",
    },
  ];

  const designFocus = [
    "Space Planning",
    "Furniture Selection",
    "Material & Texture",
    "Lighting Design",
    "Color Planning",
    "Modern Aesthetics",
  ];

  const process = [
    {
      number: "01",
      title: "Consult",
      desc: "Understand your space, lifestyle, preferences, and requirements.",
    },
    {
      number: "02",
      title: "Concept",
      desc: "Develop a clear visual direction for your interior space.",
    },
    {
      number: "03",
      title: "Design",
      desc: "Create layouts, materials, colors, and visual details.",
    },
    {
      number: "04",
      title: "Transform",
      desc: "Refine the final design and bring the complete vision together.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="id-hero">
        <div className="id-container">
          <div className="id-hero-grid">
            <motion.div
              className="id-hero-content"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="id-label">INTERIOR DESIGNING</span>

              <h1>
                Spaces Designed
                <span> Around You.</span>
              </h1>

              <p>
                We create elegant, functional interiors that bring together
                thoughtful planning, modern aesthetics, and the personality of
                the people who use the space.
              </p>

              <div className="id-hero-buttons">
                <Link to="/contact" className="id-primary-btn">
                  Start Your Project
                </Link>

                <Link to="/services" className="id-secondary-btn">
                  Back to Services
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="id-space-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="id-card-top">
                <span>INTERIOR CONCEPT</span>
                <span>01</span>
              </div>

              <div className="id-room">
                <div className="id-wall">
                  <div className="id-art"></div>
                  <div className="id-window">
                    <span></span>
                  </div>
                </div>

                <div className="id-sofa">
                  <span></span>
                  <span></span>
                </div>

                <div className="id-table">
                  <span></span>
                </div>

                <div className="id-plant">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="id-floor"></div>
              </div>

              <div className="id-card-bottom">
                <strong>SPACE</strong>
                <strong>STYLE</strong>
                <strong>COMFORT</strong>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="id-services">
        <div className="id-container">
          <motion.div
            className="id-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="id-label">WHAT WE CREATE</span>

            <h2>
              Beautiful Spaces.
              <span> Thoughtfully Designed.</span>
            </h2>

            <p>
              Every interior is planned around the space, the people, and the
              way it needs to be experienced.
            </p>
          </motion.div>

          <div className="id-services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.number}
                className="id-service-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="id-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="id-focus-wrapper">
            <div className="id-focus-heading">
              <span>DESIGN FOCUS</span>

              <h3>
                Every detail has a
                <em> purpose.</em>
              </h3>
            </div>

            <div className="id-focus-list">
              {designFocus.map((item, index) => (
                <div className="id-focus-item" key={index}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS + CTA ================= */}
      <section className="id-process">
        <div className="id-container">
          <motion.div
            className="id-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="id-label">OUR PROCESS</span>

            <h2>
              From Empty Space
              <span> to Your Space.</span>
            </h2>

            <p>
              A clear and collaborative approach that turns your ideas into a
              complete interior concept.
            </p>
          </motion.div>

          <div className="id-process-grid">
            {process.map((step, index) => (
              <motion.div
                className="id-process-item"
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span>{step.number}</span>

                <h3>{step.title}</h3>

                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="id-final-cta"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span>READY TO TRANSFORM YOUR SPACE?</span>

              <h2>
                Let's create a space that
                <em> feels like you.</em>
              </h2>
            </div>

            <Link to="/contact" className="id-cta-btn">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>

    
    </>
  );
}