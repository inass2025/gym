import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function CoursDisponibles({ onClose }) {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API}/cours/disponibles`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCours(res.data))
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
  }, []);

  const reserver = async (coursId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/reservations`, 
        { cours_id: coursId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cours réservé !");
      onClose();
    } catch (error) {
      alert("Erreur de réservation");
    }
  };

  if (loading) return <div style={{ padding: 20, textAlign: "center" }}>Chargement...</div>;

  return (
    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
      {cours.length === 0 ? (
        <p style={{ textAlign: "center", padding: 20 }}>Aucun cours disponible</p>
      ) : (
        cours.map(c => (
          <div key={c.id} style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "10px"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>{c.nom}</div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              🏋️ {c.coach_nom}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              ⏰ {c.horaire} - 📅 {c.date}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
              🪑 Places: {c.places_restantes}
            </div>
            <button
              onClick={() => reserver(c.id)}
              disabled={c.places_restantes === 0}
              style={{
                width: "100%",
                padding: "8px",
                background: c.places_restantes > 0 ? "#EF9F27" : "#ccc",
                border: "none",
                borderRadius: "6px",
                color: c.places_restantes > 0 ? "#412402" : "#666",
                cursor: c.places_restantes > 0 ? "pointer" : "not-allowed"
              }}
            >
              {c.places_restantes > 0 ? "✅ Réserver" : "❌ Complet"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}