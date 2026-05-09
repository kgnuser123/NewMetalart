import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaProjectDiagram, FaUsers, FaEnvelope, FaEye, 
  FaCheckCircle, FaTimesCircle, FaArrowRight,
  FaCalendarAlt, FaChartLine, FaStar
} from 'react-icons/fa';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    unreadInquiries: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch projects
        const projectsRes = await axios.get(`${API_BASE}/projects`);
        const projects = projectsRes.data;
        const activeProjects = projects.filter(p => p.status === 'active').length;
        
        // Fetch clients
        const clientsRes = await axios.get(`${API_BASE}/clients`);
        const clients = clientsRes.data;
        const activeClients = clients.filter(c => c.status === 'active').length;
        
        // Fetch inquiries - try both possible endpoints
        let inquiries = [];
        let unread = 0;
        try {
          // Try the endpoint from AdminInquiries component (likely /api/contact)
          const inquiriesRes = await axios.get(`${API_BASE}/contact`);
          inquiries = inquiriesRes.data;
          unread = inquiries.filter(i => !i.isRead).length;
        } catch (err) {
          // Alternative endpoint
          try {
            const inquiriesRes = await axios.get(`${API_BASE}/inquiries`);
            inquiries = inquiriesRes.data;
            unread = inquiries.filter(i => !i.isRead).length;
          } catch (e) {
            console.warn('Inquiries endpoint not found, using mock');
            inquiries = [];
          }
        }
        
        setStats({
          totalProjects: projects.length,
          activeProjects,
          totalClients: activeClients,
          unreadInquiries: unread,
        });
        
        // Recent projects (last 3 by createdAt descending)
        const sortedProjects = [...projects].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentProjects(sortedProjects.slice(0, 3));
        
        // Recent inquiries (last 3 by createdAt descending)
        const sortedInquiries = [...inquiries].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentInquiries(sortedInquiries.slice(0, 3));
        
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data. Please check your backend connection.');
        // Fallback mock data
        setStats({
          totalProjects: 0,
          activeProjects: 0,
          totalClients: 0,
          unreadInquiries: 0,
        });
        setRecentProjects([]);
        setRecentInquiries([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error && !recentProjects.length && !recentInquiries.length) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your website today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card projects">
          <div className="stat-icon"><FaProjectDiagram /></div>
          <div className="stat-info">
            <h3>{stats.totalProjects}</h3>
            <p>Total Projects</p>
          </div>
          <div className="stat-sub">Active: {stats.activeProjects}</div>
        </div>
        <div className="stat-card clients">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info">
            <h3>{stats.totalClients}</h3>
            <p>Active Clients</p>
          </div>
        </div>
        <div className="stat-card inquiries">
          <div className="stat-icon"><FaEnvelope /></div>
          <div className="stat-info">
            <h3>{stats.unreadInquiries}</h3>
            <p>Unread Inquiries</p>
          </div>
        </div>
        <div className="stat-card views">
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-info">
            <h3>Coming Soon</h3>
            <p>Analytics</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/project-settings" className="action-btn">
          <FaProjectDiagram /> Add New Project
        </Link>
        <Link to="/admin/Client" className="action-btn">
          <FaUsers /> Manage Clients
        </Link>
        <Link to="/admin/Admin-inquiry" className="action-btn">
          <FaEnvelope /> View Inquiries
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="dashboard-two-columns">
        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <Link to="/admin/project-settings" className="view-all">View all <FaArrowRight /></Link>
          </div>
          <div className="recent-list">
            {recentProjects.length === 0 ? (
              <p className="no-data">No projects yet. Click "Add New Project" to create one.</p>
            ) : (
              recentProjects.map(project => (
                <div key={project._id} className="recent-item">
                  <div className="item-info">
                    <h4>{project.title}</h4>
                    <span className="item-date"><FaCalendarAlt /> {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`status-badge ${project.status}`}>
                    {project.status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
                    {project.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Inquiries</h2>
            <Link to="/admin/Admin-inquiry" className="view-all">View all <FaArrowRight /></Link>
          </div>
          <div className="recent-list">
            {recentInquiries.length === 0 ? (
              <p className="no-data">No inquiries received yet.</p>
            ) : (
              recentInquiries.map(inquiry => (
                <div key={inquiry._id} className="recent-item inquiry-item">
                  <div className="item-info">
                    <h4>{inquiry.name || inquiry.fullName || 'Anonymous'}</h4>
                    <p className="item-message">{(inquiry.message || inquiry.comment || '').substring(0, 60)}...</p>
                  </div>
                  <span className={`read-status ${inquiry.isRead ? 'read' : 'unread'}`}>
                    {inquiry.isRead ? 'Read' : 'New'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-footer-note">
        <p>📊 Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;