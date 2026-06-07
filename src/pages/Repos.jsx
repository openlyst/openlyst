import repos from '../data/repos.json'

export default function Repos() {
  return (
    <div className="page repos-page">
      <div className="container">
        <div className="page-header">
          <h1>Repositories</h1>
          <p className="page-subtitle">
            Browse AltStore-compatible repositories and discover new applications.
          </p>
        </div>

        <div className="repos-grid">
          {repos.map((repo) => (
            <div key={repo.id} className="repo-card">
              <div className="repo-header">
                <h3>{repo.name.en}</h3>
                {repo.url && (
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="repo-link">
                    Visit →
                  </a>
                )}
              </div>
              <p className="repo-description">{repo.description.en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
