import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Handle notification link click - mark all as read
  const handleNotificationClick = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/">📚 StudyVault</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/notes">Notes</Link>
        </li>

        <li>
          <Link to="/ai">AI Assistant</Link>
        </li>

        <li>
          <Link to="/pyqs">PYQs</Link>
        </li>

        <li className="notification-nav-item">
          <Link 
            to="/contact" 
            className="notification-link"
            onClick={handleNotificationClick}
          >
            🔔 Notification
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
        </li>
      </ul>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Auth Section */}
      <div className="auth-section">
        {user ? (
          <div className="user-menu">
            <span className="user-name">👤 {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="cta-btn">
            Get Started
          </Link>
        )}
      </div>

    </nav>
  );
}

export default Navbar;