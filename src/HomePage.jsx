
import React from 'react';
import './HomePageCSS.css';

const HomePage = () => {
  return (
    <div className="container">
      <header>
        <h1>Welcome to Smart Cookies</h1>
        <p>Explore and Enjoy</p>
      </header>
      <section className="main-content">
        <h2>Discover Something New</h2>
        <p>Find exciting content tailored just for you.</p>
      </section>
      <footer>
        <p>&copy; 2024 Our Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
