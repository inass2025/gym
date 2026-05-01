import { useState } from 'react';
import './Gallery.css';

// Données des photos (remplace les chemins par tes vraies images)
const photosData = [
  { id: 1, name: 'Zone cardio', cat: 'La Salle', filter: 'salle', size: 'tall', image: '/images/img2.jpeg' },
  { id: 2, name: 'Espace musculation', cat: 'La Salle', filter: 'salle', size: 'square', image: '/images/img3.jpeg' },
  { id: 3, name: 'Entrée principale', cat: 'Extérieur', filter: 'exterieur', size: 'square', image: '/images/img4.jpeg' },
  { id: 4, name: 'Lumières du soir', cat: 'Ambiance', filter: 'ambiance', size: 'wide', image: '/images/img5.jpeg' },
  { id: 5, name: 'Vestiaire hommes', cat: 'Vestiaires', filter: 'vestiaire', size: 'square', image: '/images/img9.jpeg' },
  { id: 6, name: "Vue d'ensemble", cat: 'La Salle', filter: 'salle', size: 'tall', image: '/images/img7.jpeg' },
  { id: 7, name: 'Zone stretching', cat: 'Ambiance', filter: 'ambiance', size: 'square', image: '/images/img1.jpeg' },
  { id: 8, name: 'Douches', cat: 'Vestiaires', filter: 'Ambiance', size: 'wide', image: '/images/img8.jpeg' },

];

export default function Gallery() {
  // État pour le filtre actif
  const [activeFilter, setActiveFilter] = useState('all');

  // Liste des filtres
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'salle', label: 'La Salle' },
    { key: 'vestiaire', label: 'Vestiaires' },
    { key: 'exterieur', label: 'Extérieur' },
    { key: 'ambiance', label: 'Ambiance' },
  ];

  // Filtrer les photos
  const filteredPhotos = activeFilter === 'all'
    ? photosData
    : photosData.filter(photo => photo.filter === activeFilter);

  // Changer de filtre
  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
  };

  return (
    <div className="page">
      {/* Hero band */}
      <div className="hero-band">
        <div>
          <br/><br/><br/>
          <div className="hero-eyebrow">Photo gallery</div>
          <div className="hero-title">Our <em>Space</em></div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters">
        {filters.map((filter, index) => (
          <div key={filter.key} className="filter-group">
            <button
              className={`f-btn ${activeFilter === filter.key ? 'on' : ''}`}
              onClick={() => handleFilterChange(filter.key)}
            >
              {filter.label}
            </button>
            {index < filters.length - 1 && <span className="f-sep">/</span>}
          </div>
        ))}
      </div>

      {/* Grille masonry avec VRAIES IMAGES */}
      <div className="masonry">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={photo.id}
            className="photo-item"
            style={{ animation: `fadeUp 0.35s ease ${idx * 0.06}s both` }}
          >
            <div className={`photo-frame ${photo.size} photo-id-${photo.id}`}>
              {/* VRAIE IMAGE - remplace le SVG */}
              <img 
                src={photo.image} 
                alt={photo.name}
                className="photo-image"
                loading="lazy"
              />
              <div className="photo-num">0{photo.id}</div>
              <div className="photo-overlay">
                <div className="overlay-name">{photo.name}</div>
                <div className="overlay-cat">{photo.cat}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider décoratif */}
      <div className="divider">
        <div className="div-line"></div>
        <div className="div-star">✧</div>
        <div className="div-line"></div>
      </div>

      {/* Bottom bar avec compteur */}
      
    </div>
  );
}