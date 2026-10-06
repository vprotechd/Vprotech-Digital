import React from "react";
import "./LogoSliderSection.css";

import logo1 from "../../assets/allenagroup.png";
import logo2 from "../../assets/CBL.png";
import logo3 from "../../assets/greenlotus.png";
import logo4 from "../../assets/gulmohar.png";
import logo5 from "../../assets/IBM.png";
import logo6 from "../../assets/Infotech.png";
import logo7 from "../../assets/JLPL-Logo-white-2023.png";
import logo8 from "../../assets/MGE.png";
import logo9 from "../../assets/PJ.png";
import logo10 from "../../assets/SEWlogo.png";
import logo11 from "../../assets/shiv&sons.png";
import logo12 from "../../assets/SK files&tools.png";
import logo13 from "../../assets/tech mahindra.png";
import logo14 from "../../assets/wiproapplying.png";
import logo15 from "../../assets/logo15.png";
import logo16 from "../../assets/logo16.png";
import logo17 from "../../assets/logo17.png";
import logo18 from "../../assets/logo18.png";
import logo19 from "../../assets/logo19.png";
import logo20 from "../../assets/logo20.png";
import logo21 from "../../assets/logo21.png";
import logo22 from "../../assets/logo22.png";
import logo23 from "../../assets/logo23.png";
import logo24 from "../../assets/logo24.png";
import logo25 from "../../assets/logo25.png";

const logos = [
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
  logo8,
  logo9,
  logo10,
  logo11,
  logo12,
  logo13,
  logo14,
  logo15,
  logo16,
  logo17,
  logo18,
  logo19,
  logo20,
  logo21,
  logo22,
  logo23,
  logo24,
  logo25,
];

export default function LogoSliderSection() {
  // Split logos into two rows
  const topRow = logos.slice(0, 13);
  const bottomRow = logos.slice(13);

  return (
    <section className="logo-section">
      <h2>Our Partners</h2>

      <div className="logo-slider">
        {/* TOP ROW - RIGHT TO LEFT */}
        <div className="logo-row">
          <div className="logo-track logo-track-left">
            {[topRow, topRow].map((logoSet, setIndex) => (
              <div
                className="logo-group"
                key={`top-set-${setIndex}`}
                aria-hidden={setIndex === 1}
              >
                {logoSet.map((logo, index) => (
                  <div className="logo-item" key={`top-${setIndex}-${index}`}>
                    <img
                      src={logo}
                      alt={setIndex === 0 ? `Partner logo ${index + 1}` : ""}
                      loading="lazy"
                      width="150"
                      height="80"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW - LEFT TO RIGHT */}
        <div className="logo-row">
          <div className="logo-track logo-track-right">
            {[bottomRow, bottomRow].map((logoSet, setIndex) => (
              <div
                className="logo-group"
                key={`bottom-set-${setIndex}`}
                aria-hidden={setIndex === 1}
              >
                {logoSet.map((logo, index) => (
                  <div className="logo-item" key={`bottom-${setIndex}-${index}`}>
                    <img
                      src={logo}
                      alt={setIndex === 0 ? `Partner logo ${index + 14}` : ""}
                      loading="lazy"
                      width="150"
                      height="80"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}