
 import React, { useEffect, useState } from "react";
import "./resulte.css";

function Results() {
  const [index, setIndex] = useState(0);

  const personnes = [
  {
   
    before: "/result/c1.png",
    after: "/result/c1Result.png"
  },
  {
   
    before: "/result/c2.png",
    after: "/result/c2Result.png"
  }
];
  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % personnes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section">

      {/* LEFT */}
      <div className="gauche">
        <span className="etiquette">Real Results</span>

        <h1 className="titre">
          Real People.<br />
          <span>Real Results.</span>
        </h1>

        <p className="texte">
          Transform your body with personalized coaching and real progress.
        </p>

        {/* DOTS */}
        <div className="dots">
          {personnes.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === index ? "actif" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        {/* INFO */}
       
      </div>

      {/* RIGHT */}
      <div className="droite">
        <div className="carousel">

          {personnes.map((p, i) => (
            <div
              key={i}
              className={`carte ${i === index ? "active" : ""}`}
            >

              {/* BEFORE */}
              <div className="photo">
                <img src={p.before} alt="before" />
                <span className="badge badge-avant">Before</span>
              </div>

              {/* SEPARATOR */}
              <div className="separateur">
                <div className="ligne-sep"></div>
                <div className="fleche-sep">→</div>
                <div className="ligne-sep"></div>
              </div>

              {/* AFTER */}
              <div className="photo">
                <img src={p.after} alt="after" />
                <span className="badge badge-apres">After</span>
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default Results;