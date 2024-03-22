import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:8000/reservations/reserve');
                setReservations(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div>
            <h2>All Reservations</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            <p>Reservation ID: {reservation.id}</p>
                            <p>Car Model: {reservation.carModel}</p>
                            <p>Pickup Date: {reservation.pickupDate}</p>
                            <p>Return Date: {reservation.returnDate}</p>
                            {/* Add more details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReservationList;
