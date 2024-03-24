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
    const email = localStorage.getItem('email'); // Retrieve email from localStorage
    if (user) {
      setCurrentUser({ username: user, is_superuser: isSuperuser, email });
    }
  }, []);

  function signIn(username, is_superuser, email) {
    setCurrentUser({ username, is_superuser, email });
    localStorage.setItem('username', username);
    localStorage.setItem('is_superuser', is_superuser.toString());
    localStorage.setItem('email', email); // Save email to localStorage
  }

  function signOut() {
    setCurrentUser(null);
    localStorage.removeItem('username');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('email'); // Ensure email is also removed
  }

  const value = {
    currentUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
