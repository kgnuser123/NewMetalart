import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import './ClientHome.css';

const ClientHome = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log('Fetching clients from API...');
        const res = await axios.get('http://localhost:5000/api/clients');
        console.log('API response:', res.data);
        
        const activeClients = res.data.filter(c => c.status === 'active');
        console.log('Active clients:', activeClients);
        
        if (activeClients.length === 0) {
          setError('No active client logos found. Please add some from the admin panel.');
          setClients([]);
        } else {
          // Infinite loop ko smoothly bina kisi gap ke chalane ke liye kam se kam 15-20 slides chahiye hoti hain.
          // Isliye hum array ko tab tak bada karenge jab tak length kam se kam 16 na ho jaye.
          let finalClients = [...activeClients];
          while (finalClients.length < 16 && activeClients.length > 0) {
            finalClients = [...finalClients, ...activeClients];
          }
          setClients(finalClients);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data?.error || 'Unknown'}`);
        } else if (err.request) {
          setError('Cannot connect to backend. Make sure the server is running on port 5000.');
        } else {
          setError('Request failed: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="nmc-client-loader">
        <div className="nmc-client-spinner"></div>
        <p>Loading partners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nmc-client-error">
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="nmc-client-empty">
        <p>No partner logos available yet.</p>
      </div>
    );
  }

  return (
    <section className="nmc-client-section">
      {/* Wrapper to break standard container width for edge-to-edge perfect alignment */}
      <div className="nmc-client-carousel-wrapper">
        <div className="nmc-client-container">
          <div className="nmc-client-header">
            <h2 className="nmc-client-title">
              Our <span className="nmc-client-gold">Trusted</span> <br />
              Professional <span className="nmc-client-outline">Partners</span>
            </h2>
            <div className="nmc-client-line"></div>
            <p className="nmc-client-subtitle">
              Powering excellence through long-term collaboration with India's best.
            </p>
          </div>
        </div>

    <Swiper
  modules={[Autoplay, Pagination]}
  spaceBetween={30}
  slidesPerView={5.5}             /* Desktop first approach: Default me 5.5 slides dikhengi */
  centeredSlides={true}           /* Center alignment active rahegi */
  loop={true}                     /* Infinite loop bina kisi gap ke chalega */
  autoplay={{ 
    delay: 2000, 
    disableOnInteraction: false, 
    pauseOnMouseEnter: true 
  }}
  pagination={{ clickable: true, dynamicBullets: false }}
  breakpoints={{
    // Jab screen 320px ya usse badi ho (Mobile)
    320: { 
      slidesPerView: 1.5, 
      spaceBetween: 15,
      centeredSlides: true 
    },
    // Jab screen 480px ya usse badi ho (Large Mobile)
    480: { 
      slidesPerView: 2.2, 
      spaceBetween: 20,
      centeredSlides: true 
    },
    // Jab screen 768px ya usse badi ho (Tablets)
    768: { 
      slidesPerView: 3.5, 
      spaceBetween: 25,
      centeredSlides: true 
    },
    // Jab screen 1024px ya usse badi ho (Laptops)
    1024: { 
      slidesPerView: 4.5, 
      spaceBetween: 30,
      centeredSlides: true 
    },
    // Jab screen 1280px ya usse badi ho (Normal Desktop)
    1280: { 
      slidesPerView: 5.5,          /* Desktop par perfectly 5 logos fully aur 2 corners par half-cut dikhenge */
      spaceBetween: 30,
      centeredSlides: true 
    },
    // Jab screen 1600px ya usse badi ho (Ultra-wide screen)
    1600: { 
      slidesPerView: 6.5,          /* Ultra-wide desktop par 6 full aur corners par half-cut dikhenge */
      spaceBetween: 35,
      centeredSlides: true 
    }
  }}
  className="nmc-client-carousel"
>
          {clients.map((client, index) => (
            <SwiperSlide key={`${client._id || index}-${index}`}>
              <div className="nmc-client-card">
                <div className="nmc-client-logo-wrapper">
                  <img 
                    src={client.logo} 
                    alt={client.altText || client.name} 
                    title={client.name}
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ClientHome;