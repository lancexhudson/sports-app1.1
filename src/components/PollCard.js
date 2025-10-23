// src/components/PollCard.js
import React, { useState, useEffect } from 'react';

const PollCard = ({ polls = [] }) => {
  const [votes, setVotes] = useState({}); // { pollId: { optionId: count } }
  const [showThanks, setShowThanks] = useState(null); // pollId for thank you popup

  // Initialize votes from localStorage
  useEffect(() => {
    if (!polls || !Array.isArray(polls)) {
      console.warn('Polls prop is invalid or empty:', polls);
      return;
    }

    const initialVotes = {};
    polls.forEach((poll) => {
      if (!poll.id || !poll.options || !Array.isArray(poll.options)) {
        console.warn(`Invalid poll data for poll ${poll.id}:`, poll);
        return;
      }
      const saved = localStorage.getItem(`poll-${poll.id}`);
      initialVotes[poll.id] = saved
        ? JSON.parse(saved)
        : poll.options.reduce((acc, opt) => {
            if (!opt.id) {
              console.warn(`Invalid option in poll ${poll.id}:`, opt);
              return acc;
            }
            return { ...acc, [opt.id]: 0 };
          }, {});
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
    console.log(`Attempting vote: pollId=${pollId}, optionId=${optionId}`);
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) {
      console.warn(`Poll not found: ${pollId}`);
      return;
    }

    const pollVotes =
      votes[pollId] ||
      poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {});
    const hasVoted = Object.values(pollVotes).some((count) => count > 0);
    if (hasVoted) {
      console.log(`User has already voted for poll ${pollId}`);
      return;
    }

    setVotes((prev) => ({
      ...prev,
      [pollId]: {
        ...pollVotes,
        [optionId]: (pollVotes[optionId] || 0) + 1,
      },
    }));

    console.log(`Vote recorded: pollId=${pollId}, optionId=${optionId}`);
    setShowThanks(pollId);
    setTimeout(() => setShowThanks(null), 2000);
  };

  return (
    <div className="poll-card">
      <h3 className="poll-title">Fan Polls</h3>
      <div className="polls-list">
        {!polls || polls.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center' }}>
            No polls available
          </p>
        ) : (
          polls.map((poll) => {
            if (!poll.id || !poll.options) {
              console.warn(`Skipping invalid poll:`, poll);
              return null;
            }
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
                <h4 className="poll-question">
                  {poll.question || 'Untitled Poll'}
                </h4>
                <div className="poll-options">
                  {poll.options.map((opt) => {
                    if (!opt.id || !opt.text) {
                      console.warn(
                        `Skipping invalid option in poll ${poll.id}:`,
                        opt
                      );
                      return null;
                    }
                    const percentage = Math.round(
                      ((pollVotes[opt.id] || 0) / safeTotal) * 100
                    );
                    const isUserVote = userVotedOption === opt.id;

                    return (
                      <div
                        key={opt.id}
                        className={`poll-option ${isUserVote ? 'voted' : ''}`}
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
                        {!isUserVote && (
                          <button
                            className="poll-vote-btn"
                            onClick={() => handleVote(poll.id, opt.id)}
                          >
                            Vote
                          </button>
                        )}
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
                  <div className="thank-you-popup">
                    Thank you for your vote!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PollCard;
