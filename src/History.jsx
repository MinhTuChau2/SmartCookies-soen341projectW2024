


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './History.css';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        carModel: '',
        pickupDate: '',
        returnDate: '',
    });
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation

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
                        Authorization: `Token ${localStorage.getItem('token')}`, // Use the correct token retrieval method
                    },
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
        setEditFormData({
            carModel: reservation.carModel,
            pickupDate: reservation.pickupDate,
            returnDate: reservation.returnDate,
        });
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const submitUpdate = async (reservationId) => {
        const formattedData = {
            car_model: editFormData.carModel,
            pickup_date: editFormData.pickupDate,
            return_date: editFormData.returnDate,
        };

        try {
            await axios.put(
                `http://localhost:8000/reservations/reservations/reservation/${reservationId}/`,
                formattedData,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                }
            );

            const updatedReservations = reservations.map((reservation) => {
                if (reservation.id === reservationId) {
                    return { ...reservation, ...editFormData };
                }
                return reservation;
            });
            setReservations(updatedReservations);
            setEditingId(null);
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };

    const deleteReservation = async (reservationId) => {
        try {
            await axios.delete(
                `http://localhost:8000/reservations/reservations/reservation/${reservationId}/`,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                }
            );

            setReservations(
                reservations.filter((reservation) => reservation.id !== reservationId)
            );
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };

    const isReturnDateOrPast = (returnDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Normalize today's date to midnight for accurate comparison
        const rDate = new Date(returnDate);
        rDate.setHours(0, 0, 0, 0);  // Ensure comparison is date-only, without time
        return rDate <= today;
    };
    
    const handleCheckout = (reservation) => {
        if (reservation.status === 'completed') {
            alert('The car is currently being checked. Please wait.');
        } else if (reservation.status === 'car_received') {
            navigate(`/checkout/${reservation.id}`);

        }
    };
    
    const canEditOrDelete = (reservation) => {
        if (!currentUser || ['completed', 'accepted', 'car_received', 'Finished'].includes(reservation.status)) {
            return false;
        }
    
        return (
            currentUser.is_superuser ||
            ['SYSM@email.com', 'CSR@email.com'].includes(currentUser.email) ||
            reservation.email === currentUser.email
        );
    };
    const updateReservationStatus = async (reservationId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/reservations/reservations/${reservationId}/admin_update_status/`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                }
            );
            const updatedReservations = reservations.map((reservation) => {
                if (reservation.id === reservationId) {
                    return { ...reservation, status: newStatus };
                }
                return reservation;
            });
            setReservations(updatedReservations);
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };
    
    
    return (
        <div className="reservation-container">
         <h2 className="reservation-heading">All Reservations</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id} className="reservation-box">
                            {editingId === reservation.id ? (
                                <div>
                                    <input
                                        type="text"
                                        name="carModel"
                                        value={editFormData.carModel}
                                        onChange={handleEditFormChange}
                                    />
                                    <input
                                        type="date"
                                        name="pickupDate"
                                        value={editFormData.pickupDate}
                                        onChange={handleEditFormChange}
                                    />
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={editFormData.returnDate}
                                        onChange={handleEditFormChange}
                                    />
                                    <button onClick={() => submitUpdate(reservation.id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <p>Car Model: {reservation.carModel}</p>
                                    <p>Pickup Date: {reservation.pickupDate}</p>
                                    <p>Return Date: {reservation.returnDate}</p>
                                    <p>Status: {reservation.status}</p>
                                    {
                                        canEditOrDelete(reservation) && (
                                            <>
                                                <button onClick={() => startEditing(reservation)}>Edit</button>
                                                <button onClick={() => deleteReservation(reservation.id)}>Delete</button>
                                                {
                                                    (currentUser.is_superuser || currentUser.email === 'SYSM@email.com') && (
                                                        <select
                                                            value={reservation.status}
                                                            onChange={(event) => updateReservationStatus(reservation.id, event.target.value)}
                                                         >
                                                            <option value="pending">Pending</option>
                                                            <option value="agreement_sent">Agreement Sent</option>
                                                            <option value="agreement_signed">Agreement Signed</option>
                                                            <option value="under_review">Under Review</option>
                                                            <option value="accepted">Accepted</option>
                                                            <option value="payment_pending">Payment Pending</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                            <option value="car_received">Car Received</option>
                                                            <option value="Finish">Finish</option>
                                                        </select>
                                                    )
                                                }
                                            </>
                                        )
                                    }

                                    {reservation.status === 'accepted' && (
                                        <button onClick={() => navigate(`/payment/${reservation.id}`)}>Proceed with Payment</button>
                                    )}
                                    {(reservation.status === 'completed' && isReturnDateOrPast(reservation.returnDate)) || reservation.status === 'car_received' ? (
                                        <button onClick={() => handleCheckout(reservation)}>Go to Checkout</button>
                                    ) : null}
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

