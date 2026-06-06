import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CalendarCheck,
  User,
  BarChart2,
  Wallet,
  MessageSquare,
  Dumbbell,
  LogOut,
} from 'lucide-react';
import './AdherentSidebar.css';

export default function AdherentSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  // ── Live sync photo/nom comme CoachSidebar ─────────────────────────────
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const fresh = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(prev =>
        prev.photo !== fresh.photo || prev.nom !== fresh.nom
          ? fresh
          : prev
      );
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const photo = user.photo
    ? `http://localhost:8000/storage/${user.photo}`
    : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItems = [
    { to: '/adherent', end: true, icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/adherent/Abonnement', icon: <CreditCard size={18} />, label: 'Abonnement' },
  ];

  const activityItems = [
    { to: '/adherent/MyReservations', icon: <CalendarCheck size={18} />, label: 'Mes Réservations' },
    { to: '/adherent/coach',          icon: <User size={18} />,          label: 'Profil' },
    { to: '/adherent/performances',   icon: <BarChart2 size={18} />,     label: 'Performances' },
    { to: '/adherent/MesAbonnements', icon: <Wallet size={18} />,        label: 'Mes Abonnements' },
    { to: '/adherent/chat',           icon: <MessageSquare size={18} />, label: 'Chat' },
    { to: '/adherent/MonProgramme',   icon: <Dumbbell size={18} />,      label: 'Mon Programme' },
  ];

  return (
    <aside className="ad-sidebar">

      {/* LOGO */}
      <div className="ad-sidebar__logo">
        <div className="sidebar-icon"><Dumbbell size={20} /></div>
        <span>GymMaster</span>
      </div>

      {/* PROFILE ── nouveau bloc copié du CoachSidebar */}
      <div className="coach-sidebar__profile">
        <div className="coach-sidebar__avatar">
          {photo ? (
            <img src={photo} alt="profil" />
          ) : user.prenom ? (
            user.prenom[0].toUpperCase()
          ) : (
            'A'
          )}
        </div>
        <p className="coach-sidebar__name">
          {user.prenom} {user.nom}
        </p>
        <span className="coach-sidebar__badge">Adhérent</span>
      </div>

      {/* NAV */}
      <nav className="ad-sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}
          >
            <span className="ad-link__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        {activityItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}
          >
            <span className="ad-link__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="ad-sidebar__logout" onClick={handleLogout}>
        <LogOut size={16} />
        Déconnexion
      </button>

    </aside>
  );
}