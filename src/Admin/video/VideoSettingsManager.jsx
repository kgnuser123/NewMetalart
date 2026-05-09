import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaTimes, FaVideo, FaLink } from 'react-icons/fa';
import './VideoSettingsManager.css';

const API_URL = 'http://localhost:5000/api/videos';

const VideoSettingsManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    videoUrl: '',
    videoFile: null
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get(API_URL);
      setVideos(res.data);
    } catch (err) {
      showToast('Failed to load videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, videoFile: e.target.files[0] });

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, thumbnail: reader.result });
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      showToast('Title and category are required', 'error');
      return;
    }
    if (!formData.videoUrl && !formData.videoFile) {
      showToast('Please provide a video URL or upload a video file', 'error');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);
    if (formData.videoFile) data.append('videoFile', formData.videoFile);
    else if (formData.videoUrl) data.append('videoUrl', formData.videoUrl);

    try {
      if (editing) {
        // For update, send JSON (file upload requires multipart; we'll handle separately)
        await axios.put(`${API_URL}/${editing._id}`, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          thumbnail: formData.thumbnail,
          videoUrl: formData.videoUrl
        });
        showToast('Video updated');
      } else {
        await axios.post(API_URL, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Video added');
      }
      fetchVideos();
      closeModal();
    } catch (err) {
      console.error(err);
      showToast('Operation failed', 'error');
    }
  };

  const deleteVideo = async (id) => {
    if (window.confirm('Delete this video permanently?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchVideos();
        showToast('Video deleted');
      } catch (err) {
        showToast('Delete failed', 'error');
      }
    }
  };

  const openModal = (video = null) => {
    if (video) {
      setEditing(video);
      setFormData({
        title: video.title,
        description: video.description || '',
        category: video.category,
        thumbnail: video.thumbnail || '',
        videoUrl: video.videoUrl || '',
        videoFile: null
      });
      setThumbnailPreview(video.thumbnail || '');
    } else {
      setEditing(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        thumbnail: '',
        videoUrl: '',
        videoFile: null
      });
      setThumbnailPreview('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setThumbnailPreview('');
  };

  if (loading) return <div className="video-admin-loading">Loading videos...</div>;

  return (
    <div className="video-admin-container">
      {toast.show && <div className={`video-toast ${toast.type}`}>{toast.message}</div>}
      <div className="video-admin-header">
        <h2><FaVideo /> Video Gallery Manager</h2>
        <button onClick={() => openModal()} className="add-video-btn"><FaPlus /> Add New Video</button>
      </div>

      <div className="video-admin-grid">
        {videos.length === 0 ? (
          <div className="no-videos">No videos found. Click "Add New Video" to get started.</div>
        ) : (
          videos.map(v => (
            <div key={v._id} className="video-admin-card">
              <div className="video-thumb">
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} />
                ) : (
                  <div className="video-placeholder"><FaVideo /></div>
                )}
              </div>
              <div className="card-info">
                <h3>{v.title}</h3>
                <p className="card-category">{v.category}</p>
                <p className="card-desc">{v.description?.substring(0, 80)}...</p>
                <div className="card-actions">
                  <button onClick={() => openModal(v)}><FaEdit /> Edit</button>
                  <button onClick={() => deleteVideo(v._id)}><FaTrash /> Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><FaTimes /></button>
            <h3>{editing ? 'Edit Video' : 'Add New Video'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" placeholder="e.g., Industrial Metal Fabrication" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <input type="text" name="category" placeholder="e.g., industrial, architectural, custom" value={formData.category} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Brief description of the video" rows="3" value={formData.description} onChange={handleChange}></textarea>
              </div>

              <div className="form-group">
                <label>Thumbnail Image (URL or upload)</label>
                <div className="thumbnail-upload">
                  <input type="url" name="thumbnail" placeholder="https://example.com/thumbnail.jpg" value={formData.thumbnail} onChange={handleChange} />
                  <div className="or-divider">OR</div>
                  <label className="upload-thumb-btn">
                    <FaUpload /> Upload Image
                    <input type="file" accept="image/*" hidden onChange={handleThumbnailChange} />
                  </label>
                </div>
                {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />}
              </div>

              <div className="form-group">
                <label>Video (URL or file upload)</label>
                <input type="url" name="videoUrl" placeholder="YouTube/Vimeo embed URL or direct video link" value={formData.videoUrl} onChange={handleChange} />
                <div className="or-divider">OR</div>
                <label className="upload-video-btn">
                  <FaUpload /> Upload Video File (MP4, MOV, AVI)
                  <input type="file" accept="video/*" hidden onChange={handleFileChange} />
                </label>
                {formData.videoFile && <span className="file-name">Selected: {formData.videoFile.name}</span>}
              </div>

              <button type="submit" className="submit-btn">{editing ? 'Update Video' : 'Upload Video'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSettingsManager;