import './App.css';
import Layout from './components/layout';
import Home from './components/interface';
import Login from './pages/Login';
import About from './pages/About';
import MoreAbout from './pages/MoreAbout';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdherentPage from './pages/AdherentPages/AdherentPage';
import LayoutAd from './components/AdherentComponents/layout';
import Dashboard from './pages/AdherentPages/dashboard';
import MyReservations from './pages/AdherentPages/MyReservations';
import Abonnement from './pages/AdherentPages/Abonnement';
import Chat from './pages/AdherentPages/message';
import Performances from './pages/AdherentPages/Performances';
import MesAbonnements from './pages/AdherentPages/MesAbonnements';
import MonProgramme from './pages/AdherentPages/MonProgramme';
import NotificationBell from './pages/AdherentPages/NotificationBell';
// Coach imports
import CoachLayout from './components/CoachComponents/CoachLayout';
import CoachDashboard from './pages/CoachPages/CoachDashboard';
import CoachProfil from './pages/CoachPages/CoachProfil';
import CoachProgrammes from './pages/CoachPages/CoachProgrammes';


//admin imports
import AdminLayout from './components/AdminComponents/AdminLayout';
import GestionAdherent from './pages/AdminPages/GestionAdherent';
import GestionCours from './pages/AdminPages/GestionCours';
import DashboardAdmin from './pages/AdminPages/DashboardAdmin';

import CoachGestion from './pages/AdminPages/GoachGestion';

// import CoachParticipants from './pages/CoachPages/CoachParticipants';
import CoachClients from './pages/CoachPages/CoachClients';
import CoachPlanning from './pages/CoachPages/CoachPlanning';
import CoachChat from './pages/CoachPages/CoachChat';
import PrivateRoute from './components/PrivateRoute';

import Abonnements from './pages/AdminPages/Abonnement';
import Paiements   from './pages/AdminPages/Paiements';


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔵 Public Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="moreabout" element={<MoreAbout />} />
        </Route>

        {/* 🔴 Adherent Layout */}
      {/* 🔴 Adherent Layout */}
<Route path="/adherent" element={
  <PrivateRoute allowedRoles={['adherent']}>
    <LayoutAd />
  </PrivateRoute>
}>
  <Route index element={<Dashboard />} />
  <Route path="coach" element={<AdherentPage />} />
  <Route path="MyReservations" element={<MyReservations />} />
  <Route path="Abonnement" element={<Abonnement />} />
  <Route path="MesAbonnements" element={<MesAbonnements />} />
  <Route path="MonProgramme" element={<MonProgramme />} />
  <Route path="Notification" element={<NotificationBell />} />
  <Route path="/adherent/performances" element={<Performances />} />
  <Route path="chat" element={<Chat />} />
</Route>

{/* 🟢 Coach Layout */}
<Route path="/coach" element={
  <PrivateRoute allowedRoles={['coach', 'admin']}>
    <CoachLayout />
  </PrivateRoute>
}>
  <Route index element={<CoachDashboard />} />
  <Route path="profil" element={<CoachProfil />} />
  <Route path="programmes" element={<CoachProgrammes />} />
  <Route path="clients" element={<CoachClients />} />
  <Route path="planning" element={<CoachPlanning />} />
  <Route path="chat" element={<CoachChat />} />
</Route>

{/* 🔴 Admin Layout */}
  <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard"    element={<DashboardAdmin />} />
  <Route path="coaches"      element={<CoachGestion />} />
  <Route path="Adherent"     element={<GestionAdherent />} />
  <Route path="cours"        element={<GestionCours />} />
  <Route path="abonnements"  element={<Abonnements />} />
  <Route path="paiements"    element={<Paiements />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;