import { useState, useEffect } from "react";
import api from "./api"; // chemin vers votre fichier api.js
import './MesAbonnements.css'
const ICONS = {
  mensuel: "📅",
  trimestriel: "📆",
  annuel: "🗓️",
};

export default function MesAbonnements() {
  const [abonnements, setAbonnements] = useState([]);
  const [filtre, setFiltre] = useState("all");
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/abonnements")
      .then((res) => {
        setAbonnements(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtres = ["all", "actif", "annulé", ];

  const filtered = abonnements.filter((s) => {
    const matchFiltre =
      filtre === "all" || s.statut === filtre || s.type === filtre;
    const matchRecherche =
      !recherche ||
      s.type.includes(recherche.toLowerCase()) ||
      s.statut.includes(recherche.toLowerCase());
    return matchFiltre && matchRecherche;
  });

  const actifs = abonnements.filter((s) => s.statut === "actif");
  const revenu = actifs.reduce((a, s) => a + parseFloat(s.prix), 0);

  const fmtDate = (d) => {
    const [y, m, j] = d.split("-");
    return `${j}/${m}/${y}`;
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-medium mb-1">Mes abonnements</h1>
      <p className="text-gray-500 text-sm mb-6">Historique et gestion</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: abonnements.length },
          { label: "Actifs", value: actifs.length, color: "text-green-600" },
          { label: "Annulés", value: abonnements.length - actifs.length, color: "text-red-500" },
          { label: "Valeur active", value: `${revenu} MAD` },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-medium ${s.color || ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded-lg text-sm"
      />

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filtres.map((f) => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              filtre === f
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "Tous" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${
              s.statut === "actif"
                ? "border-l-4 border-l-green-500"
                : "border-l-4 border-l-red-400"
            }`}
          >
            <span className="text-xs text-gray-400 w-6">#{s.id}</span>
            <span className="text-2xl">{ICONS[s.type] || "📋"}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize text-sm">{s.type}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s.statut === "actif"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}>{s.statut}</span>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-gray-400 flex-wrap">
                <span>📅 {fmtDate(s.date_debut)} → {fmtDate(s.date_fin)}</span>
                <span>👤 Adhérent #{s.adherent_id}</span>
                <span>🕐 {s.created_at.split(" ")[0]}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{s.prix}</p>
              <p className="text-xs text-gray-400">MAD</p>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <p className="text-center text-gray-400 py-10">Aucun abonnement trouvé</p>
        )}
      </div>
    </div>
  );
}