import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AdherentPage.css'

function AdherentPage() {
  const [user, setUser]       = useState(null)
  const [form, setForm]       = useState({})
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    axios.get('http://localhost:8000/api/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setUser(res.data)
      setForm({
        nom:       res.data.nom       ?? '',
        email:     res.data.email     ?? '',
        telephone: res.data.telephone ?? '',
        adresse:   res.data.adresse   ?? '',
      })
    })
    .catch(err => console.log(err))
  }, [])

  const initials = user?.nom
    ? user.nom.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
    setError(null)
  }

  const handleSave = () => {
    setSaving(true)
    setError(null)
    axios.put('http://localhost:8000/api/profile', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setUser(res.data)
      setSuccess(true)
      setEditing(false)
    })
    .catch(err => {
      const msg = err.response?.data?.message ?? 'Erreur lors de la mise à jour.'
      setError(msg)
    })
    .finally(() => setSaving(false))
  }

  const handleCancel = () => {
    setForm({
      nom:       user?.nom       ?? '',
      email:     user?.email     ?? '',
      telephone: user?.telephone ?? '',
      adresse:   user?.adresse   ?? '',
    })
    setEditing(false)
    setError(null)
    setSuccess(false)
  }

  return (
    <div className="ap-wrapper">
      <div className="ap-card">

        <div className="ap-header">
          <h1 className="ap-title">Mon <em>Profil</em></h1>
          <p className="ap-subtitle">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="ap-body">

          {/* Colonne gauche */}
          <div className="ap-panel ap-avatar-section">
            <div className="ap-avatar">{initials}</div>
            <p className="ap-nom">{user?.nom ?? '—'}</p>
            <span className="ap-badge">Cliente Privilège</span>
            <span className="ap-member-tag">Membre Or</span>
            <button className="ap-change-photo">Changer la photo</button>
          </div>

          {/* Colonne droite */}
          {user ? (
            <div className="ap-panel ap-info-panel">

              <div className="ap-section-header">
                <h2 className="ap-section-title">Informations personnelles</h2>
                <button
                  className={`ap-edit-btn ${editing ? 'ap-edit-btn--active' : ''}`}
                  onClick={() => editing ? handleCancel() : setEditing(true)}
                >
                  {editing ? '✕ Annuler' : '✏️ Modifier'}
                </button>
              </div>

              {success && (
                <div className="ap-alert ap-alert--success">
                  ✦ Profil mis à jour avec succès.
                </div>
              )}
              {error && (
                <div className="ap-alert ap-alert--error">
                  ⚠ {error}
                </div>
              )}

              <div className="ap-fields">

                <div className="ap-field">
                  <label className="ap-field__label">Nom</label>
                  {editing ? (
                    <input
                      className="ap-input"
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                      autoFocus
                    />
                  ) : (
                    <span className="ap-field__value">{user.nom || '—'}</span>
                  )}
                </div>

                <div className="ap-field">
                  <label className="ap-field__label">Email</label>
                  {editing ? (
                    <input
                      className="ap-input"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                    />
                  ) : (
                    <span className="ap-field__value">{user.email || '—'}</span>
                  )}
                </div>

                <div className="ap-field">
                  <label className="ap-field__label">Téléphone</label>
                  {editing ? (
                    <input
                      className="ap-input"
                      name="telephone"
                      value={form.telephone}
                      onChange={handleChange}
                      placeholder="+212 6XX XXX XXX"
                    />
                  ) : (
                    <span className="ap-field__value">{user.telephone || '—'}</span>
                  )}
                </div>

                <div className="ap-field ap-field--full">
                  <label className="ap-field__label">Adresse</label>
                  {editing ? (
                    <textarea
                      className="ap-input ap-textarea"
                      name="adresse"
                      value={form.adresse}
                      onChange={handleChange}
                      placeholder="Votre adresse complète"
                      rows={2}
                    />
                  ) : (
                    <span className="ap-field__value">{user.adresse || '—'}</span>
                  )}
                </div>

              </div>

              {editing && (
                <div className="ap-actions">
                  <button
                    className="ap-save-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="ap-panel">
              <div className="ap-loading">
                <div className="ap-spinner" />
                <p>Chargement du profil…</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AdherentPage