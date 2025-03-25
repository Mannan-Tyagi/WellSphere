import React from 'react';
import { format } from 'date-fns';
import { Appointment } from './types';
import { useCalendar } from './CalendarContext';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
  compact?: boolean;
  conflicted?: boolean;
  isDragging?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onClick, 
  compact = false,
  conflicted = false,
  isDragging = false
}) => {
  const { startDraggingAppointment, stopDraggingAppointment } = useCalendar();

  const getStatusColor = () => {
    if (appointment.status === 'cancelled') {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    
    if (conflicted) {
      return 'bg-red-50 border-red-300 text-red-800';
    }
    
    switch (appointment.status) {
      case 'confirmed':
        return 'bg-teal-50 border-teal-200 text-teal-800';
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getTypeColor = () => {
    switch (appointment.type) {
      case 'consultation':
        return 'bg-blue-500';
      case 'surgery':
        return 'bg-purple-500';
      case 'follow-up':
        return 'bg-teal-500';
      case 'check-up':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    // Cancel dragging if appointment is cancelled
    if (appointment.status === 'cancelled') {
      e.preventDefault();
      return;
    }
    
    startDraggingAppointment(appointment);
    
    // Set a ghost drag image
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('appointment-drag-ghost');
    ghostElement.textContent = appointment.patientName;
    ghostElement.style.backgroundColor = '#E6F0F0';
    ghostElement.style.padding = '5px';
    ghostElement.style.borderRadius = '4px';
    ghostElement.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    document.body.appendChild(ghostElement);
    
    e.dataTransfer.setDragImage(ghostElement, 10, 10);
    
    // Clean up ghost element after drag starts
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  // When dragging, make the card more transparent
  const opacityClass = isDragging ? 'opacity-50' : 'opacity-100';
  
  // Add a special style for cancelled appointments
  const cancelledClass = appointment.status === 'cancelled' ? 'line-through opacity-70' : '';
  
  // Add a red border if conflicted
  const conflictClass = conflicted ? 'border-red-300 ring-1 ring-red-300' : '';

  if (compact) {
    return (
      <div 
        draggable={appointment.status !== 'cancelled'}
        onDragStart={handleDragStart}
        onDragEnd={stopDraggingAppointment}
        onClick={onClick}
        className={`p-1 rounded border text-xs cursor-pointer transition-all hover:shadow-md ${getStatusColor()} ${opacityClass} ${conflictClass} ${cancelledClass}`}
      >
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-1 ${getTypeColor()}`}></div>
          <span className="font-medium truncate">{appointment.patientName}</span>
        </div>
        <div className="text-xs">
          {format(appointment.startTime, 'h:mm')} - {format(appointment.endTime, 'h:mm a')}
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable={appointment.status !== 'cancelled'}
      onDragStart={handleDragStart}
      onDragEnd={stopDraggingAppointment}
      onClick={onClick}
      className={`p-2.5 rounded-md border cursor-pointer transition-all hover:shadow-md ${getStatusColor()} ${opacityClass} ${conflictClass} ${cancelledClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${getTypeColor()}`}></div>
          <span className="font-medium">{appointment.patientName}</span>
        </div>
        <span className="text-xs">
          {format(appointment.startTime, 'h:mm')} - {format(appointment.endTime, 'h:mm a')}
        </span>
      </div>
      <p className="text-sm mt-1 truncate">{appointment.purpose}</p>
      {appointment.preparationStatus && (
        <p className="text-xs mt-1 italic truncate">{appointment.preparationStatus}</p>
      )}
    </div>
  );
};