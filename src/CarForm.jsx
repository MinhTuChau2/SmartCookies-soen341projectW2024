import React, { useState } from 'react';
import axios from 'axios';

const CarForm = () => {
    const [car, setCar] = useState({
        maker: '',
        model: '',
        year: '',
        price: '',
        available: true,
        // Add other fields as needed
    });

    const handleChange = e => {
        setCar({ ...car, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/add_car/', car);
            console.log('Car added:', response.data);
            // Handle success
        } catch (error) {
            console.error('Error adding car:', error);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="maker" placeholder="Maker" onChange={handleChange} />
            <input type="text" name="model" placeholder="Model" onChange={handleChange} />
            <input type="number" name="year" placeholder="Year" onChange={handleChange} />
            <input type="number" name="price" placeholder="Price" onChange={handleChange} />
            <button type="submit">Add Car</button>
        </form>
    );
};

export default CarForm;
