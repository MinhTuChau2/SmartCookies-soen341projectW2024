import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CarListingCss.css';

const CarListingPage = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cars/');
                setCars(response.data);
                setFilteredCars(response.data);
                const carsWithCoords = await Promise.all(response.data.map(async (car) => {
                    const coords = await getAddressCoordinates(car.address);
                    return { ...car, coords: coords };
                }));
                setCars(carsWithCoords);
                setFilteredCars(carsWithCoords);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCars();
    }, []);

    useEffect(() => {
        if (filterType === '') {
            setFilteredCars(cars);
        } else {
            const filtered = cars.filter(car => car.car_type === filterType);
            setFilteredCars(filtered);
        }
    }, [filterType, cars]);

    const reserveCar = (carModel) => {
        const updatedCars = cars.map(car => {
            if (car.model === carModel) {
                return { ...car, available: false };
            }
            return car;
        });
        setCars(updatedCars);
        navigate(`/reservation/${carModel}`);
    };

    const getAddressCoordinates = async (address) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
            if (response.data && response.data.length > 0) {
                return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const filterByDistance = async () => {
        if (postalCode.trim() === '') {
            setFilteredCars(cars);
            return;
        }
        try {
            const postalCodeCoords = await getAddressCoordinates(postalCode);
            if (postalCodeCoords) {
                const sortedCars = cars
                    .map(car => {
                        const distance = getDistance(car.coords, postalCodeCoords);
                        return { ...car, distance };
                    })
                    .filter(car => !isNaN(car.distance))
                    .sort((a, b) => a.distance - b.distance);
                setFilteredCars(sortedCars);
            } else {
                setFilteredCars([]);
            }
        } catch (error) {
            console.error(error);
            setFilteredCars([]);
        }
    };

    const getDistance = (coords1, coords2) => {
        const [lat1, lon1] = coords1;
        const [lat2, lon2] = coords2;
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    return (
        <div className="content-wrapper">
            <h1>Car Listings</h1>
            <div className="filter-section">
                <label>Filter by Car Type:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="">All</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Pick Up">Pick Up</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sports Car">Sports Car</option>
                    <option value="Hardtop">Hardtop</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                />
                <button onClick={filterByDistance}>Filter by Distance</button>
            </div>
            <div className="car-container">
                {filteredCars.map((car, index) => (
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
                    {filteredCars.map((car, index) => (
                        car.coords &&
                        <Marker key={index} position={car.coords}>
                            <Popup>
                                <div>
                                    <h3>{car.maker} {car.model}</h3>
                                    <p>{car.address}</p>
                                    <button onClick={() => reserveCar(car.model)}>Reserve</button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default CarListingPage;
