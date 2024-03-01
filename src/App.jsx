import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import CarListingPage from './CarListingPage';
import ContactPage from './ContactPage';
import Login from './Login';
import ReservationPage from './ReservationPage';
import './App.css';
import Logo from './Logo.jpeg';

const App = () => {
  return (
    <Router>
      <header className="header">
       <a href="/" target="_self">
         <img src={Logo} alt="Logo" className="logo"/>
       </a>
        <span className="company-name">Cookie Cruisers</span>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Car_Listing">Cars</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            <li><Link to="/Reservation">Reserve</Link></li>
          </ul>
        </nav>
        <Link to="/Login" className="sign-in-btn">Sign In</Link>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Car_Listing" element={<CarListingPage />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Reservation/:id" element={<ReservationPage />} />
        <Route path="/Reservation" element={<ReservationPage />} />
      </Routes>
    </Router>
  );
}

export default App;

