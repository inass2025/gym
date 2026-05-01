// components/Facilities.jsx
import React from 'react';
import Card from './Cards';
import './CardContenu.css';

const CardContenu = () => {
  const facilitiesData = [
    {
      id: 1,
      title: "Dedicated Training Zones",
      description: "Specialized areas for strength, agility, and sport-specific conditioning with professional-grade flooring and equipment layout.",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      isAccent: true
    },
    {
      id: 2,
      title: "Top-Tier Equipment Brands",
      description: "Featuring premium equipment from industry leaders like Technogym, Hammer Strength, and Life Fitness for optimal results.",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      isAccent: false
    },
    {
      id: 3,
      title: "Clean Private Amenities",
      description: "Luxurious locker rooms with steam showers, towel service, and private changing suites for maximum comfort.",
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
      isAccent: false
    },
    {
      id: 4,
      title: "Recovery & Wellness Area",
      description: "State-of-the-art recovery zone featuring cryotherapy, compression therapy, and professional massage services.",
      imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
      isAccent: false
    },
    {
      id: 5,
      title: "Functional Training Studio",
      description: "Dedicated space for dynamic movements with turf, sleds, battle ropes, and versatile rig systems.",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80",
      isAccent: false
    },
    {
      id: 6,
      title: "Cardio Innovation Zone",
      description: "High-performance cardio deck with interactive screens, virtual training, and personalized tracking technology.",
      imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80",
      isAccent: false
    }
  ];

  return (
    <section className="facilities-section" id="Facilities">
      <p className="ghost-title">Facilities</p>

      <h2 className="main-heading">
        <span className="accent-dot"></span>
        <span>World-Class Facilities For<br />Optimal Performance</span>
      </h2>

      <p className="sub-text">
        Our premium facilities are designed to elevate every aspect of your fitness journey. 
        From cutting-edge equipment to specialized training zones and recovery spaces, 
        we provide everything you need to achieve peak performance.
      </p>

      <div className="facilities-grid">
        {facilitiesData.map((facility) => (
          <Card
            key={facility.id}
            title={facility.title}
            description={facility.description}
            imageUrl={facility.imageUrl}
            isAccent={facility.isAccent}
          />
        ))}
      </div>
    </section>
  );
};

export default CardContenu;