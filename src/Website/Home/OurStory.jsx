import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OurStory.css';

const OurStory = () => {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/about');
        setStoryData(res.data.story);
      } catch (err) {
        console.error('Error fetching story data:', err);
        setError('Failed to load story content.');
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, []);

  if (loading) {
    return (
      <section className="our-story-section loading">
        <div className="story-container">
          <div className="loading-spinner"></div>
          <p>Loading our story...</p>
        </div>
      </section>
    );
  }

  if (error || !storyData) {
    return (
      <section className="our-story-section error">
        <div className="story-container">
          <p>{error || 'Story content not available.'}</p>
        </div>
      </section>
    );
  }

  const { content, image } = storyData;
  const paragraphs = content ? content.split('\n\n') : [];

  return (
    <section className="our-story-section">
      <div className="story-container">
        <div className="story-grid">
          {/* Image Column (LEFT) */}
          <div className="story-image">
            <div className="image-frame">
              <img 
                src={image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'} 
                alt="New Metal Art Workshop" 
                loading="lazy"
              />
              <div className="image-border-animation"></div>
            </div>
          </div>

          {/* Text Column (RIGHT) */}
          <div className="story-text">
            <h2 className="story-heading">
              Our <span className="gold-text">Story</span>
            </h2>
            <div className="heading-underline"></div>
            <div className="story-content">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para.trim()}</p>
              ))}
            </div>
            <div className="story-badge">
              <span>25+ Years of Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;