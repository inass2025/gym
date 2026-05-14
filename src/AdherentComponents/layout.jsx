import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdherentSidebar from './AdherentSidebar';
import CoursList from '../AderentPages/CoursList';
import NotificationBell from '../AderentPages/NotificationBell';
import './Layout.css';

const PAGE_TITLES = {
  '/adherent': 'DASHBOARD',
  '/adherent/coach': 'MON COACH',
  '/adherent/MyReservations': 'MES RÉSERVATIONS',
  '/adherent/Abonnement': 'ABONNEMENT',
};

function SidePanel({ open, onClose, onReserved }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          display: open ? 'block' : 'none',
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 998,
        }}
      />

      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: 420, height: '100vh',
        background: '#fff',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        zIndex: 999,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}>

        <div style={{
          padding: '24px 20px 16px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cours disponibles</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
              Sélectionnez un cours à réserver
            </p>
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: 'none',
            fontSize: 20, cursor: 'pointer', color: '#6b7280',
          }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <CoursList onReserved={onReserved} />
        </div>

      </div>
    </>
  );
}

export default function LayoutAd() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [panelOpen, setPanelOpen] = useState(false);

  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const prenom = user.prenom || 'Adhérent';

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit',
    month: 'long',   year: 'numeric',
  });

  const pageTitle = PAGE_TITLES[location.pathname] || 'DASHBOARD';

  return (
    <div className="ad-layout">

      <AdherentSidebar />

      <div className="ad-layout__right">

        <header className="ad-navbar">
          <div className="ad-navbar__left">
            <h1 className="ad-navbar__title">{pageTitle}</h1>
            <p className="ad-navbar__date">
              {today.charAt(0).toUpperCase() + today.slice(1)}&nbsp;—&nbsp;Bienvenue, {prenom} 👋
            </p>
          </div>

          <div className="ad-navbar__right">
            <NotificationBell />

            <button
              className="ad-navbar__reserve"
              onClick={() => setPanelOpen(true)}
            >
              + Réserver un cours
            </button>
          </div>
        </header>

        <main className="ad-main">
          <Outlet />
        </main>

      </div>

      <SidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onReserved={() => setPanelOpen(false)}
      />

    </div>
  );
}