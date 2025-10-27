// src/pages/ScoresPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScoreCard from '../components/ScoreCard';

const SPORTS = [
  { id: 'baseball', league: 'mlb' },
  { id: 'basketball', league: 'nba' },
  { id: 'football', league: 'nfl' },
  { id: 'soccer', league: 'eng.1' },
  { id: 'golf', league: 'pga' },
];

const SPORT_OPTIONS = [
  { id: 'all', name: 'All Sports' },
  { id: 'baseball', name: 'Baseball' },
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'soccer', name: 'Soccer' },
  { id: 'golf', name: 'Golf' },
];

export default function ScoresPage() {
  const [finalScores, setFinalScores] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinalScores = async () => {
      setLoading(true);
      setError(null);

      try {
        const scorePromises = SPORTS.map(async (sport) => {
          try {
            const { data } = await axios.get(
              `https://site.api.espn.com/apis/site/v2/sports/${sport.id}/${sport.league}/scoreboard`
            );

            const events = data.events || [];
            if (events.length === 0) return [];

            return events
              .filter((e) => e.status?.type?.name === 'STATUS_FINAL') // Only FINAL games
              .slice(0, 5)
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

                // === GOLF: Final leaderboard ===
                if (sport.id === 'golf') {
                  const winner = comp.competitors?.[0]?.athlete || {};
                  const runnerUp = comp.competitors?.[1]?.athlete || {};
                  return {
                    id: e.id, // ← ESPN game ID for details
                    home: winner.displayName || 'Champion',
                    away: runnerUp.displayName || '2nd',
                    homeScore: winner.score || '—',
                    awayScore: runnerUp.score || '—',
                    status: 'Final',
                    kickoffTime: kickoff,
                    sport: 'golf',
                  };
                }

                // === TEAM SPORTS ===
                const homeTeam =
                  comp.competitors?.find((c) => c.homeAway === 'home') || {};
                const awayTeam =
                  comp.competitors?.find((c) => c.homeAway === 'away') || {};

                return {
                  id: e.id, // ← ESPN game ID for details
                  home: homeTeam.team?.abbreviation || 'HOME',
                  away: awayTeam.team?.abbreviation || 'AWAY',
                  homeScore: homeTeam.score || '0',
                  awayScore: awayTeam.score || '0',
                  status: 'Final',
                  kickoffTime: kickoff,
                  sport: sport.id,
                };
              })
              .filter(Boolean);
          } catch (err) {
            console.warn(`Final scores failed for ${sport.id}:`, err);
            return [];
          }
        });

        const results = await Promise.all(scorePromises);
        const allFinal = results.flat();

        // Sort by most recent
        allFinal.sort(
          (a, b) => new Date(b.kickoffTime) - new Date(a.kickoffTime)
        );

        setFinalScores(allFinal);
      } catch (err) {
        console.error('Scores page error:', err);
        setError('Failed to load final scores.');
      } finally {
        setLoading(false);
      }
    };

    fetchFinalScores();
  }, []);

  const filtered =
    filter === 'all'
      ? finalScores
      : finalScores.filter((s) => s.sport === filter);

  return (
    <div
      className="container"
      style={{ padding: '50px 20px 40px', minHeight: 'calc(100vh - 180px)' }}
    >
      {/* // style={{ paddingTop: '100px' }} */}
      <h1 className="page-title">Scores</h1>
      {/* Sport Filter */}
      <div className="filter-bar">
        <label
          htmlFor="sport-select"
          style={{ marginRight: '8px', color: '#e0e0e0' }}
        >
          Filter by sport:
        </label>
        <select
          id="sport-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="sport-select"
        >
          {SPORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="loading">Loading final scores…</p>
      ) : error ? (
        <p className="error" style={{ color: '#ff6b35', textAlign: 'center' }}>
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center' }}>
          No final scores available for selected sport.
        </p>
      ) : (
        <div className="scores-list">
          {filtered.slice(0, 10).map((s) => (
            <ScoreCard
              key={s.id}
              id={s.id} // ← Pass game ID for details link
              home={s.home}
              away={s.away}
              homeScore={s.homeScore}
              awayScore={s.awayScore}
              status={s.status}
              kickoffTime={s.kickoffTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}
