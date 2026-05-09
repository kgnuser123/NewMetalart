// ColorPaletteSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ColorPaletteSettings.css';

const DEFAULT_PALETTE = {
  navbarBg: '#1e1e2a',
  navbarText: '#ffffff',
  navbarHover: '#b88b4a',
  sidebarBg: '#2d2d3a',
  sidebarText: '#e2e2e6',
  sidebarIcon: '#b88b4a',
  sidebarActiveBg: 'rgba(184, 139, 74, 0.15)',
  sidebarActiveText: '#b88b4a',
  mainBg: '#f8f9fc',
  mainText: '#1e1e2a',
  headingColor: '#b88b4a',
  primaryBtnBg: '#b88b4a',
  primaryBtnText: '#ffffff',
  primaryBtnHover: '#9c6e3e',
  secondaryBtnBg: 'transparent',
  secondaryBtnText: '#b88b4a',
  secondaryBtnHover: 'rgba(184, 139, 74, 0.1)',
  cardBg: '#ffffff',
  cardBorder: 'rgba(0, 0, 0, 0.08)',
  footerBg: '#1e1e2a',
  footerText: '#cbd5e1',
  footerLink: '#b88b4a',
  linkColor: '#b88b4a',
  linkHover: '#9c6e3e',
  inputBorder: 'rgba(0, 0, 0, 0.15)',
  inputFocus: '#b88b4a',
};

const presetThemes = {
  bronze: { ...DEFAULT_PALETTE, navbarHover: '#b88b4a', primaryBtnBg: '#b88b4a'},
  blue: { ...DEFAULT_PALETTE, navbarHover: '#3b82f6', primaryBtnBg: '#3b82f6'},
  green: { ...DEFAULT_PALETTE, navbarHover: '#10b981', primaryBtnBg: '#10b981'},
  purple: { ...DEFAULT_PALETTE, navbarHover: '#8b5cf6', primaryBtnBg: '#8b5cf6'},
};

const colorSections = {
  navbar: [
    { key: 'navbarBg', label: 'Navbar Background' },
    { key: 'navbarText', label: 'Navbar Text' },
    { key: 'navbarHover', label: 'Navbar Link Hover' },
  ],
  sidebar: [
    { key: 'sidebarBg', label: 'Sidebar Background' },
    { key: 'sidebarText', label: 'Sidebar Text' },
    { key: 'sidebarIcon', label: 'Sidebar Icons' },
    { key: 'sidebarActiveBg', label: 'Active Item Background' },
    { key: 'sidebarActiveText', label: 'Active Item Text' },
  ],
  main: [
    { key: 'mainBg', label: 'Main Content Background' },
    { key: 'mainText', label: 'Main Text Color' },
    { key: 'headingColor', label: 'Headings Color' },
  ],
  buttons: [
    { key: 'primaryBtnBg', label: 'Primary Button Background' },
    { key: 'primaryBtnText', label: 'Primary Button Text' },
    { key: 'primaryBtnHover', label: 'Primary Button Hover' },
    { key: 'secondaryBtnBg', label: 'Secondary Button Background' },
    { key: 'secondaryBtnText', label: 'Secondary Button Text' },
    { key: 'secondaryBtnHover', label: 'Secondary Button Hover' },
  ],
  cards: [
    { key: 'cardBg', label: 'Card Background' },
    { key: 'cardBorder', label: 'Card Border' },
  ],
  footer: [
    { key: 'footerBg', label: 'Footer Background' },
    { key: 'footerText', label: 'Footer Text' },
    { key: 'footerLink', label: 'Footer Links' },
  ],
  links: [
    { key: 'linkColor', label: 'Link Color' },
    { key: 'linkHover', label: 'Link Hover Color' },
  ],
  inputs: [
    { key: 'inputBorder', label: 'Input Border' },
    { key: 'inputFocus', label: 'Input Focus Border' },
  ],
};

const ColorPaletteSettings = () => {
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [activeSection, setActiveSection] = useState('navbar');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Apply CSS variables to :root
  const applyCssVariables = (pal) => {
    const root = document.documentElement;
    Object.entries(pal).forEach(([key, value]) => {
      const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
    localStorage.setItem('themeVersion', Date.now().toString());
  };

  useEffect(() => {
    const fetchPalette = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/colors');
        setPalette(res.data);
        applyCssVariables(res.data);
      } catch (err) {
        console.error('Error fetching colors:', err);
        setToast('Failed to load colors');
        applyCssVariables(DEFAULT_PALETTE);
      } finally {
        setLoading(false);
      }
    };
    fetchPalette();
  }, []);

  const updateLocalColor = (key, value) => {
    setPalette(prev => ({ ...prev, [key]: value }));
  };

  const savePalette = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/colors', palette);
      applyCssVariables(palette);
      setToast('✅ Colors saved & applied globally!');
      setTimeout(() => setToast(''), 2500);
    } catch (err) {
      console.error(err);
      setToast('❌ Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    setPalette(DEFAULT_PALETTE);
    try {
      await axios.put('http://localhost:5000/api/colors', DEFAULT_PALETTE);
      applyCssVariables(DEFAULT_PALETTE);
      setToast('Reset to default');
      setTimeout(() => setToast(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const applyPreset = async (presetName) => {
    const newPalette = presetThemes[presetName];
    setPalette(newPalette);
    try {
      await axios.put('http://localhost:5000/api/colors', newPalette);
      applyCssVariables(newPalette);
      setToast(`${presetName} theme applied`);
      setTimeout(() => setToast(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="acp-loading">Loading color settings...</div>;

  const currentItems = colorSections[activeSection] || [];

  return (
    <div className="advanced-color-palette">
      <div className="acp-header">
        <h2>🎨 Section‑wise Color Palette</h2>
        <p>Change colors per section – then click <strong>Update Colors</strong> to save & apply to live website</p>
        {toast && <div className="acp-toast">{toast}</div>}
      </div>

      <div className="acp-presets">
        <h3>Quick Presets</h3>
        <div className="preset-buttons">
          <button onClick={() => applyPreset('bronze')}>Bronze</button>
          <button onClick={() => applyPreset('blue')}>Blue</button>
          <button onClick={() => applyPreset('green')}>Green</button>
          <button onClick={() => applyPreset('purple')}>Purple</button>
          <button onClick={resetToDefault}>Reset to Default</button>
        </div>
      </div>

      <div className="acp-sections">
        <div className="section-tabs">
          {Object.keys(colorSections).map(section => (
            <button key={section} className={`section-tab ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        <div className="section-content">
          {currentItems.map(item => (
            <div key={item.key} className="color-row">
              <label>{item.label}</label>
              <div className="color-control">
                <input
                  type="color"
                  value={palette[item.key] || '#000000'}
                  onChange={(e) => updateLocalColor(item.key, e.target.value)}
                />
                <span>{palette[item.key]}</span>
                <div className="color-preview" style={{ backgroundColor: palette[item.key] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="acp-actions">
        <button className="btn-update" onClick={savePalette} disabled={saving}>
          {saving ? 'Saving...' : '💾 Update Colors'}
        </button>
      </div>

      <div className="acp-note">
        <i className="fas fa-info-circle"></i> Changes are only saved when you click <strong>Update Colors</strong>.
      </div>
    </div>
  );
};

export default ColorPaletteSettings;