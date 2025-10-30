// src/pages/PollsPage.js
import React, { useState, useEffect } from 'react';
import { POLLS_DATA } from '../data/polls';

export default function PollsPage() {
  const [pollResults, setPollResults] = useState({});

  useEffect(() => {
    const loadResults = () => {
      const results = {};
      POLLS_DATA.forEach((poll) => {
        const saved = localStorage.getItem(`demo-poll-votes-${poll.id}`);
        results[poll.id] = saved
          ? JSON.parse(saved)
          : poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {});
      });
      setPollResults(results);
    };

    loadResults();
    const interval = setInterval(loadResults, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="container"
      //   style={{ paddingTop: '100px', paddingBottom: '40px' }}
      style={{ padding: '50px 20px 40px', minHeight: 'calc(100vh - 180px)' }}
    >
      <h1 className="page-title">Polls</h1>
      <p
        style={{
          textAlign: 'center',
          color: '#aaa',
          marginBottom: '32px',
          fontSize: '15px',
        }}
      >
        Live results from fan votes on the homepage
      </p>

      <div className="polls-grid">
        {POLLS_DATA.map((poll) => {
          const votes = pollResults[poll.id] || {};
          const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
          const safeTotal = totalVotes > 0 ? totalVotes : 1;

          return (
            <div key={poll.id} className="poll-result-card">
              <h3 className="poll-question-result">{poll.question}</h3>
              <div className="poll-options-result">
                {poll.options.map((opt) => {
                  const count = votes[opt.id] || 0;
                  const percentage = Math.round((count / safeTotal) * 100);
                  return (
                    <div key={opt.id} className="result-option">
                      <div className="result-label">
                        <span className="option-text-result">{opt.text}</span>
                        <span className="result-pct">{percentage}%</span>
                      </div>
                      <div className="result-bar-bg">
                        <div
                          className="result-bar"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="vote-count">
                        {count} vote{count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="poll-total-result">
                <strong>{totalVotes}</strong> total vote
                {totalVotes !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
