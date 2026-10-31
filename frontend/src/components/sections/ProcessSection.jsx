import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

import "./ProcessSection.css";

/* ---- adjust this path to wherever your assets folder is ---- */
import shareImg from "../../assets/share.jpg";
import strategyImg from "../../assets/strategy.jpg";
import designImg from "../../assets/designn.jpg";

/* ============================================================
   CONTENT
============================================================ */

const steps = [
  {
    image: shareImg,
    title: "Share Your Requirements",
    desc: "Tell us about your business goals, website requirements, application needs, or digital challenges.",
  },
  {
    image: strategyImg,
    title: "Strategy & Planning",
    desc: "We prepare the perfect roadmap including design, development, timeline and execution plan.",
  },
  {
    image: designImg,
    title: "Design, Launch & Growth",
    desc: "Our experts build, test and launch your project while providing continuous support.",
  },
];

const TOTAL = steps.length;

const GAP = 40; // space between cards (px)
const SIDE_SCALE = 0.86; // size of the side cards
const STEP_COOLDOWN = 700; // ms before the next card can change

/* ============================================================
   SECTION
============================================================ */

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  /* track screen width so spacing always matches card size */
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ----------------------------------------------------------
     ONE SCROLL = ONE CARD
     - when the section reaches the screen it snaps in and locks
     - each wheel / swipe / arrow key moves exactly one card
     - after the last card (or before the first) the lock
       releases and the page scrolls normally
  ---------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";

    const st = {
      locked: false,
      active: 0,
      lastY: window.scrollY,
      lastWheel: 0,
      lastStep: 0,
      touchY: null,
      touchDone: false,
    };

    const show = (i) => {
      st.active = i;
      setActive(i);
    };

    const lock = (startIndex) => {
      st.locked = true;
      st.lastStep = performance.now();
      show(startIndex);
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY,
        behavior,
      });
    };

    const release = (dir) => {
      st.locked = false;
      window.scrollBy({ top: dir * window.innerHeight * 0.4, behavior });
    };

    const step = (dir) => {
      const now = performance.now();
      if (now - st.lastStep < STEP_COOLDOWN) return;
      st.lastStep = now;

      const next = st.active + dir;
      if (next < 0 || next >= TOTAL) {
        release(dir);
        return;
      }
      show(next);
    };

    /* mouse wheel / trackpad */
    const onWheel = (e) => {
      if (!st.locked) return;
      e.preventDefault();

      const now = performance.now();
      const isNewGesture = now - st.lastWheel > 120; // ignores trackpad inertia
      st.lastWheel = now;

      if (!isNewGesture || Math.abs(e.deltaY) < 4) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    /* touch swipe */
    const onTouchStart = (e) => {
      st.touchY = e.touches[0].clientY;
      st.touchDone = false;
    };

    const onTouchMove = (e) => {
      if (!st.locked) return;
      if (e.cancelable) e.preventDefault();
      if (st.touchDone || st.touchY === null) return;

      const dy = st.touchY - e.touches[0].clientY;
      if (Math.abs(dy) > 40) {
        st.touchDone = true;
        step(dy > 0 ? 1 : -1);
      }
    };

    /* keyboard */
    const onKey = (e) => {
      if (!st.locked) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === " ") dir = e.shiftKey ? -1 : 1;

      if (dir) {
        e.preventDefault();
        step(dir);
      }
    };

    /* decides when the section should lock */
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > st.lastY;
      const goingUp = y < st.lastY;
      st.lastY = y;

      const vh = window.innerHeight;
      const top = section.getBoundingClientRect().top;

      if (st.locked) {
        /* user dragged the scrollbar away -> let go */
        if (Math.abs(top) > vh * 0.5) st.locked = false;
        return;
      }

      if (goingDown && top > 0 && top < vh * 0.4) lock(0);
      else if (goingUp && top < 0 && top > -vh * 0.4) lock(TOTAL - 1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isMobile = vw <= 800;

  /* card width must match the CSS width */
  const cardW = isMobile ? Math.min(270, vw * 0.72) : 340;

  /* distance between centres = half centre card + half side card + gap */
  const spread = cardW / 2 + (cardW * SIDE_SCALE) / 2 + GAP;

  /* position of a card relative to the active one: -1 | 0 | 1 */
  const getOffset = (index) =>
    ((index - active + 1 + TOTAL * 10) % TOTAL) - 1;

  const getAnimate = (offset) => {
    if (offset === 0) {
      return { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 };
    }
    return {
      x: offset * spread,
      y: 0,
      scale: SIDE_SCALE,
      opacity: 1,
      rotate: 0,
    };
  };

  return (
    <section className="pc-section" ref={sectionRef}>
      <div className="pc-sticky">
        <div className="pc-glow pc-glow-one" />
        <div className="pc-glow pc-glow-two" />

        {/* Heading */}
        <motion.h4
          className="pc-small"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          WORKING PROCESS
        </motion.h4>

        <motion.h2
          className="pc-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true }}
        >
          How Can You Start?
        </motion.h2>

        {/* Rotating cards */}
        <div className="pc-stage">
          {steps.map((step, index) => {
            const offset = getOffset(index);
            const isActive = offset === 0;

            return (
              <motion.article
                key={step.title}
                className={`pc-card ${isActive ? "is-active" : ""}`}
                animate={getAnimate(offset)}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex: isActive ? 5 : 2 }}
              >
                <div className="pc-media">
                  <img src={step.image} alt={step.title} draggable="false" />
                  <span className="pc-step">STEP 0{index + 1}</span>
                </div>

                <div className="pc-text">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* progress dots */}
        <div className="pc-dots">
          {steps.map((s, i) => (
            <span key={s.title} className={i === active ? "on" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}