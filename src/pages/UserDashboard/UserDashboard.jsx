import React, { useState, useEffect } from 'react';
import { 
  BiGridAlt, BiUser, BiPlusMedical, BiNotification, 
  BiLogOut, BiSend, BiCheckCircle, BiXCircle, BiCalendar
} from 'react-icons/bi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './UserDashboard.css';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // LIVE PROFILE DATA COUPLING STATE
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [gender, setGender] = useState('female'); 
  const [lastDonationDate, setLastDonationDate] = useState('');

  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodGroup: '',
    units: '',
    hospitalName: '',
    district: '',
    patientCase: ''
  });

  // 🌟 AUTOMATIC BACKGROUND FETCH FROM MONGODB USING LOGGED-IN TOKEN
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login"; 
          return;
        }

        // Connect directly to our brand-new backend /me route
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); // 🌟 Populate dashboard fields!
          
          if (data.gender) setGender(data.gender);
          if (data.lastDonationDate) setLastDonationDate(data.lastDonationDate.split('T')[0]);
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

  const getEligibilityStatus = () => {
    if (!lastDonationDate) {
      return { eligible: true, text: "Eligible to Donate", class: "rp-badge-eligible" };
    }
    const lastDate = new Date(lastDonationDate);
    const today = new Date();
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const coolingDays = gender === 'male' ? 90 : 120;

    if (diffDays >= 0 && diffDays < coolingDays) {
      const waitRemaining = coolingDays - diffDays;
      return { eligible: false, text: `Cooling Period (${waitRemaining} days remaining)`, class: "rp-badge-cooling" };
    }
    return { eligible: true, text: "Eligible to Donate", class: "rp-badge-eligible" };
  };

  const status = getEligibilityStatus();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Emergency Blood Request for "${requestForm.patientName}" broadcasted successfully!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
            <span className={`rp-badge ${status.class}`}>{status.text}</span>
          </div>
          
          <div className="rp-nav-menu">
            <button className={`rp-nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <BiGridAlt /> Overview
            </button>
            <button className={`rp-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <BiUser /> Profile Settings
            </button>
            <button className={`rp-nav-btn ${activeTab === 'emergency-request' ? 'active' : ''}`} onClick={() => setActiveTab('emergency-request')}>
              <BiPlusMedical /> Emergency Request
            </button>
            <button className={`rp-nav-btn ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
              <BiNotification /> Emergency Alerts <span className="rp-dot">2</span>
            </button>
            <hr className="rp-divider" />
            <button className="rp-nav-btn rp-logout" onClick={handleLogout}>
              <BiLogOut /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="rp-main-content">
          {activeTab === 'overview' && (
            <div className="rp-panel">
              <h2>Dashboard Overview</h2>
              <div className="rp-stats-grid">
                <div className="rp-stat-card primary">
                  <h3>Total Donations</h3>
                  <div className="rp-number">4</div>
                  <span>Verified Platform Milestones</span>
                </div>
                <div className="rp-stat-card">
                  <h3>Active Requests</h3>
                  <div className="rp-number">1</div>
                  <span>Broadcast System Channels</span>
                </div>
                <div className="rp-stat-card">
                  <h3>Donor Availability</h3>
                  <div className={`rp-number ${status.eligible ? 'text-green' : 'text-orange'}`}>
                    {status.eligible ? 'Active' : 'Suspended'}
                  </div>
                  <span>{status.eligible ? 'Visible to regional maps' : 'Exclusion Window Active'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="rp-panel">
              <h2>My Profile Details</h2>
              <div className="rp-card">
                <div className="rp-profile-details-read">
                  <p><strong>Registered User Name:</strong> {userData?.name}</p>
                  <p><strong>System Blood Type:</strong> {userData?.bloodGroup}</p>
                  <p><strong>Primary Contact Email:</strong> {userData?.email}</p>
                  <p><strong>Assigned District Location:</strong> {userData?.district || 'Not Configured'}</p>
                </div>
                <hr className="rp-inner-divider" />
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
              </div>
            </div>
          )}

          {activeTab === 'emergency-request' && (
            <div className="rp-panel">
              <h2>Raise Emergency Blood Request</h2>
              <div className="rp-card">
                <form onSubmit={handleFormSubmit}>
                  <div className="rp-form-row">
                    <div className="rp-input-group">
                      <label>Patient Name</label>
                      <input type="text" name="patientName" className="rp-input" value={requestForm.patientName} onChange={handleFormChange} required placeholder="Enter Patient Name" />
                    </div>
                    <div className="rp-input-group">
                      <label>Blood Group Needed</label>
                      <select name="bloodGroup" className="rp-input" value={requestForm.bloodGroup} onChange={handleFormChange} required>
                        <option value="">Select Group</option>
                        <option value="A+">A +ve</option>
                        <option value="A-">A -ve</option>
                        <option value="B+">B +ve</option>
                        <option value="B-">B -ve</option>
                        <option value="O+">O +ve</option>
                        <option value="O-">O -ve</option>
                        <option value="AB+">AB +ve</option>
                        <option value="AB-">AB -ve</option>
                      </select>
                    </div>
                  </div>
                  <div className="rp-form-row">
                    <div className="rp-input-group">
                      <label>Hospital Name</label>
                      <input type="text" name="hospitalName" className="rp-input" value={requestForm.hospitalName} onChange={handleFormChange} required placeholder="e.g. Medical City" />
                    </div>
                    <div className="rp-input-group">
                      <label>District</label>
                      <input type="text" name="district" className="rp-input" value={requestForm.district} onChange={handleFormChange} required placeholder="Enter District" />
                    </div>
                  </div>
                  <button type="submit" className="rp-submit-btn"><BiSend /> Broadcast Request</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="rp-panel">
              <h2>Live Emergency Blood Alerts</h2>
              <div className="rp-card rp-border-red">
                <div className="rp-card-header-split">
                  <h3>Patient: Rahul Varma</h3>
                  <span className="rp-urgency-tag">CRITICAL URGENCY</span>
                </div>
                <div className="rp-alert-info-grid">
                  <p><strong>Blood Group Required:</strong> <span className="rp-highlight-red">O +ve</span></p>
                  <p><strong>Hospital:</strong> General Hospital</p>
                  <p><strong>District:</strong> Ernakulam</p>
                </div>
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