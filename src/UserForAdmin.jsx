import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserAdmin.css';

const UsersForAdmin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/accounts/api/users/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUser = async (email) => {
        console.log("Deleting user with email:", email);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/accounts/api/users/${email}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            // Remove the deleted user from the list
            setUsers(users.filter(user => user.email !== email));
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div>
            <h1>User Listings</h1>
            <div className="user-listings">
                {users.map((user, index) => (
                    <div className="user-item" key={index}>
                        <h2>{user.username}</h2>
                        <p>Email: {user.email}</p>
                        {/* Display other user information as needed */}
                        <button onClick={() => deleteUser(user.email)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersForAdmin;
