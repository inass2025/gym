import { useState, useEffect } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./CoursCard.css";

function CoursCard({ cours, onReserved }) {
  const [loading, setLoading]   = useState(false);
  const [reserved, setReserved] = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  // Helper: استخرج string من قيمة ممكن تكون object أو string
  const getString = (val) => {
    if (!val) return "";
    if (typeof val === "object") return val.nom || val.name || val.prenom || String(val.id || "");
    return String(val);
  };

  const isFull = cours.capacite <= 0;

  useEffect(() => {
    api.get("/my-reservations")
      .then((res) => {
        const dejaReserve = res.data.some(
          (r) =>
            (r.cours_id === cours.id || r.cours?.id === cours.id) &&
            r.status === "confirmé"
        );
        setReserved(dejaReserve);
      })
      .catch(() => {});
  }, [cours.id]);

  const reserve = () => {
    setLoading(true);
    setError("");

    api.get("/abonnements/check")
      .then((res) => {
        if (!res.data.hasAbonnement) {
          alert("⚠️ Vous n'avez pas d'abonnement actif.\nVous allez être redirigé vers la page d'abonnement.");
          navigate("/adherent/Abonnement");
          return Promise.reject("no-abonnement");
        }
        return api.post("/reserve", { cours_id: cours.id });
      })
      .then((res) => {
        if (res) {
          setReserved(true);
          if (onReserved) onReserved(cours);
        }
      })
      .catch((err) => {
        if (err === "no-abonnement") return;
        setError(err.response?.data?.message || "Erreur lors de la réservation.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={`special-card ${reserved ? "is-reserved" : ""} ${isFull ? "is-full" : ""}`}>
      <div className="card-glow"></div>

      <div className="card-content">
        <div className="card-top">
          <div className="category-tag">{getString(cours.coach) || "Fitness"}</div>
          <h2 className="title">{getString(cours.nom)}</h2>
        </div>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">📅 Jour</span>
            <span className="stat-value">{getString(cours.jours ?? cours.date)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">🕐 Heure</span>
            <span className="stat-value">{getString(cours.horaire ?? cours.heur)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">👥 Places</span>
            <span className={`stat-value ${isFull ? "capacity-full" : "capacity-ok"}`}>
              {isFull ? "Complet" : `${cours.capacite} place${cours.capacite > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        <div className="footer-section">
          <div className="location">
            <span className="pin">📍</span> {getString(cours.salle)}
          </div>

          <button
            className={`action-fab ${reserved ? "done" : ""} ${isFull ? "full" : ""}`}
            onClick={reserve}
            disabled={loading || reserved || isFull}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : reserved ? (
              "✓ Déjà réservé"
            ) : isFull ? (
              " Complet"
            ) : (
              "Réserver"
            )}
          </button>
        </div>

        {error && <small className="err-msg">{error}</small>}
      </div>
    </div>
  );
}

export default CoursCard;