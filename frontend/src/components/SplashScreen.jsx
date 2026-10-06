import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./SplashScreen.css";

// Logo
import logoImage from "../assets/lll.png";

/* ============================================================
   SPLASH SCREEN
   - Animated logo (lll.png)
   - Loading dots
   - Progress bar
   - Fades out after duration
============================================================ */

export default function SplashScreen({ duration = 2600 }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="vpro-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
        >
          {/* Animated background grid */}
          <div className="vpro-splash-grid" />

          {/* Glow orbs */}
          <div className="vpro-splash-orb orb-1" />
          <div className="vpro-splash-orb orb-2" />

          {/* Center content */}
          <div className="vpro-splash-content">
            {/* Logo — animated container with rotating ring behind */}
            <motion.div
              className="vpro-splash-logo-wrap"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Rotating ring behind the logo */}
              <motion.span
                className="vpro-splash-ring"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Pulsing dot near the ring */}
              <motion.span
                className="vpro-splash-ring-dot"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* The logo image itself */}
              <motion.img
                src={logoImage}
                alt="VProTech Digital"
                className="vpro-splash-logo-img"
                draggable="false"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              className="vpro-splash-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              VProTech <span>Digital</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="vpro-splash-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Innovation • Sustainability • Impact
            </motion.p>

            {/* Loading dots */}
            <div className="vpro-splash-dots">
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
              />
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
              />
            </div>

            {/* Progress bar */}
            <div className="vpro-splash-progress">
              <motion.div
                className="vpro-splash-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}