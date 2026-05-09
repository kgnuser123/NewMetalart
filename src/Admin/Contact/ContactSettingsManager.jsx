import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSave, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, 
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin, 
  FaArrowRight, FaArrowLeft, FaCheckCircle, FaCog, FaMap,
  FaPlus, FaEdit, FaTrash, FaTimes, FaList, FaGlobe
} from 'react-icons/fa';
import './ContactSettingsManager.css';

const ContactSettingsManager = () => {
  const [settingsList, setSettingsList] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Complete settings template with mapEmbedUrl
  const emptySettings = {
    name: '',
    address: { line1: '', line2: '', cityState: '' },
    phones: [''],
    emails: [''],
    workingHours: { weekdays: '', sunday: '' },
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' },
    formTitle: 'Send Us a Message',
    formDescription: '',
    showFullName: true,
    showEmail: true,
    showPhone: true,
    showSubject: true,
    showMessage: true,
    mapLatitude: 28.612763,
    mapLongitude: 77.408758,
    mapZoom: 15,
    googleMapsApiKey: '',
    mapEmbedUrl: ''     // ✅ Google Maps iframe embed URL
  };

  const [settings, setSettings] = useState({ ...emptySettings });

  // Fetch all settings from backend
  const fetchAllSettings = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/contact-settings');
      setSettingsList(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Fetch Error:", err);
      setMessage('❌ Failed to load settings');
      setSettingsList([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSettings();
  }, []);

  // Save (create or update)
  const handleSave = async () => {
    if (!settings.name.trim()) {
      setMessage('❌ Please enter a name/location');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      if (isEditing && currentId) {
        await axios.put(`http://localhost:5000/api/contact-settings/${currentId}`, settings);
        setMessage('✅ Settings updated!');
      } else {
        await axios.post('http://localhost:5000/api/contact-settings', settings);
        setMessage('✅ New contact settings added!');
      }
      await fetchAllSettings();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/contact-settings/${id}`);
        setMessage(`✅ "${name}" deleted`);
        await fetchAllSettings();
        if (currentId === id) resetForm();
      } catch (err) {
        setMessage('❌ Delete failed');
      } finally {
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleEdit = (item) => {
    const edited = {
      ...emptySettings,
      ...item,
      address: { ...emptySettings.address, ...(item.address || {}) },
      workingHours: { ...emptySettings.workingHours, ...(item.workingHours || {}) },
      socialLinks: { ...emptySettings.socialLinks, ...(item.socialLinks || {}) },
      phones: item.phones?.length ? [...item.phones] : [''],
      emails: item.emails?.length ? [...item.emails] : [''],
      mapEmbedUrl: item.mapEmbedUrl || ''
    };
    setSettings(edited);
    setIsEditing(true);
    setCurrentId(item._id);
    setCurrentStep(1);
    setShowForm(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditing(false);
    setCurrentId(null);
    setCurrentStep(1);
    setShowForm(true);
  };

  const resetForm = () => {
    setSettings({ ...emptySettings, name: '' });
    setIsEditing(false);
    setCurrentId(null);
  };

  // Helper functions
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value }
    }));
  };

  const handleArrayChange = (section, index, value) => {
    const arr = [...(settings[section] || [])];
    arr[index] = value;
    setSettings({ ...settings, [section]: arr });
  };

  const addArrayItem = (section) => {
    setSettings({ ...settings, [section]: [...(settings[section] || []), ''] });
  };

  const removeArrayItem = (section, index) => {
    const newArr = (settings[section] || []).filter((_, i) => i !== index);
    if (newArr.length === 0) newArr.push('');
    setSettings({ ...settings, [section]: newArr });
  };

  const handleSocialChange = (platform, value) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...(prev.socialLinks || {}), [platform]: value }
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: 'Contact Details', icon: <FaMapMarkerAlt /> },
    { number: 2, title: 'Form Config', icon: <FaEnvelope /> },
    { number: 3, title: 'Map Settings', icon: <FaMap /> }
  ];

  if (fetchLoading && settingsList.length === 0) {
    return <div className="settings-manager"><div className="loading-spinner">Loading settings...</div></div>;
  }

  return (
    <div className="settings-manager">
      <div className="manager-header">
        <h1>📋 Contact Page Content Manager</h1>
        <p className="subtitle">Manage multiple contact configurations (offices, branches)</p>
      </div>

      {message && <div className={`toast-message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

      <div className="list-header">
        <button onClick={handleAddNew} className="add-new-btn"><FaPlus /> Add New Contact Setting</button>
      </div>

      {!showForm ? (
        <div className="settings-list">
          {settingsList.length === 0 ? (
            <div className="no-items">No contact settings found. Click "Add New" to create one.</div>
          ) : (
            settingsList.map(item => (
              <div key={item._id || item.id} className="setting-card">
                <div className="card-info">
                  <strong>{item.name || 'Unnamed'}</strong>
                  <span className="card-location">{item.address?.cityState || 'No address'}</span>
                  <span className="card-email">{item.emails?.[0] || ''}</span>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(item)} className="edit-btn"><FaEdit /> Edit</button>
                  <button onClick={() => handleDelete(item._id || item.id, item.name)} className="delete-btn"><FaTrash /> Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="step-progress">
            {steps.map(step => (
              <div 
                key={step.number} 
                className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                onClick={() => setCurrentStep(step.number)}
              >
                <div className="step-circle">
                  {currentStep > step.number ? <FaCheckCircle /> : step.number}
                </div>
                <div className="step-label">
                  {step.icon} {step.title}
                </div>
              </div>
            ))}
          </div>

          <div className="step-content">
            {/* Step 1: Contact Details */}
            {currentStep === 1 && (
              <div className="settings-section fade-in">
                <div className="form-group">
                  <label>Setting Name *</label>
                  <input value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} />
                </div>
                <h2><FaMapMarkerAlt /> Address</h2>
                <div className="form-grid">
                  <input value={settings.address.line1} onChange={e => handleChange('address', 'line1', e.target.value)} placeholder="Line 1" />
                  <input value={settings.address.line2} onChange={e => handleChange('address', 'line2', e.target.value)} placeholder="Line 2" />
                  <input value={settings.address.cityState} onChange={e => handleChange('address', 'cityState', e.target.value)} placeholder="City, State, PIN" />
                </div>
                {/* Phones, Emails, Hours, Social links – same as before */}
                <div className="form-group">
                  <label>Phone Numbers</label>
                  {settings.phones.map((phone, idx) => (
                    <div key={idx} className="array-item">
                      <input value={phone} onChange={e => handleArrayChange('phones', idx, e.target.value)} />
                      <button onClick={() => removeArrayItem('phones', idx)} className="remove-btn">✖</button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('phones')} className="add-btn">+ Add Phone</button>
                </div>

                <div className="form-group">
                  <label>Email Addresses</label>
                  {settings.emails.map((email, idx) => (
                    <div key={idx} className="array-item">
                      <input value={email} onChange={e => handleArrayChange('emails', idx, e.target.value)} />
                      <button onClick={() => removeArrayItem('emails', idx)} className="remove-btn">✖</button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('emails')} className="add-btn">+ Add Email</button>
                </div>

                <div className="form-row">
                  <input value={settings.workingHours.weekdays} onChange={e => handleChange('workingHours', 'weekdays', e.target.value)} placeholder="Weekdays Hours" />
                  <input value={settings.workingHours.sunday} onChange={e => handleChange('workingHours', 'sunday', e.target.value)} placeholder="Sunday Hours" />
                </div>

                <div className="form-group">
                  <label>Social Links</label>
                  <div className="social-inputs">
                    <div><FaFacebook /> <input value={settings.socialLinks.facebook} onChange={e => handleSocialChange('facebook', e.target.value)} placeholder="Facebook URL" /></div>
                    <div><FaInstagram /> <input value={settings.socialLinks.instagram} onChange={e => handleSocialChange('instagram', e.target.value)} placeholder="Instagram URL" /></div>
                    <div><FaTwitter /> <input value={settings.socialLinks.twitter} onChange={e => handleSocialChange('twitter', e.target.value)} placeholder="Twitter URL" /></div>
                    <div><FaLinkedin /> <input value={settings.socialLinks.linkedin} onChange={e => handleSocialChange('linkedin', e.target.value)} placeholder="LinkedIn URL" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Form Configuration */}
            {currentStep === 2 && (
              <div className="settings-section fade-in">
                <h2><FaEnvelope /> Form Config</h2>
                <div className="form-group">
                  <label>Form Title</label>
                  <input value={settings.formTitle} onChange={e => setSettings({...settings, formTitle: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Form Description</label>
                  <textarea rows="3" value={settings.formDescription} onChange={e => setSettings({...settings, formDescription: e.target.value})} />
                </div>
                <h3>Fields to show</h3>
                <div className="checkbox-group">
                  <label><input type="checkbox" checked={settings.showFullName} onChange={e => setSettings({...settings, showFullName: e.target.checked})} /> Full Name</label>
                  <label><input type="checkbox" checked={settings.showEmail} onChange={e => setSettings({...settings, showEmail: e.target.checked})} /> Email</label>
                  <label><input type="checkbox" checked={settings.showPhone} onChange={e => setSettings({...settings, showPhone: e.target.checked})} /> Phone</label>
                  <label><input type="checkbox" checked={settings.showSubject} onChange={e => setSettings({...settings, showSubject: e.target.checked})} /> Subject</label>
                  <label><input type="checkbox" checked={settings.showMessage} onChange={e => setSettings({...settings, showMessage: e.target.checked})} /> Message</label>
                </div>
              </div>
            )}

            {/* Step 3: Map Settings (with embed URL) */}
            {currentStep === 3 && (
              <div className="settings-section fade-in">
                <h2><FaMap /> Map Settings</h2>
                <div className="form-row">
                  <input type="number" step="any" value={settings.mapLatitude} onChange={e => setSettings({...settings, mapLatitude: parseFloat(e.target.value)})} placeholder="Latitude" />
                  <input type="number" step="any" value={settings.mapLongitude} onChange={e => setSettings({...settings, mapLongitude: parseFloat(e.target.value)})} placeholder="Longitude" />
                </div>
                <div className="form-row">
                  <input type="number" step="1" min="1" max="20" value={settings.mapZoom} onChange={e => setSettings({...settings, mapZoom: parseInt(e.target.value)})} placeholder="Zoom" />
                  <input value={settings.googleMapsApiKey} onChange={e => setSettings({...settings, googleMapsApiKey: e.target.value})} placeholder="Google API Key" />
                </div>
                <div className="form-group">
                  <label><FaGlobe /> Google Maps Embed URL (optional)</label>
                  <input 
                    type="text" 
                    value={settings.mapEmbedUrl} 
                    onChange={e => setSettings({...settings, mapEmbedUrl: e.target.value})} 
                    placeholder="https://www.google.com/maps/embed?pb=..." 
                  />
                  <small>If provided, this embed URL overrides Latitude/Longitude for the map.</small>
                </div>
              </div>
            )}
          </div>

          <div className="step-navigation">
            {currentStep > 1 && (
              <button onClick={prevStep} className="nav-btn prev"><FaArrowLeft /> Previous</button>
            )}
            {currentStep < 3 ? (
              <button onClick={nextStep} className="nav-btn next">Next <FaArrowRight /></button>
            ) : (
              <button onClick={handleSave} className="save-btn" disabled={loading}>
                <FaSave /> {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
              </button>
            )}
            <button onClick={() => setShowForm(false)} className="cancel-btn"><FaTimes /> Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactSettingsManager;