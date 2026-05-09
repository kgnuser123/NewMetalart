import React, { useState, useEffect } from 'react';
import './PageVisibilitySettings.css';   // import the new CSS

const defaultPages = [
  { path: '/', name: 'Home', key: 'home' },
  { path: '/contact us', name: 'Contact', key: 'contact us' },
  { path: '/gallery', name: 'Gallery', key: 'gallery' },
  { path: '/cleint', name: 'Clients', key: 'client' },
  { path: '/about us', name: 'About', key: 'about us' },
  { path: '/Services', name: 'Services', key: 'services' },
  { path: '/project', name: 'Projects', key: 'project' },
];

const PageVisibilitySettings = () => {
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('pageVisibility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e) { return defaultPages; }
    }
    return defaultPages.map(p => ({ ...p, visible: true }));
  });

  const togglePage = (index) => {
    const updated = [...pages];
    updated[index].visible = !updated[index].visible;
    setPages(updated);
    localStorage.setItem('pageVisibility', JSON.stringify(updated));
    alert(`Page "${updated[index].name}" is now ${updated[index].visible ? 'visible' : 'hidden'}`);
  };

  return (
    <div className="page-visibility-container">
      <h2>Page Visibility Manager</h2>
      <p>Toggle to show/hide pages on your website. Hidden pages will redirect to Home.</p>
      <table className="page-visibility-table">
        <thead>
          <tr><th>Page Name</th><th>Path</th><th>Visibility</th></tr>
        </thead>
        <tbody>
          {pages.map((page, idx) => (
            <tr key={page.key}>
              <td data-label="Page Name">{page.name}</td>
              <td data-label="Path">{page.path}</td>
              <td data-label="Visibility">
                <label className="toggle-switch">
                  <input type="checkbox" checked={page.visible} onChange={() => togglePage(idx)} />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">{page.visible ? 'Visible' : 'Hidden'}</span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="page-visibility-note">
        Hidden pages will automatically redirect to the homepage.
      </div>
    </div>
  );
};

export default PageVisibilitySettings;