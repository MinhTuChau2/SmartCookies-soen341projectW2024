import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const Payment = () => {
  const { currentUser } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    email: '',
    creditCardNumber: ''
  });
  const navigate = useNavigate();
  const { reservationId } = useParams();

  useEffect(() => {
    // Autofill the name and email from the currentUser and set it in the paymentInfo state
    if (currentUser) {
      setPaymentInfo(info => ({
        ...info,
        name: currentUser.username || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { creditCardNumber } = paymentInfo;

    try {
      const bankAccountResponse = await axios.get(`http://localhost:8000/transactions/bank-account/?email=${currentUser.email}`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });

      if (bankAccountResponse.data.creditCardNumber === creditCardNumber) {
        // If the credit card number matches, proceed with the payment
        await axios.post(`http://localhost:8000/transactions/payment/${reservationId}/`, paymentInfo, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
        alert('Payment successful');
        navigate('/history');
      } else {
        alert('The entered credit card number does not match our records. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={paymentInfo.name} readOnly placeholder="Name" required />
        <input type="email" name="email" value={paymentInfo.email} readOnly placeholder="Email" required />
        <input type="text" name="creditCardNumber" value={paymentInfo.creditCardNumber} onChange={handleChange} placeholder="Credit Card Number" required />
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default Payment;
