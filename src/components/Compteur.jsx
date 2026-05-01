import React, { useEffect, useState } from "react";
import "./Compteur.css";

function Stats() {
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  const [v3, setV3] = useState(0);

  // fonction animation
  const animate = (setValue, end, duration = 2000) => {
    let start = 0;
    const steps = 60;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setValue(Math.round(start));
    }, duration / steps);
  };

  useEffect(() => {
    setTimeout(() => animate(setV1, 500), 400);
    setTimeout(() => animate(setV2, 1000), 600);
    setTimeout(() => animate(setV3, 10000), 800);
  }, []);

  return (
    <div className="stats">

      <div className="stat">
        <div className="stat-value">{v1}+</div>
        <div className="stat-label">Active Members</div>
      </div>

      <div className="divider"></div>

      <div className="stat">
        <div className="stat-value">{v2}K</div>
        <div className="stat-label">Active Members</div>
      </div>

      <div className="divider"></div>

      <div className="stat">
        <div className="stat-value">{v3}M</div>
        <div className="stat-label">Transformations</div>
      </div>

    </div>
  );
}

export default Stats;