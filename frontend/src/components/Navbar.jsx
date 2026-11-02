import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/imagesss.png";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiBookOpen,
  FiGrid,
  FiEdit3,
  FiBriefcase,
  FiMail,
  FiLayers,
  FiClipboard,
  FiFileText,
  FiSettings,
  FiArrowUpRight,
  FiChevronDown,
  FiCompass,
} from "react-icons/fi";

// =========================================================
// LINK CONFIG (add / remove / reorder links here)
// =========================================================

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: FiSettings, end: true },
  { to: "/admin/jobs", label: "Manage Jobs", icon: FiBriefcase },
];

// Links shown directly in the navbar (before the Explore dropdown)
const LINKS_BEFORE_EXPLORE = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/about", label: "About", icon: FiInfo },
  { to: "/courses", label: "Courses", icon: FiBookOpen },
  { to: "/services", label: "Services", icon: FiGrid },
];

// Links shown directly in the navbar (after the Explore dropdown)
const LINKS_AFTER_EXPLORE = [
  { to: "/careers", label: "Careers", icon: FiBriefcase },
  { to: "/contact", label: "Contact", icon: FiMail },
];

// Links inside the "Explore" dropdown
// NOTE: change "/admission" if your admission form route is different
const EXPLORE_LINKS = [
  { to: "/blogs", label: "Blogs", icon: FiEdit3 },
  { to: "/portfolio", label: "Portfolio", icon: FiLayers },
  { to: "/admission-form", label: "Admission Form", icon: FiFileText },
  { to: "/internship", label: "Start Assessment", icon: FiClipboard },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const exploreRef = useRef(null);
  const location = useLocation();

  // Explore button looks "active" when any of its pages is open
  const exploreActive = EXPLORE_LINKS.some(({ to }) =>
    location.pathname.startsWith(to)
  );

  // =========================================================
  // CHECK ADMIN LOGIN
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    let storedUser = {};

    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      storedUser = {};
    }

    setIsAdmin(Boolean(token && storedUser?.role === "admin"));
  }, []);

  // =========================================================
  // SCROLL EFFECT
  // =========================================================

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // =========================================================
  // BODY SCROLL LOCK WHEN MOBILE MENU OPEN
  // =========================================================

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  // =========================================================
  // CLOSE EXPLORE DROPDOWN: outside click + Escape key
  // =========================================================

  useEffect(() => {
    if (!exploreOpen) return undefined;

    const handleOutside = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setExploreOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [exploreOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setExploreOpen(false);
  };

  // =========================================================
  // LOGOUT (kept for later use)
  // =========================================================

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAdmin(false);
    setMenuOpen(false);

    window.location.href = "/";
  };

  // =========================================================
  // USER
  // =========================================================

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const isSuperAdmin = user?.role === "superadmin" || user?.role === "admin";

  const renderLink = ({ to, label, icon: Icon, end }, extraClass = "") => (
    <li key={to} className={extraClass}>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        onClick={closeMenu}
      >
        <Icon className="nav-link-icon" aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    </li>
  );

  return (
    <>
      <nav className={`main-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* LOGO */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img src={logo} alt="VProTech Digital" />
          </Link>

          {/* NAVIGATION */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            {isSuperAdmin &&
              ADMIN_LINKS.map((item) => renderLink(item, "admin-nav-item"))}

            {LINKS_BEFORE_EXPLORE.map((item) => renderLink(item))}

            {/* EXPLORE DROPDOWN */}
            <li
              ref={exploreRef}
              className={`nav-dropdown ${exploreOpen ? "open" : ""}`}
            >
              <button
                type="button"
                className={`nav-link nav-dropdown-toggle ${
                  exploreActive ? "active" : ""
                }`}
                onClick={() => setExploreOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={exploreOpen}
              >
                <FiCompass className="nav-link-icon" aria-hidden="true" />
                <span>Explore</span>
                <FiChevronDown className="nav-chevron" aria-hidden="true" />
              </button>

              <ul className="nav-dropdown-menu">
                {EXPLORE_LINKS.map((item) => renderLink(item))}
              </ul>
            </li>

            {LINKS_AFTER_EXPLORE.map((item) => renderLink(item))}

            {/* MOBILE ONLY BUTTONS */}
            <li className="mobile-only-actions">
              <Link
                to="/register"
                className="mobile-start-button"
                onClick={closeMenu}
              >
                <span>Register For Internship</span>
                <FiArrowUpRight size={17} />
              </Link>
            </li>
          </ul>

          {/* RIGHT SIDE ACTIONS */}
          <div className="navbar-actions">
            {/* HIGHLIGHTED CTA */}
            <Link to="/register" className="get-started-button">
              <span className="cta-label">Register For Internship</span>
              <FiArrowUpRight size={17} />
            </Link>

            {/* MOBILE MENU */}
            <button
              type="button"
              className="mobile-menu-icon"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      />
    </>
  );
}