import React from 'react';

const AcrylicContainer = () => {
  const bannerStyle = {
    position: 'fixed',
    bottom: '30%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(8px)',
    padding: '10px 30px',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    color: '#333',
    fontFamily: 'Space Grotesk',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    zIndex: 1000,
    textAlign: 'center',
    userSelect: 'none',
  };

  return (
    <div style={bannerStyle}>
      work in progress
    </div>
  );
};

export default AcrylicContainer; 