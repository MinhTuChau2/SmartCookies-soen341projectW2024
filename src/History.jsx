import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx'; // Import useAuth

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth(); // Use the current user from AuthContext

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:8000/reservations/reserve', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
 // Use the token for authorization
                    }
                });
                setReservations(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setLoading(false);
            }
        };

        if (currentUser) { // Fetch reservations only if there's a logged-in user
            fetchReservations();
        }
    }, [currentUser]);

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
