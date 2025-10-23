// src/components/Header.js
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { sportId = 'baseball' } = useParams();
  const isHome = !sportId || sportId === '/';

  return (
    <header className="app-header">
      <div className="header-container">
        <NavLink to="/" className="header-logo">
          <FontAwesomeIcon icon={faTrophy} className="header-icon" />
          <span>OVERTIME</span>
        </NavLink>
        {!isHome && (
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
              to={`/${sportId}/standings`}
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
