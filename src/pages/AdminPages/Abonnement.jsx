// src/pages/AdminPages/Abonnements.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

const token = () => localStorage.getItem('token');

export default function Abonnements() {
  const [abonnements, setAbonnements]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [form, setForm]                 = useState({
    adherent_id: '', type: 'mensuel',
    date_debut: '', date_fin: '',
    prix: '', statut: 'actif'
  });
  const [editId, setEditId]             = useState(null);
  const [showForm, setShowForm]         = useState(false);

  // ── Fetch ──
  const fetchAbonnements = async () => {
    try {
      const res = await axios.get(`${API}/abonnements/all`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      setAbonnements(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAbonnements(); }, []);

  // ── Submit (add ou edit) ──
  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/abonnements/${editId}`, form, {
          headers: { Authorization: `Bearer ${token()}` }
        });
      } else {
        await axios.post(`${API}/abonnements`, form, {
          headers: { Authorization: `Bearer ${token()}` }
        });
      }
      setForm({ adherent_id: '', type: 'mensuel', date_debut: '', date_fin: '', prix: '', statut: 'actif' });
      setEditId(null);
      setShowForm(false);
      fetchAbonnements();
    } catch (e) {
      console.error(e);
    }
  };

  // ── Suspendre ──
  const handleSuspendre = async (id) => {
    await axios.post(`${API}/abonnements/${id}/suspendre`, {}, {
      headers: { Authorization: `Bearer ${token()}` }
    });
    fetchAbonnements();
  };

  // ── Renouveler ──
  const handleRenouveler = async (id) => {
    const duree = prompt('Nombre de mois à ajouter ?');
    if (!duree) return;
    await axios.post(`${API}/abonnements/${id}/renouveler`,
      { duree_mois: duree },
      { headers: { Authorization: `Bearer ${token()}` } }
    );
    fetchAbonnements();
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet abonnement ?')) return;
    await axios.delete(`${API}/abonnements/${id}`, {
      headers: { Authorization: `Bearer ${token()}` }
    });
    fetchAbonnements();
  };

  // ── Edit ──
  const handleEdit = (abo) => {
    setForm({
      adherent_id: abo.adherent_id,
      type: abo.type,
      date_debut: abo.date_debut,
      date_fin: abo.date_fin,
      prix: abo.prix,
      statut: abo.statut
    });
    setEditId(abo.id);
    setShowForm(true);
};

  // ── Statut badge color ──
const badgeColor = (statut) => ({
    actif:     '#22c55e',
    suspendu:  '#f59e0b',
    expire:    '#ef4444',
    renouvele: '#3b82f6',
}[statut] || '#94a3b8');

return (
    <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: 22 }}>
        🎫 Gestion des Abonnements
        </h2>
        <button
        onClick={() => { setShowForm(!showForm); setEditId(null); }}
        style={{ background: 'linear-gradient(135deg,#73795D,#3D4F5A)', color: '#fff', padding: '9px 20px', borderRadius: 8, fontWeight: 600 }}
        >
        {showForm ? '✕ Fermer' : '+ Ajouter'}
        </button>
    </div>

      {/* ── Formulaire ── */}
    {showForm && (
        <div style={{ background: '#1e1d1b', borderRadius: 12, padding: 24, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
            <label style={labelStyle}>ID Adhérent</label>
            <input style={inputStyle} type="number" value={form.adherent_id}
            onChange={e => setForm({ ...form, adherent_id: e.target.value })} />
        </div>
        <div>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="mensuel">Mensuel</option>
            <option value="trimestriel">Trimestriel</option>
            <option value="annuel">Annuel</option>
            </select>
        </div>
        <div>
            <label style={labelStyle}>Date début</label>
            <input style={inputStyle} type="date" value={form.date_debut}
            onChange={e => setForm({ ...form, date_debut: e.target.value })} />
        </div>
        <div>
            <label style={labelStyle}>Date fin</label>
            <input style={inputStyle} type="date" value={form.date_fin}
            onChange={e => setForm({ ...form, date_fin: e.target.value })} />
        </div>
        <div>
            <label style={labelStyle}>Prix (MAD)</label>
            <input style={inputStyle} type="number" value={form.prix}
            onChange={e => setForm({ ...form, prix: e.target.value })} />
        </div>
        <div>
            <label style={labelStyle}>Statut</label>
            <select style={inputStyle} value={form.statut}
            onChange={e => setForm({ ...form, statut: e.target.value })}>
            <option value="actif">Actif</option>
            <option value="suspendu">Suspendu</option>
            <option value="expire">Expiré</option>
            <option value="renouvele">Renouvelé</option>
            </select>
        </div>
        <div style={{ gridColumn: '1/-1' }}>
            <button onClick={handleSubmit}
            style={{ background: 'linear-gradient(135deg,#73795D,#3D4F5A)', color: '#fff', padding: '10px 28px', borderRadius: 8, fontWeight: 600, width: '100%' }}>
            {editId ? '💾 Modifier' : '➕ Ajouter'}
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
                {['ID', 'Adhérent', 'Type', 'Début', 'Fin', 'Prix', 'Statut', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {abonnements.map(abo => (
                <tr key={abo.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={tdStyle}>{abo.id}</td>
                <td style={tdStyle}>{abo.adherent_id}</td>
                <td style={tdStyle}>{abo.type}</td>
                <td style={tdStyle}>{abo.date_debut}</td>
                <td style={tdStyle}>{abo.date_fin}</td>
                <td style={tdStyle}>{abo.prix} MAD</td>
                <td style={tdStyle}>
                    <span style={{ background: badgeColor(abo.statut), color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                    {abo.statut}
                    </span>
                </td>
                <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleEdit(abo)} style={btnStyle('#3b82f6')}>✏️</button>
                    <button onClick={() => handleSuspendre(abo.id)} style={btnStyle('#f59e0b')}>⏸️</button>
                    <button onClick={() => handleRenouveler(abo.id)} style={btnStyle('#22c55e')}>🔄</button>
                    <button onClick={() => handleDelete(abo.id)} style={btnStyle('#ef4444')}>🗑️</button>
                    </div>
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

// ── Styles ──
const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 };
const inputStyle  = { width: '100%', background: '#2a2927', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' };
const tableStyle  = { width: '100%', borderCollapse: 'collapse', background: '#1e1d1b', borderRadius: 12, overflow: 'hidden' };
const thStyle     = { padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, borderBottom: '1px solid rgba(255,255,255,0.07)' };
const tdStyle     = { padding: '12px 16px', color: 'rgba(255,255,255,0.75)', fontSize: 13 };
const btnStyle    = (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 9px', cursor: 'pointer', fontSize: 13 });