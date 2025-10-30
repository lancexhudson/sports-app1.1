// src/components/Header.js

// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo */}
        <NavLink to="/" className="header-logo">
          <FontAwesomeIcon icon={faTrophy} className="header-icon" />
          <span>OVERTIME</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="header-nav desktop-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/scores"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
            end
          >
            Scores
          </NavLink>
          <NavLink
            to="/social"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
            end
          >
            Social
          </NavLink>
          <NavLink
            to="/standings"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
            end
          >
            Standings
          </NavLink>
          <NavLink
            to="/polls"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
            end
          >
            Polls
          </NavLink>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Menu – Below Logo */}
      {mobileOpen && (
        <nav className="mobile-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/scores"
            className={({ isActive }) =>
              `mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
            end
          >
            Scores
          </NavLink>
          <NavLink
            to="/social"
            className={({ isActive }) =>
              `mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
            end
          >
            Social
          </NavLink>
          <NavLink
            to="/standings"
            className={({ isActive }) =>
              `mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
            end
          >
            Standings
          </NavLink>
          <NavLink
            to="/polls"
            className={({ isActive }) =>
              `mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
            end
          >
            Polls
          </NavLink>
        </nav>
      )}
    </header>
  );
}

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrophy } from '@fortawesome/free-solid-svg-icons';

// export default function Header() {
//   return (
//     <header className="app-header">
//       <div className="header-container">
//         {/* Logo */}
//         <NavLink to="/" className="header-logo">
//           <FontAwesomeIcon icon={faTrophy} className="header-icon" />
//           <span>OVERTIME</span>
//         </NavLink>

//         {/* Global navigation – always visible */}
//         <nav className="header-nav">
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               `header-link ${isActive ? 'active' : ''}`
//             }
//             end
//           >
//             Home
//           </NavLink>

//           <NavLink
//             to="/scores"
//             className={({ isActive }) =>
//               `header-link ${isActive ? 'active' : ''}`
//             }
//             end
//           >
//             Scores
//           </NavLink>

//           <NavLink
//             to="/social"
//             className={({ isActive }) =>
//               `header-link ${isActive ? 'active' : ''}`
//             }
//             end
//           >
//             Social
//           </NavLink>

//           <NavLink
//             to="/standings"
//             className={({ isActive }) =>
//               `header-link ${isActive ? 'active' : ''}`
//             }
//             end
//           >
//             Standings
//           </NavLink>

//           <NavLink
//             to="/polls"
//             className={({ isActive }) =>
//               `header-link ${isActive ? 'active' : ''}`
//             }
//             end
//           >
//             Polls
//           </NavLink>
//         </nav>
//       </div>
//     </header>
//   );
// }
