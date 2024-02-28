import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ name: '', lastName: '', email: '', password: '', accessCode: '', registering: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.registering ? '/api/register' : '/api/login';
    try {
      const response = await axios.post(endpoint, form);
      console.log('Success:', response.data);
      // Redirect or handle login/register success (e.g., save token, navigate to dashboard)
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div>
      <h2>{form.registering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {form.registering && (
          <>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="accessCode" placeholder="Access Code (optional)" onChange={handleChange} />
          </>
        )}
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required={!form.registering} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">{form.registering ? 'Register' : 'Login'}</button>
        <button type="button" onClick={() => setForm({ ...form, registering: !form.registering })}>{form.registering ? 'Go to Login' : 'Go to Register'}</button>
      </form>
    </div>
  );
};

export default Login;
