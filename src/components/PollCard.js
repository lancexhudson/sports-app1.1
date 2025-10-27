// src/components/PollCard.js
import React, { useState, useEffect } from 'react';
import { POLLS_DATA } from '../data/polls';

const PollCard = () => {
  const [votes, setVotes] = useState({});
  const [showThanks, setShowThanks] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const visiblePolls = expanded ? POLLS_DATA : POLLS_DATA.slice(0, 2);

  useEffect(() => {
    const loadedVotes = {};
    POLLS_DATA.forEach((poll) => {
      const saved = localStorage.getItem(`demo-poll-votes-${poll.id}`);
      loadedVotes[poll.id] = saved
        ? JSON.parse(saved)
        : poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {});
    });
    setVotes(loadedVotes);
  }, []);

  useEffect(() => {
    Object.keys(votes).forEach((pollId) => {
      localStorage.setItem(
        `demo-poll-votes-${pollId}`,
        JSON.stringify(votes[pollId])
      );
    });
  }, [votes]);

  const handleVote = (pollId, optionId) => {
    setVotes((prev) => ({
      ...prev,
      [pollId]: {
        ...(prev[pollId] || {}),
        [optionId]: (prev[pollId]?.[optionId] || 0) + 1,
      },
    }));
    setShowThanks(pollId);
    setTimeout(() => setShowThanks(null), 1800);
  };

  return (
    <div className="poll-card">
      <h3 className="poll-title">Fan Polls</h3>
      <div className="polls-list">
        {visiblePolls.map((poll) => {
          const pollVotes = votes[poll.id] || {};
          const totalVotes = Object.values(pollVotes).reduce(
            (a, b) => a + b,
            0
          );
          const safeTotal = totalVotes > 0 ? totalVotes : 1;

          return (
            <div key={poll.id} className="poll-item">
              <h4 className="poll-question">{poll.question}</h4>
              <div className="poll-options">
                {poll.options.map((opt) => {
                  const percentage = Math.round(
                    ((pollVotes[opt.id] || 0) / safeTotal) * 100
                  );
                  return (
                    <div
                      key={opt.id}
                      className="poll-option clickable"
                      onClick={() => handleVote(poll.id, opt.id)}
                    >
                      <div className="poll-label-above">
                        <span className="option-text">{opt.text}</span>
                        <span className="poll-pct-above">{percentage}%</span>
                      </div>
                      <div className="poll-bar-bg">
                        <div
                          className="poll-bar"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="vote-hint">Click to vote</span>
                    </div>
                  );
                })}
              </div>
              <div className="poll-total">
                {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
              </div>
              {showThanks === poll.id && (
                <div className="thank-you-popup">Thanks! Vote again!</div>
              )}
            </div>
          );
        })}
      </div>

      {POLLS_DATA.length > 2 && (
        <div className="poll-expand-container">
          <button
            onClick={() => setExpanded(!expanded)}
            className="poll-expand-btn"
          >
            {expanded ? 'Show less' : 'View all polls'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PollCard;

// // src/components/PollCard.js
// import React, { useState, useEffect } from 'react';

// const PollCard = ({ polls = [] }) => {
//   const [votes, setVotes] = useState({});
//   const [showThanks, setShowThanks] = useState(null);
//   const [expanded, setExpanded] = useState(false);

//   // Only show 2 polls by default
//   const visiblePolls = expanded ? polls : polls.slice(0, 2);

//   // Load votes from localStorage
//   useEffect(() => {
//     if (!Array.isArray(polls) || polls.length === 0) return;

//     const loadedVotes = {};
//     polls.forEach((poll) => {
//       const saved = localStorage.getItem(`demo-poll-votes-${poll.id}`);
//       loadedVotes[poll.id] = saved
//         ? JSON.parse(saved)
//         : poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {});
//     });
//     setVotes(loadedVotes);
//   }, [polls]);

//   // Save votes to localStorage
//   useEffect(() => {
//     Object.keys(votes).forEach((pollId) => {
//       localStorage.setItem(
//         `demo-poll-votes-${pollId}`,
//         JSON.stringify(votes[pollId])
//       );
//     });
//   }, [votes]);

//   const handleVote = (pollId, optionId) => {
//     setVotes((prev) => ({
//       ...prev,
//       [pollId]: {
//         ...(prev[pollId] || {}),
//         [optionId]: (prev[pollId]?.[optionId] || 0) + 1,
//       },
//     }));

//     setShowThanks(pollId);
//     setTimeout(() => setShowThanks(null), 1800);
//   };

//   return (
//     <div className="poll-card">
//       <h3 className="poll-title">Fan Polls</h3>

//       <div className="polls-list">
//         {visiblePolls.length === 0 ? (
//           <p style={{ color: '#aaa', textAlign: 'center' }}>
//             No polls available
//           </p>
//         ) : (
//           visiblePolls.map((poll) => {
//             const pollVotes = votes[poll.id] || {};
//             const totalVotes = Object.values(pollVotes).reduce(
//               (a, b) => a + b,
//               0
//             );
//             const safeTotal = totalVotes > 0 ? totalVotes : 1;

//             return (
//               <div key={poll.id} className="poll-item">
//                 <h4 className="poll-question">{poll.question}</h4>
//                 <div className="poll-options">
//                   {poll.options.map((opt) => {
//                     const percentage = Math.round(
//                       ((pollVotes[opt.id] || 0) / safeTotal) * 100
//                     );

//                     return (
//                       <div
//                         key={opt.id}
//                         className="poll-option clickable"
//                         onClick={() => handleVote(poll.id, opt.id)}
//                       >
//                         <div className="poll-label-above">
//                           <span className="option-text">{opt.text}</span>
//                           <span className="poll-pct-above">{percentage}%</span>
//                         </div>

//                         <div className="poll-bar-bg">
//                           <div
//                             className="poll-bar"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>

//                         <span className="vote-hint">Click to vote</span>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="poll-total">
//                   {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
//                 </div>

//                 {showThanks === poll.id && (
//                   <div className="thank-you-popup">Thanks! Vote again!</div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Expand/Collapse Button */}
//       {polls.length > 2 && (
//         <div className="poll-expand-container">
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="poll-expand-btn"
//           >
//             {expanded ? 'Show less' : 'View all polls'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PollCard;

// // src/components/PollCard.js
// import React, { useState, useEffect } from 'react';

// const PollCard = ({ polls = [] }) => {
//   const [votes, setVotes] = useState({});
//   const [showThanks, setShowThanks] = useState(null); // ← Tracks which poll shows popup

//   // Load votes from localStorage
//   useEffect(() => {
//     if (!Array.isArray(polls) || polls.length === 0) return;

//     const loadedVotes = {};
//     polls.forEach((poll) => {
//       const saved = localStorage.getItem(`demo-poll-votes-${poll.id}`);
//       loadedVotes[poll.id] = saved
//         ? JSON.parse(saved)
//         : poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {});
//     });
//     setVotes(loadedVotes);
//   }, [polls]);

//   // Save votes to localStorage
//   useEffect(() => {
//     Object.keys(votes).forEach((pollId) => {
//       localStorage.setItem(
//         `demo-poll-votes-${pollId}`,
//         JSON.stringify(votes[pollId])
//       );
//     });
//   }, [votes]);

//   const handleVote = (pollId, optionId) => {
//     setVotes((prev) => ({
//       ...prev,
//       [pollId]: {
//         ...(prev[pollId] || {}),
//         [optionId]: (prev[pollId]?.[optionId] || 0) + 1,
//       },
//     }));

//     // Show popup for this poll
//     setShowThanks(pollId);
//     setTimeout(() => setShowThanks(null), 1800);
//   };

//   return (
//     <div className="poll-card">
//       <h3 className="poll-title">Fan Polls</h3>
//       <div className="polls-list">
//         {polls.length === 0 ? (
//           <p style={{ color: '#aaa', textAlign: 'center' }}>
//             No polls available
//           </p>
//         ) : (
//           polls.map((poll) => {
//             const pollVotes = votes[poll.id] || {};
//             const totalVotes = Object.values(pollVotes).reduce(
//               (a, b) => a + b,
//               0
//             );
//             const safeTotal = totalVotes > 0 ? totalVotes : 1;

//             return (
//               <div key={poll.id} className="poll-item">
//                 <h4 className="poll-question">{poll.question}</h4>
//                 <div className="poll-options">
//                   {poll.options.map((opt) => {
//                     const percentage = Math.round(
//                       ((pollVotes[opt.id] || 0) / safeTotal) * 100
//                     );

//                     return (
//                       <div
//                         key={opt.id}
//                         className="poll-option clickable"
//                         onClick={() => handleVote(poll.id, opt.id)}
//                       >
//                         {/* Text + % above bar */}
//                         <div className="poll-label-above">
//                           <span className="option-text">{opt.text}</span>
//                           <span className="poll-pct-above">{percentage}%</span>
//                         </div>

//                         {/* Progress bar */}
//                         <div className="poll-bar-bg">
//                           <div
//                             className="poll-bar"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>

//                         {/* Click hint */}
//                         <span className="vote-hint">Click to vote</span>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Total votes */}
//                 <div className="poll-total">
//                   {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
//                 </div>

//                 {/* THANK YOU POPUP – RESTORED */}
//                 {showThanks === poll.id && (
//                   <div className="thank-you-popup">Thanks for you vote!</div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };
// export default PollCard;

// The code below is more ideal for production - allows just one vote per poll
// import React, { useState, useEffect } from 'react';

// const PollCard = ({ polls = [] }) => {
//   const [votes, setVotes] = useState({}); // { pollId: { optionId: count } }
//   const [votedPolls, setVotedPolls] = useState(new Set()); // Tracks if THIS user voted
//   const [showThanks, setShowThanks] = useState(null);

//   // Load vote counts from localStorage
//   useEffect(() => {
//     if (!Array.isArray(polls) || polls.length === 0) return;

//     const loadedVotes = {};
//     const alreadyVoted = new Set();

//     polls.forEach((poll) => {
//       const savedVotes = localStorage.getItem(`poll-votes-${poll.id}`);
//       const savedUserVote = localStorage.getItem(`user-voted-${poll.id}`);

//       loadedVotes[poll.id] = savedVotes
//         ? JSON.parse(savedVotes)
//         : poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {});

//       if (savedUserVote) alreadyVoted.add(poll.id);
//     });

//     setVotes(loadedVotes);
//     setVotedPolls(alreadyVoted);
//   }, [polls]);

//   // Save vote counts to localStorage
//   useEffect(() => {
//     Object.keys(votes).forEach((pollId) => {
//       localStorage.setItem(
//         `poll-votes-${pollId}`,
//         JSON.stringify(votes[pollId])
//       );
//     });
//   }, [votes]);

//   const handleVote = (pollId, optionId) => {
//     if (votedPolls.has(pollId)) {
//       console.log(`Already voted on poll ${pollId}`);
//       return;
//     }

//     setVotes((prev) => ({
//       ...prev,
//       [pollId]: {
//         ...(prev[pollId] || {}),
//         [optionId]: (prev[pollId]?.[optionId] || 0) + 1,
//       },
//     }));

//     setVotedPolls((prev) => new Set(prev).add(pollId));
//     localStorage.setItem(`user-voted-${pollId}`, 'true');

//     setShowThanks(pollId);
//     setTimeout(() => setShowThanks(null), 2000);
//   };

//   return (
//     <div className="poll-card">
//       <h3 className="poll-title">Fan Polls</h3>
//       <div className="polls-list">
//         {polls.length === 0 ? (
//           <p style={{ color: '#aaa', textAlign: 'center' }}>
//             No polls available
//           </p>
//         ) : (
//           polls.map((poll) => {
//             const pollVotes = votes[poll.id] || {};
//             const totalVotes = Object.values(pollVotes).reduce(
//               (a, b) => a + b,
//               0
//             );
//             const safeTotal = totalVotes > 0 ? totalVotes : 1;
//             const userVotedOption = Object.keys(pollVotes).find(
//               (id) => pollVotes[id] > 0 && votedPolls.has(poll.id)
//             );
//             const hasUserVoted = votedPolls.has(poll.id);

//             return (
//               <div key={poll.id} className="poll-item">
//                 <h4 className="poll-question">{poll.question}</h4>
//                 <div className="poll-options">
//                   {poll.options.map((opt) => {
//                     const percentage = Math.round(
//                       ((pollVotes[opt.id] || 0) / safeTotal) * 100
//                     );
//                     const isUserVote = userVotedOption === opt.id;

//                     return (
//                       <div
//                         key={opt.id}
//                         className={`poll-option ${isUserVote ? 'voted' : ''} ${
//                           !hasUserVoted ? 'clickable' : ''
//                         }`}
//                         onClick={() =>
//                           !hasUserVoted && handleVote(poll.id, opt.id)
//                         }
//                       >
//                         <div className="poll-label">
//                           <span>{opt.text}</span>
//                           <span className="poll-pct">{percentage}%</span>
//                           {!hasUserVoted && (
//                             <span className="vote-text">Click to vote</span>
//                           )}
//                         </div>
//                         <div className="poll-bar-bg">
//                           <div
//                             className="poll-bar"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>
//                         {isUserVote && (
//                           <span className="your-vote">Your vote</span>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <div className="poll-total">
//                   {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
//                 </div>

//                 {showThanks === poll.id && (
//                   <div className="thank-you-popup">Thank you for voting!</div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default PollCard;
