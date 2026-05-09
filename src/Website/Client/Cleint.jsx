import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import './Client.css';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/clients');
        const activeClients = res.data.filter(c => c.status === 'active');
        setClients(activeClients);
      } catch (err) {
        setError('Failed to sync with client database');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // SEO fallback values (can be made dynamic if your API returns meta fields)
  const pageTitle = "Our Trusted Partners | New Metal Art";
  const metaDescription = "New Metal Art is proud to partner with India's most respected brands. See the trusted organizations that rely on our custom metal craftsmanship.";
  const metaKeywords = "metal art clients, trusted partners, brand collaborations, metal fabrication partners, New Metal Art clients";
  const ogImage = "https://newmetalart.com/images/clients-og.jpg"; // replace with actual image URL
  const canonicalUrl = "https://newmetalart.com/clients";

  if (loading) return (
    <div className="nmc-loader-container">
      <Helmet>
        <title>Loading Clients | New Metal Art</title>
      </Helmet>
      <div className="nmc-industrial-loader"></div>
      <p>Synchronizing Portfolio...</p>
    </div>
  );

  if (error) return (
    <>
      <Helmet>
        <title>clientele | New Metal Art</title>
      </Helmet>
      <div className="nmc-error-message">{error}</div>
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

        {/* Additional SEO directives */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="New Metal Art" />
      </Helmet>

      <div className="nmc-client-page">
        {/* Heading Section */}
        <div className="nmc-heading">
          <h2>Our <span className="nmc-gold">Trusted Partners</span></h2>
          <div className="nmc-heading-underline"></div>
          <p>Proudly associated with India's most respected brands</p>
        </div>

        <section className="nmc-logos-section">
          <div className="nmc-container">
            <div className="nmc-grid-4col">
              {clients.map(client => (
                <div className="nmc-card" key={client._id}>
                  <div className="nmc-card-inner">
                    <div className="nmc-logo-wrapper">
                      <img src={client.logo} alt={client.name} loading="lazy" />
                    </div>
                    {/* Client name removed */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Client;