import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

async function fetchUserPoints() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const response = await axios.get('http://localhost:8000/accounts/api/get-user-data/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("Response:", response);
    
    // Assuming the response contains points directly in the top-level object
    const points = response.data.points;

    console.log("Points:", points);

    return points;
  } catch (error) {
    console.error('Error fetching user points:', error);
    return null;
  }
}



export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('username');
    const isSuperuser = localStorage.getItem('is_superuser') === 'true';
    const email = localStorage.getItem('email');
  
    // Fetch user points
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
    localStorage.setItem('points', String(points));// Save points to localStorage
  }

  function signOut() {
    setCurrentUser(null);
    localStorage.removeItem('username');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('email');
    localStorage.removeItem('points'); // Ensure points are also removed
    window.location.href = '/';
  }

  const value = {
    currentUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
