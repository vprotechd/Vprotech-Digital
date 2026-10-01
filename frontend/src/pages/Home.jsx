import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Existing sections
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import LogoSliderSection from "../components/sections/LogoSliderSection";
import ProcessSection from "../components/sections/ProcessSection";

// New sections
import WhyChooseUsSection from "../components/sections/WhyChooseUsSection";
import IndustriesSection from "../components/sections/IndustriesSection";
import HomeCTASection from "../components/sections/HomeCTASection";
import OffersPopup from "../components/OffersPopup";

// CSS
import "./Home.css";
import "../App.css";
import "../components/sections/ProcessSection.css";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coursesRef = useRef(null);
  const servicesRef = useRef(null);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="home-page">


      <OffersPopup />


      {/* =====================================================
          01 — HERO
      ===================================================== */}

      <HeroSection />


      {/* =====================================================
          02 — ABOUT
      ===================================================== */}

      <AboutSection />



      {/* =====================================================
          04 — WHY CHOOSE US
      ===================================================== */}

      <WhyChooseUsSection />


      {/* =====================================================
          05 — OUR PROCESS
      ===================================================== */}

      <ProcessSection />


      {/* =====================================================
          06 — INDUSTRIES WE SERVE
      ===================================================== */}

      <IndustriesSection />


 {/* =====================================================
          03 — LOGO / CLIENT SLIDER
      ===================================================== */}

      <LogoSliderSection />


      {/* =====================================================
          07 — FINAL CTA
      ===================================================== */}

      <HomeCTASection />

    </main>
  );
}