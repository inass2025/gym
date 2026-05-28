import { useState } from "react";
import "./akhbar.css";

const articles = [
  {
    id: 1,
    img: "/pg1.jpeg",
    date: "12 Jan, 2024",
    comments: "5 Comments",
    title: "Top 50 Effective Exercise Tips for Your Health",
    excerpt: "We share the top 50 exercise tips to help you achieve your fitness goals, whether you're a beginner.",
    full: "From warm-up stretches to high-intensity intervals, our guide covers proper form, recovery days, nutrition timing, and mental resilience. Each tip is backed by sports science so you get real results without risking injury.",
  },
  {
    id: 2,
    img: "/pg2.jpeg",
    date: "18 Jan, 2024",
    comments: "3 Comments",
    title: "How to Build a Consistent Gym Routine That Sticks",
    excerpt: "Building a gym routine is easy — sticking to it is the real challenge. Here's what research says.",
    full: "Consistency beats intensity every time. We break down habit stacking, accountability systems, progress tracking apps, and how to overcome the most common plateaus.",
  },
  {
    id: 3,
    img: "/pg3.jpeg",
    date: "25 Jan, 2024",
    comments: "8 Comments",
    title: "Nutrition Basics Every Gym-Goer Should Know",
    excerpt: "What you eat before and after training can make or break your results. Here are the fundamentals.",
    full: "Protein synthesis, glycogen replenishment, micro-nutrient timing — we make it simple. Learn the best pre-workout meals, post-workout recovery foods, and how to hydrate for peak performance.",
  },
];

function ArticleCard({ article, index }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`card ${hovered ? "card--hovered" : ""}`}
      style={{ animationDelay: `${index * 0.13}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card__img-wrapper">
        <img src={article.img} alt={article.title} />
      </div>

      <div className="card__body">
        <div className="card__meta">
          <span className="meta-item">
            <CalendarIcon />
            {article.date}
          </span>
          <span className="meta-item">
            <CommentIcon />
            {article.comments}
          </span>
        </div>

        <h3 className="card__title">{article.title}</h3>
        <p className="card__excerpt">{article.excerpt}</p>

        {expanded && (
          <p className="card__full">{article.full}</p>
        )}

        <div>
          <button
            className="btn-read"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "SHOW LESS" : "READ MORE"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D4F5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D4F5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

export default function BlogSection() {
  return (
    <section className="blog-section" id="Blog">
      <p className="blog-label">BLOG</p>
      <h2 className="blog-heading">
        Our Latest{" "}
        <span>News</span>
        {" "}& Articles
      </h2>
      <div className="cards-wrapper">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}