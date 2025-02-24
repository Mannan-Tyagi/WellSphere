import React from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import { CalendarView } from './calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onDateChange: (date: Date) => void;
  onNewAppointment: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onDateChange,
  onNewAppointment,
}: CalendarHeaderProps) {
  const viewOptions: CalendarView[] = ['day', 'week', 'month'];

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <button
          onClick={onNewAppointment}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </button>
        <div className="flex items-center bg-gray-100 rounded-md">
          {viewOptions.map((option) => (
            <button
              key={option}
              onClick={() => onViewChange(option)}
              className={`px-4 py-2 ${
                view === option
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              } rounded-md capitalize`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}