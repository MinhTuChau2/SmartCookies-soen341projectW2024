import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReservationPage from './ReservationPage';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CarListingCss.css';

/*Car Images*/
import corollaImage from './5.png';
import civicImage from './51652_st0640_116.png';
import priusImage from './prius.png';
import model3Image from './redModel3.png';
import modelXImage from './GreyModelX.png';
import R8Image from './blueR8.png';
import ChevyImage from './redChevy.png';
import BMWImage  from './babyBMW.png';
import mercedsImage from './benzA.png';
import cadillacImage from './orangeCadillac.png';



const CarListingPage = () => {
  const [cars, setCars] = useState([
    { id: 1, maker: 'Toyota', model: 'Corolla', year: 2024, price: 25, available: true, image: corollaImage, position: [45.5017, -73.5778], type: 'Sedan' },
    { id: 2, maker: 'Honda', model: 'Civic', year: 2024, price: 35, available: true, image: civicImage, position: [45.5391, -73.5974], type: 'Hatchback' },
    { id: 3, maker: 'Toyota', model: 'Prius', year: 2024, price: 160, available: true, image: priusImage, position: [45.5197, -73.6665], type: 'Hybrid' },
    { id: 4, maker: 'Tesla', model: 'Model 3', year: 2024, price: 30, available: true, image: model3Image, position: [45.5017, -73.5778], type: 'Electric' },
    { id: 5, maker: 'Tesla', model: 'Model X', year: 2024, price: 55, available: true, image: modelXImage, position: [75.5017, -73.5778], type: 'Electric' },
    { id: 6, maker: 'Audi', model: 'R8', year: 2024, price: 500, available: true, image: R8Image, position: [45.5017, -73.5778], type: 'Coupe' },
    { id: 7, maker: 'Cheverolet', model: 'Silverado', year: 2019, price: 250, available: true, image: ChevyImage, position: [45.5017, -73.5778], type: 'Pickup' },
    { id: 8, maker: 'BMW', model: '2 Series', year: 2023, price: 390, available: true, image:BMWImage, position: [45.5017, -73.5778], type: 'Coupe' },
    { id: 9, maker: 'Mercedes', model: 'A Class', year: 2022, price: 440, available: true, image: mercedsImage, position: [45.5017, -73.5778], type: 'Sedan' },
    { id: 10, maker: 'Cadillac', model: 'XT4', year: 2024, price: 300, available: true, image: cadillacImage, position: [45.5017, -73.5778], type: 'SUV' },
  ]);

  const [modalOpen, setModalOpen] = useStates(false);
  const[selectedCarImage, setSelectedCarImage] = useState('');

  /*const openModal = (image) => {
    setSelectedCarImage(image);
    setModalOpen(true);
  }*/

  /*const closeModal = (image) => {
    setSelectedCarImage('');
    setModalOpen(false);
  }

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableCars, setAvailableCars] = useState([]);

  const checkAvailability = () => {
    const available = cars.filter(car => car.available);
    const unavailable = cars.filter(car => !car.available);
    setAvailableCars({ available, unavailable });
  };

  const reserveCar = (carId, carType) => {
    setCars(prevCars => {
      return prevCars.map(car => {
        if (car.id === carId) {
          return { ...car, available: false };
        }
        return car;
      });
    });
    // Redirect to the Reservation page with car ID and car type
    window.location.href = `/Reservation/${carId}/${carType}`;
  };

  return (
    <div>
      <h2>Check Car Availability</h2>
     <div className="horizontal-container">
       <div>
         <label>Date:</label>
         <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
       </div>
       <div>
         <label>End Date:</label>
         <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
       </div>
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
                <button className="reserve-button" onClick={() => reserveCar(car.id, car.type)}>Reserve</button>
              </div>
            </div>
          ))}
        </div>

        <div className="map-container">
          <MapContainer center={[45.5017, -73.5673]} zoom={10}>
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
                      <button onClick={() => reserveCar(car.id, car.type)}>Reserve</button>
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
