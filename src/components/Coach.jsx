import React, { useState } from "react";
import "./Coach.css";

function Coach() {
  const [current, setCurrent] = useState(0);

  const coaches = [
    {
  
    img: "/coaches/coach1.jpg"
  },{
   
    img: "/coaches/coach2.jpg"
  }
  ];

  const goTo = (index) => {
    const n = coaches.length;
    setCurrent((index + n) % n);
  };

  const getPos = (i) => {
    const n = coaches.length;
    let pos = (i - current + n) % n + 1;
    if (pos > 4) pos = 4;
    return pos;
  };

  return (
    <div className="heroCoach">

      {/* TEXT SECTION */}
      <h1 className="h1">Train Smart. Get Fit</h1>
      <p className="p">
      Start your journey towards a stronger, healthier,
         and more confident version of yourself. With the right training,
          guidance, and motivation, every goal becomes achievable.
         Stay consistent, push your limits, and transform your lifestyle one step at a time
      </p>

      {/* COACH CAROUSEL */}
      <h4>Nos Coachs</h4>

      <div className="pile">
        {coaches.map((coach, i) => (
          <div key={i} className="card" data-pos={getPos(i)}>
            <div className="card-photo"><img src={coach.img} alt={coach.name} /></div>
           
          </div>
        ))}
      </div>

      {/* ARROWS */}
      <div className="arrows">
        <div className="arrow" onClick={() => goTo(current - 1)}>←</div>
        <div className="arrow" onClick={() => goTo(current + 1)}>→</div>
      </div>

      {/* DOTS */}
      <div className="dots">
        {coaches.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

    </div>
  );
}

export default Coach;
