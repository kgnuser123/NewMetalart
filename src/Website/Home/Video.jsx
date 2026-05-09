import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaTimes } from 'react-icons/fa';
import './Video.css';

const API_URL = 'http://localhost:5000/api/videos';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(API_URL);
        setVideos(res.data);
      } catch (err) {
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const openLightbox = (video) => {
    setSelectedVideo(video);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  if (loading) return <div className="video-loading"><div className="spinner"></div><p>Loading videos...</p></div>;
  if (error) return <div className="video-error"><p>{error}</p></div>;

  return (
    <div className="video-page">
      {/* Hero Section */}
      <section className="video-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <h1 className="hero-title">Our <span className="metallic">Video Gallery</span></h1>
          <p className="hero-subtitle">Watch our metal craftsmanship in action – from forging to finished masterpieces.</p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="video-grid-section">
        <div className="container">
          {videos.length === 0 ? (
            <p className="no-videos">No videos available at the moment.</p>
          ) : (
            <div className="videos-grid">
              {videos.map(video => (
                <div className="video-card" key={video._id}>
                  <div className="video-thumbnail" onClick={() => openLightbox(video)}>
                    <img
                      src={video.thumbnail || 'https://placehold.co/600x400/2c3e50/ffffff?text=No+Thumbnail'}
                      alt={video.title}
                      loading="lazy"
                    />
                    <div className="play-overlay">
                      <FaPlay className="play-icon" />
                    </div>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedVideo && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <FaTimes />
            </button>
            <div className="video-wrapper">
              {selectedVideo.videoPath ? (
                <video controls autoPlay>
                  <source src={`http://localhost:5000${selectedVideo.videoPath}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : selectedVideo.videoUrl ? (
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>No video available</p>
              )}
            </div>
            <div className="lightbox-info">
              <h3>{selectedVideo.title}</h3>
              <p>{selectedVideo.description}</p>
              {/* ADDED: secondary close button inside info panel */}
              <button className="lightbox-close-secondary" onClick={closeLightbox}>
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;