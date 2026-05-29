// src/pages/AdminPages/Paiements.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';

const API   = 'http://localhost:8000/api';
const token = () => localStorage.getItem('token');

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

  // ── Fetch paiements ──
  const fetchPaiements = async () => {
    try {
      const [p, s] = await Promise.all([
        axios.get(`${API}/paiements`,             { headers: { Authorization: `Bearer ${token()}` } }),
        axios.get(`${API}/paiements/statistiques`, { headers: { Authorization: `Bearer ${token()}` } }),
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

  // ── Ajouter ──
  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/paiements`, form, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      setForm({ adherent_id: '', abonnement_id: '', montant: '', date_paiement: '', mrthode: 'cash', statut: 'paye' });
      setShowForm(false);
      fetchPaiements();
    } catch (e) {
      console.error(e);
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce paiement ?')) return;
    await axios.delete(`${API}/paiements/${id}`, {
      headers: { Authorization: `Bearer ${token()}` }
    });
    fetchPaiements();
  };

  const statutColor = (s) => ({ paye: '#22c55e', en_attente: '#f59e0b', retard: '#ef4444' }[s] || '#94a3b8');

  return (
    <div>

      {/* ── Stats cards ── */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Revenus',    value: `${stats.total_revenus} MAD`,       color: '#22c55e' },
            { label: 'Ce mois',          value: `${stats.revenus_ce_mois} MAD`,     color: '#3b82f6' },
            { label: 'En retard',        value: stats.paiements_en_retard,          color: '#ef4444' },
            { label: 'Total paiements',  value: stats.total_paiements,              color: '#f59e0b' },
          ].map(card => (
            <div key={card.label} style={{ background: '#1e1d1b', borderRadius: 12, padding: '18px 20px', borderLeft: `3px solid ${card.color}` }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: 22, fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontSize: 22 }}>
          💰 Gestion des Paiements
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: 'linear-gradient(135deg,#73795D,#3D4F5A)', color: '#fff', padding: '9px 20px', borderRadius: 8, fontWeight: 600 }}
        >
          {showForm ? '✕ Fermer' : '+ Ajouter'}
        </button>
      </div>

      {/* ── Formulaire ── */}
      {showForm && (
        <div style={{ background: '#1e1d1b', borderRadius: 12, padding: 24, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'ID Adhérent',    key: 'adherent_id',   type: 'number' },
            { label: 'ID Abonnement',  key: 'abonnement_id', type: 'number' },
            { label: 'Montant (MAD)',  key: 'montant',       type: 'number' },
            { label: 'Date paiement',  key: 'date_paiement', type: 'date'   },
          ].map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input style={inputStyle} type={f.type} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div>
            <label style={labelStyle}>Méthode</label>
            <select style={inputStyle} value={form.mrthode}
              onChange={e => setForm({ ...form, mrthode: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="carte">Carte</option>
              <option value="virement">Virement</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Statut</label>
            <select style={inputStyle} value={form.statut}
              onChange={e => setForm({ ...form, statut: e.target.value })}>
              <option value="paye">Payé</option>
              <option value="en_attente">En attente</option>
              <option value="retard">Retard</option>
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <button onClick={handleSubmit}
              style={{ background: 'linear-gradient(135deg,#73795D,#3D4F5A)', color: '#fff', padding: '10px 28px', borderRadius: 8, fontWeight: 600, width: '100%' }}>
              ➕ Ajouter paiement
            </button>
          </div>
        </div>
      )}

      {/* ── Tableau ── */}
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Chargement...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {['ID', 'Adhérent', 'Abonnement', 'Montant', 'Date', 'Méthode', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paiements.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={tdStyle}>{p.id}</td>
                  <td style={tdStyle}>{p.adherent_id}</td>
                  <td style={tdStyle}>{p.abonnement_id}</td>
                  <td style={tdStyle}>{p.montant} MAD</td>
                  <td style={tdStyle}>{p.date_paiement}</td>
                  <td style={tdStyle}>{p.mrthode}</td>
                  <td style={tdStyle}>
                    <span style={{ background: statutColor(p.statut), color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                      {p.statut}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 9px', cursor: 'pointer' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 };
const inputStyle  = { width: '100%', background: '#2a2927', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' };
const tableStyle  = { width: '100%', borderCollapse: 'collapse', background: '#1e1d1b', borderRadius: 12, overflow: 'hidden' };
const thStyle     = { padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, borderBottom: '1px solid rgba(255,255,255,0.07)' };
const tdStyle     = { padding: '12px 16px', color: 'rgba(255,255,255,0.75)', fontSize: 13 };