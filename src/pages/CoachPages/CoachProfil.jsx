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
const [photo, setPhoto] = useState(user.photo || null);
const [photoFile, setPhotoFile] = useState(null);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  try {
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (photoFile) formData.append('photo', photoFile);
    formData.append('_method', 'PUT'); // ← zid had chi

    const res = await api.post(`/api/coach/${user.id}`, formData, { // ← bdl put b post
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    localStorage.setItem('user', JSON.stringify(res.data));
    setUser(res.data);
    setForm({
      nom: res.data.nom || '',
      prenom: res.data.prenom || '',
      email: res.data.email || '',
      telephone: res.data.telephone || '',
      specialite: res.data.specialite || '',
    });
    setPhoto(res.data.photo ? `http://localhost:8000/storage/${res.data.photo}` : null);
    setEditing(false);
  } catch (err) {
    console.log('STATUS:', err.response?.status);
    console.log('DATA:', err.response?.data);
    alert(JSON.stringify(err.response?.data));
  }
};
  const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setPhotoFile(file);
  setPhoto(URL.createObjectURL(file));
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


        <div className="coach-profil__avatar" onClick={() => editing && document.getElementById('photo-input').click()}
  style={{cursor: editing ? 'pointer' : 'default'}}>
  {photo ? (
    <img src={photo} alt="profil" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
  ) : (
    user.prenom ? user.prenom[0].toUpperCase() : 'C'
  )}
  {editing && <div style={{position:'absolute', bottom:0, right:0, background:'#f97316', borderRadius:'50%', padding:'4px', fontSize:'12px'}}>📷</div>}
</div>
<input id="photo-input" type="file" accept="image/*" style={{display:'none'}} onChange={handlePhotoChange} />
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