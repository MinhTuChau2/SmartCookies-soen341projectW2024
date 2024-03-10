import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ReservationPage.css';
import axios from 'axios';

const ReservationPage = () => {
  const { id, carType } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    carType: '',
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

  /*
  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(formData).toString();
    // Navigate to the reservation URL
    window.location.href = `/reserve/${id}?${queryParams}`;
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8000/reservations/reserve/', {
            car_id: id,
            carType: carType,
            ...formData
        });
        console.log(response.data); // Handle success
    } catch (error) {
        console.error(error); // Handle error
    }
};


  return (
    <div>
      <h2>Reservation Page</h2>
      <h3>Reservation Form</h3>
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
          <label htmlFor="carType">Car Type:</label>
          <input type="text" id="carType" name="carType" value={carType} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="carID">Car ID:</label>
          <input type="text" id="carID" name="carID" value={id} readOnly />
        </div>
        <button type="submit">Reserve Car</button>
      </form>
    </div>
  );
};

export default ReservationPage;
