import { Link } from 'react-router-dom'
import news from '../data/news.json'

export default function News() {
  return (
    <div className="page news-page">
      <div className="container">
        <div className="page-header">
          <h1>News</h1>
          <p className="page-subtitle">
            Stay up to date with build status, releases, and important project announcements.
          </p>
        </div>

        <div className="news-list">
          {news.map((item) => (
            <article key={item.identifier} className="news-item">
              <div className="news-item-header">
                <span className="news-type">Update</span>
                <time className="news-date">
                  {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown date'}
                </time>
              </div>
              <h2>{item.title.en}</h2>
              <p className="news-content">{item.caption.en}</p>
              {item.url && (
                <Link to={item.url} className="news-link">
                  Read more →
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
