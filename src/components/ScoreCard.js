// src/components/ScoreCard.js
export default function ScoreCard({
  id,
  home,
  away,
  homeScore,
  awayScore,
  status,
  kickoffTime,
  sport = 'football', //default fallback
}) {
  const isFinal = status === 'Final';

  // Map internal sport ID → ESPN URL slug
  const sportToUrl = {
    baseball: 'mlb',
    football: 'nfl',
    basketball: 'nba',
    soccer: 'soccer',
    golf: 'golf',
  };

  const espnSlug = sportToUrl[sport] || 'nfl';
  const gameUrl = id
    ? `https://www.espn.com/${espnSlug}/game?gameId=${id}`
    : '#';

  return (
    <div className="score-card">
      {/* Left: Home Team */}
      <div>
        <div className="score-team-name">{home}</div>
        <div className="score-team-points">{homeScore}</div>
      </div>

      {/* Right: Away Team */}
      <div>
        <div className="score-team-name">{away}</div>
        <div className="score-team-points">{awayScore}</div>
      </div>

      {/* Right Side: Kickoff + FINAL badge + Details */}
      <div className="score-right">
        {kickoffTime && <div className="score-kickoff">{kickoffTime}</div>}

        {(isFinal || id) && (
          <div className="score-right-row">
            {id && (
              <a
                href={gameUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="details-link"
                title="View game details on ESPN"
              >
                Details
              </a>
            )}
            {isFinal && <span className="final-badge">FINAL</span>}
          </div>
        )}
      </div>
    </div>
  );
}
