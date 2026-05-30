import { useEffect, useState } from "react";
import api from "./api";
import "./Performances.css";
import {
  BarChart2,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Scale,
  Target,
  Inbox,
} from "lucide-react";

export default function Performances() {
  const [perfs, setPerfs]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({
    poids: "", taille: "", date_suivi: "", objectif: ""
  });

  const fetchPerfs = () => {
    api.get("/performance")
      .then(res => setPerfs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPerfs(); }, []);

  const handleSubmit = () => {
    api.post("/performance", form)
      .then(() => {
        setShowForm(false);
        setForm({ poids: "", taille: "", date_suivi: "", objectif: "" });
        fetchPerfs();
      })
      .catch((err) => {
        alert(JSON.stringify(err.response?.data?.errors));
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Supprimer cette entrée ?")) return;
    api.delete(`/performance/${id}`)
      .then(() => fetchPerfs());
  };

  const premier  = perfs[0];
  const dernier  = perfs[perfs.length - 1];
  const diff     = dernier && premier
    ? (dernier.poids - premier.poids).toFixed(1)
    : null;
  const imc      = dernier
    ? (dernier.poids / ((dernier.taille / 100) ** 2)).toFixed(1)
    : null;
  const objectif = dernier?.objectif;
  const reste    = objectif && dernier
    ? (dernier.poids - objectif).toFixed(1)
    : null;

  const imcLabel = (imc) => {
    if (imc < 18.5) return { label: "Insuffisance", color: "#3b82f6" };
    if (imc < 25)   return { label: "Normal",       color: "#7ec8e3" };
    if (imc < 30)   return { label: "Surpoids",     color: "#e8728a" };
    return               { label: "Obésité",         color: "#f73158" };
  };

  if (loading) return <p className="performances-loading">Chargement...</p>;

  return (
    <div className="performances-container">

      {/* Header */}
      <div className="performances-header">
        <div>
          <h2><BarChart2 size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />Mes Performances</h2>
          <p>Suivez votre progression dans le temps</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          <Plus size={16} /> Ajouter une mesure
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="performances-form">
          <h3>Nouvelle mesure</h3>
          <div className="form-grid">
            {[
              { key: "poids",      label: "Poids (kg)",    type: "number", placeholder: "ex: 80" },
              { key: "taille",     label: "Taille (cm)",   type: "number", placeholder: "ex: 175" },
              { key: "date_suivi", label: "Date",          type: "date",   placeholder: "" },
              { key: "objectif",   label: "Objectif (kg)", type: "number", placeholder: "ex: 70" },
            ].map(f => (
              <div key={f.key} className="form-field">
                <label>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button onClick={handleSubmit} className="btn-save">Enregistrer</button>
            <button onClick={() => setShowForm(false)} className="btn-cancel">Annuler</button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      {dernier && (
        <div className="stats-cards">
          <div className="stat-card">
            <p className="stat-label"><Scale size={14} style={{ marginRight: 5 }} />Poids actuel</p>
            <h3 className="stat-value" style={{ color: "#3D4F5A" }}>{dernier.poids} kg</h3>
            <p className="stat-sub">Départ : {premier.poids} kg</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">
              {diff < 0
                ? <TrendingDown size={14} style={{ marginRight: 5 }} />
                : <TrendingUp size={14} style={{ marginRight: 5 }} />
              }
              Progression
            </p>
            <h3 className="stat-value" style={{ color: diff < 0 ? "#22c55e" : "#ef4444" }}>
              {diff > 0 ? "+" : ""}{diff} kg
            </h3>
            <p className="stat-sub">{diff < 0 ? "Bonne progression" : "Continuez"}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label"><BarChart2 size={14} style={{ marginRight: 5 }} />IMC</p>
            <h3 className="stat-value" style={{ color: imcLabel(imc).color }}>{imc}</h3>
            <p className="stat-sub">{imcLabel(imc).label}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label"><Target size={14} style={{ marginRight: 5 }} />Reste objectif</p>
            <h3 className="stat-value" style={{ color: "#7ec8e3" }}>{reste ? `${reste} kg` : "—"}</h3>
            <p className="stat-sub">{objectif ? `Objectif : ${objectif} kg` : "Pas défini"}</p>
          </div>
        </div>
      )}

      {/* Historique Table */}
      {perfs.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} className="empty-icon" />
          <p className="empty-title">Aucune mesure enregistrée</p>
          <p className="empty-text">Cliquez sur "Ajouter une mesure" pour commencer</p>
        </div>
      ) : (
        <div className="history-table">
          <div className="table-header">
            <span>Historique des mesures</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Poids (kg)</th>
                <th>Taille (cm)</th>
                <th>IMC</th>
                <th>Objectif (kg)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...perfs].reverse().map((p) => {
                const imcVal = (p.poids / ((p.taille / 100) ** 2)).toFixed(1);
                const { color } = imcLabel(imcVal);
                return (
                  <tr key={p.id}>
                    <td>{p.date_suivi}</td>
                    <td className="fw-600">{p.poids}</td>
                    <td>{p.taille}</td>
                    <td>
                      <span className="imc-badge" style={{ background: color + "20", color }}>
                        {imcVal}
                      </span>
                    </td>
                    <td>{p.objectif ?? "—"}</td>
                    <td>
                      <button onClick={() => handleDelete(p.id)} className="btn-delete">
                        <Trash2 size={14} />
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
  );
}