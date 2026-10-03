// src/pages/WebsiteDesign.jsx

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./WebsiteDesign.css";

export default function WebsiteDesign() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      number: "01",
      title: "Responsive Website Design",
      description:
        "Modern layouts designed to look clean and consistent across desktops, tablets, and smartphones.",
    },
    {
      number: "02",
      title: "UI/UX Design",
      description:
        "User-focused interfaces that make websites simple, engaging, and easy to navigate.",
    },
    {
      number: "03",
      title: "Business Websites",
      description:
        "Professional website designs that communicate your brand and build customer trust.",
    },
    {
      number: "04",
      title: "E-Commerce Design",
      description:
        "Clean and conversion-focused online store designs built around a smooth shopping experience.",
    },
  ];

  const designFocus = [
    "Responsive Layouts",
    "Clean Interfaces",
    "User Experience",
    "Brand Consistency",
    "Conversion Focus",
    "Modern Visuals",
  ];

  const process = [
    {
      number: "01",
      title: "Discover",
      desc: "Understand your brand, goals, audience, and website requirements.",
    },
    {
      number: "02",
      title: "Structure",
      desc: "Plan the layout, content hierarchy, and user journey.",
    },
    {
      number: "03",
      title: "Design",
      desc: "Create a polished visual experience aligned with your brand.",
    },
    {
      number: "04",
      title: "Refine",
      desc: "Review the design and make improvements before final delivery.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="ws-hero">
        <div className="ws-container">
          <div className="ws-hero-grid">
            <motion.div
              className="ws-hero-content"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="ws-label">WEBSITE DESIGN</span>

              <h1>
                Websites Designed to
                <span> Make an Impact.</span>
              </h1>

              <p>
                We create modern, responsive, and user-focused website
                designs that make your brand look professional and give your
                audience a better digital experience.
              </p>

              <div className="ws-hero-buttons">
                <Link to="/contact" className="ws-primary-btn">
                  Start Your Project
                </Link>

                <Link to="/services" className="ws-secondary-btn">
                  Back to Services
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="ws-design-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="ws-card-top">
                <span>WEBSITE EXPERIENCE</span>
                <span>01</span>
              </div>

              <div className="ws-browser">
                <div className="ws-browser-bar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="ws-browser-content">
                  <div className="ws-browser-line large"></div>
                  <div className="ws-browser-line"></div>
                  <div className="ws-browser-line short"></div>

                  <div className="ws-browser-grid">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>

              <div className="ws-card-bottom">
                <strong>DESIGN</strong>
                <strong>EXPERIENCE</strong>
                <strong>IMPACT</strong>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="ws-services">
        <div className="ws-container">
          <motion.div
            className="ws-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ws-label">WHAT WE DESIGN</span>

            <h2>
              Design That Looks Good.
              <span> Works Better.</span>
            </h2>

            <p>
              Every website is designed around your brand, audience, and
              business objectives.
            </p>
          </motion.div>

          <div className="ws-services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.number}
                className="ws-service-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="ws-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="ws-focus-wrapper">
            <div className="ws-focus-heading">
              <span>DESIGN FOCUS</span>
              <h3>Built around the experience.</h3>
            </div>

            <div className="ws-focus-list">
              {designFocus.map((item, index) => (
                <div className="ws-focus-item" key={index}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS + CTA ================= */}
      <section className="ws-process">
        <div className="ws-container">
          <motion.div
            className="ws-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ws-label">OUR PROCESS</span>

            <h2>
              From Idea to
              <span> Interface.</span>
            </h2>

            <p>
              A focused design process that turns your requirements into a
              polished digital experience.
            </p>
          </motion.div>

          <div className="ws-process-grid">
            {process.map((step, index) => (
              <motion.div
                className="ws-process-item"
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
            className="ws-final-cta"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span>READY TO BUILD YOUR PRESENCE?</span>

              <h2>
                Your website should look as good
                <span> as your business.</span>
              </h2>
            </div>

            <Link to="/contact" className="ws-cta-btn">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>

  
    </>
  );
}