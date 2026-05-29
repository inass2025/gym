import { useState, useEffect } from 'react';
import api from '../../Api/Axios.js';
import './CoachProgrammes.css';

export default function CoachProgrammes() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cours, setCours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '', description: '', duree: '', niveau: 'Débutant',
    date: '', heur: '', capacite: '', salle: ''
  });

  const [editingCours, setEditingCours] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    api.get('/api/cours').then(res => {
      const mesCours = res.data.filter(c => c.coach_id === user.id);
      setCours(mesCours);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const payload = {
        nom:         form.nom,
        description: form.description,
        duree:       form.duree,
        niveau:      form.niveau,
        date:        form.date,
        heur:        form.heur,
        capacite:    form.capacite,
        salle:       form.salle,
        coach_id:    user.id,
      };
      const res = await api.post('/api/cours', payload);
      setCours([...cours, res.data]);
      setShowForm(false);
      setForm({ nom: '', description: '', duree: '', niveau: 'Débutant', date: '', heur: '', capacite: '', salle: '' });
    } catch (err) {
      console.log('Erreur détails:', err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/cours/${id}`);
      setCours(cours.filter(c => c.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleEditClick = (c) => {
    setEditingCours(c.id);
    setEditForm({
      nom:         c.nom         || '',
      description: c.description || '',
      duree:       c.duree       || '',
      niveau:      c.niveau      || 'Débutant',
      date:        c.date        || '',
      heur:        c.heur        || '',
      capacite:    c.capacite    || '',
      salle:       c.salle       || '',
    });
  };

  const handleEditSave = async (id) => {
    try {
      const res = await api.put(`/api/cours/${id}`, { ...editForm, coach_id: user.id });
      setCours(cours.map(c => c.id === id ? res.data : c));
      setEditingCours(null);
    } catch (err) {
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="coach-programmes">
      <div className="coach-programmes__header">
        <div>
          <h1>Mes <span>Programmes</span></h1>
          <p>Gérez vos programmes d'entraînement</p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          + Ajouter un cours
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="coach-programmes__form">
          <h3>Nouveau cours</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>NOM DU COURS</label>
              <input name="nom" placeholder="Ex: Yoga matinal" value={form.nom} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>DURÉE (min)</label>
              <input name="duree" type="number" placeholder="60" value={form.duree} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>DATE</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>HEURE</label>
              <input name="heur" type="time" value={form.heur} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>NIVEAU</label>
              <select name="niveau" value={form.niveau} onChange={handleChange}>
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
              </select>
            </div>
            <div className="form-field">
              <label>SALLE</label>
              <input name="salle" placeholder="Ex: Salle A" value={form.salle} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>CAPACITÉ (personnes)</label>
              <input name="capacite" type="number" placeholder="20" value={form.capacite} onChange={handleChange} />
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label>DESCRIPTION</label>
              <textarea name="description" placeholder="Description du cours..." value={form.description} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-save" onClick={handleAdd}>💾 Sauvegarder</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>✕ Annuler</button>
          </div>
        </div>
      )}

      {/* Liste des cours */}
      <div className="coach-programmes__list">
        {cours.length === 0 ? (
          <div className="empty-state">
            <p>📋 Aucun cours pour le moment</p>
            <span>Cliquez sur "Ajouter un cours" pour commencer</span>
          </div>
        ) : (
          cours.map(c => (
            <div key={c.id} className="cours-card">
              {editingCours === c.id ? (
                <div className="form-grid" style={{ width: '100%' }}>
                  <div className="form-field">
                    <label>NOM DU COURS</label>
                    <input value={editForm.nom} onChange={e => setEditForm({ ...editForm, nom: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>DURÉE (min)</label>
                    <input type="number" value={editForm.duree} onChange={e => setEditForm({ ...editForm, duree: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>DATE</label>
                    <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>HEURE</label>
                    <input type="time" value={editForm.heur} onChange={e => setEditForm({ ...editForm, heur: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>NIVEAU</label>
                    <select value={editForm.niveau} onChange={e => setEditForm({ ...editForm, niveau: e.target.value })}>
                      <option>Débutant</option>
                      <option>Intermédiaire</option>
                      <option>Avancé</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>SALLE</label>
                    <input value={editForm.salle} onChange={e => setEditForm({ ...editForm, salle: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>CAPACITÉ</label>
                    <input type="number" value={editForm.capacite} onChange={e => setEditForm({ ...editForm, capacite: e.target.value })} />
                  </div>
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label>DESCRIPTION</label>
                    <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                  </div>
                  <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                    <button className="btn-save" onClick={() => handleEditSave(c.id)}>💾 Sauvegarder</button>
                    <button className="btn-cancel" onClick={() => setEditingCours(null)}>✕ Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="cours-card__info">
                    <h3>{c.nom}</h3>
                    <p>{c.description}</p>
                    <div className="cours-card__tags">
                      {c.duree    && <span className="tag">⏱ {c.duree} min</span>}
                      {c.date     && <span className="tag">📅 {new Date(c.date).toLocaleDateString('fr-FR')}</span>}
                      {c.heur     && <span className="tag">🕐 {c.heur?.slice(0, 5)}</span>}
                      {c.niveau   && <span className={`tag tag--niveau tag--${c.niveau?.toLowerCase()}`}>{c.niveau}</span>}
                      {c.salle    && <span className="tag">📍 {c.salle}</span>}
                      {c.capacite && <span className="tag">👥 {c.capacite} pers.</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-edit" onClick={() => handleEditClick(c)}>✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>🗑</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}