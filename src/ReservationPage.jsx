import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReservationPage.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationPage = () => {
  const { carModel } = useParams(); // Get carModel from URL parameter
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    carModel: carModel, // Set carModel from URL parameter
    pickupDate: '',
    returnDate: ''
  });

  const [isAvailable, setIsAvailable] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState('');
  const navigateTo = useNavigate();
  const [reservedDates, setReservedDates] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'pickupDate' || name === 'returnDate') {
      checkReservationAvailability(name === 'pickupDate' ? value : formData.pickupDate, name === 'returnDate' ? value : formData.returnDate);
    }    

  };

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await axios.get(`/api/reserved-dates/${carModel}`);
        setReservedDates(response.data.map(dateStr => new Date(dateStr)));
      } catch (error) {
        console.error('Error fetching reserved dates:', error);
      }
    };

    fetchReservedDates();
  }, [carModel]);
  

  const checkReservationAvailability = async (pickupDate, returnDate) => {
    if (pickupDate && returnDate) {
      try {
        const response = await axios.get('/check-reservation/', {
          params: {
            start_date: pickupDate,
            end_date: returnDate,
            car_id: carModel,
          }
        });
        setIsAvailable(response.data.is_available);
      } catch (error) {
        console.error('Error checking reservation availability:', error);
      }
    }
  };

  const handleOKClick = () => {
    setShowConfirmationModal(false); // Hide the modal
    if(error){
      navigateTo(window.location.pathname);
    } else {
      navigateTo('/');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable) {
      setError('Selected dates are not available for this car model.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/reservations/reserve/', formData, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}` // Include the token here
        }
      });
      setConfirmationMessage('Reservation successfully made.');
      setShowConfirmationModal(true);
      setError('');
      

      console.log(response.data); // Handle success
      
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : 'Failed to make reservation. Please try again later.';
    setError(errorMessage);
    }
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
      <div className={showConfirmationModal ? "page-blur" : ""}>

      <h2>Reservation Page</h2>
      

      <form className="horizontal-form" onSubmit={handleSubmit}>
        <div className="form-group">
        <label htmlFor="pickupDate">Pickup Date:</label>
        <DatePicker
          selected={formData.pickupDate ? new Date(formData.pickupDate) : null}
          onChange={date => setFormData({ ...formData, pickupDate: date.toISOString().split('T')[0] })}
          excludeDates={reservedDates}
        />
          {/* <label htmlFor="pickupDate">Pickup Date:</label>
          <input type="date" id="pickupDate" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required /> */}
        </div>
        <div className="form-group">
        <label htmlFor="pickupDate">Pickup Date:</label>
        <DatePicker
          selected={formData.returnDate ? new Date(formData.returnDate) : null}
          onChange={date => setFormData({ ...formData, returnDate: date.toISOString().split('T')[0] })}
          excludeDates={reservedDates}
        />
          {/* <label htmlFor="returnDate">Return Date:</label>
          <input type="date" id="returnDate" name="returnDate" value={formData.returnDate} onChange={handleChange} required /> */}
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="carModel">Car Model:</label>
          <input type="text" id="carModel" name="carModel" value={formData.carModel} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={!isAvailable}>Reserve Car</button>
      </form>
    </div>
    </div>

    {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content" >
            <p>{confirmationMessage}</p>
            <button onClick={handleOKClick}> OK </button>
          </div>
        </div>
  )}

    
    </div>
    
    
  );
};

export default ReservationPage;