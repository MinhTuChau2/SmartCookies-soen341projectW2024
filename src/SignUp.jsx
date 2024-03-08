import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic email format validation
    const emailPattern = /\S+@\S+\.\S+/;
    const isEmailValid = emailPattern.test(formData.email);

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.username || !formData.password || formData.password !== formData.confirmPassword) {
      setError('Please check your inputs. Passwords must match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/accounts/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        navigate('/login'); // Redirect to Login on successful sign up
      } else {
        const errorData = await response.json();
        setError(errorData.errors || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="signup-form">
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
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username" 
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default SignUp;
