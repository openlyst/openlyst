import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import doudou from '../data/apps/doudou.json'
import finar from '../data/apps/finar.json'
import klit from '../data/apps/klit.json'
import lystcode from '../data/apps/lystcode.json'
import docan from '../data/apps/docan.json'
import opentorrent from '../data/apps/opentorrent.json'
import repstore from '../data/apps/repstore.json'

const apps = { doudou, finar, klit, lystcode, docan, opentorrent, repstore }

export default function AppDetail() {
  const { id } = useParams()
  const app = apps[id]

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

  const latestVersion = app.versions?.[0]

  return (
    <div className="page app-detail-page">
      <div className="container">
        <Link to="/apps" className="back-link">← Back to Apps</Link>
        
        <div className="app-detail-header">
          <img src={app.iconURL} alt={app.name.en} className="app-detail-icon-img" />
          <div className="app-detail-info">
            <h1>{app.name.en}</h1>
            {app.deprecated && <span className="badge deprecated large">Deprecated</span>}
            <p className="app-detail-description">{app.localizedDescription.en}</p>
            <div className="app-detail-meta">
              <div className="meta-item">
                <strong>Platforms:</strong> {app.platforms.join(', ')}
              </div>
              {latestVersion && (
                <div className="meta-item">
                  <strong>Latest Version:</strong> v{latestVersion.version}
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
            {app.platforms.map(platform => {
              const download = latestVersion?.downloads?.[platform]
              if (!download) return null
              
              if (typeof download === 'string') {
                return (
                  <a 
                    key={platform}
                    href={download}
                    className="download-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download for {platform}
                  </a>
                )
              }
              
              return Object.entries(download).map(([format, url]) => {
                if (!url || typeof url !== 'string') return null
                return (
                  <a 
                    key={`${platform}-${format}`}
                    href={url}
                    className="download-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download for {platform} ({format})
                  </a>
                )
              })
            })}
          </div>
        </section>

        <section className="app-section">
          <h2>Version History</h2>
          <div className="versions-list">
            {app.versions?.map((version, index) => (
              <div key={index} className="version-item">
                <div className="version-info">
                  <span className="version-number">v{version.version}</span>
                  <span className="version-date">
                    {version.date ? new Date(version.date).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
                {version.sourceCode && (
                  <a 
                    href={version.sourceCode}
                    className="version-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View source →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {app.screenshots && app.screenshots.length > 0 && (
          <section className="app-section">
            <h2>Screenshots</h2>
            <div className="screenshots-grid">
              {app.screenshots.map((screenshot, index) => (
                <img 
                  key={index} 
                  src={screenshot} 
                  alt={`Screenshot ${index + 1}`}
                  className="screenshot-img"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
