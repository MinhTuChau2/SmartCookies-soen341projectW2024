import React from 'react';
import './HomePageCSS.css';
import { Link } from 'react-router-dom';
import Logo from './Logo.jpeg'; 

const HomePage = () => {
  return (
    <div className="home-page">
      <main>
        <section className="intro-section">
          <h1 className="slogan">Embark on a Sweet Journey with Cookie Cruisers-Your Smart Pick for the Perfect Ride!</h1>
        </section>
        <section className="benefits-section">
          <div className="benefit-item">
            <h3>Quality</h3>
            <p>Only the best vehicles for your needs.</p>
          </div>
          <div className="benefit-item">
            <h3>Convenience</h3>
            <p>Easy booking and fast pick-up process.</p>
          </div>
          <div className="benefit-item">
            <h3>Price</h3>
            <p>Competitive rates and clear terms.</p>
          </div>
          
        </section>
        <section className="explore-section">
          <h2>Explore Our Vehicles</h2>
          <Link to="/Car_Listing" className="explore-btn">Browse Cars</Link>
        </section>
        <section className="faq-section">
          <div className="faq-content">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item">
              <h3>How do I reserve a car?</h3>
              <p>You can reserve a car by visiting our Car Listing page, selecting the vehicle of your choice, and clicking on the Reserve button.</p>
            </div>
            <div className="faq-item">
              <h3>What is the cancellation policy?</h3>
              <p>You can cancel your reservation up to 24 hours before your rental period begins for a full refund.</p>
            </div>
            <div className="faq-item">
              <h3>Are there any additional fees?</h3>
              <p>We do not charge additional fees for reservations made on our website. The price you see is the price you pay.</p>
            </div>
            {/* Add more FAQ items as needed */}
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Cookie Cruisers. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

