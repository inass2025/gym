import { useEffect, useState } from "react";
import api from "./api";
import CoursCard from "./CoursCard";

function CoursList({ onReserved }) {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cours")
      .then((res) => setCours(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "1rem", color: "#888", fontSize: "13px" }}> Chargement...</p>;

  if (cours.length === 0) return <p style={{ padding: "1rem", color: "#888", fontSize: "13px" }}>Aucun cours disponible.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {cours.map((c) => (
        <CoursCard key={c.id} cours={c} onReserved={onReserved} />
      ))}
    </div>
  );
}

export default CoursList;