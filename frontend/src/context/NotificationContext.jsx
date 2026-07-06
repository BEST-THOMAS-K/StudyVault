import { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
        const count = parsed.filter(n => !n.read).length;
        setUnreadCount(count);
        console.log('📥 Loaded notifications from storage:', parsed);
        console.log('🔔 Unread count:', count);
      } catch (e) {
        console.error('Error loading notifications:', e);
      }
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
    console.log('💾 Saved notifications to storage:', notifications);
    console.log('🔔 Updated unread count:', count);
  }, [notifications]);

  // Add a new notification
  const addNotification = (subject, title, file, uploaded_at) => {
    console.log('📢 Adding notification:', { subject, title, file, uploaded_at });
    
    const newNotification = {
      id: Date.now(),
      subject: subject,
      title: title,
      file: file,
      uploaded_at: uploaded_at || new Date().toISOString(),
      read: false,
      type: 'upload'
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      console.log('✅ Updated notifications:', updated);
      return updated;
    });
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('newNotification', {
      detail: newNotification
    }));

    return newNotification;
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    console.log('📌 Marking all notifications as read');
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Clear all notifications
  const clearAll = () => {
    console.log('🗑️ Clearing all notifications');
    setNotifications([]);
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // Get all notifications
  const getAllNotifications = () => {
    return notifications;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      getUnreadCount,
      getAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};