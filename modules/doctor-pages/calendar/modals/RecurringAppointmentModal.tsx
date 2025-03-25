import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCalendar } from '../CalendarContext';
import { Appointment } from '../types';
import { addDays, addWeeks, addMonths, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface RecurringAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const RecurringAppointmentModal: React.FC<RecurringAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const { addAppointment } = useCalendar();
  
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [occurrences, setOccurrences] = useState<number>(4);
  const [interval, setInterval] = useState<number>(1);
  const [daysSelected, setDaysSelected] = useState<{[key: string]: boolean}>({
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false
  });
  
  if (!isOpen || !appointment) return null;
  
  const handleDayToggle = (day: string) => {
    setDaysSelected(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const dayOfWeek = appointment.startTime.getDay();
  const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayOfWeek];
  
  // Set the current day of the week when switching to weekly
  const handleRecurrenceTypeChange = (type: 'daily' | 'weekly' | 'monthly') => {
    setRecurrenceType(type);
    if (type === 'weekly') {
      setDaysSelected({
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        [currentDay]: true
      });
    }
  };
  
  const createRecurringAppointments = () => {
    const newAppointments: Appointment[] = [];
    
    if (recurrenceType === 'daily') {
      for (let i = 1; i <= occurrences; i++) {
        const startTime = addDays(appointment.startTime, i * interval);
        const endTime = addDays(appointment.endTime, i * interval);
        
        newAppointments.push({
          ...appointment,
          id: uuidv4(),
          startTime,
          endTime
        });
      }
    } else if (recurrenceType === 'weekly') {
      const selectedDays = Object.entries(daysSelected)
        .filter(([_, selected]) => selected)
        .map(([day]) => ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(day));
      
      for (let week = 1; week <= occurrences; week++) {
        for (const day of selectedDays) {
          const dayDiff = (day - dayOfWeek + 7) % 7;
          const startDate = addDays(appointment.startTime, dayDiff);
          const startTime = addWeeks(startDate, (week - 1) * interval);
          const endTime = addWeeks(
            addDays(appointment.endTime, dayDiff),
            (week - 1) * interval
          );
          
          // Skip the original appointment day in the first week
          if (week === 1 && day === dayOfWeek) continue;
          
          newAppointments.push({
            ...appointment,
            id: uuidv4(),
            startTime,
            endTime
          });
        }
      }
    } else if (recurrenceType === 'monthly') {
      for (let i = 1; i <= occurrences; i++) {
        const startTime = addMonths(appointment.startTime, i * interval);
        const endTime = addMonths(appointment.endTime, i * interval);
        
        newAppointments.push({
          ...appointment,
          id: uuidv4(),
          startTime,
          endTime
        });
      }
    }
    
    // Add all new appointments
    newAppointments.forEach(appt => {
      addAppointment(appt);
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-serif text-slate-800">Create Recurring Appointment</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600">
              Creating recurring appointments for: <strong>{appointment.patientName}</strong><br />
              Starting on: <strong>{format(appointment.startTime, 'MMM d, yyyy')}</strong>
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Recurrence Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recurrence Pattern
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recurrenceType"
                    checked={recurrenceType === 'daily'}
                    onChange={() => handleRecurrenceTypeChange('daily')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="ml-2 text-sm">Daily</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recurrenceType"
                    checked={recurrenceType === 'weekly'}
                    onChange={() => handleRecurrenceTypeChange('weekly')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="ml-2 text-sm">Weekly</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recurrenceType"
                    checked={recurrenceType === 'monthly'}
                    onChange={() => handleRecurrenceTypeChange('monthly')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="ml-2 text-sm">Monthly</span>
                </label>
              </div>
            </div>
            
            {/* Interval */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recur every
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                />
                <span className="ml-2 text-sm text-slate-600">
                  {recurrenceType === 'daily' ? 'days' : 
                   recurrenceType === 'weekly' ? 'weeks' : 'months'}
                </span>
              </div>
            </div>
            
            {/* Weekly Options */}
            {recurrenceType === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  On these days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        daysSelected[day]
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {day.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Occurrences */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Create for
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={occurrences}
                  onChange={(e) => setOccurrences(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                />
                <span className="ml-2 text-sm text-slate-600">occurrences</span>
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-slate-50 p-3 rounded-md">
              <p className="text-sm text-slate-700">
                {recurrenceType === 'daily' && `Creating appointments every ${interval} day(s) for ${occurrences} occurrences`}
                {recurrenceType === 'weekly' && `Creating appointments every ${interval} week(s) on selected days for ${occurrences} weeks`}
                {recurrenceType === 'monthly' && `Creating appointments every ${interval} month(s) for ${occurrences} occurrences`}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createRecurringAppointments}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Create Recurring Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};