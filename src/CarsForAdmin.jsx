// CarsForAdmin.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CarAdmin.css';
import './CarListingCss.css'

const CarsForAdmin = () => {
    const [cars, setCars] = useState([]);
    const [formData, setFormData] = useState({
        maker: '',
        model: '',
        year: 0,
        price: 0,
        available: true,
        address: '',
        car_type: '',
        image: null
    });

    useEffect(() => {
        fetchCars();
    }, []);

   const fetchCars = async () => {
       try {
           const response = await axios.get('http://localhost:8000/cars/', {
               headers: {
                   'Authorization': `Token ${localStorage.getItem('token')}` // Authorization token included
               }
           });
           setCars(response.data);
       } catch (error) {
           console.error(error);
       }
   };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            const response = await axios.post('http://localhost:8000/cars/', formDataToSend);
            setCars([...cars, response.data]);
            setFormData({
                maker: '',
                model: '',
                year: 0,
                price: 0,
                available: true,
                address: '',
                car_type: '',
                image: null
            });
        } catch (error) {
            console.error(error);
        }
    };

  const handleDelete = async (carModel) => {
      try {
          const token = localStorage.getItem('token'); // Retrieve the authentication token from localStorage
          await axios.delete(`http://localhost:8000/cars/${carModel}`, {
              headers: {
                  'Authorization': `Token ${token}` // Include the token in the request headers
              }
          });

          setCars(cars.filter(car => car.model !== carModel));
      } catch (error) {
          console.error(error);
      }
  };

    return (
    <div className="content-wrapper">
        <div className="car-listings">
            <h1>Car Listings</h1>

            <div className="car-container">
                {cars.map((car, index) => (
                    <div className="car-item" key={index}>
                        <h2>{car.maker} {car.model}</h2>
                        <p>Year: {car.year}</p>
                        <p>Price: {car.price}</p>
                        <p>Available: {car.available ? 'Yes' : 'No'}</p>
                        <p>Address: {car.address}</p>
                        <p>Type: {car.car_type}</p>
                        {car.image && <img className="car-image" src={car.image} alt={`${car.maker} ${car.model}`} />}
                        <button onClick={() => handleDelete(car.model)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default CarsForAdmin;
