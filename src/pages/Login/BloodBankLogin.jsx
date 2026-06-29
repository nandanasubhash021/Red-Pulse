import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Login.css';

function BloodBankLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // 🌟 UPDATED: Adjusted to hit the centralized backend endpoint under routes/auth.js
      const res = await fetch('http://localhost:5000/api/auth/bloodbank/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('bb_token', data.token);
        navigate('/blood-bank/dashboard');
      } else {
        setMessage({ type: 'error', text: data.msg || 'Invalid credentials.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server communication error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rp-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="rp-card" style={{ maxWidth: '450px', width: '100%' }}>
          <h2 style={{ borderLeft: '4px solid #e60026', paddingLeft: '12px', marginBottom: '1.5rem' }}>Blood Bank Login</h2>
          
          {message.text && (
            <div className={`rp-alert-banner ${message.type === 'success' ? 'rp-alert-success' : 'rp-alert-error'}`} style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="rp-input-group">
              <label>Blood Bank Email</label>
              <input type="email" className="rp-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="rp-input-group" style={{ marginTop: '1rem' }}>
              <label>Password</label>
              <input type="password" className="rp-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="rp-submit-btn-container" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="rp-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BloodBankLogin;