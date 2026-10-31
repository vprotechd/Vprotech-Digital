import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Lightbulb,
  ShieldCheck,
  Rocket,
  Users,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

import img1 from "../../assets/img11.jpg";

import "./WhyChooseUsSection.css";

/* ============================================================
   CONTENT
============================================================ */

const reasons = [
  {
    number: "01",
    icon: Code2,
    title: "Modern Technology",
    description:
      "We use modern development technologies and practical solutions to create fast, scalable and reliable digital products.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Creative Solutions",
    description:
      "Every project receives a thoughtful approach focused on solving real business problems through creative digital solutions.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Quality Focused",
    description:
      "From design to development, we focus on quality, usability, performance and a smooth user experience.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Built to Grow",
    description:
      "Our websites and applications are designed with scalability in mind so your digital presence can grow with your business.",
  },
  {
    number: "05",
    icon: Users,
    title: "Experienced Team",
    description:
      "Our team brings together design, development and digital expertise to work on projects from concept to delivery.",
  },
  {
    number: "06",
    icon: Headphones,
    title: "Ongoing Support",
    description:
      "We stay connected after delivery to help with improvements, updates, maintenance and future digital requirements.",
  },
];

/* card that is popped up when the page loads */
const DEFAULT_ACTIVE = 2;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ============================================================
   SECTION
============================================================ */

export default function WhyChooseUsSection() {
  const [active, setActive] = useState(DEFAULT_ACTIVE);

  return (
    <section className="why-section">
      <div className="why-bg-glow why-bg-glow-one" />
      <div className="why-bg-glow why-bg-glow-two" />
      <div className="why-grid-pattern" />

      {/* ================= HEADER ================= */}

      <div className="why-head">
        <motion.h2 className="why-main-title" {...fadeUp(0)}>
          Digital Solutions
          <br />
          <span>Built Around You.</span>
        </motion.h2>

        <motion.div className="why-head-right" {...fadeUp(0.12)}>
          <div className="why-right-intro">
            <span>WHAT MAKES US DIFFERENT</span>
            <div className="why-intro-line" />
          </div>

          <p className="why-main-description">
            We combine technology, creativity and practical thinking to build
            digital experiences that help businesses move forward.
          </p>
        </motion.div>
      </div>

      {/* ================= CARDS ================= */}

      <motion.div className="why-panel" {...fadeUp(0.2)}>
        {reasons.map((item, index) => {
          const Icon = item.icon;
          const isActive = active === index;

          return (
            <div className="why-cell" key={item.number}>
              <article
                className={`why-card${isActive ? " is-active" : ""}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                tabIndex={0}
              >
                {/* image shown when the card pops up */}
                <img
                  className="why-card-bg"
                  src={img1}
                  alt=""
                  draggable="false"
                  style={{ objectPosition: `${index * 18}% center` }}
                />
                <span className="why-card-shade" />

                <span className="why-card-icon">
                  <Icon size={18} />
                </span>

                <div className="why-card-body">
                  <span className="why-card-number">{item.number}</span>

                  <span className="why-card-dots" />

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  
                </div>
              </article>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}