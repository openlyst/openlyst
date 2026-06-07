import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Apps() {
  const [apps, setApps] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://openlyst.ink/api/v1/apps')
      .then(res => res.json())
      .then(data => {
        setApps(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch apps:', err)
        setLoading(false)
      })
  }, [])

  const filteredApps = apps.filter(app => {
    if (filter === 'all') return true
    if (filter === 'active') return !app.deprecated
    if (filter === 'deprecated') return app.deprecated
    return true
  })

  return (
    <div className="page apps-page">
      <div className="container">
        <div className="page-header">
          <h1>Applications</h1>
          <p className="page-subtitle">
            Browse our collection of free and open-source applications built with privacy and freedom in mind.
          </p>
        </div>

        <div className="filter-bar">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Apps
          </button>
          <button 
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-button ${filter === 'deprecated' ? 'active' : ''}`}
            onClick={() => setFilter('deprecated')}
          >
            Deprecated
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading applications...</div>
        ) : (
          <div className="apps-grid">
            {filteredApps.map(app => (
              <Link key={app.id} to={`/apps/${app.id}`} className="app-card">
                <div className="app-card-header">
                  <div className="app-card-icon">{app.icon || '📱'}</div>
                  {app.deprecated && <span className="badge deprecated">Deprecated</span>}
                </div>
                <h3>{app.name}</h3>
                <p className="app-description">{app.description}</p>
                <div className="app-meta">
                  {app.platforms && (
                    <span className="platforms">
                      {app.platforms.join(', ')}
                    </span>
                  )}
                  {app.latest_version && (
                    <span className="version">v{app.latest_version}</span>
                  )}
                </div>
                <span className="card-link">View Details →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
