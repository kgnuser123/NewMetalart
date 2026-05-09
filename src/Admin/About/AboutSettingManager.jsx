// AdminAbout.jsx - With Meet Our Founder & Enhanced What We Do
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSave, FaPlus, FaTrash, FaPen,
  FaRocket, FaEye, FaLayerGroup,
  FaUsers, FaBullseye, FaUpload,
  FaGripVertical, FaUndo, FaCheckCircle, FaUserTie
} from 'react-icons/fa';
import './AdminAbout.css';

const AboutSettingsManager = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General
  const [general, setGeneral] = useState({
    heroTitle: 'About',
    metallicWord: 'New Metal Art',
    heroSubtitle: 'Crafting excellence in metal since 1995 – your trusted partner for premium fabrication & finishing.',
  });

  // Story
  const [story, setStory] = useState({
    content: 'Founded in 1995, New Metal Art began as a small workshop with a big dream – to redefine metal craftsmanship in India. Over the past three decades, we have grown into a premier metal fabrication and finishing company...',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600'
  });

  // Mission & Vision
  const [missionVision, setMissionVision] = useState({
    mission: 'To deliver superior metal solutions that exceed expectations...',
    vision: 'To become India\'s leading metal fabrication brand...'
  });

  // Meet Our Founder
  const [founder, setFounder] = useState({
    heading: 'Meet Our Founder',
    description: 'With over 30 years of experience in the metal industry, our founder laid the foundation of New Metal Art on principles of hard work, integrity, and a passion for metal craftsmanship.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
  });

  // Core Values
  const [values, setValues] = useState([
    { id: 1, icon: 'FaTrophy', title: 'Excellence', desc: 'Uncompromising quality' },
    { id: 2, icon: 'FaHandshake', title: 'Integrity', desc: 'Honest and transparent dealings' },
    { id: 3, icon: 'FaLightbulb', title: 'Innovation', desc: 'Constantly evolving techniques' },
  ]);

  // What We Do (enhanced with section heading & description)
  const [whatWeDoHeading, setWhatWeDoHeading] = useState('What We Do');
  const [whatWeDoDescription, setWhatWeDoDescription] = useState(
    'We provide end-to-end metal solutions, from custom designs to flawless finishing.'
  );
  const [whatWeDo, setWhatWeDo] = useState([
    { id: 1, icon: 'FaHammer', title: 'Metal Fabrication', description: 'Precision cutting, welding, and assembly for industrial and architectural metal structures.' },
    { id: 2, icon: 'FaRulerCombined', title: 'Custom Design', description: 'Tailored metal solutions – from CAD drawings to unique sculptural pieces.' },
    { id: 3, icon: 'FaPaintRoller', title: 'Finishing & Coating', description: 'Powder coating, galvanising, and high‑durability finishes.' },
    { id: 4, icon: 'FaLaserFocus', title: 'Laser Cutting', description: 'High‑precision laser cutting for intricate patterns and industrial components.' },
  ]);

  const iconOptions = [
    'FaHammer', 'FaRulerCombined', 'FaPaintRoller', 'FaLaserFocus',
    'FaCog', 'FaWrench', 'FaIndustry', 'FaCrosshairs', 'FaCheckCircle'
  ];

  // CRUD for What We Do
  const addWhatWeDo = () => {
    const newId = Date.now();
    setWhatWeDo([...whatWeDo, { id: newId, icon: 'FaHammer', title: 'New Service', description: 'Description here' }]);
  };
  const updateWhatWeDo = (id, field, value) => {
    setWhatWeDo(whatWeDo.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const deleteWhatWeDo = (id) => {
    if (window.confirm('Delete this service?')) {
      setWhatWeDo(whatWeDo.filter(item => item.id !== id));
    }
  };

  // CRUD for Core Values
  const addValue = () => {
    const newId = Date.now();
    setValues([...values, { id: newId, icon: 'FaCheckCircle', title: 'New Value', desc: 'Description here' }]);
  };
  const updateValue = (id, field, value) => setValues(values.map(v => v.id === id ? { ...v, [field]: value } : v));
  const deleteValue = (id) => window.confirm('Delete this value?') && setValues(values.filter(v => v.id !== id));

  // Fetch data (including new fields)
  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/about');
      const data = res.data;
      setGeneral(data.general || general);
      setStory(data.story || story);
      setMissionVision(data.missionVision || missionVision);
      setFounder(data.founder || founder);
      setValues(data.values || values);
      setWhatWeDoHeading(data.whatWeDoHeading || whatWeDoHeading);
      setWhatWeDoDescription(data.whatWeDoDescription || whatWeDoDescription);
      setWhatWeDo(data.whatWeDo || whatWeDo);
    } catch (err) {
      console.error('Error fetching about data:', err);
      alert('Failed to load about data. Using defaults.');
    } finally {
      setLoading(false);
    }
  };

  // Save data (including founder & whatWeDo heading/description)
  const saveChanges = async () => {
    try {
      setSaving(true);
      const payload = {
        general,
        story,
        missionVision,
        founder,
        values,
        whatWeDoHeading,
        whatWeDoDescription,
        whatWeDo
      };
      await axios.put('http://localhost:5000/api/about', payload);
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = async () => {
    if (window.confirm('Reset all changes to last saved version?')) {
      await fetchAboutData();
      alert('Reset to last saved version.');
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Handlers
  const handleGeneralChange = (e) => setGeneral({ ...general, [e.target.name]: e.target.value });
  const handleStoryChange = (e) => setStory({ ...story, content: e.target.value });
  const handleStoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setStory({ ...story, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // Founder handlers
  const handleFounderChange = (field, value) => setFounder({ ...founder, [field]: value });
  const handleFounderImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFounder({ ...founder, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const LivePreview = () => (
    <div className="live-preview glass-card">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <button onClick={() => setPreviewMode(false)}>✕</button>
      </div>
      <div className="preview-content">
        <h1>{general.heroTitle} <span className="metallic">{general.metallicWord}</span></h1>
        <p>{general.heroSubtitle}</p>
        <hr />
        <div className="preview-story">
          <p>{story.content.substring(0, 150)}...</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="pro-admin-container"><div className="loader">Loading about data...</div></div>;
  }

  return (
    <div className="pro-admin-container">
      <header className="pro-admin-header">
        <div className="header-info">
          <h1><FaLayerGroup /> About Page Customizer</h1>
          <p>Update your company's identity, founder story, and services.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setPreviewMode(!previewMode)}>
            <FaEye /> {previewMode ? 'Hide Preview' : 'Live Preview'}
          </button>
          <button className="btn-secondary" onClick={resetChanges} disabled={saving}><FaUndo /> Reset</button>
          <button className="btn-primary" onClick={saveChanges} disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </header>

      <div className="status-ribbon">
        <div className="status-item"><span>Last Edited:</span> <strong>{new Date().toLocaleString()}</strong></div>
        <div className="status-item"><span>Status:</span> <span className="badge-online">Live</span></div>
      </div>

      <div className="admin-layout-main">
        <aside className="content-tabs">
          <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}><FaLayerGroup /> General Info</button>
          <button className={activeTab === 'story' ? 'active' : ''} onClick={() => setActiveTab('story')}><FaPen /> Our Story</button>
          <button className={activeTab === 'mission' ? 'active' : ''} onClick={() => setActiveTab('mission')}><FaBullseye /> Mission & Vision</button>
          <button className={activeTab === 'founder' ? 'active' : ''} onClick={() => setActiveTab('founder')}><FaUserTie /> Meet Founder</button>
          <button className={activeTab === 'values' ? 'active' : ''} onClick={() => setActiveTab('values')}><FaRocket /> Core Values</button>
          <button className={activeTab === 'whatwedo' ? 'active' : ''} onClick={() => setActiveTab('whatwedo')}><FaCheckCircle /> What We Do</button>
        </aside>

        <main className="content-editor">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="editor-card animate-fade-in">
              <h3>General Brand Settings</h3>
              <div className="input-row">
                <div className="form-group">
                  <label>Hero Title</label>
                  <input type="text" name="heroTitle" value={general.heroTitle} onChange={handleGeneralChange} />
                </div>
                <div className="form-group">
                  <label>Metallic Highlight Word</label>
                  <input type="text" name="metallicWord" value={general.metallicWord} onChange={handleGeneralChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Hero Subtitle</label>
                <textarea rows="3" name="heroSubtitle" value={general.heroSubtitle} onChange={handleGeneralChange}></textarea>
              </div>
            </div>
          )}

          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="editor-card animate-fade-in">
              <h3>Our Story</h3>
              <div className="form-group">
                <label>Story Content</label>
                <textarea rows="10" value={story.content} onChange={handleStoryChange}></textarea>
              </div>
              <div className="upload-zone">
                <label>Story Image</label>
                <div className="image-preview">
                  <img src={story.image} alt="Story" />
                  <input type="file" accept="image/*" onChange={handleStoryImageUpload} id="storyImage" hidden />
                  <button className="btn-add-small" onClick={() => document.getElementById('storyImage').click()}>
                    <FaUpload /> Change Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mission & Vision */}
          {activeTab === 'mission' && (
            <div className="editor-card animate-fade-in">
              <h3>Mission & Vision</h3>
              <div className="form-group">
                <label>Mission Statement</label>
                <textarea rows="4" value={missionVision.mission} onChange={(e) => setMissionVision({ ...missionVision, mission: e.target.value })}></textarea>
              </div>
              <div className="form-group">
                <label>Vision Statement</label>
                <textarea rows="4" value={missionVision.vision} onChange={(e) => setMissionVision({ ...missionVision, vision: e.target.value })}></textarea>
              </div>
            </div>
          )}

          {/* Meet Our Founder Tab */}
          {activeTab === 'founder' && (
            <div className="editor-card animate-fade-in">
              <h3>Meet Our Founder</h3>
              <div className="form-group">
                <label>Section Heading</label>
                <input
                  type="text"
                  value={founder.heading}
                  onChange={(e) => handleFounderChange('heading', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description / Bio</label>
                <textarea
                  rows="6"
                  value={founder.description}
                  onChange={(e) => handleFounderChange('description', e.target.value)}
                ></textarea>
              </div>
              <div className="upload-zone">
                <label>Founder Image</label>
                <div className="image-preview">
                  <img src={founder.image} alt="Founder" />
                  <input type="file" accept="image/*" onChange={handleFounderImageUpload} id="founderImage" hidden />
                  <button className="btn-add-small" onClick={() => document.getElementById('founderImage').click()}>
                    <FaUpload /> Change Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Core Values */}
          {activeTab === 'values' && (
            <div className="editor-card animate-fade-in">
              <div className="card-header">
                <h3>Core Values</h3>
                <button className="btn-add-small" onClick={addValue}><FaPlus /> Add Value</button>
              </div>
              <div className="values-list">
                {values.map(value => (
                  <div className="value-item-row" key={value.id}>
                    <FaGripVertical className="drag-handle" />
                    <input type="text" placeholder="Icon Name" value={value.icon} onChange={(e) => updateValue(value.id, 'icon', e.target.value)} />
                    <input type="text" placeholder="Title" value={value.title} onChange={(e) => updateValue(value.id, 'title', e.target.value)} />
                    <input type="text" placeholder="Description" value={value.desc} onChange={(e) => updateValue(value.id, 'desc', e.target.value)} />
                    <button className="btn-icon-trash" onClick={() => deleteValue(value.id)}><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What We Do Tab (now with heading & description inputs) */}
          {activeTab === 'whatwedo' && (
            <div className="editor-card animate-fade-in">
              <div className="card-header">
                <h3>What We Do – Section Settings</h3>
              </div>
              <div className="form-group">
                <label>Section Heading</label>
                <input
                  type="text"
                  value={whatWeDoHeading}
                  onChange={(e) => setWhatWeDoHeading(e.target.value)}
                  placeholder="e.g., What We Do"
                />
              </div>
              <div className="form-group">
                <label>Section Description</label>
                <textarea
                  rows="3"
                  value={whatWeDoDescription}
                  onChange={(e) => setWhatWeDoDescription(e.target.value)}
                  placeholder="Brief introduction for your services..."
                ></textarea>
              </div>
              <hr />
              <div className="card-header">
                <h3>Services List</h3>
                <button className="btn-add-small" onClick={addWhatWeDo}><FaPlus /> Add Service</button>
              </div>
              <div className="whatwedo-admin-list">
                {whatWeDo.map(item => (
                  <div className="whatwedo-item-row" key={item.id}>
                    <FaGripVertical className="drag-handle" />
                    <select value={item.icon} onChange={(e) => updateWhatWeDo(item.id, 'icon', e.target.value)}>
                      {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <input type="text" placeholder="Title" value={item.title} onChange={(e) => updateWhatWeDo(item.id, 'title', e.target.value)} />
                    <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateWhatWeDo(item.id, 'description', e.target.value)} />
                    <button className="btn-icon-trash" onClick={() => deleteWhatWeDo(item.id)}><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {previewMode && <LivePreview />}
    </div>
  );
};

export default AboutSettingsManager;