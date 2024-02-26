import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import CarListingPage from './CarListingPage';
import ContactPage from './ContactPage';
import Login from './Login';
import ReservationPage from './ReservationPage';
import './App.css';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Car_Listing">Car Listing</Link></li>
        <li><Link to="/Contact">Contact</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Reservation">Reserve</Link></li>
      </ul>
    </nav>
  );
}

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Car_Listing" element={<CarListingPage />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Reservation/:id" element={<ReservationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
