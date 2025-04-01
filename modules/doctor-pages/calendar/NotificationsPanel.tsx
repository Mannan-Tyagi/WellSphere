import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/outline';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useCalendar();

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = format(notification.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  const formatDateGroup = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    let bgColor = '';
    let textColor = '';
    
    switch (priority) {
      case 'critical':
        bgColor = 'bg-red-100';
        textColor = 'text-red-600';
        break;
      case 'important':
        bgColor = 'bg-amber-100';
        textColor = 'text-amber-600';
        break;
      default:
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-600';
    }
    
    return (
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${bgColor} ${textColor}`}>
        {type === 'appointment' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        )}
        {type === 'task' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        )}
        {type === 'system' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        )}
      </div>
    );
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="border-b border-slate-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-serif text-slate-800">Notifications</h2>
        <div className="flex space-x-2">
          <button 
            onClick={markAllNotificationsAsRead}
            className="text-xs px-2 py-1 bg-teal-50 text-teal-600 border border-teal-200 rounded hover:bg-teal-100 transition-colors"
          >
            Mark all as read
          </button>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="h-full overflow-y-auto pb-20">
        {Object.keys(groupedNotifications).length > 0 ? (
          Object.keys(groupedNotifications)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort dates in descending order
            .map(dateStr => (
              <div key={dateStr} className="mb-4">
                <h3 className="text-xs font-medium text-slate-500 px-4 py-2 bg-slate-50 sticky top-0 z-10">
                  {formatDateGroup(dateStr)}
                </h3>
                <div className="space-y-1">
                  {groupedNotifications[dateStr]
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // Sort notifications by time (newest first)
                    .map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-slate-100 ${notification.read ? '' : 'bg-teal-50'}`}
                      >
                        <div className="flex">
                          {getNotificationIcon(notification.type, notification.priority)}
                          
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <h4 className={`text-sm font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-slate-400">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            
                            {!notification.read && (
                              <div className="mt-2 flex justify-end">
                                <button 
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  className="text-xs flex items-center text-teal-600 hover:text-teal-700"
                                >
                                  <CheckIcon className="w-3.5 h-3.5 mr-1" />
                                  Mark as read
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <BellIcon className="w-8 h-8" />
            </div>
            <h3 className="text-slate-700 font-medium">No notifications</h3>
            <p className="text-slate-500 text-sm mt-2">
              You don't have any notifications yet. They will appear here when available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Import the BellIcon at the top