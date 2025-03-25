import React, { useState, useRef } from 'react';
import { useCalendar } from './CalendarContext';
import { 
  PlusIcon, 
  CalendarDaysIcon, 
  BellIcon, 
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  PrinterIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { AppointmentFormModal } from './modals/AppointmentFormModal';
import { RecurringAppointmentModal } from './modals/RecurringAppointmentModal';
import { ExportCalendarModal } from './modals/ExportCalendarModal';
import { CalendarSyncModal } from './modals/CalendarSyncModal';

export const QuickActionButton: React.FC = () => {
  const { selectedDate, appointments } = useCalendar();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(menuRef, () => setIsMenuOpen(false));

  const actions = [
    // Primary Actions
    { 
      label: 'New Appointment', 
      icon: <CalendarDaysIcon className="w-5 h-5" />,
      color: 'bg-teal-600',
      action: () => {
        setIsAppointmentModalOpen(true);
        setIsMenuOpen(false);
      }
    },
    { 
      label: 'Recurring Appointment', 
      icon: <ArrowPathIcon className="w-5 h-5" />,
      color: 'bg-blue-600',
      action: () => {
        // Find most recent appointment to use as template
        const latestAppointment = [...appointments].sort(
          (a, b) => b.startTime.getTime() - a.startTime.getTime()
        )[0];
        
        if (latestAppointment) {
          setIsRecurringModalOpen(true);
        } else {
          setIsAppointmentModalOpen(true); // Fallback to regular appointment
        }
        setIsMenuOpen(false);
      }
    },
    { 
      label: 'Set Reminder', 
      icon: <BellIcon className="w-5 h-5" />,
      color: 'bg-amber-500',
      action: () => {
        console.log('Create new reminder');
        setIsMenuOpen(false);
      }
    },
    
    // Secondary Actions
    { 
      label: 'Print Schedule', 
      icon: <PrinterIcon className="w-5 h-5" />,
      color: 'bg-slate-500',
      action: () => {
        window.print();
        setIsMenuOpen(false);
      }
    },
    { 
      label: 'Export Calendar', 
      icon: <CloudArrowDownIcon className="w-5 h-5" />,
      color: 'bg-purple-600',
      action: () => {
        setIsExportModalOpen(true);
        setIsMenuOpen(false);
      }
    },
    { 
      label: 'Sync Settings', 
      icon: <ArrowPathIcon className="w-5 h-5" />,
      color: 'bg-indigo-600',
      action: () => {
        setIsSyncModalOpen(true);
        setIsMenuOpen(false);
      }
    },
  ];

  return (
    <>
      <div ref={menuRef} className="fixed right-8 bottom-8 z-30">
        {/* Action Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-16 right-0 mb-2 w-60 rounded-lg bg-white shadow-lg border border-slate-200 overflow-hidden transition-all duration-200 ease-in-out">
            <div className="py-1 max-h-[400px] overflow-y-auto">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex w-full items-center px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className={`p-1.5 rounded-full mr-3 ${action.color} text-white`}>
                    {action.icon}
                  </span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Main Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-4 rounded-full shadow-lg text-white transition-all duration-300 ${
            isMenuOpen ? 'bg-slate-700 rotate-45' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Modals */}
      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        initialDate={selectedDate}
        initialHour={9}
      />
      
      <RecurringAppointmentModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        appointment={appointments.length > 0 ? appointments[0] : null}
      />
      
      <ExportCalendarModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
      
      <CalendarSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </>
  );
};