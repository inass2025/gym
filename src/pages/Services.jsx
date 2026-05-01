import './Services.css';

const classes = [
  {
    id: 1,
    image: '/coaches/c1.jpeg',
    title: 'Strength Training',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    session: 'WEEKLY',
    duration: '60 MIN',
    level: 'BEGINNER',
    coach: 'JACOB JONES',
  },
  {
    id: 2,
    image: '/coaches/c2.jpeg',
    title: 'HIIT Workouts',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    session: 'MON-SAT',
    duration: '60 MIN',
    level: 'BEGINNER',
    coach: 'SAVANNAH N.',
  },
  {
    id: 3,
   image: '/coaches/c3.jpeg',
    title: 'Functional Movement',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    session: 'WEEKLY',
    duration: '60 MIN',
    level: 'INTERMEDIATE',
    coach: 'ESTHER H.',
  },
  {
    id: 4,
   image: '/coaches/c4.jpeg',
    title: 'Athletic Development',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    session: 'WEEKLY',
    duration: '60 MIN',
    level: 'INTERMEDIATE',
    coach: 'ESTHER H.',
  },
];

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Services() {
  return (
    <section className="classes" id="Coaches">

      {/* Header */}
      <div className="classes__header">
  <h2 className="classes__title">
    Your Goals.{' '}
    <em className="classes__title-red">Your</em>
    <br />
    <em className="classes__title-red">Plan.</em>
  </h2>
  <p className="classes__desc">
    We firmly believe that fitness isn't one size fits all. Whether you want
    to build strength, lose weight, improve mobility, or simply feel better
    in your body, we align ourselves around you with personalized training
    strategies to help you claim your goal.
  </p>
</div>

      {/* Cards list */}
      <div className="classes__list">
        {classes.map((item) => (
          <div className="classes__card" key={item.id}>

            {/* Left image */}
            <div className="classes__card-img">
              <img src={item.image} alt={item.title} />
            </div>

            {/* Right content */}
            <div className="classes__card-body">
              <h3 className="classes__card-title">{item.title}</h3>
              <p className="classes__card-desc">{item.desc}</p>

              {/* Meta info */}
              <div className="classes__meta">
                <div className="classes__meta-item">
                  <span className="classes__meta-label">SESSION</span>
                  <span className="classes__meta-value">{item.session}</span>
                </div>
                <div className="classes__meta-item">
                  <span className="classes__meta-label">DURATION</span>
                  <span className="classes__meta-value">{item.duration}</span>
                </div>
                <div className="classes__meta-item">
                  <span className="classes__meta-label">LEVEL</span>
                  <span className="classes__meta-value">{item.level}</span>
                </div>
                <div className="classes__meta-item">
                  <span className="classes__meta-label">COACH</span>
                  <span className="classes__meta-value">{item.coach}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="classes__actions">
                <a href="#" className="classes__btn classes__btn--primary">
                  LEARN MORE <span>→</span>
                </a>
                <a href="#" className="classes__btn classes__btn--ghost">
                  CONTACT COACH <span>→</span>
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}