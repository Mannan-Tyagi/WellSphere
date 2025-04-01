import React, { useState, useEffect } from 'react';
import { format, addMinutes } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCalendar } from '../CalendarContext';
import { Appointment } from '../types';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: { appointmentId: string; conflictingWith: string[] }[];
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  conflicts
}) => {
  const { appointments, updateAppointment } = useCalendar();
  const [conflictingAppointments, setConflictingAppointments] = useState<{
    appointment: Appointment;
    conflictsWith: Appointment[];
  }[]>([]);
  
  useEffect(() => {
    if (conflicts && conflicts.length > 0) {
      // Map conflicts to actual appointment objects
      const mapped = conflicts.map(conflict => {
        const appointment = appointments.find(a => a.id === conflict.appointmentId);
        const conflictsWith = conflict.conflictingWith
          .map(id => appointments.find(a => a.id === id))
          .filter(Boolean) as Appointment[];
        
        return {
          appointment: appointment as Appointment,
          conflictsWith
        };
      }).filter(item => item.appointment); // Filter out any undefined appointments
      
      setConflictingAppointments(mapped);
    }
  }, [conflicts, appointments]);
  
  if (!isOpen) return null;
  
  const handleResolveConflict = (appointmentId: string, newStartTime: Date) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (appointment) {
      const duration = appointment.duration;
      const newEndTime = addMinutes(newStartTime, duration);
      
      updateAppointment({
        ...appointment,
        startTime: newStartTime,
        endTime: newEndTime
      });
      
      // Close the modal if all conflicts are resolved
      if (conflicts.length === 1) {
        onClose();
      }
    }
  };
  
  const suggestAlternativeTimes = (appointment: Appointment, conflictsWith: Appointment[]): Date[] => {
    // Sort conflicting appointments by start time
    const sorted = [...conflictsWith].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );
    
    const alternatives: Date[] = [];
    
    // Suggest time before the first conflicting appointment
    const firstConflict = sorted[0];
    if (firstConflict) {
      const beforeTime = new Date(firstConflict.startTime);
      beforeTime.setMinutes(beforeTime.getMinutes() - appointment.duration);
      if (beforeTime.getHours() >= 8 && beforeTime.getHours() < 18) { // Within office hours
        alternatives.push(beforeTime);
      }
    }
    
    // Suggest time after each conflicting appointment
    sorted.forEach(conflict => {
      const afterTime = new Date(conflict.endTime);
      if (afterTime.getHours() >= 8 && afterTime.getHours() < 18) { // Within office hours
        alternatives.push(afterTime);
      }
    });
    
    // Suggest next day same time
    const nextDay = new Date(appointment.startTime);
    nextDay.setDate(nextDay.getDate() + 1);
    alternatives.push(nextDay);
    
    return alternatives;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-red-50">
          <h2 className="text-xl font-serif text-slate-800">Scheduling Conflicts Detected</h2>
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
            The following appointments have scheduling conflicts. Please resolve them by selecting an alternative time.
          </p>
          
          {conflictingAppointments.length > 0 ? (
            <div className="space-y-8">
              {conflictingAppointments.map(({ appointment, conflictsWith }) => (
                <div key={appointment.id} className="border border-red-200 rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-slate-800">{appointment.patientName}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded">
                        {format(appointment.startTime, 'MMM d, yyyy')}
                      </span>
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded">
                        {format(appointment.startTime, 'h:mm a')} - {format(appointment.endTime, 'h:mm a')}
                      </span>
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded">
                        {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Conflicts with:</h4>
                    <ul className="space-y-2">
                      {conflictsWith.map(conflict => (
                        <li key={conflict.id} className="text-sm bg-red-50 p-2 rounded border border-red-100">
                          <span className="font-medium">{conflict.patientName}</span>
                          <span className="mx-1">•</span>
                          <span>{format(conflict.startTime, 'h:mm a')} - {format(conflict.endTime, 'h:mm a')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Suggested alternative times:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestAlternativeTimes(appointment, conflictsWith).map((time, index) => (
                        <button
                          key={index}
                          onClick={() => handleResolveConflict(appointment.id, time)}
                          className="text-left text-sm bg-teal-50 hover:bg-teal-100 p-2 rounded border border-teal-200 transition-colors"
                        >
                          <div className="font-medium text-teal-700">
                            {format(time, 'MMM d, yyyy')}
                          </div>
                          <div className="text-slate-600">
                            {format(time, 'h:mm a')} - {format(addMinutes(time, appointment.duration), 'h:mm a')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">No conflicts to resolve</p>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};