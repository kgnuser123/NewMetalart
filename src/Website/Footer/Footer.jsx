import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaLinkedinIn,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock
} from 'react-icons/fa';
import './Footer.css';

const iconMap = {
  FaFacebookF: FaFacebookF,
  FaInstagram: FaInstagram,
  FaWhatsapp: FaWhatsapp,
  FaYoutube: FaYoutube,
  FaLinkedinIn: FaLinkedinIn,
  FaMapMarkerAlt: FaMapMarkerAlt,
  FaPhoneAlt: FaPhoneAlt,
  FaEnvelope: FaEnvelope,
  FaClock: FaClock,
};

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/footer');
        setFooterData(res.data);
      } catch (err) {
        console.error('Footer fetch error:', err);
        setError('Failed to load footer content. Using default.');
        setFooterData({
          logo: { text: 'NEW METAL ART', metallicPart: 'METAL ART' },
          description: 'Premium metal fabrication & finishing solutions since 1995. Crafting excellence in every detail.',
          quickLinks: [
            { name: 'Home', path: '/' },
            { name: 'About Us', path: '/about' },
            { name: 'Services', path: '/services' },
            { name: 'Clientele', path: '/clientele' },
            { name: 'Gallery', path: '/gallery' },
            { name: 'Contact', path: '/contact' },
          ],
          socialLinks: [
            { icon: 'FaFacebookF', url: 'https://facebook.com', label: 'Facebook' },
            { icon: 'FaInstagram', url: 'https://instagram.com', label: 'Instagram' },
            { icon: 'FaWhatsapp', url: 'https://wa.me/919868609898', label: 'WhatsApp' },
            { icon: 'FaYoutube', url: 'https://youtube.com', label: 'YouTube' },
            { icon: 'FaLinkedinIn', url: 'https://linkedin.com', label: 'LinkedIn' },
          ],
          contactDetails: [
            { icon: 'FaMapMarkerAlt', text: 'Plot No. 42, Industrial Area, Meerut Road, Ghaziabad, UP - 201001', link: '' },
            { icon: 'FaPhoneAlt', text: '+91 98686 09898', link: 'tel:+919868609898' },
            { icon: 'FaEnvelope', text: 'newmetalart786@gmail.com', link: 'mailto:newmetalart786@gmail.com' },
            { icon: 'FaClock', text: 'Mon - Sat: 9:00 AM – 7:00 PM', link: '' },
          ],
          subFooter: {
            copyrightText: 'New Metal Art. All rights reserved.',
            links: [
              { name: 'Privacy Policy', path: '/privacy' },
              { name: 'Terms of Service', path: '/terms' },
            ],
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  if (loading) {
    return (
      <footer className="nmf-footer">
        <div className="nmf-main">
          <div className="nmf-container loading-footer">
            <p>Loading footer content...</p>
          </div>
        </div>
      </footer>
    );
  }

  const data = footerData;
  if (!data) return null;

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <footer className="nmf-footer">
      <div className="nmf-main">
        <div className="nmf-container">
          <div className="nmf-grid">
            
            {/* Brand Column (Centrada) */}
            <div className="nmf-col nmf-brand-col">
              <h3 className="nmf-logo">
                {data.logo?.text || 'NEW METAL ART'}
              </h3>
              <p className="nmf-description">{data.description}</p>
              <div className="nmf-socials">
                {data.socialLinks?.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="nmf-social-icon"
                  >
                    {getIcon(social.icon)}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column (Centrada) */}
            <div className="nmf-col nmf-links-col">
              <h4>Quick Links</h4>
              <ul className="nmf-links">
                {data.quickLinks?.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column (Centrada) */}
            <div className="nmf-col nmf-contact-col">
              <h4>Get in Touch</h4>
              <ul className="nmf-contact-list">
                {data.contactDetails?.map((item, idx) => (
                  <li key={idx}>
                    <span className="nmf-contact-icon">{getIcon(item.icon)}</span>
                    {item.link ? (
                      <a href={item.link} className="nmf-contact-text">{item.text}</a>
                    ) : (
                      <span className="nmf-contact-text">{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright Bar (Totalmente centrado) */}
      <div className="nmf-bottom">
        <div className="nmf-container bottom-container">
          <p className="nmf-copyright">
            &copy; {new Date().getFullYear()} {data.subFooter?.copyrightText || 'New Metal Art. All rights reserved.'}
          </p>
          <div className="nmf-legal">
            {data.subFooter?.links?.map((link, idx) => (
              <Link key={idx} to={link.path}>{link.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;