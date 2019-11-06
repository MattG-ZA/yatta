import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
  return (
    <div className='indicator-container'>
      <div className='ripple'>
        <div />
        <div />
      </div>
    </div>
  );
}

export default LoadingIndicator;