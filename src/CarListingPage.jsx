import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReservationPage from './ReservationPage';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import corollaImage from './5.png';
import civicImage from './51652_st0640_116.png';
import priusImage from './089.jpg';
import './CarListingCss.css';

const CarListingPage = () => {
  const [cars, setCars] = useState([
    { id: 1, maker: 'Toyota', model: 'Corolla', year: 2024, price: 25, available: true, image: corollaImage, position: [40.7128, -74.006] },
    { id: 2, maker: 'Honda', model: 'Civic', year: 2024, price: 35, available: true, image: civicImage, position: [34.0522, -118.2437] },
    { id: 3, maker: 'Toyota', model: 'Prius', year: 2024, price: 160, available: true, image: priusImage, position: [37.7749, -122.4194] },
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
      <div className="container">
      <div className="car-list-container">
        {cars.map(car => (
          <div key={car.id} className="car-container">
            <img src={car.image} alt={`${car.maker} ${car.model}`} className="car-image" />
            <div className="car-details">
              <p>{`${car.maker} ${car.model}`}</p>
              <p>{`Year: ${car.year}`}</p>
              <Link to={`/Reservation/${car.id}`}>
                <button className="reserve-button" onClick={() => reserveCar(car.id)}>Reserve</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="map-container">
        <MapContainer center={[45.5017, -73.5673]} zoom={10} >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {cars.map(car => (
            <Marker key={car.id} position={car.position}>
              <Popup>
                <div>
                  <h3>{`${car.maker} ${car.model}`}</h3>
                  <p>{`Year: ${car.year}, Price: $${car.price}`}</p>
                  <img src={car.image} alt={`${car.maker} ${car.model}`} style={{ width: '100px', height: 'auto' }} />
                  {car.available ? (
                    <Link to={`/Reservation/${car.id}`}>
                      <button onClick={() => reserveCar(car.id)}>Reserve</button>
                    </Link>
                  ) : (
                    <span>Not Available</span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
    </div>
  );
};

export default CarListingPage;
