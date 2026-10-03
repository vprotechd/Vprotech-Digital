import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./LogoDesigning.css";

export default function LogoDesigning() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      number: "01",
      title: "Custom Logo Design",
      description:
        "Unique logo concepts created to represent your brand and make it memorable.",
    },
    {
      number: "02",
      title: "Brand Identity",
      description:
        "A consistent visual identity built around your logo, colors and typography.",
    },
    {
      number: "03",
      title: "Minimalist Design",
      description:
        "Clean and modern logos designed to communicate more with less.",
    },
    {
      number: "04",
      title: "Logo Redesign",
      description:
        "Refresh your existing identity while keeping the recognition your brand already has.",
    },
  ];

  const styles = [
    "Minimalist",
    "Modern",
    "Classic",
    "Bold",
    "Elegant",
    "Creative",
  ];

  const process = [
    {
      number: "01",
      title: "Discover",
      desc: "Understand your brand and visual direction.",
    },
    {
      number: "02",
      title: "Explore",
      desc: "Develop concepts and creative directions.",
    },
    {
      number: "03",
      title: "Refine",
      desc: "Perfect the selected concept together.",
    },
    {
      number: "04",
      title: "Deliver",
      desc: "Prepare your final logo and brand assets.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="ld-hero">
        <div className="ld-container ld-hero-grid">
          <motion.div
            className="ld-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="ld-label">LOGO DESIGNING</span>

            <h1>
              Your Brand.
              <span> Your Identity.</span>
            </h1>

            <p>
              We create memorable logo designs that give your business a
              distinctive visual identity and a strong first impression.
            </p>

            <div className="ld-hero-buttons">
              <Link to="/contact" className="ld-primary-btn">
                Create Your Logo
              </Link>

              <Link to="/services" className="ld-secondary-btn">
                Back to Services
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="ld-hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="ld-logo-card">
              <div className="ld-card-top">
                <span>BRAND IDENTITY</span>
                <strong>01</strong>
              </div>

              <div className="ld-logo-mark">
                <div className="ld-mark-shape"></div>
                <div className="ld-mark-inner">V</div>
              </div>

              <div className="ld-logo-name">
                <span>YOUR</span>
                <strong>BRAND</strong>
              </div>

              <div className="ld-card-bottom">
                <span>FORM</span>
                <span>IDENTITY</span>
                <span>IMPACT</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES + STYLES ================= */}
      <section className="ld-services">
        <div className="ld-container">
          <motion.div
            className="ld-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>WHAT WE CREATE</span>

            <h2>
              Design that gives
              <br />
              <strong>your brand a face.</strong>
            </h2>
          </motion.div>

          <div className="ld-services-grid">
            {services.map((service, index) => (
              <motion.div
                className="ld-service-card"
                key={service.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <span className="ld-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="ld-style-wrapper">
            <div className="ld-style-heading">
              <span>DESIGN LANGUAGE</span>

              <h3>
                Different styles.
                <br />
                One strong identity.
              </h3>
            </div>

            <div className="ld-style-list">
              {styles.map((style) => (
                <div className="ld-style-item" key={style}>
                  {style}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS + CTA ================= */}
      <section className="ld-process">
        <div className="ld-container">
          <motion.div
            className="ld-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>OUR PROCESS</span>

            <h2>
              From idea
              <br />
              <strong>to identity.</strong>
            </h2>
          </motion.div>

          <div className="ld-process-grid">
            {process.map((step, index) => (
              <motion.div
                className="ld-process-item"
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
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
            className="ld-final-cta"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span>MAKE IT MEMORABLE</span>

              <h2>
                Your logo is the
                <br />
                first impression.
              </h2>
            </div>

            <Link to="/contact" className="ld-cta-btn">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}