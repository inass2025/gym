import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navLink = ({ isActive }) => (isActive ? 'active' : '');

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Empêcher le scroll quand le menu est ouvert
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo + liens desktop */}
        <ul className="navbar__links">
          <li>
            <NavLink to="/" className="navbar__logo">
              IronZone
            </NavLink>
          </li>

          <li className="navbar__dot"></li>
          <li>
            <a href="#about" className="navbar__link">
              About Us
            </a>
          </li>

          <li className="navbar__dot"></li>
          <li>
            <a href="#Sevices" className="navbar__link">
              Programs
            </a>
          </li>

          <li className="navbar__dot"></li>
          <li>
             <a href="#classes" className="navbar__link">
              classes
            </a>
          </li>
            <li className="navbar__dot"></li>
          <li>
             <a href="#whyUs" className="navbar__link">
              whyUs
            </a>
          </li>

             <li className="navbar__dot"></li>
          <li>
             <a href="#Blog" className="navbar__link">
              Blog
            </a>
          </li>

          

          
        </ul>

        {/* Boutons droite (desktop) */}
        <div className="navbar__actions">
          <NavLink to="/login" className="navbar__login">
            Log in
          </NavLink>
          <NavLink to="/Gallery" className="navbar__cta">
             Gallery
            <span className="navbar__cta-icon">↗</span>
          </NavLink>
        </div>

        {/* Bouton Hamburger (3 traits) pour mobile */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Menu mobile overlay */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu__header">
          <span className="mobile-menu__logo">IronZone</span>
        </div>
        <div className="mobile-menu__links">
          <a href="#about" onClick={closeMenu}>About Us</a>
          <a href="#Coaches" onClick={closeMenu}>Coaches</a>
          <NavLink to="/membership" onClick={closeMenu} className={navLink}>
            Membership
          </NavLink>
          <NavLink to="/gallery" onClick={closeMenu} className={navLink}>
            Gallery
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={navLink}>
            Contact
          </NavLink>
          <hr className="mobile-menu__divider" />
          <NavLink to="/login" onClick={closeMenu} className="mobile-menu__login">
            Log in
          </NavLink>
          <NavLink to="/join" onClick={closeMenu} className="mobile-menu__cta">
            Join Now <span>↗</span>
          </NavLink>
        </div>
      </div>

      {/* Overlay sombre derrière le menu */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      ></div>
    </>
  );
}