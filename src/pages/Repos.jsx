import { useState, useEffect } from 'react'

export default function Repos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://openlyst.ink/api/v1/repo')
      .then(res => res.json())
      .then(data => {
        setRepos(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch repos:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="page repos-page">
      <div className="container">
        <div className="page-header">
          <h1>Repositories</h1>
          <p className="page-subtitle">
            Browse AltStore-compatible repositories and discover new applications.
          </p>
        </div>

        {loading ? (
          <div className="loading">Loading repositories...</div>
        ) : (
          <div className="repos-grid">
            {repos.map((repo, index) => (
              <div key={index} className="repo-card">
                <div className="repo-header">
                  <h3>{repo.name}</h3>
                  {repo.url && (
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="repo-link">
                      Visit →
                    </a>
                  )}
                </div>
                {repo.description && <p className="repo-description">{repo.description}</p>}
                {repo.apps && (
                  <div className="repo-apps">
                    <strong>{repo.apps.length} app{repo.apps.length !== 1 ? 's' : ''}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
