import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronRight, Calendar, Users, FileText, AlertCircle, CheckCircle, Clock, X, Filter, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationsWidget = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New appointment request',
      message: 'Sarah Thompson requested an appointment for tomorrow at 2:00 PM',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'appointment',
      read: false,
      actionable: true,
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Lab results available',
      message: 'Lab results for patient Michael Rodriguez are now available',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'results',
      read: false,
      actionable: true,
      priority: 'high'
    },
    {
      id: 3,
      title: 'Prescription renewal',
      message: 'Emma Wilson requested a prescription renewal for Lisinopril',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      type: 'prescription',
      read: true,
      actionable: true,
      priority: 'medium'
    },
    {
      id: 4,
      title: 'System maintenance',
      message: 'The system will be under maintenance tonight from 2:00 AM to 4:00 AM',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      type: 'system',
      read: true,
      actionable: false,
      priority: 'low'
    },
    {
      id: 5,
      title: 'Patient message',
      message: 'David Chen sent you a new message regarding his medication',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'message',
      read: true,
      actionable: true,
      priority: 'medium'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'actionable') return notification.actionable;
    if (activeFilter === 'high') return notification.priority === 'high';
    return true;
  });

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Dismiss notification
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={16} className="text-blue-500" />;
      case 'results':
        return <FileText size={16} className="text-purple-500" />;
      case 'prescription':
        return <FileText size={16} className="text-green-500" />;
      case 'system':
        return <AlertCircle size={16} className="text-amber-500" />;
      case 'message':
        return <Users size={16} className="text-teal-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  // Get priority indicator
  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-2 overflow-x-auto pb-1 text-xs">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-1 rounded-md whitespace-nowrap ${activeFilter === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('unread')}
            className={`px-2 py-1 rounded-md whitespace-nowrap ${activeFilter === 'unread' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            Unread
          </button>
          <button 
            onClick={() => setActiveFilter('actionable')}
            className={`px-2 py-1 rounded-md whitespace-nowrap ${activeFilter === 'actionable' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            Actionable
          </button>
          <button 
            onClick={() => setActiveFilter('high')}
            className={`px-2 py-1 rounded-md whitespace-nowrap ${activeFilter === 'high' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            High Priority
          </button>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="text-xs text-[#006D77] hover:underline whitespace-nowrap"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`relative p-2 rounded-md ${notification.read ? 'bg-white hover:bg-gray-50' : 'bg-[#F0F9FA]'} border border-gray-100`}
            >
              <div className="flex">
                <div className="mr-3 p-2 rounded-full bg-gray-100 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow" onClick={() => markAsRead(notification.id)}>
                  <div className="flex justify-between items-start">
                    <p className={`font-medium text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </p>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getPriorityIndicator(notification.priority)}`}></span>
                      <div className="relative">
                        <button 
                          onClick={() => setShowActionMenu(showActionMenu === notification.id ? null : notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        
                        {showActionMenu === notification.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border">
                            <button 
                              onClick={() => {
                                markAsRead(notification.id);
                                setShowActionMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                            >
                              <CheckCircle size={14} className="mr-2" />
                              Mark as read
                            </button>
                            <button 
                              onClick={() => {
                                dismissNotification(notification.id);
                                setShowActionMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                            >
                              <X size={14} className="mr-2" />
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </span>
                    {notification.actionable && (
                      <button className="text-xs text-[#006D77] hover:underline">
                        Take action
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {!notification.read && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#006D77]"></span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No notifications found</p>
            {activeFilter !== 'all' && (
              <button 
                onClick={() => setActiveFilter('all')}
                className="mt-2 text-sm text-[#006D77] hover:underline"
              >
                Show all notifications
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <Link href="/Doctor/Notifications" className="text-[#006D77] text-sm hover:underline flex items-center justify-center">
          View All Notifications <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NotificationsWidget;