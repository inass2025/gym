import logo from './logo.svg';
import './App.css';
import Layout from './components/layout';
import Home from './components/interface';
import Login from './pages/Login';
import About from './pages/About';
import MoreAbout from './pages/MoreAbout';
import Gallery from './pages/Gallery';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Contact from './pages/Contact';

function App() {
  
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        <Route path="/gallery" element={<Gallery/>} />
        <Route path="/contact" element={<Contact/>} />
         <Route path="Login" element={<Login/>} />
        <Route path="/join" element={<h1>Join Page</h1>} />
        <Route path="/MoreAbout" element={<MoreAbout/>} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
