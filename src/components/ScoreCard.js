// src/components/ScoreCard.js
export default function ScoreCard({
  home,
  away,
  homeScore,
  awayScore,
  status,
  kickoffTime,
}) {
  const isFinal = status === 'Final';

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

      {/* Right Side: Only kickoff time */}
      <div className="score-right">
        {kickoffTime && <div className="score-kickoff">{kickoffTime}</div>}
        {isFinal && <span className="final-badge">FINAL</span>}
      </div>
    </div>
  );
}
