
import React from "react";
import "./JourneySection.css";

// Add your journey images here
import journey1 from "../../assets/img1.jpg";
import journey2 from "../../assets/img2.jpg";
import journey3 from "../../assets/img3.jpg";
import journey4 from "../../assets/img4.jpg";
import journey5 from "../../assets/img5.jpg";
import journey6 from "../../assets/img6.jpg";
import journey7 from "../../assets/img7.jpg";
import journey8 from "../../assets/img8.jpg";



const journeyImages = [
  journey1,
  journey2,
  journey3,
  journey4,
  journey5,
  journey6,
  journey7,
  journey8,

];

export default function JourneySection() {
  return (
    <section className="journey-section">
      <div className="journey-container">

        <div className="journey-heading">
          <span className="journey-label">OUR JOURNEY</span>

          <h2>
            Growing, Learning & <span>Building Together</span>
          </h2>

          <p>
            Take a look at our journey, milestones, and the moments that
            shaped who we are today.
          </p>
        </div>

        <div className="journey-slider">
          <div className="journey-track">
            {[journeyImages, journeyImages].map((imageSet, setIndex) => (
              <div
                className="journey-group"
                key={`journey-set-${setIndex}`}
                aria-hidden={setIndex === 1}
              >
                {imageSet.map((image, index) => (
                  <div className="journey-card" key={`journey-${setIndex}-${index}`}>
                    <img
                      src={image}
                      alt={setIndex === 0 ? `Our Journey ${index + 1}` : ""}
                      loading="lazy"
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
