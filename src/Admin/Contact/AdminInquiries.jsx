import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaEye, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import './AdminInquiries.css';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/api/inquiries' : `/api/inquiries?status=${filter}`;
      const res = await axios.get(`http://localhost:5000${url}`);
      setInquiries(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const updateInquiry = async (id, data) => {
    try {
      await axios.put(`http://localhost:5000/api/inquiries/${id}`, data);
      await fetchInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  const markAsRead = (id) => updateInquiry(id, { status: 'read' });
  const markAsUnread = (id) => updateInquiry(id, { status: 'unread' });
  const markReplied = (id) => updateInquiry(id, { replied: true });

  const deleteInquiry = async (id) => {
    if (window.confirm('Delete this inquiry permanently?')) {
      try {
        await axios.delete(`http://localhost:5000/api/inquiries/${id}`);
        showToast('Inquiry deleted', 'error');
        await fetchInquiries();
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
      } catch (err) {
        showToast('Delete failed', 'error');
      }
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status, replied) => {
    if (replied) return <FaCheckCircle className="status-icon replied" title="Replied" />;
    return status === 'unread' ? <FaEnvelope className="status-icon unread" title="Unread" /> : <FaEnvelopeOpen className="status-icon read" title="Read" />;
  };

  if (loading && inquiries.length === 0) {
    return <div className="admin-inquiries-wrapper"><div className="loading-spinner">Loading inquiries...</div></div>;
  }

  return (
    <div className="admin-inquiries-wrapper">
      {toast.show && <div className={`inquiry-toast ${toast.type}`}>{toast.message}</div>}
      <header className="inquiries-header">
        <div>
          <h1>Contact Inquiries</h1>
          <p>Manage messages from your website contact form</p>
        </div>
        <div className="stats-summary">
          <span>Total: {inquiries.length}</span>
          <span>Unread: {inquiries.filter(i => i.status === 'unread').length}</span>
          <span>Replied: {inquiries.filter(i => i.replied).length}</span>
        </div>
      </header>

      <div className="inquiries-filter-bar">
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button>
          <button className={filter === 'read' ? 'active' : ''} onClick={() => setFilter('read')}>Read</button>
        </div>
      </div>

      <div className="inquiries-content">
        <div className="inquiries-list">
          {inquiries.length === 0 ? (
            <div className="no-inquiries">No inquiries found</div>
          ) : (
            inquiries.map(inq => (
              <div
                key={inq._id}
                className={`inquiry-card ${selectedInquiry?._id === inq._id ? 'selected' : ''} ${inq.status === 'unread' ? 'unread' : ''}`}
                onClick={() => setSelectedInquiry(inq)}
              >
                <div className="inquiry-card-header">
                  <div className="inquiry-status">
                    {getStatusIcon(inq.status, inq.replied)}
                    <strong>{inq.name}</strong>
                  </div>
                  <div className="inquiry-actions">
                    <button onClick={(e) => { e.stopPropagation(); inq.status === 'unread' ? markAsRead(inq._id) : markAsUnread(inq._id); }} title={inq.status === 'unread' ? 'Mark as read' : 'Mark as unread'}>
                      {inq.status === 'unread' ? <FaEye /> : <FaEnvelope />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteInquiry(inq._id); }} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="inquiry-card-details">
                  <p className="inquiry-email">{inq.email} | {inq.phone}</p>
                  <p className="inquiry-message-preview">{inq.message.substring(0, 80)}...</p>
                  <span className="inquiry-date">{formatDate(inq.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="inquiry-detail-panel">
          {selectedInquiry ? (
            <div className="detail-content">
              <div className="detail-header">
                <h2>{selectedInquiry.name}</h2>
                <div className="detail-actions">
                  {!selectedInquiry.replied && (
                    <button className="reply-btn" onClick={() => markReplied(selectedInquiry._id)}>
                      <FaReply /> Mark as Replied
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => deleteInquiry(selectedInquiry._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
              <div className="detail-info">
                <p><strong>Email:</strong> {selectedInquiry.email}</p>
                <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
                <p><strong>Date:</strong> {formatDate(selectedInquiry.createdAt)}</p>
                <p><strong>Status:</strong> {selectedInquiry.status} {selectedInquiry.replied && '(Replied)'}</p>
              </div>
              <div className="detail-message">
                <strong>Message:</strong>
                <p>{selectedInquiry.message}</p>
              </div>
              {!selectedInquiry.replied && (
                <div className="reply-suggestion">
                  <strong>Quick Reply:</strong>
                  <textarea placeholder="Type your response... (copy to email client)"></textarea>
                  <button className="copy-reply" onClick={() => {
                    const reply = document.querySelector('.reply-suggestion textarea').value;
                    if (reply) navigator.clipboard.writeText(reply);
                    showToast('Copied to clipboard');
                  }}>Copy to Clipboard</button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">Select an inquiry to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;