import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    async function fetchUserPoints() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return null;
      }

      try {
        const response = await axios.get('http://localhost:8000/accounts/api/get-user-data/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("Response:", response);
        const points = response.data.points;
        console.log("Points:", points);

        return points;
      } catch (error) {
        console.error('Error fetching user points:', error);
        return null;
      }
    }

    useEffect(() => {
        const user = localStorage.getItem('username');
        const isSuperuser = localStorage.getItem('is_superuser') === 'true';
        const email = localStorage.getItem('email');
    
        fetchUserPoints().then(points => {
          console.log("Parsed points:", points);
          if (user) {
            setCurrentUser({ username: user, is_superuser: isSuperuser, email, points }); // Include points in currentUser object
          }
        });
    }, []);
    
    function signIn(username, is_superuser, email, points) {
        setCurrentUser({ username, is_superuser, email, points }); // Include points when user signs in
        localStorage.setItem('username', username);
        localStorage.setItem('is_superuser', is_superuser.toString());
        localStorage.setItem('email', email);
        localStorage.setItem('points', String(points)); // Save points to localStorage
    }
    
    function signOut() {
        setCurrentUser(null);
        localStorage.removeItem('username');
        localStorage.removeItem('is_superuser');
        localStorage.removeItem('email');
        localStorage.removeItem('points'); // Ensure points are also removed
        window.location.href = '/';
    }
    
    function usePoints(pointsUsed) {
        if (!currentUser || pointsUsed > currentUser.points) return;

        const newPoints = currentUser.points - pointsUsed;
        setCurrentUser({ ...currentUser, points: newPoints });

        updatePointsInBackend(newPoints);
    }
    
    async function updatePointsInBackend(newPoints) {
        try {
            const response = await axios.put('http://localhost:8000/accounts/api/update-points/', {
                points: newPoints
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log("Updated points in backend:", response.data);
        } catch (error) {
            console.error('Error updating points in backend:', error);
        }
    }
    
    const value = {
        currentUser,
        signIn,
        signOut,
        usePoints // Now correctly passing `usePoints` in the context provider
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
