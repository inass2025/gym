import { useEffect, useState } from 'react';
import api from '../../Api/Axios.js';
import './CoachDashboard.css';

export default function CoachDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({
    cours: 0,
    participants: 0,
    reservations: 0,
  });

  useEffect(() => {
    api.get('/api/cours').then(res => {
      const mesCours = res.data.filter(c => c.coach_id === user.id);
      const mesCoursIds = mesCours.map(c => c.id);
      setStats(s => ({ ...s, cours: mesCours.length }));

      // Fetch reservations o filter seulement ceux dyal mes cours
      api.get('/api/reservation').then(res2 => {
        const mesReservations = res2.data.filter(r => mesCoursIds.includes(r.cours_id));
        
        // Participants uniques (par adherent_id)
        const participantsUniques = new Set(mesReservations.map(r => r.adherent_id)).size;

        setStats(s => ({
          ...s,
          reservations: mesReservations.length,
          participants: participantsUniques,
        }));
      }).catch(() => {});

    }).catch(() => {});
  }, []);

  return (
    <div className="coach-dashboard">
      <div className="coach-dashboard__header">
        <h1>Bonjour, <span>{user.prenom} {user.nom}</span> 👋</h1>
        <p>Voici un aperçu de votre activité</p>
      </div>

      <div className="coach-dashboard__cards">
        <div className="dash-card">
          <span className="dash-card__icon">📋</span>
          <div>
            <p className="dash-card__label">Mes Cours</p>
            <h2 className="dash-card__value">{stats.cours}</h2>
          </div>
        </div>
        <div className="dash-card">
          <span className="dash-card__icon">👥</span>
          <div>
            <p className="dash-card__label">Participants</p>
            <h2 className="dash-card__value">{stats.participants}</h2>
          </div>
        </div>
        <div className="dash-card">
          <span className="dash-card__icon">📅</span>
          <div>
            <p className="dash-card__label">Réservations</p>
            <h2 className="dash-card__value">{stats.reservations}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}