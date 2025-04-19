import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define types for notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'normal' | 'important' | 'urgent';
  type: 'appointment' | 'message' | 'medication' | 'record' | 'system';
  relatedItemId?: string | number;
  relatedItemType?: string;
  actionUrl?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  handleNotificationClick: (notification: Notification) => void;
  loadingNotifications: boolean;
}

// Create the context
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Create a provider component
export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const router = useRouter();

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications, (key, value) => {
            if (key === 'timestamp') {
              return new Date(value);
            }
            return value;
          });
          setNotifications(parsedNotifications);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    
    // Setup event listeners for real-time updates
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notification_updated', handleNotificationEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notification_updated', handleNotificationEvent as EventListener);
    };
  }, []);

  // Handle storage change for cross-tab synchronization
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'notifications' && event.newValue) {
      const updatedNotifications = JSON.parse(event.newValue, (key, value) => {
        if (key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
      setNotifications(updatedNotifications);
    }
  };

  // Handle custom notification events
  const handleNotificationEvent = (event: CustomEvent) => {
    if (event.detail && event.detail.notifications) {
      setNotifications(event.detail.notifications);
    }
  };

  // Persist notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Dispatch a custom event
      const event = new CustomEvent('notification_updated', { 
        detail: { notifications } 
      });
      window.dispatchEvent(event);
    }
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Add a new notification
  const addNotification = (notification: Notification) => {
    const newNotification = {
      ...notification,
      id: typeof notification.id !== 'undefined' ? notification.id : Date.now().toString(),
      timestamp: notification.timestamp || new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Handle notification click navigation
  const handleNotificationClick = (notification: Notification) => {
    // Mark the notification as read
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      return;
    }
    
    switch (notification.type) {
      case 'appointment':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedAppointmentId', notification.relatedItemId.toString());
          router.push(`/patient/appointments/details/${notification.relatedItemId}`);
        } else {
          router.push('/patient/appointments');
        }
        break;
      case 'message':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedMessageId', notification.relatedItemId.toString());
          router.push(`/patient/messages/${notification.relatedItemId}`);
        } else {
          router.push('/patient/messages');
        }
        break;
      case 'medication':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedMedicationId', notification.relatedItemId.toString());
          router.push(`/patient/medications/${notification.relatedItemId}`);
        } else {
          router.push('/patient/medications');
        }
        break;
      case 'record':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedRecordId', notification.relatedItemId.toString());
          router.push(`/patient/medical-records/${notification.relatedItemId}`);
        } else {
          router.push('/patient/medical-records');
        }
        break;
      case 'system':
      default:
        router.push('/patient/dashboard');
        break;
    }
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationClick,
    loadingNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
