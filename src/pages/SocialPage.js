// src/pages/SocialPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TweetCard from '../components/TweetCard';

const BEARER_TOKEN = process.env.REACT_APP_TWITTER_BEARER;

export default function SocialPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      setError(null);

      if (!BEARER_TOKEN) {
        console.warn('Twitter Bearer Token missing – using mock data');
        setTweets(mockTweets);
        setLoading(false);
        return;
      }

      try {
        // Step 1: Search for top sports tweets
        const { data: searchData } = await axios.get(
          'https://api.twitter.com/2/tweets/search/recent',
          {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
            params: {
              query:
                '#MLB OR #NFL OR #NBA OR #PremierLeague OR #PGA -is:retweet lang:en',
              max_results: 20, // Get more to filter top 10
              'tweet.fields': 'public_metrics,author_id,created_at,text',
              expansions: 'author_id',
              'user.fields': 'username,verified',
            },
          }
        );

        if (!searchData.data || searchData.data.length === 0) {
          throw new Error('No tweets found');
        }

        // Step 2: Enrich with user data
        const userIds = [...new Set(searchData.data.map((t) => t.author_id))];
        const { data: userData } = await axios.get(
          `https://api.twitter.com/2/users?ids=${userIds.join(',')}`,
          {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
            params: { 'user.fields': 'username,verified' },
          }
        );

        const userMap = userData.data.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        // Step 3: Format and sort by engagement
        const formattedTweets = searchData.data
          .map((tweet) => {
            const user = userMap[tweet.author_id];
            if (!user) return null;

            return {
              id: tweet.id,
              text: tweet.text,
              author: user.username,
              verified: user.verified,
              likes: tweet.public_metrics.like_count,
              retweets: tweet.public_metrics.retweet_count,
              created_at: new Date(tweet.created_at).toLocaleString(),
              engagement:
                tweet.public_metrics.like_count +
                tweet.public_metrics.retweet_count,
            };
          })
          .filter(Boolean)
          .sort((a, b) => b.engagement - a.engagement)
          .slice(0, 10);

        setTweets(formattedTweets);
      } catch (err) {
        console.error('Twitter API error:', err);
        setError('Failed to load tweets – using mock data');
        setTweets(mockTweets);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div
      className="container"
      // style={{ paddingTop: '100px' }}
      style={{ padding: '50px 20px 40px', minHeight: 'calc(100vh - 180px)' }}
    >
      <h1 className="page-title">Social</h1>
      {loading ? (
        <p className="loading">Loading tweets…</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tweets.length === 0 ? (
        <p className="loading">No tweets available</p>
      ) : (
        <div className="social-list">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              text={tweet.text}
              author={tweet.author}
              likes={tweet.likes}
              retweets={tweet.retweets}
              verified={tweet.verified}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Mock data (fallback)
const mockTweets = [
  {
    id: 'm1',
    text: 'Yankees win 5-3 over Dodgers! What a game! #MLB',
    author: 'MLB',
    likes: 3200,
    retweets: 890,
    verified: true,
  },
  {
    id: 'm2',
    text: 'Chiefs beat Bills 27-24 in thriller! #NFL',
    author: 'NFL',
    likes: 4100,
    retweets: 1200,
    verified: true,
  },
  {
    id: 'm3',
    text: 'LeBron drops 40! Lakers unstoppable. #NBA',
    author: 'NBA',
    likes: 2800,
    retweets: 650,
    verified: true,
  },
  {
    id: 'm4',
    text: 'Man City tops Arsenal 2-1! Premier League heat. #PremierLeague',
    author: 'PremierLeague',
    likes: 2200,
    retweets: 480,
    verified: true,
  },
  {
    id: 'm5',
    text: 'Scheffler wins PGA Championship! #PGA',
    author: 'PGATOUR',
    likes: 1900,
    retweets: 320,
    verified: true,
  },
  {
    id: 'm6',
    text: 'Jets upset Steelers 20-17! #NFL',
    author: 'NFL',
    likes: 1500,
    retweets: 290,
    verified: true,
  },
  {
    id: 'm7',
    text: 'Curry hits 8 threes! Warriors win. #NBA',
    author: 'NBA',
    likes: 1300,
    retweets: 210,
    verified: true,
  },
  {
    id: 'm8',
    text: 'Liverpool crushes United 3-0. #PremierLeague',
    author: 'PremierLeague',
    likes: 1100,
    retweets: 180,
    verified: true,
  },
  {
    id: 'm9',
    text: 'McIlroy birdies 18 to win! #PGA',
    author: 'PGATOUR',
    likes: 950,
    retweets: 140,
    verified: true,
  },
  {
    id: 'm10',
    text: 'Braves walk off Dodgers! #MLB',
    author: 'MLB',
    likes: 820,
    retweets: 110,
    verified: true,
  },
];

// // src/pages/SocialPage.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BEARER = process.env.REACT_APP_TWITTER_BEARER;

// export default function SocialPage() {
//   const [tweets, setTweets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTweets = async () => {
//       if (!BEARER) {
//         console.warn('Twitter token missing – using mock');
//         setTweets(mockTweets);
//         setLoading(false);
//         return;
//       }

//       try {
//         const { data } = await axios.get(
//           'https://api.twitter.com/2/tweets/search/recent',
//           {
//             params: {
//               query:
//                 '#sports OR #MLB OR #NFL OR #NBA OR #PremierLeague OR #PGA',
//               max_results: 10,
//               'tweet.fields': 'public_metrics,author_id,created_at',
//             },
//             headers: { Authorization: `Bearer ${BEARER}` },
//           }
//         );

//         const enriched = await Promise.all(
//           (data.data || []).map(async (t) => {
//             const user = await axios.get(
//               `https://api.twitter.com/2/users/${t.author_id}`,
//               { headers: { Authorization: `Bearer ${BEARER}` } }
//             );
//             return {
//               id: t.id,
//               text: t.text,
//               author: user.data.data.username,
//               likes: t.public_metrics.like_count,
//               retweets: t.public_metrics.retweet_count,
//               created_at: new Date(t.created_at).toLocaleString(),
//             };
//           })
//         );

//         enriched.sort((a, b) => b.likes + b.retweets - (a.likes + a.retweets));
//         setTweets(enriched.slice(0, 10));
//       } catch (e) {
//         console.warn('Twitter API error – using mock', e);
//         setTweets(mockTweets);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTweets();
//   }, []);

//   return (
//     <div
//       className="container"
//       // style={{ paddingTop: '100px' }}
//       style={{ padding: '50px 20px 40px', minHeight: 'calc(100vh - 180px)' }}
//     >
//       <h1 className="page-title">Social</h1>

//       {loading ? (
//         <p className="loading">Loading tweets…</p>
//       ) : (
//         <div className="social-list">
//           {tweets.map((t) => (
//             <div key={t.id} className="tweet-card">
//               <div className="tweet-header">
//                 <strong>@{t.author}</strong>
//                 <span className="tweet-date">{t.created_at}</span>
//               </div>
//               <p className="tweet-text">{t.text}</p>
//               <div className="tweet-metrics">
//                 Likes {t.likes} | Retweets {t.retweets}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---- Mock tweets ---- */
// const mockTweets = [
//   {
//     id: 'm1',
//     author: 'MLB',
//     text: 'Yankees win 5-3 over Dodgers!',
//     likes: 3200,
//     retweets: 890,
//     created_at: '10/24/2025 9:15 PM',
//   },
//   {
//     id: 'm2',
//     author: 'NFL',
//     text: 'Chiefs beat Bills 27-24',
//     likes: 4100,
//     retweets: 1200,
//     created_at: '10/23/2025 8:30 PM',
//   },
// ];
