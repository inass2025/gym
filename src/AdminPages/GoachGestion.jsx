import { useState, useEffect } from "react";
import "./CoachGestion.css";

const API_URL = "http://localhost:8000/api/coachs";

export default function CoachGestion() {

  // =========================
  // STATES
  // =========================

  const [coachs, setCoachs]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [message, setMessage]             = useState("");
  const [showForm, setShowForm]           = useState(false);
  const [coachModifier, setCoachModifier] = useState(null);
  const [profil, setProfil]               = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    date_inscription: "",
    objectif: "",
  });


  // =========================
  // CHARGER LES COACHS
  // =========================

  useEffect(() => {
    chargerCoachs();
  }, []);

  async function chargerCoachs() {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCoachs(data);
    } catch {
      setMessage("Erreur chargement coachs");
    }
    setLoading(false);
  }


  // =========================
  // CHANGER INPUT
  // =========================

  function changerInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  // =========================
  // AJOUTER COACH
  // =========================

  function ouvrirAjout() {
    setCoachModifier(null);
    setForm({ nom: "", prenom: "", email: "", password: "", telephone: "", date_inscription: "", objectif: "" });
    setShowForm(true);
  }


  // =========================
  // MODIFIER COACH
  // =========================

  function ouvrirModification(coach) {
    setCoachModifier(coach);
    setForm({
      nom: coach.nom || "",
      prenom: coach.prenom || "",
      email: coach.email || "",
      password: "",
      telephone: coach.telephone || "",
      date_inscription: coach.date_inscription || "",
      objectif: coach.objectif || "",
    });
    setShowForm(true);
  }


  // =========================
  // ENREGISTRER
  // =========================

  async function enregistrer(e) {
    e.preventDefault();
    try {
      const methode = coachModifier ? "PUT" : "POST";
      const url     = coachModifier ? `${API_URL}/${coachModifier.id}` : API_URL;
      const response = await fetch(url, {
        method: methode,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error();
      setMessage(coachModifier ? "Coach modifié avec succès" : "Coach ajouté avec succès");
      setShowForm(false);
      chargerCoachs();
    } catch {
      setMessage("Erreur enregistrement");
    }
  }


  // =========================
  // SUPPRIMER
  // =========================

  async function supprimerCoach(id) {
    if (!window.confirm("Voulez-vous supprimer ce coach ?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setMessage("Coach supprimé");
      chargerCoachs();
    } catch {
      setMessage("Erreur suppression");
    }
  }


  // =========================
  // BLOQUER / DEBLOQUER
  // =========================

  async function bloquerCoach(id) {
    try {
      await fetch(`${API_URL}/${id}/bloquer`, { method: "PATCH" });
      chargerCoachs();
    } catch {
      setMessage("Erreur blocage");
    }
  }


  // =========================
  // PROFIL
  // =========================

  async function voirProfil(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      setProfil(data);
    } catch {
      setMessage("Erreur profil");
    }
  }


  // =========================
  // JSX
  // =========================

  return (
    <div className="cg-page">

      {/* ── EN-TÊTE ── */}
      <div className="cg-entete">
        <div>
          <h1 className="cg-titre">
            Gestion des <span>coachs</span>
          </h1>
          <p className="cg-sous-titre">
            Administrez vos coachs, statuts et profils
          </p>
        </div>

        <button className="cg-btn-primaire" onClick={ouvrirAjout}>
          + Ajouter coach
        </button>
      </div>


      {/* ── MESSAGE ── */}
      {message && (
        <div className="cg-message">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}


      {/* ── FORMULAIRE ── */}
      {showForm && (
        <div className="cg-carte">

          <h2 className="cg-carte-titre">
            {coachModifier ? "Modifier le coach" : "Nouveau coach"}
          </h2>

          <form className="cg-form" onSubmit={enregistrer}>

            {/* Ligne 1 : Nom / Prénom */}
            <div className="cg-ligne">
              <div className="cg-champ">
                <label className="cg-label">Nom</label>
                <input
                  className="cg-input"
                  type="text"
                  name="nom"
                  placeholder="Dupont"
                  value={form.nom}
                  onChange={changerInput}
                  required
                />
              </div>
              <div className="cg-champ">
                <label className="cg-label">Prénom</label>
                <input
                  className="cg-input"
                  type="text"
                  name="prenom"
                  placeholder="Marie"
                  value={form.prenom}
                  onChange={changerInput}
                  required
                />
              </div>
            </div>

            {/* Ligne 2 : Email / Mot de passe */}
            <div className="cg-ligne">
              <div className="cg-champ">
                <label className="cg-label">Email</label>
                <input
                  className="cg-input"
                  type="email"
                  name="email"
                  placeholder="coach@exemple.com"
                  value={form.email}
                  onChange={changerInput}
                  required
                />
              </div>
              <div className="cg-champ">
                <label className="cg-label">Mot de passe</label>
                <input
                  className="cg-input"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={changerInput}
                />
              </div>
            </div>

            {/* Ligne 3 : Téléphone / Date */}
            <div className="cg-ligne">
              <div className="cg-champ">
                <label className="cg-label">Téléphone</label>
                <input
                  className="cg-input"
                  type="text"
                  name="telephone"
                  placeholder="+33 6 00 00 00 00"
                  value={form.telephone}
                  onChange={changerInput}
                />
              </div>
              <div className="cg-champ">
                <label className="cg-label">Date d'inscription</label>
                <input
                  className="cg-input"
                  type="date"
                  name="date_inscription"
                  value={form.date_inscription}
                  onChange={changerInput}
                />
              </div>
            </div>

            {/* Objectif */}
            <div className="cg-champ">
              <label className="cg-label">Objectif</label>
              <input
                className="cg-input"
                type="text"
                name="objectif"
                placeholder="Ex : Perte de poids, Musculation…"
                value={form.objectif}
                onChange={changerInput}
              />
            </div>

            {/* Boutons */}
            <div className="cg-form-boutons">
              <button type="submit" className="cg-btn-submit">
                {coachModifier ? "Enregistrer" : "Ajouter"}
              </button>
              <button
                type="button"
                className="cg-btn-secondaire"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </button>
            </div>

          </form>
        </div>
      )}


      {/* ── TABLEAU ── */}
      {loading ? (
        <div className="cg-loading">Chargement…</div>
      ) : coachs.length === 0 ? (
        <div className="cg-vide">
          <p>Aucun coach enregistré</p>
          <span>Cliquez sur « + Ajouter coach » pour commencer</span>
        </div>
      ) : (
        <div className="cg-table-wrapper">
          <table className="cg-table">
            <thead>
              <tr className="cg-tr-head">
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coachs.map((coach) => (
                <tr key={coach.id} className="cg-tr-body cg-row">

                  <td className="td-nom">
                    {coach.prenom} {coach.nom}
                  </td>

                  <td className="td-email">{coach.email}</td>

                  <td className="td-tel">
                    {coach.telephone || "—"}
                  </td>

                  <td>
                    {coach.bloque ? (
                      <span className="badge-bloque">
                        <span className="badge-dot" />
                        Bloqué
                      </span>
                    ) : (
                      <span className="badge-actif">
                        <span className="badge-dot" />
                        Actif
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="td-actions">
                      <button
                        className="cg-btn-action cg-btn-profil"
                        onClick={() => voirProfil(coach.id)}
                      >
                        👤 Profil
                      </button>

                      <button
                        className="cg-btn-action cg-btn-modifier"
                        onClick={() => ouvrirModification(coach)}
                      >
                        ✎ Modifier
                      </button>

                      <button
                        className={`cg-btn-action ${coach.bloque ? "cg-btn-debloquer" : "cg-btn-bloquer"}`}
                        onClick={() => bloquerCoach(coach.id)}
                      >
                        {coach.bloque ? "↑ Débloquer" : "⊘ Bloquer"}
                      </button>

                      <button
                        className="cg-btn-action cg-btn-danger"
                        onClick={() => supprimerCoach(coach.id)}
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* ── MODAL PROFIL ── */}
      {profil && (
        <div className="cg-modal-fond" onClick={() => setProfil(null)}>
          <div className="cg-modal-boite" onClick={(e) => e.stopPropagation()}>

            <h2 className="cg-modal-titre">Profil coach</h2>
            <p className="cg-modal-sous-titre">Informations détaillées du coach</p>

            <div className="cg-profil-grid">
              {[
                ["Nom complet",  `${profil.prenom || "—"} ${profil.nom || ""}`],
                ["Email",        profil.email     || "—"],
                ["Téléphone",    profil.telephone || "—"],
                ["Statut",       profil.bloque ? "Bloqué" : "Actif"],
              ].map(([label, valeur]) => (
                <div key={label} className="cg-info-ligne">
                  <span className="cg-info-label">{label}</span>
                  <span className="cg-info-valeur">{valeur}</span>
                </div>
              ))}
            </div>

            <button className="cg-btn-fermer" onClick={() => setProfil(null)}>
              Fermer
            </button>

          </div>
        </div>
      )}

    </div>
  );
}