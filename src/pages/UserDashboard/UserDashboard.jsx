import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiLogOut, BiCalendar, BiHeart } from 'react-icons/bi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile'); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile data-binding states
  const [gender, setGender] = useState('female'); 
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [healthStatus, setHealthStatus] = useState('Eligible to Donate');
  
  // Real-time calculation tag delivered by the backend server
  const [computedStatus, setComputedStatus] = useState('Eligible to Donate');

  // Synchronize dashboard states with MongoDB
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login"; 
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user); 
          setComputedStatus(data.computedStatus);
          
          if (data.user.gender) setGender(data.user.gender);
          if (data.user.healthStatus) setHealthStatus(data.user.healthStatus);
          if (data.user.lastDonationDate) {
            setLastDonationDate(data.user.lastDonationDate.split('T')[0]);
          }
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error communicating with DB server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle Manual Form Submission Save Action
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/update-medical", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          gender,
          lastDonationDate: lastDonationDate || null,
          healthStatus
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setComputedStatus(data.computedStatus); // Instantly updates badge string
        setMessage({ type: 'success', text: 'Medical configuration metrics saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.msg || 'Failed to update changes.' });
      }
    } catch (err) {
      console.error("Network drop during save execution:", err);
      setMessage({ type: 'error', text: 'Server connection timeout. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleNavigationClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Select dynamic CSS modifier class names based on status values
  const getBadgeClass = () => {
    if (computedStatus === 'Eligible to Donate') return 'rp-badge-eligible';
    return 'rp-badge-cooling'; 
  };

  if (loading) {
    return (
      <div className="rp-loading-screen">
        <div className="rp-spinner"></div>
        <p>Synchronizing with Secure Database profiles...</p>
      </div>
    );
  }

  return (
    <div className="rp-page-wrapper">
      <Navbar />
      <div className="rp-grid-layout">
        
        {/* SIDEBAR */}
        <aside className="rp-sidebar">
          <div className="rp-profile-header">
            <div className="rp-avatar">{userData?.bloodGroup || '??'}</div>
            <h3>{userData?.name || 'Loading Profile...'}</h3>
            <span className={`rp-badge ${getBadgeClass()}`}>{computedStatus}</span>
          </div>
          
          <div className="rp-nav-menu">
            <button className={`rp-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleNavigationClick('profile')}>
              <BiUser /> Profile Settings
            </button>
            
            <hr className="rp-divider" />
            <button className="rp-nav-btn rp-logout" onClick={handleLogout}>
              <BiLogOut /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="rp-main-content">
          {activeTab === 'profile' && (
            <div className="rp-panel">
              <h2>My Profile Details</h2>

              {/* ACTION FEEDBACK MESSAGE BANNER */}
              {message.text && (
                <div className={`rp-alert-banner ${message.type === 'success' ? 'rp-alert-success' : 'rp-alert-error'}`}>
                  {message.text}
                </div>
              )}

              <div className="rp-card">
                <div className="rp-profile-details-read">
                  <p><strong>Registered User Name:</strong> {userData?.name}</p>
                  <p><strong>System Blood Type:</strong> {userData?.bloodGroup}</p>
                  <p><strong>Primary Contact Email:</strong> {userData?.email}</p>
                  <p><strong>Assigned District Location:</strong> {userData?.district || 'Not Configured'}</p>
                </div>
                
                <hr className="rp-inner-divider" />
                
                {/* SETTINGS PERSISTENCE FORM */}
                <form onSubmit={handleSaveProfile}>
                  <h4 className="rp-section-subheading"><BiCalendar /> Update Donation Thresholds</h4>
                  
                  <div className="rp-form-row">
                    <div className="rp-input-group">
                      <label>Assigned Gender</label>
                      <select className="rp-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="male">Male (90 Days Cycle)</option>
                        <option value="female">Female (120 Days Cycle)</option>
                      </select>
                    </div>
                    <div className="rp-input-group">
                      <label>Last Donation Date</label>
                      <input type="date" className="rp-input" value={lastDonationDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setLastDonationDate(e.target.value)} />
                    </div>
                  </div>

                  {/* HEALTH STATUS DROPDOWN SELECTION */}
                  <div className="rp-form-row" style={{ marginTop: '0.5rem' }}>
                    <div className="rp-input-group" style={{ gridColumn: 'span 2' }}>
                      <label><BiHeart /> Current Health Status</label>
                      <select className="rp-input" value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)}>
                        <option value="Eligible to Donate">Eligible to Donate</option>
                        <option value="Recent Surgery">Recent Surgery</option>
                        <option value="Medical Condition">Medical Condition</option>
                        <option value="Temporarily Unavailable">Temporarily Unavailable</option>
                      </select>
                    </div>
                  </div>

                  {/* MANUALLY TRIGGERED SUBMIT ACTION BUTTON */}
                  <div className="rp-submit-btn-container">
                    <button type="submit" className="rp-submit-btn" disabled={isSaving}>
                      {isSaving ? 'Saving Updates...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
                
              </div>
            </div>
          )}
        </main>

      </div>
      <Footer />
    </div>
  );
}

export default UserDashboard;