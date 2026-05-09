import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaSignInAlt, FaShieldAlt, FaEye, FaEyeSlash, FaHome, FaCheckCircle } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Floating label effect: add class if input has value
  useEffect(() => {
    if (emailRef.current) {
      if (email) emailRef.current.classList.add('has-value');
      else emailRef.current.classList.remove('has-value');
    }
  }, [email]);

  useEffect(() => {
    if (passwordRef.current) {
      if (password) passwordRef.current.classList.add('has-value');
      else passwordRef.current.classList.remove('has-value');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(res.data.admin));
        setSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } else {
        setError(res.data.message);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        if (err.response.status === 500) setError('Internal server error. Please try again later.');
        else setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      } else if (err.request) setError('Cannot connect to server. Make sure the backend is running.');
      else setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="admin-login-container">
      {/* Back to Home – positioned absolutely outside the card */}
      <Link to="/" className="back-home-btn">
        <FaHome /> Back to Home
      </Link>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <FaShieldAlt />
          </div>
          <h2>Admin Portal</h2>
          <p>New Metal Art – Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field with Floating Label */}
          <div className="input-group floating-group">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              ref={emailRef}
            />
            <label htmlFor="email" className="floating-label">
              <FaEnvelope className="label-icon" /> Email Address
            </label>
          </div>

          {/* Password Field with Floating Label + Eye Toggle */}
          <div className="input-group floating-group">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              ref={passwordRef}
            />
            <label htmlFor="password" className="floating-label">
              <FaLock className="label-icon" /> Password
            </label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-toast"><FaCheckCircle /> {success}</div>}

          <button type="submit" disabled={loading}>
            <FaSignInAlt /> {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <span>🔒 Secure Area • Authorized Access Only</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;