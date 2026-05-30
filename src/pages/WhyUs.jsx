import { useState } from "react";
import { NavLink } from 'react-router-dom';
import "./whyUs.css";

const features = [
  "Community & Group Exercise",
  "Group Fitness and Community",
  "Positive Impact on Mental Health",
  "Variety of Workouts",
  "Expert Coaching Staff",
  "Modern Equipment",
];

const modalFeatures = [
  { text: "Community & Group Training — work out together, progress faster" },
  { text: "Mental Health Benefits — reduce stress, boost your energy and focus" },
  { text: "Workout Variety — cardio, strength, yoga, boxing and much more" },
];

export default function WhyChooseUs() {
  const [modal, setModal] = useState(false);

  return (
    <>
      <section className="wcu-section" id="whyUs">
        <div className="wcu-inner">

          {/* Left: stacked images */}
          <div className="wcu-images">
            <div className="wcu-img-back">
              <img src="p.jpeg" alt="gym" />
            </div>
            <div className="wcu-img-front">
              <img src="p2.jpeg" alt="trainer" />
            </div>
            <div className="wcu-accent" />
          </div>

          {/* Right: text */}
          <div className="wcu-content">
            <p className="wcu-eyebrow">Why Choose Us</p>

            <h2 className="wcu-heading">
              Energizing <em>Exercise</em> Programs<br />
              for Both <em>Body</em> and Mind
            </h2>

            <p className="wcu-desc">
              Our members benefit from personalized training plans crafted by
              certified coaches to match their specific goals — whether it's
              weight loss, muscle building, or boosting athletic performance.
            </p>

            <div className="wcu-features">
              {features.map((f, i) => (
                <div key={i} className="wcu-feat">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="#3D4F5A"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            <button className="wcu-btn" onClick={() => setModal(true)}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div className="wcu-overlay" onClick={() => setModal(false)}>
          <div className="wcu-modal" onClick={(e) => e.stopPropagation()}>

            <span className="wcu-modal-badge">Our Program</span>

            <h3 className="wcu-modal-title">
              Energizing <em>Exercise</em><br />for Body & Mind
            </h3>

            <p className="wcu-modal-desc">
              Our gym offers comprehensive programs tailored to all fitness levels.
              Whether you're a complete beginner or an experienced athlete, our
              certified coaches will guide you toward your goals using proven,
              results-driven methods.
            </p>

            <div className="wcu-stats">
              <div className="wcu-stat"><p className="sv">15+</p><p className="sl">Coaches</p></div>
              <div className="wcu-stat"><p className="sv">50+</p><p className="sl">Classes / week</p></div>
              <div className="wcu-stat"><p className="sv">98%</p><p className="sl">Satisfaction</p></div>
            </div>

            <div className="wcu-modal-feats">
              {modalFeatures.map((f, i) => (
                <div key={i} className="wcu-mf">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="wcu-modal-foot">
              <NavLink to="/Login" className="wcu-btn-primary">Join Now</NavLink>
              <button className="wcu-btn-ghost" onClick={() => setModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}