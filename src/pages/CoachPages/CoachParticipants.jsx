import { useState, useEffect } from 'react';
import api from '../../Api/Axios.js';
import './CoachParticipants.css';

export default function CoachParticipants() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cours, setCours] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showProgForm, setShowProgForm] = useState(false);
const [selectedAdherent, setSelectedAdherent] = useState(null);
const [progForm, setProgForm] = useState({
  titre: '', jour: 'Lundi', exercices: '', conseil: ''
});
const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

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


  const handleAssignerProg = async () => {
  try {
    await api.post('/api/programmes', {
      ...progForm,
      adherent_id: selectedAdherent.id
    });
    alert(`Programme assigné à ${selectedAdherent.prenom} ✅`);
    setShowProgForm(false);
    setProgForm({ titre: '', jour: 'Lundi', exercices: '', conseil: '' });
    setSelectedAdherent(null);
  } catch (err) {
    console.log(err.response?.data);
    alert(JSON.stringify(err.response?.data));
  }
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
  <div style={{display:'flex', gap:8, alignItems:'center'}}>
    <span className="participant-card__status">✓ Réservé</span>
    <button className="btn-add" style={{fontSize:'12px', padding:'6px 12px'}}
      onClick={() => { setSelectedAdherent(r.adherent); setShowProgForm(true); }}>
      🏋️ Programme
    </button>
  </div>
</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showProgForm && selectedAdherent && (
  <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div className="coach-programmes__form" style={{width:'500px', maxHeight:'80vh', overflowY:'auto'}}>
      <h3>Programme pour {selectedAdherent.prenom} {selectedAdherent.nom}</h3>
      <div className="form-grid">
        <div className="form-field">
          <label>TITRE</label>
          <input placeholder="Ex: Pectoraux & Triceps" value={progForm.titre}
            onChange={e => setProgForm({...progForm, titre: e.target.value})} />
        </div>
        <div className="form-field">
          <label>JOUR</label>
          <select value={progForm.jour} onChange={e => setProgForm({...progForm, jour: e.target.value})}>
            {jours.map(j => <option key={j}>{j}</option>)}
          </select>
        </div>
        <div className="form-field" style={{gridColumn:'1 / -1'}}>
          <label>EXERCICES</label>
          <textarea placeholder="Ex: Squat 4x10, Presse 3x12..."
            value={progForm.exercices} onChange={e => setProgForm({...progForm, exercices: e.target.value})} />
        </div>
        <div className="form-field" style={{gridColumn:'1 / -1'}}>
          <label>CONSEIL</label>
          <textarea placeholder="Conseils personnalisés..."
            value={progForm.conseil} onChange={e => setProgForm({...progForm, conseil: e.target.value})} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-save" onClick={handleAssignerProg}>💾 Assigner</button>
        <button className="btn-cancel" onClick={() => { setShowProgForm(false); setSelectedAdherent(null); }}>✕ Annuler</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}