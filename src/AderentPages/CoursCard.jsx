import { useState } from "react";
import api from "./api";
import "./CoursCard.css";

function CoursCard({ cours, onReserved }) {
  const [loading, setLoading] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [ Error,  setError] = useState("");

  const reserve = () => {
    setLoading(true);
    api.post("/reserve", { cours_id: cours.id })
      .then(() => {
        setReserved(true);
        if (onReserved) onReserved(cours);
      })
      .catch((err) => {
        console.error("Détail erreur:", err.response?.data); // ← هادا المهم
  console.error("Status:", err.response?.status);
  console.error("Message:", err.response?.data?.message);
  setError(err.response?.data?.message || "Erreur serveur 500");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="cours-card">
      <div className="cours-card-top">
        <span className="cours-dot" />
        <span className="cours-name">{cours.nom}</span>
      </div>

      <div className="cours-meta">
        {cours.description && <span>📝 {cours.description}</span>}
        {cours.jours      && <span>📅 {cours.jours}</span>}
        {cours.horaire    && <span>🕐 {cours.horaire}</span>}
        {cours.salle      && <span>📍 {cours.salle}</span>}
        {cours.coach      && <span>🏋️ {cours.coach}</span>}
      </div>

      <button
        className={`btn-reserver ${reserved ? "reserved" : ""}`}
        onClick={reserve}
        disabled={loading || reserved}
      >
        {loading ? "..." : reserved ? "✓ Réservé" : "Réserver"}
      </button>
    </div>
  );
}

export default CoursCard;