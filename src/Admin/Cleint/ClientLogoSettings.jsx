import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaPlus, FaEdit, FaTrashAlt, FaSave, FaTimes,
    FaArrowUp, FaArrowDown, FaEye, FaEyeSlash,
    FaImage, FaLink, FaInfoCircle, FaCheck
} from 'react-icons/fa';
import './ClientLogoSettings.css';

const API_URL = 'http://localhost:5000/api/clients';

const ClientLogoSettings = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        altText: '',
        website: '',
        status: 'active'
    });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setClients(res.data);
        } catch (err) {
            console.error(err);
            showToast('Failed to load clients', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const openModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                logo: client.logo,
                altText: client.altText || '',
                website: client.website || '',
                status: client.status
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                logo: '',
                altText: '',
                website: '',
                status: 'active'
            });
        }
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Only image files allowed', 'error');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showToast('File too large (max 2MB)', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, logo: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const saveClient = async () => {
        if (!formData.name.trim()) { showToast('Client name is required', 'error'); return; }
        if (!formData.logo) { showToast('Please upload a logo image', 'error'); return; }
        try {
            if (editingClient) {
                await axios.put(`${API_URL}/${editingClient._id}`, formData);
                showToast('Client updated successfully');
            } else {
                await axios.post(API_URL, formData);
                showToast('Client added successfully');
            }
            await fetchClients();
            closeModal();
        } catch (err) {
            console.error(err);
            showToast('Operation failed', 'error');
        }
    };

    const deleteClient = async (client) => {
        if (window.confirm(`Delete "${client.name}" permanently?`)) {
            try {
                await axios.delete(`${API_URL}/${client._id}`);
                await fetchClients();
                showToast('Deleted successfully');
            } catch (err) {
                showToast('Delete failed', 'error');
            }
        }
    };

    const moveClient = async (id, direction) => {
        const index = clients.findIndex(c => c._id === id);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === clients.length - 1)) return;
        const newClients = [...clients];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newClients[index], newClients[swapIndex]] = [newClients[swapIndex], newClients[index]];
        const orderedIds = newClients.map(c => c._id);
        try {
            await axios.patch(`${API_URL}/reorder`, { orderedIds });
            await fetchClients();
        } catch (err) {
            showToast('Reorder failed', 'error');
        }
    };

    const toggleStatus = async (id) => {
        try {
            await axios.patch(`${API_URL}/${id}/status`);
            await fetchClients();
        } catch (err) {
            showToast('Status toggle failed', 'error');
        }
    };

    if (loading) return <div className="nm-client-loading"><div className="nm-spinner"></div> Loading clients...</div>;

    return (
        <div className="nm-client-container">
            {toast.show && <div className={`nm-toast ${toast.type}`}>{toast.message}</div>}
            <div className="nm-client-header">
                <h1>🏢 Client Logo Manager <span>New Metal Art</span></h1>
                <button className="nm-btn-primary" onClick={() => openModal()}><FaPlus /> Add Client Logo</button>
            </div>

            <div className="nm-client-grid">
                {clients.length === 0 ? (
                    <div className="nm-empty">✨ No client logos yet. Click "Add Client Logo" to begin.</div>
                ) : (
                    clients.map(client => (
                        <div key={client._id} className={`nm-client-card ${client.status === 'inactive' ? 'inactive' : ''}`}>
                            <div className="nm-client-logo">
                                <img src={client.logo} alt={client.altText || client.name} />
                                <div className="nm-client-badge">{client.status}</div>
                            </div>
                            <div className="nm-client-info">
                                <h3>{client.name}</h3>
                                {client.website && (
                                    <a href={client.website} target="_blank" rel="noopener noreferrer">
                                        <FaLink /> {client.website}
                                    </a>
                                )}
                                {client.altText && <p><FaInfoCircle /> {client.altText}</p>}
                            </div>
                            <div className="nm-client-actions">
                                <button onClick={() => moveClient(client._id, 'up')} disabled={client.order === 1}><FaArrowUp /></button>
                                <button onClick={() => moveClient(client._id, 'down')} disabled={client.order === clients.length}><FaArrowDown /></button>
                                <button onClick={() => toggleStatus(client._id)}>{client.status === 'active' ? <FaEyeSlash /> : <FaEye />}</button>
                                <button onClick={() => openModal(client)}><FaEdit /></button>
                                <button onClick={() => deleteClient(client)}><FaTrashAlt /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal - Add/Edit Client */}
            {modalOpen && (
                <div className="nm-modal-overlay" onClick={closeModal}>
                    <div className="nm-modal nm-client-modal" onClick={e => e.stopPropagation()}>
                        <div className="nm-modal-header">
                            <h2>{editingClient ? '✏️ Edit Client' : '➕ Add New Client'}</h2>
                            <button className="nm-modal-close" onClick={closeModal}><FaTimes /></button>
                        </div>
                        <div className="nm-modal-body">
                            <div className="nm-form-group">
                                <label>Client Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., TechCorp Industries" />
                            </div>
                            <div className="nm-form-group">
                                <label>Logo Image *</label>
                                <div className="nm-image-upload">
                                    {formData.logo ? <img src={formData.logo} alt="preview" /> : <div className="nm-image-placeholder"><FaImage /></div>}
                                    <input type="file" accept="image/*" onChange={handleImageUpload} id="clientLogoUpload" />
                                    <label htmlFor="clientLogoUpload" className="nm-btn-secondary">Upload Logo</label>
                                </div>
                                <small>Recommended size: 200x100px (max width 200px)</small>
                            </div>
                            <div className="nm-form-group">
                                <label>Alt Text (for accessibility)</label>
                                <input type="text" name="altText" value={formData.altText} onChange={handleChange} placeholder="TechCorp Industries logo" />
                            </div>
                            <div className="nm-form-group">
                                <label>Website URL (optional)</label>
                                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                            </div>
                            <div className="nm-form-group">
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="active">Active (show on website)</option>
                                    <option value="inactive">Inactive (hide)</option>
                                </select>
                            </div>
                        </div>
                        <div className="nm-modal-footer">
                            <button className="nm-btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="nm-btn-primary" onClick={saveClient}><FaSave /> Save Client</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientLogoSettings;