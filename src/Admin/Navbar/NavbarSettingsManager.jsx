import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaCloudUploadAlt, FaSave, FaFacebook, FaInstagram,
  FaWhatsapp, FaEnvelope, FaPhoneAlt, FaTrash,
  FaGripVertical, FaPlus, FaUndo, FaCheckCircle,
  FaChevronDown, FaChevronRight, FaFolder, FaFolderOpen
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AdminNavbar.css';

const NavbarSettingsManager = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');
  const [formData, setFormData] = useState({
    emails: [],
    phones: [],
    facebook: '',
    instagram: '',
    whatsapp: '',
    menuItems: []      // New hierarchical menu structure
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [expandedParents, setExpandedParents] = useState({}); // UI state for dropdown expansion in admin

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/navbar');
      const data = res.data;
      setCurrentLogoUrl(data.logo || '');
      setFormData({
        emails: data.emails || [],
        phones: data.phones || [],
        facebook: data.social?.facebook || '',
        instagram: data.social?.instagram || '',
        whatsapp: data.social?.whatsapp || '',
        menuItems: data.menuItems || [
          { name: 'HOME', path: '/' },
          { name: 'ABOUT', path: '/about' },
          { 
            name: 'SERVICES', 
            path: '#', 
            children: [
              { name: 'Metal Fabrication', path: '/services' },
              { name: 'CNC Cutting', path: '/services' },
              { name: 'Laser Engraving', path: '/services' }
            ]
          },
          {
            name: 'PROJECTS',
            path: '#',
            children: [
              { name: 'Industrial', path: '/projects?cat=industrial' },
              { name: 'Architectural', path: '/projects?cat=architectural' },
              { name: 'Custom', path: '/projects?cat=custom' }
            ]
          },
          { name: 'CLIENT', path: '/client' },
          { name: 'GALLERY', path: '/gallery' },
          { name: 'CONTACT', path: '/contact' }
        ]
      });
    } catch (err) {
      setMessage({ text: 'Failed to load settings', type: 'error' });
    }
  };

  // ----- Email / Phone / Social handlers (unchanged) -----
  const addEmail = () => setFormData({ ...formData, emails: [...formData.emails, ''] });
  const updateEmail = (idx, val) => { const upd = [...formData.emails]; upd[idx] = val; setFormData({ ...formData, emails: upd }); };
  const removeEmail = (idx) => { const upd = formData.emails.filter((_, i) => i !== idx); setFormData({ ...formData, emails: upd }); };
  const addPhone = () => setFormData({ ...formData, phones: [...formData.phones, ''] });
  const updatePhone = (idx, val) => { const upd = [...formData.phones]; upd[idx] = val; setFormData({ ...formData, phones: upd }); };
  const removePhone = (idx) => { const upd = formData.phones.filter((_, i) => i !== idx); setFormData({ ...formData, phones: upd }); };
  const handleSocialChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ----- Hierarchical Menu Helpers -----
  const toggleExpand = (parentIdx) => {
    setExpandedParents(prev => ({ ...prev, [parentIdx]: !prev[parentIdx] }));
  };

  // Add a new top-level item
  const addTopLevelItem = () => {
    const newItem = { name: 'NEW LINK', path: '/' };
    setFormData({ ...formData, menuItems: [...formData.menuItems, newItem] });
  };

  // Add a child to a parent item
  const addChildItem = (parentIdx) => {
    const updated = [...formData.menuItems];
    if (!updated[parentIdx].children) updated[parentIdx].children = [];
    updated[parentIdx].children.push({ name: 'NEW CHILD', path: '/' });
    setFormData({ ...formData, menuItems: updated });
    // Auto-expand the parent to show new child
    setExpandedParents(prev => ({ ...prev, [parentIdx]: true }));
  };

  // Update item (parent or child) name/path
  const updateMenuItem = (parentIdx, childIdx, field, value) => {
    const updated = [...formData.menuItems];
    if (childIdx === undefined) {
      updated[parentIdx][field] = field === 'name' ? value.toUpperCase() : value;
    } else {
      updated[parentIdx].children[childIdx][field] = field === 'name' ? value.toUpperCase() : value;
    }
    setFormData({ ...formData, menuItems: updated });
  };

  // Delete item (with confirmation)
  const confirmDeleteItem = (parentIdx, childIdx = null) => {
    const name = childIdx === null ? formData.menuItems[parentIdx].name : formData.menuItems[parentIdx].children[childIdx].name;
    if (window.confirm(`Delete "${name}"?`)) {
      const updated = [...formData.menuItems];
      if (childIdx === null) {
        updated.splice(parentIdx, 1);
      } else {
        updated[parentIdx].children.splice(childIdx, 1);
        if (updated[parentIdx].children.length === 0) delete updated[parentIdx].children;
      }
      setFormData({ ...formData, menuItems: updated });
      setMessage({ text: `Deleted ${name}`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    }
  };

  // Convert a flat array of items to draggable list (we'll use react-beautiful-dnd for top-level only)
  // For simplicity, we'll allow reordering of top-level items only.
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.menuItems);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setFormData({ ...formData, menuItems: items });
  };

  // Logo handling
  const onLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) { setMessage({ text: 'Please select an image file', type: 'error' }); return; }
      if (file.size > 2 * 1024 * 1024) { setMessage({ text: 'Image must be less than 2MB', type: 'error' }); return; }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validateUrls = () => {
    const urlFields = ['facebook', 'instagram', 'whatsapp'];
    for (let field of urlFields) {
      const val = formData[field];
      if (val && !val.startsWith('http')) {
        setMessage({ text: `${field} link must start with http:// or https://`, type: 'error' });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateUrls()) return;
    setLoading(true);
    setMessage({ text: '', type: '' });
    const data = new FormData();
    data.append('emails', JSON.stringify(formData.emails));
    data.append('phones', JSON.stringify(formData.phones));
    data.append('facebook', formData.facebook);
    data.append('instagram', formData.instagram);
    data.append('whatsapp', formData.whatsapp);
    data.append('menuItems', JSON.stringify(formData.menuItems));
    if (logoFile) data.append('logo', logoFile);
    try {
      const res = await axios.put('http://localhost:5000/api/navbar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCurrentLogoUrl(res.data.logo);
      setLogoPreview(null);
      setLogoFile(null);
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Error saving settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-nav-wrapper pro-nav">
      <header className="admin-nav-header">
        <div>
          <h1>Navigation & Branding</h1>
          <p>Manage logo, contacts, social media, and multi‑level menu</p>
        </div>
        <button className="btn-save-nav" onClick={handleSave} disabled={loading}>
          <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {message.text && (
        <div className={`toast-message ${message.type === 'error' ? 'error' : 'success'}`}>
          {message.type === 'success' && <FaCheckCircle />}
          {message.text}
        </div>
      )}

      <div className="admin-nav-grid">
        {/* Brand Card - unchanged */}
        <div className="nav-card brand-card">
          <h3>Brand Assets</h3>
          <div className="logo-upload-section">
            <div className="current-logo-preview">
              {logoPreview ? <img src={logoPreview} alt="Preview" /> : currentLogoUrl ? <img src={currentLogoUrl.startsWith('http') ? currentLogoUrl : `http://localhost:5000${currentLogoUrl}`} alt="Logo" /> : <div className="no-logo">UPLOAD LOGO</div>}
            </div>
            <div className="upload-controls">
              <label htmlFor="logo-upload" className="upload-label"><FaCloudUploadAlt /> {logoFile ? 'Change Logo' : 'Upload Logo'}<input type="file" id="logo-upload" hidden onChange={onLogoChange} accept="image/*" /></label>
              <p>PNG, JPG, WEBP · Max 2MB · 200x60px</p>
              {logoFile && <button className="undo-logo" onClick={() => { setLogoFile(null); setLogoPreview(null); }}><FaUndo /> Undo</button>}
            </div>
          </div>
        </div>

        {/* Emails - unchanged */}
        <div className="nav-card">
          <h3>Email Addresses</h3>
          <div className="multi-contact-list">
            {formData.emails.map((email, idx) => (
              <div key={idx} className="contact-row"><FaEnvelope className="contact-icon" /><input type="email" value={email} onChange={(e) => updateEmail(idx, e.target.value)} /><button className="remove-contact" onClick={() => removeEmail(idx)}><FaTrash /></button></div>
            ))}
            <button className="add-contact-btn" onClick={addEmail}><FaPlus /> Add Email</button>
          </div>
        </div>

        {/* Phones - unchanged */}
        <div className="nav-card">
          <h3>Phone Numbers</h3>
          <div className="multi-contact-list">
            {formData.phones.map((phone, idx) => (
              <div key={idx} className="contact-row"><FaPhoneAlt className="contact-icon" /><input type="text" value={phone} onChange={(e) => updatePhone(idx, e.target.value)} /><button className="remove-contact" onClick={() => removePhone(idx)}><FaTrash /></button></div>
            ))}
            <button className="add-contact-btn" onClick={addPhone}><FaPlus /> Add Phone</button>
          </div>
        </div>

        {/* Social Media - unchanged */}
        <div className="nav-card social-card">
          <h3>Social Media Links</h3>
          <div className="social-inputs">
            <div className="social-row"><span className="icon fb"><FaFacebook /></span><input type="text" name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={handleSocialChange} /></div>
            <div className="social-row"><span className="icon insta"><FaInstagram /></span><input type="text" name="instagram" placeholder="Instagram URL" value={formData.instagram} onChange={handleSocialChange} /></div>
            <div className="social-row"><span className="icon wa"><FaWhatsapp /></span><input type="text" name="whatsapp" placeholder="WhatsApp chat link" value={formData.whatsapp} onChange={handleSocialChange} /></div>
          </div>
        </div>

        {/* Hierarchical Menu Editor */}
        <div className="nav-card full-width">
          <h3>Navigation Menu (Drag to reorder, add dropdowns)</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="menu-items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="menu-builder">
                  {formData.menuItems.map((item, idx) => (
                    <Draggable key={idx} draggableId={`parent-${idx}`} index={idx}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="menu-parent-item">
                          <div className="menu-parent-header">
                            <span {...provided.dragHandleProps} className="drag-handle"><FaGripVertical /></span>
                            <button className="expand-btn" onClick={() => toggleExpand(idx)}>
                              {expandedParents[idx] ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateMenuItem(idx, undefined, 'name', e.target.value)}
                              className="parent-name-input"
                              placeholder="Menu Name"
                            />
                            <input
                              type="text"
                              value={item.path}
                              onChange={(e) => updateMenuItem(idx, undefined, 'path', e.target.value)}
                              className="parent-path-input"
                              placeholder="URL (e.g., /services)"
                            />
                            <div className="parent-actions">
                              <button className="add-child-btn" onClick={() => addChildItem(idx)} title="Add dropdown item"><FaPlus /> Child</button>
                              <button className="delete-parent-btn" onClick={() => confirmDeleteItem(idx)}><FaTrash /></button>
                            </div>
                          </div>
                          {expandedParents[idx] && item.children && item.children.length > 0 && (
                            <div className="menu-children-list">
                              {item.children.map((child, childIdx) => (
                                <div key={childIdx} className="menu-child-item">
                                  <FaFolderOpen className="child-icon" />
                                  <input
                                    type="text"
                                    value={child.name}
                                    onChange={(e) => updateMenuItem(idx, childIdx, 'name', e.target.value)}
                                    className="child-name-input"
                                    placeholder="Child Name"
                                  />
                                  <input
                                    type="text"
                                    value={child.path}
                                    onChange={(e) => updateMenuItem(idx, childIdx, 'path', e.target.value)}
                                    className="child-path-input"
                                    placeholder="URL"
                                  />
                                  <button className="delete-child-btn" onClick={() => confirmDeleteItem(idx, childIdx)}><FaTrash /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="menu-actions">
            <button className="add-menu-btn" onClick={addTopLevelItem}><FaPlus /> Add Top Level Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSettingsManager;