"use client";

import React, { useEffect, useState, useRef } from 'react';
import { format, addDays, startOfWeek, endOfMonth, startOfMonth, isSameMonth, isSameDay } from 'date-fns';
import { AppointmentCard } from './AppointmentCard';
import { Coffee, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Appointment, CalendarView } from './calendar';

interface DayViewProps {
  date: Date;
  view: CalendarView;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onTimeSlotClick: (time: string) => void;
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DayView({
  date,
  view,
  appointments,
  onAppointmentClick,
  onTimeSlotClick,
}: DayViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      if (timelineRef.current && view !== 'month') {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const scrollPosition = ((currentHour - 8) * 100) + (currentMinute / 60 * 100);
        timelineRef.current.scrollTop = Math.max(0, scrollPosition - 200);
      }
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(interval);
  }, [view]);

  const getAppointmentsForDate = (dayDate: Date) => {
    return appointments.filter(apt => isSameDay(dayDate, new Date()));
  };

  const getAppointmentsForHour = (hour: number, dayDate: Date) => {
    const hourAppointments = appointments.filter((apt) => {
      const aptHour = parseInt(apt.startTime.split(':')[0]);
      return aptHour === hour && isSameDay(dayDate, new Date());
    });

    // Sort appointments by start time
    return hourAppointments.sort((a, b) => {
      const aTime = parseInt(a.startTime.split(':')[1]);
      const bTime = parseInt(b.startTime.split(':')[1]);
      return aTime - bTime;
    });
  };

  const isBreakTime = (hour: number) => hour === 13;

  const getTimelinePosition = () => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = (hour - 8) * 60 + minutes;
    return (totalMinutes / 60) * 100;
  };

  const getDatesForView = () => {
    switch (view) {
      case 'week':
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      case 'month':
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const start = startOfWeek(monthStart, { weekStartsOn: 1 });
        const days = [];
        let current = start;
        while (current <= monthEnd || days.length % 7 !== 0) {
          days.push(current);
          current = addDays(current, 1);
        }
        return days;
      default:
        return [date];
    }
  };

  const dates = getDatesForView();

  const getAppointmentStats = (dayDate: Date) => {
    const dayAppointments = appointments.filter(apt => 
      isSameDay(dayDate, new Date())
    );
    
    return {
      total: dayAppointments.length,
      completed: dayAppointments.filter(apt => apt.status === 'finished').length,
      upcoming: dayAppointments.filter(apt => apt.status === 'upcoming').length,
    };
  };

  if (view === 'month') {
    return (
      <div className="flex-1 bg-white">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {WEEKDAY_LABELS.map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
          {dates.map((day, index) => (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] bg-white p-2 ${
                isSameMonth(day, date) ? '' : 'text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${
                  isSameDay(day, new Date()) ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                {getAppointmentsForDate(day).length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {getAppointmentsForDate(day).length} appt
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {getAppointmentsForDate(day).slice(0, 2).map(apt => (
                  <div
                    key={apt.id}
                    className="text-xs p-1 rounded bg-blue-50 text-blue-700 truncate"
                    onClick={() => onAppointmentClick(apt)}
                  >
                    {apt.patientName} - {apt.startTime}
                  </div>
                ))}
                {getAppointmentsForDate(day).length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{getAppointmentsForDate(day).length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50 calendar-container">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-white p-4 flex flex-col sidebar">
        <div className="mb-6">
          <div className="text-lg font-semibold mb-2">Today's Overview</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span>Total Appointments</span>
              </div>
              <span className="font-semibold">{getAppointmentStats(date).total}</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                <span>Completed</span>
              </div>
              <span className="font-semibold">{getAppointmentStats(date).completed}</span>
            </div>
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-purple-600 mr-2" />
                <span>Upcoming</span>
              </div>
              <span className="font-semibold">{getAppointmentStats(date).upcoming}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold mb-4">Quick Jump</div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-gray-500">{label[0]}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                key={`day-${day}`}
                className={`p-2 rounded-full hover:bg-blue-50 ${
                  day === date.getDate() ? 'bg-blue-100 text-blue-600 font-semibold' : ''
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="flex flex-1 min-h-0">
        <div className="w-16 flex-shrink-0 border-r bg-white">
          {hours.map((hour) => (
            <div
              key={`time-${hour}`}
              className="h-[100px] flex items-start justify-center pt-2 text-sm text-gray-500 border-b border-gray-100"
            >
              {hour}:00
            </div>
          ))}
        </div>
        <div 
          ref={timelineRef}
          className="flex-1 overflow-y-auto relative bg-white"
          style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
          }}
        >
          {dates.map((currentDate) => (
            <div key={currentDate.toISOString()} className="min-w-0">
              <div className="sticky top-0 z-40 bg-white p-4 border-b">
                <div className="text-center">
                  <h3 className="font-medium">
                    {format(currentDate, view === 'week' ? 'EEE, MMM d' : 'EEEE, MMMM d')}
                  </h3>
                </div>
              </div>
              <div className="relative">
                {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                  <div 
                    className="current-time-indicator"
                    style={{ 
                      top: `${getTimelinePosition()}px`,
                    }}
                  >
                    <div className="time-marker"></div>
                    <div className="time-label">
                      {format(currentTime, 'HH:mm')}
                    </div>
                  </div>
                )}
                {hours.map((hour) => (
                  <div 
                    key={`slot-${currentDate.toISOString()}-${hour}`}
                    className={`relative h-[100px] border-b border-gray-100 group ${
                      isBreakTime(hour) ? 'bg-gray-50' : 
                      hoveredTime === `${hour}:00` ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => !isBreakTime(hour) && onTimeSlotClick(`${hour}:00`)}
                    onMouseEnter={() => setHoveredTime(`${hour}:00`)}
                    onMouseLeave={() => setHoveredTime(null)}
                  >
                    {isBreakTime(hour) ? (
                      <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50/80">
                        <Coffee className="w-4 h-4 mr-2" />
                        <span>Break Time</span>
                      </div>
                    ) : (
                      <>
                        {!getAppointmentsForHour(hour, currentDate).length && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200">
                              + Add Appointment
                            </button>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-1 p-1 h-full">
                          {getAppointmentsForHour(hour, currentDate).map((apt, index) => (
                            <div key={`appointment-${apt.id}`} className="h-full">
                              <AppointmentCard
                                appointment={apt}
                                onClick={onAppointmentClick}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}