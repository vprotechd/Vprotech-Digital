import { useEffect, useState } from "react";
import { X, ArrowRight, Tag } from "lucide-react";
import { offerService } from "../services/api";
import "./OffersPopup.css";

const OffersPopup = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let popupTimer;

    const loadOffers = async () => {
      try {
        const response = await offerService.getPopupOffers();

      const activeOffers = Array.isArray(response.data)
  ? response.data
  : [];

        if (activeOffers.length === 0) {
          return;
        }

        setOffers(activeOffers);

        // Show popup only once per browser session
        const alreadyShown = sessionStorage.getItem(
          "vprotech_offer_popup_shown"
        );

        if (!alreadyShown) {
          // Show popup after 5 seconds
          popupTimer = setTimeout(() => {
            setVisible(true);

            sessionStorage.setItem(
              "vprotech_offer_popup_shown",
              "true"
            );
          }, 5000);
        }
      } catch (error) {
        console.error("Failed to load offers:", error);
      }
    };

    loadOffers();

    // Cleanup timer
    return () => {
      if (popupTimer) {
        clearTimeout(popupTimer);
      }
    };
  }, []);

  const closePopup = () => {
    setVisible(false);
  };

  const nextOffer = () => {
    setCurrentIndex(
      (previous) => (previous + 1) % offers.length
    );
  };

  const previousOffer = () => {
    setCurrentIndex(
      (previous) =>
        (previous - 1 + offers.length) % offers.length
    );
  };

  if (!visible || offers.length === 0) {
    return null;
  }

  const offer = offers[currentIndex];

  return (
    <div className="offers-popup-overlay">

      <div className="offers-popup">

        {/* Close Button */}
        <button
          className="offers-popup-close"
          onClick={closePopup}
          aria-label="Close offer"
        >
          <X size={22} />
        </button>

        {/* Offer Image */}
        <div className="offers-popup-image">

          {offer.image ? (
            <img
              src={offer.image}
              alt={offer.courseName || "Course offer"}
            />
          ) : (
            <div className="offers-popup-placeholder">
              <Tag size={45} />
            </div>
          )}

          {/* Discount */}
          {offer.discountPercentage > 0 && (
            <div className="offers-popup-discount">
              {offer.discountPercentage}% OFF
            </div>
          )}

        </div>

        {/* Offer Content */}
        <div className="offers-popup-content">

          <span className="offers-popup-label">
            SPECIAL COURSE OFFER
          </span>

          <h2>
            {offer.title}
          </h2>

          <h3>
            {offer.courseName}
          </h3>

          {offer.description && (
            <p>
              {offer.description}
            </p>
          )}

          {/* Price */}
          <div className="offers-popup-price">

            <span className="old-price">
              ₹
              {Number(
                offer.originalPrice
              ).toLocaleString("en-IN")}
            </span>

            <span className="new-price">
              ₹
              {Number(
                offer.offerPrice
              ).toLocaleString("en-IN")}
            </span>

          </div>

          {/* View Course Button */}
          <a
            href={offer.buttonLink || "/courses"}
            className="offers-popup-button"
          >
            {offer.buttonText || "View Course"}

            <ArrowRight size={18} />
          </a>

        </div>

        {/* Navigation */}
        {offers.length > 1 && (
          <div className="offers-popup-navigation">

            <button
              onClick={previousOffer}
              aria-label="Previous offer"
            >
              ‹
            </button>

            <div className="offer-dots">

              {offers.map((_, index) => (
                <button
                  key={index}
                  className={
                    index === currentIndex
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`Go to offer ${
                    index + 1
                  }`}
                />
              ))}

            </div>

            <button
              onClick={nextOffer}
              aria-label="Next offer"
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