import React from 'react';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>
      <div className="project-cards">
        <div className="project-card">
          <strong>Intrusion Detection using Machine Learning:</strong>
          <p>Feature selection on UNSW-NB14 and NSL-KDD dataset to improve accuracy while maintaining lightweight performance!</p>
          <span className="tech-stack">Python</span>
        </div>
        <div className="project-card">
          <strong>Face Anonymizer using Neural Networks:</strong>
          <p>Make sure your cute face is anonymous online!</p>
          <span className="tech-stack">Python</span>
        </div>
        <div className="project-card">
          <strong>Arch Install Guide:</strong>
          <p>A simple to follow Arch Linux install guide.</p>
          <span className="tech-stack">Linux, Shell</span>
        </div>
        <div className="project-card">
          <strong>Astro Site:</strong>
          <p>You are looking at it right now!</p>
          <span className="tech-stack">Astro, TypeScript</span>
        </div>
        <div className="project-card">
          <strong>BCI Wheelchair (contributor):</strong>
          <p>A text-to-speech Python GUI keyboard designed for a project based on Brain Computing Interfaces on the Raspberry Pi.</p>
          <span className="tech-stack">Python</span>
        </div>
        <div className="project-card">
          <strong>Empress Discord Self-Bot:</strong>
          <p>Automate your Discord account with a token!</p>
          <span className="tech-stack">JavaScript</span>
        </div>
      </div>
    </section>
  );
};

export default Projects;
