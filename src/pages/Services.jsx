import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const classes = [
  {
    id: 1,
    image: '/image1.jpeg',
    title: 'Strength Training',
    desc: 'Build lean muscle, increase raw strength, and transform your physique through guided resistance training and personalized programs built around your body.',
    session: 'WEEKLY',
    duration: '60 MIN',
    level: 'BEGINNER',
  },
  {
    id: 2,
    image: '/image2.jpeg',
    title: 'HIIT Workouts',
    desc: 'Torch calories and push your limits with high-intensity interval training designed to maximize fat burn, boost endurance, and improve heart health in every session.',
    session: 'MON – SAT',
    duration: '45 MIN',
    level: 'INTERMEDIATE',
  },
  {
    id: 3,
    image: '/image3.jpeg',
    title: 'Functional Movement',
    desc: 'Move better, feel stronger. Our functional training improves your flexibility, balance, and coordination using real-world movements that strengthen your whole body.',
    session: 'WEEKLY',
    duration: '60 MIN',
    level: 'ALL LEVELS',
  },
];

export default function Service() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="fs-section" id="Services">
      <p className="fs-label">Work Procedure</p>
      <h2 className="fs-heading">
        Simple Steps To <span>Reach</span>
        <br />
        Your <span>Objectives.</span>
      </h2>

      <div className="fs-grid">
        {classes.map((card) => (
          <div key={card.id} className="fs-card">
            <div className="fs-card-image">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="fs-card-body">
              <h3 className="fs-card-title">{card.title}</h3>
              <p className="fs-card-text">{card.desc}</p>

              {selected === card.id && (
                <div className="fs-details">
                  <div className="fs-detail-item">
                    <span className="fs-detail-label">Session</span>
                    <span className="fs-detail-value">{card.session}</span>
                  </div>
                  <div className="fs-detail-item">
                    <span className="fs-detail-label">Duration</span>
                    <span className="fs-detail-value">{card.duration}</span>
                  </div>
                  <div className="fs-detail-item">
                    <span className="fs-detail-label">Level</span>
                    <span className="fs-detail-value">{card.level}</span>
                  </div>
                </div>
              )}

              <button
                className="fs-btn"
                onClick={() => setSelected(selected === card.id ? null : card.id)}
              >
                {selected === card.id ? 'Show Less' : 'Learn More'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}