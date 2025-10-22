// src/pages/SportPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import ScoreCard from '../components/ScoreCard';

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
      } catch (err) {
        console.error('Sport page API error:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSportData();
  }, [sport, league, tab]);

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
        </div>
      )}
    </div>
  );
}
