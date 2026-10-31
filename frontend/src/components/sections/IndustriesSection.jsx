import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ShoppingCart,
  HeartPulse,
  Building2,
  Factory,
  BriefcaseBusiness,
  Rocket,
  Landmark,
  ArrowRight,
} from "lucide-react";

import "./IndustriesSection.css";

/* ============================================================
   CONTENT
============================================================ */

const industries = [
  {
    icon: GraduationCap,
    title: "Education",
    text: "Digital platforms, learning solutions and websites for educational organizations.",
    expandedTitle: "Digital Solutions for Education",
    expandedText:
      "We help educational organizations create modern digital experiences that make learning, communication and administration easier. From institutional websites to learning platforms, our solutions are designed around accessibility, usability and growth.",
    solutions: [
      "Educational Websites",
      "Learning Management Systems",
      "Student Portals",
      "Online Course Platforms",
      "Admission & Enquiry Systems",
      "Institute Management Solutions",
    ],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    text: "Modern online stores and digital experiences designed for growing businesses.",
    expandedTitle: "Digital Solutions for E-Commerce",
    expandedText:
      "We build e-commerce experiences that help businesses present their products, manage customers and create smooth online shopping journeys across devices.",
    solutions: [
      "E-Commerce Websites",
      "Product Catalogues",
      "Shopping Cart Systems",
      "Payment Integration",
      "Order Management",
      "Customer Accounts",
    ],
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    text: "User-friendly digital solutions for healthcare and wellness services.",
    expandedTitle: "Digital Solutions for Healthcare",
    expandedText:
      "We create user-friendly digital platforms for healthcare and wellness organizations, helping patients and service providers interact through simple and accessible digital experiences.",
    solutions: [
      "Healthcare Websites",
      "Appointment Systems",
      "Patient Portals",
      "Doctor Profiles",
      "Online Enquiry Systems",
      "Wellness Platforms",
    ],
  },
  {
    icon: Building2,
    title: "Real Estate",
    text: "Property websites, digital platforms and technology solutions for real estate.",
    expandedTitle: "Digital Solutions for Real Estate",
    expandedText:
      "We help real estate businesses showcase properties, generate enquiries and provide potential customers with a smooth digital property discovery experience.",
    solutions: [
      "Real Estate Websites",
      "Property Listings",
      "Property Search",
      "Lead Generation",
      "Agent Profiles",
      "Enquiry Management",
    ],
  },
  {
    icon: Factory,
    title: "Manufacturing",
    text: "Technology solutions that help manufacturing businesses improve their digital presence.",
    expandedTitle: "Digital Solutions for Manufacturing",
    expandedText:
      "We develop digital solutions that help manufacturing businesses communicate their capabilities, showcase products and improve their overall digital presence.",
    solutions: [
      "Corporate Websites",
      "Product Catalogues",
      "Business Portals",
      "Enquiry Systems",
      "Digital Branding",
      "Business Applications",
    ],
  },
  {
    icon: BriefcaseBusiness,
    title: "Professional Services",
    text: "Professional websites and applications that help service businesses connect with customers.",
    expandedTitle: "Digital Solutions for Professional Services",
    expandedText:
      "We create professional digital experiences that help service-based businesses communicate their expertise, showcase their services and connect with customers.",
    solutions: [
      "Business Websites",
      "Service Platforms",
      "Customer Portals",
      "Booking Systems",
      "Lead Generation",
      "Business Applications",
    ],
  },
  {
    icon: Rocket,
    title: "Startups",
    text: "Flexible digital products that help startups turn ideas into working solutions.",
    expandedTitle: "Digital Solutions for Startups",
    expandedText:
      "We work with startups to transform ideas into practical digital products. Solutions can be developed with flexibility and scalability in mind as the business evolves.",
    solutions: [
      "MVP Development",
      "Startup Websites",
      "Mobile Applications",
      "SaaS Platforms",
      "UI/UX Design",
      "Product Development",
    ],
  },
  {
    icon: Landmark,
    title: "Finance",
    text: "Modern digital experiences for financial and business service organizations.",
    expandedTitle: "Digital Solutions for Finance",
    expandedText:
      "We build modern digital experiences for financial and business service organizations with a focus on usability, clear communication and reliable digital workflows.",
    solutions: [
      "Financial Websites",
      "Business Portals",
      "Customer Dashboards",
      "Lead Generation",
      "Information Platforms",
      "Business Applications",
    ],
  },
];

/* ============================================================
   SECTION
============================================================ */

export default function IndustriesSection() {
  /* first row is open when the page loads - use null for all closed */
  const [open, setOpen] = useState(0);

  const toggle = (index) => setOpen((cur) => (cur === index ? null : index));

  return (
    <section className="ind-section">
      <div className="ind-wrap">
        {/* ================= LEFT: INTRO ================= */}

        <motion.div
          className="ind-intro"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="ind-eyebrow">Industries</p>

          <h2>
            Technology that fits <em>your industry.</em>
          </h2>

          <p className="ind-lead">
            We create digital experiences and technology solutions for
            businesses across different industries and stages of growth.
          </p>

          <Link to="/contact" className="ind-cta">
            <span>Talk to our team</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* ================= RIGHT: LIST ================= */}

        <ul className="ind-list">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            const isOpen = open === index;

            return (
              <motion.li
                key={industry.title}
                className={`ind-item${isOpen ? " is-open" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <button
                  type="button"
                  className="ind-trigger"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`ind-panel-${index}`}
                >
                  <span className="ind-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Icon className="ind-icon" size={22} strokeWidth={1.5} />

                  <span className="ind-head">
                    <span className="ind-title">{industry.title}</span>
                    <span className="ind-summary">{industry.text}</span>
                  </span>

                  <span className="ind-toggle" aria-hidden="true" />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`ind-panel-${index}`}
                      className="ind-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="ind-panel-inner">
                        <div className="ind-about">
                          <h4>{industry.expandedTitle}</h4>
                          <p>{industry.expandedText}</p>
                        </div>

                        <div className="ind-build">
                          <span className="ind-build-label">
                            What we can build
                          </span>

                          <ul>
                            {industry.solutions.map((solution) => (
                              <li key={solution}>{solution}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}