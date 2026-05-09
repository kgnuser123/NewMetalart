import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ThemeProvider = ({ children }) => {
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const applyTheme = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/colors');
        const palette = res.data;
        const root = document.documentElement;
        Object.entries(palette).forEach(([key, value]) => {
          const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          root.style.setProperty(cssVar, value);
        });
      } catch (err) {
        console.error('Failed to load theme:', err);
      } finally {
        setThemeReady(true);
      }
    };
    applyTheme();

    // Listen for theme changes from other tabs
    const handleStorage = (e) => {
      if (e.key === 'themeVersion') {
        applyTheme();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!themeReady) {
    return <div style={{ visibility: 'hidden' }}>Loading theme...</div>;
  }

  return <>{children}</>;
};

export default ThemeProvider;