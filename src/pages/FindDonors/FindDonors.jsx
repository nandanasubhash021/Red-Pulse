import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';

function FindDonors() {
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [district, setDistrict] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      // Fetch matching data from Express backend server
      const response = await fetch(
        `https://red-pulse-ivory.vercel.app/api/auth/search?bloodGroup=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(district)}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setDonors(data);
      } else {
        alert('Failed to retrieve donor records.');
      }
    } catch (err) {
      console.error('Search error:', err);
      alert('Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#cc0000', textAlign: 'center', marginBottom: '30px' }}>Find Available Blood Donors</h2>
        
        {/* Search Controls Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Blood Group:</label>
            <select value={bloodGroup} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} onChange={e => setBloodGroup(e.target.value)}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>District / City:</label>
            <input type="text" placeholder="e.g. Central District" value={district} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setDistrict(e.target.value)} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '11px 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Search Registry
            </button>
          </div>
        </form>

        {/* Loading and Empty State handling */}
        {loading && <p style={{ textAlign: 'center' }}>Searching the blood registry datastore...</p>}

        {!loading && searched && donors.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No active donors found matching these filters.</p>
        )}

        {/* Donors Card Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {donors.map(donor => (
            <div key={donor._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', backgroundColor: '#fff' }}>
              <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#cc0000', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {donor.bloodGroup}
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{donor.name}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>📍 Location:</strong> {donor.address}, {donor.district}</p>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>📞 Contact:</strong> {donor.phone}</p>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>✉️ Email:</strong> {donor.email}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FindDonors;