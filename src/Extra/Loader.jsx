import React from 'react';
import './PremiumLoader.css';

const Loader = ({ message = "INITIALIZING SYSTEM" }) => {
  return (
    <div className="nma-loader-overlay">
      <div className="nma-loader-content">
        {/* Minimal Circle Animation */}
        <div className="nma-loading-orbit">
          <div className="orbit-dot"></div>
          <div className="orbit-ring"></div>
        </div>

        {/* Text Branding */}
        <div className="nma-loader-info">
          <h2 className="nma-loader-logo">NEW METAL ART</h2>
          <div className="nma-progress-bar">
            <div className="nma-progress-fill"></div>
          </div>
          <p className="nma-loader-text">{message}</p>
        </div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="nma-loader-bg-text">NMA</div>
    </div>
  );
};

export default Loader;