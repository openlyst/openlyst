import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function AppDetail() {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`https://openlyst.ink/api/v1/apps/${id}`).then(res => res.json()),
      fetch(`https://openlyst.ink/api/v1/apps/${id}/versions`).then(res => res.json())
    ])
      .then(([appData, versionsData]) => {
        setApp(appData)
        setVersions(versionsData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch app details:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="page loading-page"><div className="container">Loading...</div></div>
  }

  if (!app) {
    return (
      <div className="page">
        <div className="container">
          <h1>App Not Found</h1>
          <Link to="/apps">Back to Apps</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page app-detail-page">
      <div className="container">
        <Link to="/apps" className="back-link">← Back to Apps</Link>
        
        <div className="app-detail-header">
          <div className="app-detail-icon"><i className="fas fa-mobile-alt"></i></div>
          <div className="app-detail-info">
            <h1>{app.name}</h1>
            {app.deprecated && <span className="badge deprecated large">Deprecated</span>}
            <p className="app-detail-description">{app.description}</p>
            <div className="app-detail-meta">
              {app.platforms && (
                <div className="meta-item">
                  <strong>Platforms:</strong> {app.platforms.join(', ')}
                </div>
              )}
              {app.latest_version && (
                <div className="meta-item">
                  <strong>Latest Version:</strong> v{app.latest_version}
                </div>
              )}
              {app.license && (
                <div className="meta-item">
                  <strong>License:</strong> {app.license}
                </div>
              )}
            </div>
          </div>
        </div>

        {app.deprecated && (
          <div className="warning-banner">
            <i className="fas fa-exclamation-triangle"></i> This application is deprecated and no longer maintained. Use at your own risk.
          </div>
        )}

        <section className="app-section">
          <h2>Downloads</h2>
          <div className="downloads-grid">
            {app.platforms?.map(platform => (
              <a 
                key={platform}
                href={`https://openlyst.ink/api/v1/apps/${id}/latest?platform=${platform}`}
                className="download-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download for {platform}
              </a>
            ))}
          </div>
        </section>

        <section className="app-section">
          <h2>Version History</h2>
          <div className="versions-list">
            {versions.map((version, index) => (
              <div key={index} className="version-item">
                <div className="version-info">
                  <span className="version-number">v{version.version}</span>
                  <span className="version-date">
                    {version.date ? new Date(version.date).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
                {version.notes && <p className="version-notes">{version.notes}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="app-section">
          <h2>Source Code</h2>
          {app.source_url ? (
            <a 
              href={app.source_url} 
              className="source-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitLab →
            </a>
          ) : (
            <p>Source code repository not available.</p>
          )}
        </section>
      </div>
    </div>
  )
}
