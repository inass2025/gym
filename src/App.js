import './App.css';
import Layout from './components/layout';
import Home from './components/interface';
import Login from './pages/Login';
import About from './pages/About';
import MoreAbout from './pages/MoreAbout';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdherentPage from './AderentPages/AdherentPage';
import CoachPage from './pages/CoachPage';
import LayoutAd from './AdherentComponents/layout';
import Dashboard from './AderentPages/dashboard';
import MyReservations from './AderentPages/MyReservations';
import Abonnement from './AderentPages/Abonnement';

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
         

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;