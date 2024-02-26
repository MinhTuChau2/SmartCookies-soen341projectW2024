import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReservationPage from './ReservationPage';
import corollaImage from './5.png';
import civicImage from './51652_st0640_116.png';
import priusImage from './089.jpg';

const CarListingPage = () => {
  const [cars, setCars] = useState([
    { id: 1, maker: 'Toyota', model: 'Corolla', year: 2024, price: 25, available: true, image: corollaImage },
    { id: 2, maker: 'Honda', model: 'Civic', year: 2024, price: 35, available: true, image: civicImage },
    { id: 3, maker: 'Toyota', model: 'Prius', year: 2024, price: 160, available: true, image: priusImage },
  ]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableCars, setAvailableCars] = useState([]);

  const checkAvailability = () => {
    const available = cars.filter(car => car.available);
    const unavailable = cars.filter(car => !car.available);
    setAvailableCars({ available, unavailable });
  };

  const reserveCar = (carId) => {
    setCars(prevCars => {
      return prevCars.map(car => {
        if (car.id === carId) {
          return { ...car, available: false };
        }
        return car;
      });
    });
  };

  return (
    <div>
      <h2>Check Car Availability</h2>
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <button onClick={checkAvailability}>Check Availability</button>

      {availableCars.available && (
        <div>
          <h3>Available Cars for the selected date range:</h3>
          <ul>
            {availableCars.available.map(car => (
              <li key={car.id}>{car.maker} {car.model}</li>
            ))}
          </ul>
        </div>
      )}

      {availableCars.unavailable && (
        <div>
          <h3>Unavailable Cars for the selected date range:</h3>
          <ul>
            {availableCars.unavailable.map(car => (
              <li key={car.id}>{car.maker} {car.model}</li>
            ))}
          </ul>
        </div>
      )}

      <h1>Available Cars for Rent</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Maker</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price per Day ($)</th>
            <th>Available</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car.id}>
              <td>{car.id}</td>
              <td>{car.maker}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{car.price}</td>
              <td>{car.available ? 'Yes' : 'No'}</td>
              <td><img src={car.image} alt={`${car.maker} ${car.model}`} style={{ width: '100px', height: 'auto' }} /></td>
              <td>
                {car.available ? (
                  <Link to={`/Reservation/${car.id}`}>
                    <button onClick={() => reserveCar(car.id)}>Reserve</button>
                  </Link>
                ) : (
                  <span>Not Available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarListingPage;
