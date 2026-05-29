// src/pages/AdminPages/DashboardAdmin.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardAdmin.css";

const API   = "http://localhost:8000/api";
const token = () => localStorage.getItem("token");
const auth  = () => ({ headers: { Authorization: `Bearer ${token()}` } });

export default function DashboardAdmin() {
  const [stats, setStats]       = useState(null);
  const [recent, setRecent]     = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/paiements/statistiques`, auth()).catch(() => ({ data: null })),
      axios.get(`${API}/adherents`,              auth()).catch(() => ({ data: [] })),
      axios.get(`${API}/abonnements/all`,        auth()).catch(() => ({ data: [] })),
      axios.get(`${API}/coachs`,                 auth()).catch(() => ({ data: [] })),
      axios.get(`${API}/cours`,                  auth()).catch(() => ({ data: [] })),
    ]).then(([paiRes, adhRes, aboRes, coachRes, coursRes]) => {
      const adherents   = adhRes.data?.data   || adhRes.data   || [];
      const abonnements = aboRes.data?.data   || aboRes.data   || [];
      const coachs      = coachRes.data?.data || coachRes.data || [];
      const cours       = coursRes.data?.data || coursRes.data || [];
      const paiStats    = paiRes.data;

      setStats({
        adherents:  adherents.length,
        coachs:     coachs.length,
        cours:      cours.length,
        revenus:    paiStats?.total_revenus       ?? "—",
        ce_mois:    paiStats?.revenus_ce_mois     ?? "—",
        en_retard:  paiStats?.paiements_en_retard ?? 0,
        total_pai:  paiStats?.total_paiements     ?? "—",
        actifs:     abonnements.filter(a => a.statut === "actif").length,
        expires:    abonnements.filter(a => a.statut === "expire").length,
      });

      setRecent([...adherents].reverse().slice(0, 5));

      const now  = new Date();
      const soon = new Date(now);
      soon.setDate(now.getDate() + 7);
      setExpiring(
        abonnements.filter(a => {
          if (!a.date_fin) return false;
          const d = new Date(a.date_fin);
          return d >= now && d <= soon && a.statut === "actif";
        }).slice(0, 5)
      );
    }).finally(() => setLoading(false));
  }, []);

  const initials = (a) =>
    `${a.prenom?.[0] || ""}${a.nom?.[0] || ""}`.toUpperCase() || "?";

  const avatarBg = (id) => {
    const colors = ["#73795D","#3D4F5A","#8FAF88","#B89A5E","#C4796A","#7EA8BE"];
    return colors[(id || 0) % colors.length];
  };

  if (loading) return (
    <div className="db-loading">
      <i className="ti ti-loader-2 db-spin" />
      <span>Chargement…</span>
    </div>
  );

  const STAT_CARDS = [
    { icon: "ti-users",          label: "Adhérents",           value: stats.adherents,              cls: "db-stat-sage"  },
    { icon: "ti-user-star",      label: "Coachs",              value: stats.coachs,                 cls: "db-stat-slate" },
    { icon: "ti-calendar-event", label: "Cours",               value: stats.cours,                  cls: "db-stat-green" },
    { icon: "ti-receipt",        label: "Abonnements actifs",  value: stats.actifs,                 cls: "db-stat-amber" },
    { icon: "ti-coin",           label: "Total revenus",       value: `${stats.revenus} MAD`,       cls: "db-stat-sage"  },
    { icon: "ti-calendar-stats", label: "Revenus ce mois",     value: `${stats.ce_mois} MAD`,      cls: "db-stat-slate" },
    { icon: "ti-alert-triangle", label: "Paiements en retard", value: stats.en_retard,              cls: "db-stat-red"   },
    { icon: "ti-calendar-x",    label: "Abonnements expirés", value: stats.expires,                cls: "db-stat-red"   },
  ];

  return (
    <div className="db-page">

      {/* ── EN-TÊTE ── */}
      <div className="db-entete">
        <div>
          <h1 className="db-titre">Tableau de <span>bord</span></h1>
          <p className="db-sous-titre">Vue d'ensemble de votre salle de sport</p>
        </div>
      </div>

      {/* ── CARTES STATS ── */}
      <div className="db-stats-grid">
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

      {/* ── BOTTOM ROW ── */}
      <div className="db-bottom-grid">

        {/* Derniers adhérents */}
        <div className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-titre">
              <i className="ti ti-users" /> Derniers adhérents
            </h2>
          </div>
          {recent.length === 0 ? (
            <p className="db-empty">Aucun adhérent enregistré.</p>
          ) : (
            <table className="db-table">
              <thead>
                <tr>
                  <th>Adhérent</th>
                  <th>Email</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="db-member-cell">
                        <div className="db-avatar-sm" style={{ background: avatarBg(a.id) }}>
                          {initials(a)}
                        </div>
                        <span className="db-member-name">{a.prenom} {a.nom}</span>
                      </div>
                    </td>
                    <td className="db-td-muted">{a.email || "—"}</td>
                    <td>
                      {a.bloque
                        ? <span className="badge-bloque"><span className="badge-dot" /> Bloqué</span>
                        : <span className="badge-actif"><span className="badge-dot" /> Actif</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Abonnements expirant bientôt */}
        <div className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-titre">
              <i className="ti ti-clock-exclamation" /> Expirent dans 7 jours
            </h2>
          </div>
          {expiring.length === 0 ? (
            <p className="db-empty">Aucun abonnement n'expire prochainement.</p>
          ) : (
            <table className="db-table">
              <thead>
                <tr>
                  <th>ID Adhérent</th>
                  <th>Type</th>
                  <th>Date fin</th>
                </tr>
              </thead>
              <tbody>
                {expiring.map(a => (
                  <tr key={a.id}>
                    <td className="db-td-name">#{a.adherent_id}</td>
                    <td className="db-td-muted" style={{ textTransform: "capitalize" }}>{a.type}</td>
                    <td>
                      <span className="badge-bloque" style={{
                        background: "rgba(184,154,94,0.13)",
                        color: "#B89A5E",
                        borderColor: "rgba(184,154,94,0.25)"
                      }}>
                        <span className="badge-dot" style={{ background: "#B89A5E" }} />
                        {a.date_fin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}