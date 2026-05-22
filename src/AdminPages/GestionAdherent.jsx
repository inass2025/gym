import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:8000/api/adherent";

const statutColors = {
  actif: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  inactif: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  suspendu: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

const emptyForm = {
  nom: "", prenom: "", email: "", telephone: "",
  adresse: "", date_naissance: "", date_adhesion: "", statut: "actif",
};

export default function GestionAdherent() {
  const [adherents, setAdherents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [page, setPage] = useState(1);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdherents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: 8 });
      if (search) params.append("search", search);
      if (statutFilter) params.append("statut", statutFilter);
      const res = await fetch(`${API_URL}?${params}`);
      const data = await res.json();
      setAdherents(data.data || []);
      setPagination({ current_page: data.current_page, last_page: data.last_page, total: data.total });
    } catch {
      showToast("Erreur de connexion au serveur.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statutFilter]);

  useEffect(() => { fetchAdherents(); }, [fetchAdherents]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search, statutFilter]);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setEditMode(false);
    setCurrentId(null);
    setShowModal(true);
  };

  const openEdit = (adherent) => {
    setForm({
      nom: adherent.nom || "",
      prenom: adherent.prenom || "",
      email: adherent.email || "",
      telephone: adherent.telephone || "",
      adresse: adherent.adresse || "",
      date_naissance: adherent.date_naissance ? adherent.date_naissance.split("T")[0] : "",
      date_adhesion: adherent.date_adhesion ? adherent.date_adhesion.split("T")[0] : "",
      statut: adherent.statut || "actif",
    });
    setErrors({});
    setEditMode(true);
    setCurrentId(adherent.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setErrors({});
    try {
      const url = editMode ? `${API_URL}/${currentId}` : API_URL;
      const method = editMode ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else showToast(data.message || "Une erreur s'est produite.", "error");
        return;
      }
      showToast(editMode ? "Adhérent modifié avec succès !" : "Adhérent ajouté avec succès !");
      setShowModal(false);
      fetchAdherents();
    } catch {
      showToast("Erreur de connexion au serveur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Adhérent supprimé avec succès !");
      setDeleteTarget(null);
      fetchAdherents();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const initials = (a) => `${a.prenom?.[0] || ""}${a.nom?.[0] || ""}`.toUpperCase();
  const avatarColor = (id) => {
    const colors = ["#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#3b82f6"];
    return colors[id % colors.length];
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f1f5f9", padding: "24px" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.type === "error" ? "#ef4444" : "#10b981",
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)", fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8, fontSize: 14,
          animation: "fadeIn .3s ease"
        }}>
          {toast.type === "error" ? "✕" : "✓"} {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1e293b" }}>
              👥 Gestion des Adhérents
            </h1>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>
              {pagination.total ?? "—"} adhérent(s) au total
            </p>
          </div>
          <button onClick={openAdd} style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "12px 22px", fontWeight: 700, fontSize: 15,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 14px rgba(99,102,241,0.4)"
          }}>
            + Nouvel adhérent
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="🔍 Rechercher par nom, prénom, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 220, padding: "10px 14px",
              borderRadius: 8, border: "1.5px solid #e2e8f0",
              fontSize: 14, background: "#fff", outline: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
            }}
          />
          <select
            value={statutFilter}
            onChange={e => setStatutFilter(e.target.value)}
            style={{
              padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0",
              fontSize: 14, background: "#fff", color: "#374151", cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
              Chargement...
            </div>
          ) : adherents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>📭</div>
              <p>Aucun adhérent trouvé</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["Adhérent","Email","Téléphone","Date d'adhésion","Statut","Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adherents.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%",
                          background: avatarColor(a.id),
                          color: "#fff", display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0
                        }}>{initials(a)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{a.prenom} {a.nom}</div>
                          {a.adresse && <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.adresse}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{a.email}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{a.telephone || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>
                      {a.date_adhesion ? new Date(a.date_adhesion).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: statutColors[a.statut]?.bg,
                        color: statutColors[a.statut]?.text,
                        padding: "4px 10px", borderRadius: 20,
                        fontSize: 12, fontWeight: 600,
                        display: "inline-flex", alignItems: "center", gap: 5
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statutColors[a.statut]?.dot, display: "inline-block" }} />
                        {a.statut.charAt(0).toUpperCase() + a.statut.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(a)} style={{
                          background: "#eff6ff", color: "#3b82f6", border: "none",
                          borderRadius: 7, padding: "7px 12px", fontWeight: 600,
                          fontSize: 12, cursor: "pointer"
                        }}>✏️ Modifier</button>
                        <button onClick={() => setDeleteTarget(a)} style={{
                          background: "#fff1f2", color: "#ef4444", border: "none",
                          borderRadius: 7, padding: "7px 12px", fontWeight: 600,
                          fontSize: 12, cursor: "pointer"
                        }}>🗑️ Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 36, height: 36, borderRadius: 8,
                border: p === pagination.current_page ? "none" : "1.5px solid #e2e8f0",
                background: p === pagination.current_page ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#fff",
                color: p === pagination.current_page ? "#fff" : "#374151",
                fontWeight: p === pagination.current_page ? 700 : 400,
                cursor: "pointer", fontSize: 14
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* ===== MODAL AJOUT / MODIFICATION ===== */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden"
          }}>
            {/* Modal header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
                {editMode ? "✏️ Modifier l'adhérent" : "➕ Nouvel adhérent"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: "#f1f5f9", border: "none", width: 32, height: 32,
                borderRadius: 8, cursor: "pointer", fontSize: 16, color: "#64748b"
              }}>✕</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "70vh", overflowY: "auto" }}>
              {[
                { name: "nom", label: "Nom *", type: "text", span: 1 },
                { name: "prenom", label: "Prénom *", type: "text", span: 1 },
                { name: "email", label: "Email *", type: "email", span: 2 },
                { name: "telephone", label: "Téléphone", type: "text", span: 1 },
                { name: "date_naissance", label: "Date de naissance", type: "date", span: 1 },
                { name: "date_adhesion", label: "Date d'adhésion", type: "date", span: 1 },
                { name: "statut", label: "Statut", type: "select", span: 1 },
                { name: "adresse", label: "Adresse", type: "text", span: 2 },
              ].map(field => (
                <div key={field.name} style={{ gridColumn: `span ${field.span}` }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>{field.label}</label>
                  {field.type === "select" ? (
                    <select name={field.name} value={form[field.name]} onChange={handleChange} style={inputStyle(errors[field.name])}>
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                      <option value="suspendu">Suspendu</option>
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      style={inputStyle(errors[field.name])}
                    />
                  )}
                  {errors[field.name] && (
                    <p style={{ margin: "4px 0 0", color: "#ef4444", fontSize: 11 }}>{errors[field.name][0]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{
                background: "#f8fafc", color: "#64748b", border: "1.5px solid #e2e8f0",
                borderRadius: 9, padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14
              }}>Annuler</button>
              <button onClick={handleSubmit} disabled={saving} style={{
                background: saving ? "#a5b4fc" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", border: "none", borderRadius: 9,
                padding: "10px 24px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: 14
              }}>
                {saving ? "Enregistrement..." : editMode ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL SUPPRESSION ===== */}
      {deleteTarget && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16
        }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 28, textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", color: "#1e293b", fontSize: 18 }}>Confirmer la suppression</h3>
            <p style={{ color: "#64748b", margin: "0 0 24px", fontSize: 14 }}>
              Voulez-vous vraiment supprimer <strong>{deleteTarget.prenom} {deleteTarget.nom}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} style={{
                background: "#f8fafc", color: "#64748b", border: "1.5px solid #e2e8f0",
                borderRadius: 9, padding: "10px 22px", fontWeight: 600, cursor: "pointer", fontSize: 14
              }}>Annuler</button>
              <button onClick={handleDelete} disabled={deleting} style={{
                background: deleting ? "#fca5a5" : "linear-gradient(135deg,#ef4444,#dc2626)",
                color: "#fff", border: "none", borderRadius: 9,
                padding: "10px 22px", fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", fontSize: 14
              }}>
                {deleting ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

function inputStyle(hasError) {
  return {
    width: "100%", padding: "9px 12px", boxSizing: "border-box",
    borderRadius: 8, border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
    fontSize: 14, outline: "none", background: "#fff",
    transition: "border-color .2s"
  };
}