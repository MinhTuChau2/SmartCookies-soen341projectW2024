import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import CarListingPage from './CarListingPage';
import ContactPage from './ContactPage';
import Login from './Login';
import ReservationPage from './ReservationPage';
import './App.css';
import CarsforAdmin from './CarsForAdmin';
import Logo from './Logo.jpeg';
import SignUp from './SignUp';
import CarForm from './CarForm';
import History from './History';
import Payment from './Payment';
import Checkout from './Checkout.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import UsersforAdmin from './UserForAdmin';

const Header = () => {
  const { currentUser, signOut } = useAuth();
  // Adjusted logic for showing Admin Panel and Add Car based on user roles
  const showAdminPanel =
    currentUser?.is_superuser ||
    localStorage.getItem('email') === 'CSR@email.com' ||
    localStorage.getItem('email') === 'SYSM@email.com';
  const showAddCar =
    currentUser?.is_superuser || localStorage.getItem('email') === 'SYSM@email.com';

  return (
    <header className="header">
      <a href="/" target="_self">
        <img src={Logo} alt="Logo" className="logo" />
      </a>
      <span className="company-name">Cookie Cruisers</span>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
          <li><Link to="/Car_Listing">Cars</Link></li>
          {currentUser && <li><Link to="/History">History</Link></li>}
          {currentUser && <li><Link to="/Reservation">Reservation</Link></li>}
          {showAdminPanel && <li><a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer">Admin Panel</a></li>}
          {showAdminPanel && <li><a href="/Cars_Admin" target="_blank" rel="noopener noreferrer">Car Admin</a></li>}
          {showAdminPanel && <li><a href="/Users_admin" target="_blank" rel="noopener noreferrer">User Admin</a></li>}
          {showAddCar && <li><Link to="/Add_Car">Add Car</Link></li>}
          
        </ul>
      </nav>
      
      <div>
        {currentUser ? (
          <div>
            <p>Points: {currentUser.points}</p> 
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
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Car_Listing" element={<CarListingPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Reservation/:carModel" element={<ReservationPage />} />
          <Route path="/Reservation" element={<ReservationPage />} />
          <Route path="/Add_Car" element={<CarForm />} /> {/* Route for adding car */}
          <Route path="/History" element={<History />} />
          <Route path="/Cars_Admin" element={<CarsforAdmin />} />
          <Route path="/Users_admin" element={<UsersforAdmin />} />
          <Route path="/checkout/:reservationId" element={<Checkout />} />
          <Route path="/payment/:reservationId" element={<Payment />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
