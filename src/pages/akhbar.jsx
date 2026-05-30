import { useState } from "react";
import "./akhbar.css";

const articles = [
  {
    id: 1,
    img: "/pg1.jpeg",
    date: "12 Jan, 2024",
    comments: "5 Comments",
    title: "5 Must-Do Exercises to Build a Stronger Body",
    excerpt: "Whether you're just starting out or a seasoned lifter, these 5 foundational movements will transform your physique in weeks.",
    full: "Squats, deadlifts, bench press, pull-ups, and planks are the backbone of any effective training program. Master proper form before adding weight, combine them with the right nutrition, and you'll see real results within your first month. Our certified coaches are here to guide you every step of the way.",
  },
  {
    id: 2,
    img: "/pg2.jpeg",
    date: "18 Jan, 2024",
    comments: "3 Comments",
    title: "How to Build a Training Program That Fits Your Goals",
    excerpt: "A well-structured program is 80% of your results. Here's how to build one around your real objectives — not someone else's.",
    full: "Muscle gain, fat loss, or general fitness — each goal requires a different approach. Learn how to balance strength training and cardio, schedule your rest days, and progressively increase intensity week by week. Our certified coaches are available to create your personalized plan from day one.",
  },
  {
    id: 3,
    img: "/pg3.jpeg",
    date: "25 Jan, 2024",
    comments: "8 Comments",
    title: "Gym Nutrition: What You Actually Need to Eat to See Results",
    excerpt: "Training builds your body, but nutrition reveals it. Here are the fundamentals every gym-goer needs to know.",
    full: "Protein, complex carbs, healthy fats — each macronutrient plays a specific role in your progress. We break down what to eat before and after your workout, how to stay properly hydrated, and why no supplement replaces a solid diet. Our in-house nutrition experts are ready to help you fuel your performance.",
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