// src/components/NewsCard.js
export default function NewsCard({ title, description, image, url = '#' }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div className="news-card-fixed">
        <div className="news-card-image-wrapper">
          <img src={image} alt={title} className="news-card-image" />
        </div>
        <div className="news-card-content">
          <h3 className="news-card-title">{title}</h3>
          <p className="news-card-desc">{description}</p>
        </div>
      </div>
    </a>
  );
}
