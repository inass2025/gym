import { NavLink, useNavigate } from 'react-router-dom';
import './AdherentSidebar.css';

export default function AdherentSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = (user.prenom?.[0] || 'Y') + (user.nom?.[0] || 'B');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

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
        <NavLink to="/adherent" end className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon">▦</span> Dashboard
        </NavLink>
        <NavLink to="/adherent/Abonnement" className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon">▬</span> Abonnement
        </NavLink>

        <p className="ad-sidebar__label">ACTIVITÉS</p>
        <NavLink to="/adherent/MyReservations" className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon">▤</span> Mes Réservations
        </NavLink>
        <NavLink to="/adherent/coach" className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon">◈</span> Profile
        </NavLink>
        <NavLink to="/adherent/performances" className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon">📊 </span> Performances
        </NavLink>
           <NavLink to="/adherent/MesAbonnements" className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon"> 

💳</span> Mes Abonnement
        </NavLink>
        <NavLink to="/adherent/chat" className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon">◈</span> chat
        </NavLink>
          <NavLink to="/adherent/MonProgramme" className={({ isActive }) => isActive ? 'ad-link active' : 'ad-link'}>
          <span className="ad-link__icon">

🏋️‍♀️</span> Mon Programme
        </NavLink>
          
        
       
      </nav>

      {/* USER + LOGOUT */}
      <div className="ad-sidebar__footer">
        <div className="ad-sidebar__user">
          <div className="ad-avatar">{initials.toUpperCase()}</div>
          <div className="ad-userinfo">
            <span className="ad-username">{user.prenom} {user.nom}</span>
            <span className="ad-userplan">Adhérent Annuel</span>
          </div>
          <button className="ad-dots" onClick={handleLogout} title="Déconnexion">
            ···
          </button>
        </div>
      </div>

    </aside>
  );
}