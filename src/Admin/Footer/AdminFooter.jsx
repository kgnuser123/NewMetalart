import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminFooter.css';

const AdminFooterEditor = () => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch footer from backend on mount
  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/footer');
      setFooter(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load footer data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value, index = null) => {
    if (!footer) return;
    const newFooter = { ...footer };
    if (index !== null) {
      newFooter[section][index][field] = value;
    } else if (section) {
      newFooter[section][field] = value;
    } else {
      newFooter[field] = value;
    }
    setFooter(newFooter);
  };

  const addItem = (section) => {
    if (!footer) return;
    const newFooter = { ...footer };
    if (section === 'quickLinks') newFooter.quickLinks.push({ name: '', path: '/' });
    if (section === 'servicesLinks') newFooter.servicesLinks.push({ name: '', path: '/' });
    if (section === 'socialLinks') newFooter.socialLinks.push({ icon: 'FaFacebookF', url: '', label: '' });
    if (section === 'contactDetails') newFooter.contactDetails.push({ icon: 'FaMapMarkerAlt', text: '', link: '' });
    if (section === 'subFooterLinks') {
      newFooter.subFooter.links = [...(newFooter.subFooter.links || []), { name: '', path: '/' }];
    }
    setFooter(newFooter);
  };

  const removeItem = (section, index) => {
    if (!footer) return;
    const newFooter = { ...footer };
    if (section === 'subFooterLinks') {
      newFooter.subFooter.links.splice(index, 1);
    } else {
      newFooter[section].splice(index, 1);
    }
    setFooter(newFooter);
  };

  const handleSave = async () => {
    setSavedMessage('');
    setError('');
    try {
      await axios.put('http://localhost:5000/api/footer', footer);
      setSavedMessage('✅ Footer saved to MongoDB!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError('❌ Error saving footer');
    }
  };

  if (loading) return <div className="footer-editor glass-card"><div className="loader">Loading footer configuration...</div></div>;
  if (!footer) return <div className="footer-editor glass-card error">No footer data available</div>;
  if (error) return <div className="footer-editor glass-card error">{error}</div>;

  const iconOptions = ['FaFacebookF', 'FaInstagram', 'FaWhatsapp', 'FaYoutube', 'FaLinkedinIn'];
  const contactIconOptions = ['FaMapMarkerAlt', 'FaPhoneAlt', 'FaEnvelope', 'FaClock'];

  return (
    <div className="footer-editor glass-card">
      <h2>Footer Configuration</h2>
      {savedMessage && <div className="toast-message success">{savedMessage}</div>}
      {error && <div className="toast-message error">{error}</div>}

      <section>
        <h3>Brand Info</h3>
        <div className="form-row">
          <label>Logo Main Text</label>
          <input value={footer.logo?.text || ''} onChange={e => handleChange('logo', 'text', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Logo Metallic Part</label>
          <input value={footer.logo?.metallicPart || ''} onChange={e => handleChange('logo', 'metallicPart', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea rows="3" value={footer.description || ''} onChange={e => handleChange(null, 'description', e.target.value)} />
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h3>Quick Links</h3>
        {footer.quickLinks?.map((link, idx) => (
          <div key={idx} className="list-item">
            <input placeholder="Name" value={link.name || ''} onChange={e => handleChange('quickLinks', 'name', e.target.value, idx)} />
            <input placeholder="Path" value={link.path || ''} onChange={e => handleChange('quickLinks', 'path', e.target.value, idx)} />
            <button className="remove-btn" onClick={() => removeItem('quickLinks', idx)}>Remove</button>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('quickLinks')}>+ Add Link</button>
      </section>

      {/* Services Links */}
      <section>
        <h3>Services Links</h3>
        {footer.servicesLinks?.map((link, idx) => (
          <div key={idx} className="list-item">
            <input placeholder="Service Name" value={link.name || ''} onChange={e => handleChange('servicesLinks', 'name', e.target.value, idx)} />
            <input placeholder="Path" value={link.path || ''} onChange={e => handleChange('servicesLinks', 'path', e.target.value, idx)} />
            <button className="remove-btn" onClick={() => removeItem('servicesLinks', idx)}>Remove</button>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('servicesLinks')}>+ Add Service</button>
      </section>

      {/* Social Links */}
      <section>
        <h3>Social Media</h3>
        {footer.socialLinks?.map((social, idx) => (
          <div key={idx} className="list-item">
            <select value={social.icon || 'FaFacebookF'} onChange={e => handleChange('socialLinks', 'icon', e.target.value, idx)}>
              {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input placeholder="URL" value={social.url || ''} onChange={e => handleChange('socialLinks', 'url', e.target.value, idx)} />
            <input placeholder="Label" value={social.label || ''} onChange={e => handleChange('socialLinks', 'label', e.target.value, idx)} />
            <button className="remove-btn" onClick={() => removeItem('socialLinks', idx)}>Remove</button>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('socialLinks')}>+ Add Social</button>
      </section>

      {/* Contact Details */}
      <section>
        <h3>Contact Details</h3>
        {footer.contactDetails?.map((contact, idx) => (
          <div key={idx} className="list-item">
            <select value={contact.icon || 'FaMapMarkerAlt'} onChange={e => handleChange('contactDetails', 'icon', e.target.value, idx)}>
              {contactIconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input placeholder="Text" value={contact.text || ''} onChange={e => handleChange('contactDetails', 'text', e.target.value, idx)} />
            <input placeholder="Link (optional)" value={contact.link || ''} onChange={e => handleChange('contactDetails', 'link', e.target.value, idx)} />
            <button className="remove-btn" onClick={() => removeItem('contactDetails', idx)}>Remove</button>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('contactDetails')}>+ Add Contact</button>
      </section>

      {/* Sub-footer */}
      <section>
        <h3>Sub-footer</h3>
        <div className="form-row">
          <label>Copyright Text</label>
          <input value={footer.subFooter?.copyrightText || ''} onChange={e => handleChange('subFooter', 'copyrightText', e.target.value)} />
        </div>
        <h4>Legal Links</h4>
        {footer.subFooter?.links?.map((link, idx) => (
          <div key={idx} className="list-item">
            <input placeholder="Name" value={link.name || ''} onChange={(e) => {
              const newLinks = [...(footer.subFooter.links || [])];
              newLinks[idx].name = e.target.value;
              setFooter({ ...footer, subFooter: { ...footer.subFooter, links: newLinks } });
            }} />
            <input placeholder="Path" value={link.path || ''} onChange={(e) => {
              const newLinks = [...(footer.subFooter.links || [])];
              newLinks[idx].path = e.target.value;
              setFooter({ ...footer, subFooter: { ...footer.subFooter, links: newLinks } });
            }} />
            <button className="remove-btn" onClick={() => removeItem('subFooterLinks', idx)}>Remove</button>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('subFooterLinks')}>+ Add Legal Link</button>
      </section>

      <button className="save-btn" onClick={handleSave}>
        Save Changes (MongoDB)
      </button>
    </div>
  );
};

export default AdminFooterEditor;