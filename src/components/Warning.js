import React from 'react';

const styles = {
  warning: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'JetBrains Mono',
    backgroundColor: 'black',
    zIndex: 1000
  },
  text: {
    color: 'white',
    fontSize: '16px',
    marginBottom: '20px'
  },
  button: {
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export const Warning = ({ onAccept }) => {
  return (
    <div style={styles.warning}>
      <div style={styles.text}>
        Photosensitivity Warning
      </div>
      <div style={styles.text}>
        This site contains flashing elements
      </div>
      <div 
        style={styles.button}
        onMouseEnter={e => e.target.style.color = '#00ffff'}
        onMouseLeave={e => e.target.style.color = 'white'}
        onClick={onAccept}
      >
        {'['} GOT IT {']'}
      </div>
    </div>
  );
};