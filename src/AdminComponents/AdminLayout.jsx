import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const NAV_ITEMS = [
  
  { to: 'coaches',      label: 'Coachs'       },
  { to: 'Adherent',      label: 'Membres'      },
  { to: 'cours',     label: 'cours'     },
  { to: 'programs',   label: 'Programmes'   },
  { to: 'reports',      label: 'Rapports'     },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="cl-root">

      {/* ── SIDEBAR ── */}
      <aside className="cl-sidebar">
        {/* Logo */}
        <div className="cl-sidebar__logo">
        
          <div className="cl-logo-text">
            <span className="cl-logo-name">GymMaster</span>
            <span className="cl-logo-role">Admin Panel</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="cl-sidebar__nav">
          <p className="cl-nav-section">Principal</p>
          {NAV_ITEMS.slice(0, 3).map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'cl-nav-item' + (isActive ? ' cl-nav-item--active' : '')
              }
            >
              <span className="cl-nav-icon">{icon}</span>
              <span className="cl-nav-label">{label}</span>
              <span className="cl-nav-indicator" />
            </NavLink>
          ))}

          <p className="cl-nav-section">Gestion</p>
          {NAV_ITEMS.slice(3).map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'cl-nav-item' + (isActive ? ' cl-nav-item--active' : '')
              }
            >
              <span className="cl-nav-icon">{icon}</span>
              <span className="cl-nav-label">{label}</span>
              <span className="cl-nav-indicator" />
            </NavLink>
          ))}
        </nav>

        {/* Bottom: profile + logout */}
        <div className="cl-sidebar__bottom">
          <div className="cl-sidebar__profile">
            <div className="cl-avatar">AK</div>
            <div className="cl-profile-info">
              <span className="cl-profile-name">Admin Karim</span>
              <span className="cl-profile-email">admin@gympro.ma</span>
            </div>
          </div>
          <button
            className="cl-sidebar__logout"
            onClick={() => navigate('/login')}
            title="Déconnexion"
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* ── RIGHT COLUMN ── */}
      <div className="cl-body">

        {/* TOP NAVBAR */}
        <header className="cl-navbar">
          <div className="cl-navbar__left">
            <div className="cl-breadcrumb">
              <span className="cl-breadcrumb__gym">GymPro</span>
              <span className="cl-breadcrumb__sep">/</span>
              <span className="cl-breadcrumb__page" id="cl-page-title">Dashboard</span>
            </div>
          </div>
          <div className="cl-navbar__right">
            <div className="cl-search">
              <span className="cl-search__icon">🔍</span>
              <input
                className="cl-search__input"
                type="text"
                placeholder="Rechercher..."
              />
            </div>
            <button className="cl-navbar__notif" title="Notifications">
              🔔
              <span className="cl-notif-dot" />
            </button>
            <div className="cl-navbar__avatar">AK</div>
          </div>
        </header>

        {/* OUTLET — content zone */}
        <main className="cl-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}