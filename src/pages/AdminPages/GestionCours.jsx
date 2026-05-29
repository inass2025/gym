import { useEffect, useState } from "react";
import axios from "axios";
import "./GestionCours.css";

const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

const FORM_VIDE = {
  nom: "", description: "", date: "", heur: "",
  capacite: "", salle: "", coach_id: ""
};

export default function GestionCours() {
  const [cours, setCours]       = useState([]);
  const [coaches, setCoaches]   = useState([]);
  const [form, setForm]         = useState(FORM_VIDE);
  const [editId, setEditId]     = useState(null);
  const [message, setMessage]   = useState("");
  const [isError, setIsError]   = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  // Chargement initial
  useEffect(() => {
    chargerCours();
    axios.get(`${API}/coaches-list`, { headers })
      .then(r => setCoaches(r.data));
  }, []);

  const chargerCours = () => {
    axios.get(`${API}/cours`, { headers })
      .then(r => setCours(r.data.data || r.data));
  };

  const afficherMessage = (msg, erreur = false) => {
    setMessage(msg);
    setIsError(erreur);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Validation basique côté client
    if (!form.nom || !form.date || !form.heur || !form.capacite || !form.salle || !form.coach_id) {
      afficherMessage("Veuillez remplir tous les champs obligatoires.", true);
      return;
    }

    const payload = {
      ...form,
      capacite: parseInt(form.capacite),
      coach_id: parseInt(form.coach_id),
    };

    try {
      if (editId) {
        await axios.put(`${API}/cours/${editId}`, payload, { headers });
        afficherMessage("Cours modifié avec succès.");
      } else {
        await axios.post(`${API}/cours`, payload, { headers });
        afficherMessage("Cours ajouté avec succès.");
      }
      setForm(FORM_VIDE);
      setEditId(null);
      chargerCours();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        afficherMessage(Object.values(errors).flat().join(" | "), true);
      } else {
        afficherMessage(err.response?.data?.message || "Erreur serveur.", true);
      }
    }
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setForm({
      nom:         c.nom         || "",
      description: c.description || "",
      date:        c.date        || "",
      heur:        c.heur        || "",
      capacite:    c.capacite    || "",
      salle:       c.salle       || "",
      coach_id:    c.coach_id    || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnnuler = () => {
    setEditId(null);
    setForm(FORM_VIDE);
  };

  const handleDelete = async (id) => {
    if (confirmId !== id) { setConfirmId(id); return; }
    try {
      await axios.delete(`${API}/cours/${id}`, { headers });
      setCours(cours.filter(c => c.id !== id));
      afficherMessage("Cours supprimé avec succès.");
    } catch {
      afficherMessage("Erreur lors de la suppression.", true);
    }
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
        <div className={`gc-message ${isError ? "gc-message-erreur" : ""}`}>
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {/* Formulaire */}
      <div className="gc-carte">
        <p className="gc-carte-titre">{editId ? "✏️ Modifier le cours" : "➕ Nouveau cours"}</p>
        <div className="gc-form">

          {/* Ligne 1 — Nom + Salle */}
          <div className="gc-ligne">
            <div className="gc-champ">
              <label className="gc-label">Nom *</label>
              <input
                className="gc-input"
                name="nom"
                placeholder="Nom du cours"
                value={form.nom}
                onChange={handleChange}
              />
            </div>
            <div className="gc-champ">
              <label className="gc-label">Salle *</label>
              <input
                className="gc-input"
                name="salle"
                placeholder="Salle"
                value={form.salle}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Ligne 2 — Date + Heure */}
          <div className="gc-ligne">
            <div className="gc-champ">
              <label className="gc-label">Date *</label>
              <input
                className="gc-input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div className="gc-champ">
              <label className="gc-label">Heure *</label>
              <input
                className="gc-input"
                type="time"
                name="heur"
                value={form.heur}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Ligne 3 — Capacité + Coach */}
          <div className="gc-ligne">
            <div className="gc-champ">
              <label className="gc-label">Capacité *</label>
              <input
                className="gc-input"
                type="number"
                name="capacite"
                placeholder="Capacité"
                min="1"
                value={form.capacite}
                onChange={handleChange}
              />
            </div>
            <div className="gc-champ">
              <label className="gc-label">Coach *</label>
              <select
                className="gc-input"
                name="coach_id"
                value={form.coach_id}
                onChange={handleChange}
              >
                <option value="">-- Choisir un coach --</option>
                {coaches.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 4 — Description (optionnel) */}
          <div className="gc-ligne">
            <div className="gc-champ" style={{ flex: 1 }}>
              <label className="gc-label">Description</label>
              <textarea
                className="gc-input"
                name="description"
                placeholder="Description du cours (optionnel)"
                value={form.description}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="gc-boutons">
            <button className="gc-btn-submit" onClick={handleSave}>
              {editId ? "💾 Modifier" : "➕ Ajouter"}
            </button>
            {editId && (
              <button className="gc-btn-annuler" onClick={handleAnnuler}>
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
                    <button className="btn-modifier" onClick={() => handleEdit(c)}>
                      ✏️ Modifier
                    </button>
                    <button
                      className={confirmId === c.id ? "btn-confirm" : "btn-supprimer"}
                      onClick={() => handleDelete(c.id)}
                    >
                      {confirmId === c.id ? "⚠️ Confirmer" : "🗑️ Supprimer"}
                    </button>
                    {confirmId === c.id && (
                      <button className="gc-btn-annuler" onClick={() => setConfirmId(null)}>
                        Annuler
                      </button>
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