import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaUndo, FaUser, FaLock } from 'react-icons/fa';
import './AdminSettings.css';

const AdminSettings = () => {
  const [admin, setAdmin] = useState({ email: '' });
  const [formData, setFormData] = useState({
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(res.data.admin);
    } catch (err) {
      setMessage({ text: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await axios.put('http://localhost:5000/api/admin/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: res.data.message, type: 'success' });
      // Clear password fields after success
      setFormData({
        newEmail: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      // Refresh admin info to show updated email
      fetchProfile();
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      newEmail: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  if (loading) return <div className="settings-loading">Loading profile...</div>;

  return (
    <div className="admin-settings-wrapper">
      <div className="settings-header">
        <h1>🔐 Admin Profile</h1>
        <p>Update your login credentials</p>
      </div>

      {message.text && (
        <div className={`settings-toast ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-card">
          <h3><FaUser /> Current Email</h3>
          <div className="info-row">
            <span>{admin.email}</span>
          </div>
        </div>

        <div className="settings-card">
          <h3><FaUser /> Change Email (optional)</h3>
          <div className="form-group">
            <label>New Email</label>
            <input
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </div>
        </div>

        <div className="settings-card">
          <h3><FaLock /> Change Password</h3>
          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Required to change password"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn-secondary" onClick={resetForm}>
            <FaUndo /> Reset
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;