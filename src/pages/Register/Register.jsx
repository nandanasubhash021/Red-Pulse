import React, { useState } from 'react';
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Eligibility Screen, Step 2: Main Registration Form
  
  // State for health constraints
  const [eligibility, setEligibility] = useState({
    age: '', weight: '', hasDisease: false, hadRecentSurgery: false, daysSinceLastDonation: 100
  });

  // State for user registration fields
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', bloodGroup: 'A+', address: '', district: '', password: ''
  });

  const handleEligibilitySubmit = (e) => {
    e.preventDefault();
    // Validate core eligibility parameters
    if (
      Number(eligibility.age) >= 18 && Number(eligibility.age) <= 65 &&
      Number(eligibility.weight) >= 50 &&
      !eligibility.hasDisease && !eligibility.hadRecentSurgery &&
      Number(eligibility.daysSinceLastDonation) >= 90
    ) {
      setStep(2); // Valid donor candidate, proceed to form fields
    } else {
      alert("Registration paused. Based on your inputs, you do not meet the minimum health or safety requirements to act as an active voluntary donor at this time.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connects directly to your Express server running on port 5000
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eligibilityAnswers: eligibility })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token); // Safely keep user session active
        alert(`Welcome aboard, ${data.user.name}! Your account has been registered.`);
        navigate('/'); // Bring them back to the Home page
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("Unable to contact backend server. Is npm start running?");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        {step === 1 ? (
          /* Adding a distinct key here forces React to treat this as an isolated component */
          <form key="step-1-eligibility-form" onSubmit={handleEligibilitySubmit} autoComplete="off">
            <h2 style={{ color: '#cc0000', marginBottom: '20px' }}>Step 1: Donor Eligibility Check</h2>
            
            <label style={{ display: 'block', marginBottom: '5px' }}>Age (Must be 18–65):</label>
            <input 
              type="number" 
              name="eligibility_age_field"
              autoComplete="new-password"
              required 
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }} 
              value={eligibility.age} 
              onChange={e => setEligibility({...eligibility, age: e.target.value})} 
            />
            
            <label style={{ display: 'block', marginBottom: '5px' }}>Weight (kg) (Must be above 50kg):</label>
            <input 
              type="number" 
              name="eligibility_weight_field"
              autoComplete="new-password"
              required 
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }} 
              value={eligibility.weight} 
              onChange={e => setEligibility({...eligibility, weight: e.target.value})} 
            />
            
            <div style={{ marginBottom: '15px' }}>
              <input type="checkbox" id="disease" checked={eligibility.hasDisease} onChange={e => setEligibility({...eligibility, hasDisease: e.target.checked})} />
              <label htmlFor="disease" style={{ marginLeft: '10px' }}>Do you have any blood-transmitted diseases?</label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input type="checkbox" id="surgery" checked={eligibility.hadRecentSurgery} onChange={e => setEligibility({...eligibility, hadRecentSurgery: e.target.checked})} />
              <label htmlFor="surgery" style={{ marginLeft: '10px' }}>Had a major surgery within the past 6 months?</label>
            </div>
            
            <button type="submit" style={{ backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Continue Registration</button>
          </form>
        ) : (
          /* Changing the key here forces the browser engine to abandon previous fields entirely */
          <form key="step-2-profile-form" onSubmit={handleRegisterSubmit} autoComplete="on">
            <h2 style={{ color: '#cc0000', marginBottom: '20px' }}>Step 2: Profile Registration</h2>
            
            <input type="text" name="name" placeholder="Full Name" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="email" name="email" placeholder="Email Address" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="text" name="phone" placeholder="Phone Number" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="text" name="street-address" placeholder="Street Address" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <input type="text" name="district" placeholder="District" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
            
            <label style={{ display: 'block', marginBottom: '5px' }}>Blood Group: </label>
            <select name="bloodGroup" value={formData.bloodGroup} style={{ width: '100%', padding: '8px', marginBottom: '15px' }} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            
            <input type="password" name="new-password" placeholder="Create Password" required style={{ width: '100%', padding: '8px', marginBottom: '20px' }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            
            <button type="submit" style={{ backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Submit & Create Account</button>
          </form>
        )}
      </div>
    </>
  );
}

export default Register;