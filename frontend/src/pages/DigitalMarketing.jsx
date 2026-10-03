import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./DigitalMarketing.css";

export default function DigitalMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      number: "01",
      title: "Search Engine Optimization",
      description:
        "Improve your search visibility and attract relevant organic traffic.",
    },
    {
      number: "02",
      title: "Social Media Marketing",
      description:
        "Build your brand and engage your audience with strategic social campaigns.",
    },
    {
      number: "03",
      title: "Google Ads & PPC",
      description:
        "Reach high-intent customers through targeted and measurable campaigns.",
    },
    {
      number: "04",
      title: "Content Marketing",
      description:
        "Create valuable content that attracts, engages and converts your audience.",
    },
  ];

  const platforms = [
    "Google",
    "Instagram",
    "Facebook",
    "LinkedIn",
    "YouTube",
    "Email",
  ];

  const process = [
    {
      number: "01",
      title: "Research",
      desc: "Understand your market, audience and competitors.",
    },
    {
      number: "02",
      title: "Strategy",
      desc: "Create a marketing plan aligned with your goals.",
    },
    {
      number: "03",
      title: "Execute",
      desc: "Launch campaigns across the right channels.",
    },
    {
      number: "04",
      title: "Optimize",
      desc: "Measure performance and improve what works.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="dm-hero">
        <div className="dm-container dm-hero-grid">
          <motion.div
            className="dm-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="dm-label">DIGITAL MARKETING</span>

            <h1>
              Make Your Brand
              <span> Impossible to Ignore.</span>
            </h1>

            <p>
              We create focused digital marketing strategies that increase
              visibility, reach the right audience and turn attention into
              business growth.
            </p>

            <div className="dm-hero-buttons">
              <Link to="/contact" className="dm-primary-btn">
                Start Your Campaign
              </Link>

              <Link to="/services" className="dm-secondary-btn">
                Back to Services
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="dm-hero-visual"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="dm-growth-card">
              <div className="dm-growth-top">
                <span>DIGITAL GROWTH</span>
                <strong>01</strong>
              </div>

              <div className="dm-growth-main">
                <div className="dm-growth-line line-one"></div>
                <div className="dm-growth-line line-two"></div>
                <div className="dm-growth-line line-three"></div>

                <div className="dm-growth-bars">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <div className="dm-growth-bottom">
                <span>REACH</span>
                <span>ENGAGE</span>
                <span>GROW</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES + PLATFORMS ================= */}
      <section className="dm-services">
        <div className="dm-container">
          <motion.div
            className="dm-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>WHAT WE DO</span>

            <h2>
              Marketing built around
              <br />
              <strong>your growth.</strong>
            </h2>
          </motion.div>

          <div className="dm-services-grid">
            {services.map((service, index) => (
              <motion.div
                className="dm-service-card"
                key={service.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <span className="dm-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="dm-platform-wrapper">
            <div className="dm-platform-heading">
              <span>CHANNELS</span>

              <h3>
                Reach your audience
                <br />
                where they are.
              </h3>
            </div>

            <div className="dm-platform-list">
              {platforms.map((platform) => (
                <div className="dm-platform-item" key={platform}>
                  {platform}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS + CTA ================= */}
      <section className="dm-process">
        <div className="dm-container">
          <motion.div
            className="dm-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>OUR APPROACH</span>

            <h2>
              Strategy first.
              <br />
              <strong>Results always.</strong>
            </h2>
          </motion.div>

          <div className="dm-process-grid">
            {process.map((step, index) => (
              <motion.div
                className="dm-process-item"
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
            className="dm-final-cta"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span>READY TO GROW?</span>

              <h2>
                Your next customer
                <br />
                is already online.
              </h2>
            </div>

            <Link to="/contact" className="dm-cta-btn">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>

    </>
  );
}