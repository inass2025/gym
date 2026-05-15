import { useState, useEffect } from 'react';
import api from '../../Api/Axios.js';
import './CoachProgrammes.css';

export default function CoachProgrammes() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cours, setCours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
  nom: '', description: '', duree: '', niveau: 'Débutant',
  horaire: '', capacite: '', salle: '', date: ''
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
      const res = await api.post('/api/cours', { ...form, coach_id: user.id });
      setCours([...cours, res.data]);
      setForm({ nom: '', description: '', duree: '', niveau: 'Débutant', horaire: '' });
      setShowForm(false);
      setForm({ 
        nom: '', description: '', duree: '', niveau: 'Débutant', 
        horaire: '', capacite: '', salle: '', date: '' 
      });
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


  
//CHNO ZADT TANI

  const handleEditClick = (c) => {
  setEditingCours(c.id);
  setEditForm({
    nom: c.nom, description: c.description, duree: c.duree,
    niveau: c.niveau, horaire: c.horaire, capacite: c.capacite,
    salle: c.salle, date: c.date
  });
};

const handleEditSave = async (id) => {
  try {
    const res = await api.put(`/api/cours/${id}`, editForm);
    setCours(cours.map(c => c.id === id ? res.data : c));
    setEditingCours(null);
  } catch (err) {
    console.log(err.response?.data);
    alert(JSON.stringify(err.response?.data));
  }
};

//7AD HNA


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
              <label>HORAIRE</label>
              <input name="horaire" type="datetime-local" value={form.horaire} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>NIVEAU</label>
              <select name="niveau" value={form.niveau} onChange={handleChange}>
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
              </select>
            </div>



            {/* dk chi li zdt */}
            <label>SALLE</label>
  <input name="salle" placeholder="Ex: Salle A" value={form.salle} onChange={handleChange} />
</div>
<div className="form-field">
  <label>CAPACITÉ (personnes)</label>
  <input name="capacite" type="number" placeholder="20" value={form.capacite} onChange={handleChange} />
</div>
<div className="form-field">
  <label>DATE</label>
  <input name="date" type="date" value={form.date} onChange={handleChange} />
            <div className="form-field" style={{gridColumn: '1 / -1'}}>

{/* had hna */}


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
              <div className="cours-card__info">
                <h3>{c.nom}</h3>
                <p>{c.description}</p>
                <div className="cours-card__tags">
                  <span className="tag">⏱ {c.duree} min</span>
                  <span className="tag">📅 {c.horaire ? new Date(c.horaire).toLocaleDateString('fr-FR') : '-'}</span>
                  <span className={`tag tag--niveau tag--${c.niveau?.toLowerCase()}`}>{c.niveau}</span>
                </div>
              </div>
              <button className="btn-delete" onClick={() => handleDelete(c.id)}>🗑</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}