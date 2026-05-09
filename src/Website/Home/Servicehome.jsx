import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaIndustry, FaCog, FaCrosshairs, FaPaintRoller,
  FaRulerCombined, FaWrench, FaCheckCircle
} from 'react-icons/fa';
import './ServiceHome.css';

const ServiceHome = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const iconMap = {
    FaIndustry: <FaIndustry />,
    FaCog: <FaCog />,
    FaCrosshairs: <FaCrosshairs />,
    FaPaintRoller: <FaPaintRoller />,
    FaRulerCombined: <FaRulerCombined />,
    FaWrench: <FaWrench />
  };

  const getIcon = (iconName) => iconMap[iconName] || <FaIndustry />;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        const activeServices = res.data
          .filter(s => s.status === 'active')
          .sort((a, b) => a.order - b.order);
        setServices(activeServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="service-home-loader">
        <div className="spinner"></div>
        <p>Loading our services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-home-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="service-home-empty">
        <p>No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="service-home-page">
      <div className="service-container">
        {/* Heading Section */}
        <div className="service-heading">
          <h2>Our <span className="gold-text">Services</span></h2>
          <div className="heading-underline"></div>
          <p>Premium metalworking solutions tailored to your needs</p>
        </div>

        {/* Services Grid */}
        <div className="service-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              {service.image && (
                <div className="service-image-wrap">
                  <img 
                    src={service.image.startsWith('data:') || service.image.startsWith('http') 
                      ? service.image 
                      : `http://localhost:5000${service.image}`} 
                    alt={service.title}
                  />
                </div>
              )}
              <div className="service-icon">
                {getIcon(service.icon || 'FaIndustry')}
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDesc || service.longDesc?.substring(0, 100)}</p>
              {service.features && service.features.length > 0 && (
                <ul className="feature-list">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx}><FaCheckCircle /> {feat}</li>
                  ))}
                </ul>
              )}
              {service.price > 0 && (
                <div className="service-price">Starting from ₹{service.price}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceHome;