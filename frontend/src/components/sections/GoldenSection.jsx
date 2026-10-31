import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import aboutImage from "../../assets/aboutt.jpg";

import "./GoldenSection.css";

export default function GoldenSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="golden-section" aria-labelledby="golden-title">
      <div className="golden-container">
        {/* Left: copy */}
        <motion.div
          className="golden-content"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 id="golden-title" className="golden-title">
            Transform Ideas Into Digital Success
          </h1>

          <p className="golden-text">
            We build scalable software, mobile apps, and digital solutions
            that help businesses streamline operations, improve customer
            experiences, and accelerate growth.
          </p>
        </motion.div>

        {/* Right: image card overlapping the navy panel */}
        <motion.div
          className="golden-visual"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          <img
            src={aboutImage}
            alt="Team collaborating around a table in a meeting room"
            className="golden-image"
          />
        </motion.div>
      </div>
    </section>
  );
}