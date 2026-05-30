import { NavLink, useNavigate } from 'react-router-dom';
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
    { to: '/adherent/coach', icon: <User size={18} />, label: 'Profil' },
    { to: '/adherent/performances', icon: <BarChart2 size={18} />, label: 'Performances' },
    { to: '/adherent/MesAbonnements', icon: <Wallet size={18} />, label: 'Mes Abonnements' },
    { to: '/adherent/chat', icon: <MessageSquare size={18} />, label: 'Chat' },
    { to: '/adherent/MonProgramme', icon: <Dumbbell size={18} />, label: 'Mon Programme' },
  ];

  return (
    <aside className="ad-sidebar">

      {/* LOGO */}
      <div className="ad-sidebar__logo">
        <span className="logo-name">GYMMASTER</span>
        <span className="logo-sub">ESPACE ADHÉRENT</span>
      </div>

      {/* NAV */}
      <nav className="ad-sidebar__nav">

        <p className="ad-sidebar__label">PRINCIPAL</p>
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

        <p className="ad-sidebar__label">ACTIVITÉS</p>
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