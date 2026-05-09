import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaPlus, FaEdit, FaTrashAlt, FaSave, FaTimes,
    FaArrowUp, FaArrowDown, FaEye, FaEyeSlash,
    FaImage, FaClock, FaDollarSign, FaSearch,
    FaArrowLeft, FaArrowRight, FaCheck, FaInfoCircle,
    FaCog, FaGlobe, FaCopy, FaDownload, FaUpload,
    FaFilter, FaCheckDouble, FaBan, FaEye as FaView
} from 'react-icons/fa';
import './ServiceSettings.css';

const API_URL = 'http://localhost:5000/api/services';

const ServiceSettingsManager = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWizard, setShowWizard] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [featuresInput, setFeaturesInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [formData, setFormData] = useState({
        title: '', shortDesc: '', longDesc: '', image: '', price: '', duration: '',
        features: [], seoTitle: '', seoDesc: '', status: 'active'
    });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // ✅ FIX: Backend se _id aata hai, use id bana do for easy access
    const loadServices = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            const servicesWithId = res.data.map(s => ({ ...s, id: s._id }));
            setServices(servicesWithId);
        } catch (err) {
            console.error('Load error:', err);
            showToast('Failed to load services', 'error');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    // Filtering
    useEffect(() => {
        let filtered = [...services];
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => s.status === statusFilter);
        }
        setFilteredServices(filtered);
    }, [services, searchTerm, statusFilter]);

    const openWizard = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                title: service.title, shortDesc: service.shortDesc, longDesc: service.longDesc,
                image: service.image, price: service.price, duration: service.duration,
                features: [...service.features], seoTitle: service.seoTitle,
                seoDesc: service.seoDesc, status: service.status
            });
        } else {
            setEditingService(null);
            setFormData({
                title: '', shortDesc: '', longDesc: '', image: '', price: '', duration: '',
                features: [], seoTitle: '', seoDesc: '', status: 'active'
            });
        }
        setFeaturesInput('');
        setCurrentStep(1);
        setShowWizard(true);
    };

    const closeWizard = () => setShowWizard(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addFeature = () => {
        if (featuresInput.trim()) {
            setFormData(prev => ({ ...prev, features: [...prev.features, featuresInput.trim()] }));
            setFeaturesInput('');
        }
    };

    const removeFeature = (index) => {
        const newFeatures = [...formData.features];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast('Image too large (max 2MB)', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: '' });
    };

    // ✅ Save: ID ke liye _id use karo
    const saveService = async () => {
        if (!formData.title.trim()) {
            showToast('Title is required', 'error');
            return;
        }
        try {
            if (editingService) {
                await axios.put(`${API_URL}/${editingService._id}`, formData);
                showToast('Service updated successfully');
            } else {
                await axios.post(API_URL, formData);
                showToast('Service added successfully');
            }
            await loadServices();
            closeWizard();
        } catch (err) {
            console.error('Save error:', err);
            showToast('Error saving service', 'error');
        }
    };

    // Duplicate
    const duplicateService = async (service) => {
        try {
            const duplicated = {
                ...service,
                title: `${service.title} (Copy)`,
                status: 'active'
            };
            delete duplicated._id;       // ✅ important
            delete duplicated.id;
            delete duplicated.createdAt;
            delete duplicated.updatedAt;
            await axios.post(API_URL, duplicated);
            await loadServices();
            showToast(`"${service.title}" duplicated`);
        } catch (err) {
            showToast('Duplicate failed', 'error');
        }
    };

    // Delete single
    const deleteService = async (service) => {
        if (window.confirm(`Delete "${service.title}" permanently?`)) {
            try {
                await axios.delete(`${API_URL}/${service._id}`);
                await loadServices();
                showToast(`"${service.title}" deleted`, 'error');
            } catch (err) {
                showToast('Delete failed', 'error');
            }
        }
    };

    // Bulk delete
    const bulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Delete ${selectedIds.length} selected services?`)) {
            try {
                for (const id of selectedIds) {
                    await axios.delete(`${API_URL}/${id}`);
                }
                await loadServices();
                setSelectedIds([]);
                setBulkMode(false);
                showToast(`${selectedIds.length} services deleted`, 'error');
            } catch (err) {
                showToast('Bulk delete failed', 'error');
            }
        }
    };

    // Bulk status update
    const bulkStatus = async (status) => {
        try {
            for (const id of selectedIds) {
                await axios.patch(`${API_URL}/${id}/status`, { status });
            }
            await loadServices();
            setSelectedIds([]);
            setBulkMode(false);
            showToast(`Bulk status updated to ${status}`);
        } catch (err) {
            showToast('Bulk status update failed', 'error');
        }
    };

    // Move (reorder)
    const moveService = async (id, direction) => {
        const index = services.findIndex(s => s.id === id);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
        const newServices = [...services];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newServices[index], newServices[swapIndex]] = [newServices[swapIndex], newServices[index]];
        const orderedIds = newServices.map(s => s._id);   // ✅ use _id
        try {
            await axios.patch(`${API_URL}/reorder`, { orderedIds });
            await loadServices();
        } catch (err) {
            showToast('Reorder failed', 'error');
        }
    };

    // Toggle status
    const toggleStatus = async (id) => {
        const service = services.find(s => s.id === id);
        if (!service) return;
        const newStatus = service.status === 'active' ? 'inactive' : 'active';
        try {
            await axios.patch(`${API_URL}/${service._id}/status`, { status: newStatus });
            await loadServices();
            showToast(`Status toggled to ${newStatus}`);
        } catch (err) {
            showToast('Status toggle failed', 'error');
        }
    };

    // Export
    const exportData = () => {
        const dataStr = JSON.stringify(services, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `services_backup_${new Date().toISOString().slice(0, 19)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Services exported');
    };

    // Import
    const importData = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    for (const service of services) {
                        await axios.delete(`${API_URL}/${service._id}`);
                    }
                    for (const service of imported) {
                        const { _id, id, createdAt, updatedAt, ...cleanService } = service;
                        await axios.post(API_URL, cleanService);
                    }
                    await loadServices();
                    showToast('Import successful');
                } else {
                    showToast('Invalid file format', 'error');
                }
            } catch (err) {
                showToast('Error parsing file', 'error');
            }
        };
        reader.readAsText(file);
    };

    const nextStep = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
    const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const StepIndicator = () => (
        <div className="nm-step-indicator">
            <div className={`nm-step ${currentStep >= 1 ? 'active' : ''}`}>
                <span className="nm-step-num">1</span>
                <span className="nm-step-label">Basic Info</span>
            </div>
            <div className={`nm-step-line ${currentStep >= 2 ? 'filled' : ''}`}></div>
            <div className={`nm-step ${currentStep >= 2 ? 'active' : ''}`}>
                <span className="nm-step-num">2</span>
                <span className="nm-step-label">Media & Features</span>
            </div>
            <div className={`nm-step-line ${currentStep >= 3 ? 'filled' : ''}`}></div>
            <div className={`nm-step ${currentStep >= 3 ? 'active' : ''}`}>
                <span className="nm-step-num">3</span>
                <span className="nm-step-label">SEO & Status</span>
            </div>
        </div>
    );

    if (loading) return <div className="nm-service-loading"><div className="nm-spinner"></div> Loading services...</div>;

    return (
        <div className="nm-service-container">
            {toast.show && <div className={`nm-toast ${toast.type}`}>{toast.message}</div>}
            {/* Rest JSX remains exactly same as before */}
            <div className="nm-service-header">
                <h1>⚙️ Service Manager <span>New Metal Art</span></h1>
                <div className="header-actions">
                    <button className="nm-btn-primary" onClick={() => openWizard()}><FaPlus /> Add New</button>
                    <button className="nm-btn-secondary" onClick={exportData}><FaDownload /> Export</button>
                    <label className="nm-btn-secondary"><FaUpload /> Import <input type="file" accept=".json" hidden onChange={importData} /></label>
                </div>
            </div>

            <div className="nm-filter-bar">
                <div className="search-box">
                    <FaSearch />
                    <input type="text" placeholder="Search services..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    {searchTerm && <FaTimes className="clear" onClick={() => setSearchTerm('')} />}
                </div>
                <div className="status-filter">
                    <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
                    <button className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>Active</button>
                    <button className={statusFilter === 'inactive' ? 'active' : ''} onClick={() => setStatusFilter('inactive')}>Inactive</button>
                </div>
                {!bulkMode ? (
                    <button className="nm-btn-bulk" onClick={() => setBulkMode(true)}><FaCheckDouble /> Bulk Select</button>
                ) : (
                    <div className="bulk-actions">
                        <span>{selectedIds.length} selected</span>
                        <button onClick={() => bulkStatus('active')}><FaEye /> Activate</button>
                        <button onClick={() => bulkStatus('inactive')}><FaBan /> Deactivate</button>
                        <button onClick={bulkDelete} className="danger"><FaTrashAlt /> Delete</button>
                        <button onClick={() => { setBulkMode(false); setSelectedIds([]); }}><FaTimes /> Cancel</button>
                    </div>
                )}
            </div>

            <div className="nm-service-grid">
                {filteredServices.length === 0 ? (
                    <div className="nm-empty">✨ No services match. Click "Add New" to begin.</div>
                ) : (
                    filteredServices.map(service => (
                        <div key={service._id} className={`nm-service-card ${service.status === 'inactive' ? 'inactive' : ''} ${bulkMode ? 'bulk-mode' : ''}`}>
                            {bulkMode && (
                                <div className="nm-card-checkbox">
                                    <input type="checkbox" checked={selectedIds.includes(service._id)} onChange={() => {
                                        setSelectedIds(prev => prev.includes(service._id) ? prev.filter(id => id !== service._id) : [...prev, service._id]);
                                    }} />
                                </div>
                            )}
                            <div className="nm-card-image">
                                <img src={service.image} alt={service.title} />
                                <div className={`nm-card-badge ${service.status}`}>{service.status}</div>
                            </div>
                            <div className="nm-card-content">
                                <h3>{service.title}</h3>
                                <p className="nm-short">{service.shortDesc}</p>
                                <div className="nm-card-meta">
                                    <span><FaDollarSign /> {service.price}</span>
                                    <span><FaClock /> {service.duration}</span>
                                </div>
                                <div className="nm-features-preview">
                                    {service.features.slice(0,2).map((f,i) => <span key={i}>{f}</span>)}
                                    {service.features.length > 2 && <span>+{service.features.length-2}</span>}
                                </div>
                            </div>
                            {!bulkMode && (
                                <div className="nm-card-actions">
                                    <button onClick={() => moveService(service._id, 'up')} disabled={service.order === 1}><FaArrowUp /></button>
                                    <button onClick={() => moveService(service._id, 'down')} disabled={service.order === services.length}><FaArrowDown /></button>
                                    <button onClick={() => toggleStatus(service._id)}>{service.status === 'active' ? <FaEyeSlash /> : <FaEye />}</button>
                                    <button onClick={() => openWizard(service)}><FaEdit /></button>
                                    <button onClick={() => duplicateService(service)}><FaCopy /></button>
                                    <button onClick={() => deleteService(service)}><FaTrashAlt /></button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal section - same as before (no change) */}
            {showWizard && (
                <div className="nm-modal-overlay" onClick={closeWizard}>
                    <div className="nm-modal nm-wizard-modal" onClick={e => e.stopPropagation()}>
                        <div className="nm-modal-header">
                            <h2>{editingService ? '✏️ Edit Service' : '➕ Create New Service'} – Step {currentStep}/3</h2>
                            <button className="nm-modal-close" onClick={closeWizard}><FaTimes /></button>
                        </div>
                        <StepIndicator />
                        <div className="nm-modal-body wizard-body">
                            {currentStep === 1 && (
                                <div className="wizard-step">
                                    <div className="nm-form-row">
                                        <div className="nm-form-group">
                                            <label>Title *</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Custom Metal Sculpture" />
                                        </div>
                                        <div className="nm-form-group">
                                            <label>Price ($)</label>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="499" />
                                        </div>
                                    </div>
                                    <div className="nm-form-row">
                                        <div className="nm-form-group">
                                            <label>Duration</label>
                                            <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="2-3 weeks" />
                                        </div>
                                        <div className="nm-form-group">
                                            <label>Status</label>
                                            <select name="status" value={formData.status} onChange={handleChange}>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="nm-form-group">
                                        <label>Short Description (for cards)</label>
                                        <input type="text" name="shortDesc" value={formData.shortDesc} onChange={handleChange} placeholder="Brief summary" />
                                    </div>
                                    <div className="nm-form-group">
                                        <label>Long Description</label>
                                        <textarea name="longDesc" rows="3" value={formData.longDesc} onChange={handleChange} placeholder="Detailed description"></textarea>
                                    </div>
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div className="wizard-step">
                                    <div className="nm-form-group">
                                        <label>Service Image</label>
                                        <div className="nm-image-upload">
                                            {formData.image ? (
                                                <>
                                                    <img src={formData.image} alt="preview" />
                                                    <button type="button" className="remove-img" onClick={removeImage}><FaTimes /></button>
                                                </>
                                            ) : (
                                                <div className="nm-image-placeholder"><FaImage /></div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageUpload} id="imageUploadWizard" />
                                            <label htmlFor="imageUploadWizard" className="nm-btn-secondary">Upload Image</label>
                                        </div>
                                    </div>
                                    <div className="nm-form-group">
                                        <label>Features / Key Points</label>
                                        <div className="nm-features-input">
                                            <input type="text" value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder="e.g., Handcrafted" />
                                            <button type="button" onClick={addFeature}><FaPlus /></button>
                                        </div>
                                        <div className="nm-features-list">
                                            {formData.features.map((feat, idx) => (
                                                <span key={idx}>{feat} <button onClick={() => removeFeature(idx)}><FaTimes /></button></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {currentStep === 3 && (
                                <div className="wizard-step">
                                    <div className="nm-seo-section">
                                        <h4><FaSearch /> SEO Settings</h4>
                                        <div className="nm-form-group">
                                            <label>Meta Title</label>
                                            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Custom Metal Sculpture | New Metal Art" />
                                        </div>
                                        <div className="nm-form-group">
                                            <label>Meta Description</label>
                                            <textarea name="seoDesc" rows="2" value={formData.seoDesc} onChange={handleChange} placeholder="Handcrafted metal sculptures..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="nm-modal-footer wizard-footer">
                            {currentStep > 1 && (
                                <button className="nm-btn-secondary" onClick={prevStep}><FaArrowLeft /> Previous</button>
                            )}
                            {currentStep < 3 ? (
                                <button className="nm-btn-primary" onClick={nextStep}>Next <FaArrowRight /></button>
                            ) : (
                                <button className="nm-btn-primary" onClick={saveService}><FaSave /> Save Service</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceSettingsManager;