import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./HomeCTASection.css";

/* ============================================================
   CONTENT
============================================================ */

const OFFER = [
  "Websites",
  "Mobile applications",
  "Digital growth solutions",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ============================================================
   SECTION
============================================================ */

export default function HomeCTASection() {
  const navigate = useNavigate();

  return (
    <section className="home-cta-section">
      <div className="home-cta-banner">
        {/* ================= LEFT ================= */}

        <div className="home-cta-main">
          <motion.p className="home-cta-eyebrow" {...fadeUp(0)}>
            Start a conversation
          </motion.p>

          <motion.h2 className="home-cta-title" {...fadeUp(0.1)}>
            Have an idea? <em>Let&rsquo;s build it.</em>
          </motion.h2>

          <motion.p className="home-cta-text" {...fadeUp(0.2)}>
            From websites and mobile applications to digital growth
            solutions, we help turn ideas into practical digital experiences.
          </motion.p>

          <motion.div className="home-cta-actions" {...fadeUp(0.3)}>
            <button
              type="button"
              className="home-cta-btn home-cta-primary"
              onClick={() => navigate("/services")}
            >
              <span>Our Services</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="home-cta-btn home-cta-outline"
              onClick={() => navigate("/contact")}
            >
              <MessageCircle size={18} />
              <span>Talk to Our Team</span>
            </button>
          </motion.div>
        </div>

        {/* ================= RIGHT ================= */}

        <motion.div className="home-cta-side" {...fadeUp(0.25)}>
          <p className="home-cta-side-label">What we help with</p>

          <ul>
            {OFFER.map((item, index) => (
              <li key={item}>
                <span className="home-cta-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="home-cta-item">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}