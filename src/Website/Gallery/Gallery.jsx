import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaExpand, FaImage } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import './GalleryFile.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/gallery');
        setImages(res.data);
      } catch (err) {
        setError('Failed to load gallery images.');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // SEO values (dynamic based on number of images)
  const pageTitle = "Project Showcase | New Metal Art Gallery";
  const imageCount = images.length;
  const metaDescription = `Explore our portfolio of ${imageCount} premium metal art projects. See industrial and architectural masterpieces crafted by New Metal Art.`;
  const metaKeywords = "metal art gallery, project showcase, metal sculpture gallery, industrial art, architectural metalwork, New Metal Art portfolio";
  const canonicalUrl = "https://newmetalart.com/gallery";
  const ogImage = images.length > 0 ? images[0].img : "https://newmetalart.com/images/gallery-og.jpg";

  if (loading) return (
    <div className="gallery-loader-container">
      <Helmet>
        <title>Loading Gallery | New Metal Art</title>
      </Helmet>
      <div className="industrial-spinner"></div>
      <p>Loading Artistry...</p>
    </div>
  );

  if (error) return (
    <>
      <Helmet>
        <title>Gallery Error | New Metal Art</title>
      </Helmet>
      <div className="error-message-pro">{error}</div>
    </>
  );

  return (
    <>
      <Helmet>
        {/* Basic meta tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="New Metal Art" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="New Metal Art" />
      </Helmet>

      <div className="gallery-page-premium">
        {/* Hero Section */}
        <section className="gallery-hero-visual">
          <div className="hero-mesh-overlay"></div>
          <div className="hero-border-frame"></div>
          <div className="container hero-content-pro">
            <span className="hero-pre-title">Masterpieces in Metal</span>
            <h1 className="hero-title-main">
              Project <span className="metallic-gradient">Showcase</span>
            </h1>
            <div className="luxury-separator">
              <span className="line"></span>
              <span className="diamond"></span>
              <span className="line"></span>
            </div>
            <p className="hero-subtitle-clean">
              A visual journey through our finest <strong>industrial</strong> and <strong>architectural</strong> achievements.
            </p>
            <div className="hero-scroll-indicator">
              <div className="mouse">
                <div className="wheel"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid – 4 Columns, Centered */}
        <section className="gallery-grid-section">
          <div className="container">
            {images.length === 0 ? (
              <div className="no-images-pro">
                <FaImage className="empty-icon" />
                <p>No gallery images available yet.</p>
              </div>
            ) : (
              <div className="grid-pro-layout">
                {images.map(image => (
                  <div className="gallery-item-pro" key={image._id} onClick={() => openLightbox(image)}>
                    <div className="image-card-inner">
                      <div className="image-wrapper">
                        <img src={image.img} alt={image.title} loading="lazy" />
                        <div className="image-overlay-pro">
                          <div className="expand-circle">
                            <FaExpand />
                          </div>
                          <span className="view-text">Enlarge View</span>
                        </div>
                      </div>
                      <div className="image-info-pro">
                        <h3>{image.title}</h3>
                        <div className="info-line"></div>
                      </div>
                    </div>
                    <div className="corner-accent-line"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        {lightboxOpen && selectedImage && (
          <div className="lightbox-overlay-pro" onClick={closeLightbox}>
            <div className="lightbox-content-pro" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close-btn" onClick={closeLightbox}>
                <FaTimes />
              </button>
              <div className="lightbox-img-container">
                <img src={selectedImage.img} alt={selectedImage.title} />
              </div>
              <div className="lightbox-caption-pro">
                <h3>{selectedImage.title}</h3>
                <span className="category-tag">{selectedImage.category}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;