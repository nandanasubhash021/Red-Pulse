import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiPlusMedical } from 'react-icons/bi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="rp-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="rp-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', fontWeight: '700' }}>Login As</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <button 
              className="rp-submit-btn" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px' }}
              onClick={() => navigate('/login/user')}
            >
              <BiUser size={22} /> User
            </button>
            
            <button 
              className="rp-submit-btn" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', backgroundColor: '#1f2937' }}
              onClick={() => navigate('/login/blood-bank')}
            >
              <BiPlusMedical size={20} /> Blood Bank
            </button>
          </div>

          <hr className="rp-inner-divider" style={{ margin: '2rem 0', opacity: 0.2 }} />
          
          <p style={{ margin: 0 }}>
            Don't have an account?{' '}
            <span 
              style={{ color: '#e60026', fontWeight: '700', cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Register
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;