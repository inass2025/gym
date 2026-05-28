
import About from '../pages/About';
import Services from '../pages/Services';
import Footer from '../pages/Footer';
import CardContenu from '../pages/CardContenu';
import Commentaire from '../pages/Commentaire';
import FitnessSection from '../pages/WhyUs';
import Trainers from '../pages/coach';
import BlogSection from '../pages/akhbar';
import './Interface.css';
import {Link} from "react-router-dom"


export default function Home() {
  return (
    <>
    <section className="hero">

      {/* Le fond (::before) et la vignette (::after) sont gérés en CSS */}

      <div className="hero__content">

        {/* Tagline */}
        <small className="hero__tagline">
          Accelerate your progress with a remote personal trainer
        </small>

        {/* Titre principal */}
        <h1 className="hero__title">
          Time to
          <br />
          <span className="hero__title-row">
            <span className="hero__pill">
              <img
                src="/workout.jpg"
                alt="trainer"
              />
            </span>
            Push
          </span>
         
          Your Limits
        </h1>

        {/* Boutons CTA */}
        <div className="hero__ctas">

           <Link to="/Login" className="hero__cta-primary">Get started
           
            <span className="hero__icon hero__icon--dark">↗</span>
         </Link>

          

        </div>
      </div>
  
    </section>
    <div >
                <About/>
                <Services/>
                <CardContenu/>
                <FitnessSection/>
                <BlogSection/>
                <Trainers/>
               
                <Commentaire/>
                
                
                <Footer/>
            </div></>
  )
}


