import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx'; // Ensure this is implemented as described
import './LoginCSS.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    if (formData.email === 'CSR@email.com' || formData.email === 'SYSM@email.com' || formData.email === 'SYS@emai.com') {
      localStorage.setItem('showAdminPanel', 'true');
    } else {
      localStorage.removeItem('showAdminPanel');
    }
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLoginError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('is_superuser', data.is_superuser.toString());
        if (data.is_superuser ||formData.email === 'CSR@email.com' ||formData.email === 'SYSM@email.com') {
          signIn(data.username, true); // Assuming signIn function can accept a parameter to set admin privileges
        } else {
          signIn(data.username, false);
        }
        navigate('/');
      } else if (response.status === 401) {
        setLoginError('Incorrect password. Please try again.');
      } else if (response.status === 404) {
        setLoginError('Account does not exist. Please sign up.');
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
        {loginError && <div className="error">{loginError}</div>}
      </form>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
}

export default Login;
