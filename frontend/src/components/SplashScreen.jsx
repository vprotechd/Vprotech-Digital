
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./SplashScreen.css";

// Logo
import logoImage from "../assets/lll.png";

/* ============================================================
   PROFESSIONAL SPLASH SCREEN
   - Uses only the existing VProTech logo
   - Premium minimal animation
   - Logo reveal
   - Animated glow
   - Progress indicator
   - Smooth exit
============================================================ */

export default function SplashScreen({ duration = 2600 }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let animationFrame;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);

      setProgress(pct);

      if (pct < 100) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      cancelAnimationFrame(animationFrame);
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
            scale: 1.02,
            transition: {
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >

          {/* ==================================================
              BACKGROUND LIGHT
          ================================================== */}

          <div className="vpro-splash-light" />

          <motion.div
            className="vpro-splash-light-orb"
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />


          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <div className="vpro-splash-content">

            {/* ==================================================
                LOGO AREA
            ================================================== */}

            <motion.div
              className="vpro-splash-logo-container"

              initial={{
                opacity: 0,
                scale: 0.75,
                y: 20,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >

              {/* Outer rotating ring */}

              <motion.div
                className="vpro-splash-outer-ring"

                animate={{
                  rotate: 360,
                }}

                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Inner glow */}

              <motion.div
                className="vpro-splash-logo-glow"

                animate={{
                  scale: [0.9, 1.08, 0.9],
                  opacity: [0.45, 0.75, 0.45],
                }}

                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Logo */}

              <motion.img
                src={logoImage}
                alt="VProTech Digital"
                className="vpro-splash-logo-img"

                draggable="false"

                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                transition={{
                  delay: 0.2,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

            </motion.div>


            {/* ==================================================
                LOADING INDICATOR
            ================================================== */}

            <motion.div
              className="vpro-splash-loading"

              initial={{
                opacity: 0,
                y: 15,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                delay: 0.65,
                duration: 0.5,
              }}
            >

              {/* Animated dots */}

              <div className="vpro-splash-dots">

                <motion.span
                  animate={{
                    y: [0, -5, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: 0,
                  }}
                />

                <motion.span
                  animate={{
                    y: [0, -5, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: 0.15,
                  }}
                />

                <motion.span
                  animate={{
                    y: [0, -5, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: 0.3,
                  }}
                />

              </div>


              {/* Percentage */}

              <span className="vpro-splash-percentage">
                {Math.round(progress)}%
              </span>

            </motion.div>


            {/* ==================================================
                PROGRESS BAR
            ================================================== */}

            <motion.div
              className="vpro-splash-progress"

              initial={{
                opacity: 0,
                scaleX: 0.7,
              }}

              animate={{
                opacity: 1,
                scaleX: 1,
              }}

              transition={{
                delay: 0.75,
                duration: 0.5,
              }}
            >

              <motion.div
                className="vpro-splash-progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />

            </motion.div>

          </div>


          {/* ==================================================
              CORNER DETAILS
          ================================================== */}

          <div className="vpro-splash-corner corner-top-left" />
          <div className="vpro-splash-corner corner-bottom-right" />

        </motion.div>
      )}
    </AnimatePresence>
  );
}

