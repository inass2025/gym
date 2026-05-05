
import { useState, useEffect } from "react";
import api from "./api";
import "./MyReservations.css";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    api.get("/my-reservations")
      .then(res => setReservations(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const annuler = (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    api.delete(`/reservations/${id}`)
      .then(() =>
        setReservations(prev =>
          prev.map(r => r.id === id ? { ...r, statut: "annulé" } : r)
        )
      )
      .catch(() => alert("Erreur lors de l'annulation."));
  };

  if (loading) return <p className="loading">Chargement...</p>;
  if (!reservations.length) return <p className="empty">Aucune réservation.</p>;

  return (
    <div className="my-reservations">
      <h1 className="page-title">Mes réservations</h1>
      <p className="page-sub">{reservations.length} cours réservé(s)</p>

      {reservations.map(r => (
        <div className="res-card" key={r.id}>
          <div className="res-avatar">🏋️</div>

          <div className="res-info">
            <p className="res-name">{r.cours?.nom}</p>
            <div className="res-meta">
              {r.cours?.jours   && <span>📅 {r.cours.jours}</span>}
              {r.cours?.horaire && <span>🕐 {r.cours.horaire}</span>}
              {r.cours?.coach   && <span>🏅 Coach {r.cours.coach}</span>}
              {r.cours?.salle   && <span>📌 {r.cours.salle}</span>}
            </div>
            <div className="res-footer">
              <span className={`badge ${r.statut === "confirmé" ? "badge-ok" : "badge-cancel"}`}>
                {r.statut}
              </span>
              <span className="res-date">
                Réservé le {new Date(r.date_reservation).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          <button
            className="btn-cancel"
            onClick={() => annuler(r.id)}
            disabled={r.statut === "annulé"}
          >
            {r.statut === "annulé" ? "Annulé" : "Annuler"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyReservations;