import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { Appointment } from '@/app/calendar/page';

interface DatePickerCalendarProps {
  date: Date;
  onDateChange: (date: Date) => void;
  appointments: Appointment[];
}

export function DatePickerCalendar({ date, onDateChange, appointments }: DatePickerCalendarProps) {
  // Function to check if a day has appointments
  const isDayWithAppointments = (day: Date) => {
    return appointments.some(appointment => 
      isSameDay(appointment.start, day)
    );
  };
  
  // Get the current date for "today" highlighting
  const today = new Date('2025-03-25');
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(newDate) => newDate && onDateChange(newDate)}
      className="rounded-md"
      modifiers={{
        hasAppointments: (day) => isDayWithAppointments(day),
        today: (day) => isSameDay(day, today)
      }}
      modifiersStyles={{
        hasAppointments: { 
          fontWeight: 'bold',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
        },
        today: {
          fontWeight: 'bold',
          borderColor: 'var(--primary)',
          borderWidth: '2px'
        }
      }}
      fromDate={new Date('2025-01-01')}
      toDate={new Date('2025-12-31')}
    />
  );
}