// src/components/TweetCard.js
export default function TweetCard({ text, author, likes = 0, retweets = 0 }) {
  return (
    <div className="card tweet-card">
      <div className="tweet-author">@{author}</div>
      <div className="tweet-text">{text}</div>
      <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
        <span>❤️ {likes}</span>
        <span style={{ marginLeft: '16px' }}>🔄 {retweets}</span>
      </div>
    </div>
  );
}
