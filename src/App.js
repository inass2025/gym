import './App.css';
import './context/theme.css';
import Layout from './components/layout';
import Home from './components/interface';
import Login from './pages/Login';
import About from './pages/About';
import MoreAbout from './pages/MoreAbout';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdherentPage from './AderentPages/AdherentPage';
import LayoutAd from './AdherentComponents/layout';
import Dashboard from './AderentPages/dashboard';
import MyReservations from './AderentPages/MyReservations';
import Abonnement from './AderentPages/Abonnement';
import Chat from './AderentPages/message';
import Performances from './AderentPages/Performances';
import MesAbonnements from './AderentPages/MesAbonnements';
import MonProgramme from './AderentPages/MonProgramme';
import NotificationBell from './AderentPages/NotificationBell';
// Coach imports
import CoachLayout from './components/CoachComponents/CoachLayout';
import CoachDashboard from './pages/CoachPages/CoachDashboard';
import CoachProfil from './pages/CoachPages/CoachProfil';
import CoachProgrammes from './pages/CoachPages/CoachProgrammes';
// import CoachParticipants from './pages/CoachPages/CoachParticipants';
import CoachClients from './pages/CoachPages/CoachClients';
import CoachPlanning from './pages/CoachPages/CoachPlanning';
import CoachChat from './pages/CoachPages/CoachChat';
import PrivateRoute from './components/PrivateRoute';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔵 Public Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="moreabout" element={<MoreAbout />} />
        </Route>

        {/* 🔴 Adherent Layout */}
        <Route path="/adherent" element={<LayoutAd />}>
          <Route index element={<Dashboard />} />
          <Route path="coach" element={<AdherentPage />} />
          <Route path="MyReservations" element={<MyReservations />} />
          <Route path="Abonnement" element={<Abonnement />} />
          <Route path="MesAbonnements" element={<MesAbonnements />} />
          <Route path="MonProgramme" element={< MonProgramme />} />
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
          {/* <Route path="participants" element={<CoachParticipants />} /> */}
          <Route path="clients" element={<CoachClients />} />
          <Route path="planning" element={<CoachPlanning />} />
          <Route path="chat" element={<CoachChat />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;