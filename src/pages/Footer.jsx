import React from "react";
import "./Footer.css"

export default function Footer() {
return (
<footer className="footer">
<div className="footer-inner">


    {/* ── COL 1 : Brand ── */}
    <section className="footer-brand">
      <div className="brand-name">
        <h2>FitnessPro</h2>
        <span className="brand-sub">ATHLÉTIQUE</span>
      </div>

      <p className="brand-desc">
        Depuis un siècle, FitnessPro réunit l'art du mouvement et
        l'élégance d'un cadre intemporel.
      </p>

      <ul className="social-list">
        <li>
          <a href="#" className="social-btn" aria-label="Instagram">
            {/* Instagram */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
        </li>
        <li>
          <a href="#" className="social-btn" aria-label="Facebook">
            {/* Facebook */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </li>
        <li>
          <a href="#" className="social-btn" aria-label="Email">
            {/* Mail */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <polyline points="2,4 12,13 22,4"/>
            </svg>
          </a>
        </li>
      </ul>
    </section>

    {/* ── COL 2 : Contact ── */}
    <section className="footer-contact">
      <h3 className="col-title">Contact</h3>

      <ul className="contact-list">
        <li>
          <span className="contact-icon">
            {/* Pin */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          <address>14 rue des Tuileries, Paris 75001</address>
        </li>
        <li>
          <span className="contact-icon">
            {/* Phone */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <a href="tel:+33142601824">+33 1 42 60 18 24</a>
        </li>
        <li>
          <span className="contact-icon">
            {/* Mail */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <polyline points="2,4 12,13 22,4"/>
            </svg>
          </span>
          <a href="mailto:bonjour@fitnesspro.fr">bonjour@fitnesspro.fr</a>
        </li>
      </ul>
    </section>

    {/* ── COL 3 : Horaires ── */}
    <section className="footer-hours">
      <h3 className="col-title">Horaires</h3>

      <ul className="hours-list">
        <li>
          <span className="day">Lun – Ven</span>
          <span className="hours">06h — 23h</span>
        </li>
        <li>
          <span className="day">Samedi</span>
          <span className="hours">07h — 22h</span>
        </li>
        <li>
          <span className="day">Dimanche</span>
          <span className="hours">08h — 20h</span>
        </li>
      </ul>

      <p className="members-access">MEMBRES : ACCÈS 24H/24</p>
    </section>

  </div>

  {/* ── BOTTOM BAR ── */}
  <div className="footer-bottom">
    <small className="copyright">
      © 2026 FitnessPro — Tous droits réservés.
    </small>
    <small className="established">
      Établi en 1924 · Paris
    </small>
  </div>
</footer>


);
}