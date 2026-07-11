import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Register.css';

function BloodBankRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', licenseNumber: '', email: '', phone: '', contactPersonName: '',
    contactPersonNumber: '', state: '', district: '', city: '', address: '',
    pincode: '', operatingHours: '', password: '', confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }
    setIsSubmitting(true);
    try {
      // 🌟 UPDATED: Pointing to the central route handled by routes/auth.js
      const res = await fetch('https://red-pulse-beige.vercel.app/api/auth/bloodbank/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('bb_token', data.token);
        navigate('/blood-bank/dashboard');
      } else {
        setMessage({ type: 'error', text: data.msg || 'Registration failed.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server communication failure.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rp-page-wrapper">
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <div className="rp-card">
          <h2 style={{ borderLeft: '4px solid #e60026', paddingLeft: '12px', marginBottom: '2rem' }}>Blood Bank Registration</h2>
          
          {message.text && (
            <div className={`rp-alert-banner ${message.type === 'success' ? 'rp-alert-success' : 'rp-alert-error'}`} style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="rp-form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Blood Bank Name</label><input type="text" name="name" className="rp-input" required onChange={handleChange}/></div>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Registration / License Number</label><input type="text" name="licenseNumber" className="rp-input" required onChange={handleChange}/></div>
            </div>
            <div className="rp-form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Email Address</label><input type="email" name="email" className="rp-input" required onChange={handleChange}/></div>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Phone Number</label><input type="text" name="phone" className="rp-input" required onChange={handleChange}/></div>
            </div>
            <div className="rp-form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Contact Person Name</label><input type="text" name="contactPersonName" className="rp-input" required onChange={handleChange}/></div>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Contact Person Number</label><input type="text" name="contactPersonNumber" className="rp-input" required onChange={handleChange}/></div>
            </div>
            <div className="rp-form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div className="rp-input-group" style={{ flex: '1 1 30%' }}><label>State</label><input type="text" name="state" className="rp-input" required onChange={handleChange}/></div>
              <div className="rp-input-group" style={{ flex: '1 1 30%' }}><label>District</label><input type="text" name="district" className="rp-input" required onChange={handleChange}/></div>
              <div className="rp-input-group" style={{ flex: '1 1 30%' }}><label>City</label><input type="text" name="city" className="rp-input" required onChange={handleChange}/></div>
            </div>
            <div className="rp-form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div className="rp-input-group" style={{ flex: '1 1 65%' }}><label>Full Address</label><input type="text" name="address" className="rp-input" required onChange={handleChange}/></div>
              <div className="rp-input-group" style={{ flex: '1 1 30%' }}><label>Pincode</label><input type="text" name="pincode" className="rp-input" required onChange={handleChange}/></div>
            </div>
            <div className="rp-input-group" style={{ marginTop: '1rem' }}><label>Operating Hours (e.g., 24/7, 9 AM - 9 PM)</label><input type="text" name="operatingHours" className="rp-input" required onChange={handleChange}/></div>
            <div className="rp-form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Password</label><input type="password" name="password" className="rp-input" required onChange={handleChange}/></div>
              <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Confirm Password</label><input type="password" name="confirmPassword" className="rp-input" required onChange={handleChange}/></div>
            </div>
            <div className="rp-submit-btn-container" style={{ marginTop: '2rem' }}>
              <button type="submit" className="rp-submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Registering Center...' : 'Register Blood Bank'}</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BloodBankRegister;