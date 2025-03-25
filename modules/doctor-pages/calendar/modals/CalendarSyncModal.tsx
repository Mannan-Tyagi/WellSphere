import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({ isOpen, onClose }) => {
  const [activeSync, setActiveSync] = useState<string[]>(['google']);
  
  const calendarOptions = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 2V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 10H20" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#4285F4'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12H15" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V15" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#0078D4'
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2V6" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 2V6" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 10H20" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#FF3B30'
    }
  ];
  
  const toggleCalendarSync = (calendarId: string) => {
    setActiveSync(prev => {
      if (prev.includes(calendarId)) {
        return prev.filter(id => id !== calendarId);
      } else {
        return [...prev, calendarId];
      }
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-serif text-slate-800">Calendar Sync Settings</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Connect your external calendars to automatically sync appointments and avoid scheduling conflicts.
          </p>
          
          <div className="space-y-4">
            {calendarOptions.map(calendar => {
              const isActive = activeSync.includes(calendar.id);
              
              return (
                <div 
                  key={calendar.id}
                  className={`p-4 rounded-lg border ${
                    isActive 
                      ? `border-${calendar.id === 'google' ? 'blue-200' : calendar.id === 'outlook' ? 'blue-300' : 'red-200'}`
                      : 'border-slate-200'
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {calendar.icon}
                      <span className="ml-3 font-medium text-slate-800">{calendar.name}</span>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isActive}
                        onChange={() => toggleCalendarSync(calendar.id)}
                      />
                      <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                        after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border 
                        after:rounded-full after:h-5 after:w-5 after:transition-all
                        ${isActive ? `peer-checked:bg-[${calendar.color}]` : ''}`}></div>
                    </label>
                  </div>
                  
                  {isActive && (
                    <div className="mt-3 pl-9">
                      <div className="flex items-center mb-2">
                        <input 
                          id={`${calendar.id}-two-way`} 
                          type="radio" 
                          name={`${calendar.id}-sync-type`}
                          defaultChecked 
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                        />
                        <label htmlFor={`${calendar.id}-two-way`} className="ml-2 text-sm text-slate-700">
                          Two-way sync (changes in either calendar will sync)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          id={`${calendar.id}-one-way`} 
                          type="radio" 
                          name={`${calendar.id}-sync-type`}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                        />
                        <label htmlFor={`${calendar.id}-one-way`} className="ml-2 text-sm text-slate-700">
                          One-way sync (only read availability)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Sync Options</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  id="sync-conflicts" 
                  type="checkbox" 
                  defaultChecked
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                />
                <label htmlFor="sync-conflicts" className="ml-2 text-sm text-slate-700">
                  Detect scheduling conflicts with external calendars
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="sync-auto" 
                  type="checkbox" 
                  defaultChecked
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                />
                <label htmlFor="sync-auto" className="ml-2 text-sm text-slate-700">
                  Automatically sync new appointments
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="sync-personal" 
                  type="checkbox" 
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                />
                <label htmlFor="sync-personal" className="ml-2 text-sm text-slate-700">
                  Show personal events on work calendar (private details hidden)
                </label>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};