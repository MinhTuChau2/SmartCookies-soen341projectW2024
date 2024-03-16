import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ReservationPage.css';
import axios from 'axios';

const ReservationPage = () => {
  const { carModel } = useParams(); // Get carModel from URL parameter
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    carModel: carModel, // Set carModel from URL parameter
    pickupDate: '',
    returnDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/reservations/reserve/', formData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error(error); // Handle error
    }
  };

  return (
    <div>
      <h2>Reservation Page</h2>

      <form className="horizontal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pickupDate">Pickup Date:</label>
          <input type="date" id="pickupDate" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="returnDate">Return Date:</label>
          <input type="date" id="returnDate" name="returnDate" value={formData.returnDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="carModel">Car Model:</label>
          <input type="text" id="carModel" name="carModel" value={formData.carModel} onChange={handleChange} required />
        </div>
        <button type="submit">Reserve Car</button>
      </form>
    </div>
  );
};

export default ReservationPage;
