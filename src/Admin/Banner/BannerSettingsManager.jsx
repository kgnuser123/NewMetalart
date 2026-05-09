import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaPlus, FaImage, FaTrash, FaHeading, FaEdit } from 'react-icons/fa';
import './AdminBanner.css';

const BannerSettingsManager = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    mainHeading: '', accentText: '', subtitle: '', ctaLabel: '', ctaLink: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [editFormData, setEditFormData] = useState({
    mainHeading: '', accentText: '', subtitle: '', ctaLabel: '', ctaLink: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/banner');
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ---------- CREATE ----------
  const handleSave = async () => {
    if (!imageFile && !formData.mainHeading) return alert("Please fill in the data first!");
    setLoading(true);
    const data = new FormData();
    data.append('mainHeading', formData.mainHeading);
    data.append('accentText', formData.accentText);
    data.append('subtitle', formData.subtitle);
    data.append('ctaLabel', formData.ctaLabel);
    data.append('ctaLink', formData.ctaLink);
    if (imageFile) data.append('image', imageFile);

    try {
      await axios.post('http://localhost:5000/api/banner', data);
      setFormData({ mainHeading: '', accentText: '', subtitle: '', ctaLabel: '', ctaLink: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchBanners();
    } catch (err) {
      alert("Error saving banner");
    } finally {
      setLoading(false);
    }
  };

  // ---------- DELETE ----------
  const confirmDelete = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/banner/${bannerToDelete._id}`);
      fetchBanners();
    } catch (err) {
      alert("Delete failed");
    } finally {
      setShowDeleteModal(false);
      setBannerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBannerToDelete(null);
  };

  // ---------- EDIT ----------
  const openEditModal = (banner) => {
    setEditBanner(banner);
    setEditFormData({
      mainHeading: banner.mainHeading || '',
      accentText: banner.accentText || '',
      subtitle: banner.subtitle || '',
      ctaLabel: banner.ctaLabel || '',
      ctaLink: banner.ctaLink || '',
    });
    if (banner.image) {
      setEditImagePreview(`http://localhost:5000/${banner.image}`);
    } else {
      setEditImagePreview(null);
    }
    setEditImageFile(null);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editFormData.mainHeading && !editImageFile) {
      alert("At least heading or image is required");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append('mainHeading', editFormData.mainHeading);
    form.append('accentText', editFormData.accentText);
    form.append('subtitle', editFormData.subtitle);
    form.append('ctaLabel', editFormData.ctaLabel);
    form.append('ctaLink', editFormData.ctaLink);
    if (editImageFile) form.append('image', editImageFile);

    try {
      await axios.put(`http://localhost:5000/api/banner/${editBanner._id}`, form);
      setShowEditModal(false);
      setEditBanner(null);
      setEditFormData({ mainHeading: '', accentText: '', subtitle: '', ctaLabel: '', ctaLink: '' });
      setEditImageFile(null);
      setEditImagePreview(null);
      fetchBanners();
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditBanner(null);
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  return (
    <div className="admin-banner-wrapper">
      <header className="admin-banner-header">
        <div>
          <h1>Hero Banner Manager</h1>
          <p>Add new banners, edit existing ones, or delete.</p>
        </div>
        <button className="btn-publish-banner" onClick={handleSave} disabled={loading}>
          <FaPlus /> {loading ? 'Saving...' : 'Add New Banner'}
        </button>
      </header>

      <div className="admin-banner-grid">
        <div className="banner-card content-card">
          <h3><FaHeading /> Banner Content</h3>
          <input type="text" placeholder="Main Heading" value={formData.mainHeading} onChange={(e)=>setFormData({...formData, mainHeading: e.target.value})} />
          <input type="text" placeholder="Accent Text" value={formData.accentText} onChange={(e)=>setFormData({...formData, accentText: e.target.value})} />
          <textarea placeholder="Subtitle" value={formData.subtitle} onChange={(e)=>setFormData({...formData, subtitle: e.target.value})}></textarea>
          
          {/* ✅ ADDED CTA FIELDS – now admins can add call-to-action when creating a banner */}
          <input type="text" placeholder="CTA Label (e.g. 'Explore Now')" 
                 value={formData.ctaLabel} 
                 onChange={(e) => setFormData({...formData, ctaLabel: e.target.value})} />
          <input type="text" placeholder="CTA Link (e.g. '/projects')" 
                 value={formData.ctaLink} 
                 onChange={(e) => setFormData({...formData, ctaLink: e.target.value})} />
        </div>

        <div className="banner-card image-card">
          <h3><FaImage /> Background</h3>
          <div className="banner-preview-area">
            {imagePreview ? <img src={imagePreview} alt="preview" /> : <FaImage style={{fontSize: '3rem', opacity: 0.2}} />}
          </div>
          <input type="file" onChange={(e) => {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
          }} />
        </div>
      </div>

      <h2 style={{color: '#fff', marginTop: '30px'}}>Active Banners</h2>
      <div className="banners-list">
        {banners && banners.length > 0 ? (
          banners.map((b) => (
            <div key={b._id} className="banner-list-item">
              <img src={`http://localhost:5000/${b.image}`} alt="thumb" />
              <div className="info">
                <h4>{b.mainHeading}</h4>
                <p>{b.accentText}</p>
              </div>
              <div className="list-actions">
                <button className="edit-btn" onClick={() => openEditModal(b)}>
                  <FaEdit />
                </button>
                <button className="del-btn" onClick={() => confirmDelete(b)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{color: '#aaa'}}>No banners found. Add your first banner above.</p>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Do you want to remove this banner?<br />
              <strong>“{bannerToDelete?.mainHeading}”</strong>
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="modal-confirm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editBanner && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Banner</h3>
            <div className="edit-form">
              <input
                type="text"
                placeholder="Main Heading"
                value={editFormData.mainHeading}
                onChange={(e) => setEditFormData({...editFormData, mainHeading: e.target.value})}
              />
              <input
                type="text"
                placeholder="Accent Text"
                value={editFormData.accentText}
                onChange={(e) => setEditFormData({...editFormData, accentText: e.target.value})}
              />
              <textarea
                placeholder="Subtitle"
                value={editFormData.subtitle}
                onChange={(e) => setEditFormData({...editFormData, subtitle: e.target.value})}
              ></textarea>
              <input
                type="text"
                placeholder="CTA Label (e.g., 'Explore Now')"
                value={editFormData.ctaLabel}
                onChange={(e) => setEditFormData({...editFormData, ctaLabel: e.target.value})}
              />
              <input
                type="text"
                placeholder="CTA Link (e.g., '/projects')"
                value={editFormData.ctaLink}
                onChange={(e) => setEditFormData({...editFormData, ctaLink: e.target.value})}
              />

              <div className="edit-image-section">
                <label>Banner Image (optional – leave empty to keep current)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditImageFile(file);
                      setEditImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {editImagePreview && (
                  <div className="edit-image-preview">
                    <img src={editImagePreview} alt="preview" />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeEditModal}>Cancel</button>
              <button className="modal-confirm" onClick={handleEditSave} disabled={loading}>
                {loading ? 'Updating...' : 'Update Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSettingsManager;