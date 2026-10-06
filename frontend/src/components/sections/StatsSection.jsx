import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FolderKanban,
  Users,
  Award,
  Briefcase,
  TrendingUp,
  Clock,
} from "lucide-react";

import "./StatsSection.css";

/* ============================================================
   COUNTER HOOK
   Counts from 0 to `target` when the section is in view
============================================================ */

function useCounter(target, duration = 2000, inView = false) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic — fast start, slow finish
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return value;
}

/* ============================================================
   SINGLE STAT CARD
============================================================ */

function StatCard({ stat, index, inView }) {
  const Icon = stat.icon;
  const count = useCounter(stat.value, 2000 + index * 120, inView);

  return (
    <motion.div
      className="vpro-stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      {/* Icon badge */}
      <div
        className="vpro-stat-icon"
        style={{
          color: stat.color,
          backgroundColor: `${stat.color}14`,
        }}
      >
        <Icon size={24} strokeWidth={2.2} />
      </div>

      {/* Number + suffix */}
      <div className="vpro-stat-value">
        <span className="vpro-stat-number">
          {count.toLocaleString("en-IN")}
        </span>
        {stat.suffix && (
          <span
            className="vpro-stat-suffix"
            style={{ color: stat.color }}
          >
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <h4 className="vpro-stat-label">{stat.label}</h4>

      {/* Description */}
      <p className="vpro-stat-desc">{stat.description}</p>

      {/* Decorative bottom accent */}
      <span
        className="vpro-stat-accent"
        style={{ background: stat.color }}
      />
    </motion.div>
  );
}

/* ============================================================
   STATS SECTION
============================================================ */

export default function StatsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const stats = [
    {
      icon: FolderKanban,
      value: 250,
      suffix: "+",
      label: "Projects Delivered",
      description: "Web, mobile & enterprise builds shipped end-to-end.",
      color: "#1557D6",
    },
    {
      icon: Users,
      value: 180,
      suffix: "+",
      label: "Happy Clients",
      description: "Startups, SMEs & enterprises across 12 industries.",
      color: "#20B486",
    },
    {
      icon: Briefcase,
      value: 1200,
      suffix: "+",
      label: "Students Trained",
      description: "Upskilled through our industry-focused courses.",
      color: "#2563EB",
    },
    
  ];

  return (
    <section className="vpro-stats-section" ref={sectionRef}>
      {/* Heading */}
      <motion.div
        className="vpro-stats-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="vpro-stats-small-title">BY THE NUMBERS</span>
        <h2>
          Impact That Speaks in <span>Real Numbers</span>
        </h2>
        <p>
          Every project, every student, every partnership — measured and
          delivered with purpose.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="vpro-stats-grid">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            stat={stat}
            index={index}
            inView={inView}
          />
        ))}
      </div>

      {/* Decorative background glow */}
      <div className="vpro-stats-glow vpro-stats-glow-1" />
      <div className="vpro-stats-glow vpro-stats-glow-2" />
    </section>
  );
}