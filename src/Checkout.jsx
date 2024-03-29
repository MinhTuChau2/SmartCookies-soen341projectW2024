// // // // import React, { useState } from 'react';
// // // // import axios from 'axios';
// // // // import { useParams } from 'react-router-dom';

// // // // const Checkout = () => {
// // // //   const [processingReturn, setProcessingReturn] = useState(false);
// // // //   const [returnMessage, setReturnMessage] = useState('');
// // // //   const { reservationId } = useParams();

// // // //   const handleReturnCar = async () => {
// // // //     setProcessingReturn(true);
// // // //     setReturnMessage('Processing your return (status under review)');
    
// // // //     try {
// // // //       // Make API call to update reservation status
// // // //       await axios.put(`/api/reservations/${reservationId}/return/`, { status: 'under_review' });

// // // //       // Poll backend to check reservation status
// // // //       const interval = setInterval(async () => {
// // // //         const response = await axios.get(`/api/reservations/${reservationId}/`);
// // // //         const { status } = response.data;

// // // //         if (status === 'accepted') {
// // // //           clearInterval(interval);
// // // //           setProcessingReturn(false);
// // // //           setReturnMessage('Successfully checked out');
// // // //         }
// // // //       }, 5000); // Poll every 5 seconds
// // // //     } catch (error) {
// // // //       console.error('Error updating reservation status:', error);
// // // //       setProcessingReturn(false);
// // // //       setReturnMessage('Error processing return');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h1>Checkout</h1>
// // // //       {processingReturn ? (
// // // //         <p>{returnMessage}</p>
// // // //       ) : (
// // // //         <button onClick={handleReturnCar}>Return Car</button>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Checkout;

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { useParams } from 'react-router-dom';

// // // const Checkout = () => {
// // //   const [processingReturn, setProcessingReturn] = useState(false);
// // //   const [returnMessage, setReturnMessage] = useState('');
// // //   const { reservationId } = useParams();

// // //   useEffect(() => {
// // //     const handleReturnCar = async () => {
// // //       setProcessingReturn(true);
// // //       setReturnMessage('Processing your return (status under review)');
      
// // //       try {
// // //         // Make API call to update reservation status
// // //         await axios.put(`/api/reservations/${reservationId}/return/`, { status: 'under_review' });

// // //         // Poll backend to check reservation status
// // //         const interval = setInterval(async () => {
// // //           const response = await axios.get(`/api/reservations/${reservationId}/`);
// // //           const { status } = response.data;

// // //           if (status === 'accepted') {
// // //             clearInterval(interval);
// // //             setProcessingReturn(false);
// // //             setReturnMessage('Successfully checked out');
// // //           }
// // //         }, 5000); // Poll every 5 seconds

// // //         return () => clearInterval(interval); // Cleanup function
// // //       } catch (error) {
// // //         console.error('Error updating reservation status:', error);
// // //         setProcessingReturn(false);
// // //         setReturnMessage('Error processing return');
// // //       }
// // //     };

// // //     handleReturnCar();

// // //   }, [reservationId]);

// // //   return (
// // //     <div>
// // //       <h1>Checkout</h1>
// // //       {processingReturn ? (
// // //         <p>{returnMessage}</p>
// // //       ) : (
// // //         <p>Processing...</p>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Checkout;

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useParams } from 'react-router-dom';

// // const Checkout = () => {
// //   const [processingReturn, setProcessingReturn] = useState(false);
// //   const [returnMessage, setReturnMessage] = useState('');
// //   const { reservationId } = useParams();

// //   useEffect(() => {
// //     const handleReturnCar = async () => {
// //       setProcessingReturn(true);
// //       setReturnMessage('Processing your return (status under review)');
      
// //       try {
// //         // Make API call to update reservation status
// //         await axios.put(`/api/reservations/${reservationId}/return/`, { status: 'under_review' });

// //         // Poll backend to check reservation status
// //         const interval = setInterval(async () => {
// //           const response = await axios.get(`/api/reservations/${reservationId}/`);
// //           const { status } = response.data;

// //           if (status === 'accepted') {
// //             clearInterval(interval);
// //             setProcessingReturn(false);
// //             setReturnMessage('Successfully checked out');
// //           }
// //         }, 5000); // Poll every 5 seconds

// //         return () => clearInterval(interval); // Cleanup function
// //       } catch (error) {
// //         console.error('Error updating reservation status:', error);
// //         setProcessingReturn(false);
// //         setReturnMessage('Error processing return');
// //       }
// //     };

// //     handleReturnCar();

// //   }, [reservationId]);

// //   return (
// //     <div>
// //       <h1>Checkout</h1>
// //       {processingReturn ? (
// //         <p>{returnMessage}</p>
// //       ) : (
// //         <p>Processing...</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default Checkout;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';

// const Checkout = () => {
//   const { reservationId } = useParams(); // Extracting reservation ID from URL parameters
//   const [reservation, setReservation] = useState(null);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchReservationDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/reservations/reservation/${reservationId}/`, {
//           headers: { Authorization: `Token ${localStorage.getItem('token')}` }
//         });
//         setReservation(response.data);
//         calculateTotalPrice(response.data);
//       } catch (error) {
//         console.error('Failed to fetch reservation details:', error);
//       }
//     };

//     fetchReservationDetails();
//   }, [reservationId]);

//   const calculateTotalPrice = (reservationDetails) => {
//     // Assuming you have a way to calculate the base price for the number of days reserved
//     const daysReserved = (new Date(reservationDetails.returnDate) - new Date(reservationDetails.pickupDate)) / (1000 * 60 * 60 * 24);
//     const basePrice = daysReserved * reservationDetails.carPrice; // carPrice needs to be added in your reservation details

//     // Additional costs (Assuming you store whether these services were chosen in your reservation details)
//     const insuranceCost = reservationDetails.insurance ? 30 * daysReserved : 0;
//     const gpsCost = reservationDetails.gps ? 15 * daysReserved : 0;
//     const carSeatCost = reservationDetails.carSeat * 10; // Assuming carSeat holds the number of car seats

//     const totalPrice = basePrice + insuranceCost + gpsCost + carSeatCost;
//     setTotalPrice(totalPrice);
//   };

//   const handleProceedToPayment = () => {
//     // Navigate to the payment page and pass the total price along
//     navigate(`/payment/${reservationId}`, { state: { totalPrice } });
//   };

//   if (!reservation) {
//     return <div>Loading reservation details...</div>;
//   }

//   return (
//     <div>
//       <h2>Checkout</h2>
//       <p><strong>Car Model:</strong> {reservation.carModel}</p>
//       <p><strong>Pickup Date:</strong> {reservation.pickupDate}</p>
//       <p><strong>Return Date:</strong> {reservation.returnDate}</p>
//       <p><strong>Insurance:</strong> {reservation.insurance ? 'Yes' : 'No'}</p>
//       <p><strong>GPS:</strong> {reservation.gps ? 'Yes' : 'No'}</p>
//       <p><strong>Car Seats:</strong> {reservation.carSeat}</p>
//       <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
//       <button onClick={handleProceedToPayment}>Proceed to Payment</button>
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const Checkout = () => {
//   const [processingReturn, setProcessingReturn] = useState(false);
//   const [returnMessage, setReturnMessage] = useState('');
//   const { reservationId } = useParams();

//   useEffect(() => {
//     const handleReturnCar = async () => {
//       setProcessingReturn(true);
//       setReturnMessage('Processing your return (status under review)');
      
//       try {
//         // Make API call to update reservation status
//         await axios.put(`/api/reservations/${reservationId}/return/`, { status: 'under_review' });

//         // Poll backend to check reservation status
//         const interval = setInterval(async () => {
//           const response = await axios.get(`/api/reservations/${reservationId}/`);
//           const { status } = response.data;

//           if (status === 'accepted') {
//             clearInterval(interval);
//             setProcessingReturn(false);
//             setReturnMessage('Successfully checked out');
//           }
//         }, 5000); // Poll every 5 seconds

//         return () => clearInterval(interval); // Cleanup function
//       } catch (error) {
//         console.error('Error updating reservation status:', error);
//         setProcessingReturn(false);
//         setReturnMessage('Error processing return');
//       }
//     };

//     handleReturnCar();

//   }, [reservationId]);

//   return (
//     <div>
//       <h1>Checkout</h1>
//       {processingReturn ? (
//         <p>{returnMessage}</p>
//       ) : (
//         <p>Processing...</p>
//       )}
//     </div>
//   );
// };

// export default Checkout;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Make sure the path is correct

const Checkout = () => {
  const { currentUser } = useAuth();
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const email = currentUser.email; // Get the current user's email from AuthContext
      const bankAccountResponse = await axios.get(`http://localhost:8000/transactions/bank-account/?email=${email}`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });
  
      if (bankAccountResponse.data.creditCardNumber === creditCardNumber) {
        // If the credit card number matches, proceed with reimbursement
        await axios.post(`http://localhost:8000/transactions/reimbursement/${reservationId}/`, {}, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
        alert('Reimbursement successful');
        navigate('/history');
      } else {
        alert('The entered credit card number does not match our records. Please try again.');
      }
    } catch (error) {
      console.error('Error during the checkout process:', error);
      alert('An error occurred during the checkout process. Please try again or contact support.');
    }
  };
  
  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={currentUser.username || ''} readOnly placeholder="Name" required />
        <input type="email" name="email" value={currentUser.email || ''} readOnly placeholder="Email" required />
        <input type="text" name="creditCardNumber" value={creditCardNumber} onChange={(e) => setCreditCardNumber(e.target.value)} placeholder="Credit Card Number" required />
        <button type="submit">Submit for Reimbursement</button>
      </form>
    </div>
  );
};

export default Checkout;
