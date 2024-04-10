import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('username');
    const isSuperuser = localStorage.getItem('is_superuser') === 'true';
    const email = localStorage.getItem('email');
    const points = parseInt(localStorage.getItem('points'))||0; // Retrieve points from localStorage

    if (user) {
      setCurrentUser({ username: user, is_superuser: isSuperuser, email, points }); // Include points in currentUser object
    }
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
