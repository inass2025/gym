import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  BookOpen,
  CreditCard,
  Wallet,
  LogOut,
  Dumbbell,
} from 'lucide-react';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: 'dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard'   },
  { to: 'coaches',     icon: <UserCircle size={18} />,      label: 'Coachs'       },
  { to: 'Adherent',    icon: <Users size={18} />,           label: 'Membres'      },
  { to: 'cours',       icon: <BookOpen size={18} />,        label: 'Cours'        },
  { to: 'abonnements', icon: <CreditCard size={18} />,      label: 'Abonnements'  },
  { to: 'paiements',   icon: <Wallet size={18} />,          label: 'Paiements'    },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const fresh = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(prev =>
        prev.photo !== fresh.photo || prev.nom !== fresh.nom ? fresh : prev
      );
    }, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const photo = user.photo ? `http://localhost:8000/storage/${user.photo}` : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="cl-root">

      {/* ── SIDEBAR ── */}
      <aside className="cl-sidebar">

        {/* Logo */}
        <div className="cl-sidebar__logo">
          <div className="cl-logo-icon">
            <Dumbbell size={20} />
          </div>
          <div className="cl-logo-text">
            <span className="cl-logo-name">GymMaster</span>
            <span className="cl-logo-role">Admin Panel</span>
          </div>
        </div>

        {/* Profile card */}
        <div className="cl-sidebar__profile-card">
          <div className="cl-avatar">
            {photo ? (
              <img src={photo} alt="profil" />
            ) : user.prenom ? (
              user.prenom[0].toUpperCase()
            ) : (
              'A'
            )}
          </div>
          <p className="cl-profile-name">
            {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : 'Admin'}
          </p>
          <span className="cl-profile-badge">Admin</span>
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
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="cl-sidebar__bottom">
          <button className="cl-sidebar__logout" onClick={handleLogout}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── RIGHT COLUMN ── */}
      <div className="cl-body">

        {/* TOP NAVBAR */}
        <header className="cl-navbar">
          <div className="cl-navbar__left">
            <div className="cl-breadcrumb">
              <span className="cl-breadcrumb__gym">GymMaster</span>
              <span className="cl-breadcrumb__sep">/</span>
              <span className="cl-breadcrumb__page">Dashboard</span>
            </div>
          </div>
          <div className="cl-navbar__right">
            <div className="cl-navbar__avatar">
              {photo ? (
                <img src={photo} alt="profil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : user.prenom ? (
                user.prenom[0].toUpperCase()
              ) : (
                'A'
              )}
            </div>
          </div>
        </header>

        {/* OUTLET */}
        <main className="cl-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}