import { useState } from 'react';
import api from '../../Api/Axios.js';
import './CoachProfil.css';

export default function CoachProfil() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    email: user.email || '',
    telephone: user.telephone || '',
    specialite: user.specialite || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/coach/${user.id}`, form);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="coach-profil">
      <div className="coach-profil__header">
        <h1>Mon <span>Profil</span></h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div className="coach-profil__content">
        {/* Carte gauche */}
        <div className="coach-profil__left">
          <div className="coach-profil__avatar">
            {user.prenom ? user.prenom[0].toUpperCase() : 'C'}
          </div>
          <h3>{user.prenom} {user.nom}</h3>
          <span className="coach-profil__badge">COACH</span>
          <p className="coach-profil__specialite">🏋️ {user.specialite || 'Spécialité non définie'}</p>
        </div>

        {/* Carte droite */}
        <div className="coach-profil__right">
          <div className="coach-profil__right-header">
            <h3>Informations personnelles</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-edit">✏️ Modifier</button>
            ) : (
              <div style={{display:'flex', gap:10}}>
                <button onClick={handleSave} className="btn-save">💾 Sauvegarder</button>
                <button onClick={() => setEditing(false)} className="btn-cancel">✕ Annuler</button>
              </div>
            )}
          </div>

          <div className="coach-profil__grid">
            <div className="coach-profil__field">
              <label>NOM</label>
              <input name="nom" value={form.nom} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="coach-profil__field">
              <label>PRÉNOM</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="coach-profil__field">
              <label>EMAIL</label>
              <input name="email" value={form.email} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="coach-profil__field">
              <label>TÉLÉPHONE</label>
              <input name="telephone" value={form.telephone} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="coach-profil__field" style={{gridColumn: '1 / -1'}}>
              <label>SPÉCIALITÉ</label>
              <input name="specialite" value={form.specialite} onChange={handleChange} disabled={!editing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}