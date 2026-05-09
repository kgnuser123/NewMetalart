import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import './ProjectHome.css';

const ProjectHome = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Only fetch projects that are active AND chosen for home page
        const res = await axios.get('http://localhost:5000/api/projects?status=active&showOnHome=true');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="project-home-loader">
        <div className="spinner"></div>
        <p>Loading our projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-home-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="project-home-empty">
        <p>No projects available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="project-home-page">
      <div className="project-container">
        <div className="project-heading">
          <h2>
            OUR <span className="gold-text">PORTFOLIO</span>
          </h2>
          <div className="heading-decoration">
            <span className="dec-line"></span>
            <span className="dec-diamond">◆</span>
            <span className="dec-line"></span>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow]}
          spaceBetween={30}          // gap between slides in px
          slidesPerView={1}          // default for mobile
          centeredSlides={false}     // we want left-aligned but with outer padding
          loop={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 1.5,
            slideShadows: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 3, spaceBetween: 30 },  // ← exactly 3 slides
          }}
          className="project-swiper"
        >
          {projects.map((project) => (
            <SwiperSlide key={project._id}>
              <Link to={`/project/${project._id}`} className="project-slide-link">
                <div className="project-slide-card">
                  <div className="slide-image">
                    <img src={project.thumbnail} alt={project.title} loading="lazy" />
                  </div>
                  <div className="slide-info">
                    <h3>{project.title}</h3>
                    <p>
                      {project.description.length > 100
                        ? project.description.substring(0, 100) + '...'
                        : project.description}
                    </p>
                    <span className="category-badge">{project.category}</span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProjectHome;