import React from 'react';
import { useCalendar } from './CalendarContext';
import { addHours } from 'date-fns';

interface TimeSlotDropZoneProps {
  date: Date;
  hour: number;
  children: React.ReactNode;
  className?: string;
}

export const TimeSlotDropZone: React.FC<TimeSlotDropZoneProps> = ({
  date,
  hour,
  children,
  className = ''
}) => {
  const { 
    draggingAppointment, 
    setPotentialTimeSlot,
    updateAppointment,
    stopDraggingAppointment
  } = useCalendar();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Highlight where the appointment would be dropped
    if (draggingAppointment) {
      setPotentialTimeSlot({ date, hour });
    }
  };
  
  const handleDragLeave = () => {
    setPotentialTimeSlot(null);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggingAppointment) {
      const duration = (draggingAppointment.endTime.getTime() - draggingAppointment.startTime.getTime()) / (1000 * 60);
      
      // Create new start and end times based on the dropped location
      const newStartTime = new Date(date);
      newStartTime.setHours(hour, 0, 0, 0);
      
      const newEndTime = addHours(newStartTime, duration / 60);
      
      // Update the appointment
      updateAppointment({
        ...draggingAppointment,
        startTime: newStartTime,
        endTime: newEndTime
      });
      
      // Clear the dragging state
      stopDraggingAppointment();
    }
  };

  return (
    <div
      className={`${className} transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};