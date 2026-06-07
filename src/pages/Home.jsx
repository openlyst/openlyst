import { Link } from 'react-router-dom'
import config from '../data/config.json'
import news from '../data/news.json'
import doudou from '../data/apps/doudou.json'
import finar from '../data/apps/finar.json'
import klit from '../data/apps/klit.json'
import repstore from '../data/apps/repstore.json'

const apps = { doudou, finar, klit, repstore }

export default function Home() {
  const featuredApps = config.featuredApps.map(id => apps[id]).filter(Boolean)
  const recentNews = news.slice(0, 3)

  return (
    <div className="home">
      <section className="features">
        <div className="container">
          <h1>{config.name.en}</h1>
          <p className="section-subtitle">
            {config.description.en}
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>Privacy First</h3>
              <p>Your data belongs to you. No tracking, no surveillance, no corporate control.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-users"></i></div>
              <h3>Community Driven</h3>
              <p>Built by volunteers who care about creating better software for everyone.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-code"></i></div>
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
            {recentNews.map((item) => (
              item.url ? (
                <Link key={item.identifier} to={item.url} className="news-card">
                  <div className="news-date">{item.date}</div>
                  <h3>{item.title.en}</h3>
                  <p>{item.caption.en}</p>
                  <span className="read-more">Read more →</span>
                </Link>
              ) : (
                <div key={item.identifier} className="news-card">
                  <div className="news-date">{item.date}</div>
                  <h3>{item.title.en}</h3>
                  <p>{item.caption.en}</p>
                </div>
              )
            ))}
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
            {Object.values(apps).map((app) => (
              <Link key={app.bundleIdentifier} to={`/apps/${app.bundleIdentifier}`} className="app-preview-card">
                <img src={app.iconURL} alt={app.name.en} className="app-icon-img" />
                <h3>{app.name.en}</h3>
                <p>{app.subtitle.en}</p>
                <span className="app-link">Download →</span>
              </Link>
            ))}
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
