// src/components/SubHeader.js
import { NavLink, useParams, useLocation } from 'react-router-dom';

const tabs = [
  { id: 'featured', label: 'Featured' },
  { id: 'scores', label: 'Scores' },
  { id: 'social', label: 'Social' },
  { id: 'polls', label: 'Polls' },
];

const DEFAULT_SPORT = 'baseball'; // Change if you want another default

export default function SubHeader() {
  const { sportId } = useParams();
  const location = useLocation();

  // Determine base path for links
  const isHome = location.pathname === '/';
  const basePath = isHome
    ? `/${DEFAULT_SPORT}`
    : `/${sportId || DEFAULT_SPORT}`;

  return (
    <nav className="sticky-subheader">
      <div className="subheader-scroll-container">
        <div className="subheader-nav">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={`${basePath}/${tab.id}`}
              className={({ isActive }) =>
                `subheader-link ${isActive ? 'active' : ''}`
              }
              end
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
