import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Free & Open Source Applications</h1>
          <p className="hero-subtitle">
            We build free and open-source software that puts users first. 
            Keep control of your own tools and data.
          </p>
          <Link to="/apps" className="cta-button">
            Explore Our Apps
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Built for Everyone</h2>
          <p className="section-subtitle">
            Technology should work for people. Our apps are built in the open by community contributors.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Your data belongs to you. No tracking, no surveillance, no corporate control.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Community Driven</h3>
              <p>Built by volunteers who care about creating better software for everyone.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Open Source</h3>
              <p>All code is transparent, auditable, and free to use, modify, and distribute.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="latest-news">
        <div className="container">
          <h2>Latest News</h2>
          <p className="section-subtitle">
            Stay up to date with build status, releases, and important project announcements.
          </p>
          <div className="news-grid">
            <Link to="/apps/doudou" className="news-card">
              <div className="news-date">Recent</div>
              <h3>Doudou Signing Fixed for Android</h3>
              <p>Signing has been fixed for Android users who were unable to update.</p>
              <span className="read-more">Read more →</span>
            </Link>
            <div className="news-card">
              <div className="news-date">Announcement</div>
              <h3>Lystcode and Docan Discontinued</h3>
              <p>We are no longer maintaining or releasing updates for these applications.</p>
            </div>
            <Link to="/apps/doudou" className="news-card">
              <div className="news-date">Release</div>
              <h3>DouDou v19.0.0 Released</h3>
              <p>Doudou v19.0.0 is now available. Download the latest version for your platform.</p>
              <span className="read-more">Read more →</span>
            </Link>
          </div>
          <Link to="/news" className="view-all-link">View All News →</Link>
        </div>
      </section>

      <section className="featured-apps">
        <div className="container">
          <h2>Our Applications</h2>
          <p className="section-subtitle">
            Software that puts users first. Each application is designed with privacy, freedom, and community in mind.
          </p>
          <div className="apps-preview">
            <Link to="/apps/doudou" className="app-preview-card">
              <div className="app-icon">🎵</div>
              <h3>Doudou</h3>
              <p>Music player for self-hosted libraries. Connect Jellyfin, Plex, or Navidrome.</p>
              <span className="app-link">Download →</span>
            </Link>
            <Link to="/apps/finar" className="app-preview-card">
              <div className="app-icon">📺</div>
              <h3>Finar</h3>
              <p>Cross-platform Jellyfin client built with Flutter. Native playback and offline support.</p>
              <span className="app-link">Download →</span>
            </Link>
            <Link to="/apps/klit" className="app-preview-card">
              <div className="app-icon">🖼️</div>
              <h3>Klit</h3>
              <p>Privacy-focused browser for the e621 community with fast browsing workflow.</p>
              <span className="app-link">Download →</span>
            </Link>
            <Link to="/apps/repstore" className="app-preview-card">
              <div className="app-icon">📦</div>
              <h3>Openlyst</h3>
              <p>Alternative app store for Android built around AltStore-compatible repositories.</p>
              <span className="app-link">Download →</span>
            </Link>
          </div>
          <Link to="/apps" className="view-all-link">View All Applications →</Link>
        </div>
      </section>

      <section className="get-involved">
        <div className="container">
          <div className="get-involved-content">
            <h2>Get Involved</h2>
            <p>
              Help us build a better digital future. Contribute code, report bugs, or spread the word about free software.
            </p>
            <div className="action-buttons">
              <a href="https://gitlab.com/Openlyst/" target="_blank" rel="noopener noreferrer" className="action-button primary">
                Start Contributing
              </a>
              <Link to="/apps" className="action-button secondary">
                Download Apps
              </Link>
            </div>
          </div>
          <blockquote className="quote">
            "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion."
            <footer>— Albert Camus</footer>
          </blockquote>
        </div>
      </section>
    </div>
  )
}
