import React, { useState, useEffect } from 'react';
import { FaTimes, FaUpload, FaImage } from 'react-icons/fa';
import './Form.css';

const Form = ({ project, onClose }) => {
  const [formData, setFormData] = useState({
    _id: null,
    title: '',
    category: '',
    description: '',
    longDescription: '',
    thumbnail: '',
    images: [],
    status: 'active',
    dimensions: '',
    weight: '',
    material: '',
    materials: '',
    specifications: '',
    techniques: '',
    features: [],
    client: '',
    completionYear: '',
    location: ''
  });
  const [featuresInput, setFeaturesInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        _id: project._id || null,
        title: project.title || '',
        category: project.category || '',
        description: project.description || '',
        longDescription: project.longDescription || '',
        thumbnail: project.thumbnail || '',
        images: project.images || [],
        status: project.status || 'active',
        dimensions: project.dimensions || '',
        weight: project.weight || '',
        material: project.material || '',
        materials: project.materials || '',
        specifications: project.specifications || '',
        techniques: project.techniques || '',
        features: project.features || [],
        client: project.client || '',
        completionYear: project.completionYear || '',
        location: project.location || ''
      });
    } else {
      // Reset for new project
      setFormData({
        _id: null,
        title: '',
        category: '',
        description: '',
        longDescription: '',
        thumbnail: '',
        images: [],
        status: 'active',
        dimensions: '',
        weight: '',
        material: '',
        materials: '',
        specifications: '',
        techniques: '',
        features: [],
        client: '',
        completionYear: '',
        location: ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addFeature = () => {
    if (featuresInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featuresInput.trim()]
      });
      setFeaturesInput('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, thumbnail: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Prepare data to send: include _id if editing, otherwise omit
    const submitData = { ...formData };
    if (!submitData._id) {
      delete submitData._id;
    }
    // Call parent's onClose with the data
    await onClose(submitData);
    setLoading(false);
  };

  return (
    <div className="form-modal-overlay" onClick={() => onClose()}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <button className="form-modal-close" onClick={() => onClose()}><FaTimes /></button>
        <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-row">
            <input type="text" name="title" placeholder="Title (optional)" value={formData.title} onChange={handleChange} />
            <input type="text" name="category" placeholder="Category (optional)" value={formData.category} onChange={handleChange} />
          </div>
          <textarea name="description" placeholder="Short Description (optional)" rows="3" value={formData.description} onChange={handleChange}></textarea>
          <textarea name="longDescription" placeholder="Long Description (optional)" rows="5" value={formData.longDescription} onChange={handleChange}></textarea>

          {/* Client and Date */}
          <div className="form-row">
            <input type="text" name="client" placeholder="Client Name (optional)" value={formData.client} onChange={handleChange} />
            <input type="text" name="completionYear" placeholder="Completion Year / Date (optional)" value={formData.completionYear} onChange={handleChange} />
          </div>
          <input type="text" name="location" placeholder="Location (optional)" value={formData.location} onChange={handleChange} />

          {/* Specifications */}
          <div className="form-row">
            <input type="text" name="dimensions" placeholder="Dimensions (optional)" value={formData.dimensions} onChange={handleChange} />
            <input type="text" name="weight" placeholder="Weight (optional)" value={formData.weight} onChange={handleChange} />
            <input type="text" name="material" placeholder="Material (optional)" value={formData.material} onChange={handleChange} />
          </div>
          <input type="text" name="materials" placeholder="Materials used (optional)" value={formData.materials} onChange={handleChange} />
          <input type="text" name="specifications" placeholder="Specifications (optional)" value={formData.specifications} onChange={handleChange} />
          <input type="text" name="techniques" placeholder="Techniques (optional)" value={formData.techniques} onChange={handleChange} />

          {/* Features */}
          <div className="features-section">
            <label>Key Features (optional)</label>
            <div className="features-input">
              <input type="text" value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder="e.g., Handcrafted" />
              <button type="button" onClick={addFeature}>Add</button>
            </div>
            <div className="features-list">
              {formData.features.map((feat, idx) => (
                <span key={idx}>{feat} <button type="button" onClick={() => removeFeature(idx)}><FaTimes /></button></span>
              ))}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="image-upload">
            <label>Thumbnail Image</label>
            <div className="image-preview">
              {formData.thumbnail ? <img src={formData.thumbnail} alt="Thumbnail" /> : <div className="placeholder"><FaImage /></div>}
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} id="thumbnailUpload" />
              <label htmlFor="thumbnailUpload" className="upload-btn"><FaUpload /> Upload</label>
            </div>
          </div>

          {/* Additional Images */}
          <div className="image-upload">
            <label>Additional Images</label>
            <div className="images-grid">
              {formData.images.map((img, idx) => (
                <div key={idx} className="image-item">
                  <img src={img} alt={`img ${idx}`} />
                  <button type="button" onClick={() => removeImage(idx)}><FaTimes /></button>
                </div>
              ))}
              <label className="add-image-btn">
                <FaUpload /> Add Image
                <input type="file" accept="image/*" multiple onChange={handleImagesUpload} hidden />
              </label>
            </div>
          </div>

          {/* Status */}
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active (show on website)</option>
            <option value="inactive">Inactive (hide)</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (project ? 'Update Project' : 'Add Project')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;