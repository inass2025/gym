import { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardAdmin.css';

const API   = 'http://localhost:8000/api';
const token = () => localStorage.getItem('token');
const auth  = () => ({ headers: { Authorization: `Bearer ${token()}` } });

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#2a2927',
  border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '14px 16px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const labelStyle = {
  display: 'block',
  color: 'rgba(255,255,255,0.35)',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  marginBottom: '8px',
  fontWeight: '600',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
};

export default function Abonnements() {
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [form, setForm]               = useState({
    adherent_id: '', type: 'mensuel',
    date_debut: '', date_fin: '',
    prix: '', statut: 'actif'
  });

  const fetchAbonnements = async () => {
    try {
      const res = await axios.get(`${API}/abonnements/all`, auth());
      setAbonnements(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAbonnements(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/abonnements/${editId}`, form, auth());
      } else {
        await axios.post(`${API}/abonnements`, form, auth());
      }
      setForm({ adherent_id: '', type: 'mensuel', date_debut: '', date_fin: '', prix: '', statut: 'actif' });
      setEditId(null);
      setShowForm(false);
      fetchAbonnements();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (abo) => {
    setForm({
      adherent_id: abo.adherent_id, type: abo.type,
      date_debut: abo.date_debut, date_fin: abo.date_fin,
      prix: abo.prix, statut: abo.statut,
    });
    setEditId(abo.id);
    setShowForm(true);
  };

  const handleSuspendre = async (id) => {
    await axios.post(`${API}/abonnements/${id}/suspendre`, {}, auth());
    fetchAbonnements();
  };

  const handleRenouveler = async (id) => {
    const duree = prompt('Nombre de mois à ajouter ?');
    if (!duree) return;
    await axios.post(`${API}/abonnements/${id}/renouveler`, { duree_mois: duree }, auth());
    fetchAbonnements();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet abonnement ?')) return;
    await axios.delete(`${API}/abonnements/${id}`, auth());
    fetchAbonnements();
  };

  const stats = {
    total:     abonnements.length,
    actifs:    abonnements.filter(a => a.statut === 'actif').length,
    suspendus: abonnements.filter(a => a.statut === 'suspendu').length,
    expires:   abonnements.filter(a => a.statut === 'expire').length,
  };

  const STAT_CARDS = [
    { icon: 'ti-ticket',       label: 'Total abonnements', value: stats.total,     cls: 'db-stat-sage'  },
    { icon: 'ti-circle-check', label: 'Actifs',            value: stats.actifs,    cls: 'db-stat-green' },
    { icon: 'ti-player-pause', label: 'Suspendus',         value: stats.suspendus, cls: 'db-stat-amber' },
    { icon: 'ti-calendar-x',   label: 'Expirés',           value: stats.expires,   cls: 'db-stat-red'   },
  ];

  const statutBadge = (s) => ({
    actif:     'badge-actif',
    suspendu:  'badge-warn',
    expire:    'badge-bloque',
    renouvele: 'badge-info',
  }[s] || '');

  const getInputStyle = (name) => ({
    ...inputStyle,
    borderColor: focusedField === name
      ? 'rgba(115,121,93,0.7)'
      : 'rgba(255,255,255,0.08)',
  });

  if (loading) return (
    <div className="db-loading">
      <i className="ti ti-loader-2 db-spin" />
      <span>Chargement…</span>
    </div>
  );

  return (
    <div className="db-page">

      {/* ── EN-TÊTE ── */}
      <div className="db-entete">
        <div>
          <h1 className="db-titre">Gestion des <span>Abonnements</span></h1>
          <p className="db-sous-titre">Suivi et gestion des abonnements membres</p>
        </div>
        <button
          className="db-btn-primar"
          onClick={() => { setShowForm(!showForm); setEditId(null); }}
        >
          <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'}`} />
          {showForm ? 'Fermer' : 'Ajouter'}
        </button>
      </div>

      {/* ── CARTES STATS ── */}
      <div className="db-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {STAT_CARDS.map(card => (
          <div key={card.label} className={`db-stat-card ${card.cls}`}>
            <div className="db-stat-icon">
              <i className={`ti ${card.icon}`} />
            </div>
            <div className="db-stat-body">
              <p className="db-stat-label">{card.label}</p>
              <p className="db-stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FORMULAIRE ── */}
      {showForm && (
        <div style={{
          background: '#1a1917',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Titre formulaire */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <i className={`ti ${editId ? 'ti-edit' : 'ti-plus'}`}
              style={{ color: '#8b7cf6', fontSize: 20 }} />
            <h3 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 600, margin: 0 }}>
              {editId ? 'Modifier abonnement' : 'Nouvel abonnement'}
            </h3>
          </div>

          {/* Grid des champs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>

            <div style={fieldStyle}>
              <label style={labelStyle}>ID Adhérent</label>
              <input
                style={getInputStyle('adherent_id')}
                type="number"
                placeholder="Ex: 12"
                value={form.adherent_id}
                onChange={e => setForm({ ...form, adherent_id: e.target.value })}
                onFocus={() => setFocusedField('adherent_id')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Type</label>
              <select
                style={getInputStyle('type')}
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                onFocus={() => setFocusedField('type')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="mensuel">Mensuel</option>
                <option value="trimestriel">Trimestriel</option>
                <option value="annuel">Annuel</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Date début</label>
              <input
                style={getInputStyle('date_debut')}
                type="date"
                value={form.date_debut}
                onChange={e => setForm({ ...form, date_debut: e.target.value })}
                onFocus={() => setFocusedField('date_debut')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Date fin</label>
              <input
                style={getInputStyle('date_fin')}
                type="date"
                value={form.date_fin}
                onChange={e => setForm({ ...form, date_fin: e.target.value })}
                onFocus={() => setFocusedField('date_fin')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Prix (MAD)</label>
              <input
                style={getInputStyle('prix')}
                type="number"
                placeholder="Ex: 300"
                value={form.prix}
                onChange={e => setForm({ ...form, prix: e.target.value })}
                onFocus={() => setFocusedField('prix')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Statut</label>
              <select
                style={getInputStyle('statut')}
                value={form.statut}
                onChange={e => setForm({ ...form, statut: e.target.value })}
                onFocus={() => setFocusedField('statut')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="actif">Actif</option>
                <option value="suspendu">Suspendu</option>
                <option value="expire">Expiré</option>
                <option value="renouvele">Renouvelé</option>
              </select>
            </div>

            {/* Bouton submit */}
            <div style={{ gridColumn: '1/-1', marginTop: 8 }}>
              <button
                onClick={handleSubmit}
                style={{
                  background: '#4a5568',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#3d4a5c'}
                onMouseLeave={e => e.currentTarget.style.background = '#4a5568'}
              >
                <i className={`ti ${editId ? 'ti-device-floppy' : 'ti-plus'}`} />
                {editId ? 'Enregistrer modifications' : 'Ajouter'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── TABLEAU ── */}
      <div className="db-card">
        <div className="db-card-header">
          <h2 className="db-card-titre">
            <i className="ti ti-list" /> Liste des abonnements
          </h2>
        </div>
        {abonnements.length === 0 ? (
          <p className="db-empty">Aucun abonnement enregistré.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
              <thead>
                <tr>
                  {['ID', 'Adhérent', 'Type', 'Début', 'Fin', 'Prix', 'Statut', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {abonnements.map(abo => (
                  <tr key={abo.id}>
                    <td className="db-td-muted">#{abo.id}</td>
                    <td className="db-td-name">#{abo.adherent_id}</td>
                    <td className="db-td-muted" style={{ textTransform: 'capitalize' }}>{abo.type}</td>
                    <td className="db-td-muted">{abo.date_debut}</td>
                    <td className="db-td-muted">{abo.date_fin}</td>
                    <td className="db-td-name">{abo.prix} MAD</td>
                    <td>
                      <span className={statutBadge(abo.statut)}>
                        <span className="badge-dot" /> {abo.statut}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="db-action-btn db-action-info" onClick={() => handleEdit(abo)} title="Modifier">
                          <i className="ti ti-edit" />
                        </button>
                        <button className="db-action-btn db-action-warn" onClick={() => handleSuspendre(abo.id)} title="Suspendre">
                          <i className="ti ti-player-pause" />
                        </button>
                        <button className="db-action-btn db-action-success" onClick={() => handleRenouveler(abo.id)} title="Renouveler">
                          <i className="ti ti-refresh" />
                        </button>
                        <button className="db-action-btn db-action-danger" onClick={() => handleDelete(abo.id)} title="Supprimer">
                          <i className="ti ti-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}