export default function ApiDocs() {
  return (
    <div className="page api-docs-page">
      <div className="container">
        <div className="page-header">
          <h1>API Documentation</h1>
          <p className="page-subtitle">
            REST API endpoints for the OpenLyst platform.
          </p>
        </div>

        <section className="api-section">
          <h2>Base URL</h2>
          <code className="api-endpoint">https://openlyst.ink/api/v1</code>
        </section>

        <section className="api-section">
          <h2>Endpoints</h2>
          
          <div className="endpoint-group">
            <h3>Applications</h3>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/apps</code>
              <p>List all applications</p>
            </div>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/apps?filter=active</code>
              <p>List only active applications</p>
            </div>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/apps?filter=deprecated</code>
              <p>List only deprecated applications</p>
            </div>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/apps?platform=iOS</code>
              <p>Filter by platform</p>
            </div>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/apps/:id</code>
              <p>Get details for a specific application</p>
            </div>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/apps/:id/latest</code>
              <p>Get the latest version of an application</p>
            </div>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/apps/:id/versions</code>
              <p>Get version history for an application</p>
            </div>
          </div>

          <div className="endpoint-group">
            <h3>News</h3>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/news</code>
              <p>List all news items</p>
            </div>
          </div>

          <div className="endpoint-group">
            <h3>Repositories</h3>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/repo</code>
              <p>List all repositories</p>
            </div>
          </div>

          <div className="endpoint-group">
            <h3>Platforms</h3>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/platforms</code>
              <p>List all supported platforms</p>
            </div>
          </div>

          <div className="endpoint-group">
            <h3>Search</h3>
            <div className="endpoint-item">
              <span className="method get">GET</span>
              <code>/search?q=query</code>
              <p>Search applications</p>
            </div>
          </div>
        </section>

        <section className="api-section">
          <h2>Response Format</h2>
          <p>All endpoints return JSON responses. Successful requests return HTTP 200, while not found errors return HTTP 404.</p>
        </section>
      </div>
    </div>
  )
}
