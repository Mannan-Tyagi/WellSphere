"use client";

import React, { useEffect, useState, useRef } from 'react';
import { format, addDays, startOfWeek, endOfMonth, startOfMonth, isSameMonth, isSameDay } from 'date-fns';
import { AppointmentCard } from './AppointmentCard';
import { Coffee, Clock, Users, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { Appointment, CalendarView } from './calendar';
import { Tooltip } from './Tooltip';

interface DayViewProps {
  date: Date;
  view: CalendarView;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onTimeSlotClick: (time: string, date: Date) => void;
  onDateChange?: (date: Date) => void;
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_RANGE = { start: 8, end: 20 }; // 8 AM to 8 PM

export function DayView({
  date,
  view,
  appointments,
  onAppointmentClick,
  onTimeSlotClick,
  onDateChange,
}: DayViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: TIME_RANGE.end - TIME_RANGE.start }, (_, i) => i + TIME_RANGE.start);

  // Scroll to current time on initial load and when view changes
  useEffect(() => {
    const scrollToCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      if (timelineRef.current && view !== 'month') {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (currentHour >= TIME_RANGE.start && currentHour < TIME_RANGE.end) {
          const scrollPosition = ((currentHour - TIME_RANGE.start) * 100) + (currentMinute / 60 * 100);
          timelineRef.current.scrollTop = Math.max(0, scrollPosition - 200);
        }
      }
    };

    scrollToCurrentTime();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);

    return () => clearInterval(interval);
  }, [view]);

  const getAppointmentsForDate = (dayDate: Date) => {
    return appointments.filter(apt => {
      const aptDate = apt.date ? new Date(apt.date) : new Date();
      return isSameDay(dayDate, aptDate);
    }).filter(apt => !filterStatus || apt.status === filterStatus);
  };

  const getAppointmentsForHour = (hour: number, dayDate: Date) => {
    const dayAppointments = getAppointmentsForDate(dayDate);
    const hourAppointments = dayAppointments.filter((apt) => {
      const aptHour = parseInt(apt.startTime.split(':')[0]);
      return aptHour === hour;
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
    
    if (hour < TIME_RANGE.start || hour >= TIME_RANGE.end) {
      return null;
    }
    
    const totalMinutes = (hour - TIME_RANGE.start) * 60 + minutes;
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
    const dayAppointments = getAppointmentsForDate(dayDate);
    
    return {
      total: dayAppointments.length,
      completed: dayAppointments.filter(apt => apt.status === 'finished').length,
      upcoming: dayAppointments.filter(apt => apt.status === 'upcoming').length,
      canceled: dayAppointments.filter(apt => apt.status === 'canceled').length,
    };
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    if (!onDateChange) return;
    
    let newDate;
    switch (view) {
      case 'day':
        newDate = addDays(date, direction === 'next' ? 1 : -1);
        break;
      case 'week':
        newDate = addDays(date, direction === 'next' ? 7 : -7);
        break;
      case 'month':
        const newMonth = new Date(date);
        newMonth.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
        newDate = newMonth;
        break;
      default:
        newDate = date;
    }
    
    onDateChange(newDate);
  };

  if (view === 'month') {
    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {format(date, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleDateNavigation('prev')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleDateNavigation('next')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <div className="ml-2 flex items-center space-x-1">
              <button 
                className="p-2 rounded-md hover:bg-gray-100 flex items-center"
                onClick={() => setFilterStatus(null)}
              >
                <Filter className="w-4 h-4 mr-1 text-gray-500" />
                <span className={`text-sm ${!filterStatus ? 'font-medium text-blue-600' : 'text-gray-600'}`}>All</span>
              </button>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 flex items-center"
                onClick={() => setFilterStatus('upcoming')}
              >
                <span className={`text-sm ${filterStatus === 'upcoming' ? 'font-medium text-blue-600' : 'text-gray-600'}`}>Upcoming</span>
              </button>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 flex items-center"
                onClick={() => setFilterStatus('finished')}
              >
                <span className={`text-sm ${filterStatus === 'finished' ? 'font-medium text-blue-600' : 'text-gray-600'}`}>Completed</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {WEEKDAY_LABELS.map(day => (
            <div key={day} className="bg-gray-50 py-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
          {dates.map((day, index) => (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] bg-white p-2 ${
                isSameMonth(day, date) ? '' : 'text-gray-400 bg-gray-50/50'
              } ${isSameDay(day, currentTime) ? 'ring-2 ring-blue-200 ring-inset' : ''}`}
              onClick={() => onDateChange && onDateChange(day)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  isSameDay(day, currentTime) ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                {getAppointmentsForDate(day).length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    {getAppointmentsForDate(day).length} appt
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {getAppointmentsForDate(day).slice(0, 2).map(apt => (
                  <div
                    key={apt.id}
                    className={`text-xs p-1.5 rounded truncate flex items-center ${
                      apt.status === 'finished' ? 'bg-green-50 text-green-700' :
                      apt.status === 'canceled' ? 'bg-red-50 text-red-700' :
                      'bg-blue-50 text-blue-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(apt);
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${
                      apt.status === 'finished' ? 'bg-green-500' :
                      apt.status === 'canceled' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="truncate">{apt.patientName} - {apt.startTime}</span>
                  </div>
                ))}
                {getAppointmentsForDate(day).length > 2 && (
                  <div 
                    className="text-xs text-gray-500 pl-2 hover:text-blue-600 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateChange && onDateChange(day);
                    }}
                  >
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
    <div className="flex flex-1 overflow-hidden bg-gray-50 calendar-container rounded-lg shadow-sm">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 bg-white p-4 border-b z-50 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => handleDateNavigation('prev')}
            className="p-2 rounded-full hover:bg-gray-100 mr-1"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mr-3">
            {format(date, view === 'day' ? 'EEEE, MMMM d, yyyy' : 'MMMM d, yyyy')}
          </h2>
          <button 
            onClick={() => handleDateNavigation('next')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-2 text-sm ${!filterStatus ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setFilterStatus(null)}
            >
              All
            </button>
            <button 
              className={`px-3 py-2 text-sm ${filterStatus === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setFilterStatus('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`px-3 py-2 text-sm ${filterStatus === 'finished' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setFilterStatus('finished')}
            >
              Completed
            </button>
            <button 
              className={`px-3 py-2 text-sm ${filterStatus === 'canceled' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setFilterStatus('canceled')}
            >
              Canceled
            </button>
          </div>
          <button className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">New Appointment</span>
          </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="w-64 border-r bg-white p-4 flex flex-col sidebar mt-16">
        <div className="mb-6">
          <div className="text-lg font-semibold mb-3 text-gray-800">Today's Overview</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-800">Total Appointments</span>
              </div>
              <span className="font-semibold text-gray-900">{getAppointmentStats(date).total}</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-800">Completed</span>
              </div>
              <span className="font-semibold text-gray-900">{getAppointmentStats(date).completed}</span>
            </div>
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm text-gray-800">Upcoming</span>
              </div>
              <span className="font-semibold text-gray-900">{getAppointmentStats(date).upcoming}</span>
            </div>
            <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-800">Canceled</span>
              </div>
              <span className="font-semibold text-gray-900">{getAppointmentStats(date).canceled}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold mb-4 text-gray-800">Quick Jump</div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-gray-500 font-medium">{label[0]}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                key={`day-${day}`}
                className={`p-2 rounded-full hover:bg-blue-50 text-sm ${
                  day === date.getDate() ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                }`}
                onClick={() => {
                  if (onDateChange) {
                    const newDate = new Date(date);
                    newDate.setDate(day);
                    onDateChange(newDate);
                  }
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        {/* Upcoming Appointments Section */}
        <div className="mt-6 border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-800">Upcoming Next</div>
            <button className="text-blue-600 text-sm hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {appointments
              .filter(apt => apt.status === 'upcoming')
              .sort((a, b) => {
                const aTime = a.startTime.split(':').map(Number);
                const bTime = b.startTime.split(':').map(Number);
                return (aTime[0] * 60 + aTime[1]) - (bTime[0] * 60 + bTime[1]);
              })
              .slice(0, 3)
              .map(apt => (
                <div 
                  key={apt.id} 
                  className="p-3 rounded-md border border-blue-100 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                  onClick={() => onAppointmentClick(apt)}
                >
                  <div className="font-medium text-gray-900">{apt.patientName}</div>
                  <div className="text-sm text-blue-700 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {apt.startTime} - {apt.endTime || format(new Date(`2023-01-01T${apt.startTime}`).setMinutes(new Date(`2023-01-01T${apt.startTime}`).getMinutes() + 30), 'HH:mm')}
                  </div>
                </div>
              ))
            }
            {appointments.filter(apt => apt.status === 'upcoming').length === 0 && (
              <div className="text-gray-500 text-sm text-center py-4">
                No upcoming appointments
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="flex flex-1 min-h-0 mt-16">
        <div className="w-16 flex-shrink-0 border-r bg-white">
          {hours.map((hour) => (
            <div
              key={`time-${hour}`}
              className="h-[100px] flex items-start justify-center pt-2 text-sm text-gray-500 border-b border-gray-100"
            >
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM`}
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
              <div className="sticky top-0 z-30 bg-white p-3 border-b shadow-sm">
                <div className="text-center">
                  <h3 className={`font-medium ${isSameDay(currentDate, currentTime) ? 'text-blue-600' : 'text-gray-700'}`}>
                    {format(currentDate, view === 'week' ? 'EEE, MMM d' : 'EEEE, MMMM d')}
                  </h3>
                </div>
              </div>
              <div className="relative">
                {isSameDay(currentDate, currentTime) && getTimelinePosition() !== null && (
                  <div 
                    className="current-time-indicator absolute w-full z-20 flex items-center"
                    style={{ 
                      top: `${getTimelinePosition()}px`,
                    }}
                  >
                    <div className="w-full h-0.5 bg-red-500"></div>
                    <div className="absolute -left-4 w-4 h-4 bg-red-500 rounded-full -mt-1.5 border-2 border-white"></div>
                    <div className="absolute -right-14 bg-red-100 text-red-700 text-xs px-1 py-0.5 rounded -mt-1">
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
                    onClick={() => !isBreakTime(hour) && onTimeSlotClick(`${hour}:00`, currentDate)}
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
                        {getAppointmentsForHour(hour, currentDate).length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Tooltip content={`Add appointment at ${hour}:00`}>
                              <button 
                                className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTimeSlotClick(`${hour}:00`, currentDate);
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-1 p-1 h-full">
                          {getAppointmentsForHour(hour, currentDate).map((apt) => (
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