import { useState } from "react";
import api from "./api";
import "./Abonnement.css";

// ── Data ───────────────────────────────────────────────────────────────────
const PLANS = [
  {
    type: "mensuel", label: "Essential Plan", prix: 199, duree: "/ Mois", 
    features: ["Accès salle complète", "Cours collectifs", "Vestiaires & douches"],
  },
  {
    type: "trimestriel", label: "Essential Plan", prix: 499, duree: "/ 3 Mois",  
    features: ["Accès salle complète", "Cours collectifs", "Vestiaires & douches", "1 séance coaching offerte"],
    popular: true,
  },
  {
    type: "annuel", label: "Essential Plan", prix: 1499, duree: "/ An", 
    features: ["Accès salle complète", "Cours collectifs", "Vestiaires & douches", "Coaching illimité", "Accès 24h/24"],
  },
];

const CODES_PROMO = { GYM20: 0.20, FIT50: 0.50, RIMBE10: 0.10 };
const MOIS_MAP    = { mensuel: 1, trimestriel: 3, annuel: 12 };

// ── Helpers ────────────────────────────────────────────────────────────────
const getAdherentId = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}").id || null; }
  catch { return null; }
};

const toDate = (d) => d.toISOString().split("T")[0];

const formatNumero = (v) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

// ── Popup wrapper ──────────────────────────────────────────────────────────
function Popup({ eyebrow, onClose, children }) {
  return (
    <div className="ab-overlay" onClick={onClose}>
      <div className="ab-popup" onClick={(e) => e.stopPropagation()}>
        <p className="ab-pop-eyebrow">{eyebrow}</p>
        <div className="ab-star">★</div>
        {children}
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export default function Abonnement() {
  const [etape, setEtape]         = useState(null);
  const [plan, setPlan]           = useState(null);
  const [code, setCode]           = useState("");
  const [reduction, setReduction] = useState(0);
  const [errCode, setErrCode]     = useState("");
  const [methode, setMethode]     = useState("carte");
  const [carte, setCarte]         = useState({ numero: "", expiry: "", cvv: "", nom: "" });
  const [errCarte, setErrCarte]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [copie, setCopie]         = useState(false);

  const prixFinal = plan ? Math.round(plan.prix * (1 - reduction)) : 0;

  // ── Actions ───────────────────────────────────────────────────────────────
  function ouvrir(p) {
    setPlan(p); setCode(""); setReduction(0); setErrCode("");
    setMethode("carte"); setCarte({ numero: "", expiry: "", cvv: "", nom: "" });
    setErrCarte(""); setEtape("confirm");
  }

  function fermer() { setEtape(null); setPlan(null); }

  function appliquerCode() {
    const c = code.trim().toUpperCase();
    const r = CODES_PROMO[c];
    if (r !== undefined) {
      setReduction(r);
      setErrCode("");
    } else {
      setErrCode("Code invalide.");
      setReduction(0);
    }
  }

  function validerCarte() {
    if (methode === "especes") return true;
    if (carte.numero.replace(/\s/g, "").length < 16) { setErrCarte("Numéro invalide (16 chiffres)."); return false; }
    if (!carte.expiry.match(/^\d{2}\/\d{2}$/))       { setErrCarte("Date expiration invalide (MM/AA)."); return false; }
    if (carte.cvv.length < 3)                         { setErrCarte("CVV invalide."); return false; }
    if (!carte.nom.trim())                            { setErrCarte("Nom requis."); return false; }
    setErrCarte(""); return true;
  }

  async function finaliser() {
    if (!validerCarte()) return;
    setLoading(true);

    const adherentId = getAdherentId();
    const debut = new Date();
    const fin   = new Date();
    fin.setMonth(fin.getMonth() + MOIS_MAP[plan.type]);

    try {
      const resAbo = await api.post("/abonnement/souscrire", {
        type: plan.type,
        prix: prixFinal,
        statut: "actif",
        date_debut: toDate(debut),
        date_fin: toDate(fin),
        adherent_id: adherentId,
      });

      const abonnementId = resAbo.data?.abonnement?.id || resAbo.data?.id || null;

      await api.post("/paiements", {
        montant: prixFinal,
        date_paiement: toDate(debut),
        methode: methode,
        statut: "payé",
        adherent_id: adherentId,
        abonnement_id: abonnementId,
      });

      setEtape("succes");
    } catch (e) {
      alert("Erreur : " + (e.response?.data?.message || "Réessayez."));
    } finally {
      setLoading(false);
    }
  }

  function copierCode(c) {
    navigator.clipboard.writeText(c).catch(() => {});
    setCopie(true); setTimeout(() => setCopie(false), 2000);
  }

  const setCarte_ = (key, val) => setCarte((prev) => ({ ...prev, [key]: val }));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="ab-page">

      {/* Header */}
      <div className="ab-header">
        <p className="ab-eyebrow">Rimberio Fitness</p>
        <h1 className="ab-titre">Trouvez votre <span>Plan Parfait</span></h1>
        <p className="ab-sub">Sans engagement — résiliable à tout moment</p>
      </div>

      {/* Grille plans */}
      <div className="ab-grille">
        {PLANS.map((p) => (
          <div key={p.type} className={`ab-carte ${p.popular ? "populaire" : ""}`}>
            {p.popular && <div className="ab-badge">★ Le plus populaire</div>}
            <div className="ab-top">
              <h2>{p.label}</h2>
            </div>
            <div className="ab-prix">
              <span className="ab-montant">{p.prix}</span>
              <span className="ab-prix-unit">MAD {p.duree}</span>
            </div>
            <hr className="ab-hr" />
            <ul className="ab-features">
              {p.features.map((f, i) => <li key={i}><span>✓</span>{f}</li>)}
            </ul>
            <button className="ab-btn" onClick={() => ouvrir(p)}>S'abonner →</button>
          </div>
        ))}
      </div>

      {/* ── Confirmation ── */}
      {etape === "confirm" && plan && (
        <Popup eyebrow="RIMBERIO FITNESS — CONFIRMATION" onClose={fermer}>
          <h2 className="ab-pop-titre">Souscrire au plan <span>{plan.label}</span> ?</h2>
          <p className="ab-pop-sub">{plan.duree} · {plan.prix} MAD</p>
          <button className="ab-pop-btn" onClick={() => setEtape("promo")}>OUI, CONFIRMER</button>
          <button className="ab-pop-annuler" onClick={fermer}>Non merci, annuler</button>
        </Popup>
      )}

      {/* ── Code Promo ── */}
      {etape === "promo" && plan && (
        <Popup eyebrow="RIMBERIO FITNESS — CODE PROMO" onClose={fermer}>
          <h2 className="ab-pop-titre">Avez-vous un <span>code promo ?</span></h2>
          <p className="ab-pop-sub">Entrez votre code pour obtenir une réduction.</p>
          <div className="ab-code-box">
            <input className="ab-code-input" placeholder="ex: GYM20"
              value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="ab-code-apply" onClick={appliquerCode}>Appliquer</button>
          </div>
          {errCode    && <p className="ab-erreur">{errCode}</p>}
          {reduction > 0 && (
            <p className="ab-succes-code">🎉 -{Math.round(reduction * 100)}% — Prix : <strong>{prixFinal} MAD</strong></p>
          )}
          <button className="ab-pop-btn" onClick={() => setEtape("paiement")}>CONTINUER →</button>
          <button className="ab-pop-annuler" onClick={fermer}>Annuler</button>
        </Popup>
      )}

      {/* ── Paiement ── */}
      {etape === "paiement" && plan && (
        <Popup eyebrow="RIMBERIO FITNESS — PAIEMENT" onClose={fermer}>
          <h2 className="ab-pop-titre">Mode de <span>paiement</span></h2>
          <p className="ab-pop-sub">
            Total : <strong>{prixFinal} MAD</strong>
            {reduction > 0 && <span className="ab-eco"> (−{Math.round(reduction * 100)}%)</span>}
          </p>

          <div className="ab-methode-box">
            {["carte", "especes"].map((m) => (
              <button key={m} className={`ab-methode-btn ${methode === m ? "active" : ""}`}
                onClick={() => setMethode(m)}>
                {m === "carte" ? "💳 Carte bancaire" : "💵 Espèces"}
              </button>
            ))}
          </div>

          {methode === "carte" && (
            <div className="ab-carte-form">
              <div className="ab-card-preview">
                <div className="ab-card-chip">▪▪▪</div>
                <div className="ab-card-numero">{carte.numero || "•••• •••• •••• ••••"}</div>
                <div className="ab-card-bottom">
                  <span className="ab-card-nom">{carte.nom || "NOM PRÉNOM"}</span>
                  <span className="ab-card-exp">{carte.expiry || "MM/AA"}</span>
                </div>
              </div>
              <input className="ab-input-field" placeholder="Nom sur la carte"
                value={carte.nom} onChange={(e) => setCarte_("nom", e.target.value)} />
              <input className="ab-input-field" placeholder="Numéro de carte" maxLength={19}
                value={carte.numero} onChange={(e) => setCarte_("numero", formatNumero(e.target.value))} />
              <div className="ab-input-row">
                <input className="ab-input-field" placeholder="MM/AA" maxLength={5} value={carte.expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                    setCarte_("expiry", v);
                  }} />
                <input className="ab-input-field" type="password" placeholder="CVV" maxLength={4}
                  value={carte.cvv} onChange={(e) => setCarte_("cvv", e.target.value.replace(/\D/g, ""))} />
              </div>
              {errCarte && <p className="ab-erreur">{errCarte}</p>}
            </div>
          )}

          {methode === "especes" && (
            <div className="ab-especes-info">
              <p>💡 Rendez-vous à l'accueil avec le montant exact :</p>
              <p className="ab-especes-montant">{prixFinal} MAD</p>
              <p className="ab-especes-sub">Abonnement activé après confirmation du paiement.</p>
            </div>
          )}

          <button className="ab-pop-btn" onClick={finaliser} disabled={loading}>
            {loading ? "Traitement..." : `PAYER ${prixFinal} MAD →`}
          </button>
          <button className="ab-pop-annuler" onClick={() => setEtape("promo")}>← Retour</button>
        </Popup>
      )}

      {/* ── Succès ── */}
      {etape === "succes" && plan && (
        <div className="ab-overlay" onClick={fermer}>
          <div className="ab-succes" onClick={(e) => e.stopPropagation()}>
            <p className="ab-pop-eyebrow">RIMBERIO FITNESS — BIENVENUE !</p>
            <div className="ab-star">★</div>
            <p className="ab-succes-label">ABONNEMENT ACTIVÉ</p>
            <h2 className="ab-pop-titre">Profitez de votre <span>accès {plan.label}</span></h2>
            <p className="ab-pop-sub">
              Durée : <strong>{plan.duree}</strong> · Payé : <strong>{prixFinal} MAD</strong>
              {reduction > 0 && <span className="ab-eco"> · Économie : {plan.prix - prixFinal} MAD 🎉</span>}
            </p>
            <p className="ab-pop-sub" style={{ fontSize: "0.78rem", opacity: 0.6 }}>
              {methode === "carte" ? "💳 Carte bancaire" : "💵 Espèces"}
            </p>
            <div className="ab-acces-box" onClick={() => copierCode(`RIM-${plan.type.toUpperCase()}-2026`)}>
              <span className="ab-acces-code">RIM-{plan.type.toUpperCase()}-2026</span>
              <span>{copie ? "✓ Copié" : "⧉"}</span>
            </div>
            <p className="ab-acces-hint">Cliquez pour copier votre code d'accès</p>
            <button className="ab-pop-btn" onClick={fermer}>ACCÉDER À MON ESPACE</button>
            <button className="ab-pop-annuler" onClick={fermer}>Fermer</button>
          </div>
        </div>
      )}

    </div>
  );
}