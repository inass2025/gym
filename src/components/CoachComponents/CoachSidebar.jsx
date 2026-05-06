import { NavLink, useNavigate } from 'react-router-dom';
import './CoachSidebar.css';

export default function CoachSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <aside className="coach-sidebar">
      <div className="coach-sidebar__logo">
        <span>● GEM</span>
      </div>

      <div className="coach-sidebar__profile">
        <div className="coach-sidebar__avatar">
          {user.prenom ? user.prenom[0].toUpperCase() : 'C'}
        </div>
        <p className="coach-sidebar__name">{user.prenom} {user.nom}</p>
        <span className="coach-sidebar__badge">Coach</span>
      </div>

      <nav className="coach-sidebar__nav">
        <p className="coach-sidebar__section">NAVIGATION</p>
        <NavLink to="/coach" end className={({isActive}) => isActive ? 'active' : ''}>
          ⚡ Dashboard
        </NavLink>
        <NavLink to="/coach/profil" className={({isActive}) => isActive ? 'active' : ''}>
          ◆ Profil
        </NavLink>
        <NavLink to="/coach/programmes" className={({isActive}) => isActive ? 'active' : ''}>
          📋 Programmes
        </NavLink>
        <NavLink to="/coach/participants" className={({isActive}) => isActive ? 'active' : ''}>
          👥 Participants
        </NavLink>
      </nav>

      <button className="coach-sidebar__logout" onClick={handleLogout}>
        ↩ Déconnexion
      </button>
    </aside>
  );
}