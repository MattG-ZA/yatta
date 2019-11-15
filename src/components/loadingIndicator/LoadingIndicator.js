import React from 'react';
import './LoadingIndicator.css';

class LoadingIndicator extends React.Component {
  render() {
    const { loadingBatch } = this.props;

    const containerClass = loadingBatch ? 'batch-indicator-container' : 'indicator-container';

    return (
      <div className={containerClass}>
        <div className='ripple'>
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default LoadingIndicator;