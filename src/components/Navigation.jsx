import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/news', label: 'News' },
    { path: '/apps', label: 'Apps' },
    { path: '/repos', label: 'Repos' },
    { path: '/about', label: 'About' },
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">OpenLyst</span>
        </Link>
        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <a 
          href="https://gitlab.com/Openlyst/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-gitlab"
        >
          GitLab
        </a>
      </div>
    </nav>
  )
}
