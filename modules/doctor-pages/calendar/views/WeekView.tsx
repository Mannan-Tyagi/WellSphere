import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { AppointmentCard } from '../AppointmentCard';
import { TimeSlotDropZone } from '../TimeSlotDropZone';
import { Appointment } from '../types';

interface WeekViewProps {
  onAppointmentClick: (appointment: Appointment) => void;
}

// Create an array of hours from 8 AM to 7 PM
const HOURS = Array.from({ length: 12 }, (_, index) => index + 8);

export const WeekView: React.FC<WeekViewProps> = ({ onAppointmentClick }) => {
  const { 
    selectedDate, 
    appointments,
    scheduleConflicts,
    draggingAppointment 
  } = useCalendar();

  // Get the days of the current week
  const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const end = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="flex flex-col h-full rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Days Header */}
      <div className="flex border-b border-slate-200">
        <div className="w-20 p-3"></div> {/* Empty cell for time column */}
        {days.map(day => {
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              className={`flex-1 text-center p-3 ${
                isToday ? 'bg-teal-50' : ''
              }`}
            >
              <div className="text-sm font-medium text-slate-700">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg ${
                isToday ? 'text-teal-700 font-bold' : 'text-slate-800'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Time Slots and Appointments */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map(hour => (
          <div key={hour} className="flex border-b border-slate-100">
            {/* Time Column */}
            <div className="w-20 py-2 flex flex-col items-center justify-center border-r border-slate-100">
              <span className="text-sm font-medium text-slate-600">
                {format(new Date().setHours(hour, 0, 0, 0), 'h:mm')}
              </span>
              <span className="text-xs text-slate-400">
                {format(new Date().setHours(hour, 0, 0, 0), 'a')}
              </span>
            </div>
            
            {/* Day Columns */}
            {days.map(day => {
              const isToday = isSameDay(day, new Date());
              
              // Get appointments for this day and hour
              const dayHourAppointments = appointments.filter(
                appointment => 
                  isSameDay(appointment.startTime, day) && 
                  appointment.startTime.getHours() === hour
              );
              
              const hasConflict = dayHourAppointments.some(appointment => 
                scheduleConflicts.some(conflict => 
                  conflict.appointmentId === appointment.id
                )
              );
              
              return (
                <TimeSlotDropZone 
                  key={day.toString()}
                  date={day}
                  hour={hour}
                  className={`flex-1 p-1 border-r border-slate-100 ${
                    isToday ? 'bg-teal-50' : ''
                  } ${hasConflict ? 'bg-red-50' : ''}`}
                >
                  {dayHourAppointments.length > 0 ? (
                    <div className="space-y-0.5">
                      {dayHourAppointments.map(appointment => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onClick={() => onAppointmentClick(appointment)}
                          compact={true}
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
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};