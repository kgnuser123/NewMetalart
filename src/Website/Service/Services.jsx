import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaIndustry, FaCog, FaCrosshairs, FaPaintRoller,
  FaRulerCombined, FaWrench, FaCheckCircle, FaArrowRight
} from 'react-icons/fa';
import './Services.css';

const Services = () => {
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

  const processSteps = [
    { step: '01', title: 'Consultation', desc: 'Understand your requirements and provide expert advice.' },
    { step: '02', title: 'Design & Quotation', desc: 'Share CAD drawings and a detailed cost estimate.' },
    { step: '03', title: 'Fabrication', desc: 'Precision manufacturing using state‑of‑the‑art machinery.' },
    { step: '04', title: 'Quality Check', desc: 'Rigorous inspection to ensure flawless output.' },
    { step: '05', title: 'Delivery & Support', desc: 'Safe packaging, on‑time delivery, and after‑sales service.' }
  ];

  if (loading) {
    return (
      <div className="services-loading">
        <div className="spinner"></div>
        <p>Loading our services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* Hero Section */}
    

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="section-header">
            <h2>What We <span className="metallic">Offer</span></h2>
            <p>Premium metalworking services tailored to your needs.</p>
          </div>
          <div className="services-grid">
            {services.length === 0 ? (
              <p className="no-services">No services available at the moment.</p>
            ) : (
              services.map((service) => (
                <div className="service-card glass-card" key={service.id}>
                  {/* Service Image */}
                  {service.image && (
                    <div className="service-image-wrapper">
                      <img 
                        src={service.image.startsWith('data:') || service.image.startsWith('http') 
                          ? service.image 
                          : `http://localhost:5000${service.image}`} 
                        alt={service.title} 
                        className="service-image"
                      />
                    </div>
                  )}
                  <div className="service-icon">
                    {getIcon(service.icon || 'FaIndustry')}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.shortDesc || service.longDesc?.substring(0, 120)}</p>
                  {service.features && service.features.length > 0 && (
                    <ul className="feature-list">
                      {service.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx}><FaCheckCircle /> {feat}</li>
                      ))}
                    </ul>
                  )}
                  {service.price > 0 && (
                    <div className="service-price">Starting from ${service.price}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
   

      {/* CTA Section */}
     
    </div>
  );
};

export default Services;