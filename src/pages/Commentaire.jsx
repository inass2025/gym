import { useState } from "react";
import "./Commentaire.css";

// ── Données des commentaires ──
const avis = [
  {
    etoiles: 5,
    texte: "HypeGym helped me break plateaus fast. I gained strength, improved my form, and finally saw real progress.",
    nom: "Alex Turner",
    depuis: "Member for 10 Months",
    initiales: "AT",
  },
  {
    etoiles: 5,
    texte: "I lost weight, built consistency, and actually enjoy training now. The coaches keep me motivated every session.",
    nom: "Samantha Rivera",
    depuis: "Member for 10 Months",
    initiales: "SR",
  },
  {
    etoiles: 5,
    texte: "The equipment is top-notch and the atmosphere pushes you to give 100% every time. Best gym I've joined.",
    nom: "Marcus King",
    depuis: "Member for 7 Months",
    initiales: "MK",
  },
  {
    etoiles: 4,
    texte: "From day one the staff made me feel welcome. My endurance has doubled and I'm hitting PRs every month.",
    nom: "Julia Lee",
    depuis: "Member for 14 Months",
    initiales: "JL",
  },
  {
    etoiles: 5,
    texte: "The recovery zone helped me train harder without burning out. Truly a complete facility.",
    nom: "David Park",
    depuis: "Member for 5 Months",
    initiales: "DP",
  },
];

// ── Composant étoiles ──
function Etoiles({ nombre }) {
  return (
    <div className="stars">
      {"★".repeat(nombre)}{"☆".repeat(5 - nombre)}
    </div>
  );
}

// ── Composant carte commentaire ──
function Carte({ avis }) {
  return (
    <div className="card">
      <Etoiles nombre={avis.etoiles} />
      <p className="review-text">{avis.texte}</p>
      <div className="reviewer">
        <div className="avatar">{avis.initiales}</div>
        <div>
          <p className="name">{avis.nom}</p>
          <p className="since">{avis.depuis}</p>
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ──
export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = avis.length;

  // Aller à la carte n
  function goTo(n) {
    setCurrent(n);
  }

  // Bouton suivant →
  function next() {
    if (current < total - 1) goTo(current + 1);
    else goTo(0);
  }

  // Bouton précédent ←
  function prev() {
    if (current > 0) goTo(current - 1);
    else goTo(total - 1);
  }

  // Décalage du slider
  const decalage = current * (300 + 18); // largeur carte + gap

  return (
    <section className="testimonials-section">

      {/* Décorations */}
      <div className="deco deco-line" />
      <div className="deco deco-circle" />

      {/* Image athlète à gauche */}
      <img
        className="athlete-img"
        src="/coaches/c2.jpeg"
        alt="Athlete"
      />

      {/* Contenu à droite */}
      <div className="content">
        <p className="ghost-title">Testimonials</p>

        <h2 className="main-heading">
          <span className="accent-dot" />
          <span>See What Members<br />Have Accomplished</span>
        </h2>

        {/* Slider */}
        <div className="slider-wrapper">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${decalage}px)` }}
          >
            {avis.map((item, i) => (
              <Carte key={i} avis={item} />
            ))}
          </div>
        </div>

        {/* Flèches */}
        <div className="arrows">
          <button className="arrow-btn" onClick={prev}>&#8592;</button>
          <button className="arrow-btn" onClick={next}>&#8594;</button>
        </div>
      </div>

    </section>
  );
}