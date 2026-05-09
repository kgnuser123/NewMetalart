import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaUserShield, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visiblePaths, setVisiblePaths] = useState({});
  const [mobileOpenMenus, setMobileOpenMenus] = useState({});
  const location = useLocation();

  // ---------- Helper: Read page visibility from localStorage (with aliases) ----------
  const getVisiblePathsFromStorage = () => {
    const defaultVisibility = {
      '/': true,
      '/contact-us': true,
      '/gallery': true,
      '/clientele': true,
      '/about-us': true,      // About Us default visible
      '/services': true,
      '/projects': true,
    };
    const saved = localStorage.getItem('pageVisibility');
    if (!saved) return defaultVisibility;

    try {
      const pages = JSON.parse(saved);
      const visibilityMap = {};
      pages.forEach(page => {
        let routePath = page.path;
        // Convert old/alternative paths to standard paths
        if (routePath === '/contact') routePath = '/contact-us';
        if (routePath === '/cleint') routePath = '/clientele';
        if (routePath === '/about') routePath = '/about-us';
        if (routePath === '/about us') routePath = '/about-us';
        if (routePath === '/Services') routePath = '/services';
        if (routePath === '/project') routePath = '/projects';
        visibilityMap[routePath] = page.visible;
      });
      // Merge with defaults (so missing paths are visible)
      return { ...defaultVisibility, ...visibilityMap };
    } catch (e) {
      return defaultVisibility;
    }
  };

  const updateVisibility = () => {
    setVisiblePaths(getVisiblePathsFromStorage());
  };

  useEffect(() => {
    updateVisibility();
    window.addEventListener('storage', updateVisibility);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') updateVisibility();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('storage', updateVisibility);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchNavbarData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/navbar');
      setDbData(res.data);
    } catch (err) {
      console.error("Navbar fetch error:", err);
      setDbData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavbarData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchNavbarData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchNavbarData();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileOpenMenus({});
  }, [location]);

  const getEmails = () => {
    if (dbData?.emails && Array.isArray(dbData.emails)) return dbData.emails;
    return [];
  };

  const getPhones = () => {
    if (dbData?.phones && Array.isArray(dbData.phones)) return dbData.phones;
    return [];
  };

  // Convert flat menuLinks (old format) to hierarchical (backward compatibility)
  const convertFlatToHierarchical = (flatLinks) => {
    return flatLinks.map(link => ({
      name: link,
      path: getPathFromName(link),
      children: []
    }));
  };

  // ✅ UPDATED: Map menu names to correct paths (supports "About Us")
  const getPathFromName = (name) => {
    const lowerName = name.toLowerCase().trim();
    if (lowerName === 'home') return '/';
    if (lowerName === 'clientele' || lowerName === 'client') return '/clientele';
    // About Us fix: both "about", "about-us", "about us" work
    if (lowerName === 'about-us' || lowerName === 'about' || lowerName === 'about us') return '/about-us';
    if (lowerName === 'services') return '/services';
    if (lowerName === 'gallery') return '/gallery';
    // Project children mapping – redirect to Projects page with category filter
    if (lowerName === 'industrial') return '/projects?category=industrial';
    if (lowerName === 'architectural') return '/projects?category=architectural';
    if (lowerName === 'custom') return '/projects?category=custom';
    if (lowerName === 'project' || lowerName === 'projects') return '/projects';
    // Fallback: convert spaces to hyphens
    return `/${lowerName.replace(/\s+/g, '-')}`;
  };

  // Build navigation items from dbData, filtering by visiblePaths
  const getNavItems = () => {
    if (!dbData) return [];
    let items = [];
    if (dbData.menuItems && Array.isArray(dbData.menuItems) && dbData.menuItems.length > 0) {
      items = dbData.menuItems;
    } else if (dbData.menuLinks && Array.isArray(dbData.menuLinks)) {
      items = convertFlatToHierarchical(dbData.menuLinks);
    }
    const filtered = items.filter(item => {
      if (item.children && item.children.length > 0) {
        const hasVisibleChild = item.children.some(child => visiblePaths[getPathFromName(child.name)] === true);
        const parentVisible = visiblePaths[getPathFromName(item.name)] === true;
        return hasVisibleChild || parentVisible;
      } else {
        return visiblePaths[getPathFromName(item.name)] === true;
      }
    });
    return filtered;
  };

  const navItems = getNavItems();

  const toggleMobileSubmenu = (index) => {
    setMobileOpenMenus(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderDesktopMenu = (items) => {
    return (
      <ul className="navbar-desktop-menu">
        {items.map((item, idx) => {
          const hasChildren = item.children && item.children.length > 0;
          const path = getPathFromName(item.name);
          const isActive = location.pathname === path || (path.includes('?') && location.pathname === '/projects');
          return (
            <li key={idx} className={`navbar-dropdown ${hasChildren ? 'has-dropdown' : ''}`}>
              <Link to={path} className={`navbar-link ${isActive ? 'active' : ''}`}>
                {item.name}
                {hasChildren && <FaChevronDown className="dropdown-arrow" />}
                <span className="navbar-link-dot"></span>
              </Link>
              {hasChildren && (
                <ul className="navbar-dropdown-menu">
                  {item.children.map((child, childIdx) => {
                    const childPath = getPathFromName(child.name);
                    return (
                      <li key={childIdx}>
                        <Link to={childPath}>{child.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderMobileMenu = (items) => {
    return (
      <ul className="navbar-mobile-list">
        {items.map((item, idx) => {
          const hasChildren = item.children && item.children.length > 0;
          const path = getPathFromName(item.name);
          const isOpenSub = mobileOpenMenus[idx];
          return (
            <li key={idx}>
              <div className="navbar-mobile-item">
                <Link to={path} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
                {hasChildren && (
                  <button className="mobile-submenu-toggle" onClick={() => toggleMobileSubmenu(idx)}>
                    {isOpenSub ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                )}
              </div>
              {hasChildren && isOpenSub && (
                <ul className="navbar-mobile-submenu">
                  {item.children.map((child, childIdx) => {
                    const childPath = getPathFromName(child.name);
                    return (
                      <li key={childIdx}>
                        <Link to={childPath} onClick={() => setIsOpen(false)}>
                          {child.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderContacts = () => {
    const emails = getEmails();
    const phones = getPhones();
    if (loading) return <a href="#"><FaEnvelope /> Loading...</a>;
    if (emails.length === 0 && phones.length === 0) return null;
    return (
      <>
        {emails.map((email, idx) => (
          <a key={`email-${idx}`} href={`mailto:${email}`}>
            <FaEnvelope /> {email}
          </a>
        ))}
        {phones.map((phone, idx) => (
          <a key={`phone-${idx}`} href={`tel:${phone.replace(/\s/g, '')}`}>
            <FaPhoneAlt /> {phone}
          </a>
        ))}
      </>
    );
  };

  const logoSrc = dbData?.logo
    ? (dbData.logo.startsWith('http') ? dbData.logo : `http://localhost:5000${dbData.logo}`)
    : null;

  return (
    <header className={`navbar-header ${scrolled ? 'is-scrolled' : ''}`}>
      {/* Top Bar */}
      {(getEmails().length > 0 || getPhones().length > 0 || 
        dbData?.social?.facebook || dbData?.social?.instagram || dbData?.social?.whatsapp) && (
        <div className="navbar-top-bar">
          <div className="navbar-container">
            <div className="navbar-top-contacts">
              {renderContacts()}
            </div>
            <div className="navbar-top-socials">
              {dbData?.social?.facebook && (
                <a href={dbData.social.facebook} target="_blank" rel="noreferrer"><FaFacebookF /></a>
              )}
              {dbData?.social?.instagram && (
                <a href={dbData.social.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a>
              )}
              {dbData?.social?.whatsapp && (
                <a href={dbData.social.whatsapp} target="_blank" rel="noreferrer"><FaWhatsapp /></a>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="navbar-main-nav">
        <div className="navbar-container navbar-flex">
          <Link to="/" className="navbar-logo">
            {logoSrc ? (
              <img src={logoSrc} alt="NewMetalLogo" />
            ) : (
              <span className="navbar-logo-placeholder">NMA</span>
            )}
          </Link>

          {navItems.length > 0 && renderDesktopMenu(navItems)}

          <div className="navbar-actions">
            <Link to="/contact-us" className="navbar-contact-btn">
              <FaUserShield /> <span>CONTACT US</span>
            </Link>
            <button
              className={`navbar-hamburger ${isOpen ? 'is-active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {navItems.length > 0 && (
          <div className={`navbar-mobile-overlay ${isOpen ? 'show' : ''}`}>
            {renderMobileMenu(navItems)}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;