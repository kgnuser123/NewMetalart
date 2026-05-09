import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaTimes, FaExpand, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import './projectList.css';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  
  // Lightbox state – stores the active project's images and current index
  const [lightboxData, setLightboxData] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, filterCategory]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterCategory !== 'all') params.category = filterCategory;
      const res = await axios.get('http://localhost:5000/api/projects', { params });
      setProjects(res.data);
      const cats = ['all', ...new Set(res.data.map(p => p.category).filter(Boolean))];
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open lightbox with all images of the selected project
  const openLightbox = (project) => {
    // Build an array of all images: use project.images if available, otherwise fallback to thumbnail
    let allImages = [];
    if (project.images && project.images.length > 0) {
      allImages = [...project.images];
    } else if (project.thumbnail) {
      allImages = [project.thumbnail];
    }
    
    // Start with the first image (or thumbnail index if you want)
    setLightboxData({
      images: allImages,
      currentIndex: 0,
      projectTitle: project.title
    });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxData(null);
    document.body.style.overflow = 'auto';
  };

  const goPrev = () => {
    if (lightboxData) {
      const newIndex = lightboxData.currentIndex === 0 
        ? lightboxData.images.length - 1 
        : lightboxData.currentIndex - 1;
      setLightboxData({ ...lightboxData, currentIndex: newIndex });
    }
  };

  const goNext = () => {
    if (lightboxData) {
      const newIndex = lightboxData.currentIndex === lightboxData.images.length - 1 
        ? 0 
        : lightboxData.currentIndex + 1;
      setLightboxData({ ...lightboxData, currentIndex: newIndex });
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxData) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData]);

  // SEO dynamic values
  const projectCount = projects.length;
  const pageTitle = "Metal Art Portfolio | New Metal Art Projects";
  const metaDescription = `Explore our portfolio of ${projectCount} unique metal art projects. Discover custom sculptures, architectural installations, and industrial designs by New Metal Art.`;
  const metaKeywords = "metal art portfolio, metal sculpture projects, custom metal art, architectural metalwork, industrial art, New Metal Art projects";
  const canonicalUrl = "https://newmetalart.com/projects";
  const ogImage = projects.length > 0 && projects[0].thumbnail 
    ? projects[0].thumbnail 
    : "https://newmetalart.com/images/projects-og.jpg";

  // Loading and error states with Helmet
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Projects | New Metal Art</title>
        </Helmet>
        <div className="loader">Loading artworks...</div>
      </>
    );
  }

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

      <div className="projects-list-container">
        <h1>Metal Art Portfolio</h1>
        {projects.length === 0 ? (
          <div className="no-results">No projects found.</div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project._id} className="project-card">
                {/* LEFT COLUMN – enriched content */}
                <div className="card-content">
                  <div className="card-details">
                    <h3>{project.title}</h3>
                    <p className="subheading">
                      {project.client ? `Commissioned for ${project.client}` : project.material}
                    </p>
                    <p className="category">{project.category}</p>
                    
                    <div className="specs-row">
                      {project.dimensions && (
                        <span className="spec-badge">Dimensions: {project.dimensions}</span>
                      )}
                      {project.weight && (
                        <span className="spec-badge">Weight: {project.weight}</span>
                      )}
                      {project.completionYear && (
                        <span className="spec-badge">Year: {project.completionYear}</span>
                      )}
                      {project.location && (
                        <span className="spec-badge">Location: {project.location}</span>
                      )}
                    </div>
                    
                    <p className="short-description">
                      {project.description?.substring(0, 120)}...
                    </p>
                    
                    <div className="extra-details">
                      {project.materials && (
                        <div className="detail-item">
                          <strong>Materials:</strong> {project.materials}
                        </div>
                      )}
                      {project.techniques && (
                        <div className="detail-item">
                          <strong>Techniques:</strong> {project.techniques}
                        </div>
                      )}
                      {project.specifications && (
                        <div className="detail-item">
                          <strong>Specs:</strong> {project.specifications}
                        </div>
                      )}
                    </div>
                    
                    {project.longDescription && (
                      <div className="full-description">
                        <p>{project.longDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN – clickable image that opens gallery */}
                <div className="card-image-wrapper">
                  <div className="card-image" onClick={() => openLightbox(project)}>
                    <img src={project.thumbnail} alt={project.title} />
                    {project.isFeatured && <span className="featured-badge">Featured</span>}
                    <div className="image-overlay">
                      <FaExpand className="expand-icon" />
                    </div>
                  </div>
                  {/* Optional: show a small "gallery" badge if multiple images exist */}
                  {project.images && project.images.length > 1 && (
                    <div className="gallery-badge">{project.images.length} photos</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal with Gallery Navigation */}
        {lightboxData && (
          <div className="lightbox" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={closeLightbox}>
                <FaTimes />
              </button>
              
              {/* Main image */}
              <div className="lightbox-main">
                <img 
                  src={lightboxData.images[lightboxData.currentIndex]} 
                  alt={lightboxData.projectTitle} 
                />
                
                {/* Navigation buttons */}
                {lightboxData.images.length > 1 && (
                  <>
                    <button className="lightbox-prev" onClick={goPrev}>
                      <FaChevronLeft />
                    </button>
                    <button className="lightbox-next" onClick={goNext}>
                      <FaChevronRight />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                <div className="lightbox-counter">
                  {lightboxData.currentIndex + 1} / {lightboxData.images.length}
                </div>
              </div>
              
              {/* Thumbnail strip (if more than one image) */}
              {lightboxData.images.length > 1 && (
                <div className="lightbox-thumbnails">
                  {lightboxData.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumbnail-item ${idx === lightboxData.currentIndex ? 'active' : ''}`}
                      onClick={() => setLightboxData({ ...lightboxData, currentIndex: idx })}
                    >
                      <img src={img} alt={`thumb ${idx}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Project;