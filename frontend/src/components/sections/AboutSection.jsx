import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cloud,
  Database,
  Layers3,
  LockKeyhole,
  Activity,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import "./AboutSection.css";

/* ============================================================
   CONTENT
============================================================ */

const STACK = [
  { title: "Cloud", subtitle: "Infrastructure", icon: Cloud },
  { title: "Data", subtitle: "Intelligence", icon: Database },
  { title: "Applications", subtitle: "Digital Products", icon: Layers3 },
  { title: "Security", subtitle: "Protection", icon: LockKeyhole },
];

const HEALTH = [
  { label: "Uptime", value: "99.9%", width: "99%" },
  { label: "Performance", value: "96%", width: "96%" },
  { label: "Protection", value: "100%", width: "100%" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ============================================================
   SECTION
============================================================ */

export default function AboutSection() {
  return (
    <section className="technology-visual-section">
      {/* ================= HEADER ================= */}

      <div className="tw-head">
        <div className="tw-head-left">
          <motion.span className="tw-pill" {...fadeUp(0)}>
            <i>
              <ShieldCheck size={10} />
            </i>
            TRUSTED TECHNOLOGY
            <i>
              <ShieldCheck size={10} />
            </i>
          </motion.span>

          <motion.h2 {...fadeUp(0.08)}>
            Technology That
            <span> Works Together.</span>
          </motion.h2>
        </div>

        <motion.p className="tw-head-text" {...fadeUp(0.16)}>
          We connect digital products, applications, data, cloud infrastructure
          and users into one reliable technology ecosystem.
        </motion.p>
      </div>

      {/* ================= CARDS ================= */}

      <div className="tw-cards">
        {/* ---------- CARD 1 ---------- */}
        <motion.article className="tw-card tw-card-light tw-card-a" {...fadeUp(0.1)}>
          <span className="tw-card-icon">
            <ShieldCheck size={22} />
          </span>

          <h3>Secure by Design</h3>
          <p>Security integrated into every layer of your products and infrastructure.</p>

          <div className="tw-mock" style={{ "--rot": "-4deg" }}>
            <div className="tw-mock-head">
              <span className="tw-mock-logo">
                <ShieldCheck size={15} />
              </span>
              <div>
                <strong>Technology Stack</strong>
                <small>Everything stays connected</small>
              </div>
            </div>

            <div className="tw-mock-fields">
              <div>
                <small>Layers</small>
                <strong>04 Active</strong>
              </div>
              <div>
                <small>Status</small>
                <strong>Protected</strong>
              </div>
            </div>

            <ul className="tw-mock-list">
              {STACK.map(({ title, subtitle, icon: Icon }) => (
                <li key={title}>
                  <span className="tw-mini-icon">
                    <Icon size={13} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <small>{subtitle}</small>
                  </div>
                  <em>Connected</em>
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        {/* ---------- CARD 2 (dark) ---------- */}
        <motion.article className="tw-card tw-card-dark tw-card-b" {...fadeUp(0.22)}>
          <span className="tw-card-icon">
            <RefreshCw size={22} />
          </span>

          <h3>Reliable Performance</h3>
          <p>Systems designed for consistent operation, day after day.</p>

          <div className="tw-mock" style={{ "--rot": "0deg" }}>
            <div className="tw-mock-head">
              <span className="tw-mock-logo">
                <Activity size={15} />
              </span>
              <div>
                <strong>System Health</strong>
                <small>Live monitoring</small>
              </div>
            </div>

            <div className="tw-bars">
              {HEALTH.map(({ label, value, width }) => (
                <div key={label}>
                  <div className="tw-bars-row">
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                  <span className="tw-bar">
                    <span style={{ width }} />
                  </span>
                </div>
              ))}
            </div>

            <div className="tw-barcode" />
          </div>
        </motion.article>

        {/* ---------- CARD 3 ---------- */}
        <motion.article className="tw-card tw-card-light tw-card-c" {...fadeUp(0.34)}>
          <span className="tw-card-icon">
            <TrendingUp size={22} />
          </span>

          <h3>Ready to Scale</h3>
          <p>Technology that grows with your business.</p>

          <div className="tw-mock" style={{ "--rot": "-4deg" }}>
            <div className="tw-mock-head">
              <span className="tw-mock-logo">
                <TrendingUp size={15} />
              </span>
              <div>
                <strong>Growth Overview</strong>
                <small>Built to grow</small>
              </div>
            </div>

            <div className="tw-mock-fields">
              <div>
                <small>Capacity</small>
                <strong>Elastic</strong>
              </div>
              <div>
                <small>Growth</small>
                <strong>+128%</strong>
              </div>
            </div>

            <svg className="tw-chart" viewBox="0 0 220 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="twArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1769aa" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#1769aa" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 78 C25 74 35 60 60 58 S95 62 115 42 S160 30 185 18 S210 10 220 6 V90 H0 Z"
                fill="url(#twArea)"
              />
              <path
                d="M0 78 C25 74 35 60 60 58 S95 62 115 42 S160 30 185 18 S210 10 220 6"
                fill="none"
                stroke="#1769aa"
                strokeWidth="2.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </motion.article>
      </div>
    </section>
  );
}