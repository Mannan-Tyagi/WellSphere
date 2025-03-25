import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { AppointmentIndicator } from '../AppointmentIndicator';
import { Appointment } from '../types';

interface MonthViewProps {
  onAppointmentClick: (appointment: Appointment) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ onAppointmentClick }) => {
  const { 
    selectedDate, 
    appointments,
    setSelectedDate,
    scheduleConflicts
  } = useCalendar();

  // Get all days in the month
  const start = startOfMonth(selectedDate);
  const end = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start, end });
  
  // Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = getDay(start);
  
  // Create array for all calendar cells including empty ones for proper alignment
  const calendarDays = [];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add actual days of the month
  calendarDays.push(...days);

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 text-center border-b border-slate-200 bg-slate-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 font-medium text-sm text-slate-600">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-slate-100">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div key={`empty-${index}`} className="bg-slate-50 h-24 p-1.5" />
            );
          }
          
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, selectedDate);
          
          // Get appointments for this day
          const dayAppointments = appointments.filter(
            appointment => isSameDay(appointment.startTime, day)
          );
          
          const hasConflict = dayAppointments.some(appointment => 
            scheduleConflicts.some(conflict => 
              conflict.appointmentId === appointment.id
            )
          );
          
          return (
            <div 
              key={day.toString()} 
              onClick={() => setSelectedDate(day)}
              className={`h-24 p-1.5 cursor-pointer transition-colors ${
                isToday 
                  ? 'bg-teal-50 border-teal-200' 
                  : isCurrentMonth 
                    ? 'bg-white hover:bg-slate-50' 
                    : 'bg-slate-50 text-slate-400'
              } ${hasConflict ? 'bg-red-50' : ''}`}
            >
              <div className={`text-right text-sm font-medium ${
                isToday ? 'text-teal-700' : isCurrentMonth ? 'text-slate-700' : 'text-slate-400'
              }`}>
                {format(day, 'd')}
              </div>
              
              {/* Appointment indicators */}
              <div className="mt-1 space-y-1 overflow-hidden">
                {dayAppointments.slice(0, 3).map(appointment => (
                  <AppointmentIndicator
                    key={appointment.id}
                    appointment={appointment}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(appointment);
                    }}
                    conflicted={scheduleConflicts.some(
                      conflict => conflict.appointmentId === appointment.id
                    )}
                  />
                ))}
                
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-center py-0.5 bg-slate-100 text-slate-600 rounded">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};