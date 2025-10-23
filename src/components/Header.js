// src/components/Header.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname || '/';
  const segments = pathname.split('/').filter(Boolean);
  const currentSportId = segments[0];
  const isSportPage = !!currentSportId && currentSportId !== 'standings';
  const sportId = isSportPage ? currentSportId : 'baseball';
  const isHome = pathname === '/';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo with Trophy Icon */}
        <NavLink to="/" className="header-logo">
          <FontAwesomeIcon icon={faTrophy} className="header-icon" />
          <span>OVERTIME</span>
        </NavLink>

        {/* Text Links – Only on sport pages */}
        {isSportPage && (
          <nav className="header-nav">
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
              to={`/${sportId}/scores`}
              className={({ isActive }) =>
                `header-link ${isActive ? 'active' : ''}`
              }
              end
            >
              Scores
            </NavLink>
            <NavLink
              to={`/${sportId}/social`}
              className={({ isActive }) =>
                `header-link ${isActive ? 'active' : ''}`
              }
              end
            >
              Social
            </NavLink>
            <NavLink
              to={`/${sportId}/polls`}
              className={({ isActive }) =>
                `header-link ${isActive ? 'active' : ''}`
              }
              end
            >
              Polls
            </NavLink>
            <NavLink
              to={`/standings`}
              className={({ isActive }) =>
                `header-link ${isActive ? 'active' : ''}`
              }
              end
            >
              Standings
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
