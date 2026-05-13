import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export default function AdherentPage() {

  const [user, setUser]               = useState(null)
  const [form, setForm]               = useState({})
  const [editing, setEditing]         = useState(false)
  const [saving, setSaving]           = useState(false)
  const [success, setSuccess]         = useState(false)
  const [error, setError]             = useState(null)
  const [loading, setLoading]         = useState(true)

  const [showPassForm, setShowPassForm] = useState(false)
  const [passForm, setPassForm]         = useState({ ancien: '', nouveau: '', confirmer: '' })
  const [passError, setPassError]       = useState(null)
  const [passSuccess, setPassSuccess]   = useState(false)

  const  [photoFile, setPhotoFile] = useState(null);
const [photoPreview, setPhotoPreview] = useState(null)

  // ── Charger le profil ────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/profile`, { headers: authHeaders() })
      .then(res => { setUser(res.data); fillForm(res.data) })
      .catch(() => setError('Impossible de charger le profil.'))
      .finally(() => setLoading(false))
  }, [])

  function fillForm(data) {
    setForm({
      nom:            data.nom            ?? '',
      prenom:         data.prenom         ?? '',
      email:          data.email          ?? '',
      telephone:      data.telephone      ?? '',
      adresse:        data.adresse        ?? '',
      date_naissance: data.date_naissance ?? '',
      sexe:           data.sexe           ?? '',
      poids:          data.poids          ?? '',
      taille:         data.taille         ?? '',
      objectif:       data.objectif       ?? '',
      niveau:         data.niveau         ?? '',
    })
  }

  // ── IMC ──────────────────────────────────────────────────────────────────
  const imc = form.poids && form.taille
    ? (form.poids / ((form.taille / 100) ** 2)).toFixed(1)
    : null

  const imcCategorie = !imc ? '' :
    imc < 18.5 ? 'Insuffisance pondérale' :
    imc < 25   ? 'Normale' :
    imc < 30   ? 'Surpoids' : 'Obésité'

  // ── Initiales avatar ─────────────────────────────────────────────────────
  const initials = user
    ? `${user.nom?.[0] ?? ''}${user.prenom?.[0] ?? ''}`.toUpperCase()
    : '?'

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
    setError(null)
  }

  // ── Sauvegarder ──────────────────────────────────────────────────────────
  const handleSave = () => {
  setSaving(true)

  const data = new FormData()

  Object.keys(form).forEach(key => {
    data.append(key, form[key] ?? '')
  })

  if (photoFile) {
    data.append('photo', photoFile)
  }

  axios.post(`${API}/profile?_method=PUT`, data, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(res => {
    setUser(res.data)
    fillForm(res.data)
    setEditing(false)
    setSuccess(true)
  })
  .catch(err => {
    console.log(err.response?.data)
    setError("Erreur mise à jour")
  })
  .finally(() => setSaving(false))
}

  const handleCancel = () => {
    fillForm(user)
    setEditing(false)
    setError(null)
    setSuccess(false)
  }

  // ── Photo ────────────────────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  setPhotoFile(file)
  setPhotoPreview(URL.createObjectURL(file))
}

  // ── Document médical ─────────────────────────────────────────────────────
  const handleDocUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const newDoc = { nom: file.name, date: new Date().toLocaleDateString('fr-FR'), url: '#' }
    setUser(prev => ({ ...prev, documents: [...(prev.documents ?? []), newDoc] }))
  }

  // ── Mot de passe ─────────────────────────────────────────────────────────
  const handlePassChange = () => {
    setPassError(null)
    if (passForm.nouveau !== passForm.confirmer) {
      setPassError('Les mots de passe ne correspondent pas.')
      return
    }
    if (passForm.nouveau.length < 6) {
      setPassError('Minimum 6 caractères.')
      return
    }
   const data = {
  current_password: passForm.ancien,
  password: passForm.nouveau,
  password_confirmation: passForm.confirmer,
}

axios.post(`${API}/change-password`, data, {
  headers: authHeaders()
})
      .then(() => {
        setPassSuccess(true)
        setPassForm({ ancien: '', nouveau: '', confirmer: '' })
        setTimeout(() => { setPassSuccess(false); setShowPassForm(false) }, 2000)
      })
      .catch(err => {
  console.log(err.response?.data)

  if (err.response?.data?.errors?.current_password) {
    setPassError(err.response.data.errors.current_password[0])
  } 
  else if (err.response?.data?.errors?.password) {
    setPassError(err.response.data.errors.password[0])
  } 
  else {
    setPassError(err.response?.data?.message ?? 'Erreur.')
  }
})
  }

  const abonnement = user?.abonnement ?? { formule: '—', dateExpiration: '—', actif: false }

  if (loading) return (
    <div className="coach-profil" style={{ padding: 40, textAlign: 'center' }}>
      Chargement du profil…
    </div>
  )
  if (!user) return (
    <div className="coach-profil" style={{ padding: 40, textAlign: 'center', color: '#e83e8c' }}>
      {error}
    </div>
  )

  return (
    <div className="coach-profil">

      {/* ════ HEADER ════ */}
      <div className="coach-profil__header">
        <h1>Mon <span>Profil</span></h1>
        <p>Gérez vos informations personnelles et paramètres de sécurité</p>
      </div>

      {/* ════ CONTENT ════ */}
      <div className="coach-profil__content">

        {/* ── COLONNE GAUCHE : avatar + abonnement ── */}
        <div className="coach-profil__left">

          {/* Avatar */}
          <div className="coach-profil__avatar" style={{ position: 'relative' }}>
            {photoPreview || user.photo
              ? <img
                  src={photoPreview || user.photo}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              : initials
            }
            <label
              title="Changer la photo"
              style={{
                position: 'absolute', bottom: 0, right: 0,
                background: '#e83e8c', borderRadius: '50%',
                width: 26, height: 26, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 13,
              }}
            >
              📷
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </label>
          </div>

          <h3>{user.prenom} {user.nom}</h3>
          <div className="coach-profil__badge">
            🏅 {user.role ?? 'Adhérent'}
          </div>
          {user.date_inscription && (
            <div className="coach-profil__specialite">
              📅 Membre depuis {user.date_inscription}
            </div>
          )}

          {/* Séparateur */}
          <div style={{
            width: '100%', height: 1,
            background: 'rgba(255,255,255,0.07)',
            margin: '24px 0',
          }} />

          {/* Abonnement */}
          <div style={{ width: '100%', textAlign: 'left' }}>
            <div style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.1em', marginBottom: 12,
            }}>
              👑 ABONNEMENT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                {abonnement.formule}
              </span>
              {abonnement.actif
                ? <span style={{
                    background: 'rgba(16,185,129,0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 6, padding: '2px 8px',
                    fontSize: 11, fontWeight: 700,
                  }}>Actif</span>
                : <span style={{
                    background: 'rgba(232,62,140,0.15)',
                    color: '#e83e8c',
                    border: '1px solid rgba(232,62,140,0.3)',
                    borderRadius: 6, padding: '2px 8px',
                    fontSize: 11, fontWeight: 700,
                  }}>Expiré</span>
              }
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              Expire le {abonnement.dateExpiration}
            </div>
          </div>
        </div>

        {/* ── COLONNE DROITE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── 1. Informations personnelles ── */}
          <div className="coach-profil__right">
            <div className="coach-profil__right-header">
              <h3>👤 Informations personnelles</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {editing ? (
                  <>
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                      {saving ? 'Sauvegarde…' : '💾 Sauvegarder'}
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>Annuler</button>
                  </>
                ) : (
                  <button className="btn-edit" onClick={() => setEditing(true)}>
                    ✏️ Modifier
                  </button>
                )}
              </div>
            </div>

            {success && (
              <div style={{
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                color: '#10b981', borderRadius: 8, padding: '10px 14px',
                fontSize: 13, marginBottom: 20,
              }}>
                ✅ Profil mis à jour avec succès !
              </div>
            )}
            {error && (
              <div style={{
                background: 'rgba(232,62,140,0.1)', border: '1px solid rgba(232,62,140,0.3)',
                color: '#e83e8c', borderRadius: 8, padding: '10px 14px',
                fontSize: 13, marginBottom: 20,
              }}>
                ⚠️ {error}
              </div>
            )}

            <div className="coach-profil__grid">

              {[
                { label: 'Nom',              name: 'nom',            type: 'text' },
                { label: 'Prénom',           name: 'prenom',         type: 'text' },
                { label: 'Date de naissance',name: 'date_naissance', type: 'date' },
                { label: 'Email',            name: 'email',          type: 'email' },
                { label: 'Téléphone',        name: 'telephone',      type: 'text', placeholder: '+212 6XX XXX XXX' },
                { label: 'Adresse',          name: 'adresse',        type: 'text', placeholder: 'Ville, Pays' },
              ].map(({ label, name, type, placeholder }) => (
                <div className="coach-profil__field" key={name}>
                  <label>{label.toUpperCase()}</label>
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={!editing}
                  />
                </div>
              ))}

              {/* Sexe */}
              <div className="coach-profil__field">
                <label>SEXE</label>
                {editing
                  ? (
                    <select
                      name="sexe"
                      value={form.sexe}
                      onChange={handleChange}
                      style={{
                        background: '#1a1d27',
                        border: '1px solid #e83e8c',
                        borderRadius: 10,
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: 15,
                        outline: 'none',
                      }}
                    >
                      <option value="">—</option>
                      <option>Homme</option>
                      <option>Femme</option>
                    </select>
                  )
                  : <input value={user.sexe || '—'} disabled />
                }
              </div>

            </div>
          </div>

          {/* ── 2. Informations de santé ── */}
          <div className="coach-profil__right">
            <div className="coach-profil__right-header">
              <h3>🏃 Informations de santé</h3>
            </div>

            <div className="coach-profil__grid">

              <div className="coach-profil__field">
                <label>POIDS (KG)</label>
                <input
                  name="poids" type="number"
                  value={form.poids} onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="coach-profil__field">
                <label>TAILLE (CM)</label>
                <input
                  name="taille" type="number"
                  value={form.taille} onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              {/* Objectif */}
              <div className="coach-profil__field">
                <label>OBJECTIF</label>
                {editing
                  ? (
                    <select
                      name="objectif"
                      value={form.objectif}
                      onChange={handleChange}
                      style={{
                        background: '#1a1d27',
                        border: '1px solid #e83e8c',
                        borderRadius: 10,
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: 15,
                        outline: 'none',
                      }}
                    >
                      <option value="">—</option>
                      <option>Perte de poids</option>
                      <option>Prise de muscle</option>
                      <option>Cardio / Endurance</option>
                      <option>Bien-être général</option>
                    </select>
                  )
                  : <input value={user.objectif || '—'} disabled />
                }
              </div>

              {/* Niveau */}
              <div className="coach-profil__field">
                <label>NIVEAU</label>
                {editing
                  ? (
                    <select
                      name="niveau"
                      value={form.niveau}
                      onChange={handleChange}
                      style={{
                        background: '#1a1d27',
                        border: '1px solid #e83e8c',
                        borderRadius: 10,
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: 15,
                        outline: 'none',
                      }}
                    >
                      <option value="">—</option>
                      <option>Débutant</option>
                      <option>Intermédiaire</option>
                      <option>Avancé</option>
                    </select>
                  )
                  : <input value={user.niveau || '—'} disabled />
                }
              </div>

            </div>

            {/* IMC */}
            {imc && (
              <div style={{
                marginTop: 24,
                background: 'rgba(232,62,140,0.06)',
                border: '1px solid rgba(232,62,140,0.2)',
                borderRadius: 12, padding: '16px 20px',
              }}>
                <div style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.1em', marginBottom: 8,
                }}>
                  IMC — INDICE DE MASSE CORPORELLE
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#e83e8c', lineHeight: 1 }}>
                  {imc}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
                  Catégorie : {imcCategorie}
                </div>
                {/* barre IMC */}
                <div style={{
                  marginTop: 12,
                  height: 6, borderRadius: 3,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((imc / 40) * 100, 100)}%`,
                    background: 'linear-gradient(90deg, #0891b2, #e83e8c)',
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* ── 3. Documents médicaux ── */}
          <div className="coach-profil__right">
            <div className="coach-profil__right-header">
              <h3>📄 Documents médicaux</h3>
            </div>

            {(user.documents ?? []).length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 16 }}>
                Aucun document téléchargé.
              </p>
            )}

            {(user.documents ?? []).map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#1a1d27',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '12px 16px',
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 22 }}>📑</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{doc.nom}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                    Téléchargé le {doc.date}
                  </div>
                </div>
                <a href={doc.url} download style={{ textDecoration: 'none' }}>
                  <button className="btn-edit" style={{ padding: '6px 12px' }}>⬇️</button>
                </a>
              </div>
            ))}

            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 8, cursor: 'pointer',
              background: 'rgba(232,62,140,0.1)',
              border: '1px dashed rgba(232,62,140,0.4)',
              color: '#e83e8c', fontSize: 13, fontWeight: 600,
              borderRadius: 10, padding: '10px 20px',
              transition: 'background 0.2s',
            }}>
              ＋ Télécharger un document
              <input type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} onChange={handleDocUpload} />
            </label>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 8 }}>
              PDF, JPG ou PNG. Max 2 Mo.
            </p>
          </div>

          {/* ── 4. Sécurité ── */}
          <div className="coach-profil__right">
            <div className="coach-profil__right-header">
              <h3>🔒 Sécurité</h3>
              <button
                className="btn-edit"
                onClick={() => setShowPassForm(v => !v)}
              >
                {showPassForm ? '✕ Annuler' : '🔑 Changer le mot de passe'}
              </button>
            </div>

            {showPassForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {passSuccess && (
                  <div style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    color: '#10b981', borderRadius: 8,
                    padding: '10px 14px', fontSize: 13,
                  }}>
                    ✅ Mot de passe changé avec succès !
                  </div>
                )}
                {passError && (
                  <div style={{
                    background: 'rgba(232,62,140,0.1)',
                    border: '1px solid rgba(232,62,140,0.3)',
                    color: '#e83e8c', borderRadius: 8,
                    padding: '10px 14px', fontSize: 13,
                  }}>
                    ⚠️ {passError}
                  </div>
                )}

                {[
                  { label: 'ANCIEN MOT DE PASSE', key: 'ancien' },
                  { label: 'NOUVEAU MOT DE PASSE', key: 'nouveau' },
                  { label: 'CONFIRMER LE NOUVEAU', key: 'confirmer' },
                ].map(({ label, key }) => (
                  <div className="coach-profil__field" key={key}>
                    <label>{label}</label>
                    <input
                      type="password"
                      value={passForm[key]}
                      onChange={e => setPassForm(p => ({ ...p, [key]: e.target.value }))}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button className="btn-save" onClick={handlePassChange}>
                    Confirmer le changement
                  </button>
                  <button className="btn-cancel" onClick={() => setShowPassForm(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>{/* fin colonne droite */}
      </div>{/* fin content */}
    </div>
  )
}