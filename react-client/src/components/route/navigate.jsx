// src/components/NavigateBack.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigateBack = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    backgroundColor: '#ff5722',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
    hover: {
      backgroundColor: '#e64a19',
    },
  };

  return (
    <button
      style={buttonStyle}
      onClick={() => navigate(-1)}
      onMouseEnter={(e) => (e.target.style.backgroundColor = buttonStyle.hover.backgroundColor)}
      onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
    >
      Back
    </button>
  );
};

export default NavigateBack;
