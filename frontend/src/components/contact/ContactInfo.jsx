import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Office Address",
    value:
      "SCF-116 A, Second Floor, Phase 5, Industrial Area, Sector 58, Sahibzada Ajit Singh Nagar, Punjab 160055",
  },
  {
    icon: <FaPhoneAlt />,
    title: "Call Us",
    value: ["+91 8894110026", "+91 8146759497", "+91 1724639508"],
    type: "phone",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Address",
    value: "vprotechdigitalmohali@gmail.com",
    type: "email",
  },
];

export default function ContactInfo() {
  return (
    <section style={styles.section}>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <p style={styles.tag}>CONTACT INFORMATION</p>

        <h2 style={styles.heading}>
          Let's Start a <span style={styles.highlight}>Conversation</span>
        </h2>

        <p style={styles.subHeading}>
          Reach out to us for software development, internships,
          digital marketing, AI solutions, or any business inquiry.
        </p>
      </motion.div>

      {/* CONTACT CARDS */}
      <div style={styles.grid}>
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            style={styles.card}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
            }}
            viewport={{ once: true }}
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
          >
            {/* ICON */}
            <div style={styles.icon}>{item.icon}</div>

            {/* TITLE */}
            <h3 style={styles.title}>{item.title}</h3>

            {/* VALUE */}
            <div style={styles.value}>
              {Array.isArray(item.value) ? (
                item.value.map((val, i) => {
                  if (item.type === "phone") {
                    return (
                      <a
                        key={i}
                        href={`tel:${val}`}
                        style={styles.link}
                      >
                        {val}
                      </a>
                    );
                  }

                  if (item.type === "email") {
                    return (
                      <a
                        key={i}
                        href={`mailto:${val}`}
                        style={styles.link}
                      >
                        {val}
                      </a>
                    );
                  }

                  return <p key={i}>{val}</p>;
                })
              ) : item.type === "email" ? (
                <a
                  href={`mailto:${item.value}`}
                  style={styles.link}
                >
                  {item.value}
                </a>
              ) : (
                <p style={styles.address}>{item.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "110px 8%",
    background: "#ffffff",
    color: "#172033",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },

  tag: {
    color: "#1769e0",
    letterSpacing: "4px",
    fontWeight: "800",
    fontSize: "13px",
    marginBottom: "18px",
  },

  heading: {
    fontSize: "48px",
    fontWeight: "800",
    margin: "0 0 20px",
    color: "#172033",
    lineHeight: "1.2",
  },

  highlight: {
    color: "#1769e0",
  },

  subHeading: {
    color: "#64748B",
    fontSize: "18px",
    lineHeight: "1.8",
    maxWidth: "760px",
    margin: "0 auto 70px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "30px",
    maxWidth: "1250px",
    margin: "0 auto",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "42px 30px",
    transition: "all .35s ease",
    cursor: "pointer",
    boxShadow: "0 10px 35px rgba(15, 23, 42, 0.07)",
    minHeight: "250px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  icon: {
    width: "72px",
    height: "72px",
    borderRadius: "18px",
    margin: "0 auto 24px",
    background: "linear-gradient(135deg, #1769e0, #1769e0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "26px",
    color: "#ffffff",
    boxShadow: "0 12px 25px rgba(79, 70, 229, 0.22)",
  },

  title: {
    fontSize: "21px",
    fontWeight: "750",
    margin: "0 0 15px",
    color: "#172033",
  },

  value: {
    color: "#64748B",
    lineHeight: "1.7",
    fontSize: "16px",
    width: "100%",
  },

  address: {
    margin: "0 auto",
    maxWidth: "330px",
  },

  link: {
    display: "block",
    color: "#64748B",
    textDecoration: "none",
    margin: "7px 0",
    transition: "all .25s ease",
    fontWeight: "500",
  },
};