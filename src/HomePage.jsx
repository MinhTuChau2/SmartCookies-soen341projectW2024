import React from 'react';
import './HomePageCSS.css';

const HomePage = () => {
  return (
    <div className="container">
      <header>
        <h1>Explore the Open Road</h1>
        <p>Rent Your Dream Car Today</p>
      </header>
      <section className="main-content">
        <h2>Discover Our Services</h2>
        <div className="features">
          <div className="feature">
            <i className="fas fa-car"></i>
            <h3>Wide Selection</h3>
            <p>Choose from a diverse range of vehicles.</p>
          </div>
          <div className="feature">
            <i className="fas fa-dollar-sign"></i>
            <h3>Affordable Prices</h3>
            <p>Enjoy competitive rates on all rentals.</p>
          </div>
          <div className="feature">
            <i className="fas fa-shield-alt"></i>
            <h3>Reliable Service</h3>
            <p>Trustworthy and efficient customer support.</p>
          </div>
        </div>
      </section>
      <section className="car-listings">
        <h2>Featured Cars</h2>
        {/* Car listings component can be added here */}
      </section>
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        {/* Testimonials component can be added here */}
      </section>
      <section className="contact">
        <h2>Contact Us</h2>
        {/* Contact form component can be added here */}
      </section>
      <footer>
        <p>&copy; 2024 Smart Cookies Car Rental. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
