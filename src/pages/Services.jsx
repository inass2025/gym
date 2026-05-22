import React from 'react';
import {useEffect} from 'react'
import './Services.css';
const classes = [
  {
    id: 1,
    image: '/coaches/c1.jpeg',
    title: 'Strength Training',
    desc: 'Build muscle, increase strength, and improve overall fitness through guided resistance exercises and personalized training programs.',
    session: 'WEEKLY',
    duration: '60 MIN',
    level: 'BEGINNER',
    coach: 'JACOB JONES',
  },
  {
    id: 2,
    image: '/coaches/c2.jpeg',
    title: 'HIIT Workouts',
    desc: 'Burn calories faster with high-intensity interval training designed to improve endurance, stamina, and cardiovascular health.',
    session: 'MON-SAT',
    duration: '60 MIN',
    level: 'BEGINNER',
    coach: 'SAVANNAH N.',
  },
  {
    id: 3,
    image: '/coaches/c3.jpeg',
    title: 'Functional Movement',
    desc: 'Enhance flexibility, balance, and daily movement patterns through practical exercises that strengthen your entire body.',
    session: 'WEEKLY',
    duration: '60 MIN',
    level: 'INTERMEDIATE',
    coach: 'ESTHER H.',
  },

];
export default function Sevice() {
  return (
    <section className="fs-section">
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
              <p className="fs-card-text">{card.text}</p>
              <button className="fs-btn">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}