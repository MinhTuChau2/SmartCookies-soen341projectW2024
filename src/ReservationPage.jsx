import React, { useState, useEffect} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ReservationPage.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from './AuthContext';

const ReservationPage = () => {
  const { carModel } = useParams(); // Get carModel from URL parameter
  const location = useLocation();
  const [carPrice, setCarPrice] = useState(location.state ? location.state.carPrice : 0);

  const { currentUser,usePoints } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.username : '', 
    email: currentUser ? currentUser.email : '',
    carModel: carModel, // Set carModel from URL parameter
    pickupDate: '',
    returnDate: '',
    carSeat: 0,
    pointsUsed: 0,
  });

  const [isAvailable, setIsAvailable] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState('');
  const navigateTo = useNavigate();
  const [reservedDates, setReservedDates] = useState([]);
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [insurance, setInsurance] = useState(false);
  const [gps, setGPS] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(false); // Step 1: State variable for discount
  //const [carSeat, setCarSeat] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);
  

  

  //price of additional features
  const insurancePrice = 30;
  const gpsPrice = 15;
  const carSeatPrice = 10;

  const calculateTotalPrice = () => {
    // Calculate number of reservation days
    const startDate = new Date(formData.pickupDate);
    const endDate = new Date(formData.returnDate);
    const numberOfDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
    // Calculate total price based on number of days and selected services
    let totalPrice = numberOfDays * carPrice;
    if (insurance) {
      totalPrice += insurancePrice;
    }
    if (gps) {
      totalPrice += gpsPrice;
    }
  
    totalPrice += formData.carSeat * carSeatPrice;
  
    if (formData.pointsUsed > 0) {
      const discountFactor = Math.floor(formData.pointsUsed / 50) * 0.1; // 10% for every 50 points
      const discountAmount = totalPrice * Math.min(discountFactor, 0.5); // Maximum 50% discount
      totalPrice -= discountAmount;
    }
  
    return totalPrice;
  };
  const calculateDiscountAmount = () => {
    const numberOfDays = Math.round((new Date(formData.returnDate) - new Date(formData.pickupDate)) / (1000 * 60 * 60 * 24)) + 1;
    let basePrice = numberOfDays * carPrice;

    if (insurance) {
        basePrice += insurancePrice * numberOfDays;
    }
    if (gps) {
        basePrice += gpsPrice * numberOfDays;
    }
    basePrice += formData.carSeat * carSeatPrice * numberOfDays;

    const discountFactor = Math.floor(formData.pointsUsed / 50) * 0.1; // 10% for every 50 points
    return basePrice * Math.min(discountFactor, 0.5); // Maximum 50% discount
};

 
  
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

    // Set carPrice from the passed state if available
    if (location.state && location.state.carPrice) {
      setCarPrice(location.state.carPrice);
    }
  }, [carModel, location.state]);

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
  
    if (formData.pointsUsed > currentUser.points) {
      setError('You cannot use more points than you have.');
      return;
    }
    if (formData.pointsUsed % 50 !== 0) {
      setError('Points can only be used in increments of 50.');
      return;
    }
    const totalPriceCalculated = calculateTotalPrice();
    const discountAmount = calculateDiscountAmount();

    const pointsUsed = formData.pointsUsed; 

    if (!formData.name || !formData.email || !formData.pickupDate || !formData.returnDate) {
      setError('Please complete all fields.');
      return;
    }
  
    if (!isAvailable) {
      setError('Selected dates are not available for this car model.');
      return;
    }
  
    const dataToSend = {
      ...formData,
      insurance, // Assuming this is a boolean
      gps, // Assuming this is a boolean
      carSeat: formData.carSeat, // Assuming this is an integer
      totalPrice: totalPriceCalculated,
      discountAmount,
<<<<<<< HEAD
      pointsUsed,
=======
>>>>>>> 36b4099d8a9b2279a0c383421324ca285da56f8b
    };
  
   

    try {
      const response = await axios.post('http://localhost:8000/reservations/reserve/', dataToSend, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      usePoints(formData.pointsUsed);
      setConfirmationMessage('Reservation successfully made.');
      setShowConfirmationModal(true);
      setError('');
      console.log(response.data); // Handle success
    } catch (error) {
      console.log(error);
      console.log(error.response);
      let errorMessage = 'Failed to make reservation.';
      if (error.response && error.response.status === 400 && error.response.data) {
        errorMessage = 'The selected dates are already taken. Please choose different dates.';
        setShowConfirmationModal(true);
        setConfirmationMessage('Failed to make reservation.');
        setError('');
      }
      setError(errorMessage);
    }
  };

  function showForm() {
    setShowSecondForm(true);
  }

  // Step 3: Toggle discount
  const handleDiscountToggle = () => {
    setApplyDiscount(!applyDiscount);
  };



  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div className={showConfirmationModal ? "page-blur" : ""}>
          <h2>Reservation Page</h2>
          <form className="horizontal-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="pickupDate">Pickup Date:</label>
              <DatePicker
                selected={formData.pickupDate ? new Date(formData.pickupDate) : null}
                onChange={date => setFormData({ ...formData, pickupDate: date.toISOString().split('T')[0] })}
                excludeDates={reservedDates}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
              />
            </div>
            <div className="form-group">
              <label htmlFor="returnDate">Return Date:</label>
              <DatePicker
                selected={formData.returnDate ? new Date(formData.returnDate) : null}
                onChange={date => setFormData({ ...formData, returnDate: date.toISOString().split('T')[0] })}
                excludeDates={reservedDates}
                dateFormat="yyyy-MM-dd"
                minDate={formData.pickupDate || new Date()}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} autoComplete={formData.name} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete={formData.email} required />
            </div>
            <div className="form-group">
              <label htmlFor="carModel">Car Model:</label>
              <input type="text" id="carModel" name="carModel" value={formData.carModel} onChange={handleChange} required />
            </div>
            {!showSecondForm && <button type="button" disabled={!isAvailable} onClick={showForm}>Next</button>}
            {showSecondForm && (
              <div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={insurance}
                      onChange={(e) => setInsurance(e.target.checked)}
                    />
                    Insurance (+${insurancePrice})
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={gps}
                      onChange={(e) => setGPS(e.target.checked)}
                    />
                    GPS (+${gpsPrice})
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="carSeat">Number of Car Seats (+$10/each)</label>
                  <input
                    type="number"
                    id="carSeat"
                    name="carSeat"
                    value={formData.carSeat}
                    onChange={e => setFormData({ ...formData, carSeat: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pointsUsed">Use Points (50 per block, up to your maximum):</label>
                  <input
                    type="number"
                    id="pointsUsed"
                    name="pointsUsed"
                    value={formData.pointsUsed}
                    onChange={handleChange}
                    step="50"
                    min="0"
                    max={Math.floor(currentUser.points / 50) * 50} // Ensures they can only select up to their maximum in increments of 50
                  />
                </div>

                <div className="total-price-section">
                  <h3>Reservation Summary</h3>
                  <p>Car Model: {formData.carModel}</p>
                  {insurance && <p>Insurance: ${insurancePrice}</p>}
                  {gps && <p>GPS: ${gpsPrice}</p>}
                  {(formData.carSeat > 0) && <p>Car Seats: ${(formData.carSeat * carSeatPrice)}</p>}
                  {applyDiscount && (
                  <p>Discount</p>
                                    )}
                  <hr />
                  <p><strong>Total Price: ${calculateTotalPrice()}</strong></p>
                  <button id='reservecarbutton' type="submit" disabled={!isAvailable} onClick={handleSubmit}>Reserve Car</button>
                </div>
              </div>
            )}
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