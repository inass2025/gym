import { useEffect, useState } from "react";
import axios from "axios";
import "./GestionCours.css";

const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

export default function GestionCours() {
  const [cours, setCours] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [form, setForm] = useState({ nom: "", date: "", heur: "", capacite: "", salle: "", coach_id: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    axios.get(`${API}/cours`, { headers }).then(r => setCours(r.data.data || r.data));
    axios.get(`${API}/coaches-list`, { headers }).then(r => setCoaches(r.data));
  }, []);

  const handleSave = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/cours/${editId}`, form, { headers });
        setMessage("Cours modifié avec succès.");
      } else {
        await axios.post(`${API}/cours`, form, { headers });
        setMessage("Cours ajouté avec succès.");
      }
      setForm({ nom: "", date: "", heur: "", capacite: "", salle: "", coach_id: "" });
      setEditId(null);
      const r = await axios.get(`${API}/cours`, { headers });
      setCours(r.data.data || r.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur");
    }
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setForm({ nom: c.nom, date: c.date, heur: c.heur, capacite: c.capacite, salle: c.salle, coach_id: c.coach_id });
  };

  const handleDelete = async (id) => {
    if (confirmId !== id) { setConfirmId(id); return; }
    await axios.delete(`${API}/cours/${id}`, { headers });
    setCours(cours.filter(c => c.id !== id));
    setMessage("Cours supprimé.");
    setConfirmId(null);
  };

  return (
    <div className="gc-page">

      {/* En-tête */}
      <div className="gc-entete">
        <div>
          <h1 className="gc-titre">Gestion des <span>Cours</span></h1>
          <p className="gc-sous-titre">Ajouter, modifier ou supprimer les cours</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="gc-message">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {/* Formulaire */}
      <div className="gc-carte">
        <p className="gc-carte-titre">{editId ? "✏️ Modifier le cours" : "➕ Nouveau cours"}</p>
        <div className="gc-form">
          <div className="gc-ligne">
            <div className="gc-champ">
              <label className="gc-label">Nom</label>
              <input className="gc-input" placeholder="Nom du cours" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div className="gc-champ">
              <label className="gc-label">Salle</label>
              <input className="gc-input" placeholder="Salle" value={form.salle} onChange={e => setForm({ ...form, salle: e.target.value })} />
            </div>
          </div>
          <div className="gc-ligne">
            <div className="gc-champ">
              <label className="gc-label">Date</label>
              <input className="gc-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="gc-champ">
              <label className="gc-label">Heure</label>
              <input className="gc-input" type="time" value={form.heur} onChange={e => setForm({ ...form, heur: e.target.value })} />
            </div>
          </div>
          <div className="gc-ligne">
            <div className="gc-champ">
              <label className="gc-label">Capacité</label>
              <input className="gc-input" type="number" placeholder="Capacité" value={form.capacite} onChange={e => setForm({ ...form, capacite: e.target.value })} />
            </div>
            <div className="gc-champ">
              <label className="gc-label">Coach</label>
              <select className="gc-input" value={form.coach_id} onChange={e => setForm({ ...form, coach_id: e.target.value })}>
                <option value="">-- Choisir un coach --</option>
                {coaches.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
              </select>
            </div>
          </div>
          <div className="gc-boutons">
            <button className="gc-btn-submit" onClick={handleSave}>{editId ? "Modifier" : "Ajouter"}</button>
            {editId && (
              <button className="gc-btn-annuler" onClick={() => { setEditId(null); setForm({ nom: "", date: "", heur: "", capacite: "", salle: "", coach_id: "" }); }}>
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="gc-table-wrapper">
        <table className="gc-table">
          <thead>
            <tr>
              {["Nom", "Date", "Heure", "Salle", "Coach", "Places", "Actions"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cours.map(c => (
              <tr key={c.id}>
                <td className="td-nom">{c.nom}</td>
                <td>{c.date}</td>
                <td>{c.heur}</td>
                <td>{c.salle}</td>
                <td className="td-coach">{c.coach?.nom} {c.coach?.prenom}</td>
                <td>
                  <span className={c.reservation_count >= c.capacite ? "badge-plein" : "badge-dispo"}>
                    <span className="dot"></span>
                    {c.reservation_count || 0}/{c.capacite}
                  </span>
                </td>
                <td>
                  <div className="td-actions">
                    <button className="btn-modifier" onClick={() => handleEdit(c)}>✏️ Modifier</button>
                    <button
                      className={confirmId === c.id ? "btn-confirm" : "btn-supprimer"}
                      onClick={() => handleDelete(c.id)}
                    >
                      {confirmId === c.id ? "⚠️ Confirmer" : "🗑️ Supprimer"}
                    </button>
                    {confirmId === c.id && (
                      <button className="gc-btn-annuler" onClick={() => setConfirmId(null)}>Annuler</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cours.length === 0 && (
          <div className="gc-vide">
            <p>Aucun cours trouvé</p>
            <span>Ajoutez votre premier cours ci-dessus</span>
          </div>
        )}
      </div>
    </div>
  );
}