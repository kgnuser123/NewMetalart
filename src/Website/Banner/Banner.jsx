import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Banner.css';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch banners – wrapped in useCallback so we can reuse it
  const fetchBanners = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/banner');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setBanners(res.data);
        // If current index is out of bounds after update, reset to 0
        setCurrentIndex(prev => (prev >= res.data.length ? 0 : prev));
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling every 30 seconds to reflect admin changes
  useEffect(() => {
    fetchBanners();
    const interval = setInterval(() => {
      fetchBanners();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchBanners]);

  // Auto-slide carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [banners.length]);

  // Manual refresh button handler
  const handleRefresh = () => {
    setLoading(true);
    fetchBanners();
  };

  if (loading && banners.length === 0) {
    return (
      <div className="banner-skeleton">
        <div className="skeleton-content">
          <div className="skeleton-line title"></div>
          <div className="skeleton-line text"></div>
          <div className="skeleton-line btn"></div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  // Safe image URL: if image starts with http, use as is; otherwise prepend base URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/1920x1080';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath}`;
  };
  const bgImage = getImageUrl(currentBanner.image);

  return (
    <section className="hero-banner-container">
      {/* Optional refresh button (top right) */}
      <button 
        onClick={handleRefresh} 
        className="banner-refresh-btn"
        title="Refresh banners"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          color: 'white',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer'
        }}
      >
        ↻ Refresh
      </button>

      <div 
        key={currentBanner._id} 
        className="hero-banner fade-in"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})` }}
      >
        <div className="container">
          <div className="banner-content">
            {currentBanner.accentText && (
              <span className="accent-text slide-up">{currentBanner.accentText}</span>
            )}
            <h1 className="main-heading slide-up-delayed">{currentBanner.mainHeading}</h1>
            <p className="subtitle slide-up-more-delayed">{currentBanner.subtitle}</p>
            
            {currentBanner.ctaLabel && (
              <a href={currentBanner.ctaLink || '#'} className="cta-button slide-up-button">
                {currentBanner.ctaLabel} <span className="arrow">→</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className="banner-dots">
          {banners.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
};

export default Banner;