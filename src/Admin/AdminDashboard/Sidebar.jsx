import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt, FaHome, FaInfoCircle, FaImages,
    FaEnvelopeOpenText, FaCog, FaSignOutAlt, FaUserCircle,
    FaChevronLeft, FaChevronRight, FaBars, FaLayerGroup,
    FaThList, FaChevronDown, FaPhoneAlt, FaUserPlus, FaListUl, FaEye, FaPalette,FaUsers,FaVideo
} from 'react-icons/fa';
import './AdminSidebar.css';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({});
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Close mobile menu on location change
    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
        setOpenMenus({});
    };

    const toggleMobile = () => setMobileOpen(!mobileOpen);

    const toggleSubMenu = (groupName) => {
        if (collapsed) setCollapsed(false);
        setOpenMenus(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    // Navigation with 3-second loader
    const handleNavigation = (path, e) => {
        if (e) e.preventDefault();
        if (loading) return; // already loading

        setLoading(true);
        timeoutRef.current = setTimeout(() => {
            setLoading(false);
            navigate(path);
        }, 1000);
    };

    const menuGroups = [
        {
            group: "Main",
            items: [
                { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> }
            ]
        },
        {
            group: "Website Sections",
            isDropdown: true,
            items: [
                { name: 'Home Settings', path: '/admin/home-settings', icon: <FaHome /> },
                { name: 'About Management', path: '/admin/about-settings', icon: <FaInfoCircle /> },
                { name: 'Services Control', path: '/admin/service-settings', icon: <FaCog /> },
                { name: 'Project Portfolio', path: '/admin/project-settings', icon: <FaLayerGroup /> },
                { name: 'Gallery Manager', path: '/admin/gallery', icon: <FaImages /> },

                { name: 'Client Logos', path: '/admin/Client', icon: <FaUserCircle /> },

                { name: 'Team Picture', path: '/admin/team', icon: <FaUsers /> },

                { name: 'HomeAbout', path: '/admin/homeSettings', icon: <FaHome /> },
            ]
        },
        {
            group: "Inquiries & Leads",
            isDropdown: true,
            items: [
                { name: 'Contact Inquiries', path: '/admin/Admin-inquiry', icon: <FaEnvelopeOpenText /> },
                { name: 'Contact Info Settings', path: '/admin/contact-settings', icon: <FaPhoneAlt /> },
            ]
        },
        {
            group: "Layout Setup",
            isDropdown: true,
            items: [
                { name: 'Navbar & Logo', path: '/admin/navbar-settings', icon: <FaLayerGroup /> },
                { name: 'Footer Editor', path: '/admin/footer-settings', icon: <FaThList /> },
            ]
        },
        {
            group: "System",
            isDropdown: true,                         // now a dropdown
            items: [
                { name: 'Settings', path: '/admin/setting', icon: <FaCog /> },
                { name: 'Color Palette', path: '/admin/colorPalette', icon: <FaPalette /> },
                { name: 'Page Visibility', path: '/admin/page-visibility', icon: <FaEye /> },
                { name: 'Video', path: '/admin/Video', icon: <FaVideo /> }   // or <FaPlayCircle />
            ]
        }
    ];

    const handleLogout = () => {
        handleNavigation('/admin/login');
    };

    return (
        <>
            <button className="umc-mobile-trigger" onClick={toggleMobile}>
                <FaBars />
            </button>

            <aside className={`umc-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="umc-sidebar-header">
                    <Link to="/admin/dashboard" className="umc-sidebar-logo" onClick={(e) => handleNavigation('/admin/dashboard', e)}>
                        {!collapsed && <span className="umc-logo-text">NewMetal<span>Admin</span></span>}
                    </Link>
                    <button className="umc-collapse-btn" onClick={toggleCollapse}>
                        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>
                </div>

                <div className="umc-sidebar-profile">
                    <div className="umc-avatar-wrapper">
                        <FaUserCircle className="umc-profile-avatar" />
                        <span className="umc-status-indicator"></span>
                    </div>
                    {!collapsed && (
                        <div className="umc-profile-info">
                            <h4>Admin Metal</h4>
                            <p>Super User</p>
                        </div>
                    )}
                </div>

                <nav className="umc-sidebar-nav">
                    {menuGroups.map((group, idx) => (
                        <div key={idx} className="umc-nav-group">
                            {group.isDropdown ? (
                                <div
                                    className={`umc-dropdown-header ${openMenus[group.group] ? 'open' : ''}`}
                                    onClick={() => toggleSubMenu(group.group)}
                                >
                                    {!collapsed && <span className="umc-group-title">{group.group}</span>}
                                    {!collapsed && <FaChevronDown className="umc-dropdown-arrow" />}
                                </div>
                            ) : (
                                !collapsed && <p className="umc-group-title">{group.group}</p>
                            )}

                            <ul className={(group.isDropdown && !openMenus[group.group]) ? 'umc-submenu-closed' : 'umc-submenu-open'}>
                                {group.items.map((item) => (
                                    <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                                        <a href={item.path} onClick={(e) => handleNavigation(item.path, e)}>
                                            <span className="umc-nav-icon">{item.icon}</span>
                                            {!collapsed && <span className="umc-nav-text">{item.name}</span>}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="umc-sidebar-footer">
                    <button onClick={handleLogout} className="umc-logout-btn">
                        <FaSignOutAlt />
                        {!collapsed && <span>Logout Session</span>}
                    </button>
                </div>
            </aside>

            {mobileOpen && <div className="umc-backdrop" onClick={toggleMobile}></div>}

            {/* Loader Overlay */}
            {loading && (
                <div className="umc-loader-overlay">
                    <div className="umc-loader-spinner"></div>
                    <p>Loading, please wait...</p>
                </div>
            )}
        </>
    );
};

export default Sidebar;