import React from "react";

const PortfolioCard = ({ project }) => {
  return (
    <article className="portfolio-card">

      <div className="portfolio-image">
        <img
          src={project.image}
          alt={project.title}
        />

        <div className="portfolio-overlay">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project →
          </a>
        </div>
      </div>

      <div className="portfolio-card-content">

        <span className="portfolio-category">
          {project.category}
        </span>

        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className="portfolio-tech">
          {project.technologies.map((technology) => (
            <span key={technology}>
              {technology}
            </span>
          ))}
        </div>

        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="portfolio-link"
        >
          View Project →
        </a>

      </div>

    </article>
  );
};

export default PortfolioCard;