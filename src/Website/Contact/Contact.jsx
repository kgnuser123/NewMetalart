import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane,
  FaCheckCircle, FaWhatsapp, FaCopy, FaTimes, FaBuilding,
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin
} from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primary, setPrimary] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch contact settings
  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/contact-settings');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBranches(res.data);
          setPrimary(res.data[0]);
        } else if (res.data && typeof res.data === 'object') {
          setBranches([res.data]);
          setPrimary(res.data);
        }
      } catch (err) {
        console.error("Error fetching contact settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContactSettings();
  }, []);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name' && !value.trim()) error = 'Name is required';
    if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
    }
    if (primary?.showSubject !== false && name === 'subject' && !value.trim()) error = 'Subject is required';
    if (name === 'message' && !value.trim()) error = 'Message is required';
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (primary?.showFullName !== false && !formData.name.trim()) hasError = true;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) hasError = true;
    if (primary?.showSubject !== false && !formData.subject.trim()) hasError = true;
    if (!formData.message.trim()) hasError = true;
    if (hasError) {
      setSubmitError('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await axios.post('http://localhost:5000/api/inquiries', formData);
      setShowSuccessModal(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="contact-loading">
        <div className="spinner"></div>
        <p>Loading contact information...</p>
      </div>
    );
  }

  if (!primary) {
    return (
      <div className="contact-error">
        <p>No contact information available. Please check back later.</p>
      </div>
    );
  }

  const otherBranches = branches.slice(1);
  const hasSocial = primary.socialLinks &&
    (primary.socialLinks.facebook || primary.socialLinks.instagram || primary.socialLinks.twitter || primary.socialLinks.linkedin);

  // Map rendering logic: prefer embed URL, fallback to API key method, then show placeholder
  const renderMap = () => {
    if (primary.mapEmbedUrl && primary.mapEmbedUrl.trim()) {
      return (
        <iframe
          title="Google Map"
          src={primary.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      );
    } else if (primary.googleMapsApiKey && primary.googleMapsApiKey.trim()) {
      return (
        <iframe
          title="Google Map"
          src={`https://www.google.com/maps/embed/v1/view?key=${primary.googleMapsApiKey}&center=${primary.mapLatitude || 28.612763},${primary.mapLongitude || 77.408758}&zoom=${primary.mapZoom || 15}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      );
    } else {
      return (
        <div className="map-placeholder">
          <p>Map not configured. Please add an embed URL or API key in admin panel.</p>
        </div>
      );
    }
  };

  return (
    <div className="contact-page-new">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-noise"></div>
        <div className="container hero-content">
          <div className="india-badge-wrapper">
            <div className="india-badge">
              <span className="india-text">New Metal Art – Working All Over India</span>
            </div>
          </div>
          <h1 className="hero-title">
            Get In  <br />
            <span className="metallic">Touch</span>
          </h1>
          <div className="hero-line-divider"></div>
         
        </div>
      </section>

      <div className="contact-main-new">
        <div className="container">
          {/* Map at top - now uses embed URL first */}
          <div className="map-top-wrapper">
            <div className="map-container">
              {renderMap()}
            </div>
          </div>

          {/* Two-column section: Form + Contact Details */}
          <div className="contact-two-columns">
            {/* Left: Form */}
            <div className="contact-form-col">
              <div className="contact-form-wrapper">
                <h2>{primary.formTitle || "Send Us a Message"}</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  {primary.showFullName !== false && (
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                      />
                      {errors.name && <small className="error-text">{errors.name}</small>}
                    </div>
                  )}
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <small className="error-text">{errors.email}</small>}
                    </div>
                    {primary.showPhone !== false && (
                      <div className="form-group">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number *"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </div>
                  {primary.showSubject !== false && (
                    <div className="form-group">
                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject *"
                        value={formData.subject}
                        onChange={handleChange}
                        className={errors.subject ? 'error' : ''}
                      />
                      {errors.subject && <small className="error-text">{errors.subject}</small>}
                    </div>
                  )}
                  <div className="form-group">
                    <textarea
                      name="message"
                      rows="5"
                      placeholder="Your Message *"
                      value={formData.message}
                      onChange={handleChange}
                      className={errors.message ? 'error' : ''}
                    />
                    {errors.message && <small className="error-text">{errors.message}</small>}
                  </div>
                  {submitError && <div className="submit-error">{submitError}</div>}
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'SENDING...' : <><FaPaperPlane /> SEND MESSAGE</>}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Contact Details */}
            <div className="contact-details-col">
              <div className="details-card">
                <h3><FaMapMarkerAlt /> Address</h3>
                <p>{primary.address?.line1}</p>
                <p>{primary.address?.line2}</p>
                <p>{primary.address?.cityState}</p>
              </div>

              <div className="details-card">
                <h3><FaPhoneAlt /> Phone Numbers</h3>
                {primary.phones?.map((p, i) => (
                  <div key={i} className="detail-row">
                    <a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>
                    <button onClick={() => copyToClipboard(p, 'Phone')}><FaCopy /></button>
                  </div>
                ))}
              </div>

              <div className="details-card">
                <h3><FaEnvelope /> Email Addresses</h3>
                {primary.emails?.map((e, i) => (
                  <div key={i} className="detail-row">
                    <a href={`mailto:${e}`}>{e}</a>
                    <button onClick={() => copyToClipboard(e, 'Email')}><FaCopy /></button>
                  </div>
                ))}
              </div>

              <div className="details-card">
                <h3><FaClock /> Working Hours</h3>
                <p>{primary.workingHours?.weekdays || 'Mon-Fri: 9am - 6pm'}</p>
                <p>{primary.workingHours?.sunday || 'Sunday: Closed'}</p>
              </div>

              {hasSocial && (
                <div className="details-card">
                  <h3>Follow Us</h3>
                  <div className="social-links-details">
                    {primary.socialLinks.facebook && (
                      <a href={primary.socialLinks.facebook} target="_blank" rel="noreferrer"><FaFacebook /></a>
                    )}
                    {primary.socialLinks.instagram && (
                      <a href={primary.socialLinks.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a>
                    )}
                    {primary.socialLinks.twitter && (
                      <a href={primary.socialLinks.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a>
                    )}
                    {primary.socialLinks.linkedin && (
                      <a href={primary.socialLinks.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Other branches */}
          {otherBranches.length > 0 && (
            <div className="other-branches">
              <h2 className="branches-title">Our <span className="metallic">Other Offices</span></h2>
              <div className="branches-grid">
                {otherBranches.map((branch, idx) => (
                  <div key={idx} className="branch-card">
                    <div className="branch-icon"><FaBuilding /></div>
                    <h4>{branch.name}</h4>
                    <p className="branch-address">
                      {branch.address?.line1}<br />
                      {branch.address?.line2 && <>{branch.address.line2}<br /></>}
                      {branch.address?.cityState}
                    </p>
                    <div className="branch-contacts">
                      {branch.phones?.slice(0, 1).map((p, i) => (
                        <a key={i} href={`tel:${p.replace(/\s/g, '')}`}><FaPhoneAlt /> {p}</a>
                      ))}
                      {branch.emails?.slice(0, 1).map((e, i) => (
                        <a key={i} href={`mailto:${e}`}><FaEnvelope /> {e}</a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="floating-actions">
        {primary.phones?.[0] && (
          <a href={`https://wa.me/${primary.phones[0].replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="float-btn whatsapp">
            <FaWhatsapp />
          </a>
        )}
        {primary.phones?.[0] && (
          <a href={`tel:${primary.phones[0].replace(/\s/g, '')}`} className="float-btn phone">
            <FaPhoneAlt />
          </a>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSuccessModal(false)}><FaTimes /></button>
            <FaCheckCircle className="modal-icon" />
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
            <button className="modal-btn" onClick={() => setShowSuccessModal(false)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;