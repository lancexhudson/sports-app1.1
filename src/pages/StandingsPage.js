// src/pages/StandingsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScoreCard from '../components/ScoreCard';

const SPORTS = [
  { id: 'football', league: 'nfl', title: 'NFL Standings' },
  { id: 'baseball', league: 'mlb', title: 'MLB Standings' },
  { id: 'basketball', league: 'nba', title: 'NBA Standings' },
  { id: 'soccer', league: 'eng.1', title: 'Premier League Standings' },
  { id: 'golf', league: 'pga', title: 'PGA Tour Standings' },
];

// Redundancy: Hardcoded mock data (top 5 per sport, 2025 season)
const MOCK_STANDINGS = {
  football: {
    title: 'NFL Standings',
    entries: [
      {
        home: 'Chiefs',
        away: 'AFC West',
        homeScore: '10-1',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: 'Eagles',
        away: 'NFC East',
        homeScore: '9-2',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: 'Lions',
        away: 'NFC North',
        homeScore: '8-3',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: 'Bills',
        away: 'AFC East',
        homeScore: '8-3',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: '49ers',
        away: 'NFC West',
        homeScore: '7-4',
        awayScore: '1st',
        status: '1st Place',
      },
    ],
  },
  baseball: {
    title: 'MLB Standings',
    entries: [
      {
        home: 'Dodgers',
        away: 'NL West',
        homeScore: '98-64',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: 'Yankees',
        away: 'AL East',
        homeScore: '94-68',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: 'Phillies',
        away: 'NL East',
        homeScore: '95-67',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: 'Orioles',
        away: 'AL East',
        homeScore: '91-71',
        awayScore: '2nd',
        status: '2nd Place',
      },
      {
        home: 'Braves',
        away: 'NL East',
        homeScore: '89-73',
        awayScore: '2nd',
        status: '2nd Place',
      },
    ],
  },
  basketball: {
    title: 'NBA Standings',
    entries: [
      {
        home: 'Celtics',
        away: 'Atlantic',
        homeScore: '5-1',
        awayScore: '1st',
        status: '1st Place',
      },
      {
        home: 'Knicks',
        away: 'Atlantic',
        homeScore: '4-2',
        awayScore: '2nd',
        status: '2nd Place',
      },
      {
        home: '76ers',
        away: 'Atlantic',
        homeScore: '3-3',
        awayScore: '3rd',
        status: '3rd Place',
      },
      {
        home: 'Nets',
        away: 'Atlantic',
        homeScore: '2-4',
        awayScore: '4th',
        status: '4th Place',
      },
      {
        home: 'Raptors',
        away: 'Atlantic',
        homeScore: '1-5',
        awayScore: '5th',
        status: '5th Place',
      },
    ],
  },
  soccer: {
    title: 'Premier League Standings',
    entries: [
      {
        home: 'Man City',
        away: 'Premier League',
        homeScore: '8-1-0',
        awayScore: '25',
        status: '1st',
      },
      {
        home: 'Arsenal',
        away: 'Premier League',
        homeScore: '7-2-0',
        awayScore: '23',
        status: '2nd',
      },
      {
        home: 'Liverpool',
        away: 'Premier League',
        homeScore: '6-3-1',
        awayScore: '21',
        status: '3rd',
      },
      {
        home: 'Chelsea',
        away: 'Premier League',
        homeScore: '6-1-2',
        awayScore: '19',
        status: '4th',
      },
      {
        home: 'Man Utd',
        away: 'Premier League',
        homeScore: '5-2-3',
        awayScore: '17',
        status: '5th',
      },
    ],
  },
  golf: {
    title: 'PGA Tour Standings',
    entries: [
      {
        home: 'Scottie Scheffler',
        away: 'PGA Tour',
        homeScore: '2,500',
        awayScore: '1st',
        status: '1st',
      },
      {
        home: 'Rory McIlroy',
        away: 'PGA Tour',
        homeScore: '2,000',
        awayScore: '2nd',
        status: '2nd',
      },
      {
        home: 'Xander Schauffele',
        away: 'PGA Tour',
        homeScore: '1,800',
        awayScore: '3rd',
        status: '3rd',
      },
      {
        home: 'Collin Morikawa',
        away: 'PGA Tour',
        homeScore: '1,600',
        awayScore: '4th',
        status: '4th',
      },
      {
        home: 'Viktor Hovland',
        away: 'PGA Tour',
        homeScore: '1,400',
        awayScore: '5th',
        status: '5th',
      },
    ],
  },
};

export default function StandingsPage() {
  const [standings, setStandings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      setError(null);

      try {
        const standingsData = {};
        for (const sport of SPORTS) {
          try {
            const { data } = await axios.get(
              `https://site.api.espn.com/apis/site/v2/sports/${sport.id}/${sport.league}/standings`
            );

            // If API returns valid data, use it; otherwise, fallback to mock
            if (data.standings?.entries?.length > 0) {
              standingsData[sport.id] = {
                title: sport.title,
                entries: data.standings.entries.slice(0, 5).map((entry) => ({
                  home:
                    entry.team?.abbreviation ||
                    entry.athlete?.displayName ||
                    entry.name ||
                    'Unknown',
                  away: entry.conference?.abbreviation || 'N/A',
                  homeScore:
                    entry.stats?.find((s) => s.name === 'record')?.value ||
                    entry.record?.summary ||
                    'N/A',
                  awayScore: entry.rank || 'N/A',
                  status: entry.clinched || entry.status || 'Active',
                })),
              };
            } else {
              // Fallback to mock
              standingsData[sport.id] = MOCK_STANDINGS[sport.id];
            }
          } catch (err) {
            console.warn(`Standings failed for ${sport.id}:`, err);
            // Fallback to mock
            standingsData[sport.id] = MOCK_STANDINGS[sport.id];
          }
        }
        setStandings(standingsData);
      } catch (err) {
        console.error('Standings API error:', err);
        setError('Failed to load standings. Using fallback data.');
        setStandings(MOCK_STANDINGS); // Full fallback
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return (
    <div className="container" style={{ padding: '100px 20px 40px' }}>
      <h1
        style={{ fontSize: '32px', textAlign: 'center', marginBottom: '32px' }}
      >
        Standings
      </h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>
          Loading standings...
        </p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#ff6b35' }}>{error}</p>
      ) : (
        <div className="standings-grid">
          {SPORTS.map((sport) => (
            <section key={sport.id}>
              <h2
                style={{
                  fontSize: '24px',
                  marginBottom: '16px',
                  color: '#fff',
                }}
              >
                {standings[sport.id]?.title || sport.title}
              </h2>
              <div className="standings-list">
                {standings[sport.id]?.entries?.length > 0 ? (
                  standings[sport.id].entries.map((entry, i) => (
                    <ScoreCard key={i} {...entry} />
                  ))
                ) : (
                  <p style={{ color: '#aaa' }}>No standings available.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
