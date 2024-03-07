import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Format validation (basic example, adapt as needed)
    if (!formData.identifier || !formData.password) {
      setLoginError('Please enter both email/username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.identifier, password: formData.password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store necessary user data in sessionStorage or context
        navigate('/'); // Redirect to HomePage
      } else if (response.status === 404) {
        setLoginError('User not found. Please sign up.');
      } else {
        setLoginError('Login failed. Please try again.');
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
          type="text"
          name="identifier"
          placeholder="Email/Username"
          value={formData.identifier}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {loginError && <div className="error">{loginError}</div>}
      </form>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
}

export default Login;
