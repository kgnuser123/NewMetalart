// src/Website/TeamGallery/TeamGallery.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeamGallery.css';

const TeamGallery = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamImage();
  }, []);

  const fetchTeamImage = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/team-gallery');
      if (res.data && res.data.length > 0) {
        // Display the first uploaded image (or you can pick a specific one by ID)
        setImage(res.data[0].imageUrl);
      } else {
        setError('No team photo uploaded yet.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load team photo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="team-fullwidth-container">
        <div className="tf-loader">Loading team photo...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="team-fullwidth-container">
        <div className="tf-error">{error || 'No image available'}</div>
      </div>
    );
  }

  return (
    <div className="team-fullwidth-container">
      <div className="team-banner">
        <img src={image} alt="Our Team" className="team-fullwidth-img" />
        <div className="team-banner-overlay">
          <h1>Meet Our Team</h1>
        
        </div>
      </div>
    </div>
  );
};

export default TeamGallery;