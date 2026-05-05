import { useState } from "react";
import api from "./api";
import "./Abonnement.css";

const PLANS = [
  {
    type: "mensuel",
    label: "Mensuel",
    prix: 199,
    duree: "1 mois",
    icon: "📅",
    features: ["Accès salle complète", "Cours collectifs", "Vestiaires"],
    color: "blue",
  },
  {
    type: "trimestriel",
    label: "Trimestriel",
    prix: 499,
    duree: "3 mois",
    icon: "⭐",
    features: ["Accès salle complète", "Cours collectifs", "Vestiaires", "1 séance coaching offerte"],
    color: "purple",
    popular: true,
  },
  {
    type: "annuel",
    label: "Annuel",
    prix: 1499,
    duree: "12 mois",
    icon: "👑",
    features: ["Accès salle complète", "Cours collectifs", "Vestiaires", "Coaching illimité", "Accès 24h/24"],
    color: "gold",
  },
];

function Abonnement() {
  const [loading, setLoading] = useState(null);  // ← type en cours
  const [success, setSuccess] = useState(null);
  const [error, setError]     = useState(null);

  const souscrire = (type) => {
    setLoading(type);
    setError(null);
    setSuccess(null);

    api.post("/abonnement/souscrire", { type })
      .then(res => setSuccess(`Abonnement ${type} activé avec succès !`))
      .catch(err => setError(err.response?.data?.message || "Erreur lors de la souscription."))
      .finally(() => setLoading(null));
  };

  return (
    <div className="plans-page">
      <div className="plans-header">
        <h1 className="plans-title">Choisissez votre plan</h1>
        <p className="plans-sub">Sans engagement, résiliable à tout moment</p>
      </div>

      {success && <div className="alert alert-success">✅ {success}</div>}
      {error   && <div className="alert alert-error">❌ {error}</div>}

      <div className="plans-grid">
        {PLANS.map(plan => (
          <div key={plan.type} className={`plan-card plan-${plan.color} ${plan.popular ? "popular" : ""}`}>
            {plan.popular && <div className="popular-badge">Le plus populaire</div>}

            <div className="plan-top">
              <span className="plan-icon">{plan.icon}</span>
              <h2 className="plan-label">{plan.label}</h2>
              <p className="plan-duree">{plan.duree}</p>
            </div>

            <div className="plan-prix">
              <span className="prix-amount">{plan.prix}</span>
              <span className="prix-currency"> MAD</span>
            </div>

            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>

            <button
              className={`btn-souscrire btn-${plan.color}`}
              onClick={() => souscrire(plan.type)}
              disabled={loading === plan.type}
            >
              {loading === plan.type ? "En cours..." : "S'abonner"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Abonnement;