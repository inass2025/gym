import { useEffect } from "react";
import { Link } from "react-router-dom";
import './About.css';

/* ── Hook : observe les éléments .reveal et ajoute .visible ── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // anime une seule fois
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function About() {
  useScrollReveal();

  const stats = [
    { icon: "📅", label: "15 Years of Excellence" },
    { icon: "👥", label: "1000+ Users Joined" },
    { icon: "⚙️", label: "5000+ Success Stories" },
    { icon: "🤝", label: "Community-Driven" },
  ];

  return (
    <section className="about" id="about">

      {/* ── LEFT : photos — glisse depuis la gauche ── */}
      <div className="about__photos reveal from-left">
        <img
          src="/coaches/coach1.jpg"
          alt="coach"
          className="about__photo-main"
        />
        <img
          src="/coaches/coach2.jpg"
          alt="gym"
          className="about__photo-secondary"
        />
      </div>

      {/* ── RIGHT : contenu ── */}
      <div className="about__content">

        {/* Label */}
        <p className="about__label reveal" data-delay="1">About</p>

        {/* Titre */}
        <div className="about__title-row reveal" data-delay="2">
          <div className="about__accent-bar"></div>
          <h1 className="about__title">
           Transform Your Fitness<br/>
Journey With Usn<br />
            Journey
          </h1>
        </div>

        {/* Corps de texte */}
        <p className="about__body reveal" data-delay="3">
          We are dedicated to helping you become the best version of yourself.
          With expert coaching, personalized training plans, and constant motivation,
          we guide you every step of the way. Whether your goal is to build strength,
          lose weight, or improve your lifestyle, we are here to support your transformation.
        </p>

        {/* Stats — chacune glisse avec un délai croissant */}
        <div className="about__stats">
          {stats.map((s, i) => (
            <div
              className="about__stat reveal scale-in"
              data-delay={i + 1}
              key={s.label}
            >
              <span className="about__stat-icon">{s.icon}</span>
              <span className="about__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/MoreAbout" className="about__cta reveal" data-delay="5">
          <span className="about__cta-text">Learn More</span>
          <span className="about__cta-arrow">→</span>
        </Link>

      </div>
    </section>
  );
} 