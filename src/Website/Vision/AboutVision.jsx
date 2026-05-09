import React from 'react';
import { FaEye, FaBullseye, FaUsers, FaArrowRight } from 'react-icons/fa';
import './AboutVision.css';

const AboutVision = () => {
  const vision = `NMA is moving towards becoming the face of Design led fabrication practice where material, craft, design comes together to create project that holds visually and structurally over time.`;
  const mission = `To deliver high-quality metal fabrication by combining industrial capability with hands-on craftsmanship, while maintaining consistency, reliability, and no compromise on materials or finish.`;
  const targetAudience = `New Metal Art primarily caters to architects, interior designers, and design studios who require precise and reliable fabrication for custom metal elements and installations.`;

  return (
    <section className="nma-vsn-section-light">
      <div className="nma-vsn-container">

        {/* Header */}
        <div className="nma-vsn-header">
          <h2 className="nma-vsn-main-title">Where we  <span className="nma-vsn-bronze">do</span></h2>
          <p className="nma-vsn-tagline">Integrity • Craftsmanship • Precision</p>
        </div>

        {/* INTRODUCTION BLOCK - Who we are */}
        <div className="nma-vsn-intro-block">
         
          <div className="nma-vsn-intro-content">
            <p className="nma-vsn-text">
              New Metal Art (NMA) is a metal manufacturing unit where we prioritise precision, scale and material understanding.
              We work with a variety of products which includes large scale sculptures, installation, wall art, lighting solutions.
              We have our own in house setup for all the processes related to metal manufacturing including laser welding,
              power grinding, machine bending, casting, hydraulic pressing along with a fleet of trained operators to handle
              every project with precision.
            </p>
            <p className="nma-vsn-text">
              We have 25+ years of experience in manufacturing metal product ranging from large scale sculpture to small scale
              wall arts for home. We have catered to companies from different fields and have done highly customisable projects.
            </p>
            <p className="nma-vsn-text">
              If you relate to what we do and want to give your project a headstart.
            </p>
          </div>
        </div>

        {/* 3‑Column Grid with ALWAYS-ON Animated Borders */}
        <div className="nma-vsn-grid">
          {[
            { icon: <FaEye />, title: "Brand Vision", text: vision, footer: "" },
            { icon: <FaBullseye />, title: "Brand Mission", text: mission, footer: "" },
            { icon: <FaUsers />, title: "Who We Serve", text: targetAudience, link: true }
          ].map((item, index) => (
            <div className="nma-vsn-card-wrapper" key={index}>
              <div className="nma-vsn-card">
                <div className="nma-vsn-card-icon">{item.icon}</div>
                <h3 className="nma-vsn-card-title">{item.title}</h3>
                <p className="nma-vsn-card-description">{item.text}</p>
                <div className="nma-vsn-card-footer">
                  {item.link ? (
                    <a href="/contact" className="nma-vsn-cta"> Our Partner  <FaArrowRight /></a>
                  ) : (
                    <span className="nma-vsn-signature">{item.footer}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutVision;