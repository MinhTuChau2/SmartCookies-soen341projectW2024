import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/SignupCSS.css';

function SignUp() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // New state for successful signup
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    if (success) setSuccess(false); // Reset success state on form change
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
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${localStorage.getItem('token')}` // Include the token in the request headers
              },
              body: JSON.stringify({
                  email: formData.email,
                  username: formData.username,
                  password: formData.password,
              }),
          });

          if (response.ok) {
              setError(''); // Clear any previous errors
              setSuccess(true); // Set success state to true
              setTimeout(() => {
                  navigate('/login'); // Redirect to Login after a short delay to display success message
              }, 2000); // Adjust delay as needed
          } else if (response.status === 409) { // Assuming 409 for conflict i.e. account exists
              setError('Account already exists with this email. Please login instead.');
          } else {
              const errorData = await response.json();
              if (errorData.email && errorData.email.includes("user with this email already exists.")) {
                  setError("An account with this email already exists. Please log in.");
              } else {
                  setError('Registration failed. Please try again.');
              }
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
          required
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
        {success && <div className="success">Signed up successfully! Redirecting to login...</div>}
      </form>
    </div>
  );
}

export default SignUp;

