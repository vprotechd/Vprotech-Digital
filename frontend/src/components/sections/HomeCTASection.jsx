import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./HomeCTASection.css";

export default function HomeCTASection() {

  const navigate = useNavigate();

  return (
    <section className="home-cta-section">

      {/* Decorative elements */}

      <div className="home-cta-orb home-cta-orb-one"></div>
      <div className="home-cta-orb home-cta-orb-two"></div>

      <div className="home-cta-grid"></div>


      <motion.div
        className="home-cta-container"
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.7,
        }}
      >

       


        {/* Heading */}

        <h2>
          Have an Idea?
          <br />
          <span>Let's Build It.</span>
        </h2>


        {/* Description */}

        <p>
          From websites and mobile applications to digital
          growth solutions, we help turn ideas into practical
          digital experiences.
        </p>


        {/* Buttons */}

        <div className="home-cta-actions">


 <motion.button
  type="button"
  className="vpro-primary-btn"
  onClick={() => navigate("/services")}
  whileHover={{
    scale: 1.05,
  }}
  whileTap={{
    scale: 0.96,
  }}
>
  <span>Our Services</span>
  <ArrowRight size={18} />
</motion.button>


          <button
            className="home-cta-secondary"
            onClick={() => navigate("/contact")}
          >
            <MessageCircle size={18} />
            Talk to Our Team
          </button>

        </div>

      </motion.div>

    </section>
  );
}