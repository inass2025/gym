import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './CardContenu.css';

const classes = [
  { id:1, title:'Fitness & Cardio', description:'Burn calories and boost endurance with guided cardio sessions on treadmills, stationary bikes, and elliptical machines.', image:'m1.jpeg', duration:'60 min', level:'Beginner' },
  { id:2, title:'Personal Coaching', description:'One-on-one coaching sessions fully tailored to your personal fitness goals and body type.', image:'m2.jpeg', duration:'45 min', level:'All Levels' },
  { id:3, title:'Boxing', description:'Master boxing fundamentals, sharpen your reflexes, and burn serious calories in every round.', image:'m3.jpeg', duration:'75 min', level:'Intermediate' },
  { id:4, title:'CrossFit', description:'High-intensity functional movements designed to build strength, power, and endurance.', image:'m5.jpeg', duration:'50 min', level:'Advanced' },
  { id:5, title:'Pilates & Yoga', description:'Improve flexibility, restore balance, and clear your mind through mindful low-impact movement.', image:'m4.jpeg', duration:'60 min', level:'Beginner' },
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
</svg>
              {current.level}
            </div>
          </div>
        </div>

        <NavLink to="/Login" className="sp-enroll">Enroll in this Class</NavLink>
        <div className="sp-footer">
        </div>

      </div>
    </>
  );
}