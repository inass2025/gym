import { useEffect, useState } from "react";
import "./GestionAdherent.css";
import { Plus, Search, User, Pencil, Ban, Trash2, Bell, X } from "lucide-react";

const API_URL = "http://localhost:8000/api/adherents";
const token = () => localStorage.getItem("token");

export default function GestionAdherent() {

  const [adherents, setAdherents]       = useState([]);
  const [search, setSearch]             = useState("");
  const [message, setMessage]           = useState("");
  const [profil, setProfil]             = useState(null);
  const [notifTarget, setNotifTarget]   = useState(null);
  const [notifForm, setNotifForm]       = useState({ message: "", type: "admin" });
  const [notifLoading, setNotifLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", password: "",
    telephone: "", date_inscription: "", objectif: "",
  });

  const [editId, setEditId]             = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Charger ───────────────────────────────────────────────────────────────
  const getAdherents = async () => {
    try {
      const res  = await fetch(API_URL);
      const data = await res.json();
      setAdherents(data.data || data);
    } catch {
      setMessage("Erreur serveur");
    }
  };

  useEffect(() => { getAdherents(); }, []);

  // ── Form helpers ──────────────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const ouvrirAjout = () => {
    setForm({ nom: "", prenom: "", email: "", password: "", telephone: "", date_inscription: "", objectif: "" });
    setEditId(null);
    setShowForm(true);
  };

  const ouvrirModification = (a) => {
    setForm({
      nom: a.nom || "", prenom: a.prenom || "", email: a.email || "",
      password: "", telephone: a.telephone || "",
      date_inscription: a.date_inscription || "", objectif: a.objectif || "",
    });
    setEditId(a.id);
    setShowForm(true);
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url    = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setMessage(editId ? "Adhérent modifié avec succès !" : "Adhérent ajouté avec succès !");
      setShowForm(false);
      setEditId(null);
      getAdherents();
    } catch {
      setMessage("Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_URL}/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessage("Adhérent supprimé avec succès !");
      setDeleteTarget(null);
      getAdherents();
    } catch {
      setMessage("Erreur lors de la suppression.");
    }
  };

  const handleBloquer = async (a) => {
    try {
      await fetch(`${API_URL}/${a.id}/bloquer`, { method: "PATCH" });
      setMessage(a.bloque ? "Adhérent débloqué !" : "Adhérent bloqué !");
      getAdherents();
    } catch {
      setMessage("Erreur lors du blocage.");
    }
  };

  const voirProfil = async (id) => {
    try {
      const res  = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      setProfil(data);
    } catch {
      setMessage("Erreur chargement profil.");
    }
  };

  // ── Notification ──────────────────────────────────────────────────────────
  const ouvrirNotif = (a) => {
    setNotifTarget(a);
    setNotifForm({ messagemaf: "", type: "admin" });
  };

  const handleEnvoyerNotif = async () => {
    if (!notifForm.message.trim()) {
      setMessage("Veuillez écrire un message.");
      return;
    }
    setNotifLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          adherent_id: notifTarget.id,
          message:     notifForm.message,
          type:        notifForm.type,
        }),
      });
      if (!res.ok) throw new Error();
      setMessage(`Notification envoyée à ${notifTarget.prenom} ${notifTarget.nom} !`);
      setNotifTarget(null);
    } catch {
      setMessage("Erreur lors de l'envoi.");
    } finally {
      setNotifLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const adherentsFiltres = adherents.filter((a) =>
    `${a.nom} ${a.prenom} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (a) => `${a.prenom?.[0] || ""}${a.nom?.[0] || ""}`.toUpperCase();
  const avatarBg = (id) => {
    const colors = ["#73795D","#3D4F5A","#8FAF88","#B89A5E","#C4796A","#7EA8BE"];
    return colors[(id || 0) % colors.length];
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="ag-page">

      {/* ── EN-TÊTE ── */}
      <div className="ag-entete">
        <div>
          <h1 className="ag-titre">Gestion des <span>adhérents</span></h1>
          <p className="ag-sous-titre">{adherents.length} adhérent(s) enregistré(s)</p>
        </div>
        <button className="ag-btn-primaire" onClick={ouvrirAjout}>
          <Plus size={16} /> Nouvel adhérent
        </button>
      </div>

      {/* ── MESSAGE ── */}
      {message && (
        <div className="ag-message">
          <span>{message}</span>
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {/* ── RECHERCHE ── */}
      <div style={{ marginBottom: 24, position: "relative", maxWidth: 400 }}>
        <Search size={16} style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", color: "#73795D",
        }} />
        <input
          className="ag-input"
          type="text"
          placeholder="Rechercher par nom, prénom, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 36, width: "100%" }}
        />
      </div>

      {/* ── TABLEAU ── */}
      {adherentsFiltres.length === 0 ? (
        <div className="ag-vide">
          <p>Aucun adhérent trouvé</p>
          <span>Cliquez sur « + Nouvel adhérent » pour commencer</span>
        </div>
      ) : (
        <div className="ag-table-wrapper">
          <table className="ag-table">
            <thead>
              <tr className="ag-tr-head">
                <th>Adhérent</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Date inscription</th>
                <th>Objectif</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adherentsFiltres.map((a) => (
                <tr key={a.id} className="ag-tr-body ag-row">

                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: avatarBg(a.id), color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 13, flexShrink: 0,
                      }}>
                        {initials(a)}
                      </div>
                      <div className="td-nom">{a.prenom} {a.nom}</div>
                    </div>
                  </td>

                  <td className="td-email">{a.email || "—"}</td>
                  <td className="td-tel">{a.telephone || "—"}</td>
                  <td className="td-tel">{a.date_inscription || "—"}</td>
                  <td className="td-tel">{a.objectif || "—"}</td>

                  <td>
                    {a.bloque
                      ? <span className="badge-bloque"><span className="badge-dot" /> Bloqué</span>
                      : <span className="badge-actif"><span className="badge-dot" /> Actif</span>
                    }
                  </td>

                  <td>
                    <div className="td-actions">
                      <button className="ag-btn-action ag-btn-profil" onClick={() => voirProfil(a.id)}>
                        <User size={13} /> Profil
                      </button>
                      <button className="ag-btn-action ag-btn-modifier" onClick={() => ouvrirModification(a)}>
                        <Pencil size={13} /> Modifier
                      </button>
                      <button className="ag-btn-action ag-btn-notif" onClick={() => ouvrirNotif(a)}>
                        <Bell size={13} /> Notifier
                      </button>
                      <button
                        className={`ag-btn-action ${a.bloque ? "ag-btn-debloquer" : "ag-btn-bloquer"}`}
                        onClick={() => handleBloquer(a)}
                      >
                        <Ban size={13} /> {a.bloque ? "Débloquer" : "Bloquer"}
                      </button>
                      <button className="ag-btn-action ag-btn-danger" onClick={() => setDeleteTarget(a)}>
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* ══════════════════════════════════
          MODAL — NOTIFICATION
      ══════════════════════════════════ */}
      {notifTarget && (
        <div className="ag-modal-fond" onClick={() => setNotifTarget(null)}>
          <div className="ag-modal-boite" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: avatarBg(notifTarget.id), color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14,
              }}>
                {initials(notifTarget)}
              </div>
              <div>
                <h2 className="ag-modal-titre" style={{ marginBottom: 2 }}>
                  Envoyer une notification
                </h2>
                <p className="ag-modal-sous-titre" style={{ margin: 0 }}>
                  À : <strong>{notifTarget.prenom} {notifTarget.nom}</strong>
                </p>
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 0" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="ag-label">Type</label>
                <select
                  className="ag-input"
                  value={notifForm.type}
                  onChange={(e) => setNotifForm(p => ({ ...p, type: e.target.value }))}
                  style={{ background: "#2E2C26", color: "#F0EDE8" }}
                >
                  <option value="admin">Général</option>
                  <option value="abonnement_expire">Abonnement expiré</option>
                  <option value="rappel">Rappel séance</option>
                  <option value="paiement">Paiement</option>
                </select>
              </div>

              <div>
                <label className="ag-label">Message *</label>
                <textarea
                  className="ag-input"
                  rows={4}
                  placeholder="Rédigez votre message ici…"
                  value={notifForm.message}
                  onChange={(e) => setNotifForm(p => ({ ...p, message: e.target.value }))}
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <div className="ag-form-boutons" style={{ marginTop: 20 }}>
              <button
                className="ag-btn-submit"
                onClick={handleEnvoyerNotif}
                disabled={notifLoading}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                {notifLoading ? "Envoi…" : <><Bell size={14} /> Envoyer</>}
              </button>
              <button className="ag-btn-secondaire" onClick={() => setNotifTarget(null)}>
                Annuler
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ══════════════════════════════════
          MODAL — FORMULAIRE
      ══════════════════════════════════ */}
      {showForm && (
        <div className="ag-modal-fond" onClick={() => setShowForm(false)}>
          <div className="ag-modal-boite" onClick={(e) => e.stopPropagation()}>

            <h2 className="ag-modal-titre">
              {editId ? "Modifier l'adhérent" : "Nouvel adhérent"}
            </h2>
            <p className="ag-modal-sous-titre">
              {editId ? "Mettez à jour les informations" : "Remplissez les informations du nouvel adhérent"}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="ag-modal-grid">
                <div>
                  <label className="ag-label">Nom *</label>
                  <input className="ag-input" type="text" name="nom"
                    placeholder="Dupont" value={form.nom} onChange={handleChange} required />
                </div>
                <div>
                  <label className="ag-label">Prénom *</label>
                  <input className="ag-input" type="text" name="prenom"
                    placeholder="Marie" value={form.prenom} onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label className="ag-label">Email *</label>
                  <input className="ag-input" type="email" name="email"
                    placeholder="adherent@exemple.com" value={form.email} onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label className="ag-label">Mot de passe</label>
                  <input className="ag-input" type="password" name="password"
                    placeholder={editId ? "Laisser vide pour ne pas changer" : "••••••••"}
                    value={form.password} onChange={handleChange} />
                </div>
                <div>
                  <label className="ag-label">Téléphone</label>
                  <input className="ag-input" type="text" name="telephone"
                    placeholder="+212 6 00 00 00 00" value={form.telephone} onChange={handleChange} />
                </div>
                <div>
                  <label className="ag-label">Date d'inscription</label>
                  <input className="ag-input" type="date" name="date_inscription"
                    value={form.date_inscription} onChange={handleChange} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label className="ag-label">Objectif</label>
                  <input className="ag-input" type="text" name="objectif"
                    placeholder="Ex : Perte de poids, Musculation…" value={form.objectif} onChange={handleChange} />
                </div>
              </div>

              <div className="ag-form-boutons">
                <button type="submit" className="ag-btn-submit">
                  {editId ? "Mettre à jour" : "Ajouter"}
                </button>
                <button type="button" className="ag-btn-secondaire" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
              </div>
            </form>

          </div>
        </div>
      )}


      {/* ══════════════════════════════════
          MODAL — SUPPRESSION
      ══════════════════════════════════ */}
      {deleteTarget && (
        <div className="ag-modal-fond" onClick={() => setDeleteTarget(null)}>
          <div className="ag-modal-boite" onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 420, textAlign: "center" }}>
            <div className="ag-delete-icon"><Trash2 size={32} /></div>
            <h3 className="ag-delete-title">Confirmer la suppression</h3>
            <p className="ag-delete-text">
              Voulez-vous vraiment supprimer{" "}
              <strong>{deleteTarget.prenom} {deleteTarget.nom}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="ag-form-boutons" style={{ justifyContent: "center" }}>
              <button
                className="ag-btn-action ag-btn-danger"
                style={{ padding: "10px 24px", fontSize: 13 }}
                onClick={handleDelete}
              >
                <Trash2 size={13} /> Oui, supprimer
              </button>
              <button className="ag-btn-secondaire" onClick={() => setDeleteTarget(null)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════
          MODAL — PROFIL
      ══════════════════════════════════ */}
      {profil && (
        <div className="ag-modal-fond" onClick={() => setProfil(null)}>
          <div className="ag-modal-boite" onClick={(e) => e.stopPropagation()}>

            <h2 className="ag-modal-titre">Profil adhérent</h2>
            <p className="ag-modal-sous-titre">Informations détaillées</p>

            <div className="ag-profil-grid">
              {[
                ["Nom complet",      `${profil.prenom || "—"} ${profil.nom || ""}`],
                ["Email",            profil.email            || "—"],
                ["Téléphone",        profil.telephone        || "—"],
                ["Date inscription", profil.date_inscription || "—"],
                ["Objectif",         profil.objectif         || "—"],
                ["Statut",           profil.bloque ? "Bloqué" : "Actif"],
              ].map(([label, valeur]) => (
                <div key={label} className="ag-info-ligne">
                  <span className="ag-info-label">{label}</span>
                  <span className="ag-info-valeur">{valeur}</span>
                </div>
              ))}
            </div>

            <button className="ag-btn-fermer" onClick={() => setProfil(null)}>
              Fermer
            </button>

          </div>
        </div>
      )}

    </div>
  );
}