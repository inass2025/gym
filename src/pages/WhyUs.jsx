import { useState } from "react";

const features = [
 ["Community & Group Exercise", "Group Fitness and Community"],
 ["Impact on Mental Health", "Group Fitness and Community"],
 ["Variety in Exercise", "Group Fitness and Community"],
];

export default function WhyChooseUs() {
 const [hovered, setHovered] = useState(false);

 return (
   <>
     <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:ital,wght@0,700;0,800;1,700;1,800&display=swap');
       @keyframes fadeLeft {
         from { opacity: 0; transform: translateX(-40px); }
         to   { opacity: 1; transform: translateX(0); }
       }
       @keyframes fadeRight {
         from { opacity: 0; transform: translateX(40px); }
         to   { opacity: 1; transform: translateX(0); }
       }
       @keyframes fadeUp {
         from { opacity: 0; transform: translateY(20px); }
         to   { opacity: 1; transform: translateY(0); }
       }
       * { box-sizing: border-box; margin: 0; padding: 0; }
     `}</style>

     <section style={{
       background: "#2E2C26",
       minHeight: "100vh",
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       padding: "10px 10px",
       fontFamily: "'Barlow', sans-serif",
       overflow: "hidden",
     }}>
       <div style={{
         display: "flex",
         alignItems: "center",
         gap: 70,
         maxWidth: 1100,
         width: "100%",
         flexWrap: "wrap",
       }}>

         {/* ── LEFT : images empilées ── */}
         <div style={{
           position: "relative",
           width: 320,
           height: 400,
           flexShrink: 0,
           animation: "fadeLeft 0.7s ease both",
         }}>
           {/* Image arrière (petite, en haut à gauche) */}
           <div style={{
             position: "absolute",
             top: 0,
             left: 0,
             width: 170,
             height: 210,
             borderRadius: 4,
             overflow: "hidden",
             zIndex: 1,
             boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
           }}>
             <img
               src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop&crop=center"
               alt="gym"
               style={{ width: "100%", height: "100%", objectFit: "cover" }}
             />
           </div>

           {/* Image avant (grande, décalée en bas à droite) */}
           <div style={{
             position: "absolute",
             bottom: 0,
             right: 0,
             width: 220,
             height: 300,
             borderRadius: 4,
             overflow: "hidden",
             zIndex: 2,
             boxShadow: "0 12px 48px rgba(0,0,0,0.7)",
           }}>
             <img
               src="https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=500&h=600&fit=crop&crop=top"
               alt="trainer"
               style={{ width: "100%", height: "100%", objectFit: "cover" }}
             />
           </div>

           {/* Accent orange décoratif */}
           <div style={{
             position: "absolute",
             top: 30,
             left: 130,
             width: 50,
             height: 50,
             background: "#3D4F5A",
             borderRadius: 2,
             zIndex: 0,
             opacity: 0.85,
           }} />
         </div>

         {/* ── RIGHT : texte ── */}
         <div style={{
           flex: 1,
           minWidth: 300,
           animation: "fadeRight 0.7s ease 0.15s both",
         }}>
           {/* Label */}
           <p style={{
             fontSize: 11,
             fontWeight: 800,
             letterSpacing: "0.18em",
             color: "#3D4F5A",
             textTransform: "uppercase",
             marginBottom: 16,
             fontFamily: "'Barlow Condensed', sans-serif",
           }}>
             WHY CHOOSE US
           </p>

           {/* Heading */}
           <h2 style={{
             fontSize: "clamp(28px, 3.5vw, 46px)",
             fontWeight: 700,
             color: "#ffffff",
             lineHeight: 1.15,
             marginBottom: 20,
             fontFamily: "'Barlow Condensed', sans-serif",
           }}>
             Energizing{" "}
             <span style={{ color: "#3D4F5A", fontStyle: "italic" }}>Exercise</span>
             {" "}Program{" "}<br />
             for Both{" "}
             <span style={{ color: "#3D4F5A", fontStyle: "italic" }}>Body</span>
             {" "}and Mind
           </h2>

           {/* Description */}
           <p style={{
             fontSize: 13,
             color: "#999",
             lineHeight: 1.75,
             marginBottom: 28,
             maxWidth: 480,
           }}>
             Many people gain from customized exercise regimens created by personal trainers or fitness
             experts to target particular fitness objectives, such weight loss, muscle gain, or enhanced
             athletic performance. The flexibility to choose is offered by gyms a range of routines that
             let people personalize their regimens.
           </p>

           {/* Feature grid */}
           <div style={{
             display: "grid",
             gridTemplateColumns: "1fr 1fr",
             gap: "10px 32px",
             marginBottom: 36,
           }}>
             {features.map(([left, right], i) => (
               <>
                 {/* Colonne gauche */}
                 <div key={`l-${i}`} style={{
                   display: "flex",
                   alignItems: "center",
                   gap: 8,
                   fontSize: 12,
                   color: "#ccc",
                   animation: `fadeUp 0.5s ease ${0.3 + i * 0.1}s both`,
                 }}>
                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                     <polyline points="20 6 9 17 4 12" stroke="#3D4F5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                   {left}
                 </div>
                 {/* Colonne droite */}
                 <div key={`r-${i}`} style={{
                   display: "flex",
                   alignItems: "center",
                   gap: 8,
                   fontSize: 12,
                   color: "#ccc",
                   animation: `fadeUp 0.5s ease ${0.35 + i * 0.1}s both`,
                 }}>
                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                     <polyline points="20 6 9 17 4 12" stroke="#3D4F5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                   {right}
                 </div>
               </>
             ))}
           </div>

           {/* Bouton */}
           <button
             onMouseEnter={() => setHovered(true)}
             onMouseLeave={() => setHovered(false)}
             style={{
               background: hovered ? "#3D4F5A" : "#3D4F5A",
               color: "#fff",
               border: "none",
               padding: "13px 32px",
               fontSize: 12,
               fontWeight: 700,
               letterSpacing: "0.12em",
               textTransform: "uppercase",
               cursor: "pointer",
               fontFamily: "'Barlow Condensed', sans-serif",
               transition: "background 0.3s ease, transform 0.2s ease",
               transform: hovered ? "translateY(-2px)" : "translateY(0)",
               borderRadius: 2,
             }}
           >
             LEARN MORE
           </button>
         </div>

       </div>
     </section>
   </>
 );
}