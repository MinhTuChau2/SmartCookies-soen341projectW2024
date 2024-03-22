import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext for managing user authentication

const ReservationList = () => {
    const { currentUser } = useAuth(); // Assuming useAuth provides the current user information
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchReservations = async () => {
        try {
            if (!currentUser || !currentUser.email) {
                throw new Error('User information missing');
            }

            const response = await axios.get('http://localhost:8000/reservations/');
            const filteredReservations = response.data.filter(reservation => reservation.email === currentUser.email);
            setReservations(filteredReservations);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setLoading(false);
        }
    };

    console.log('currentUser:', currentUser);

    if (currentUser === null) {
        // User information is being fetched
        setLoading(true);
    } else if (currentUser && currentUser.email) {
        // User information is available, fetch reservations
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
