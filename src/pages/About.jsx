export default function About() {
  return (
    <div className="page about-page">
      <div className="container">
        <div className="page-header">
          <h1>About OpenLyst</h1>
          <p className="page-subtitle">
            Building free software for everyone, one application at a time.
          </p>
        </div>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            OpenLyst is dedicated to creating free and open-source software that respects user privacy 
            and freedom. We believe that technology should serve people, not corporations. Every application 
            we build is designed with transparency, community, and user control at its core.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3><i className="fas fa-shield-alt"></i> Privacy</h3>
              <p>
                Your data belongs to you. We don't track, surveil, or sell your information. 
                Our applications work offline when possible and never require unnecessary permissions.
              </p>
            </div>
            <div className="value-card">
              <h3><i className="fas fa-code"></i> Open Source</h3>
              <p>
                All our code is publicly available for audit, modification, and distribution. 
                We use permissive licenses that allow you to truly own the software you use.
              </p>
            </div>
            <div className="value-card">
              <h3><i className="fas fa-users"></i> Community</h3>
              <p>
                Built by volunteers, for everyone. We welcome contributions from anyone who wants 
                to help build better software. Join our community and help shape the future.
              </p>
            </div>
            <div className="value-card">
              <h3><i className="fas fa-heart"></i> User First</h3>
              <p>
                We design with users in mind, not shareholders. Features are driven by community 
                needs, not monetization strategies. Our software is free forever.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Get Involved</h2>
          <p>
            We're always looking for contributors! Whether you're a developer, designer, writer, 
            or just passionate about free software, there's a place for you in our community.
          </p>
          <div className="action-links">
            <a 
              href="https://gitlab.com/Openlyst/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-link"
            >
              Contribute on GitLab →
            </a>
            <a 
              href="https://openlyst.ink/docs/api" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-link"
            >
              Read the Documentation →
            </a>
          </div>
        </section>

        <section className="about-section">
          <h2>Contact</h2>
          <p>
            Have questions, feedback, or want to collaborate? Reach out to us through our 
            GitLab repository or join our community discussions.
          </p>
        </section>
      </div>
    </div>
  )
}
