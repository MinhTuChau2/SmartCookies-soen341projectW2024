import React, { useState } from 'react';
import axios from 'axios';
import './CarFormCSS.css';

const CarForm = () => {
    const [formData, setFormData] = useState({
        maker: '',
        model: '',
        year: 0,
        price: 0,
        available: true,
        address: '',
        car_type: '',
        image: null // Added image field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        try {
            const response = await axios.post('http://localhost:8000/cars/', formDataToSend);
            console.log(response.data); // Handle success
        } catch (error) {
            console.error(error); // Handle error
        }
    };

    return (
        <div className="car-form-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Maker:
                    <input type="text" name="maker" value={formData.maker} onChange={handleChange} />
                </label>
                <label>
                    Model:
                    <input type="text" name="model" value={formData.model} onChange={handleChange} />
                </label>
                <label>
                    Year:
                    <input type="number" name="year" value={formData.year} onChange={handleChange} />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={formData.price} onChange={handleChange} />
                </label>
                <label>
                    Available:
                    <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                </label>
                <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </label>
                <label>
                    Car Type:
                    <input type="text" name="car_type" value={formData.car_type} onChange={handleChange} />
                </label>
                <label>
                    Image:
                    <input type="file" name="image" onChange={handleImageChange} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CarForm;
