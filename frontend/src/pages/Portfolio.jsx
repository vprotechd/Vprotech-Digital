import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Portfolio.css";

import avsSolarImage from "../assets/portfolio/AVS Solar.png";
import goNbiteImage from "../assets/portfolio/GoNbite.png";
import jobifyImage from "../assets/portfolio/Jobify.png";
import hero from "../assets/portfolio/hero.png";
import hero1 from "../assets/portfolio/hero1.png";
import nexoraImage from "../assets/portfolio/nexora.png";
import veloraImage from "../assets/portfolio/Velora.png";
import voyagePathImage from "../assets/portfolio/VoyagePath.png";
import eduVistaImage from "../assets/portfolio/EduVista.png";
import fitAuraImage from "../assets/portfolio/FitAura.png";
import mindBloomImage from "../assets/portfolio/MindBloom.png";
import calmoraImage from "../assets/portfolio/Pastel.png";

const projects = [
  {
    id: 1,
    title: "AVS Solar Consultancy",
    category: "Web Development",
    type: "Business website",
    description:
      "A clean, professional website for a solar consultancy business, presenting its clean-energy services and helping visitors explore available solar solutions.",
    overview:
      "Designed to introduce the consultancy, communicate its services clearly, and create a straightforward experience across desktop and mobile screens.",
    highlights: [
      "Presents solar consultancy and clean-energy solutions.",
      "Organizes service information in a clear visual hierarchy.",
      "Uses a responsive layout for desktop and mobile screens.",
    ],
    technologies: ["React", "JavaScript", "CSS", "Responsive Design"],
    image: avsSolarImage,
  },
  {
    id: 2,
    title: "Jobify",
    category: "Web Development",
    type: "Job platform",
    description:
      "A job portal connecting job seekers and recruiters through job discovery, search filters, user profiles, and recruitment workflows.",
    overview:
      "Jobify provides distinct experiences for job seekers and recruiters, helping candidates explore opportunities and recruiters manage hiring activity.",
    highlights: [
      "Supports job discovery and searching with filters.",
      "Provides separate experiences for job seekers and recruiters.",
      "Combines web and mobile application experiences.",
    ],
    technologies: ["React", "React Native", "Node.js", "MongoDB"],
    image: jobifyImage,
  },
  {
    id: 3,
    title: "GoNbite",
    category: "Mobile App",
    type: "Food delivery",
    description:
      "A food delivery experience focused on helping customers discover restaurants and order food through a convenient digital journey.",
    overview:
      "GoNbite centers on restaurant discovery and food ordering, with a mobile-focused interface and a backend built for data-driven experiences.",
    highlights: [
      "Focuses on restaurant discovery and food ordering.",
      "Keeps the customer ordering journey straightforward.",
      "Uses Node.js, Express, and MongoDB on the backend.",
    ],
    technologies: ["React Native", "Node.js", "Express", "MongoDB"],
    image: goNbiteImage,
  },
  {
    id: 4,
    title: "Nexora Analytics",
    category: "Web Development",
    type: "SAAS ANALYTICS DASHBOARD",
    description:
      "A modern business analytics dashboard designed to help performance and explore important business insights through interactive visualizations.",

    overview:
      "Nexora Analytics provides a centralized dashboard for tracking revenue trends, monitoring customer engagement, reviewing business performance, and visualizing data through a clean, responsive interface.",
    highlights: [
      "Displays business performance metrics using interactive charts and graphs.",
      "Provides revenue tracking, user activity monitoring, and analytics summaries.",
      "Organizes business insights into a clean and easy-to-navigate dashboard.",
      "Supports responsive layouts for desktop and mobile screens.",
    ],
    technologies: [
      "React",
      "JavaScript",
      "Node.js",
      "MongoDB",
      "Chart.js",
      "Responsive Design",
    ],
    image: nexoraImage,
  },
  {
    id: 5,
    title: "Velora Fashion",
    category: "Web Development",
    type: "E-COMMERCE WEBSITE",
    description:
     "A stylish fashion e-commerce website for exploring collections and shopping for clothing and accessories.",
    overview:
      "Velora Fashion combines a stylish storefront with product listings, category filters, product details, and a streamlined shopping interface. Its responsive design focuses on product presentation, easy navigation, and a consistent experience across desktop and mobile screens.",
    highlights: [
      "Showcases clothing, footwear, bags, and fashion accessories.",
      "Provides product categories, search, and filtering options.",
      "Features product details, color and size selection, and a shopping cart interface.",
      "Uses a responsive layout with modern typography and clean visuals.",
    ],
    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "Node.js",
      "MongoDB",
      "Responsive Design",
    ],
    image: veloraImage,
  },
  {
    id: 6,
    title: "VoyagePath",
    category: "Web Development",
    type: "TOURISM & CAREER EDUCATION WEBSITE",
    description:
      "A modern tourism and career education website designed to help students explore tourism programs, discover career opportunities.",
    overview:
      "VoyagePath features a clean, responsive interface that presents tourism courses, career pathways, educational programs, and industry opportunities in an engaging way. The website combines structured program listings, career information, an intuitive navigation system, and a step-by-step student journey to make it easier for visitors to explore educational options and plan their future careers.",
    highlights: [
      "Showcases tourism, travel, and hospitality education programs.",
      "Presents career opportunities such as travel consultant, tour guide, event planner, and destination manager.",
      "Organizes courses with program details, categories, and learning options.",
    ],
    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "Responsive Design",
      "UI/UX Design",
    ],
    image: voyagePathImage,
  },
  {
    id: 7,
    title: "EduVista",
    category: "Web Development",
    type: "ONLINE LEARNING & EDUCATION WEBSITE",
    description:
      "A modern online learning platform designed to help students explore professional courses, develop in-demand skills.",
    overview:
      "EduVista combines an engaging homepage with organized course listings, learning benefits, student testimonials, and career-focused content. Its clean interface helps learners discover relevant courses, understand available learning options, and explore a structured journey from course selection to certification and career development.",
    highlights: [
      "Showcases professional courses in web development, data science, digital marketing, graphic design, UI/UX design, and business management.",
      "Organizes courses into clear listings with categories, descriptions, and duration details.",
      "Highlights expert instructors, flexible learning, certifications, and lifetime access.",
      "Features student testimonials and success stories to build trust.",
    ],
    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "Responsive Design",
      "UI/UX Design",
    ],
    image: eduVistaImage,
  },
  {
    id: 8,
    title: "FitAura",
    category: "Mobile App Development",
    type: "FITNESS & WELLNESS MOBILE APP",
    description:
      "A modern fitness and wellness mobile app designed to help users build healthy habits, manage nutrition, practice mindfulness.",
    overview:
      "FitAura brings fitness and everyday wellness together in a single mobile interface.",
    highlights: [
      "Provides workout programs for weight loss, strength training, yoga, and flexibility.",
      "Displays personalized workout plans with duration, difficulty levels, and start options.",
      "Offers nutrition guidance, healthy meal suggestions, and balanced eating plans.",
    ],
    technologies: [
      "React Native",
      "JavaScript",
      "Mobile UI/UX Design",
      "Responsive Layouts",
    ],
    image: fitAuraImage,
  },
  {
    id: 9,
    title: "MindBloom",
    category: "Web Development",
    type: "MENTAL WELLNESS WEBSITE",
    description:
      "A calming mental wellness website designed to help users practice mindfulness, manage stress, and build healthy daily habits.",
    overview:
      "MindBloom combines guided meditation, mood tracking, journaling, and self-care resources in a clean, user-friendly dashboard. Its soft colors and responsive layout create a peaceful experience across desktop and mobile devices.",
    highlights: [
      "Features guided meditation and relaxation sessions.",
      "Includes mood tracking and digital journaling.",
      "Provides daily motivation and self-care resources.",
      "Offers progress tracking for healthy habits.",
      "Uses a responsive design with soft pastel colors.",
    ],
    technologies: ["React", "JavaScript", "CSS", "Responsive Design"],
    image: mindBloomImage,
  },
  {
    id: 10,
    title: "Calmora",
    category: "Mobile App Development",
    type: "MENTAL WELLNESS MOBILE APP",
    description:
      "A wellness app designed to help users practice mindfulness, track moods, and build healthy daily habits.",
    overview:
      "Calmora combines guided meditation, mood tracking, journaling, and self-care activities in a simple mobile interface. Its calming visuals and intuitive navigation support everyday mental wellness.",
    highlights: [
      "Offers guided meditation for stress relief, sleep, and focus.",
      "Includes daily mood tracking and journaling.",
      "Provides mindfulness activities and self-care reminders.",
      "Tracks wellness habits and personal progress.",
      "Features a clean interface with soft blue and lavender colors.",
    ],
    technologies: [
      "React Native",
      "JavaScript",
      "Mobile UI/UX Design",
      "Responsive Layouts",
    ],
    image: calmoraImage,
  },
];

const categories = ["All", "Web Development", "Mobile App"];
const technologies = ["All", ...new Set(projects.flatMap((p) => p.technologies))];

const services = [
  { icon: "</>", title: "Web Development", text: "Fast, responsive websites and web apps." },
  { icon: "▯", title: "Mobile Applications", text: "Cross-platform apps for iOS and Android." },
  { icon: "✳", title: "UI/UX Design", text: "Clean, usable interfaces with clear flows." },
  { icon: "◇", title: "Digital Solutions", text: "End-to-end builds from idea to launch." },
];

function StackCard({ project, index, total }) {
  return (
    // --i is capped at 3 so later cards don't sit lower and lower
    <div
      className="pf-stack-item"
      style={{ "--i": Math.min(index, 3), zIndex: index + 1 }}
    >
      <article className="pf-stack-card">
        <div className="pf-stack-info">
          <span className="pf-stack-count">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <span className="pf-stack-kicker">{project.type}</span>
          <h3>{project.title}</h3>
          <p className="pf-stack-desc">{project.description}</p>

          <h4>Overview</h4>
          <p className="pf-stack-text">{project.overview}</p>

          <h4>Key highlights</h4>
          <ul>
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <div className="pf-chips">
            <span className="pf-chip-cat">{project.category}</span>
            {project.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="pf-stack-visual" aria-hidden="true">
          <div className="pf-layer pf-layer-a">
            <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Portfolio() {
  const [category, setCategory] = useState("All");
  const [technology, setTechnology] = useState("All");
  const [query, setQuery] = useState("");
  const stackRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (technology === "All" || p.technologies.includes(technology)) &&
        (!q || `${p.title} ${p.type} ${p.description}`.toLowerCase().includes(q))
    );
  }, [category, technology, query]);

  const clearFilters = () => {
    setCategory("All");
    setTechnology("All");
    setQuery("");
  };

  /* Scroll-driven stacking: as the next card slides over, the previous one
     shrinks and drifts up (CSS reads the --p variable, 0 to 1). */
  useEffect(() => {
    const root = stackRef.current;
    if (!root) return undefined;

    const items = Array.from(root.querySelectorAll(".pf-stack-item"));
    if (!items.length) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      items.forEach((item, i) => {
        const card = item.firstElementChild;
        const next = items[i + 1];

        if (!next || reduce || getComputedStyle(item).position !== "sticky") {
          card.style.setProperty("--p", "0");
          return;
        }

        const nextStick = parseFloat(getComputedStyle(next).top) || 0;
        const nextTop = next.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, 1 - (nextTop - nextStick) / (vh - nextStick)));
        card.style.setProperty("--p", p.toFixed(3));
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [filtered]);

  return (
    <main className="portfolio-page">
      {/* ---------- Hero ---------- */}
      <section className="pf-hero" id="portfolio-home">
        <div className="pf-hero-inner">
          <div className="pf-hero-copy">
            <h1>
              Thoughtful Design,
              <br />
              Modern Technology.
            </h1>
            <p>
              Every project is a real solution, built with modern technologies
              and a focus on performance, usability, and clean design.
            </p>
            <a className="pf-hero-btn" href="#portfolio-projects">
              <span>Explore projects</span>
              <i>→</i>
            </a>
          </div>

          <div className="pf-hero-visual" id="portfolio-about" aria-hidden="true">
            <div className="pf-glass pf-glass-main">
              <img src={hero} alt="" />
            </div>
            <div className="pf-glass pf-glass-side">
              <img src={hero1} alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Floating filter bar ---------- */}
      <form
        className="pf-finder"
        onSubmit={(e) => {
          e.preventDefault();
          document.getElementById("portfolio-projects")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <label className="pf-field">
          <small>Category</small>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="pf-field">
          <small>Technology</small>
          <select value={technology} onChange={(e) => setTechnology(e.target.value)}>
            {technologies.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="pf-field">
          <small>Project name</small>
          <input
            type="text"
            value={query}
            placeholder="Search projects"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <button type="submit" className="pf-search-btn">
          <span aria-hidden="true">⌕</span> Search
        </button>
      </form>

      {/* ---------- Projects: stacked scroll cards ---------- */}
      <section className="pf-section" id="portfolio-projects">
        <div className="pf-heading">
          <h2>Selected Projects</h2>
          <p>
            Scroll to explore each project. Every card slides over the last
            with its overview, key highlights, and technologies.
          </p>
        </div>

        {filtered.length ? (
          <div className="pf-stack" ref={stackRef}>
            {filtered.map((p, i) => (
              <StackCard key={p.id} project={p} index={i} total={filtered.length} />
            ))}
          </div>
        ) : (
          <div className="pf-empty">
            <p>No projects match these filters.</p>
            <button type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </section>

      {/* ---------- Services ---------- */}
      <section className="pf-section pf-services" id="portfolio-services">
        <div className="pf-heading">
          <h2>What I Do</h2>
          <p>Design and development services for businesses and products.</p>
        </div>

        <div className="pf-service-grid">
          {services.map((s) => (
            <div className="pf-service" key={s.title}>
              <span>{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="pf-contact" id="portfolio-contact">
        <div>
          <h2>Have a project in mind?</h2>
          <p>Let’s turn your ideas into thoughtful digital experiences.</p>
        </div>
        <a className="pf-hero-btn pf-hero-btn-light" href="mailto:vprotechdigitalmohali@gmail.com">
          <span>Get in touch</span>
          <i>→</i>
        </a>
      </section>
    </main>
  );
}