import { useState } from 'react';
import api from '../../Api/Axios.js';
import {
  User,
  Lock,
  Award,
  Camera,
  Save,
  X,
  Pencil,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Phone,
  Mail,
  Dumbbell,
  FileText,
  Building2,
  Calendar,
  Briefcase,
  MapPin,
} from 'lucide-react';
import './CoachProfil.css';

export default function CoachProfil() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [activeTab, setActiveTab] = useState('infos');

  // --- Tab Infos ---
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    email: user.email || '',
    telephone: user.telephone || '',
    specialite: user.specialite || '',
    bio: user.bio || '',
  });
  const [photo, setPhoto] = useState(
    user.photo ? `http://localhost:8000/storage/${user.photo}` : null
  );
  const [photoFile, setPhotoFile] = useState(null);

  // --- Tab Sécurité ---
  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [pwShow, setPwShow] = useState({ cur: false, nw: false, conf: false });
  const [pwAlert, setPwAlert] = useState({ type: '', msg: '' });

  // --- Tab Certificats ---
  const [certifs, setCertifs] = useState(
    user.certifs ? (typeof user.certifs === 'string' ? JSON.parse(user.certifs) : user.certifs) : []
  );
  const [exps, setExps] = useState(
    user.experiences ? (typeof user.experiences === 'string' ? JSON.parse(user.experiences) : user.experiences) : []
  );
  const [showCertForm, setShowCertForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [certForm, setCertForm] = useState({ titre: '', organisme: '', annee: '' });
  const [expForm, setExpForm] = useState({ poste: '', lieu: '', debut: '', fin: '' });

  // =====================
  // TAB INFOS
  // =====================
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (photoFile) formData.append('photo', photoFile);
      formData.append('_method', 'PUT');

      const res = await api.post(`/api/coach/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = res.data;
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setForm({
        nom: updated.nom || '',
        prenom: updated.prenom || '',
        email: updated.email || '',
        telephone: updated.telephone || '',
        specialite: updated.specialite || '',
        bio: updated.bio || '',
      });
      setPhoto(updated.photo ? `http://localhost:8000/storage/${updated.photo}` : null);
      setEditing(false);
    } catch (err) {
      alert(JSON.stringify(err.response?.data));
    }
  };

  // =====================
  // TAB SECURITE
  // =====================
  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleChangePassword = async () => {
    setPwAlert({ type: '', msg: '' });
    if (!pwForm.current_password || !pwForm.new_password || !pwForm.new_password_confirmation)
      return setPwAlert({ type: 'err', msg: 'Remplissez tous les champs' });
    if (pwForm.new_password !== pwForm.new_password_confirmation)
      return setPwAlert({ type: 'err', msg: 'Les mots de passe ne correspondent pas' });
    if (pwForm.new_password.length < 6)
      return setPwAlert({ type: 'err', msg: 'Minimum 6 caractères' });
    try {
      await api.put(`/api/coach/${user.id}/password`, pwForm);
      setPwAlert({ type: 'ok', msg: 'Mot de passe modifié avec succès !' });
      setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Mot de passe actuel incorrect';
      setPwAlert({ type: 'err', msg });
    }
  };

  // =====================
  // TAB CERTIFS
  // =====================
  const handleAddCertif = () => {
    if (!certForm.titre) return;
    const updated = [...certifs, { ...certForm, id: Date.now() }];
    setCertifs(updated);
    saveCertifsToApi(updated);
    const updatedUser = { ...user, certifs: updated };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCertForm({ titre: '', organisme: '', annee: '' });
    setShowCertForm(false);
  };

  const handleAddExp = () => {
    if (!expForm.poste) return;
    const updated = [...exps, { ...expForm, id: Date.now() }];
    setExps(updated);
    saveExpsToApi(updated);
    const updatedUser = { ...user, experiences: updated };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setExpForm({ poste: '', lieu: '', debut: '', fin: '' });
    setShowExpForm(false);
  };

  const handleDeleteCertif = (id) => {
    const updated = certifs.filter(c => c.id !== id);
    setCertifs(updated);
    saveCertifsToApi(updated);
    const updatedUser = { ...user, certifs: updated };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleDeleteExp = (id) => {
    const updated = exps.filter(e => e.id !== id);
    setExps(updated);
    saveExpsToApi(updated);
    const updatedUser = { ...user, experiences: updated };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const saveCertifsToApi = async (data) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('certifs', JSON.stringify(data));
      await api.post(`/api/coach/${user.id}`, formData);
    } catch (err) { console.log(err.response?.data); }
  };

  const saveExpsToApi = async (data) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('experiences', JSON.stringify(data));
      await api.post(`/api/coach/${user.id}`, formData);
    } catch (err) { console.log(err.response?.data); }
  };

  const tabs = [
    { key: 'infos',    icon: <User size={15} />,  label: 'Informations' },
    { key: 'securite', icon: <Lock size={15} />,  label: 'Sécurité' },
    { key: 'certifs',  icon: <Award size={15} />, label: 'Certificats & Expériences' },
  ];

  return (
    <div className="coach-profil">
      <div className="coach-profil__header">
        <h1>Mon <span>Profil</span></h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      {/* TABS */}
      <div className="coach-profil__tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`coach-profil__tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== TAB INFOS ===== */}
      {activeTab === 'infos' && (
        <div className="coach-profil__content">
          {/* Left card */}
          <div className="coach-profil__left">
            <div
              className="coach-profil__avatar"
              onClick={() => editing && document.getElementById('photo-input').click()}
              style={{ cursor: editing ? 'pointer' : 'default' }}
            >
              {photo
                ? <img src={photo} alt="profil" />
                : (user.prenom ? user.prenom[0].toUpperCase() : 'C')
              }
              {editing && (
                <div className="coach-profil__avatar-overlay">
                  <Camera size={16} />
                </div>
              )}
            </div>
            <input id="photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            <h3>{user.prenom} {user.nom}</h3>
            <span className="coach-profil__badge">COACH</span>
            <p className="coach-profil__specialite">
              <Dumbbell size={13} />
              {user.specialite || 'Spécialité non définie'}
            </p>
          </div>

          {/* Right card */}
          <div className="coach-profil__right">
            <div className="coach-profil__right-header">
              <h3>Informations personnelles</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-edit">
                  <Pencil size={14} /> Modifier
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleSave} className="btn-save">
                    <Save size={14} /> Sauvegarder
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-cancel">
                    <X size={14} /> Annuler
                  </button>
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
                <label><Mail size={11} /> EMAIL</label>
                <input name="email" value={form.email} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="coach-profil__field">
                <label><Phone size={11} /> TÉLÉPHONE</label>
                <input name="telephone" value={form.telephone} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="coach-profil__field" style={{ gridColumn: '1 / -1' }}>
                <label><Dumbbell size={11} /> SPÉCIALITÉ</label>
                <input name="specialite" value={form.specialite} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="coach-profil__field" style={{ gridColumn: '1 / -1' }}>
                <label><FileText size={11} /> BIO</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Parlez de vous..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB SECURITE ===== */}
      {activeTab === 'securite' && (
        <div className="coach-profil__securite">
          <div className="coach-profil__right" style={{ maxWidth: 480 }}>
            <div className="coach-profil__right-header">
              <h3>Changer le mot de passe</h3>
            </div>

            {pwAlert.msg && (
              <div className={`coach-profil__alert coach-profil__alert--${pwAlert.type}`}>
                {pwAlert.msg}
              </div>
            )}

            <div className="coach-profil__grid" style={{ gridTemplateColumns: '1fr' }}>
              {[
                { label: 'MOT DE PASSE ACTUEL',      name: 'current_password', key: 'cur' },
                { label: 'NOUVEAU MOT DE PASSE',      name: 'new_password',     key: 'nw' },
                { label: 'CONFIRMER LE MOT DE PASSE', name: 'new_password_confirmation', key: 'conf' },
              ].map(({ label, name, key }) => (
                <div className="coach-profil__field" key={name}>
                  <label>{label}</label>
                  <div className="coach-profil__pw-wrap">
                    <input
                      type={pwShow[key] ? 'text' : 'password'}
                      name={name}
                      value={pwForm[name]}
                      onChange={handlePwChange}
                      placeholder="••••••••"
                    />
                    <button
                      className="coach-profil__pw-eye"
                      onClick={() => setPwShow({ ...pwShow, [key]: !pwShow[key] })}
                    >
                      {pwShow[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <button onClick={handleChangePassword} className="btn-save">
                <Lock size={14} /> Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB CERTIFS ===== */}
      {activeTab === 'certifs' && (
        <div className="coach-profil__certifs">

          {/* Certificats */}
          <div className="coach-profil__right" style={{ marginBottom: 20 }}>
            <div className="coach-profil__right-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={18} color="#3D4F5A" />
                <h3>Certificats</h3>
              </div>
              <button className="btn-edit" onClick={() => setShowCertForm(!showCertForm)}>
                <Plus size={14} /> Ajouter
              </button>
            </div>

            {showCertForm && (
              <div className="coach-profil__subform">
                <div className="coach-profil__grid">
                  <div className="coach-profil__field">
                    <label><Award size={11} /> TITRE</label>
                    <input placeholder="Ex: BPJEPS" value={certForm.titre}
                      onChange={e => setCertForm({ ...certForm, titre: e.target.value })} />
                  </div>
                  <div className="coach-profil__field">
                    <label><Building2 size={11} /> ORGANISME</label>
                    <input placeholder="Ex: FFHM" value={certForm.organisme}
                      onChange={e => setCertForm({ ...certForm, organisme: e.target.value })} />
                  </div>
                  <div className="coach-profil__field" style={{ gridColumn: '1 / -1' }}>
                    <label><Calendar size={11} /> ANNÉE</label>
                    <input type="number" placeholder="2022" value={certForm.annee}
                      onChange={e => setCertForm({ ...certForm, annee: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn-save" onClick={handleAddCertif}>
                    <Save size={14} /> Ajouter
                  </button>
                  <button className="btn-cancel" onClick={() => setShowCertForm(false)}>
                    <X size={14} /> Annuler
                  </button>
                </div>
              </div>
            )}

            {certifs.length === 0 ? (
              <p className="coach-profil__empty">Aucun certificat ajouté</p>
            ) : (
              certifs.map(c => (
                <div key={c.id} className="coach-profil__cert-item">
                  <div className="coach-profil__cert-icon">
                    <Award size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>{c.titre}</h4>
                    <p>{c.organisme}</p>
                    <span className="coach-profil__cert-year">{c.annee}</span>
                  </div>
                  <button className="btn-delete" onClick={() => handleDeleteCertif(c.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Expériences */}
          <div className="coach-profil__right">
            <div className="coach-profil__right-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Briefcase size={18} color="#3D4F5A" />
                <h3>Expériences</h3>
              </div>
              <button className="btn-edit" onClick={() => setShowExpForm(!showExpForm)}>
                <Plus size={14} /> Ajouter
              </button>
            </div>

            {showExpForm && (
              <div className="coach-profil__subform">
                <div className="coach-profil__grid">
                  <div className="coach-profil__field">
                    <label><Briefcase size={11} /> POSTE</label>
                    <input placeholder="Ex: Coach personnel" value={expForm.poste}
                      onChange={e => setExpForm({ ...expForm, poste: e.target.value })} />
                  </div>
                  <div className="coach-profil__field">
                    <label><MapPin size={11} /> LIEU / SALLE</label>
                    <input placeholder="Ex: FitZone Casa" value={expForm.lieu}
                      onChange={e => setExpForm({ ...expForm, lieu: e.target.value })} />
                  </div>
                  <div className="coach-profil__field">
                    <label><Calendar size={11} /> DÉBUT</label>
                    <input type="number" placeholder="2020" value={expForm.debut}
                      onChange={e => setExpForm({ ...expForm, debut: e.target.value })} />
                  </div>
                  <div className="coach-profil__field">
                    <label><Calendar size={11} /> FIN (vide = Actuel)</label>
                    <input type="number" placeholder="2023" value={expForm.fin}
                      onChange={e => setExpForm({ ...expForm, fin: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn-save" onClick={handleAddExp}>
                    <Save size={14} /> Ajouter
                  </button>
                  <button className="btn-cancel" onClick={() => setShowExpForm(false)}>
                    <X size={14} /> Annuler
                  </button>
                </div>
              </div>
            )}

            {exps.length === 0 ? (
              <p className="coach-profil__empty">Aucune expérience ajoutée</p>
            ) : (
              exps.map(e => (
                <div key={e.id} className="coach-profil__cert-item">
                  <div className="coach-profil__cert-icon">
                    <Briefcase size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>{e.poste}</h4>
                    <p>{e.lieu}</p>
                    <span className="coach-profil__cert-year">{e.debut} — {e.fin || 'Actuel'}</span>
                  </div>
                  <button className="btn-delete" onClick={() => handleDeleteExp(e.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}