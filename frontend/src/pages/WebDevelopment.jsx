import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./WebDevelopment.css";

export default function WebDevelopment() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      number: "01",
      title: "Custom Web Applications",
      description:
        "Scalable web applications designed around your business requirements and users.",
    },
    {
      number: "02",
      title: "E-Commerce Development",
      description:
        "Modern online stores with smooth shopping experiences and secure integrations.",
    },
    {
      number: "03",
      title: "Business Websites",
      description:
        "Professional websites that build trust, showcase your brand and generate leads.",
    },
    {
      number: "04",
      title: "Management Systems",
      description:
        "Web-based systems that simplify business operations, data and daily workflows.",
    },
  ];

  const technologies = [
    "React",
    "JavaScript",
    "Node.js",
    "Express",
    "MongoDB",
    "ASP.NET",
    "SQL Server",
    "REST APIs",
  ];

  const process = [
    {
      number: "01",
      title: "Plan",
      desc: "Understand your goals and requirements.",
    },
    {
      number: "02",
      title: "Design",
      desc: "Create a clean and user-focused interface.",
    },
    {
      number: "03",
      title: "Develop",
      desc: "Build with scalable and reliable technology.",
    },
    {
      number: "04",
      title: "Launch",
      desc: "Test, deploy and support your website.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="wd-hero">
        <div className="wd-container wd-hero-grid">
          <motion.div
            className="wd-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="wd-label">WEB DEVELOPMENT</span>

            <h1>
              Websites That
              <span> Move Businesses Forward.</span>
            </h1>

            <p>
              We build modern, responsive and scalable websites that turn
              ideas into powerful digital experiences.
            </p>

            <div className="wd-hero-buttons">
              <Link to="/contact" className="wd-primary-btn">
                Start Your Project
              </Link>

              <Link to="/services" className="wd-secondary-btn">
                Back to Services
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="wd-hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="wd-browser">
              <div className="wd-browser-top">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="wd-browser-content">
                <div className="wd-browser-label">YOUR DIGITAL PRESENCE</div>

                <h3>
                  Design.
                  <br />
                  Develop.
                  <br />
                  <strong>Grow.</strong>
                </h3>

                <div className="wd-browser-lines">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES + TECHNOLOGY ================= */}
      <section className="wd-services">
        <div className="wd-container">
          <motion.div
            className="wd-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>WHAT WE BUILD</span>
            <h2>
              Digital products built
              <br />
              <strong>for real businesses.</strong>
            </h2>
          </motion.div>

          <div className="wd-services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.number}
                className="wd-service-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <span className="wd-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="wd-tech-wrapper">
            <div className="wd-tech-heading">
              <span>TECHNOLOGY</span>
              <h3>Built with modern technology.</h3>
            </div>

            <div className="wd-tech-list">
              {technologies.map((tech) => (
                <div className="wd-tech-item" key={tech}>
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS + CTA ================= */}
      <section className="wd-process">
        <div className="wd-container">
          <motion.div
            className="wd-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>OUR PROCESS</span>
            <h2>
              From idea to
              <br />
              <strong>launch.</strong>
            </h2>
          </motion.div>

          <div className="wd-process-grid">
            {process.map((step, index) => (
              <motion.div
                className="wd-process-item"
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
            className="wd-final-cta"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span>LET'S BUILD</span>

              <h2>
                Have a web idea?
                <br />
                Let's bring it to life.
              </h2>
            </div>

            <Link to="/contact" className="wd-cta-btn">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>

      
    </>
  );
}