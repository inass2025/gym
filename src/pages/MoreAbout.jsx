import React from 'react';
import './MoreAbout.css';
import Stats from '../components/Compteur';
import Video from './Video';


const MoreAbout = () => {
  // Données des valeurs
  const values = [
    {
      id: 1,
      icon: "💪",
      title: "Commitment",
      description: "We show up every day, rain or shine. Consistency is the foundation of every transformation we've ever witnessed."
    },
    {
      id: 2,
      icon: "🎯",
      title: "Precision",
      description: "Every program is tailored. No two members are alike, and our coaching reflects that — personalized from day one."
    },
    {
      id: 3,
      icon: "🤝",
      title: "Community",
      description: "We lift each other. HypeGym is more than a gym — it's a family of people pushing each other to be their best."
    },
    {
      id: 4,
      icon: "🔬",
      title: "Science-Based",
      description: "All our programs are backed by the latest research in sports science, nutrition, and recovery."
    },
    {
      id: 5,
      icon: "⚡",
      title: "Energy",
      description: "The atmosphere at HypeGym is electric. Walk in uninspired, walk out unstoppable — every single session."
    },
    {
      id: 6,
      icon: "🏅",
      title: "Excellence",
      description: "We hold ourselves to the highest standards — in our facilities, our staff, and the results we deliver."
    }
  ];

 
  return (
    <>
      {/* SECTION NOTRE HISTOIRE */}
      <section className="section" id="story">
        <div className="two-col">
          <div>
            <p className="section-label">Our Story</p>
            <h2 className="section-title">
              Built From<br />
              Passion &<br />
              Purpose
            </h2>
            <p className="section-desc">
              HypeGym was founded in 2009 by two athletes who believed fitness should be
              accessible to everyone — not just the elite. What started as a small garage
              gym has grown into a world-class facility serving thousands of members.
              <br />
              <br />
              Every piece of equipment, every coach, every program — chosen with one goal
              in mind: your transformation. We don't just build bodies, we build confidence,
              discipline, and community.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=700&q=80"
            alt="Our story - HypeGym transformation journey"
          />
        </div>
      </section>

      {/* SECTION NOS VALEURS */}
      <section className="section section-alt">
        <div>
          <p className="section-label">What We Stand For</p>
          <h2 className="section-title">Our Values</h2>

          <div className="values-grid">
            {values.map((value) => (
              <div key={value.id} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <p className="value-title">{value.title}</p>
                <p className="value-text">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CHIFFRES CLÉS */}
      <div className="numbers">
        <Stats />
      </div>

      {/* SECTION ÉQUIPE */}
      <section className="section">
        <div>
          <p className="section-label">The People Behind It</p>
          <h2 className="section-title">Meet Our Team</h2>

       
           <Video/>
         
        </div>
      </section>

      {/* SECTION CTA FINAL */}
      <section className="cta-section">
        <h2 className="cta-title">
          Ready to Start<br />
          <span style={{ color: 'var(--pink)' }}>Your Journey?</span>
        </h2>
        <p className="cta-sub">
          Join thousands of members who have already transformed their lives.
        </p>
        <a href="#" className="btn-pink">
          Get Started Today →
        </a>
      </section>
    </>
  );
};

export default MoreAbout;