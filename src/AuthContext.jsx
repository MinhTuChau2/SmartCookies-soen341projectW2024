// AuthContext.jsx
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
    if (user) {
        setCurrentUser({ username: user, is_superuser: isSuperuser });
    }
}, []);


  function signIn(username, is_superuser) {
    setCurrentUser({ username, is_superuser });
    localStorage.setItem('username', username);
    localStorage.setItem('is_superuser', is_superuser.toString());
  }

  function signOut() {
    setCurrentUser(null);
    localStorage.removeItem('username');
    localStorage.removeItem('is_superuser');
    window.location.href = '/';
  }

  const value = {
    currentUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
