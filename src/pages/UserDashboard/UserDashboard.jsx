import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BiUser, BiLogOut, BiCalendar, BiHeart, BiPlusMedical, 
  BiNotification, BiSend, BiCheck, BiX, BiPhoneCall, BiHistory 
} from 'react-icons/bi';
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
  const [computedStatus, setComputedStatus] = useState('Eligible to Donate');

  // Patient Core states
  const [patientRequests, setPatientRequests] = useState([]);
  const [selectedRequestDonors, setSelectedRequestDonors] = useState([]);
  const [trackingRequestId, setTrackingRequestId] = useState(null);
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    phoneNumber: '',
    bloodGroup: '',
    district: '',
    hospitalName: '',
    unitsRequired: 1,
    emergencyLevel: 'Urgent',
    additionalNotes: ''
  });

  // Donor Core States
  const [notifications, setNotifications] = useState([]);

  // Synchronize dashboard states with MongoDB
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

  // Fetch Patient Request History Logs
  const fetchPatientRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/requests/patient-logs", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPatientRequests(data.requests);
    } catch (err) {
      console.error("Error fetching patient histories:", err);
    }
  };

  // Fetch Live Notifications for Donor Profile
  const fetchDonorNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/requests/donor-alerts", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error("Error fetching donor notifications:", err);
    }
  };

  // Fetch real-time accepted donor arrays for a tracked request card
  const fetchAcceptedDonors = async (reqId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/requests/accepted-donors/${reqId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRequestDonors(data.donors);
        setTrackingRequestId(reqId);
      }
    } catch (err) {
      console.error("Error rendering donor listings:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchPatientRequests();
    fetchDonorNotifications();
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
        setComputedStatus(data.computedStatus); 
        setMessage({ type: 'success', text: 'Medical configuration metrics saved successfully!' });
        fetchDonorNotifications(); 
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

  // Input bindings tracking configurations
  const handleRequestFormChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  const handleCreateRequestSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestForm)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Emergency blood request has been successfully broadcast to all matching donors!' });
        fetchPatientRequests(); 
        setActiveTab('patient-tracking');
      } else {
        setMessage({ type: 'error', text: data.msg || 'Request initialization failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to broadcast emergency message to backend.' });
    }
  };

  // Process operational Accept/Reject clicks
  const handleNotificationResponse = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/requests/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, action })
      });
      if (res.ok) {
        fetchDonorNotifications(); 
      }
    } catch (err) {
      console.error("Action transmission failure:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
            <button className={`rp-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <BiUser /> Profile Settings
            </button>

            <button className={`rp-nav-btn ${activeTab === 'create-request' ? 'active' : ''}`} onClick={() => setActiveTab('create-request')}>
              <BiPlusMedical /> Request Blood
            </button>

            <button className={`rp-nav-btn ${activeTab === 'patient-tracking' ? 'active' : ''}`} onClick={() => setActiveTab('patient-tracking')}>
              <BiHistory /> My Requests
            </button>

            <button className={`rp-nav-btn ${activeTab === 'donor-alerts' ? 'active' : ''}`} onClick={() => setActiveTab('donor-alerts')}>
              <BiNotification /> Emergency Alerts
              {notifications.length > 0 && <span className="rp-sidebar-badge-pill">{notifications.length}</span>}
            </button>
            
            <hr className="rp-divider" />
            <button className="rp-nav-btn rp-logout" onClick={handleLogout}>
              <BiLogOut /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="rp-main-content">
          
          {/* FEEDBACK BANNERS */}
          {message.text && (
            <div className={`rp-alert-banner ${message.type === 'success' ? 'rp-alert-success' : 'rp-alert-error'}`}>
              {message.text}
            </div>
          )}

          {/* PANEL 1: PROFILE MANAGEMENT */}
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

                  <div className="rp-submit-btn-container">
                    <button type="submit" className="rp-submit-btn" disabled={isSaving}>
                      {isSaving ? 'Saving Updates...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PANEL 2: CREATE BLOOD REQUEST FORM */}
          {activeTab === 'create-request' && (
            <div className="rp-panel">
              <h2>Raise Emergency Blood Request</h2>
              <div className="rp-card">
                <form onSubmit={handleCreateRequestSubmit}>
                  <div className="rp-form-row">
                    <div className="rp-input-group">
                      <label>Patient Name</label>
                      <input type="text" name="patientName" className="rp-input" required value={requestForm.patientName} onChange={handleRequestFormChange} placeholder="Enter full name" />
                    </div>
                    <div className="rp-input-group">
                      <label>Contact Phone Number</label>
                      <input type="tel" name="phoneNumber" className="rp-input" required value={requestForm.phoneNumber} onChange={handleRequestFormChange} placeholder="Emergency phone line" />
                    </div>
                  </div>

                  <div className="rp-form-row">
                    <div className="rp-input-group">
                      <label>Blood Group Required</label>
                      <select name="bloodGroup" className="rp-input" required value={requestForm.bloodGroup} onChange={handleRequestFormChange}>
                        <option value="">Select Target Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div className="rp-input-group">
                      <label>Target District Location</label>
                      <input type="text" name="district" className="rp-input" required value={requestForm.district} onChange={handleRequestFormChange} placeholder="e.g. Ernakulam" />
                    </div>
                  </div>

                  <div className="rp-form-row">
                    <div className="rp-input-group">
                      <label>Hospital Name</label>
                      <input type="text" name="hospitalName" className="rp-input" required value={requestForm.hospitalName} onChange={handleRequestFormChange} placeholder="e.g. Aster Medcity" />
                    </div>
                    <div className="rp-input-group">
                      <label>Units Required</label>
                      <input type="number" name="unitsRequired" className="rp-input" min="1" required value={requestForm.unitsRequired} onChange={handleRequestFormChange} />
                    </div>
                  </div>

                  <div className="rp-input-group">
                    <label>Urgency Threshold Tier</label>
                    <select name="emergencyLevel" className="rp-input" value={requestForm.emergencyLevel} onChange={handleRequestFormChange}>
                      <option value="Normal">Normal Condition</option>
                      <option value="Urgent">Urgent Target</option>
                      <option value="Critical">🚨 CRITICAL IMPACT LEVEL</option>
                    </select>
                  </div>

                  <div className="rp-input-group">
                    <label>Additional Notes / Instructions</label>
                    <textarea name="additionalNotes" className="rp-input" style={{ minHeight: '80px', fontFamily: 'inherit' }} value={requestForm.additionalNotes} onChange={handleRequestFormChange} placeholder="Hospital room numbers, bystander descriptions, etc." />
                  </div>

                  <div className="rp-submit-btn-container">
                    <button type="submit" className="rp-submit-btn"><BiSend /> Broadcast Request</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PANEL 3: MY REQUESTS TRACKING TABLE */}
          {activeTab === 'patient-tracking' && (
            <div className="rp-panel">
              <h2>My Blood Requests Tracking Hub</h2>
              {patientRequests.length === 0 ? (
                <p className="rp-profile-details-read" style={{ fontStyle: 'italic' }}>No emergency requests have been raised yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {patientRequests.map((req) => (
                    <div key={req._id} className="rp-card" style={{ margin: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>Patient Name: {req.patientName} ({req.bloodGroup})</h4>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: '#5a626a' }}>Hospital: {req.hospitalName} | Location: {req.district}</p>
                        </div>
                        <span className={`rp-badge ${req.status === 'Searching' ? 'rp-badge-cooling' : 'rp-badge-eligible'}`} style={{ textTransform: 'uppercase' }}>
                          {req.status}
                        </span>
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <button type="button" className="rp-submit-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => fetchAcceptedDonors(req._id)}>
                          Check Responding Donors
                        </button>
                      </div>

                      {/* Expanding responsive contact panel tray */}
                      {trackingRequestId === req._id && (
                        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                          <h5 style={{ margin: '0 0 0.75rem 0', color: '#111827' }}>👥 Verified System Donors Who Accepted:</h5>
                          {selectedRequestDonors.length === 0 ? (
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#5a626a', fontStyle: 'italic' }}>No responses logged yet. Searching database loops...</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {selectedRequestDonors.map((donor) => (
                                <div key={donor._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                  <div>
                                    <p style={{ margin: '0 0 2px 0', fontWeight: '700', color: '#111827' }}>{donor.name}</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#5a626a' }}>Group: {donor.bloodGroup} | {donor.district}</p>
                                  </div>
                                  <a href={`tel:${donor.phone}`} className="rp-submit-btn" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: '#10b981' }}>
                                    <BiPhoneCall /> Call: {donor.phone}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PANEL 4: EMERGENCY ALERTS ALIGNED TO THE CARD STYLES */}
          {activeTab === 'donor-alerts' && (
            <div className="rp-panel">
              <h2>Active Emergency Blood Alerts</h2>
              {notifications.length === 0 ? (
                <div className="rp-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#4b5563' }}>🎉 Excellent. No active matching alert notices inside your district.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {notifications.map((notif) => {
                    const reqDetails = notif.requestId;
                    if (!reqDetails) return null;
                    return (
                      <div key={notif._id} className="rp-card" style={{ margin: 0, borderLeft: '5px solid #e60026' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <span className="rp-badge rp-badge-cooling" style={{ marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                              🚨 {reqDetails.emergencyLevel} Priority
                            </span>
                            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', color: '#111827' }}>
                              Blood Group Required: {reqDetails.bloodGroup}
                            </h3>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: '#374151' }}>
                          <p style={{ margin: 0 }}><strong>Hospital Name:</strong> {reqDetails.hospitalName}</p>
                          <p style={{ margin: 0 }}><strong>District Region:</strong> {reqDetails.district}</p>
                          <p style={{ margin: 0 }}><strong>Units Required:</strong> {reqDetails.unitsRequired} Bag(s)</p>
                          {reqDetails.additionalNotes && (
                            <p style={{ margin: 0, gridColumn: 'span 2', background: '#fff3cd', padding: '6px', borderRadius: '4px', color: '#856404', fontSize: '0.88rem' }}>
                              <strong>Notes:</strong> {reqDetails.additionalNotes}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button type="button" className="rp-submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleNotificationResponse(reqDetails._id, 'Accepted')}>
                            <BiCheck /> Accept Request
                          </button>
                          <button type="button" className="rp-submit-btn" style={{ background: '#e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleNotificationResponse(reqDetails._id, 'Rejected')}>
                            <BiX /> Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>

      </div>
      <Footer />
    </div>
  );
}

export default UserDashboard;