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


const Header = () => {
  const { currentUser, signOut } = useAuth(); // Use the useAuth hook

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
        </ul>
      </nav>
      {currentUser ? (
        <div>
          <span>Hi, {currentUser.username}</span> {/* Display the username */}
          <button onClick={signOut} className="sign-in-btn">Sign Out</button> {/* Sign out button */}
        </div>
      ) : (
        <Link to="/Login" className="sign-in-btn">Sign In</Link>
      )}
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




