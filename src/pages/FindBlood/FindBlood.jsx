import React from 'react';
import { useNavigate } from 'react-router-dom';

const FindBlood = () => {
  const navigate = useNavigate();

  // Pure custom inline styling layout system
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '4rem 2rem',
      fontFamily: 'inherit',
      textAlign: 'center',
      minHeight: '75vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerSection: {
      marginBottom: '3rem'
    },
    title: {
      color: '#dc3545',
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#666',
      fontSize: '1.1rem'
    },
    cardsWrapper: {
      display: 'flex',
      gap: '2.5rem',
      justifyContent: 'center',
      alignItems: 'stretch',
      flexWrap: 'wrap',
      width: '100%'
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #eef2f5',
      borderRadius: '16px',
      padding: '2.5rem',
      flex: '1',
      minWidth: '280px',
      maxWidth: '450px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    },
    cardContent: {
      width: '100%',
      marginBottom: '2rem'
    },
    cardTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '1rem'
    },
    cardText: {
      fontSize: '1rem',
      color: '#718096',
      lineHeight: '1.6',
      margin: '0'
    },
    button: {
      padding: '0.85rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      transition: 'background-color 0.2s ease',
      color: '#fff'
    },
    donorBtn: {
      backgroundColor: '#dc3545'
    },
    bankBtn: {
      backgroundColor: '#dc3545' // Kept matching theme color red
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={styles.title}>Find Blood Resources</h2>
        <p style={styles.subtitle}>Choose your search channel to find available blood resources.</p>
      </div>

      <div style={styles.cardsWrapper}>
        {/* Card 1: Find Individual Donors */}
        <div 
          style={styles.card} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Find Donors</h3>
            <p style={styles.cardText}>
              Search available blood donors by blood group and location.
            </p>
          </div>
          <button 
            style={{...styles.button, ...styles.donorBtn}}
            onClick={() => navigate('/find-donors')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bd2130'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            Find Donors
          </button>
        </div>

        {/* Card 2: Find Blood Banks */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Find Blood Banks</h3>
            <p style={styles.cardText}>
              Search registered blood banks based on blood component availability.
            </p>
          </div>
          <button 
            style={{...styles.button, ...styles.bankBtn}}
            onClick={() => navigate('/find-blood-banks')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bd2130'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            Find Blood Banks
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindBlood;