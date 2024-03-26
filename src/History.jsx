import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

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
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);  // Log the response data to inspect it
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

    const canEditOrDelete = (reservation) => {
        if (!currentUser) {
            return false;
        }

        return (
            currentUser.is_superuser ||
            ['SYSM@email.com', 'CSR@email.com'].includes(currentUser.email) ||
            reservation.email === currentUser.email
        );
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
                                <>
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
                                    <button onClick={() => submitUpdate(reservation.id)}>
                                        Save
                                    </button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                <div>
                                    <p>Car Model: {reservation.carModel}</p>
                                    <p>Pickup Date: {reservation.pickupDate}</p>
                                    <p>Return Date: {reservation.returnDate}</p>
                                    <p>Status: {reservation.status || 'No status'}</p>
                                    {canEditOrDelete(reservation) && (
                                        <>
                                            <button onClick={() => startEditing(reservation)}>
                                                Edit
                                            </button>
                                            <button onClick={() => deleteReservation(reservation.id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
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
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext.jsx';

// const ReservationList = () => {
//     const [reservations, setReservations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { currentUser } = useAuth();
//     const [editingId, setEditingId] = useState(null);
//     const [editFormData, setEditFormData] = useState({ carModel: '', pickupDate: '', returnDate: '' });

//     useEffect(() => {
//         const fetchReservations = async () => {
//             if (!currentUser) {
//                 setReservations([]);
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.get('http://localhost:8000/reservations/reserve/', {
//                     headers: {
//                         Authorization: `Token ${localStorage.getItem('token')}`
//                     }
//                 });
//                 // Consider adding a field in your response that indicates the reservation status (e.g., "Email Sent", "Waiting for Approval")
//                 setReservations(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching reservations:', error);
//                 setLoading(false);
//             }
//         };

//         fetchReservations();
//     }, [currentUser]);

//     const startEditing = (reservation) => {
//         setEditingId(reservation.id);
//         setEditFormData({ carModel: reservation.carModel, pickupDate: reservation.pickupDate, returnDate: reservation.returnDate });
//     };

//     const handleEditFormChange = (event) => {
//         const { name, value } = event.target;
//         setEditFormData({ ...editFormData, [name]: value });
//     };

//     const submitUpdate = async (reservationId) => {
//         const formattedData = {
//             car_model: editFormData.carModel,
//             pickup_date: editFormData.pickupDate,
//             return_date: editFormData.returnDate
//         };

//         try {
//             await axios.put(`http://localhost:8000/reservations/reservations/reservation/${reservationId}/`, formattedData, {
//                 headers: {
//                     Authorization: `Token ${localStorage.getItem('token')}`
//                 }
//             });

//             const updatedReservations = reservations.map(reservation => {
//                 if (reservation.id === reservationId) {
//                     return { ...reservation, ...editFormData };
//                 }
//                 return reservation;
//             });
//             setReservations(updatedReservations);
//             setEditingId(null);
//         } catch (error) {
//             console.error('Error updating reservation:', error);
//         }
//     };

//     const deleteReservation = async (reservationId) => {
//         try {
//             await axios.delete(`http://localhost:8000/reservations/reservations/reservation/${reservationId}/`, {
//                 headers: {
//                     Authorization: `Token ${localStorage.getItem('token')}`
//                 }
//             });

//             setReservations(reservations.filter(reservation => reservation.id !== reservationId));
//         } catch (error) {
//             console.error('Error deleting reservation:', error);
//         }
//     };

//     const canEditOrDelete = (reservation) => {
//         if (!currentUser) {
//             return false;
//         }
    
//         return currentUser.is_superuser || 
//                ['SYSM@email.com', 'CSR@email.com'].includes(currentUser.email) || 
//                reservation.email === currentUser.email;
//     };

//     return (
//         <div>
//             <h2>All Reservations</h2>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <ul>
//                     {reservations.map((reservation) => (
//                         <li key={reservation.id}>
//                             {editingId === reservation.id ? (
//                                 // Editing form
//                                 <>
//                                     <input type="text" name="carModel" value={editFormData.carModel} onChange={handleEditFormChange} />
//                                     <input type="date" name="pickupDate" value={editFormData.pickupDate} onChange={handleEditFormChange} />
//                                     <input type="date" name="returnDate" value={editFormData.returnDate} onChange={handleEditFormChange} />
//                                     <button onClick={() => submitUpdate(reservation.id)}>Save</button>
//                                     <button onClick={() => setEditingId(null)}>Cancel</button>
//                                 </>
//                             ) : (
//                                 // Display reservation with status and potential actions
//                                 <div>
//                                     <p>Car Model: {reservation.carModel}</p>
//                                     <p>Pickup Date: {reservation.pickupDate}</p>
//                                     <p>Return Date: {reservation.returnDate}</p>
//                                     <p>Status: {reservation.status} {/* Display the reservation status */}</p>
//                                     {canEditOrDelete(reservation) && (
//                                         <>
//                                             <button onClick={() => startEditing(reservation)}>Edit</button>
//                                             <button onClick={() => deleteReservation(reservation.id)}>Delete</button>
//                                         </>
//                                     )}
//                                     {/* Consider adding conditional rendering for additional actions based on reservation status */}
//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default ReservationList;