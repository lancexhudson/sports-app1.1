export default function ScoreCard({
  home,
  away,
  homeScore,
  awayScore,
  status,
  kickoffTime = '',
}) {
  return (
    <div className="card score-card">
      <div className="score-team">
        <div className="score-team-name">{home}</div>
        <div className="score-team-points">{homeScore}</div>
      </div>
      <span>vs</span>
      <div className="score-team">
        <div className="score-team-name">{away}</div>
        <div className="score-team-points">{awayScore}</div>
      </div>
      <div className="score-status">
        <div>{status}</div>
        {kickoffTime && <div className="score-kickoff">{kickoffTime}</div>}
      </div>
    </div>
  );
}
