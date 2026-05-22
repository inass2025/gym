import { useState } from 'react';
import './CardContenu.css';

const classes = [
  {
    id: 1,
    
    title: 'Fitness & Exercise Class',
    description:
      'Common cardiovascular exercise equipment includes treadmills, stationary bikes, and elliptical machines. These machines help increase stamina, burn calories and improve cardiac health.',
    image: '/images/gym1.jpg',
  },
  {
    id: 2,
    image: '/coaches/c3.jpeg',
    title: 'Individual Instruction',
    description:
      'One-on-one coaching sessions tailored to your personal fitness goals and current level.',
    image: '/coaches/c3.jpeg',
  },
  {
    id: 3,
   
    title: 'Boxing Course',
    description:
      'Learn boxing fundamentals, improve coordination and burn calories in a high-energy environment.',
    image: '/coaches/c3.jpeg',
  },
  {
    id: 4,
    
    title: 'Cross-Fit Exercise',
    description:
      'High-intensity functional movements to build strength, endurance and agility.',
    image: '/coaches/c3.jpeg',
  },
  {
    id: 5,
    
    title: 'Pilates & Yoga',
    description:
      'Improve flexibility, balance and mental clarity through mindful movement practices.',
    image: '/coaches/c3.jpeg',
  },
  {
    id: 6,
   
    title: 'Psychoeducation',
    description:
      'Mental wellness sessions to support motivation, stress management and healthy habits.',
   image: '/coaches/c3.jpeg',
  },
];

export default function CardContenu() {
  const [active, setActive] = useState(0);

  const current = classes[active];

  return (<>
    <section className="gc-section">

      {/* Top label */}
      <p className="gc-label">Fitness and Gym Training</p>

      {/* Heading */}
      <h2 className="gc-heading">
        Our <span>Fitness</span> Classes in the Gym
      </h2>

      {/* Main content */}
      <div className="gc-content">

        {/* Left: image + card */}
        <div className="gc-left">
          <img
            className="gc-image"
            src={current.image}
            alt={current.title}
          />
          <div className="gc-card">
            <span className="gc-card-icon">{current.icon}</span>
            <h3 className="gc-card-title">{current.title}</h3>
            <p className="gc-card-text">{current.description}</p>
            <button className="gc-btn">View Details</button>
          </div>
        </div>

        {/* Right: list of classes */}
        <div className="gc-right">
          {classes.map((item, index) => (
            <button
              key={item.id}
              className={`gc-list-item ${active === index ? 'active' : ''}`}
              onClick={() => setActive(index)}
            >
              <span className="gc-list-icon">{item.icon}</span>
              <span className="gc-list-title">{item.title}</span>
            </button>
          ))}

         
        </div>

      </div>
    </section>
    
       
    
   </>
  )
  
}