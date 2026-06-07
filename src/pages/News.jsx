import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://openlyst.ink/api/v1/news')
      .then(res => res.json())
      .then(data => {
        setNews(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch news:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="page news-page">
      <div className="container">
        <div className="page-header">
          <h1>News</h1>
          <p className="page-subtitle">
            Stay up to date with build status, releases, and important project announcements.
          </p>
        </div>

        {loading ? (
          <div className="loading">Loading news...</div>
        ) : (
          <div className="news-list">
            {news.map((item, index) => (
              <article key={index} className="news-item">
                <div className="news-item-header">
                  <span className="news-type">{item.type || 'Update'}</span>
                  <time className="news-date">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown date'}
                  </time>
                </div>
                <h2>{item.title}</h2>
                <p className="news-content">{item.content}</p>
                {item.link && (
                  <Link to={item.link} className="news-link">
                    Read more →
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
