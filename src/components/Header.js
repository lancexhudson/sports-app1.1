// src/components/Header.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo */}
        <NavLink to="/" className="header-logo">
          <FontAwesomeIcon icon={faTrophy} className="header-icon" />
          <span>OVERTIME</span>
        </NavLink>

        {/* Global navigation – always visible */}
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
      </div>
    </header>
  );
}
