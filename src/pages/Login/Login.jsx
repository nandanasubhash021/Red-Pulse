import React, { useState } from 'react';
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store authorization payload securely
        alert(`Welcome back to Red Pulse!`);
        navigate('/'); // Redirect to homepage
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("Could not reach backend. Verify that your npm backend server is running.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#cc0000', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input type="email" placeholder="Enter email" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} onChange={e => setCredentials({...credentials, email: e.target.value})} />
          
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input type="password" placeholder="Enter password" required style={{ width: '100%', padding: '8px', marginBottom: '20px' }} onChange={e => setCredentials({...credentials, password: e.target.value})} />
          
          <button type="submit" style={{ width: '100%', backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;