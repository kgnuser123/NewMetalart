// src/Website/About/About.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async'; // Add this
import {
  FaTrophy, FaHandshake, FaShieldAlt, FaLightbulb,
  FaClock, FaUsers, FaCheckCircle, FaArrowRight,
  FaHammer, FaRulerCombined, FaPaintRoller,
  FaCog, FaWrench, FaBullseye, FaEye
} from 'react-icons/fa';
import './About.css';
import OurStory from '../Home/OurStory';
import TeamGallery from './TeamGallery';

// Helper to map icon strings to actual components
const getIconComponent = (iconName) => {
  const icons = {
    FaHammer: <FaHammer />,
    FaRulerCombined: <FaRulerCombined />,
    FaPaintRoller: <FaPaintRoller />,
    FaLaserFocus: <FaCog />, // Replaced missing icon with FaCog
    FaCog: <FaCog />,
    FaWrench: <FaWrench />,
    FaCheckCircle: <FaCheckCircle />,
  };
  return icons[iconName] || <FaCog />;
};

// Fallback icon array for core values
const valueIcons = [<FaTrophy />, <FaHandshake />, <FaShieldAlt />, <FaLightbulb />, <FaClock />, <FaUsers />];

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/about');
        setAboutData(res.data);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Failed to load about content.');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <div className="nma-pro-about"><div className="spinner"></div><p>Loading...</p></div>;
  if (error || !aboutData) return <div className="nma-pro-about"><p>{error || 'Content not available'}</p></div>;

  const { general, story, missionVision, values, whatWeDo, whatWeDoHeading, whatWeDoDescription, founder } = aboutData;

  // SEO dynamic values
  const pageTitle = general?.pageTitle || `About Us | New Metal Art`;
  const metaDescription = general?.metaDescription || general?.heroSubtitle || "Discover the story, mission, and craftsmanship behind New Metal Art – custom metal artworks with passion and precision.";
  const metaKeywords = general?.metaKeywords || "metal art, about us, custom metal fabrication, New Metal Art, metal sculpture, artisan metalwork";
  const ogImage = general?.ogImage || "https://newmetalart.com/images/about-og.jpg"; // fallback image
  const canonicalUrl = "https://newmetalart.com/about";

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

        {/* Optional: additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="New Metal Art" />
      </Helmet>

      <div className="nma-pro-about">
        {/* Hero Banner */}
        <section className="abt-hero">
          <div className="abt-hero-content">
            <h1 className="abt-hero-title">
              {general.heroTitle} <span className="metallic">{general.metallicWord}</span>
            </h1>
            <p className="abt-hero-subtitle">{general.heroSubtitle}</p>
          </div>
          <div className="abt-hero-bg"></div>
        </section>

        {/* Our Story */}
        <section className="abt-story" id="story">
          <OurStory />
        </section>

        {/* Mission & Vision */}
        <section className="abt-mv">
          <div className="container">
            <div className="abt-mv-grid">
              <div className="abt-mv-card">
                <div className="mv-icon"><FaBullseye /></div>
                <h3>Our Mission</h3>
                <p>{missionVision.mission}</p>
              </div>
              <div className="abt-mv-card">
                <div className="mv-icon"><FaEye /></div>
                <h3>Our Vision</h3>
                <p>{missionVision.vision}</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        {whatWeDo?.length > 0 && (
          <section className="abt-whatwedo">
            <div className="container">
              <h2 className="abt-section-title center">
                {whatWeDoHeading || 'What'} <span className="bronze">{whatWeDoHeading ? '' : 'We Do'}</span>
                {whatWeDoHeading && <span className="bronze">{whatWeDoHeading.replace(/^What\s/, '')}</span>}
              </h2>
              {whatWeDoDescription && (
                <p className="section-description center">{whatWeDoDescription}</p>
              )}
              <div className="wwd-grid">
                {whatWeDo.map((item, idx) => (
                  <div className="wwd-card" key={item.id || idx}>
                    <div className="wwd-icon">{getIconComponent(item.icon)}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Core Values */}
        {values?.length > 0 && (
          <section className="abt-values">
            <div className="container">
              <h2 className="abt-section-title center">Our Core <span className="bronze">Values</span></h2>
              <div className="values-grid">
                {values.map((val, idx) => (
                  <div className="value-card" key={val.id || idx}>
                    <div className="value-icon">{valueIcons[idx % valueIcons.length]}</div>
                    <h4>{val.title}</h4>
                    <p>{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Meet Our Founder */}
        {founder && (
          <section className="abt-founder">
            <div className="container">
              <h2 className="abt-section-title center">
                {founder.heading || 'Meet Our'} <span className="bronze">{founder.heading ? founder.heading.replace(/^Meet\s/, '') : 'Founder'}</span>
              </h2>
              <div className="founder-card">
                <div className="founder-image">
                  <img src={founder.image} alt={founder.heading || 'Founder'} />
                </div>
                <div className="founder-info">
                  <div className="founder-bio">
                    {founder.description.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Team Gallery */}
        <TeamGallery />
      </div>
    </>
  );
};

export default About;