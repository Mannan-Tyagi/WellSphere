"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'routine' | 'important' | 'critical';
  type: 'appointment' | 'task' | 'system' | 'message' | 'results' | 'prescription';
  actionUrl?: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock data for initial notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New appointment request',
    message: 'Sarah Thompson requested an appointment for tomorrow at 2:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: 'important',
    type: 'appointment',
    actionUrl: '/patient/appointments',
  },
  {
    id: '2',
    title: 'Medication reminder',
    message: 'Remember to take your Lisinopril medication today',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    priority: 'routine',
    type: 'task',
  },
  {
    id: '3',
    title: 'New message from Dr. Johnson',
    message: 'Dr. Johnson sent you a message regarding your recent lab results',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: true,
    priority: 'important',
    type: 'message',
    actionUrl: '/patient/messages',
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications([newNotification, ...notifications]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      addNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
