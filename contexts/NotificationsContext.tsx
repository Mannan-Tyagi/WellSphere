"use client";

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '../types/notification';

interface NotificationsContextProps {
  notifications: Notification[];
  loadingNotifications: boolean;
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  handleNotificationClick: (notification: Notification) => void;
}

// Export the context directly so it can be imported if needed
export const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

// Add export keyword here to create a named export
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get router reference lazily - only when needed
  const router = typeof window !== 'undefined' ? useRouter() : null;

  // Fetch notifications on component mount
  useEffect(() => {
    // Simulate fetching notifications from API
    setTimeout(() => {
      // Example notifications data
      const fetchedNotifications: Notification[] = [
        // Your initial notifications data can go here
      ];

      setNotifications(fetchedNotifications);
      setLoadingNotifications(false);
      updateUnreadCount(fetchedNotifications);
    }, 1000);
  }, []);

  // Update unread count whenever notifications change
  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter(notif => !notif.read).length;
    setUnreadCount(count);
  };

  // Add a new notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    updateUnreadCount([notification, ...notifications]);
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    updateUnreadCount(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    updateUnreadCount(notifications.filter(notification => notification.id !== id));
  };

  // Safe navigation function - use the router here when it's needed
  const navigateTo = useCallback((url: string) => {
    if (router) {
      router.push(url);
    } else if (typeof window !== 'undefined') {
      // Fallback if router isn't available
      window.location.href = url;
    }
  }, [router]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark the notification as read
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.actionUrl) {
      navigateTo(notification.actionUrl);
      return;
    }

    switch (notification.type) {
      case 'appointment':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedAppointmentId', notification.relatedItemId.toString());
          navigateTo(`/patient/appointments/details/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/appointments');
        }
        break;
      case 'message':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedMessageId', notification.relatedItemId.toString());
          navigateTo(`/patient/messages/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/messages');
        }
        break;
      case 'medication':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedMedicationId', notification.relatedItemId.toString());
          navigateTo(`/patient/medications/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/medications');
        }
        break;
      case 'record':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedRecordId', notification.relatedItemId.toString());
          navigateTo(`/patient/medical-records/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/medical-records');
        }
        break;
      case 'system':
      default:
        navigateTo('/patient/dashboard');
        break;
    }
  }, [router, notifications]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      loadingNotifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      handleNotificationClick
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Add default export to support both import styles
export default NotificationProvider;
