import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './BloodBankDashboard.css'; // Binds dashboard-specific layout styles

function BloodBankDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [bbData, setBbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [selectedComponent, setSelectedComponent] = useState('wholeBlood');
  const [unitsDelta, setUnitsDelta] = useState(0);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('bb_token');
    if (!token) return navigate('/blood-bank/login'); 
    
    try {
      const res = await fetch('https://red-pulse-beige.vercel.app/api/auth/bloodbank/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBbData(data.bloodBank);
        setProfileForm(data.bloodBank);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed synchronizing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bb_token');
    navigate('/blood-bank/login'); 
  };

  const handleUpdateInventory = async (action) => {
    const token = localStorage.getItem('bb_token');
    try {
      // 🌟 FIXED: Target updated to match centralized /api/auth pathing routing framework
      const res = await fetch('https://red-pulse-beige.vercel.app/api/auth/bloodbank/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bloodGroup: selectedGroup, component: selectedComponent, units: Number(unitsDelta), action })
      });
      const data = await res.json();
      if (res.ok) {
        setBbData(data.bloodBank);
        setMessage({ type: 'success', text: 'Inventory records successfully updated.' });
      } else {
        setMessage({ type: 'error', text: data.msg });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error executing transaction payload.' });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('bb_token');
    try {
      // 🌟 FIXED: Target updated to point cleanly through the /api/auth centralized proxy handler route
      const res = await fetch('https://red-pulse-beige.vercel.app/api/auth/bloodbank/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (res.ok) {
        setBbData(data.bloodBank);
        setMessage({ type: 'success', text: 'Profile operational records updated.' });
      } else {
        setMessage({ type: 'error', text: data.msg });
      }
    } catch {
      setMessage({ type: 'error', text: 'Profile optimization error.' });
    }
  };

  const countTotals = () => {
    if (!bbData || !bbData.inventory) return { groups: 0, totalUnits: 0 };
    let groupsWithStock = 0;
    let totalUnits = 0;
    Object.keys(bbData.inventory).forEach(group => {
      let groupHasStock = false;
      Object.values(bbData.inventory[group]).forEach(units => {
        if (units > 0) {
          groupHasStock = true;
          totalUnits += units;
        }
      });
      if (groupHasStock) groupsWithStock++;
    });
    return { groups: groupsWithStock, totalUnits };
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: '#4b5563' }}>
      <p>Synchronizing Medical Center Dashboard Profiles...</p>
    </div>
  );

  const stats = countTotals();

  return (
    <div className="rp-page-wrapper">
      <Navbar />
      <div style={{ display: 'flex', flex: 1, maxWidth: '1200px', width: '100%', margin: '2rem auto', gap: '2rem', padding: '0 1rem', flexWrap: 'wrap' }}>
        
        {/* SIDEBAR VIEW SELECTOR */}
        <aside style={{ width: '250px', flexShrink: 0, padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
          <div style={{ paddingBottom: '1rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{bbData?.name}</h3>
            <span style={{ color: '#e60026', fontSize: '0.85rem', fontWeight: 'bold' }}>Authorized System Bank</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="rp-submit-btn" style={{ backgroundColor: activeTab === 'home' ? '#e60026' : '#f3f4f6', color: activeTab === 'home' ? '#fff' : '#1f2937', textAlign: 'left', padding: '12px' }} onClick={() => { setActiveTab('home'); setMessage({type:'',text:''}); }}>Dashboard</button>
            <button className="rp-submit-btn" style={{ backgroundColor: activeTab === 'inventory' ? '#e60026' : '#f3f4f6', color: activeTab === 'inventory' ? '#fff' : '#1f2937', textAlign: 'left', padding: '12px' }} onClick={() => { setActiveTab('inventory'); setMessage({type:'',text:''}); }}>Blood Inventory</button>
            <button className="rp-submit-btn" style={{ backgroundColor: activeTab === 'profile' ? '#e60026' : '#f3f4f6', color: activeTab === 'profile' ? '#fff' : '#1f2937', textAlign: 'left', padding: '12px' }} onClick={() => { setActiveTab('profile'); setMessage({type:'',text:''}); }}>Profile</button>
            <button className="rp-submit-btn" style={{ backgroundColor: '#1f2937', marginTop: '2rem', padding: '12px' }} onClick={handleLogout}>Logout</button>
          </div>
        </aside>

        {/* WORKSPACE APP PANELS */}
        <main style={{ flex: 1, minWidth: '300px' }}>
          {message.text && <div className={`rp-alert-banner ${message.type === 'success' ? 'rp-alert-success' : 'rp-alert-error'}`} style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>{message.text}</div>}
          
          {/* TAB 1: SUMMARY HUB HOUSING METRICS */}
          {activeTab === 'home' && (
            <div className="rp-card" style={{ margin: 0 }}>
              <h2 style={{ margin: 0 }}>Welcome {bbData?.name || 'Blood Bank'}</h2>
              <p style={{ color: '#6b7280', margin: '4px 0 2rem 0' }}>License Key Authority: <strong>{bbData?.licenseNumber}</strong></p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.25rem', color: '#e60026', margin: '0 0 0.5rem 0' }}>{stats.groups} / 8</h3>
                  <p style={{ color: '#4b5563', margin: 0, fontWeight: '600' }}>Total Blood Groups Available</p>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.25rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>{stats.totalUnits}</h3>
                  <p style={{ color: '#4b5563', margin: 0, fontWeight: '600' }}>Total Components Available</p>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
                  <h4 style={{ color: '#4b5563', margin: '0 0 0.75rem 0' }}>Operational Hours</h4>
                  <p style={{ color: '#1f2937', fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>{bbData?.operatingHours || '24/7 Availability'}</p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ marginTop: 0, color: '#1f2937' }}>Registered Facility Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.95rem', marginTop: '1rem' }}>
                  <div><strong>Contact Person:</strong> {bbData?.contactPersonName}</div>
                  <div><strong>Contact Number:</strong> {bbData?.contactPersonNumber}</div>
                  <div><strong>Official Phone:</strong> {bbData?.phone}</div>
                  <div><strong>Official Email:</strong> {bbData?.email}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Physical Location:</strong> {bbData?.address}, {bbData?.city}, {bbData?.district}, {bbData?.state} - {bbData?.pincode}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY MANAGEMENT LEDGER SHEET */}
          {activeTab === 'inventory' && (
            <div className="rp-card" style={{ margin: 0 }}>
              <h2 style={{ margin: '0 0 1.5rem 0' }}>Blood Inventory</h2>
              
              <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Maintain Inventory Resource Units</h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
                  <div className="rp-input-group" style={{ flex: '1 1 150px' }}>
                    <label>Blood Group</label>
                    <select className="rp-input" style={{ width: '100%', padding: '10px' }} value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="rp-input-group" style={{ flex: '1 1 180px' }}>
                    <label>Component Category</label>
                    <select className="rp-input" style={{ width: '100%', padding: '10px' }} value={selectedComponent} onChange={(e) => setSelectedComponent(e.target.value)}>
                      <option value="wholeBlood">Whole Blood</option>
                      <option value="prbc">PRBC</option>
                      <option value="platelets">Platelets</option>
                      <option value="plasma">Plasma</option>
                    </select>
                  </div>
                  <div className="rp-input-group" style={{ flex: '1 1 120px' }}>
                    <label>Units Amount</label>
                    <input type="number" className="rp-input" style={{ width: '100%', padding: '8px' }} min="0" value={unitsDelta} onChange={(e) => setUnitsDelta(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="rp-submit-btn" style={{ padding: '10px 20px' }} onClick={() => handleUpdateInventory('add')}>Add / Update</button>
                    <button className="rp-submit-btn" style={{ padding: '10px 20px', backgroundColor: '#1f2937' }} onClick={() => handleUpdateInventory('remove')}>Delete</button>
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto', marginTop: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px 16px' }}>Blood Group</th>
                      <th style={{ padding: '12px 16px' }}>Whole Blood</th>
                      <th style={{ padding: '12px 16px' }}>PRBC</th>
                      <th style={{ padding: '12px 16px' }}>Platelets</th>
                      <th style={{ padding: '12px 16px' }}>Plasma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(bbData?.inventory || {}).map((group) => (
                      <tr key={group} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: '#e60026' }}>{group}</td>
                        <td style={{ padding: '12px 16px' }}>{bbData.inventory[group].wholeBlood || 0} Units</td>
                        <td style={{ padding: '12px 16px' }}>{bbData.inventory[group].prbc || 0} Units</td>
                        <td style={{ padding: '12px 16px' }}>{bbData.inventory[group].platelets || 0} Units</td>
                        <td style={{ padding: '12px 16px' }}>{bbData.inventory[group].plasma || 0} Units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT PROFILE MANAGEMENT EDITOR */}
          {activeTab === 'profile' && (
            <div className="rp-card" style={{ margin: 0 }}>
              <h2>Profile Editing Panel</h2>
              <form onSubmit={handleUpdateProfile} style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Blood Bank Name</label><input type="text" className="rp-input" value={profileForm.name || ''} onChange={(e)=>setProfileForm({...profileForm, name: e.target.value})} required/></div>
                  <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Operating Hours</label><input type="text" className="rp-input" value={profileForm.operatingHours || ''} onChange={(e)=>setProfileForm({...profileForm, operatingHours: e.target.value})} required/></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Contact Person</label><input type="text" className="rp-input" value={profileForm.contactPersonName || ''} onChange={(e)=>setProfileForm({...profileForm, contactPersonName: e.target.value})} required/></div>
                  <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Phone Number</label><input type="text" className="rp-input" value={profileForm.contactPersonNumber || ''} onChange={(e)=>setProfileForm({...profileForm, contactPersonNumber: e.target.value})} required/></div>
                </div>
                <div className="rp-input-group" style={{ marginTop: '1rem' }}><label>Address Location</label><input type="text" className="rp-input" value={profileForm.address || ''} onChange={(e)=>setProfileForm({...profileForm, address: e.target.value})} required/></div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Email Link Address</label><input type="email" className="rp-input" value={profileForm.email || ''} disabled style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}/></div>
                  <div className="rp-input-group" style={{ flex: '1 1 45%' }}><label>Change Password Securing Phrase</label><input type="password" className="rp-input" placeholder="Leave blank to hold current" onChange={(e)=>setProfileForm({...profileForm, password: e.target.value})}/></div>
                </div>
                <div className="rp-submit-btn-container" style={{ marginTop: '2rem' }}><button type="submit" className="rp-submit-btn">Save Profile Changes</button></div>
              </form>
            </div>
          )}

        </main>
      </div>
      <Footer />
    </div>
  );
}

export default BloodBankDashboard;