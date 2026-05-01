import { useState, useEffect } from 'react';
import './Contact.css';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Infos de contact — modifiez selon votre gym
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const INFOS = [
  { icone: '📍', label: 'Adresse',   valeur: '12 Rue du Sport, Paris 75008' },
  { icone: '📞', label: 'Téléphone', valeur: '+33 1 23 45 67 89' },
  { icone: '✉️', label: 'Email',     valeur: 'contact@fitgym.fr' },
  { icone: '🕐', label: 'Horaires',  valeur: 'Lun–Sam : 6h – 22h' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Animation au scroll
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function useAnimationScroll() {
  useEffect(() => {
    const observateur = new IntersectionObserver(
      (elements) => {
        elements.forEach((el) => {
          if (el.isIntersecting) {
            el.target.classList.add('visible');
            observateur.unobserve(el.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observateur.observe(el));
    return () => observateur.disconnect();
  }, []);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Composant principal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Contact() {
  useAnimationScroll();

  // État du formulaire
  const [formulaire, setFormulaire] = useState({
    nom: '',
    email: '',
    message: '',
  });

  // État : message envoyé ?
  const [envoye, setEnvoye] = useState(false);

  // Met à jour le champ modifié
  function handleChange(e) {
    setFormulaire({
      ...formulaire,
      [e.target.name]: e.target.value,
    });
  }

  // Envoi du formulaire
  function handleSubmit(e) {
    e.preventDefault(); // empêche le rechargement de la page
    console.log('Message envoyé :', formulaire);
    setEnvoye(true);
    // Réinitialise après 4 secondes
    setTimeout(() => {
      setEnvoye(false);
      setFormulaire({ nom: '', email: '', message: '' });
    }, 4000);
  }

  return (
    <section className="contact-section" id="contact">

      {/* ━━ EN-TÊTE ━━ */}
      <div className="contact-header reveal">
        <span className="contact-label">Get In Touch</span>
        <h2 className="contact-titre">
          Parlons de <em>votre</em><br />transformation.
        </h2>
        <p className="contact-desc">
          Une question ? Envie de rejoindre notre équipe ?<br />
          On vous répond dans les 24h.
        </p>
      </div>

      {/* ━━ CONTENU : formulaire + carte ━━ */}
      <div className="contact-corps">

        {/* ── GAUCHE : infos + formulaire ── */}
        <div className="contact-gauche reveal" data-delay="1">

          {/* Blocs d'info (adresse, tel, email, horaires) */}
          <div className="contact-infos">
            {INFOS.map((info) => (
              <div className="info-bloc" key={info.label}>
                <span className="info-icone">{info.icone}</span>
                <div>
                  <p className="info-label">{info.label}</p>
                  <p className="info-valeur">{info.valeur}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ligne de séparation */}
          <div className="separateur" />

          {/* Formulaire */}
          <form className="formulaire" onSubmit={handleSubmit}>

            {/* Champ Nom */}
            <div className="champ">
              <label className="champ-label" htmlFor="nom">Nom complet</label>
              <input
                className="champ-input"
                type="text"
                id="nom"
                name="nom"
                placeholder="Jean Dupont"
                value={formulaire.nom}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Email */}
            <div className="champ">
              <label className="champ-label" htmlFor="email">Email</label>
              <input
                className="champ-input"
                type="email"
                id="email"
                name="email"
                placeholder="jean@example.com"
                value={formulaire.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Message */}
            <div className="champ">
              <label className="champ-label" htmlFor="message">Message</label>
              <textarea
                className="champ-input champ-textarea"
                id="message"
                name="message"
                placeholder="Votre message..."
                rows={5}
                value={formulaire.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* Bouton envoi */}
            <button className="btn-envoyer" type="submit" disabled={envoye}>
              {envoye ? '✓ Message envoyé !' : 'Envoyer le message →'}
            </button>

          </form>
        </div>

        {/* ── DROITE : Google Maps ── */}
        <div className="contact-droite reveal" data-delay="2">

          {/* 
            GOOGLE MAPS EMBED
            ─────────────────
            Pour mettre votre vraie adresse :
            1. Allez sur maps.google.com
            2. Cherchez votre adresse
            3. Cliquez "Partager" → "Intégrer une carte"
            4. Copiez l'URL du src="..." et remplacez ci-dessous
          */}
          <div className="carte-map">
            <iframe
              title="Localisation du gym"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047342088!2d2.3002774!3d48.8737815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc4693eb021%3A0x6e6f5fba1a7e6ba5!2sArc%20de%20Triomphe!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Badge adresse sur la carte */}
          <div className="carte-adresse">
            <span className="carte-point">●</span>
            <span>12 Rue du Sport, Paris 75008</span>
          </div>

        </div>
      </div>

    </section>
  );
}