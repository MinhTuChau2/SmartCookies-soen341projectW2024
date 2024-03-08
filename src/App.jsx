import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import CarListingPage from './CarListingPage';
import ContactPage from './ContactPage';
import Login from './Login';
import ReservationPage from './ReservationPage';
import './App.css';
import Logo from './Logo.jpeg';
import SignUp from './SignUp';
import { AuthProvider, useAuth } from './AuthContext.jsx';


// Header component inside App.jsx
const Header = () => {
  const { currentUser, signOut } = useAuth();

  return (
    <header className="header">
      <a href="/" target="_self">
        <img src={Logo} alt="Logo" className="logo" />
      </a>
      <span className="company-name">Cookie Cruisers</span>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Car_Listing">Cars</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
          <li><Link to="/Reservation">Reserve</Link></li>
          {/* Only show this link to superusers */}
          {currentUser?.is_superuser && (
            <li><a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer">Admin Panel</a></li>
          )}
        </ul>
      </nav>
      <div>
        {currentUser ? (
          <div>
            {/* Display username only if currentUser exists */}
            <span>Hi, {currentUser.username}</span>
            <button onClick={signOut} className="sign-in-btn">Sign Out</button>
          </div>
        ) : (
          <Link to="/Login" className="sign-in-btn">Sign In</Link>
        )}
      </div>
    </header>
  );
};


const App = () => {
  return (
    <AuthProvider> {/* Wrap your application within AuthProvider */}
      <Router>
        <Header /> {/* Header is now a separate component */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Car_Listing" element={<CarListingPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Reservation/:id/:carType" element={<ReservationPage />} />
          <Route path="/Reservation" element={<ReservationPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;




