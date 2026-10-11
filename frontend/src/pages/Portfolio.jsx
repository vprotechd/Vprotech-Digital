import React, { useState } from "react";
import "./Portfolio.css";

import avsSolarImage from "../assets/portfolio/AVS Solar Consultancy Showcase.png";
import goNbiteImage from "../assets/portfolio/GoNbite Mobile App Showcase.png";
import jobifyImage from "../assets/portfolio/Jobify Mobile and Web App Showcase.png";

const projects = [
  {
    id: 1,
    title: "AVS Solar Consultancy",
    category: "Web Development",
    description:
      "A professional solar consultancy website designed to showcase solar energy services and help customers explore clean-energy solutions.",
    technologies: ["React", "JavaScript", "CSS", "Responsive Design"],
    image: avsSolarImage,
    liveUrl: "https://avs-solar-consultancy.onrender.com",
  },
 
  {
    id: 2,
    title: "Jobify Mobile & Web App",
    category: "Web Development",
    description:
      "A job portal application connecting job seekers and recruiters through job discovery, search filters, profiles, and recruitment features.",
    technologies: ["React", "React Native", "Node.js", "MongoDB"],
    image: jobifyImage,
    liveUrl: "https://jobify-application-frontend.onrender.com",
  },

   {
    id: 3,
    title: "GoNbite Mobile App",
    category: "Mobile App",
    description:
      "A modern food delivery application designed to make discovering restaurants and ordering food simple and convenient.",
    technologies: ["React Native", "Node.js", "Express", "MongoDB"],
    image: goNbiteImage,
    liveUrl: "https://www.gonbite.com",
  },
];

const categories = [
  "All",
  "Web Development",
  "Mobile App",
];

const services = [
  { icon: "</>", title: "Web Development" },
  { icon: "▣", title: "Mobile Applications" },
  { icon: "✧", title: "UI/UX Design" },
  { icon: "◇", title: "Digital Solutions" },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (project) => project.category === activeCategory
        );

  const openProject = (url) => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="portfolio-page">
      {/* NAVIGATION */}

      <nav className="portfolio-navbar">
        <a href="/" className="portfolio-logo" aria-label="Home">
          K<span>B</span>
        </a>

        <div className="portfolio-nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/skills">Skills</a>
          <a href="/portfolio" className="nav-active">
            Portfolio
          </a>
          <a href="/contact">Contact</a>
        </div>

        <a href="/contact" className="portfolio-talk-button">
          Let's Talk <span>↗</span>
        </a>
      </nav>

      {/* HERO SECTION */}

      <section className="portfolio-hero">
        <div className="portfolio-hero-content">
          <div className="portfolio-eyebrow">
            <span>MY WORK</span>
            <span className="eyebrow-line"></span>
          </div>

          <h1>
            Showcasing <span>Excellence</span>
            <br />
            Through <span>Innovative</span>
            <br />
            <span>Digital</span> Solutions
          </h1>

          <p className="portfolio-hero-description">
            Explore my projects and discover how I turn ideas into
            powerful, user-friendly digital experiences. From modern
            websites to mobile applications, I build solutions that
            combine creativity, functionality, and technology.
          </p>

          <div className="portfolio-services">
            {services.map((service) => (
              <div className="portfolio-service" key={service.title}>
                <div className="service-icon">{service.icon}</div>
                <span>{service.title}</span>
              </div>
            ))}
          </div>

          <div className="portfolio-hero-stats">
            <div>
              <strong>03+</strong>
              <span>Featured Projects</span>
            </div>

            <div>
              <strong>Full Stack</strong>
              <span>Development</span>
            </div>

            <div>
              <strong>MERN</strong>
              <span>Tech Stack</span>
            </div>
          </div>

          <a href="#projects" className="portfolio-hero-button">
            Explore My Projects <span>↓</span>
          </a>
        </div>

        {/* PROJECT SHOWCASE */}

        <div className="portfolio-hero-showcase">
          <div className="showcase-decoration showcase-decoration-one"></div>
          <div className="showcase-decoration showcase-decoration-two"></div>

          <div className="showcase-label">
            <span className="showcase-label-dot"></span>
            CREATIVE DEVELOPER
          </div>

          <div className="showcase-main-card">
            <div className="showcase-main-top">
              <span className="showcase-window-dot"></span>
              <span className="showcase-window-dot"></span>
              <span className="showcase-window-dot"></span>

              <span className="showcase-window-title">
                My Portfolio
              </span>
            </div>

            <div className="showcase-main-content">
              <span className="showcase-tag">
                DESIGN • DEVELOP • DEPLOY
              </span>

              <h2>
                Turning ideas into
                <br />
                <span>digital experiences.</span>
              </h2>

              <p>
                Creating meaningful digital solutions with modern
                technologies and thoughtful design.
              </p>

              <div className="showcase-code-line">
                <span>01</span>
                <code>const creativity = "innovation";</code>
              </div>

              <div className="showcase-code-line">
                <span>02</span>
                <code>buildAmazingProjects();</code>
              </div>

              <div className="showcase-progress">
                <span></span>
              </div>

              <div className="showcase-bottom-label">
                <span>AVAILABLE FOR OPPORTUNITIES</span>
                <span>✦</span>
              </div>
            </div>
          </div>

          <div className="showcase-floating-card">
            <span className="floating-card-icon">✧</span>

            <div>
              <strong>Creative Developer</strong>
              <span>Ideas into reality</span>
            </div>
          </div>

          <div className="showcase-side-note">
            <span>03</span>
            PROJECTS
          </div>
        </div>
      </section>

      {/* PROJECT SECTION */}

      <section className="portfolio-section" id="projects">
        <div className="portfolio-heading">
          <div className="portfolio-eyebrow portfolio-eyebrow-center">
            <span className="eyebrow-line"></span>
            <span>MY PORTFOLIO</span>
            <span className="eyebrow-line"></span>
          </div>

          <h2>
            Projects I've <span>Built</span>
          </h2>

          <p>
            A collection of websites and applications developed with
            creativity, modern technologies, and attention to detail.
          </p>
        </div>

        {/* CATEGORY FILTERS */}

        <div className="portfolio-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* PROJECT LIST */}

        <div className="portfolio-project-list">
          {filteredProjects.map((project, index) => (
            <article
              className={`portfolio-project-row ${
                index % 2 === 1 ? "project-row-reverse" : ""
              }`}
              key={project.id}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* PROJECT IMAGE */}

              <div className="portfolio-project-visual">
                <img
                  src={project.image}
                  alt={`${project.title} project showcase`}
                  loading="lazy"
                />

                <span className="project-number">
                  {String(project.id).padStart(2, "0")}
                </span>

                <div className="project-image-shade"></div>

                <span className="project-image-label">
                  PROJECT SHOWCASE
                </span>
              </div>

              {/* PROJECT DETAILS */}

              <div className="portfolio-project-details">
                <div className="portfolio-project-meta">
                  <span className="portfolio-category">
                    {project.category}
                  </span>

                  <span className="project-status">
                    <span></span>
                    Featured Project
                  </span>
                </div>

                <h3>{project.title}</h3>

                <p className="portfolio-project-description">
                  {project.description}
                </p>

                <div className="portfolio-tech">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>

                <div className="portfolio-project-actions">
                  <button
                    type="button"
                    className="portfolio-link"
                    onClick={() => openProject(project.liveUrl)}
                    disabled={!project.liveUrl}
                  >
                    <span className="portfolio-link-arrow">←</span>
                    <span>View Live Project</span>
                  </button>

                  <span className="project-counter">
                    PROJECT / {String(project.id).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* BOTTOM CONTACT SECTION */}

        <div className="portfolio-bottom-cta">
          <div className="cta-decoration">✳</div>

          <div className="cta-content">
            <span>HAVE A PROJECT IN MIND?</span>

            <h2>
              Let's create something <span>amazing.</span>
            </h2>

            <p>
              Have an idea or opportunity? Let's connect and build
              something meaningful together.
            </p>
          </div>

          <a href="/contact" className="portfolio-cta-button">
            Let's Talk <span>↗</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="portfolio-footer">
       

        <p>Designed with creativity. Built with code.</p>

        <a href="#projects" className="footer-back-top">
          Back to top ↑
        </a>
      </footer>
    </main>
  );
};

export default Portfolio;