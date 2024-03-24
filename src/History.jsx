import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx'; // Import useAuth

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth(); // Use the current user from AuthContext
    const [editingId, setEditingId] = useState(null); // ID of the reservation being edited
    const [editFormData, setEditFormData] = useState({ carModel: '', pickupDate: '', returnDate: '' });

    useEffect(() => {
        const fetchReservations = async () => {
            if (!currentUser) {
                setReservations([]);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/reservations/reserve/', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}` // Use the token for authorization
                    }
                });
                setReservations(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setLoading(false);
            }
        };

        fetchReservations();
    }, [currentUser]);

    const startEditing = (reservation) => {
        setEditingId(reservation.id);
        setEditFormData({ carModel: reservation.carModel, pickupDate: reservation.pickupDate, returnDate: reservation.returnDate });
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const submitUpdate = async (reservationId) => {
        const formattedData = {
            car_model: editFormData.carModel, // Adjusted to match backend expectations
            pickup_date: editFormData.pickupDate,
            return_date: editFormData.returnDate
        };
        
        try {
            await axios.put(`http://localhost:8000/reservations/reservations/reservation/${reservationId}/`, formattedData, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });

            const updatedReservations = reservations.map(reservation => {
                if (reservation.id === reservationId) {
                    return { ...reservation, ...editFormData };
                }
                return reservation;
            });
            setReservations(updatedReservations);
            setEditingId(null); // Stop editing
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };

    const deleteReservation = async (reservationId) => {
        try {
            await axios.delete(`http://localhost:8000/reservations/reservations/reservation/${reservationId}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });

            setReservations(reservations.filter(reservation => reservation.id !== reservationId));
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };

    return (
        <div>
            <h2>All Reservations</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            {editingId === reservation.id ? (
                                <div>
                                    <input type="text" name="carModel" value={editFormData.carModel} onChange={handleEditFormChange} />
                                    <input type="date" name="pickupDate" value={editFormData.pickupDate} onChange={handleEditFormChange} />
                                    <input type="date" name="returnDate" value={editFormData.returnDate} onChange={handleEditFormChange} />
                                    <button onClick={() => submitUpdate(reservation.id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <p>Car Model: {reservation.carModel}</p>
                                    <p>Pickup Date: {reservation.pickupDate}</p>
                                    <p>Return Date: {reservation.returnDate}</p>
                                    <button onClick={() => startEditing(reservation)}>Edit</button>
                                    <button onClick={() => deleteReservation(reservation.id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReservationList;
