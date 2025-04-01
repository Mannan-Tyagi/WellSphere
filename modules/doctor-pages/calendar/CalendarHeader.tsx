import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { MagnifyingGlassIcon, BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface CalendarHeaderProps {
  onToggleAiAssistant: () => void;
  onToggleNotifications: () => void;
  aiAssistantOpen: boolean;
  notificationsOpen: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  onToggleAiAssistant,
  onToggleNotifications,
  aiAssistantOpen,
  notificationsOpen
}) => {
  const { 
    activeView, 
    setActiveView, 
    selectedDate,
    goToToday,
    goToNextDate,
    goToPreviousDate,
    dateRange,
    unreadNotificationsCount
  } = useCalendar();
  
  const formatDateDisplay = () => {
    switch (activeView) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return format(selectedDate, 'MMMM d, yyyy');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-10">
      <div className="flex items-center justify-between">
        {/* Left Section: Date Navigation */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-serif text-slate-800 hidden md:block">Calendar</h1>
          
          <div className="flex space-x-2 items-center">
            <button 
              onClick={goToPreviousDate}
              className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-slate-800 font-medium">{formatDateDisplay()}</span>
            
            <button 
              onClick={goToNextDate}
              className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button 
              onClick={goToToday}
              className="ml-2 px-3 py-1.5 text-sm bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
        
        {/* Center: View Selector */}
        <div className="hidden md:flex rounded-lg bg-slate-100 p-1">
          {(['day', 'week', 'month'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === view
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-9 pr-4 py-1.5 w-56 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          </div>
          
          {/* AI Assistant Button */}
          <button 
            onClick={onToggleAiAssistant}
            className={`p-2 rounded-full relative transition-all ${
              aiAssistantOpen 
                ? 'bg-teal-100 text-teal-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="AI Scheduling Assistant"
          >
            <SparklesIcon className="w-5 h-5" />
          </button>
          
          {/* Notifications */}
          <button 
            onClick={onToggleNotifications}
            className={`p-2 rounded-full relative transition-all ${
              notificationsOpen 
                ? 'bg-amber-100 text-amber-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-amber-500 text-white rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          
          {/* Settings */}
          <button 
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            title="Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile View Selector */}
      <div className="md:hidden flex justify-center mt-3 rounded-lg bg-slate-100 p-1">
        {(['day', 'week', 'month'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeView === view
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </header>
  );
};