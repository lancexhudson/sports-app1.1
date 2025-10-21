// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import ScoreCard from '../components/ScoreCard';
import PollCard from '../components/PollCard';

const SPORTS = [
  { id: 'baseball', league: 'mlb' },
  { id: 'basketball', league: 'nba' },
  { id: 'football', league: 'nfl' },
  { id: 'soccer', league: 'eng.1' },
  { id: 'golf', league: 'pga' },
];

// Hardcoded Polls – All in one card
const POLLS = [
  {
    id: '1',
    question: 'Who will win the World Series?',
    options: [
      { id: 'a', text: 'Yankees' },
      { id: 'b', text: 'Dodgers' },
      { id: 'c', text: 'Braves' },
    ],
  },
  {
    id: '2',
    question: 'Best NBA duo?',
    options: [
      { id: 'a', text: 'LeBron & AD' },
      { id: 'b', text: 'Curry & Klay' },
      { id: 'c', text: 'Jokić & Murray' },
    ],
  },
  {
    id: '3',
    question: 'Next Super Bowl champ?',
    options: [
      { id: 'a', text: 'Chiefs' },
      { id: 'b', text: '49ers' },
      { id: 'c', text: 'Bengals' },
    ],
  },
];

export default function HomePage() {
  const [topStories, setTopStories] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);

      try {
        // === TOP STORIES – 6 total (2×3 grid) ===
        const storyPromises = SPORTS.map(async (sport) => {
          try {
            const { data } = await axios.get(
              `https://site.api.espn.com/apis/site/v2/sports/${sport.id}/${sport.league}/news`
            );
            return (data.articles || []).slice(0, 2).map((a) => ({
              title: a.headlines?.[0]?.description || a.title || 'No title',
              description: a.description || 'No description',
              image:
                a.images?.[0]?.url ||
                'https://via.placeholder.com/300x160?text=News',
              url: a.links?.web?.href || '#',
            }));
          } catch (err) {
            console.warn(`News failed for ${sport.id}:`, err);
            return [];
          }
        });

        const storyResults = await Promise.all(storyPromises);
        setTopStories(storyResults.flat().slice(0, 8));

        // === UPCOMING GAMES – 4 total with kickoff times ===
        const gamePromises = SPORTS.map(async (sport) => {
          try {
            const { data } = await axios.get(
              `https://site.api.espn.com/apis/site/v2/sports/${sport.id}/${sport.league}/scoreboard`
            );

            const events = data.events || [];
            if (events.length === 0) return [];

            return events
              .slice(0, 1)
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

                if (sport.id === 'golf') {
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
          } catch (err) {
            console.warn(`Scoreboard failed for ${sport.id}:`, err);
            return [];
          }
        });

        const gameResults = await Promise.all(gamePromises);
        const allGames = gameResults.flat();

        if (allGames.length === 0) {
          setUpcomingGames([
            {
              home: '—',
              away: 'No games',
              homeScore: '',
              awayScore: '',
              status: 'Check back later',
              kickoffTime: '',
            },
          ]);
        } else {
          setUpcomingGames(allGames.slice(0, 4));
        }
      } catch (err) {
        console.error('Home page API error:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div
      className="container"
      style={{ padding: '50px 20px 40px', minHeight: 'calc(100vh - 180px)' }}
    >
      {/* <h1
        style={{
          fontSize: '32px',
          textAlign: 'center',
          marginBottom: '32px',
          color: '#ff6b35',
        }}
      >
        OVERTIME — Home
      </h1> */}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#ff6b35' }}>{error}</p>
      ) : (
        <div className="home-grid">
          {/* LEFT: 2×3 Top Stories */}
          <section className="home-stories">
            <h2
              style={{ fontSize: '24px', marginBottom: '16px', color: '#fff' }}
            >
              Top Stories
            </h2>
            <div className="stories-grid">
              {topStories.map((story, i) => (
                <NewsCard key={i} {...story} />
              ))}
            </div>
          </section>

          {/* RIGHT: Upcoming Games + Unified Poll Card */}
          <section className="home-sidebar">
            {/* Upcoming Games */}
            <div className="sidebar-section">
              <h2
                style={{
                  fontSize: '24px',
                  marginBottom: '16px',
                  color: '#fff',
                }}
              >
                Scores & Upcoming Games
              </h2>
              <div className="games-scroll">
                {upcomingGames.map((game, i) => (
                  <ScoreCard key={i} {...game} />
                ))}
              </div>
            </div>

            {/* Unified Poll Card – All polls in one */}
            <div className="sidebar-section">
              <PollCard polls={POLLS} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
