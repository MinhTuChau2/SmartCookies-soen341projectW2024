import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

function PointsDisplay() {
  const { currentUser } = useAuth();
  const [points, setPoints] = useState(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const { authToken } = useAuth(); // Obtain the authentication token from the AuthContext
        const response = await axios.get('http://localhost:8000/accounts/api/get_user_points/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Include the authentication token in the request headers
          },
        });
  
        const data = response.data;
        setPoints(data.points);
      } catch (error) {
        console.error('Error fetching user points:', error);
        // Handle error condition if needed, for example:
        setPoints(0); // Set default value or handle differently
      }
    };
  
    fetchUserPoints();
  }, [currentUser]); // Run the effect whenever the currentUser changes
   // Run the effect whenever the currentUser changes

  return (
    <div>
      {points !== null ? (
        <p>Points: {points}</p>
      ) : (
        <p>Loading points...</p>
      )}
    </div>
  );
}

export default PointsDisplay;
