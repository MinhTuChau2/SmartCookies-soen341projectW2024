import React from 'react';
import { useParams } from 'react-router-dom';
import CarListingPage from './CarListingPage';

const ReservationPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Reservation Page</h2>
      <p>You are reserving car with ID: {id}</p>
      {/* You can add reservation form and logic here */}
    </div>
  );
};

export default ReservationPage;
