import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaCheckCircle, 
  FaTimesCircle, FaSearch, FaRuler, FaWeightHanging, FaCube 
} from 'react-icons/fa';
import './ProjectSettingsManager.css';
import Form from './Form';

const API_URL = 'http://localhost:5000/api/projects';

const ProjectSettingsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMaterial, setFilterMaterial] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterMaterial !== 'all') params.material = filterMaterial;
      if (searchTerm) params.search = searchTerm;
      const res = await axios.get(API_URL, { params });
      setProjects(res.data);
    } catch (err) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filterStatus, filterMaterial, searchTerm]);

  const addProject = async (newProject) => {
    setSubmitting(true);
    try {
      await axios.post(API_URL, newProject);
      showToast('✅ Project added successfully');
      fetchProjects();
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error adding project';
      showToast(errorMsg, 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateProject = async (updatedProject) => {
    setSubmitting(true);
    try {
      // Ensure _id is present – if not, fail early
      if (!updatedProject._id) {
        throw new Error('Project ID missing for update');
      }
      await axios.put(`${API_URL}/${updatedProject._id}`, updatedProject);
      showToast('✅ Project updated successfully');
      fetchProjects();
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error updating project';
      showToast(errorMsg, 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProject = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showToast('🗑️ Project deleted');
        fetchProjects();
      } catch (err) {
        showToast('Delete failed', 'error');
      }
    }
  };

  const handleVisibilityToggle = async (project) => {
    const newStatus = project.status === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`${API_URL}/${project._id}/status`, { status: newStatus });
      showToast(`Product is now ${newStatus === 'active' ? 'Visible' : 'Hidden'}`);
      fetchProjects();
    } catch (err) {
      showToast('Failed to update visibility', 'error');
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    // Pass a copy to avoid mutation issues
    setEditingProject({ ...project });
    setShowModal(true);
  };

  const handleModalClose = async (savedProject = null) => {
    if (!savedProject) {
      setShowModal(false);
      return;
    }
    
    let success = false;
    if (savedProject._id) {
      success = await updateProject(savedProject);
    } else {
      success = await addProject(savedProject);
    }
    
    if (success) {
      setShowModal(false);
    }
  };

  // Predefined material list (you can also fetch from backend)
  const materialOptions = ['all', 'Steel', 'Iron', 'Copper', 'Brass', 'Aluminium', 'Bronze', 'Other'];

  if (loading && projects.length === 0) {
    return (
      <div className="pm-container metal-theme">
        <div className="loading-spinner">🔩 Loading metal artworks...</div>
      </div>
    );
  }

  return (
    <div className="pm-container metal-theme">
      {toast.show && <div className={`pm-toast ${toast.type}`}>{toast.message}</div>}
      
      <div className="pm-header">
        <h2><span className="metal-icon">⚒️</span> Metal Art Portfolio</h2>
        <button className="pm-add-btn" onClick={handleAddNew} disabled={submitting}>
          <FaPlus /> Add Artwork
        </button>
      </div>

      <div className="pm-filters">
        <div className="pm-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by title, category, material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterMaterial} onChange={(e) => setFilterMaterial(e.target.value)}>
          {materialOptions.map(mat => (
            <option key={mat} value={mat}>{mat === 'all' ? 'All Materials' : mat}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Displayed (Active)</option>
          <option value="inactive">Hidden (Inactive)</option>
        </select>
      </div>

      <div className="pm-grid">
        {projects.length === 0 ? (
          <div className="pm-no-data">No metal artworks found. 🔩</div>
        ) : (
          projects.map(project => (
            <div key={project._id} className="pm-card">
              <div className="pm-card-image">
                <img 
                  src={project.thumbnail || '/placeholder.jpg'} 
                  alt={project.title}
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                <div className="pm-card-status">
                  <span className={`pm-status-badge ${project.status}`}>
                    {project.status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
                  </span>
                </div>
              </div>
              <div className="pm-card-details">
                <h3>
                  {project.title}
                  {project.isFeatured && <span className="featured-badge">⭐ Featured</span>}
                </h3>
                <div className="pm-card-meta">
                  <span className="meta-cat">{project.category || 'Uncategorized'}</span>
                  <span className="meta-material">{project.material || 'Metal'}</span>
                </div>
                <div className="pm-card-specs">
                  <span><FaRuler /> {project.dimensions || 'N/A'}</span>
                  <span><FaWeightHanging /> {project.weight || 'N/A'}</span>
                </div>
                <p className="pm-card-desc">
                  {project.description?.substring(0, 80) || 'No description'}
                  {project.description?.length > 80 ? '...' : ''}
                </p>
                
                <hr className="pm-divider" />

                <div className="pm-visibility-section">
                  <span className="visibility-label">Website Visibility:</span>
                  <label className="switch-container">
                    <input 
                      type="checkbox" 
                      checked={project.status === 'active'} 
                      onChange={() => handleVisibilityToggle(project)}
                    />
                    <span className="switch-slider"></span>
                    <span className={`visibility-text ${project.status}`}>
                      {project.status === 'active' ? 'Shown (Public)' : 'Hidden (Draft)'}
                    </span>
                  </label>
                </div>

                <div className="pm-card-actions">
                  <button onClick={() => handleEdit(project)} className="btn-edit" disabled={submitting}>
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => deleteProject(project._id, project.title)} className="btn-delete" disabled={submitting}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <Form 
          project={editingProject} 
          onClose={handleModalClose} 
          isSubmitting={submitting}
        />
      )}
    </div>
  );
};

export default ProjectSettingsManager;