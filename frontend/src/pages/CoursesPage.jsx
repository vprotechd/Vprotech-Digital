import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import DomainsCourses from "./DomainsCourses";


import img1 from "../assets/img4.jpg";
import img3 from "../assets/img7.jpg";
import img6 from "../assets/img6.jpg";

import "./CoursesPage.css";

export default function CoursesPage() {
  return (
    <main className="courses-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="courses-hero">

        <div className="courses-hero-glow glow-one"></div>
        <div className="courses-hero-glow glow-two"></div>
        <div className="courses-hero-grid"></div>

        <div className="courses-hero-container">

          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <motion.div
            className="courses-hero-content"
            initial={{
              opacity: 0,
              x: -45,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >

           

            <h1>
              Build Skills.
              <br />
              <span>Build Your Future.</span>
            </h1>

            <p>
              Explore industry-focused courses designed to help
              students learn practical skills, work on real
              projects and prepare for modern careers.
            </p>

            <div className="courses-hero-actions">

              <a
                href="#course-programs"
                className="courses-primary-btn"
              >
                Explore Courses
                <ArrowRight size={18} />
              </a>

              <div className="courses-hero-note">
                <GraduationCap size={18} />
                <span>Industry-focused learning</span>
              </div>

            </div>

          </motion.div>


          {/* =================================================
              HERO VISUAL
          ================================================= */}

          <motion.div
            className="courses-hero-visual"
            initial={{
              opacity: 0,
              scale: 0.9,
              x: 45,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
            }}
          >

            {/* Decorative Orbits */}

            <div className="courses-orbit orbit-one"></div>
            <div className="courses-orbit orbit-two"></div>


            {/* =================================================
                MAIN HERO IMAGE
            ================================================= */}

            <div className="courses-photo photo-main">

              <img
                src={img1}
                alt="VProTech students learning"
              />

            </div>


            {/* =================================================
                SMALL IMAGE ONE
            ================================================= */}

            <motion.div
              className="courses-photo photo-small photo-small-one"
              animate={{
                y: [0, -12, 0],
                rotate: [-5, -2, -5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <img
                src={img3}
                alt="VProTech learning"
              />

            </motion.div>


            {/* =================================================
                SMALL IMAGE TWO
            ================================================= */}

            <motion.div
              className="courses-photo photo-small photo-small-two"
              animate={{
                y: [0, 12, 0],
                rotate: [5, 2, 5],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <img
                src={img6}
                alt="VProTech training"
              />

            </motion.div>


            {/* =================================================
                LEARNING CARD
            ================================================= */}

            <motion.div
              className="courses-floating-card card-learning"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 0.6,
              }}
            >

              <div className="floating-icon">
                <BookOpen size={18} />
              </div>

              <div>
                <strong>Practical Learning</strong>
                <span>Projects + Skills</span>
              </div>

            </motion.div>


            {/* =================================================
                CAREER CARD
            ================================================= */}

            <motion.div
              className="courses-floating-card card-career"
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
                duration: 0.6,
              }}
            >

              <div className="floating-icon">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <strong>Career Focused</strong>
                <span>Industry Ready</span>
              </div>

            </motion.div>

          </motion.div>

        </div>

      </section>



      {/* =====================================================
          DOMAIN & COURSES SECTION
      ===================================================== */}

      <section
        id="course-programs"
        className="courses-programs"
      >



        {/* =================================================
            ONLY DOMAIN COURSES
        ================================================= */}

        <DomainsCourses />

      </section>

    </main>
  );
}