import React from 'react';
import './Card.css';

const Card = ({ title, description, imageUrl, isAccent = false }) => {
  return (
    <div className={`card ${isAccent ? 'accent' : ''}`}>
      <img 
        className="card-img" 
        src={imageUrl} 
        alt={title} 
      />
      <div className="card-body">
        <p className="card-title">{title}</p>
        <p className="card-desc">{description}</p>
      </div>
    </div>
  );
};

export default Card;