import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import "./Contact.css";

function Contact() {
  const { authFetch, user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();
  
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch recent uploads (notes) from the API
  const fetchRecentUploads = async () => {
    try {
      const response = await authFetch("http://127.0.0.1:8000/api/notes/notes/");
      const data = await response.json();
      
      // Get only the latest 10 uploads
      const sorted = data.sort((a, b) => 
        new Date(b.uploaded_at) - new Date(a.uploaded_at)
      );
      
      setRecentUploads(sorted.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchRecentUploads();
    
    const interval = setInterval(() => {
      fetchRecentUploads();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle notification bell click - mark all as read when opened
  const handleBellClick = () => {
    // Toggle the dropdown
    setShowNotifications(!showNotifications);
    
    // If there are unread notifications, mark them all as read
    if (!showNotifications && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (filename) => {
    if (!filename) return "📄";
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return "🖼️";
    if (ext === 'pdf') return "📕";
    if (['doc', 'docx'].includes(ext)) return "📘";
    if (ext === 'txt') return "📃";
    return "📄";
  };

  return (
    <div className="contact-page">
      {/* Notification Bell */}
      <div className="notification-bell-container">
        <button 
          className={`notification-bell ${unreadCount > 0 ? 'has-notifications' : ''}`}
          onClick={handleBellClick}
        >
          🔔
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>📬 Notifications</h3>
              <div className="notification-actions">
                <button onClick={clearAll} className="clear-btn">
                  Clear all
                </button>
              </div>
            </div>
            
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <span>🔕</span>
                  <p>No notifications yet</p>
                  <small>Upload notes to see notifications here</small>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-icon">
                      {getFileIcon(notification.file)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">
                        <strong>{notification.title}</strong>
                      </div>
                      <div className="notification-details">
                        <span className="notification-subject">
                          📚 {notification.subject}
                        </span>
                        <span className="notification-time">
                          🕐 {formatTime(notification.uploaded_at)}
                        </span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="notification-unread-dot">●</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="contact-container">
        <div className="contact-header">
          <h1>📬 Notifications</h1>
          <p>Stay updated with all file uploads and team activity</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{recentUploads.length}</h3>
              <p>Recent Uploads</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-info">
              <h3>{unreadCount}</h3>
              <p>Unread Notifications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{user?.username || 'Guest'}</h3>
              <p>Logged in as</p>
            </div>
          </div>
        </div>

        {/* Recent Uploads List */}
        <div className="recent-uploads-section">
          <div className="section-header">
            <h2>📂 Recent Uploads</h2>
            <button onClick={fetchRecentUploads} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading recent uploads...</p>
            </div>
          ) : (
            <div className="uploads-list">
              {recentUploads.length === 0 ? (
                <div className="empty-state">
                  <span>📭</span>
                  <p>No uploads yet</p>
                  <small>Upload files from the Notes page</small>
                </div>
              ) : (
                recentUploads.map((upload, index) => (
                  <div key={index} className="upload-item">
                    <div className="upload-icon">
                      {getFileIcon(upload.file)}
                    </div>
                    <div className="upload-details">
                      <div className="upload-title">{upload.title}</div>
                      <div className="upload-meta">
                        <span className="upload-subject">📚 {upload.subject_name}</span>
                        <span className="upload-time">🕐 {formatTime(upload.uploaded_at)}</span>
                      </div>
                    </div>
                    <a 
                      href={`http://127.0.0.1:8000${upload.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="view-btn"
                    >
                      👁️ View
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;