import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Applications</h3>
          <ul>
            <li><Link to="/apps/doudou">Doudou</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Community</h3>
          <ul>
            <li><a href="https://gitlab.com/Openlyst/" target="_blank" rel="noopener noreferrer">GitLab</a></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/docs/api">Documentation</Link></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>© 2026 OpenLyst. All software released under open source licenses.</p>
          <p className="footer-tagline">Free software for everyone ✊</p>
        </div>
      </div>
    </footer>
  )
}
