import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiCheck, BiX, BiPhoneCall, BiEnvelope, BiBuilding, BiMap, BiLayer } from 'react-icons/bi';
import Header from './Header';
import Footer from './Footer';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('request');
  const [notifications, setNotifications] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequestDonors, setSelectedRequestDonors] = useState([]);
  const [activeTrackingId, setActiveTrackingId] = useState(null);
  const [loadingDonors, setLoadingDonors] = useState(false);

  // States for Popup Window Overlay Modal
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  // Request Form state binder fields
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unitsRequired: '',
    emergencyLevel: 'Normal',
    hospitalName: '',
    district: '',
    additionalNotes: ''
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchMyRequests();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('https://red-pulse-beige.vercel.app/api/requests/notifications', config);
      if (res.data.success) setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed loading notifications list:", err);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get('https://red-pulse-beige.vercel.app/api/requests/active', config);
      if (res.data.success) setMyRequests(res.data.requests);
    } catch (err) {
      console.error("Error getting personal tracking logs:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://red-pulse-beige.vercel.app/api/requests/create', formData, config);
      if (res.data.success) {
        alert("Emergency blood request broadcasted successfully!");
        setFormData({ bloodGroup: '', unitsRequired: '', emergencyLevel: 'Normal', hospitalName: '', district: '', additionalNotes: '' });
        fetchMyRequests();
        setActiveTab('track');
      }
    } catch (err) {
      alert("Failed submitting broadcast information data.");
    }
  };

  const handleNotificationResponse = async (requestId, actionState) => {
    try {
      const res = await axios.post('https://red-pulse-beige.vercel.app/api/requests/respond', { 
        requestId: requestId, 
        action: actionState 
      }, config);
      
      if (res.data.success) {
        // Clear matching alert notice array locally instantly
        setNotifications(notifications.filter(n => n.requestId && n.requestId._id !== requestId));
        
        // Launch dynamic patient summary pop up overlay if acceptor target matches
        if (actionState === 'Accepted' && res.data.patientDetails) {
          setPopupData(res.data.patientDetails);
          setShowPopup(true);
        } else {
          alert(`Alert processed successfully as: ${actionState}`);
        }
      }
    } catch (err) {
      console.error("Action pipeline tracking breakdown:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Could not save requested action properties maps.");
    }
  };

  const fetchAcceptedDonors = async (requestId) => {
    setLoadingDonors(true);
    setActiveTrackingId(requestId);
    try {
      const res = await axios.get(`https://red-pulse-beige.vercel.app/api/requests/accepted-donors/${requestId}`, config);
      if (res.data.success) {
        setSelectedRequestDonors(res.data.donors);
      }
    } catch (err) {
      console.error("Failed pulling responders:", err);
    } finally {
      setLoadingDonors(false);
    }
  };

  return (
    <div className="rp-dashboard-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9fafb', position: 'relative' }}>
      <Header />
      
      <div style={{ flex: '1', display: 'flex', width: '100%', maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', gap: '2rem' }}>
        
        {/* Navigation Controls Menu */}
        <aside style={{ width: '250px', background: '#ffffff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#374151', margin: '0 0 1rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Dashboard Control</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => setActiveTab('request')} style={{ width: '100%', textAlign: 'left', padding: '0.75rem', borderRadius: '6px', border: 'none', background: activeTab === 'request' ? '#fee2e2' : 'transparent', color: activeTab === 'request' ? '#dc2626' : '#4b5563', cursor: 'pointer', fontWeight: '500' }}>
              Broadcast Request
            </button>
            <button onClick={() => setActiveTab('track')} style={{ width: '100%', textAlign: 'left', padding: '0.75rem', borderRadius: '6px', border: 'none', background: activeTab === 'track' ? '#fee2e2' : 'transparent', color: activeTab === 'track' ? '#dc2626' : '#4b5563', cursor: 'pointer', fontWeight: '500' }}>
              Track Live Activities
            </button>
            <button onClick={() => setActiveTab('alerts')} style={{ width: '100%', textAlign: 'left', padding: '0.75rem', borderRadius: '6px', border: 'none', background: activeTab === 'alerts' ? '#fee2e2' : 'transparent', color: activeTab === 'alerts' ? '#dc2626' : '#4b5563', cursor: 'pointer', fontWeight: '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Emergency Alerts
              {notifications.length > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '10px' }}>{notifications.length}</span>}
            </button>
          </nav>
        </aside>

        {/* Dynamic Display Panels Terminal Content Workspace */}
        <main style={{ flex: 1, background: '#ffffff', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          
          {/* TAB 1: FORM TRANSMISSION */}
          {activeTab === 'request' && (
            <div>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.5rem' }}>Broadcast Emergency Blood Request</h2>
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} required style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                      <option value="">Select Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Units Required (Bags)</label>
                    <input type="number" name="unitsRequired" min="1" value={formData.unitsRequired} onChange={handleInputChange} required style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Hospital Name</label>
                    <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleInputChange} required placeholder="e.g. City Medical Center" style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>District Region</label>
                    <input type="text" name="district" value={formData.district} onChange={handleInputChange} required placeholder="e.g. Ernakulam" style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Emergency Urgency Level</label>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['Normal', 'Urgent', 'Critical'].map(level => (
                      <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input type="radio" name="emergencyLevel" value={level} checked={formData.emergencyLevel === level} onChange={handleInputChange} />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Additional Notes / Location Directions</label>
                  <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} rows="3" placeholder="Point of contact numbers or ward numbers info..." style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }}></textarea>
                </div>

                <button type="submit" style={{ background: '#dc2626', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                  Broadcast Request Now
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: REQUESTERS OPERATIONS PANELS (DISPLAYS ACCEPTER CORES ACCURATELY) */}
          {activeTab === 'track' && (
            <div>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.5rem' }}>Track Active Broadcast Logs</h2>
              {myRequests.length === 0 ? (
                <p style={{ color: '#6b7280' }}>You have not broadcasted any emergency blood requests yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {myRequests.map(req => (
                    <div key={req._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', background: '#fcfcfc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ background: req.emergencyLevel === 'Critical' ? '#fee2e2' : '#fff3cd', color: req.emergencyLevel === 'Critical' ? '#991b1b' : '#856404', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                            {req.emergencyLevel} Priority
                          </span>
                          <h3 style={{ margin: '6px 0 2px 0', fontSize: '1.2rem', color: '#111827' }}>Required Group: {req.bloodGroup}</h3>
                        </div>
                        <button type="button" onClick={() => fetchAcceptedDonors(req._id)} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500' }}>
                          Check Responding Donors
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: '#4b5563' }}>
                        <p style={{ margin: 0 }}><BiBuilding style={{ verticalAlign: 'middle', marginRight: '4px' }} /> <strong>Hospital:</strong> {req.hospitalName}</p>
                        <p style={{ margin: 0 }}><BiMap style={{ verticalAlign: 'middle', marginRight: '4px' }} /> <strong>District:</strong> {req.district}</p>
                        <p style={{ margin: 0 }}><BiLayer style={{ verticalAlign: 'middle', marginRight: '4px' }} /> <strong>Requested Quantity:</strong> {req.unitsRequired} Unit(s)</p>
                      </div>

                      {/* Expanding Responding Subpanel Area */}
                      {activeTrackingId === req._id && (
                        <div style={{ marginTop: '1.25rem', borderTop: '1px dashed #d1d5db', paddingTop: '1rem' }}>
                          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>Responding Volunteer Channels:</h4>
                          {loadingDonors ? (
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Extracting data structures...</p>
                          ) : selectedRequestDonors.length === 0 ? (
                            <p style={{ color: '#dc2626', fontSize: '0.9rem', margin: 0 }}>No volunteers have accepted this request track yet.</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {selectedRequestDonors.map(donor => (
                                <div key={donor._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                  <div>
                                    <p style={{ margin: 0, fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>{donor.name} (Blood Group: {donor.bloodGroup || 'O+'})</p>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}><BiEnvelope style={{ marginRight: '2px' }} /> {donor.email} | Location: {donor.district || 'Anywhere'}</p>
                                  </div>
                                  <a href={`tel:${donor.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#fff', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.88rem', boxShadow: '0 1px 3px rgba(16,185,129,0.3)' }}>
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

          {/* TAB 3: DONOR EMERGENCY MATCH ALERTS PANELS */}
          {activeTab === 'alerts' && (
            <div>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.5rem' }}>Emergency Match Alerts</h2>
              {notifications.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No active emergency alerts match your profile configuration currently.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {notifications.map(notif => {
                    const reqDetails = notif.requestId;
                    if (!reqDetails) return null;
                    return (
                      <div key={notif._id} style={{ border: '2px solid #ef4444', borderRadius: '8px', padding: '1.25rem', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div>
                            <span style={{ marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.7rem', background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold' }}>
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
                          <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#10b981', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => handleNotificationResponse(reqDetails._id, 'Accepted')}>
                            <BiCheck size="18" /> Accept Request
                          </button>
                          <button type="button" style={{ background: '#e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => handleNotificationResponse(reqDetails._id, 'Rejected')}>
                            <BiX size="18" /> Decline
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

      {/* POPUP OVERLAY MODAL WINDOW CONTAINER */}
      {showPopup && popupData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', borderTop: '6px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '1.3rem', fontWeight: '700' }}>🎉 Request Accepted!</h3>
              <button type="button" onClick={() => setShowPopup(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af' }}><BiX size="24" /></button>
            </div>
            
            <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Thank you for volunteering! Please contact the patient or hospital representative immediately using the verified credentials below:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f9fafb', padding: '1.25rem', borderRadius: '8px', border: '1px solid #f3f4f6', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151' }}><strong>Patient Name:</strong> {popupData.patientName}</p>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151' }}><strong>Blood Group:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{popupData.bloodGroup}</span></p>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151' }}><strong>Units Needed:</strong> {popupData.unitsNeeded} Bag(s)</p>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151' }}><strong>Hospital Name:</strong> {popupData.hospitalName}</p>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151' }}><strong>Contact Number:</strong> <span style={{ color: '#2563eb', fontWeight: '600' }}>{popupData.contactNumber}</span></p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href={`tel:${popupData.contactNumber}`} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', background: '#10b981', color: '#fff', padding: '0.75rem', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', textAlign: 'center' }}>
                <BiPhoneCall /> Call Patient Now
              </a>
              <button type="button" onClick={() => setShowPopup(false)} style={{ flex: 1, background: '#4b5563', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default UserDashboard;