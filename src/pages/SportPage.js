// src/pages/ScoresPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScoreCard from '../components/ScoreCard';

const SPORT_OPTIONS = [
  { id: 'all', name: 'All Sports' },
  { id: 'baseball', name: 'Baseball' },
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'soccer', name: 'Soccer' },
  { id: 'golf', name: 'Golf' },
];

export default function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // ----- ESPN scoreboard endpoint (works for most sports) -----
  const fetchScores = async () => {
    setLoading(true);
    try {
      const leagues = ['mlb', 'nfl', 'nba', 'eng.1', 'pga'];
      const all = await Promise.all(
        leagues.map((l) =>
          axios.get(
            `https://site.api.espn.com/apis/site/v2/sports/${l}/scoreboard`
          )
        )
      );

      const flat = all
        .flatMap((res) => res.data.events || [])
        .map((e) => ({
          id: e.id,
          home:
            e.competitions[0].competitors.find((c) => c.homeAway === 'home')
              ?.team?.abbreviation || '',
          away:
            e.competitions[0].competitors.find((c) => c.homeAway === 'away')
              ?.team?.abbreviation || '',
          homeScore:
            e.competitions[0].competitors.find((c) => c.homeAway === 'home')
              ?.score || '',
          awayScore:
            e.competitions[0].competitors.find((c) => c.homeAway === 'away')
              ?.score || '',
          status: e.status.type.shortDetail || 'Final',
          sport: e.leagues[0].slug?.split('.')[0] || 'unknown',
        }))
        .sort((a, b) => new Date(b.id) - new Date(a.id)) // newest first
        .slice(0, 50); // safety buffer

      setScores(flat);
    } catch (e) {
      console.warn('Scores API error – using mock data', e);
      setScores(mockScores);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const filtered =
    filter === 'all' ? scores : scores.filter((s) => s.sport === filter);

  return (
    <div
      className="container"
      // style={{ paddingTop: '100px' }}
      style={{ padding: '50px 20px 40px', minHeight: 'calc(100vh - 180px)' }}
    >
      <h1 className="page-title">Scores</h1>

      {/* Sport filter */}
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
        <p className="loading">Loading scores…</p>
      ) : (
        <div className="scores-list">
          {filtered.slice(0, 10).map((s) => (
            <ScoreCard key={s.id} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Mock fallback (same shape as API) ---- */
const mockScores = [
  {
    id: 'm1',
    home: 'NYY',
    away: 'LAD',
    homeScore: '5',
    awayScore: '3',
    status: 'Final',
    sport: 'baseball',
  },
  {
    id: 'm2',
    home: 'KC',
    away: 'BUF',
    homeScore: '27',
    awayScore: '24',
    status: 'Final',
    sport: 'football',
  },
  // …add a few more if you like
];
