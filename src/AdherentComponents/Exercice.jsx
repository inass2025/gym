import { useState, useEffect } from "react";

export default function Exercices() {
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filtre, setFiltre]        = useState("Tous");

  const muscles = ["Tous", "Pectoraux", "Dos", "Jambes", "Épaules", "Abdominaux", "Cardio"];

  useEffect(() => {
    fetch("/api/exercices")
      .then(res  => res.json())
      .then(data => {
        setExercices(data);
        setLoading(false);
      });
  }, []);

  // Filtrer par groupe musculaire
  const affichés = filtre === "Tous"
    ? exercices
    : exercices.filter(ex => ex.muscle === filtre);

  if (loading) return <p style={{ color: "#888" }}>Chargement...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Bibliothèque d'exercices</h2>

      {/* Boutons de filtre */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {muscles.map(m => (
          <button
            key={m}
            onClick={() => setFiltre(m)}
            style={{
              background: filtre === m ? "#FF6B35" : "transparent",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "20px",
              padding: "4px 14px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Grille d'exercices */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {affichés.map(ex => (
          <CarteExercice key={ex.id} exercice={ex} />
        ))}
      </div>
    </div>
  );
}

// Une carte par exercice
function CarteExercice({ exercice }) {
  const couleurDiff = {
    "Débutant":      { bg: "#0a1a08", color: "#6cb96c" },
    "Intermédiaire": { bg: "#1a1408", color: "#e0b84a" },
    "Avancé":        { bg: "#1a0808", color: "#e05050" },
  };
  const style = couleurDiff[exercice.difficulte] || {};

  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid #2a2a2a",
      borderRadius: "12px",
      overflow: "hidden",
    }}>
      {/* Emoji en haut */}
      <div style={{
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
        background: "#111",
      }}>
        {exercice.emoji}
      </div>

      {/* Infos */}
      <div style={{ padding: "10px 12px" }}>
        <p style={{ fontWeight: "500", fontSize: "13px" }}>{exercice.nom}</p>
        <p style={{ color: "#888", fontSize: "12px", marginTop: "3px" }}>
          {exercice.muscle} · {exercice.materiel}
        </p>
        <span style={{
          display: "inline-block",
          marginTop: "6px",
          fontSize: "11px",
          padding: "2px 8px",
          borderRadius: "10px",
          background: style.bg,
          color: style.color,
        }}>
          {exercice.difficulte}
        </span>
      </div>
    </div>
  );
}