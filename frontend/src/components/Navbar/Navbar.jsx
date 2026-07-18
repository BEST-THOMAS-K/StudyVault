import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { FaHome, FaBook, FaRobot, FaFileAlt, FaBell, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <Link to="/" onClick={toggleMenu}><FaHome /> Home</Link>
          <Link to="/notes" onClick={toggleMenu}><FaBook /> Notes</Link>
          <Link to="/ai" onClick={toggleMenu}><FaRobot /> AI</Link>
          <Link to="/pyqs" onClick={toggleMenu}><FaFileAlt /> PYQs</Link>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/contact" className="notification-bell" onClick={toggleMenu}>
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </Link>
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