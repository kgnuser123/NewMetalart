import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {


  return (
    <div className="nma-404-container">
      <div className="nma-404-content">
        {/* Large Metallic 404 */}
        <div className="nma-404-number">
          <span className="digit">4</span>
          <span className="digit zero">0</span>
          <span className="digit">4</span>
          <div className="metal-scrap"></div>
        </div>

        <div className="nma-404-text-section">
          <h1 className="nma-404-title">STRUCTURE NOT FOUND</h1>
          <p className="nma-404-desc">
            The page you are looking for has been moved, removed, or never existed in our workshop.
          </p>
          
          <button className="back-home-btn" onClick={() => navigate('/')}>
            BACK TO HOME
          </button>
        </div>

        <div className="nma-404-footer">
          PRECISION • RELIABILITY • FINISHING
        </div>
      </div>
    </div>
  );
};

export default NotFound;