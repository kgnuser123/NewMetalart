import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HeroSection.css';

const HeroSection = () => {

    const [heroSectionData, setHeroSectionData] = useState(null);

    const [heroSectionLoading, setHeroSectionLoading] = useState(true);

    const [heroSectionError, setHeroSectionError] = useState(false);

    useEffect(() => {

        const fetchHeroSectionData = async () => {

            try {

                const response = await axios.get('http://localhost:5000/api/stories');

                if (response.data && response.data.length > 0) {

                    const latestStory = response.data[0];

                    setHeroSectionData({
                        mainHeading: latestStory.title || "Our Story",
                        subHeading: latestStory.subTitle || "Crafting Metal Art",
                        description: latestStory.content,
                        imageUrl: latestStory.imageUrl
                    });

                } else {

                    setHeroSectionError(true);

                }

            } catch (err) {

                console.error('Hero section fetch error:', err);

                setHeroSectionError(true);

            } finally {

                setHeroSectionLoading(false);

            }

        };

        fetchHeroSectionData();

    }, []);

    if (heroSectionLoading) {

        return (

            <div className="hero-section-loading">
                <div className="hero-section-loading-spinner"></div>
                <p>Loading hero section...</p>
            </div>

        );

    }

    if (heroSectionError || !heroSectionData) {

        return (

            <div className="hero-section-error">
                <p>Failed to load hero content. Please try again later.</p>
            </div>

        );

    }

    return (

        <section className="hero-section-wrapper">

            <div className="hero-section-container">

                <div className="hero-section-grid">

                    {/* Left Side - Image with Animation Effects */}
                    <div className="hero-section-image">

                        <div className="hero-section-image-frame">

                            <img
                                src={
                                    heroSectionData.imageUrl ||
                                    'https://via.placeholder.com/800x600?text=Hero+Image'
                                }
                                alt="Our Story"
                            />

                            <div className="hero-section-image-border-animation"></div>

                        </div>

                    </div>

                    {/* Right Side - Content */}
                    <div className="hero-section-text">

                        <div className="hero-section-badge">
                            <span>{heroSectionData.subHeading}</span>
                        </div>

                        <h1 className="hero-section-heading">

                            <span className="hero-section-gold-text">
                                {heroSectionData.mainHeading}
                            </span>

                        </h1>

                        <div className="hero-section-heading-underline"></div>

                        <div className="hero-section-content">
                            <p>{heroSectionData.description}</p>
                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default HeroSection;