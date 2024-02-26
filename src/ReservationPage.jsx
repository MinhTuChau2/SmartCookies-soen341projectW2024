import React from 'react';
import { useParams } from 'react-router-dom';

const ReservationPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Reservation Page</h2>
      <p>You are reserving car with ID: {id}</p>
    </div>
  );
};

export default ReservationPage;
