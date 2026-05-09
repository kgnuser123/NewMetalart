import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaTrash, FaEdit, FaImage, FaCloudUploadAlt, FaFilter,
  FaTimes, FaSearch, FaCheck, FaCheckDouble, FaUpload, FaSpinner
} from 'react-icons/fa';
import './AdminGallery.css';

const API_URL = 'http://localhost:5000/api/gallery';

const GallerySettingManager = () => {
  const [activeTab, setActiveTab] = useState('industrial');
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentImage, setCurrentImage] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'industrial' });
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [imagePreview, setImagePreview] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch images from backend
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setImages(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Helper: show toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Get filtered images based on activeTab and search
  const getFilteredImages = () => {
    let filtered = images.filter(img => img.category === activeTab);
    if (searchTerm.trim()) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredImages = getFilteredImages();

  // Category counts
  const counts = {
    industrial: images.filter(i => i.category === 'industrial').length,
    architectural: images.filter(i => i.category === 'architectural').length,
    custom: images.filter(i => i.category === 'custom').length,
  };

  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFileUpload(files[0]);
  };

  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('File too large (max 2MB)', 'error');
      return;
    }
    setPendingFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setModalMode('add');
    setFormData({ title: '', category: activeTab });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (image) => {
    setModalMode('edit');
    setCurrentImage(image);
    setFormData({ title: image.title, category: image.category });
    setImagePreview(image.img);
    setPendingFile(null);
    setIsModalOpen(true);
  };

  // Save image (add or edit)
  const saveImage = async () => {
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    try {
      if (modalMode === 'add') {
        if (!pendingFile && !imagePreview) {
          showToast('Please select an image', 'error');
          return;
        }
        await axios.post(API_URL, {
          title: formData.title,
          category: formData.category,
          img: imagePreview
        });
        showToast('Image added successfully');
      } else {
        // edit
        await axios.put(`${API_URL}/${currentImage._id}`, {
          title: formData.title,
          category: formData.category,
          img: imagePreview || currentImage.img
        });
        showToast('Image updated successfully');
      }
      await fetchImages();
      closeModal();
    } catch (err) {
      console.error(err);
      showToast('Operation failed', 'error');
    }
  };

  const deleteImage = async (id) => {
    if (window.confirm('Delete this image?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await fetchImages();
        setSelectedIds(prev => prev.filter(sid => sid !== id));
        showToast('Image deleted');
      } catch (err) {
        showToast('Delete failed', 'error');
      }
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected images?`)) {
      try {
        await axios.post(`${API_URL}/bulk-delete`, { ids: selectedIds });
        await fetchImages();
        setSelectedIds([]);
        setBulkMode(false);
        showToast(`${selectedIds.length} images deleted`);
      } catch (err) {
        showToast('Bulk delete failed', 'error');
      }
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredImages.map(img => img._id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
    setPendingFile(null);
    setFormData({ title: '', category: activeTab });
  };

  if (loading) {
    return <div className="admin-gallery-wrapper"><div className="loading-spinner">Loading gallery...</div></div>;
  }

  return (
    <div className="admin-gallery-wrapper">
      {/* Toast */}
      {toast.show && (
        <div className={`gallery-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="admin-gallery-header">
        <div>
          <h1>Gallery Asset Manager</h1>
          <p>Upload, organize, and manage your visual content</p>
        </div>
        <button 
          className="btn-upload-main"
          onClick={() => {
            setModalMode('add');
            setFormData({ title: '', category: activeTab });
            setImagePreview(null);
            setPendingFile(null);
            setIsModalOpen(true);
          }}
        >
          <FaCloudUploadAlt /> Upload New Art
        </button>
      </header>

      {/* Stats Ribbon */}
      <div className="gallery-stats">
        <div className="stat-box">Total Items: <span>{images.length}</span></div>
        <div className="stat-box">Industrial: <span>{counts.industrial}</span></div>
        <div className="stat-box">Architectural: <span>{counts.architectural}</span></div>
        <div className="stat-box">Custom: <span>{counts.custom}</span></div>
      </div>

      {/* Filter & Bulk Actions */}
      <div className="admin-filter-bar">
        <div className="tabs">
          {['industrial', 'architectural', 'custom'].map(cat => (
            <button 
              key={cat}
              className={activeTab === cat ? 'active' : ''} 
              onClick={() => setActiveTab(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({counts[cat]})
            </button>
          ))}
        </div>
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <FaTimes className="clear-search" onClick={() => setSearchTerm('')} />}
        </div>
        <div className="bulk-actions">
          {!bulkMode ? (
            <button onClick={() => setBulkMode(true)} className="btn-bulk">
              <FaCheckDouble /> Bulk Select
            </button>
          ) : (
            <>
              <button onClick={selectAll} className="btn-select-all">
                {selectedIds.length === filteredImages.length ? 'Deselect All' : 'Select All'}
              </button>
              <button onClick={bulkDelete} className="btn-bulk-delete" disabled={selectedIds.length === 0}>
                <FaTrash /> Delete ({selectedIds.length})
              </button>
              <button onClick={() => { setBulkMode(false); setSelectedIds([]); }} className="btn-cancel-bulk">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div 
        className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FaUpload /> Drag & drop images here or click "Upload New Art"
      </div>

      {/* Gallery Grid */}
      <div className="admin-gallery-grid">
        {filteredImages.length === 0 ? (
          <div className="no-results">
            <FaImage />
            <p>No images found in this category.</p>
          </div>
        ) : (
          filteredImages.map(item => (
            <div key={item._id} className={`admin-img-card ${selectedIds.includes(item._id) ? 'selected' : ''}`}>
              {bulkMode && (
                <div className="select-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                  />
                </div>
              )}
              <div className="img-container">
                <img src={item.img} alt={item.title} />
                <div className="img-actions">
                  <button className="icon-btn edit" onClick={() => openEditModal(item)}><FaEdit /></button>
                  <button className="icon-btn delete" onClick={() => deleteImage(item._id)}><FaTrash /></button>
                </div>
              </div>
              <div className="img-details">
                <h4>{item.title}</h4>
                <p className="img-category">{item.category}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="gallery-modal-overlay" onClick={closeModal}>
          <div className="gallery-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><FaTimes /></button>
            <h2>{modalMode === 'add' ? 'Add New Image' : 'Edit Image'}</h2>
            <div className="modal-image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <div className="preview-placeholder"><FaImage /></div>
              )}
            </div>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Enter image title"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="industrial">Industrial</option>
                <option value="architectural">Architectural</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {modalMode === 'add' && (
              <div className="form-group">
                <label>Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />
              </div>
            )}
            <button className="modal-save" onClick={saveImage}>
              {modalMode === 'add' ? 'Upload & Save' : 'Update'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySettingManager;