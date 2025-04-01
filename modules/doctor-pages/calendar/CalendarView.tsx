'use client';

import React from 'react';
import { useCalendar } from './CalendarContext';
import { DayView } from './views/DayView';
import { WeekView } from './views/WeekView';
import { MonthView } from './views/MonthView';
import { Appointment } from './types';

interface CalendarViewProps {
  onAppointmentClick: (appointment: Appointment) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onAppointmentClick }) => {
  const { activeView } = useCalendar();

  return (
    <div className="h-full p-4 overflow-y-auto">
      {activeView === 'day' && <DayView onAppointmentClick={onAppointmentClick} />}
      {activeView === 'week' && <WeekView onAppointmentClick={onAppointmentClick} />}
      {activeView === 'month' && <MonthView onAppointmentClick={onAppointmentClick} />}
    </div>
  );
};

export default CalendarView;