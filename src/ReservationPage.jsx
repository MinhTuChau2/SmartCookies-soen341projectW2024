import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState('');
  const navigateTo = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOKClick = () => {
    setShowConfirmationModal(false); // Hide the modal
    navigateTo('/'); // Navigate to car listing page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/reservations/reserve/', formData);
      setConfirmationMessage('Reservation successfully made.');
      setShowConfirmationModal(true);
      setError('');
      

      console.log(response.data); // Handle success
      
    } catch (error) {
      setError('Failed to make reservation.');
      setConfirmationMessage(''); 
      console.error(error); // Handle error
    }
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
      <div className={showConfirmationModal ? "page-blur" : ""}>

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
    </div>
    {showConfirmationModal && (

<div className="modal" style={{ 
  position: 'fixed', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  backgroundColor: 'transparent', 
  padding: '20px', 
  zIndex: 1000 
}}>
  <div className="modal-content" style = {{
     backgroundColor: 'white', 
     padding: '20px',
     borderRadius: '8px',
     boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' 
  }}>
    <p>{confirmationMessage}</p>
    <button onClick={handleOKClick}>OK</button> {/* OK button to close modal and navigate */}
  </div>
</div>
  )}
    </div>

    
  );
};

export default ReservationPage;
