import { useState } from "react";

const trainers = [
  {
    id: 1,
    name: "Thomas Millar",
    role: "Exercise Trainer",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Evelyn",
    role: "Gym Trainer",
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Mark",
    role: "Gym Trainer",
    img: null,
  },
  {
    id: 4,
    name: "Eliana",
    role: "Exercise Trainer",
    img: "https://images.unsplash.com/photo-1609899537878-48a5a85b7e9e?w=300&h=300&fit=crop&crop=face",
  },
];

function TrainerCard({ trainer, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
        cursor: "pointer",
        animation: `fadeUp 0.5s ease ${index * 0.12}s both`,
      }}
    >
      {/* Anneau pointillé */}
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          padding: 5,
          border: `2px dashed ${hovered ? "#3D4F5A" : "#3a3a3a"}`,
          transition: "border-color 0.3s ease, transform 0.4s ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            background: "#2d2d2d",
          }}
        >
          {trainer.img ? (
            <>
              <img
                src={trainer.img}
                alt={trainer.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: hovered ? "scale(1.06)" : "scale(1)",
                  transition: "transform 0.4s ease",
                }}
              />
              {/* Overlay hover orange */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#3D4F5A",
                  opacity: hovered ? 0.25 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            </>
          ) : (
            /* Slot "+" pour ajouter un trainer */
            <div
              style={{
                width: "100%",
                height: "100%",
                background: hovered ? "#3D4F5A" : "#3D4F5A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 300,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nom et rôle */}
      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: hovered ? "#3D4F5A" : "#ffffff",
            letterSpacing: "0.01em",
            marginBottom: 4,
            transition: "color 0.3s ease",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          {trainer.name}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "#888888",
            letterSpacing: "0.03em",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          {trainer.role}
        </p>
      </div>
    </div>
  );
}

export default function TrainerSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;700&family=Barlow+Condensed:ital,wght@0,700;1,700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <section
        style={{
          background: "#2E2C26",
         
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        {/* Label */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "#3D4F5A",
            textTransform: "uppercase",
            marginBottom: 14,
            fontFamily: "'Barlow Condensed', sans-serif",
          }}
        >
          OUR TRAINER
        </p>

        {/* Titre */}
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 56,
            lineHeight: 1.1,
            fontFamily: "'Barlow Condensed', sans-serif",
            textAlign: "center",
          }}
        >
          Meet Our{" "}
          <span style={{ color: "#3D4F5A", fontStyle: "italic" }}>
            Proficient
          </span>{" "}
          Trainer
        </h2>

        {/* Grille */}
        <div
          style={{
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {trainers.map((trainer, i) => (
            <TrainerCard key={trainer.id} trainer={trainer} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
