import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/imagesss.png";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHome,
  FiInfo,
  FiBookOpen,
  FiGrid,
  FiEdit3,
  FiBriefcase,
  FiMail,
  FiLayers,
  FiClipboard,
  FiSettings,
  FiArrowUpRight,
} from "react-icons/fi";

// =========================================================
// LINK CONFIG (add / remove / reorder links here)
// =========================================================

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: FiSettings, end: true },
  { to: "/admin/jobs", label: "Manage Jobs", icon: FiBriefcase },
];

const MAIN_LINKS = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/about", label: "About", icon: FiInfo },
  { to: "/courses", label: "Courses", icon: FiBookOpen },
  { to: "/services", label: "Services", icon: FiGrid },
  { to: "/blogs", label: "Blogs", icon: FiEdit3 },
  { to: "/careers", label: "Careers", icon: FiBriefcase },
  { to: "/contact", label: "Contact", icon: FiMail },
  { to: "/portfolio", label: "Portfolio", icon: FiLayers },
  { to: "/internship", label: "Start Assessment", icon: FiClipboard },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const closeMenu = () => setMenuOpen(false);

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

            {MAIN_LINKS.map((item) => renderLink(item))}

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