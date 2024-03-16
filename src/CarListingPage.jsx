import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CarListingCss.css';

const CarListingPage = () => {
    const [cars, setCars] = useState([]);
    const navigate = useNavigate(); // Access useNavigate hook

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cars/');
                setCars(response.data); // Assuming the response data is an array of cars with image URLs
            } catch (error) {
                console.error(error); // Handle error
            }
        };
        fetchCars();
    }, []); // Run once on component mount

    const reserveCar = (carModel) => {
        // Find the selected car based on car model and update its availability
        const updatedCars = cars.map(car => {
            if (car.model === carModel) {
                return { ...car, available: false };
            }
            return car;
        });
        setCars(updatedCars);

        // Redirect to the Reservation page with car model as query parameter
       navigate(`/reservation/${carModel}`);
    };

    return (
        <div className="content-wrapper">
            <h1>Car Listings</h1>
            <div className="car-container">
                {cars.map((car, index) => (
                    <div key={index} className="car-item">
                        <h2>{car.maker} {car.model}</h2>
                        <p>Year: {car.year}</p>
                        <p>Price: {car.price}</p>
                        <p>Available: {car.available ? 'Yes' : 'No'}</p>
                        <p>Address: {car.address}</p>
                        <p>Type: {car.car_type}</p>
                        {car.image && <img src={car.image} alt={`${car.maker} ${car.model}`} className="car-image" />}
                        <button className="reserve-button" onClick={() => reserveCar(car.model)}>Reserve</button>
                    </div>
                ))}
            </div>
            <div className="map-container">
                <MapContainer center={[45.508888, -73.561668]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
            </div>
        </div>
    );
};

export default CarListingPage;
