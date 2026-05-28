import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './CardContenu.css';

const classes = [
  { id:1, title:'Fitness & Exercise Class', description:'Common cardiovascular exercise equipment includes treadmills, stationary bikes, and elliptical machines.', image:'m1.jpeg', duration:'60 min', level:'Débutant' },
  { id:2, title:'Individual Instruction', description:'One-on-one coaching sessions tailored to your personal fitness goals.', image:'m2.jpeg', duration:'45 min', level:'Tous niveaux' },
  { id:3, title:'Boxing Course', description:'Learn boxing fundamentals, improve coordination and burn calories.', image:'m3.jpeg', duration:'75 min', level:'Intermédiaire' },
  { id:4, title:'Cross-Fit Exercise', description:'High-intensity functional movements to build strength and endurance.', image:'m5.jpeg', duration:'50 min', level:'Avancé' },
  { id:5, title:'Pilates & Yoga', description:'Improve flexibility, balance and mental clarity through mindful movement.', image:'m4.jpeg', duration:'60 min', level:'Débutant' },
];

export default function CardContenu() {
  const [active, setActive]       = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const current = classes[active];

  return (
    <>
      <section className="gc-section" id="classes">
        <p className="gc-label">Fitness and Gym Training</p>
        <h2 className="gc-heading">Our <span>Fitness</span> Classes in the Gym</h2>

        <div className="gc-content">
          <div className="gc-left">
            <img className="gc-image" src={current.image} alt={current.title} />
            <div className="gc-card">
              <h3 className="gc-card-title">{current.title}</h3>
              <p className="gc-card-text">{current.description}</p>
              <button className="gc-btn" onClick={() => setPanelOpen(true)}>
                View Details
              </button>
            </div>
          </div>

          <div className="gc-right">
            {classes.map((item, index) => (
              <button
                key={item.id}
                className={`gc-list-item ${active === index ? 'active' : ''}`}
                onClick={() => setActive(index)}
              >
                <span className="gc-list-title">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Overlay */}
      <div
        className={`sp-overlay ${panelOpen ? 'sp-overlay--open' : ''}`}
        onClick={() => setPanelOpen(false)}
      />

      {/* Side Panel */}
      <div className={`sp-panel ${panelOpen ? 'sp-panel--open' : ''}`}>

        <img className="sp-hero" src={current.image} alt={current.title} />
        <button className="sp-close" onClick={() => setPanelOpen(false)}>✕</button>

        <div className="sp-body">
          <span className="sp-badge">{current.level}</span>
          <h3 className="sp-title">{current.title}</h3>
          <p className="sp-desc">{current.description}</p>
          <hr className="sp-divider" />
          <div className="sp-meta">
            <div className="sp-meta-item">
              <span className="sp-meta-icon">⏱</span>
              {current.duration}
            </div>
            <div className="sp-meta-item">
              <span className="sp-meta-icon">⭐</span>
              {current.level}
            </div>
          </div>
        </div>

          <NavLink to="/Login" className="sp-enroll" >S'inscrire se cours</NavLink>
        <div className="sp-footer">
        </div>

      </div>
    </>
  );
}