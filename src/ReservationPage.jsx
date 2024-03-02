import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ReservationPage.css';


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

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(formData).toString();
    // Navigate to the reservation URL
    window.location.href = `/reserve/${id}?${queryParams}`;
  };

  // If id is not provided, show the empty form
  if (!id) {
    return (
      <div>
        <h2>Reservation Page</h2>
        <h3>Reservation Form</h3>
        <form onSubmit={handleSubmit}>
         <br />
         <label>
         Pickup Date:
         <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
         </label>
         <br />
         <label>
         Return Date:
         <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} required />
         </label>
         <br />
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Car Type:
            <input type="text" name="carType" value={formData.carType} onChange={handleChange} required />
          </label>
          <button type="submit">Reserve Car</button>
        </form>
      </div>
    );
  }

return (
    <div>
      <h2>Reservation Page</h2>
      <h3>Reservation Form</h3>
      <form onSubmit={handleSubmit}>
       <br />
       <label>
       Pickup Date:
         <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
         </label>
       <br />
         <label>
       Return Date:
         <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} required />
         </label>
       <br />
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
          <label>
          Car Type:
          <input type="text" name="carType" value={carType} readOnly />
          </label>
        <br />
        <br />
          <label>
          Car ID:
          <input type="text" name="carID" value={id} readOnly />
          </label>
        <button type="submit">Reserve Car</button>
      </form>
    </div>
  );
};

export default ReservationPage;
