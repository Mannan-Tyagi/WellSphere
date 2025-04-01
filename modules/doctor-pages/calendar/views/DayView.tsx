import React from 'react';
import { format, isSameDay } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { AppointmentCard } from '../AppointmentCard';
import { TimeSlotDropZone } from '../TimeSlotDropZone';
import { Appointment } from '../types';

interface DayViewProps {
  onAppointmentClick: (appointment: Appointment) => void;
}

// Create an array of hours from 8 AM to 7 PM
const HOURS = Array.from({ length: 12 }, (_, index) => index + 8);

export const DayView: React.FC<DayViewProps> = ({ onAppointmentClick }) => {
  const { 
    selectedDate, 
    appointments,
    draggingAppointment,
    scheduleConflicts 
  } = useCalendar();

  const dayAppointments = appointments.filter(
    appointment => isSameDay(appointment.startTime, selectedDate)
  );

  return (
    <div className="flex flex-col h-full rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="text-center py-4 border-b border-slate-200 text-lg font-serif text-slate-800">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {HOURS.map(hour => {
          // Get appointments starting at this hour
          const hourAppointments = dayAppointments.filter(
            appointment => appointment.startTime.getHours() === hour
          );

          const hasConflict = hourAppointments.some(appointment => 
            scheduleConflicts.some(conflict => 
              conflict.appointmentId === appointment.id
            )
          );
          
          return (
            <div 
              key={hour} 
              className={`flex h-20 border-b border-slate-100 ${
                hasConflict ? 'bg-red-50' : ''
              }`}
            >
              {/* Time Column */}
              <div className="w-20 py-2 flex flex-col items-center justify-center border-r border-slate-100">
                <span className="text-sm font-medium text-slate-600">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h:mm')}
                </span>
                <span className="text-xs text-slate-400">
                  {format(new Date().setHours(hour, 0, 0, 0), 'a')}
                </span>
              </div>
              
              {/* Appointment Column */}
              <TimeSlotDropZone date={selectedDate} hour={hour} className="flex-1 p-1.5">
                {hourAppointments.length > 0 ? (
                  <div className="space-y-1.5">
                    {hourAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onClick={() => onAppointmentClick(appointment)}
                        conflicted={scheduleConflicts.some(
                          conflict => conflict.appointmentId === appointment.id
                        )}
                        isDragging={draggingAppointment?.id === appointment.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full border border-dashed border-slate-200 rounded bg-slate-50"></div>
                )}
              </TimeSlotDropZone>
            </div>
          );
        })}
      </div>
    </div>
  );
};