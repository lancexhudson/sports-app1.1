// src/pages/SocialPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TweetCard from '../components/TweetCard';
import axios from 'axios';

const SocialPage = () => {
  const { sport } = useParams();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      setError(null);

      const BEARER_TOKEN = process.env.REACT_APP_TWITTER_BEARER_TOKEN;
      const query = `"${sport}" -is:retweet lang:en`;

      try {
        if (BEARER_TOKEN) {
          // Real X.com API call (top 10 by engagement)
          const { data } = await axios.get(
            'https://api.twitter.com/2/tweets/search/recent',
            {
              headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
              params: {
                query,
                max_results: 10,
                'tweet.fields': 'author_id,created_at,public_metrics', // Fixed: quoted key
                expansions: 'author_id', // Required for user data
              },
            }
          );

          if (data.data) {
            const formattedTweets = data.data.map((tweet) => ({
              id: tweet.id,
              text: tweet.text,
              author: tweet.author_id,
              likes: tweet.public_metrics?.like_count || 0,
              retweets: tweet.public_metrics?.retweet_count || 0,
            }));
            setTweets(formattedTweets);
          } else {
            throw new Error('No data returned');
          }
        } else {
          // Fallback mock data if no token
          setTweets(mockTweets(sport));
        }
      } catch (err) {
        console.error('Social API error:', err);
        setError('Failed to load tweets. Showing mock data.');
        setTweets(mockTweets(sport));
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [sport]);

  // Mock data for fallback (10 tweets per sport)
  const mockTweets = (sport) => {
    const base = [
      {
        id: '1',
        text: `${sport.toUpperCase()} fans are hyped for the playoffs! #${sport.toUpperCase()}`,
        author: '@Fan1',
        likes: 150,
        retweets: 25,
      },
      {
        id: '2',
        text: `Just watched the latest ${sport} game – insane finish!`,
        author: '@Fan2',
        likes: 120,
        retweets: 20,
      },
      {
        id: '3',
        text: `Prediction: ${sport} team X wins it all. What do you think?`,
        author: '@Expert3',
        likes: 95,
        retweets: 15,
      },
      {
        id: '4',
        text: `Highlight of the week in ${sport}!`,
        author: '@Highlight4',
        likes: 80,
        retweets: 12,
      },
      {
        id: '5',
        text: `Underrated player in ${sport} right now.`,
        author: '@Underrated5',
        likes: 70,
        retweets: 10,
      },
      {
        id: '6',
        text: `Memes from the ${sport} game are gold 😂`,
        author: '@Meme6',
        likes: 65,
        retweets: 9,
      },
      {
        id: '7',
        text: `Trade rumors heating up in ${sport}.`,
        author: '@Rumors7',
        likes: 60,
        retweets: 8,
      },
      {
        id: '8',
        text: `Best moment from ${sport} this season.`,
        author: '@Moment8',
        likes: 55,
        retweets: 7,
      },
      {
        id: '9',
        text: `Shoutout to the ${sport} rookies!`,
        author: '@Rookie9',
        likes: 50,
        retweets: 6,
      },
      {
        id: '10',
        text: `What's your hot take on ${sport}?`,
        author: '@HotTake10',
        likes: 45,
        retweets: 5,
      },
    ];
    return base;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
        Loading tweets...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b35' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Social</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            text={tweet.text}
            author={tweet.author}
            likes={tweet.likes}
            retweets={tweet.retweets}
          />
        ))}
      </div>
    </div>
  );
};

export default SocialPage;
