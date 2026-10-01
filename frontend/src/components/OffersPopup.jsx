import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  X,
  ArrowRight,
  Tag,
  UserPlus,
} from "lucide-react";

import { offerService } from "../services/api";

import "./OffersPopup.css";

// ======================================================
// COURSE IMAGES
// ======================================================

import cCppImage from "../assets/images/courses/c-cpp.jpg";
import webDesigningImage from "../assets/images/courses/web-designing.jpg";
import digitalMarketingImage from "../assets/images/courses/digital-marketing.jpg";
import javaPythonImage from "../assets/images/courses/java-python.jpg";
import javascriptImage from "../assets/images/courses/javascript.jpg";
import machineLearningImage from "../assets/images/courses/machine-learning.jpg";
import iotImage from "../assets/images/courses/iot.jpg";
import networkingImage from "../assets/images/courses/networking.jpg";
import dataScienceImage from "../assets/images/courses/data-science.jpg";
import artificialIntelligenceImage from "../assets/images/courses/artificial-intelligence.jpg";
import autocadMechanicalImage from "../assets/images/courses/autocad-mechanical.jpg";
import autocadCivilImage from "../assets/images/courses/autocad-civil.jpg";
import solidworksImage from "../assets/images/courses/solidworks.jpg";
import catiaImage from "../assets/images/courses/catia.jpg";
import creoImage from "../assets/images/courses/creo.jpg";
import staadProImage from "../assets/images/courses/staad-pro.jpg";
import revitImage from "../assets/images/courses/revit.jpg";
import matlabImage from "../assets/images/courses/matlab.jpg";
import embeddedSystemImage from "../assets/images/courses/embedded-system.jpg";
import roboticsImage from "../assets/images/courses/robotics.jpg";

// ======================================================
// COURSE IMAGE MAP
// ======================================================

const courseImages = {
  "c-cpp": cCppImage,
  "web-designing": webDesigningImage,
  "digital-marketing": digitalMarketingImage,
  "java-python": javaPythonImage,
  javascript: javascriptImage,
  "machine-learning": machineLearningImage,
  iot: iotImage,
  networking: networkingImage,
  "data-science": dataScienceImage,
  "artificial-intelligence": artificialIntelligenceImage,
  "autocad-mechanical": autocadMechanicalImage,
  "autocad-civil": autocadCivilImage,
  solidworks: solidworksImage,
  catia: catiaImage,
  creo: creoImage,
  "staad-pro": staadProImage,
  revit: revitImage,
  matlab: matlabImage,
  "embedded-system": embeddedSystemImage,
  robotics: roboticsImage,
};

// ======================================================
// GET COURSE IMAGE
// ======================================================

const getCourseImage = (offer) => {
  if (!offer) {
    return "";
  }

  const image = offer.image || "";
  const slug = offer.courseSlug || "";

  // Old Vite source path
  if (image.startsWith("/src/")) {
    return courseImages[slug] || "";
  }

  // No image but course slug exists
  if (!image && slug) {
    return courseImages[slug] || "";
  }

  return image;
};

// ======================================================
// OFFERS POPUP
// ======================================================

const OffersPopup = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // ====================================================
  // TIMER REFERENCES
  // ====================================================

  const repeatTimerRef = useRef(null);
  const firstPopupTimerRef = useRef(null);

  // ====================================================
  // LOAD OFFERS
  // ====================================================

  useEffect(() => {
    let cancelled = false;

    const loadOffers = async () => {
      try {
        const response =
          await offerService.getPopupOffers();

        // Prevent old async request from updating
        // component after cleanup
        if (cancelled) {
          return;
        }

        const activeOffers =
          Array.isArray(response.data)
            ? response.data
            : [];

        if (activeOffers.length === 0) {
          return;
        }

        // Store all offers
        setOffers(activeOffers);

        // Start from first offer
        setCurrentIndex(0);

        // =================================================
        // SHOW POPUP AFTER 5 SECONDS
        // =================================================

        firstPopupTimerRef.current =
          setTimeout(() => {
            if (cancelled) {
              return;
            }

            setCurrentIndex(0);
            setVisible(true);
          }, 5000);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load offers:",
            error
          );
        }
      }
    };

    loadOffers();

    // ====================================================
    // CLEANUP
    // ====================================================

    return () => {
      cancelled = true;

      if (firstPopupTimerRef.current) {
        clearTimeout(
          firstPopupTimerRef.current
        );

        firstPopupTimerRef.current = null;
      }

      if (repeatTimerRef.current) {
        clearTimeout(
          repeatTimerRef.current
        );

        repeatTimerRef.current = null;
      }
    };
  }, []);

  // ====================================================
  // AUTO SLIDE THROUGH ALL OFFERS
  // ====================================================

  useEffect(() => {
    // Do nothing when popup is hidden
    if (!visible) {
      return;
    }

    // Do nothing if there is only one offer
    if (offers.length <= 1) {
      return;
    }

    // Change offer every 3 seconds
    const autoSlideTimer = setInterval(() => {
      setCurrentIndex((previous) => {
        return (
          (previous + 1) %
          offers.length
        );
      });
    }, 3000);

    // Cleanup interval
    return () => {
      clearInterval(autoSlideTimer);
    };
  }, [visible, offers.length]);

  // ====================================================
  // CLOSE POPUP
  // ====================================================

  const closePopup = () => {
    // Hide popup
    setVisible(false);

    // Clear previous repeat timer
    if (repeatTimerRef.current) {
      clearTimeout(
        repeatTimerRef.current
      );

      repeatTimerRef.current = null;
    }

    // ==================================================
    // SHOW AGAIN AFTER 10 SECONDS
    // ==================================================

    repeatTimerRef.current =
      setTimeout(() => {
        setCurrentIndex(0);
        setVisible(true);
      }, 10000);
  };

  // ====================================================
  // NEXT OFFER
  // ====================================================

  const nextOffer = () => {
    setCurrentIndex(
      (previous) =>
        (previous + 1) %
        offers.length
    );
  };

  // ====================================================
  // PREVIOUS OFFER
  // ====================================================

  const previousOffer = () => {
    setCurrentIndex(
      (previous) =>
        (previous -
          1 +
          offers.length) %
        offers.length
    );
  };

  // ====================================================
  // DON'T RENDER
  // ====================================================

  if (
    !visible ||
    offers.length === 0
  ) {
    return null;
  }

  // ====================================================
  // CURRENT OFFER
  // ====================================================

  const offer =
    offers[currentIndex];

  // ====================================================
  // IMAGE
  // ====================================================

  const imageUrl =
    getCourseImage(offer);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="offers-popup-overlay">

      <div className="offers-popup">

        {/* =================================================
            CLOSE BUTTON
        ================================================== */}

        <button
          className="offers-popup-close"
          onClick={closePopup}
          aria-label="Close offer"
          type="button"
        >
          <X size={22} />
        </button>

        {/* =================================================
            OFFER IMAGE
        ================================================== */}

        <div className="offers-popup-image">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={
                offer.courseName ||
                "Course offer"
              }
              onError={(event) => {
                const fallback =
                  courseImages[
                    offer.courseSlug
                  ];

                if (
                  fallback &&
                  event.currentTarget.src !==
                    fallback
                ) {
                  event.currentTarget.src =
                    fallback;
                }
              }}
            />
          ) : (
            <div className="offers-popup-placeholder">
              <Tag size={45} />
            </div>
          )}

          {/* DISCOUNT */}

          {Number(
            offer.discountPercentage
          ) > 0 && (
            <div className="offers-popup-discount">
              {offer.discountPercentage}% OFF
            </div>
          )}

        </div>

        {/* =================================================
            OFFER CONTENT
        ================================================== */}

        <div className="offers-popup-content">

          {/* LABEL */}

          <span className="offers-popup-label">
            SPECIAL COURSE OFFER
          </span>

          {/* TITLE */}

          <h2>
            {offer.title}
          </h2>

          {/* COURSE NAME */}

          <h3>
            {offer.courseName}
          </h3>

          {/* DESCRIPTION */}

          {offer.description && (
            <p>
              {offer.description}
            </p>
          )}

          {/* =================================================
              PRICE
          ================================================== */}

          <div className="offers-popup-price">

            <span className="old-price">
              ₹
              {Number(
                offer.originalPrice
              ).toLocaleString(
                "en-IN"
              )}
            </span>

            <span className="new-price">
              ₹
              {Number(
                offer.offerPrice
              ).toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <div className="offers-popup-buttons">

            {/* VIEW COURSE */}

            <a
              href={
                offer.buttonLink ||
                "/courses"
              }
              className="offers-popup-button"
            >
              {offer.buttonText ||
                "View Course"}

              <ArrowRight size={18} />
            </a>

            {/* REGISTER NOW */}

            <a
              href="/register"
              className="offers-popup-register-button"
            >
              <UserPlus size={18} />
              Register Now
            </a>

          </div>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        {offers.length > 1 && (
          <div className="offers-popup-navigation">

            {/* PREVIOUS */}

            <button
              onClick={
                previousOffer
              }
              aria-label="Previous offer"
              type="button"
            >
              ‹
            </button>

            {/* DOTS */}

            <div className="offer-dots">

              {offers.map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      index ===
                      currentIndex
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentIndex(
                        index
                      )
                    }
                    aria-label={`Go to offer ${
                      index + 1
                    }`}
                  />
                )
              )}

            </div>

            {/* NEXT */}

            <button
              onClick={
                nextOffer
              }
              aria-label="Next offer"
              type="button"
            >
              ›
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default OffersPopup;