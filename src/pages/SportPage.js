// src/pages/SportPage.js
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import ScoreCard from '../components/ScoreCard';
import TweetCard from '../components/TweetCard';
import axios from 'axios';

/* -------------------------------------------------
   MOCK DATA – fallback for API failures
   ------------------------------------------------- */
const mockData = {
  baseball: {
    featured: [
      {
        title: 'Judge Hits 62!',
        description: 'Breaks AL record.',
        image: 'https://via.placeholder.com/300x160?text=Judge+62',
      },
      {
        title: 'Yankees Clinch',
        description: 'AL East champs.',
        image: 'https://via.placeholder.com/300x160?text=YANKEES',
      },
    ],
    scores: [
      {
        home: 'NYY',
        away: 'BOS',
        homeScore: '5',
        awayScore: '3',
        status: 'Final',
      },
      {
        home: 'LAD',
        away: 'SFG',
        homeScore: '4',
        awayScore: '2',
        status: '7th',
      },
    ],
    social: [],
    polls: [],
  },
  golf: {
    featured: [
      {
        title: 'Scheffler Leads PGA',
        description: 'Tops leaderboard at Quail Hollow.',
        image: 'https://via.placeholder.com/300x160?text=PGA+News',
      },
      {
        title: "McIlroy's Comeback",
        description: 'Rory surges in final round.',
        image: 'https://via.placeholder.com/300x160?text=McIlroy',
      },
      {
        title: 'PGA Championship Preview',
        description: 'Top players to watch.',
        image: 'https://via.placeholder.com/300x160?text=PGA+Champ',
      },
      {
        title: 'New Talent Shines',
        description: 'Rookie makes waves.',
        image: 'https://via.placeholder.com/300x160?text=Rookie',
      },
      {
        title: 'Course Record Broken',
        description: 'Historic performance at PGA.',
        image: 'https://via.placeholder.com/300x160?text=Record',
      },
      {
        home: 'Scheffler',
        away: 'McIlroy',
        homeScore: '-12',
        awayScore: '-9',
        status: 'Final',
      },
      {
        home: 'Hovland',
        away: 'Spieth',
        homeScore: '-8',
        awayScore: '-7',
        status: 'Round 3',
      },
      {
        home: 'Thomas',
        away: 'DeChambeau',
        homeScore: 'E',
        awayScore: '+1',
        status: 'Upcoming',
      },
      {
        home: 'Cantlay',
        away: 'Rahm',
        homeScore: 'TBD',
        awayScore: 'TBD',
        status: 'Upcoming',
      },
      {
        home: 'Homa',
        away: 'Pavon',
        homeScore: 'TBD',
        awayScore: 'TBD',
        status: 'Upcoming',
      },
    ],
    scores: [],
    social: [],
    polls: [],
  },
  // Add other sports (basketball, football, soccer) if needed
};

/* -------------------------------------------------
   COMPONENT
   ------------------------------------------------- */
export default function SportPage() {
  const { sportId = 'baseball', tab = 'featured' } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----- FEATURED TAB – ESPN News + Games ----- */
  useEffect(() => {
    if (tab !== 'featured') return;

    const fetchFeatured = async () => {
      setLoading(true);
      const leagueMap = {
        baseball: 'mlb',
        basketball: 'nba',
        football: 'nfl',
        soccer: 'eng.1',
        golf: 'pga',
      };
      const league = leagueMap[sportId] || 'mlb';

      try {
        // Fetch top 5 news stories
        const newsRes = await axios.get(
          `https://site.api.espn.com/apis/site/v2/sports/${sportId}/${league}/news`
        );
        const stories = (newsRes.data.articles || []).slice(0, 5).map((a) => ({
          title: a.headlines?.[0]?.description || a.title || 'No title',
          description: a.description || 'No description',
          image:
            a.images?.[0]?.url ||
            'https://via.placeholder.com/300x160?text=News',
          url: a.links?.web?.href || '#',
        }));

        // Fetch upcoming 5 games/tournaments
        const scoresRes = await axios.get(
          `https://site.api.espn.com/apis/site/v2/sports/${sportId}/${league}/scoreboard`
        );
        let games = [];
        if (sportId === 'golf') {
          // Golf-specific: Extract tournaments and leaderboard
          games = (scoresRes.data.events || []).slice(0, 5).map((e) => {
            const comp = e.competitions?.[0];
            const leader = comp?.competitors?.[0] || {};
            const second = comp?.competitors?.[1] || {};
            return {
              home: leader.athlete?.displayName || 'Leader',
              away: second.athlete?.displayName || 'Runner-Up',
              homeScore: leader.score || 'TBD',
              awayScore: second.score || 'TBD',
              status: e.status?.type?.shortDetail || 'Upcoming',
            };
          });
        } else {
          // Other sports: Standard game format
          games = (scoresRes.data.events || []).slice(0, 5).map((e) => {
            const comp = e.competitions[0];
            const home =
              comp.competitors.find((c) => c.homeAway === 'home') || {};
            const away =
              comp.competitors.find((c) => c.homeAway === 'away') || {};
            return {
              home: home.team?.abbreviation || 'HOME',
              away: away.team?.abbreviation || 'AWAY',
              homeScore: home.score || '0',
              awayScore: away.score || '0',
              status: e.status?.type?.shortDetail || 'Upcoming',
            };
          });
        }

        // Combine into data array (stories first, games second)
        setData([...stories, ...games]);
      } catch (err) {
        console.error(`Featured API error for ${sportId}:`, err);
        setData(mockData[sportId]?.featured || mockData.baseball.featured);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [sportId, tab]);

  /* ----- SOCIAL TAB – X (Twitter) API ----- */
  useEffect(() => {
    if (tab !== 'social') return;

    const fetchTweets = async () => {
      setLoading(true);
      const BEARER = process.env.REACT_APP_TWITTER_BEARER_TOKEN;
      const query = `"${sportId}" -is:retweet lang:en`;

      try {
        if (BEARER) {
          const { data } = await axios.get(
            'https://api.twitter.com/2/tweets/search/recent',
            {
              headers: { Authorization: `Bearer ${BEARER}` },
              params: {
                query,
                max_results: 10,
                'tweet.fields': 'author_id,public_metrics',
              },
            }
          );

          const tweets = (data.data || []).map((t) => ({
            id: t.id,
            text: t.text,
            author: t.author_id,
            likes: t.public_metrics?.like_count ?? 0,
            retweets: t.public_metrics?.retweet_count ?? 0,
          }));
          setData(tweets);
        } else {
          setData(mockTweets(sportId));
        }
      } catch (err) {
        console.error('Twitter API error:', err);
        setData(mockTweets(sportId));
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [sportId, tab]);

  /* ----- OTHER TABS – use mock data ----- */
  useEffect(() => {
    if (tab === 'featured' || tab === 'social') return;

    setTimeout(() => {
      const sport = mockData[sportId] || mockData.baseball;
      setData(sport[tab] || []);
      setLoading(false);
    }, 300);
  }, [sportId, tab]);

  /* ----- MOCK TWEETS (fallback) ----- */
  const mockTweets = (sport) => [
    {
      id: 'm1',
      text: `${sport} fans are hyped! #${sport.toUpperCase()}`,
      author: 'Fan1',
      likes: 150,
      retweets: 25,
    },
    {
      id: 'm2',
      text: `Insane finish in ${sport} today!`,
      author: 'Fan2',
      likes: 120,
      retweets: 20,
    },
    {
      id: 'm3',
      text: `Who wins ${sport} MVP?`,
      author: 'Expert3',
      likes: 95,
      retweets: 15,
    },
    {
      id: 'm4',
      text: `Highlight of the week in ${sport}!`,
      author: 'Highlight4',
      likes: 80,
      retweets: 12,
    },
    {
      id: 'm5',
      text: `Underrated ${sport} player right now.`,
      author: 'Underrated5',
      likes: 70,
      retweets: 10,
    },
    {
      id: 'm6',
      text: `${sport} memes are gold`,
      author: 'Meme6',
      likes: 65,
      retweets: 9,
    },
    {
      id: 'm7',
      text: `Trade rumors in ${sport}.`,
      author: 'Rumors7',
      likes: 60,
      retweets: 8,
    },
    {
      id: 'm8',
      text: `Best ${sport} moment this season.`,
      author: 'Moment8',
      likes: 55,
      retweets: 7,
    },
    {
      id: 'm9',
      text: `Shoutout to ${sport} rookies!`,
      author: 'Rookie9',
      likes: 50,
      retweets: 6,
    },
    {
      id: 'm10',
      text: `Hot take on ${sport}?`,
      author: 'HotTake10',
      likes: 45,
      retweets: 5,
    },
  ];

  /* ----- RENDER ----- */
  return (
    <div
      className="container"
      style={{ padding: '20px 0', minHeight: 'calc(100vh - 180px)' }}
    >
      <h2 style={{ textTransform: 'capitalize', marginBottom: '16px' }}>
        {sportId} — {tab}
      </h2>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : (
        <>
          {/* FEATURED – News + Games */}
          {tab === 'featured' && (
            <div>
              <h3
                style={{
                  fontSize: '20px',
                  marginBottom: '16px',
                  color: '#fff',
                }}
              >
                Top Stories
              </h3>
              <div className="card-grid">
                {data.slice(0, 5).map((story, i) => (
                  <NewsCard key={`story-${i}`} {...story} />
                ))}
              </div>

              <h3
                style={{
                  fontSize: '20px',
                  margin: '32px 0 16px 0',
                  color: '#fff',
                }}
              >
                Upcoming Tournaments
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {data.slice(5, 10).map((game, i) => (
                  <ScoreCard key={`game-${i}`} {...game} />
                ))}
              </div>
            </div>
          )}

          {/* SCORES */}
          {tab === 'scores' && (
            <div style={{ display: 'grid', gap: '12px' }}>
              {data.map((item, i) => (
                <ScoreCard key={i} {...item} />
              ))}
            </div>
          )}

          {/* SOCIAL */}
          {tab === 'social' && (
            <div style={{ display: 'grid', gap: '12px' }}>
              {data.map((t) => (
                <TweetCard
                  key={t.id}
                  text={t.text}
                  author={t.author}
                  likes={t.likes}
                  retweets={t.retweets}
                />
              ))}
            </div>
          )}

          {/* POLLS */}
          {tab === 'polls' && (
            <p style={{ textAlign: 'center', color: '#aaa' }}>
              Polls coming soon!
            </p>
          )}
        </>
      )}
    </div>
  );
}
