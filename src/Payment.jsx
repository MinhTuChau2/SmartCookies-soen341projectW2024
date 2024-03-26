
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    email: '',
    creditCardNumber: ''
  });
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/transactions/payment/${reservationId}/`, paymentInfo, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });
      alert('Payment successful');
      navigate('/history');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={paymentInfo.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={paymentInfo.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="creditCardNumber" value={paymentInfo.creditCardNumber} onChange={handleChange} placeholder="Credit Card Number" required />
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default Payment;
