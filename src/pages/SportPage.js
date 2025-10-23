// src/pages/SportPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import ScoreCard from '../components/ScoreCard';
import TweetCard from '../components/TweetCard';
import PollCard from '../components/PollCard';

const SPORTS = {
  baseball: 'mlb',
  basketball: 'nba',
  football: 'nfl',
  soccer: 'eng.1',
  golf: 'pga',
};

export default function SportPage() {
  const { sportId, tab } = useParams();
  const sport = sportId || 'baseball';
  const league = SPORTS[sport] || 'mlb';
  const [stories, setStories] = useState([]);
  const [scores, setScores] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSportData = async () => {
      setLoading(true);
      setError(null);

      try {
        // === FEATURED TAB – 12 stories (4×3 grid) ===
        if (tab === 'featured' || !tab) {
          try {
            const { data } = await axios.get(
              `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/news`
            );
            const articles = (data.articles || []).slice(0, 12).map((a) => ({
              title: a.headlines?.[0]?.description || a.title || 'No title',
              description: a.description || 'No description',
              image:
                a.images?.[0]?.url ||
                'https://via.placeholder.com/300x160?text=News',
              url: a.links?.web?.href || '#',
            }));
            setStories(articles);
          } catch (err) {
            console.warn(`News failed for ${sport}:`, err);
            setStories([]);
          }
        }

        // === SCORES TAB ===
        if (tab === 'scores') {
          try {
            const { data } = await axios.get(
              `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`
            );
            const events = (data.events || [])
              .slice(0, 10)
              .map((e) => {
                const comp = e.competitions?.[0];
                if (!comp) return null;

                const kickoff = new Date(e.date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                  timeZone: 'America/New_York',
                });

                if (sport === 'golf') {
                  const leader = comp.competitors?.[0]?.athlete || {};
                  const second = comp.competitors?.[1]?.athlete || {};
                  return {
                    home: leader.displayName || 'Leader',
                    away: second.displayName || 'Runner-Up',
                    homeScore: leader.score || 'TBD',
                    awayScore: second.score || 'TBD',
                    status: e.status?.type?.shortDetail || 'Round 1',
                    kickoffTime: kickoff,
                  };
                }

                const home =
                  comp.competitors?.find((c) => c.homeAway === 'home') || {};
                const away =
                  comp.competitors?.find((c) => c.homeAway === 'away') || {};
                return {
                  home: home.team?.abbreviation || 'HOME',
                  away: away.team?.abbreviation || 'AWAY',
                  homeScore: home.score || '0',
                  awayScore: away.score || '0',
                  status: e.status?.type?.shortDetail || 'Upcoming',
                  kickoffTime: kickoff,
                };
              })
              .filter(Boolean);
            setScores(events);
          } catch (err) {
            console.warn(`Scores failed for ${sport}:`, err);
            setScores([]);
          }
        }

        // === SOCIAL TAB ===
        if (tab === 'social') {
          try {
            // Fallback to mock tweets for simplicity / no token
            setTweets(mockTweets(sport));
          } catch (err) {
            console.warn(`Social failed for ${sport}:`, err);
            setTweets([]);
          }
        }

        // === POLLS TAB ===
        if (tab === 'polls') {
          setPolls(getPollsForSport(sport));
        }
      } catch (err) {
        console.error('Sport page API error:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSportData();
  }, [sport, league, tab]);

  const getPollsForSport = (sportKey) => {
    const readable = sportKey.charAt(0).toUpperCase() + sportKey.slice(1);
    return [
      {
        id: `${sportKey}-1`,
        question: `Who wins the ${readable} championship?`,
        options: [
          { id: 'a', text: 'Favorite' },
          { id: 'b', text: 'Dark Horse' },
          { id: 'c', text: 'Long Shot' },
        ],
      },
      {
        id: `${sportKey}-2`,
        question: `MVP so far in ${readable}?`,
        options: [
          { id: 'a', text: 'Player A' },
          { id: 'b', text: 'Player B' },
          { id: 'c', text: 'Player C' },
        ],
      },
    ];
  };

  const mockTweets = (sportKey) => {
    const tag = sportKey.toUpperCase();
    return [
      { id: '1', text: `${tag} fans are hyped for the playoffs! #${tag}`, author: 'Fan1', likes: 150, retweets: 25 },
      { id: '2', text: `Just watched the latest ${sportKey} game – insane finish!`, author: 'Fan2', likes: 120, retweets: 20 },
      { id: '3', text: `Prediction: ${sportKey} team X wins it all.`, author: 'Expert3', likes: 95, retweets: 15 },
      { id: '4', text: `Highlight of the week in ${sportKey}!`, author: 'Highlight4', likes: 80, retweets: 12 },
      { id: '5', text: `Underrated player in ${sportKey} right now.`, author: 'Underrated5', likes: 70, retweets: 10 },
      { id: '6', text: `Memes from the ${sportKey} game are gold 😂`, author: 'Meme6', likes: 65, retweets: 9 },
      { id: '7', text: `Trade rumors heating up in ${sportKey}.`, author: 'Rumors7', likes: 60, retweets: 8 },
      { id: '8', text: `Best moment from ${sportKey} this season.`, author: 'Moment8', likes: 55, retweets: 7 },
      { id: '9', text: `Shoutout to the ${sportKey} rookies!`, author: 'Rookie9', likes: 50, retweets: 6 },
      { id: '10', text: `What's your hot take on ${sportKey}?`, author: 'HotTake10', likes: 45, retweets: 5 },
    ];
  };

  return (
    <div
      className="container"
      style={{ padding: '100px 20px 40px', minHeight: 'calc(100vh - 180px)' }}
    >
      <h1
        style={{
          fontSize: '32px',
          textAlign: 'center',
          marginBottom: '32px',
          color: '#ff6b35',
        }}
      >
        {sport.toUpperCase()} — {tab || 'Featured'}
      </h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#ff6b35' }}>{error}</p>
      ) : (
        <div>
          {(tab === 'featured' || !tab) && (
            <section className="sport-stories-grid">
              {stories.length > 0 ? (
                stories.map((story, i) => <NewsCard key={i} {...story} />)
              ) : (
                <p style={{ textAlign: 'center', color: '#aaa' }}>
                  No stories available.
                </p>
              )}
            </section>
          )}

          {tab === 'scores' && (
            <section className="games-scroll">
              {scores.length > 0 ? (
                scores.map((game, i) => <ScoreCard key={i} {...game} />)
              ) : (
                <p style={{ textAlign: 'center', color: '#aaa' }}>
                  No scores available.
                </p>
              )}
            </section>
          )}

          {tab === 'social' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tweets.length > 0 ? (
                tweets.map((tweet) => (
                  <TweetCard
                    key={tweet.id}
                    text={tweet.text}
                    author={tweet.author}
                    likes={tweet.likes}
                    retweets={tweet.retweets}
                  />
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#aaa' }}>
                  No tweets available.
                </p>
              )}
            </section>
          )}

          {tab === 'polls' && (
            <section className="home-sidebar">
              <div className="sidebar-section">
                <PollCard polls={polls} />
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
