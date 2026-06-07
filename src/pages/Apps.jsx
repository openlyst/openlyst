import { useState } from 'react'
import { Link } from 'react-router-dom'
import doudou from '../data/apps/doudou.json'
import finar from '../data/apps/finar.json'
import klit from '../data/apps/klit.json'
import lystcode from '../data/apps/lystcode.json'
import docan from '../data/apps/docan.json'
import opentorrent from '../data/apps/opentorrent.json'
import repstore from '../data/apps/repstore.json'

const allApps = [doudou, finar, klit, lystcode, docan, opentorrent, repstore]

export default function Apps() {
  const [filter, setFilter] = useState('all')

  const filteredApps = allApps.filter(app => {
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

        <div className="apps-grid">
          {filteredApps.map(app => (
            <Link key={app.bundleIdentifier} to={`/apps/${app.bundleIdentifier}`} className="app-card">
              <div className="app-card-header">
                <img src={app.iconURL} alt={app.name.en} className="app-card-icon-img" />
                {app.deprecated && <span className="badge deprecated">Deprecated</span>}
              </div>
              <h3>{app.name.en}</h3>
              <p className="app-description">{app.subtitle.en}</p>
              <div className="app-meta">
                <span className="platforms">
                  {app.platforms.join(', ')}
                </span>
                {app.versions && app.versions[0] && (
                  <span className="version">v{app.versions[0].version}</span>
                )}
              </div>
              <span className="card-link">View Details →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
