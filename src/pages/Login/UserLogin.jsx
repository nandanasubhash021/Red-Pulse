import React, { useState } from 'react';
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🚀 Sending credentials to login pipeline:", credentials.email);
      
      const response = await fetch('https://red-pulse-ivory.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      console.log("📦 RAW BACKEND DATA BODY:", JSON.stringify(data, null, 2));
      console.warn("❌ Backend rejected authorization:", JSON.stringify(data, null, 2));
      
      if (response.ok) {
        localStorage.setItem('token', data.token); 
        
        // Save user role attribute if your backend still provides one
        if (data.user && data.user.role) {
          localStorage.setItem('userRole', data.user.role);
        } else if (data.role) {
          localStorage.setItem('userRole', data.role);
        }
        
        console.log("✅ Login successful! Redirecting to user hub...");
        navigate('/dashboard'); 
      } else {
        console.warn("❌ Backend rejected authorization:", data);
        alert(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error("💥 Severe connection error:", err);
      alert("Could not reach backend. Verify that your backend server is running.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#cc0000', marginBottom: '20px', fontFamily: 'sans-serif' }}>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="Enter email" 
            required 
            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }} 
            onChange={e => setCredentials({...credentials, email: e.target.value})} 
          />
          
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Password</label>
          <input 
            type="password" 
            placeholder="Enter password" 
            required 
            style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }} 
            onChange={e => setCredentials({...credentials, password: e.target.value})} 
          />
          
          <button type="submit" style={{ width: '100%', backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default UserLogin;