// src/pages/SocialPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BEARER = process.env.REACT_APP_TWITTER_BEARER;

export default function SocialPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      if (!BEARER) {
        console.warn('Twitter token missing – using mock');
        setTweets(mockTweets);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          'https://api.twitter.com/2/tweets/search/recent',
          {
            params: {
              query:
                '#sports OR #MLB OR #NFL OR #NBA OR #PremierLeague OR #PGA',
              max_results: 10,
              'tweet.fields': 'public_metrics,author_id,created_at',
            },
            headers: { Authorization: `Bearer ${BEARER}` },
          }
        );

        const enriched = await Promise.all(
          (data.data || []).map(async (t) => {
            const user = await axios.get(
              `https://api.twitter.com/2/users/${t.author_id}`,
              { headers: { Authorization: `Bearer ${BEARER}` } }
            );
            return {
              id: t.id,
              text: t.text,
              author: user.data.data.username,
              likes: t.public_metrics.like_count,
              retweets: t.public_metrics.retweet_count,
              created_at: new Date(t.created_at).toLocaleString(),
            };
          })
        );

        enriched.sort((a, b) => b.likes + b.retweets - (a.likes + a.retweets));
        setTweets(enriched.slice(0, 10));
      } catch (e) {
        console.warn('Twitter API error – using mock', e);
        setTweets(mockTweets);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <h1 className="page-title">Social Feed</h1>

      {loading ? (
        <p className="loading">Loading tweets…</p>
      ) : (
        <div className="social-list">
          {tweets.map((t) => (
            <div key={t.id} className="tweet-card">
              <div className="tweet-header">
                <strong>@{t.author}</strong>
                <span className="tweet-date">{t.created_at}</span>
              </div>
              <p className="tweet-text">{t.text}</p>
              <div className="tweet-metrics">
                Likes {t.likes} | Retweets {t.retweets}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Mock tweets ---- */
const mockTweets = [
  {
    id: 'm1',
    author: 'MLB',
    text: 'Yankees win 5-3 over Dodgers!',
    likes: 3200,
    retweets: 890,
    created_at: '10/24/2025 9:15 PM',
  },
  {
    id: 'm2',
    author: 'NFL',
    text: 'Chiefs beat Bills 27-24',
    likes: 4100,
    retweets: 1200,
    created_at: '10/23/2025 8:30 PM',
  },
];
