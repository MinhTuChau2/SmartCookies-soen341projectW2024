// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext.jsx';
// import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
// import Checkout from './Checkout.jsx';

// const ReservationList = () => {
//     const [reservations, setReservations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { currentUser } = useAuth();
//     const [editingId, setEditingId] = useState(null);
//     const [editFormData, setEditFormData] = useState({
//         carModel: '',
//         pickupDate: '',
//         returnDate: '',
//     });
//     const navigate = useNavigate(); // Initialize useNavigate hook for navigation
//     const [interval, setInterval] = useState(null);

//     const ifToday = (returnDate) => {
//         const currentDate = new Date();
//         currentDate.setDate(currentDate.getDate()-1);
//         const returnDateObj = new Date(returnDate);
//         currentDate.setHours(0, 0, 0, 0);
//         returnDateObj.setHours(0, 0, 0, 0);
//         return (
//             returnDateObj.getFullYear() === currentDate.getFullYear() &&
//             returnDateObj.getMonth() === currentDate.getMonth() &&
//             returnDateObj.getDate() === currentDate.getDate()
//         );
//     };

//     const handleCheckoutButton = () => {
//         navigate('/Checkout');
//     };

//     const updateReservationStatus = async (reservationId) => {
//         try {
//             // Make API call to update reservation status to 'under_review'
//             await axios.put(`http://localhost:8000/reservations/update-status/${reservationId}/`, {
//                 status: 'under_review',
//             });

//             // Poll backend to check reservation status
//             const interval = setInterval(async () => {
//                 try {
//                     const response = await axios.get(`http://localhost:8000/reservations/reservation/${reservationId}/`);
//                     const { status } = response.data;

//                     if (status === 'accepted') {
//                         clearInterval(interval);
//                         // Update reservation status in the reservations list
//                         setReservations(prevReservations => prevReservations.map(reservation => {
//                             if (reservation.id === reservationId) {
//                                 return { ...reservation, status: 'accepted' };
//                             }
//                             return reservation;
//                         }));
//                     }
//                 } catch (error) {
//                     console.error('Error checking reservation status:', error);
//                 }
//             }, 5000); // Poll every 5 seconds
//         } catch (error) {
//             console.error('Error updating reservation status:', error);
//         }
//     };



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
//                         Authorization: `Token ${localStorage.getItem('token')}`, // Use the correct token retrieval method
//                     },
//                 });
//                 setReservations(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching reservations:', error);
//                 setLoading(false);
//             }
//         };
//         fetchReservations();
//         return () => clearInterval(interval);
//     }, [currentUser, interval]);

//     //     const updateReservationStatus = async (reservationId) => {
//     //         try {
//     //             // Make API call to update reservation status to 'under_review'
//     //             await axios.put(`http://localhost:8000/reservations/update-status/${reservationId}/`, {
//     //                 status: 'under_review',
//     //             });
    
//     //             // Poll backend to check reservation status
//     //             const interval = setInterval(async () => {
//     //                 try {
//     //                     const response = await axios.get(`http://localhost:8000/reservations/reservation/${reservationId}/`);
//     //                     const { status } = response.data;
    
//     //                     if (status === 'accepted') {
//     //                         clearInterval(interval);
//     //                         // Update reservation status in the reservations list
//     //                         setReservations(prevReservations => prevReservations.map(reservation => {
//     //                             if (reservation.id === reservationId) {
//     //                                 return { ...reservation, status: 'accepted' };
//     //                             }
//     //                             return reservation;
//     //                         }));
//     //                     }
//     //                 } catch (error) {
//     //                     console.error('Error checking reservation status:', error);
//     //                 }
//     //             }, 5000); // Poll every 5 seconds
//     //         } catch (error) {
//     //             console.error('Error updating reservation status:', error);
//     //         }
//     //     };
    

//     //     fetchReservations();
//     //     return () => clearInterval(interval);
//     // }, [currentUser]);



//     const startEditing = (reservation) => {
//         setEditingId(reservation.id);
//         setEditFormData({
//             carModel: reservation.carModel,
//             pickupDate: reservation.pickupDate,
//             returnDate: reservation.returnDate,
//         });
//     };

//     const handleEditFormChange = (event) => {
//         const { name, value } = event.target;
//         setEditFormData({ ...editFormData, [name]: value });
//     };

//     const submitUpdate = async (reservationId) => {
//         const formattedData = {
//             car_model: editFormData.carModel,
//             pickup_date: editFormData.pickupDate,
//             return_date: editFormData.returnDate,
//         };

        
//         try {
//             await axios.put(
//                 `http://localhost:8000/reservations/reservations/reservation/${reservationId}/`,
//                 formattedData,
//                 {
//                     headers: {
//                         Authorization: `Token ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );

//             const updatedReservations = reservations.map((reservation) => {
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
//             await axios.delete(
//                 `http://localhost:8000/reservations/reservations/reservation/${reservationId}/`,
//                 {
//                     headers: {
//                         Authorization: `Token ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );

//             setReservations(
//                 reservations.filter((reservation) => reservation.id !== reservationId)
//             );
//         } catch (error) {
//             console.error('Error deleting reservation:', error);
//         }
//     };

//     const canEditOrDelete = (reservation) => {
//         if (!currentUser) {
//             return false;
//         }

//         return (
//             currentUser.is_superuser ||
//             ['SYSM@email.com', 'CSR@email.com'].includes(currentUser.email) ||
//             reservation.email === currentUser.email
//         );
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
//                                 <div>
//                                     <input
//                                         type="text"
//                                         name="carModel"
//                                         value={editFormData.carModel}
//                                         onChange={handleEditFormChange}
//                                     />
//                                     <input
//                                         type="date"
//                                         name="pickupDate"
//                                         value={editFormData.pickupDate}
//                                         onChange={handleEditFormChange}
//                                     />
//                                     <input
//                                         type="date"
//                                         name="returnDate"
//                                         value={editFormData.returnDate}
//                                         onChange={handleEditFormChange}
//                                     />
//                                     <button onClick={() => submitUpdate(reservation.id)}>Save</button>
//                                     <button onClick={() => setEditingId(null)}>Cancel</button>
                                    
//                                 </div>
//                             ) : (
//                                 <div>
//                                     <p>Car Model: {reservation.carModel}</p>
//                                     <p>Pickup Date: {reservation.pickupDate}</p>
//                                     <p>Return Date: {reservation.returnDate}</p>
//                                     <p>Status: {reservation.status}</p>
//                                     {ifToday(reservation.returnDate) && (
//                                         <button onClick={()=>{handleCheckoutButton(); updateReservationStatus(reservation.id);}}>Go to Checkout</button>
//                                     )}
//                                     {canEditOrDelete(reservation) && (
//                                         <>
//                                             <button onClick={() => startEditing(reservation)}>Edit</button>
//                                             <button onClick={() => deleteReservation(reservation.id)}>Delete</button>
//                                         </>
//                                     )}
//                                     {reservation.status === 'accepted' && (
//                                        <button onClick={() => navigate(`/payment/${reservation.id}`)}>Proceed with Payment</button>

//                                     )}
//                                     {reservation.status === 'returned' && (
//                                    <div>
//                                        <p>Processing your return (status under review)</p>
//                                    </div>
//                                 )}
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
                                    {canEditOrDelete(reservation) && (
                                        <>
                                            <button onClick={() => startEditing(reservation)}>Edit</button>
                                            <button onClick={() => deleteReservation(reservation.id)}>Delete</button>
                                        </>
                                    )}
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