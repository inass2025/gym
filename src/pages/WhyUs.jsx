import { useState } from "react";
import { NavLink } from 'react-router-dom';
import "./whyUs.css";

const features = [
  "Community & Group Exercise",
  "Group Fitness and Community",
  "Impact on Mental Health",
  "Variety in Exercise",
  "Expert Coaching Staff",
  "Modern Equipment",
];

const modalFeatures = [
  {  text: "Community & Group Exercise — entraînez-vous ensemble, progressez plus vite" },
  { text: "Impact sur la Santé Mentale — réduisez le stress, boostez votre énergie" },
  { text: "Variété d'Exercices — cardio, force, yoga, boxe et plus encore" },
];

export default function WhyChooseUs() {
  const [modal, setModal] = useState(false);

  return (
    <>
      <section className="wcu-section" id="whyUs">
        <div className="wcu-inner">

          {/* Gauche : images empilées */}
          <div className="wcu-images">
            <div className="wcu-img-back">
              <img src="p.jpeg" alt="gym" />
            </div>
            <div className="wcu-img-front">
              <img src="p2.jpeg" alt="trainer" />
            </div>
            <div className="wcu-accent" />
          </div>

          {/* Droite : texte */}
          <div className="wcu-content">
            <p className="wcu-eyebrow">Why Choose Us</p>

            <h2 className="wcu-heading">
              Energizing <em>Exercise</em> Program<br />
              for Both <em>Body</em> and Mind
            </h2>

            <p className="wcu-desc">
              Many people gain from customized exercise regimens created by
              personal trainers to target particular fitness objectives —
              weight loss, muscle gain, or enhanced athletic performance.
            </p>

            <div className="wcu-features">
              {features.map((f, i) => (
                <div key={i} className="wcu-feat">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="#3D4F5A"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            <button className="wcu-btn" onClick={() => setModal(true)}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div className="wcu-overlay" onClick={() => setModal(false)}>
          <div className="wcu-modal" onClick={(e) => e.stopPropagation()}>

            <span className="wcu-modal-badge">Notre programme</span>

            <h3 className="wcu-modal-title">
              Energizing <em>Exercise</em><br />for Body & Mind
            </h3>

            <p className="wcu-modal-desc">
              Notre gym offre des programmes complets adaptés à tous les niveaux.
              Que vous soyez débutant ou athlète confirmé, nos coachs certifiés
              vous accompagnent vers vos objectifs avec des méthodes éprouvées.
            </p>

            <div className="wcu-stats">
              <div className="wcu-stat"><p className="sv">15+</p><p className="sl">Coachs</p></div>
              <div className="wcu-stat"><p className="sv">50+</p><p className="sl">Classes / sem</p></div>
              <div className="wcu-stat"><p className="sv">98%</p><p className="sl">Satisfaction</p></div>
            </div>

            <div className="wcu-modal-feats">
              {modalFeatures.map((f, i) => (
                <div key={i} className="wcu-mf">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="wcu-modal-foot">
              
              <NavLink to="/Login"className="wcu-btn-primary">S'inscrire maintenant</NavLink>
              <button className="wcu-btn-ghost" onClick={() => setModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}