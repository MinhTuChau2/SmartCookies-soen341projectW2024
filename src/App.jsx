import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import CarListingPage from './CarListingPage';
import ContactPage from './ContactPage';
import Login from './Login';
import './App.css';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/CarListingPage">Car Listing</Link></li>
        <li><Link to="/ContactPage">Contact</Link></li>
        <li><Link to="/LoginPage">Login</Link></li>
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
        <Route path="/CarListingPage" element={<CarListingPage />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/LoginPage" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
