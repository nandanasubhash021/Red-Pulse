import React, { useState } from 'react';
import axios from 'axios';

const FindBloodBanks = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    component: '',
    units: '',
    district: ''
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const componentsList = [
    { label: 'Whole Blood', value: 'wholeBlood' },
    { label: 'PRBC', value: 'prbc' },
    { label: 'Platelets', value: 'platelets' },
    { label: 'Plasma', value: 'plasma' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    // 1. CRITICAL: Prevents default form action from breaking the state
    e.preventDefault();
    if (!formData.bloodGroup || !formData.component || !formData.units || !formData.district) {
      alert("Please fill in all search parameters.");
      return;
    }

    setLoading(true);
    try {
      // 2. Clear previous data state to ensure clean renders
      setResults([]); 
      
      // 3. Note: Change https://red-pulse-87c8.vercel.app/ to match your actual Backend server port if different
      const response = await axios.get('https://red-pulse-beige.vercel.app/api/auth/search-blood-banks', { 
        params: formData 
      });
      
      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        setResults([]);
      }
      setSearched(true);
    } catch (err) {
      console.error("Search Error Breakdown:", err);
      alert(err.response?.data?.msg || 'Could not connect to the search endpoint. Please verify backend server status.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', fontFamily: 'inherit', minHeight: '80vh' },
    title: { color: '#dc3545', fontSize: '2.25rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' },
    searchPanel: { backgroundColor: '#f8f9fa', border: '1px solid #eef2f5', borderRadius: '12px', padding: '2rem', marginBottom: '3rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' },
    formGrid: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' },
    fieldGroup: { flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' },
    label: { fontWeight: '600', color: '#495057', fontSize: '0.95rem' },
    input: { padding: '0.65rem 0.75rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
    buttonContainer: { width: '100%', textAlign: 'right', marginTop: '1.5rem' },
    button: { padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: '600', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    resultsTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#495057', marginBottom: '1.5rem', textAlign: 'left', borderBottom: '2px solid #eef2f5', paddingBottom: '0.5rem' },
    grid: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
    card: { backgroundColor: '#fff', border: '1px solid #eef2f5', borderLeft: '5px solid #dc3545', borderRadius: '10px', padding: '1.5rem', width: 'calc(50% - 0.75rem)', minWidth: '300px', boxSizing: 'border-box', textAlign: 'left' },
    cardHeader: { fontSize: '1.3rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' },
    license: { fontSize: '0.85rem', color: '#6c757d', marginBottom: '1rem' },
    infoText: { margin: '0 0 0.5rem 0', color: '#495057', fontSize: '0.95rem' },
    badge: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: '700', textAlign: 'center', marginTop: '1rem' },
    alert: { backgroundColor: '#fff3cd', color: '#856404', padding: '1.25rem', borderRadius: '8px', border: '1px solid #ffeeba', textAlign: 'center', width: '100%' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search Blood Banks</h2>
      
      <div style={styles.searchPanel}>
        <form onSubmit={handleSearch}>
          <div style={styles.formGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Blood Group</label>
              <select name="bloodGroup" style={styles.input} value={formData.bloodGroup} onChange={handleInputChange} required>
                <option value="">Select Blood Group</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Component Category</label>
              <select name="component" style={styles.input} value={formData.component} onChange={handleInputChange} required>
                <option value="">Select Component</option>
                {componentsList.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Units Needed</label>
              <input type="number" min="1" name="units" style={styles.input} placeholder="Quantity" value={formData.units} onChange={handleInputChange} required />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>District / City</label>
              <input type="text" name="district" style={styles.input} placeholder="e.g. Ernakulam" value={formData.district} onChange={handleInputChange} required />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Searching...' : 'Search Blood Banks'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h4 style={styles.resultsTitle}>Search Results:</h4>
        {results.length > 0 ? (
          <div style={styles.grid}>
            {results.map((bank) => (
              <div style={styles.card} key={bank._id}>
                <div style={styles.cardHeader}>{bank.name}</div>
                <div style={styles.license}>License Number: {bank.licenseNumber || 'N/A'}</div>
                <hr style={{ border: '0', borderTop: '1px solid #eef2f5', margin: '1rem 0' }} />
                <p style={styles.infoText}><strong>Contact Person:</strong> {bank.contactPersonName || 'N/A'} ({bank.contactPersonNumber || 'N/A'})</p>
                <p style={styles.infoText}><strong>Phone Number:</strong> {bank.phone}</p>
                <p style={styles.infoText}><strong>Email:</strong> {bank.email}</p>
                <p style={styles.infoText}><strong>District:</strong> {bank.district} | <strong>City:</strong> {bank.city || 'N/A'}</p>
                <p style={styles.infoText}><strong>Address:</strong> {bank.address}</p>
                <p style={styles.infoText}><strong>Operating Hours:</strong> {bank.operatingHours || 'N/A'}</p>
                <div style={styles.badge}>
                  Available Balance: {bank.inventory?.[formData.bloodGroup]?.[formData.component] || 0} Units
                </div>
              </div>
            ))}
          </div>
        ) : (
          searched && !loading && (
            <div style={styles.alert}>
              No blood banks found matching your requirements.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FindBloodBanks;