// src/components/Footer.js
import { NavLink } from 'react-router-dom';
import {
  FaBaseballBall,
  FaBasketballBall,
  FaFootballBall,
  FaFutbol,
  FaGolfBall,
} from 'react-icons/fa';

const sports = [
  { id: 'baseball', icon: FaBaseballBall, label: 'Baseball' },
  { id: 'basketball', icon: FaBasketballBall, label: 'Basketball' },
  { id: 'football', icon: FaFootballBall, label: 'Football' },
  { id: 'soccer', icon: FaFutbol, label: 'Soccer' },
  { id: 'golf', icon: FaGolfBall, label: 'Golf' },
];

export default function Footer() {
  return (
    <footer className="sticky-footer">
      <nav className="footer-nav container">
        {sports.map((sport) => {
          const Icon = sport.icon;
          return (
            <NavLink
              key={sport.id}
              to={`/${sport.id}`}
              className={({ isActive }) =>
                `footer-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="footer-icon">
                <Icon />
              </div>
              <span>{sport.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </footer>
  );
}
