import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, Calendar, User, X, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface NotificationsProps {
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Critical patient update',
      message: 'David Williams (PT-2023-004) has been moved to critical status.',
      time: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      read: false,
      icon: <AlertCircle className="text-red-500" />
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Upcoming appointment',
      message: 'Reminder: Emma Thompson has an appointment tomorrow at 10:30 AM.',
      time: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      read: false,
      icon: <Calendar className="text-blue-500" />
    },
    {
      id: 3,
      type: 'system',
      title: 'New patient assigned',
      message: 'A new patient has been assigned to your care: Michael Chen.',
      time: new Date(Date.now() - 5 * 60 * 60000), // 5 hours ago
      read: true,
      icon: <User className="text-green-500" />
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Follow-up required',
      message: 'Sophia Rodriguez needs a follow-up for her asthma treatment.',
      time: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      read: true,
      icon: <Clock className="text-yellow-500" />
    }
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Bell size={18} className="text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="font-medium text-gray-800 dark:text-white">Notifications</h3>
          <div className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">
            {notifications.filter(n => !n.read).length}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className={`flex items-start p-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700 ${notification.read ? 'opacity-70' : ''}`}
          >
            <div className="mr-3">
              {notification.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-white">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {notification.message}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatTime(notification.time)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notifications;
