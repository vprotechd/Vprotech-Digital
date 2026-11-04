
import React from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiLinkedin,
  FiFacebook,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import "./Footer.css";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/company/vprotechdigital",
    icon: FiLinkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/vprotechdigital/?_rdr",
    icon: FiFacebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/vprotech_digitalx/",
    icon: FiInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@vprotechdigital5980",
    icon: FiYoutube,
  },
];

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/blogs", label: "Blogs" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
  { to: "/portfolio", label: "Portfolio" },
];

const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-and-conditions", label: "Terms & Conditions" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND / SOCIAL */}

        <div className="footer-col footer-brand">
          <h3 className="footer-label">
            © {new Date().getFullYear()} VProTech Digital
          </h3>

          <div className="footer-socials">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="social-icon"
              >
                <Icon />
              </a>
            ))}
          </div>

          <p className="footer-description">
            Empowering students and businesses through{" "}
            <strong>IT training</strong>, software development, web solutions,
            AI and digital marketing.
          </p>
        </div>

        {/* QUICK LINKS */}

        <div className="footer-col">
          <h3 className="footer-label">Quick Links</h3>

          <ul className="footer-list">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}

        <div className="footer-col">
          <h3 className="footer-label">Contact Us</h3>

          <ul className="footer-list">
            <li>
              <a href="tel:+918894110026" className="footer-link with-icon">
                <FiPhone />
                <span>+91 88941 10026</span>
              </a>
            </li>

            <li>
              <a href="tel:+918146759497" className="footer-link with-icon">
                <FiPhone />
                <span>+91 81467 59497</span>
              </a>
            </li>

            <li>
              <a
                href="mailto:vprotechdigitalmohali@gmail.com"
                className="footer-link with-icon"
              >
                <FiMail />
                <span>vprotechdigitalmohali@gmail.com</span>
              </a>
            </li>

            <li>
              <span className="footer-link with-icon static">
                <FiMapPin />
                <span>Mohali, Punjab, India</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* LEGAL LINKS */}

      <div className="footer-legal">
        <div className="footer-legal-links">
          {LEGAL_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="footer-legal-link">
              {label}
            </Link>
          ))}
        </div>

        <p className="footer-legal-copyright">
          © {new Date().getFullYear()} VProTech Digital. All rights reserved.
        </p>
      </div>

      {/* GIANT WORDMARK */}

      <div className="footer-wordmark" aria-hidden="true">
        Vprotech Digital
      </div>
    </footer>
  );
}
