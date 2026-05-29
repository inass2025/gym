// src/pages/AdminPages/Paiements.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardAdmin.css';

const API   = 'http://localhost:8000/api';
const token = () => localStorage.getItem('token');
const auth  = () => ({ headers: { Authorization: `Bearer ${token()}` } });

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({
    adherent_id: '', abonnement_id: '',
    montant: '', date_paiement: '',
    mrthode: 'cash', statut: 'paye'
  });

  const fetchPaiements = async () => {
    try {
      const [p, s] = await Promise.all([
        axios.get(`${API}/paiements`,              auth()),
        axios.get(`${API}/paiements/statistiques`, auth()),
      ]);
      setPaiements(p.data);
      setStats(s.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPaiements(); }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/paiements`, form, auth());
      setForm({ adherent_id: '', abonnement_id: '', montant: '', date_paiement: '', mrthode: 'cash', statut: 'paye' });
      setShowForm(false);
      fetchPaiements();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce paiement ?')) return;
    await axios.delete(`${API}/paiements/${id}`, auth());
    fetchPaiements();
  };

  const STAT_CARDS = stats ? [
    { icon: 'ti-coin',           label: 'Total revenus',   value: `${stats.total_revenus} MAD`,   cls: 'db-stat-sage'  },
    { icon: 'ti-calendar-stats', label: 'Revenus ce mois', value: `${stats.revenus_ce_mois} MAD`, cls: 'db-stat-slate' },
    { icon: 'ti-alert-triangle', label: 'En retard',       value: stats.paiements_en_retard,      cls: 'db-stat-red'   },
    { icon: 'ti-receipt',        label: 'Total paiements', value: stats.total_paiements,          cls: 'db-stat-amber' },
  ] : [];

  const statutBadge = (s) => ({
    paye:       { cls: 'badge-actif',  label: 'Payé'       },
    en_attente: { cls: 'badge-warn',   label: 'En attente' },
    retard:     { cls: 'badge-bloque', label: 'Retard'     },
  }[s] || { cls: '', label: s });

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
          <h1 className="db-titre">Gestion des <span>Paiements</span></h1>
          <p className="db-sous-titre">Suivi des revenus et transactions</p>
        </div>
        <button
          className="db-btn-primary"
          onClick={() => setShowForm(!showForm)}
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
        <div className="db-card" style={{ marginBottom: 24 }}>
          <div className="db-card-header">
            <h2 className="db-card-titre">
              <i className="ti ti-plus" /> Nouveau paiement
            </h2>
          </div>
          <div className="db-form-grid">
            {[
              { label: 'ID Adhérent',   key: 'adherent_id',   type: 'number' },
              { label: 'ID Abonnement', key: 'abonnement_id', type: 'number' },
              { label: 'Montant (MAD)', key: 'montant',       type: 'number' },
              { label: 'Date paiement', key: 'date_paiement', type: 'date'   },
            ].map(f => (
              <div key={f.key} className="db-form-field">
                <label className="db-form-label">{f.label}</label>
                <input
                  className="db-form-input"
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
            <div className="db-form-field">
              <label className="db-form-label">Méthode</label>
              <select className="db-form-input" value={form.mrthode}
                onChange={e => setForm({ ...form, mrthode: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="carte">Carte</option>
                <option value="virement">Virement</option>
              </select>
            </div>
            <div className="db-form-field">
              <label className="db-form-label">Statut</label>
              <select className="db-form-input" value={form.statut}
                onChange={e => setForm({ ...form, statut: e.target.value })}>
                <option value="paye">Payé</option>
                <option value="en_attente">En attente</option>
                <option value="retard">Retard</option>
              </select>
            </div>
            <div className="db-form-field" style={{ gridColumn: '1/-1' }}>
              <button className="db-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSubmit}>
                <i className="ti ti-plus" /> Ajouter paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TABLEAU ── */}
      <div className="db-card">
        <div className="db-card-header">
          <h2 className="db-card-titre">
            <i className="ti ti-list" /> Liste des paiements
          </h2>
        </div>
        {paiements.length === 0 ? (
          <p className="db-empty">Aucun paiement enregistré.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
              <thead>
                <tr>
                  {['ID', 'Adhérent', 'Abonnement', 'Montant', 'Date', 'Méthode', 'Statut', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paiements.map(p => {
                  const badge = statutBadge(p.statut);
                  return (
                    <tr key={p.id}>
                      <td className="db-td-muted">#{p.id}</td>
                      <td className="db-td-name">#{p.adherent_id}</td>
                      <td className="db-td-muted">#{p.abonnement_id}</td>
                      <td className="db-td-name">{p.montant} MAD</td>
                      <td className="db-td-muted">{p.date_paiement}</td>
                      <td className="db-td-muted" style={{ textTransform: 'capitalize' }}>{p.mrthode}</td>
                      <td>
                        <span className={badge.cls}>
                          <span className="badge-dot" /> {badge.label}
                        </span>
                      </td>
                      <td>
                        <button className="db-action-btn db-action-danger" onClick={() => handleDelete(p.id)} title="Supprimer">
                          <i className="ti ti-trash" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}