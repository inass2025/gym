import { useEffect, useState } from "react";
import axios from "axios";
import CoursList from "./CoursList";
import "./Dashboard.css";

function SidePanel({ open, onClose, onReserved }) {
  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose} />
      <div className={`side-panel ${open ? "open" : ""}`}>
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Cours disponibles</h2>
            <p className="panel-sub">Sélectionnez un cours à réserver</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">
          <CoursList onReserved={onReserved} />
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const [data, setData]             = useState(null);
  const [reservations, setReservations] = useState([]); // ← جديد
  const [panelOpen, setPanelOpen]   = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // جيب بيانات الداشبورد
    axios.get("http://127.0.0.1:8000/api/dashboard", { headers })
      .then(res => setData(res.data))
      .catch(err => console.log(err));

    // جيب reservations ديال المستخدم ← جديد
    axios.get("http://127.0.0.1:8000/api/my-reservations", { headers })
      .then(res => setReservations(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleReserved = (cours) => {
    // زيد الـ reservation الجديدة للقائمة مباشرة
    setReservations(prev => [{
      id: Date.now(),
      cours: cours,
      date_reservation: new Date().toISOString(),
      statut: "confirmé"
    }, ...prev]);
    setPanelOpen(false);
  };

  const annuler = (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    axios.delete(`http://127.0.0.1:8000/api/reservations/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(() =>
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, statut: "annulé" } : r)
      )
    ).catch(() => alert("Erreur lors de l'annulation."));
  };

  if (!data) return <p className="loading">Chargement...</p>;

  const joursRestants = Math.ceil(
    (new Date(data.expire) - new Date()) / (1000 * 60 * 60 * 24)
  );

  // آخر reservation confirmée
  const derniereReservation = reservations.find(r => r.statut === "confirmé");

  return (
    <div className="dashboard">

      {/* Topbar */}
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Dashboard</h1>
          <p className="topbar-sub">Bienvenue, {data.nom} 💪</p>
        </div>
        <button className="btn-primary" onClick={() => setPanelOpen(true)}>
          + Réserver un cours
        </button>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Séances ce mois</p>
          <h2 className="stat-value yellow">{data.sessions}</h2>
          <p className="stat-sub">Séances effectuées</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Statut</p>
          <h2 className="stat-value green">{data.status}</h2>
          <p className="stat-sub">Abonnement en cours</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Expire dans</p>
          <h2 className="stat-value red">{joursRestants} j</h2>
          <p className="stat-sub">Le {data.expire}</p>
        </div>

        {/* ← ديناميك: عدد reservations */}
        <div className="stat-card">
          <p className="stat-label">Réservations</p>
          <h2 className="stat-value blue">
            {reservations.filter(r => r.statut === "confirmé").length}
          </h2>
          <p className="stat-sub">Cours réservés</p>
        </div>
      </div>

      {/* Abonnement + Prochain cours */}
      <div className="row-2">
        <div className="card abo-card">
          <div className="card-header">
            <span className="card-title">Mon Abonnement</span>
            <span className="card-action">Gérer →</span>
          </div>
          <h3 className="abo-plan">{data.status}</h3>
          <p className="abo-dates">Expire le : {data.expire}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.max(0, 100 - (joursRestants / 365) * 100)}%` }}
            />
          </div>
          <div className="abo-footer">
            <span>{joursRestants} jours restants</span>
            <span className="yellow">{data.sessions} séances effectuées</span>
          </div>
        </div>

        {/* ← ديناميك: prochain cours */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Prochain Cours</span>
            <span className="card-action" onClick={() => setPanelOpen(true)} style={{ cursor: "pointer" }}>
              Voir planning →
            </span>
          </div>

          {derniereReservation ? (
            <div className="next-class-box">
              <span className="next-class-icon">🏋️</span>
              <div style={{ flex: 1 }}>
                <p className="next-class-name">{derniereReservation.cours?.nom}</p>
                <p className="next-class-sub">
                  {derniereReservation.cours?.horaire} · {derniereReservation.cours?.jours}
                </p>
              </div>
              {/* زر annuler مباشرة من الداشبورد */}
              <button
                onClick={() => annuler(derniereReservation.id)}
                style={{
                  border: "1px solid #fca5a5",
                  background: "transparent",
                  color: "#b91c1c",
                  borderRadius: 8,
                  padding: "4px 12px",
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
            </div>
          ) : (
            <div className="next-class-box">
              <span className="next-class-icon">📭</span>
              <div>
                <p className="next-class-name">Aucune réservation</p>
                <p className="next-class-sub">Réservez un cours maintenant</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ← قائمة reservations ديناميك */}
      {reservations.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <span className="card-title">Mes réservations</span>
            <span>{reservations.filter(r => r.statut === "confirmé").length} actives</span>
          </div>
          {reservations.map(r => (
            <div key={r.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: 20 }}>🏋️</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{r.cours?.nom}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                  {r.cours?.jours} · {r.cours?.horaire} · Coach {r.cours?.coach}
                </p>
              </div>
              <span style={{
                padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: r.statut === "confirmé" ? "#dcfce7" : "#fee2e2",
                color: r.statut === "confirmé" ? "#15803d" : "#b91c1c"
              }}>
                {r.statut}
              </span>
              {r.statut === "confirmé" && (
                <button onClick={() => annuler(r.id)} style={{
                  border: "1px solid #fca5a5", background: "transparent",
                  color: "#b91c1c", borderRadius: 8, padding: "4px 10px",
                  fontSize: 12, cursor: "pointer"
                }}>
                  Annuler
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} onReserved={handleReserved} />
    </div>
  );
}

export default Dashboard;