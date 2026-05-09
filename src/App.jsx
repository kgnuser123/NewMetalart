import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';

// Extra Components
import Loader from './Extra/Loader';

// Website (Public) Components
import Navbar from './Website/Navbar/Navbar';
import Footer from './Website/Footer/Footer';
import Home from './Website/Home/Home';
import Contact from './Website/Contact/Contact';
import Gallery from './Website/Gallery/Gallery';
import Client from './Website/Client/Cleint';
import About from './Website/About/About';
import Services from './Website/Service/Services';


// Admin Components
import AdminLogin from './AdminLogin/AdminLogin';
import Sidebar from './Admin/AdminDashboard/Sidebar';
import ContactSettingsManager from './Admin/Contact/ContactSettingsManager';
import AdminFooterEditor from './Admin/Footer/AdminFooter';
import ProjectSettingsManager from './Admin/Project/ProjectSettingsManager';
import AboutSettingsManager from './Admin/About/AboutSettingManager';
import GallerySettingManager from './Admin/Gallery/GallerySettingManager';
import NavbarSettingsManager from './Admin/Navbar/NavbarSettingsManager';
import BannerSettingsManager from './Admin/Banner/BannerSettingsManager';
import ServiceSettingsManager from './Admin/Service/ServiceSettingManager';
import ClientLogoSettings from './Admin/Cleint/ClientLogoSettings';
import ColorPaletteSettings from './Admin/Color/ColorPaletteSettings';
import AdminInquiries from './Admin/Contact/AdminInquiries';
import PageVisibilitySettings from './Admin/PageVisibility/PageVisibilitySettings';
import VideoSettingsManager from './Admin/video/VideoSettingsManager';
import AdminDashboard from './Admin/AdminDashboard/AdminDashboard';
import ThemeProvider from './Website/Themes/ThemeProvider';
import AdminSettings from './Admin/Settiing/AdminSettings';
import Project from './Website/Project/Project';
import TeamGalleryManager from './Admin/About/TeamGalleryManager';
import HomeAboutSettingManager from './Admin/HomeAbout/HomeSettingManager';

// ---------- PRIVATE ROUTE GUARD ----------
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// 1. PUBLIC LAYOUT (Navbar + Content + Footer)
const PublicLayout = () => (
  <>
    <Navbar />
    <div className="main-content">
      <Outlet />
    </div>
    <Footer />
  </>
);

// 2. ADMIN LAYOUT (Responsive: Sidebar + Content) – wrapped with PrivateRoute
const AdminLayout = () => (
  <PrivateRoute>
    <div className="admin-layout-container">
      <div className="admin-sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="admin-content-wrapper">
        <Outlet />
      </div>
    </div>
  </PrivateRoute>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // ---------- ENHANCED ANTI-COPY & ANTI-SCREENSHOT (Laptop + Mobile) ----------
  useEffect(() => {
    const protectionEnabled = localStorage.getItem('contentProtection') === 'true';
    if (!protectionEnabled) return;

    // ----- 1. Disable right-click & long-press (mobile) -----
    const disableContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // ----- 2. Disable text & image selection -----
    const disableSelection = (e) => {
      if (e.target.closest('input, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
    };

    // ----- 3. Blocker for all major keyboard shortcuts -----
    const blockShortcuts = (e) => {
      const forbidden = [
        { key: 'c', ctrl: true },          // Ctrl+C
        { key: 'a', ctrl: true },          // Ctrl+A (select all)
        { key: 's', ctrl: true },          // Ctrl+S
        { key: 'u', ctrl: true },          // Ctrl+U (view source)
        { key: 'p', ctrl: true },          // Ctrl+P (print)
        { key: 'x', ctrl: true },          // Ctrl+X
        { key: 'v', ctrl: true },          // Ctrl+V (paste - optional)
        { key: 'PrintScreen' },            // PrintScreen key
        { key: 'F12' },                    // DevTools
        { key: 'I', ctrl: true, shift: true }, // Ctrl+Shift+I
        { key: 'J', ctrl: true, shift: true }, // Ctrl+Shift+J
        { key: 'C', ctrl: true, shift: true }, // Ctrl+Shift+C
        { key: 'K', ctrl: true, shift: true }, // Ctrl+Shift+K (Firefox)
      ];

      for (const combo of forbidden) {
        if (combo.key === 'PrintScreen' && e.key === 'PrintScreen') {
          e.preventDefault();
          showWarningOverlay('⚠️ Screenshots are disabled');
          return;
        }
        if (
          e.key === combo.key &&
          !!e.ctrlKey === !!combo.ctrl &&
          !!e.shiftKey === !!combo.shift
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // ----- 4. Warn on mobile screenshot (visibility change) -----
    let visibilityTimeout;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showWarningOverlay('📸 Screenshot attempt detected!', 2000);
      }
    };

    // ----- 5. Overlay for warnings -----
    let overlay = null;
    const showWarningOverlay = (message, duration = 1500) => {
      if (overlay) return;
      overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-family: sans-serif;
        z-index: 99999;
        backdrop-filter: blur(5px);
        text-align: center;
        padding: 20px;
        pointer-events: none;
      `;
      overlay.innerText = message;
      document.body.appendChild(overlay);
      setTimeout(() => {
        if (overlay) overlay.remove();
        overlay = null;
      }, duration);
    };

    // ----- 6. Disable drag & drop (images, links) -----
    const disableDrag = (e) => e.preventDefault();

    // ----- 7. Disable copy/cut globally, allow only in inputs -----
    const disableCopyPaste = (e) => {
      if (e.target.closest('input, textarea')) return;
      e.preventDefault();
    };

    // ----- 8. Additional protection: periodic debugger to annoy DevTools -----
    let debugInterval;
    const enableDebugBlocker = () => {
      debugInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && window.outerWidth - window.innerWidth > 100) {
          // DevTools likely open
          console.clear();
          debugger;
        }
      }, 1000);
    };

    // ----- 9. Disable Print -----
    const beforePrint = (e) => {
      e.preventDefault();
      showWarningOverlay('🖨️ Printing is disabled on this website', 2000);
      return false;
    };

    // Attach all event listeners
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('dragstart', disableDrag);
    document.addEventListener('keydown', blockShortcuts);
    document.addEventListener('copy', disableCopyPaste);
    document.addEventListener('cut', disableCopyPaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeprint', beforePrint);
    enableDebugBlocker();

    // Add global CSS class to prevent text selection
    document.body.classList.add('no-copy');

    // Also disable all images from being draggable / context menu
    const disableImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
        img.style.webkitUserDrag = 'none';
        img.addEventListener('contextmenu', (e) => e.preventDefault());
      });
    };
    disableImages();
    // Observe for dynamically added images
    const observer = new MutationObserver(() => disableImages());
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup on unmount
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('dragstart', disableDrag);
      document.removeEventListener('keydown', blockShortcuts);
      document.removeEventListener('copy', disableCopyPaste);
      document.removeEventListener('cut', disableCopyPaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeprint', beforePrint);
      clearInterval(debugInterval);
      observer.disconnect();
      document.body.classList.remove('no-copy');
      if (overlay) overlay.remove();
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
    };
  }, []);
  // ---------- END OF PROTECTION CODE ----------

  // ---------- PAGE VISIBILITY HELPER (paths match your current routes) ----------
  const getVisiblePages = () => {
    const saved = localStorage.getItem('pageVisibility');
    if (!saved) {
      // Default: all pages visible (using exact route paths from below)
      return {
        '/': true,
        '/contact-us': true,
        '/gallery': true,
        '/clientele': true,
        '/about-us': true,
        '/services': true,
        '/projects': true,
      };
    }
    try {
      const pages = JSON.parse(saved);
      const visibilityMap = {};
      pages.forEach(page => {
        let routePath = page.path;
        // Map stored keys to actual route paths
        if (routePath === '/contact') routePath = '/contact-us';
        else if (routePath === '/cleint') routePath = '/clientele';
        else if (routePath === '/about') routePath = '/about-us';
        else if (routePath === '/Services') routePath = '/services';
        else if (routePath === '/project') routePath = '/projects';
        else if (routePath === '/gallery') routePath = '/gallery';
        else if (routePath === '/') routePath = '/';
        visibilityMap[routePath] = page.visible;
      });
      return visibilityMap;
    } catch (e) {
      return {
        '/': true,
        '/contact-us': true,
        '/gallery': true,
        '/clientele': true,
        '/about-us': true,
        '/services': true,
        '/projects': true,
      };
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader message="INITIALIZING PORTAL" />;

  const visible = getVisiblePages();

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES (conditionally included) --- */}
          <Route element={<PublicLayout />}>
            {visible['/'] && <Route path="/" element={<Home />} />}
            {visible['/contact-us'] && <Route path="/contact-us" element={<Contact />} />}
            {visible['/gallery'] && <Route path="/gallery" element={<Gallery />} />}
            {visible['/clientele'] && <Route path="/clientele" element={<Client />} />}
            {visible['/about-us'] && <Route path="/about-us" element={<About />} />}
            {visible['/services'] && <Route path="/services" element={<Services />} />}
            {visible['/projects'] && (
              <>
                <Route path="/projects" element={<Project />} />
              
              </>
            )}
          </Route>

          {/* --- ADMIN LOGIN (No Sidebar) --- */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* --- ADMIN ROUTES (with Sidebar) – all protected by AdminLayout which includes PrivateRoute --- */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/contact-settings" element={<ContactSettingsManager />} />
            <Route path="/admin/footer-settings" element={<AdminFooterEditor />} />
            <Route path="/admin/home-settings" element={<BannerSettingsManager />} />
            <Route path="/admin/service-settings" element={<ServiceSettingsManager />} />
            <Route path="/admin/Client" element={<ClientLogoSettings />} />
            <Route path="/admin/project-settings" element={<ProjectSettingsManager />} />
            <Route path="/admin/about-settings" element={<AboutSettingsManager />} />
            <Route path="/admin/gallery" element={<GallerySettingManager />} />
            <Route path="/admin/navbar-settings" element={<NavbarSettingsManager />} />
            <Route path="/admin/colorPalette" element={<ColorPaletteSettings />} />
            <Route path="/admin/Admin-inquiry" element={<AdminInquiries />} />
            <Route path="/admin/sidebar" element={<Sidebar />} />
            <Route path="/admin/page-visibility" element={<PageVisibilitySettings />} />
            <Route path="/admin/video" element={<VideoSettingsManager />} />
             <Route path="/admin/Setting" element={<AdminSettings />} />
              <Route path="/admin/team" element={<TeamGalleryManager />} />
                 <Route path="/admin/homeSettings" element={<HomeAboutSettingManager />} />
          </Route>

          {/* --- REDIRECTS & FALLBACKS --- */}
          <Route path="/contact-admin" element={<Navigate to="/admin/contact-settings" replace />} />
          <Route path="/Admin-Footer" element={<Navigate to="/admin/footer-settings" replace />} />
          {/* Catch any hidden page or unknown path -> redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;