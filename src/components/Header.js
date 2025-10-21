// src/components/Header.js
import { NavLink, useParams } from 'react-router-dom';
import StadiumIcon from './StadiumIcon';

import {
  // eslint-disable-next-line
  FiHome,
  FiRss,
  FiTrendingUp,
  FiTwitter,
  FiBarChart2,
} from 'react-icons/fi';
import './Header.css'; // We'll create this next

const tabs = [
  { id: 'featured', label: 'Featured', icon: FiRss },
  { id: 'scores', label: 'Scores', icon: FiTrendingUp },
  { id: 'social', label: 'Social', icon: FiTwitter },
  { id: 'polls', label: 'Polls', icon: FiBarChart2 },
];

export default function Header() {
  const { sportId = 'baseball' } = useParams(); // Default to baseball
  const isHome = !sportId || sportId === '/';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo / Home */}
        <NavLink to="/" className="header-logo">
          <i className="fa-solid fa-stadium" aria-hidden="true"></i>{' '}
          <StadiumIcon size={24} />
          <span>OVERTIME</span>
        </NavLink>

        {/* Tab Icons – Only show on sport pages */}
        {!isHome && (
          <nav className="header-tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <NavLink
                key={id}
                to={`/${sportId}/${id}`}
                className={({ isActive }) =>
                  `header-tab ${isActive ? 'active' : ''}`
                }
                title={label}
                end
              >
                <Icon size={20} />
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
