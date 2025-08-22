import React from 'react';

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: { width: '50px' },
    medium: { width: '100px' },
    large: { width: '150px' }
  };

  return (
    <img
      src="/assets/images/vrs-logo.png"
      alt="VRS Logo"
      style={{ ...sizes[size], height: 'auto' }}
    />
  );
};

export default Logo;