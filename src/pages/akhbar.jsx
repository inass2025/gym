import { useState } from "react";

const articles = [
 {
   id: 1,
   img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=top",
   date: "12 Jan, 2024",
   comments: "Comments",
   title: "The Top 50 Effective Exercise Advice Tips for your health.",
   excerpt: "We share the top 50 exercise advice tips to help you achieve your fitness goals. Whether you're a beginner.",
 },
 {
   id: 2,
   img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
   date: "12 Jan, 2024",
   comments: "Comments",
   title: "The Top 50 Effective Exercise Advice Tips for your health.",
   excerpt: "We share the top 50 exercise advice tips to help you achieve your fitness goals. Whether you're a beginner.",
 },
 {
   id: 3,
   img: "https://images.unsplash.com/photo-1518310383802-640c2de311b6?w=600&h=400&fit=crop",
   date: "12 Jan, 2024",
   comments: "Comments",
   title: "The Top 50 Effective Exercise Advice Tips for your health.",
   excerpt: "We share the top 50 exercise advice tips to help you achieve your fitness goals. Whether you're a beginner.",
 },
];

function ArticleCard({ article, index }) {
 const [hovered, setHovered] = useState(false);

 return (
   <div
     onMouseEnter={() => setHovered(true)}
     onMouseLeave={() => setHovered(false)}
     style={{
       background: "#242320",
       borderRadius: 4,
       overflow: "hidden",
       display: "flex",
       flexDirection: "column",
       flex: "1 1 280px",
       maxWidth: 360,
       animation: `fadeUp 0.5s ease ${index * 0.13}s both`,
       boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.3)",
       transform: hovered ? "translateY(-6px)" : "translateY(0)",
       transition: "transform 0.35s ease, box-shadow 0.35s ease",
     }}
   >
     {/* Image */}
     <div style={{ overflow: "hidden", height: 200, position: "relative" }}>
       <img
         src={article.img}
         alt={article.title}
         style={{
           width: "100%",
           height: "100%",
           objectFit: "cover",
           display: "block",
           transform: hovered ? "scale(1.07)" : "scale(1)",
           transition: "transform 0.45s ease",
         }}
       />
     </div>

     {/* Content */}
     <div style={{ padding: "22px 24px 28px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
       {/* Meta */}
       <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
         <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888", fontFamily: "'Barlow', sans-serif" }}>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D4F5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
           </svg>
           {article.date}
         </span>
         <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888", fontFamily: "'Barlow', sans-serif" }}>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D4F5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
           </svg>
           {article.comments}
         </span>
       </div>

       {/* Title */}
       <h3 style={{
         fontSize: 16,
         fontWeight: 700,
         color: hovered ? "#3D4F5A" : "#ffffff",
         lineHeight: 1.45,
         fontFamily: "'Barlow', sans-serif",
         transition: "color 0.3s ease",
       }}>
         {article.title}
       </h3>

       {/* Excerpt */}
       <p style={{ fontSize: 12, color: "#888", lineHeight: 1.7, fontFamily: "'Barlow', sans-serif", flex: 1 }}>
         {article.excerpt}
       </p>

       {/* Button */}
       <div>
         <button style={{
           marginTop: 4,
           background: hovered ? "#73795D" : "#73795D",
           color: "#fff",
           border: "none",
           padding: "10px 22px",
           fontSize: 11,
           fontWeight: 700,
           letterSpacing: "0.1em",
           textTransform: "uppercase",
           cursor: "pointer",
           fontFamily: "'Barlow Condensed', sans-serif",
           transition: "background 0.3s ease",
         }}>
           READ MORE
         </button>
       </div>
     </div>
   </div>
 );
}

export default function BlogSection() {
 return (
   <>
     <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;700&family=Barlow+Condensed:ital,wght@0,700;1,700&display=swap');
       @keyframes fadeUp {
         from { opacity: 0; transform: translateY(28px); }
         to   { opacity: 1; transform: translateY(0); }
       }
       * { box-sizing: border-box; margin: 0; padding: 0; }
     `}</style>

     <section style={{
       background: "#2E2C26",
       minHeight: "100vh",
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
       
        paddingTop: "0",
     }}>
       {/* Label */}
       <p style={{
         fontSize: 11,
         fontWeight: 800,
         letterSpacing: "0.2em",
         color: "#3D4F5A",
         textTransform: "uppercase",
         marginBottom: 14,
         fontFamily: "'Barlow Condensed', sans-serif",
       }}>
         BLOG
       </p>

       {/* Heading */}
       <h2 style={{
         fontSize: "clamp(28px, 4vw, 44px)",
         fontWeight: 700,
         color: "#ffffff",
         marginBottom: 48,
         lineHeight: 1.2,
         fontFamily: "'Barlow Condensed', sans-serif",
         textAlign: "center",
       }}>
         Our Latest{" "}
         <span style={{ color: "#3D4F5A", fontStyle: "italic" }}>News</span>
         {" "}& Articles
       </h2>

       {/* Cards */}
       <div style={{
         display: "flex",
         gap: 24,
         flexWrap: "wrap",
         justifyContent: "center",
         width: "100%",
         maxWidth: 1140,
       }}>
         {articles.map((article, i) => (
           <ArticleCard key={article.id} article={article} index={i} />
         ))}
       </div>
     </section>
   </>
 );
}
