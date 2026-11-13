import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Target,
  ShieldCheck,
} from "lucide-react";

/* 5 background images: put them in src/assets/slides/ */
import bg1 from "../../assets/slides/photo-1.jpg";
import bg2 from "../../assets/slides/photo-2.jpg";
import bg3 from "../../assets/slides/photo-3.jpg";
import bg4 from "../../assets/slides/photo-4.jpg";
import bg5 from "../../assets/slides/photo-5.jpg";

import "./HeroSection.css";

/* ============================================================
   CONTENT
============================================================ */

const BG_SLIDES = [bg1, bg2, bg3, bg4, bg5];
const SLIDE_INTERVAL = 5000; // ms between slides

const STRATEGIES = [
  {
    icon: TrendingUp,
    title: "Digital Growth",
    text: "Scalable digital solutions that help businesses grow faster.",
    path: "/digital-growth",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    text: "Ideas turned into practical, innovative technology.",
    path: "/innovation",
  },
  {
    icon: Target,
    title: "Smart Strategy",
    text: "Technology strategy focused on measurable results.",
    path: "/smart-strategy",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Technology",
    text: "Secure, reliable and future-ready digital experiences.",
    path: "/trusted-technology",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ============================================================
   HERO SECTION
============================================================ */

export default function HeroSection() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /* auto-advance, one slide at a time */
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % BG_SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, active]);

  const slideState = (i) => {
    if (i === active) return "is-active";
    if (i === (active - 1 + BG_SLIDES.length) % BG_SLIDES.length)
      return "is-prev";
    return "is-next";
  };

  return (
    <section className="vh-section">
      {/* ================= BANNER ================= */}

      <div
        className="vh-banner"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* sliding full-size background */}
        <div className="vh-bg" aria-hidden="true">
          {BG_SLIDES.map((src, i) => (
            <div
              key={src}
              className={`vh-bg-slide ${slideState(i)}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          <div className="vh-bg-overlay" />
        </div>

        <div className="vh-content">
          <motion.p className="vh-eyebrow" {...fadeUp(0.05)}>
            Innovation. Sustainability. Impact.
          </motion.p>

          <motion.h1 className="vh-title" {...fadeUp(0.15)}>
            Shaping the Future Through Technology <em>and Purpose</em>
          </motion.h1>

          <motion.p className="vh-description" {...fadeUp(0.3)}>
            At VProTech Digital, success goes beyond profit. We focus on
            creating value through advanced digital capabilities, empowering
            businesses to scale with purpose.
          </motion.p>

          <motion.div className="vh-buttons" {...fadeUp(0.45)}>
            <button
              type="button"
              className="vh-btn vh-btn-primary"
              onClick={() => navigate("/services")}
            >
              <span>Our Services</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="vh-btn vh-btn-outline"
              onClick={() => navigate("/courses")}
            >
              Explore Courses
            </button>
          </motion.div>
        </div>

        {/* slider dots */}
        <div className="vh-dots">
          {BG_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`vh-dot ${i === active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>

      {/* ================= STRATEGIES ================= */}

      <motion.div className="vh-strategies" {...fadeUp(0.6)}>
        <div className="vh-strategies-head">
          <span>Our Strategies</span>
          <h2>
            Technology that creates <em>real impact</em>
          </h2>
        </div>

        <div className="vh-strategies-grid">
          {STRATEGIES.map(({ icon: Icon, title, text, path }) => (
            <Link key={title} to={path} className="vh-strategy">
              <span className="vh-strategy-icon">
                <Icon size={20} />
              </span>

              <span className="vh-strategy-body">
                <strong>{title}</strong>
                <small>{text}</small>
              </span>

              <ArrowRight className="vh-strategy-arrow" size={18} />
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}