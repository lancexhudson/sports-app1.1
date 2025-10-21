// src/components/PollCard.js
import React, { useState, useEffect } from 'react';

const PollCard = ({ polls }) => {
  const [votes, setVotes] = useState({}); // { pollId: { optionId: count } }
  const [showThanks, setShowThanks] = useState(null); // pollId for thank you popup

  // Initialize votes from localStorage
  useEffect(() => {
    const initialVotes = {};
    polls.forEach((poll) => {
      const saved = localStorage.getItem(`poll-${poll.id}`);
      initialVotes[poll.id] = saved
        ? JSON.parse(saved)
        : poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {});
    });
    setVotes(initialVotes);
  }, [polls]);

  // Save votes to localStorage
  useEffect(() => {
    Object.keys(votes).forEach((pollId) => {
      localStorage.setItem(`poll-${pollId}`, JSON.stringify(votes[pollId]));
    });
  }, [votes]);

  const handleVote = (pollId, optionId) => {
    const pollVotes = votes[pollId];
    if (!pollVotes) return;

    // Check if user has already voted
    const hasVoted = Object.values(pollVotes).some((count) => count > 0);
    if (hasVoted) return;

    // Record vote
    setVotes((prev) => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        [optionId]: prev[pollId][optionId] + 1,
      },
    }));

    // Show thank you popup
    setShowThanks(pollId);
    setTimeout(() => setShowThanks(null), 2000);
  };

  return (
    <div className="poll-card">
      <h3 className="poll-title">Fan Polls</h3>
      <div className="polls-list">
        {polls.map((poll) => {
          const pollVotes = votes[poll.id] || {};
          const totalVotes = Object.values(pollVotes).reduce(
            (a, b) => a + b,
            0
          );
          const safeTotal = totalVotes > 0 ? totalVotes : 1; // Prevent NaN
          const userVotedOption = Object.keys(pollVotes).find(
            (id) => pollVotes[id] > 0
          );

          return (
            <div key={poll.id} className="poll-item">
              <h4 className="poll-question">{poll.question}</h4>
              <div className="poll-options">
                {poll.options.map((opt) => {
                  const percentage = Math.round(
                    ((pollVotes[opt.id] || 0) / safeTotal) * 100
                  );
                  const isUserVote = userVotedOption === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className={`poll-option ${
                        userVotedOption ? 'voted' : 'clickable'
                      }`}
                      onClick={() =>
                        !userVotedOption && handleVote(poll.id, opt.id)
                      }
                    >
                      <div className="poll-label">
                        <span>{opt.text}</span>
                        <span className="poll-pct">{percentage}%</span>
                      </div>
                      <div className="poll-bar-bg">
                        <div
                          className="poll-bar"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {isUserVote && (
                        <span className="your-vote">Your vote</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="poll-total">
                {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
              </div>

              {/* Thank You Popup */}
              {showThanks === poll.id && (
                <div className="thank-you-popup">Thank you for your vote!</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollCard;
