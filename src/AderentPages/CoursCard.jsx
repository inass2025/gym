import { useState, useEffect } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./CoursCard.css";

function CoursCard({ cours, onReserved }) {
  const [loading, setLoading]   = useState(false);
  const [reserved, setReserved] = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // check من API — هاد الحل أصح من localStorage
    api.get("/my-reservations")
      .then((res) => {
        const dejaReserve = res.data.some(
          (r) =>
            (r.cours_id === cours.id || r.cours?.id === cours.id) &&
            r.statut === "confirmé"
        );
        setReserved(dejaReserve);
      })
      .catch(() => {});
  }, [cours.id]);

  const reserve = () => {
    setLoading(true);
    setError("");

    api.get("/check-abonnement")
      .then((res) => {
        if (!res.data.hasAbonnement) {
          alert("⚠️ Vous n'avez pas d'abonnement actif.\nVous allez être redirigé vers la page d'abonnement.");
          navigate("/adherent/Abonnement");
          return;
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
        setError(err.response?.data?.message || "Erreur");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={`special-card ${reserved ? "is-reserved" : ""}`}>
      <div className="card-glow"></div>
      
      <div className="card-content">
        <div className="card-top">
          <div className="category-tag">{cours.coach || "Fitness"}</div>
          <h2 className="title">{cours.nom}</h2>
        </div>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">📅 Jour</span>
            <span className="stat-value">{cours.jours}</span>
          </div>
          <div className="stat">
            <span className="stat-label">🕐 Heure</span>
            <span className="stat-value">{cours.horaire}</span>
          </div>
        </div>

        <div className="footer-section">
          <div className="location">
            <span className="pin">📍</span> {cours.salle}
          </div>
          
          <button 
            className={`action-fab ${reserved ? "done" : ""}`}
            onClick={reserve}
            disabled={loading || reserved}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : reserved ? (
              "✓ Déjà réservé"
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