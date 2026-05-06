import { useState, useEffect } from 'react';
import api from '../../Api/Axios.js';
import './CoachParticipants.css';

export default function CoachParticipants() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cours, setCours] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/cours').then(res => {
      const mesCours = res.data.filter(c => c.coach_id === user.id);
      setCours(mesCours);
    }).catch(() => {});
  }, []);

  const handleSelectCours = async (cours) => {
    setSelectedCours(cours);
    setLoading(true);
    try {
      const res = await api.get(`/api/reservation`);
      const reservationsDuCours = res.data.filter(r => r.cours_id === cours.id);
      setParticipants(reservationsDuCours);
    } catch (err) {
      setParticipants([]);
    }
    setLoading(false);
  };

  return (
    <div className="coach-participants">
      <div className="coach-participants__header">
        <h1>Mes <span>Participants</span></h1>
        <p>Consultez la liste des participants à vos cours</p>
      </div>

      <div className="coach-participants__content">
        {/* Liste des cours - gauche */}
        <div className="cours-list">
          <h3>Mes Cours</h3>
          {cours.length === 0 ? (
            <p className="empty-text">Aucun cours disponible</p>
          ) : (
            cours.map(c => (
              <div
                key={c.id}
                className={`cours-item ${selectedCours?.id === c.id ? 'active' : ''}`}
                onClick={() => handleSelectCours(c)}
              >
                <div className="cours-item__info">
                  <h4>{c.nom}</h4>
                  <span>{c.niveau}</span>
                </div>
                <span className="cours-item__arrow">→</span>
              </div>
            ))
          )}
        </div>

        {/* Participants - droite */}
        <div className="participants-panel">
          {!selectedCours ? (
            <div className="empty-state">
              <p>👈 Sélectionnez un cours</p>
              <span>pour voir les participants</span>
            </div>
          ) : loading ? (
            <div className="empty-state">
              <p>Chargement...</p>
            </div>
          ) : (
            <>
              <div className="participants-panel__header">
                <h3>{selectedCours.nom}</h3>
                <span className="badge">{participants.length} participant(s)</span>
              </div>

              {participants.length === 0 ? (
                <div className="empty-state">
                  <p>👥 Aucun participant</p>
                  <span>Personne n'a encore réservé ce cours</span>
                </div>
              ) : (
                <div className="participants-list">
                  {participants.map((r, i) => (
                    <div key={r.id} className="participant-card">
                      <div className="participant-card__avatar">
                        {r.adherent?.prenom ? r.adherent.prenom[0].toUpperCase() : '?'}
                      </div>
                      <div className="participant-card__info">
                        <h4>{r.adherent?.prenom} {r.adherent?.nom}</h4>
                        <p>{r.adherent?.email}</p>
                      </div>
                      <span className="participant-card__status">✓ Réservé</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}