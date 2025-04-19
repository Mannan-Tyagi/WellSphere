"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  X, 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  User, 
  Settings,
  LogOut,
  AlertCircle,
  Calendar,
  MessageCircle,
  FileText,
  Menu
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { useSearch } from '@/contexts/SearchContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

type GlobalTopBarProps = {
  toggleMobileMenu: () => void;
};

const GlobalTopBar = ({ toggleMobileMenu }: GlobalTopBarProps) => {
  const { pageTitle } = useApp();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification 
  } = useNotifications();
  const { 
    searchQuery, 
    setSearchQuery, 
    performSearch, 
    recentSearches 
  } = useSearch();
  const { userType, breadcrumbs } = useNavigation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchBox(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'task':
        return <CheckCircle className="h-4 w-4 text-amber-500" />;
      case 'results':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'prescription':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Title and Breadcrumbs */}
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 mr-2 lg:hidden rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
              
              {/* Breadcrumbs */}
              {breadcrumbs.length > 1 && (
                <div className="hidden md:flex items-center text-sm text-gray-500 mt-0.5 space-x-1">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={item.href}>
                      {index > 0 && <span className="mx-1">/</span>}
                      <Link 
                        href={item.href}
                        className={`hover:text-[#006D77] ${index === breadcrumbs.length - 1 ? 'font-medium text-[#006D77]' : ''}`}
                      >
                        {item.label}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right section - Actions */}
          <div className="flex items-center space-x-1">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setShowSearchBox(!showSearchBox)}
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors relative"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {showSearchBox && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border p-3">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2"
                      autoFocus
                    />
                  </form>
                  
                  {recentSearches.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Recent Searches</span>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.slice(0, 3).map((search, idx) => (
                          <button
                            key={idx}
                            className="flex items-center text-sm text-gray-600 hover:bg-gray-50 w-full px-2 py-1 rounded-md text-left"
                            onClick={() => {
                              setSearchQuery(search);
                              performSearch(search);
                            }}
                          >
                            <Clock className="h-3 w-3 mr-2 text-gray-400" />
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <div ref={notificationRef} className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border max-h-[32rem] overflow-hidden flex flex-col">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-[#006D77] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-y-auto flex-grow">
                    {notifications.length > 0 ? (
                      <div className="divide-y">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 ${notification.read ? 'bg-white' : 'bg-[#F0F9FA]'} hover:bg-gray-50`}
                          >
                            <div className="flex">
                              <div className="mr-3 p-2 bg-gray-100 rounded-full">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                                  <button 
                                    onClick={() => dismissNotification(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-400">
                                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                  </span>
                                  {!notification.read && (
                                    <button 
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs text-[#006D77] hover:underline flex items-center"
                                    >
                                      <CheckCircle size={12} className="mr-1" />
                                      Mark as read
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                          <Bell className="h-6 w-6" />
                        </div>
                        <p className="text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t text-center">
                    <Link 
                      href={userType === 'patient' ? '/patient/notifications' : '/doctor/notifications'}
                      className="text-sm text-[#006D77] hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <div className="w-8 h-8 bg-[#006D77] rounded-full flex items-center justify-center text-white font-medium">
                  {userType === 'patient' ? 'P' : 'D'}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border overflow-hidden">
                  <div className="p-3 border-b">
                    <p className="font-medium">
                      {userType === 'patient' ? 'John Smith' : 'Dr. Sarah Johnson'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userType === 'patient' ? 'Patient' : 'Cardiologist'}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      href={userType === 'patient' ? '/patient/profile' : '/doctor/profile'} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Profile
                    </Link>
                    <Link 
                      href={userType === 'patient' ? '/patient/settings' : '/doctor/settings'} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      Settings
                    </Link>
                  </div>
                  
                  <div className="py-1 border-t">
                    <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      <LogOut className="mr-3 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalTopBar;
