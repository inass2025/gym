import { useState ,  } from "react";
import { useNavigate } from 'react-router-dom';
import "./Layout.css";
import Dashboard from "../AderentPages/dashboard";
import AdherentPage from "../AderentPages/AdherentPage";
import CoursList from "../AderentPages/CoursList";
import MyReservations from "../AderentPages/MyReservations";
import Abonnement from "../AderentPages/Abonnement";


const NAV_ITEMS = [
  { key: "Dashboard", label: "Dashboard", icon: "⚡" },
  { key: "profile",   label: "Profil",    icon: "◈" },
  { key: "MyReservations",   label: "MyReservations",    icon: "~~" },
  { key: "Abonnement",   label: "MyReservations",    icon: "$$" },
 
];

const PAGES = {
  profile:     <AdherentPage />,
  Dashboard:     <Dashboard />,
  MyReservations:     <MyReservations />,
  Abonnement:     <Abonnement />,
 

};

export default function LayoutAd() {
  const [active, setActive] = useState("profile");
   const navigate = useNavigate()

  const handleLogout = () => {
    
    localStorage.removeItem("token")

   
    navigate("/login")
  }

  return (
    <div className="layout">
      {/* ── decorative blobs ── */}
      <div className="blob blob--purple" />
      <div className="blob blob--gold" />

      {/* ══ NAVBAR ══ */}
      <nav className="navbar">
        <a className="navbar__logo" href="#">
          <span className="navbar__logo-dot" />
          GEM
        </a>

        <ul className="navbar__links">
          {NAV_ITEMS.map(({ key, label }) => (
            <li key={key}>
              <button
                className={`navbar__link${active === key ? " navbar__link--active" : ""}`}
                onClick={() => setActive(key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button className="navbar__profile" onClick={() => setActive("profile")}>
          <span className="navbar__avatar">SC</span>
          <span className="navbar__profile-name">Sophie C.</span>
        </button>
      </nav>

      {/* ══ BODY ══ */}
      <div className="layout__body">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar__section">
            <p className="sidebar__label">Navigation</p>
            {NAV_ITEMS.map(({ key, label, icon }) => (
              <button
                key={key}
                className={`sidebar__link${active === key ? " sidebar__link--active" : ""}`}
                onClick={() => setActive(key)}
              >
                <span className="sidebar__icon">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="sidebar__footer">
            <button className="sidebar__link sidebar__link--danger" onClick={handleLogout}>
              <span className="sidebar__icon">↩</span>
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main" key={active}>
          {PAGES[active]}
        </main>
      </div>
    </div>
  );
}