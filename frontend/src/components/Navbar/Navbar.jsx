import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { 
  FaHome, FaBook, FaRobot, FaFileAlt, FaBell, 
  FaSignOutAlt, FaSignInAlt, FaBars, FaTimes,
  FaCheckDouble, FaTrash
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotifications = () => setIsNotificationOpen(!isNotificationOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setIsNotificationOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-gradient">StudyVault</span>
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={toggleMenu}>
            <FaHome /> Home
          </Link>
          <Link to="/notes" className={isActive('/notes') ? 'active' : ''} onClick={toggleMenu}>
            <FaBook /> Notes
          </Link>
          <Link to="/ai" className={isActive('/ai') ? 'active' : ''} onClick={toggleMenu}>
            <FaRobot /> AI
          </Link>
          <Link to="/pyqs" className={isActive('/pyqs') ? 'active' : ''} onClick={toggleMenu}>
            <FaFileAlt /> PYQs
          </Link>

          <div className="navbar-actions">
            {user ? (
              <>
                {/* Notification Bell with Dropdown */}
                <div className="notification-wrapper" ref={dropdownRef}>
                  <button 
                    className="notification-bell" 
                    onClick={toggleNotifications}
                    aria-label="Notifications"
                  >
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <span>Notifications</span>
                        <div className="notification-actions">
                          {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="notif-action-btn">
                              <FaCheckDouble /> Mark all read
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button onClick={clearAll} className="notif-action-btn">
                              <FaTrash /> Clear all
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="no-notifications">
                            <span className="no-notif-icon">🔔</span>
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                              onClick={() => handleNotificationClick(notif.id)}
                            >
                              <div className="notif-icon">📄</div>
                              <div className="notif-content">
                                <div className="notif-title">{notif.title || 'New upload'}</div>
                                <div className="notif-subject">{notif.subject || 'General'}</div>
                                <div className="notif-time">
                                  {notif.uploaded_at ? new Date(notif.uploaded_at).toLocaleString() : 'Just now'}
                                </div>
                              </div>
                              {!notif.read && <span className="notif-dot"></span>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="login-btn" onClick={toggleMenu}>
                <FaSignInAlt /> Login
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;