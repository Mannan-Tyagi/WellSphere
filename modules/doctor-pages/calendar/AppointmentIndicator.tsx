import React from 'react';
import { format } from 'date-fns';
import { Appointment } from './types';

interface AppointmentIndicatorProps {
  appointment: Appointment;
  onClick: (e: React.MouseEvent) => void;
  conflicted?: boolean;
}

export const AppointmentIndicator: React.FC<AppointmentIndicatorProps> = ({
  appointment,
  onClick,
  conflicted = false
}) => {
  const getTypeColor = () => {
    switch (appointment.type) {
      case 'consultation':
        return 'bg-blue-500 text-white';
      case 'surgery':
        return 'bg-purple-500 text-white';
      case 'follow-up':
        return 'bg-teal-500 text-white';
      case 'check-up':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getStatusColor = () => {
    if (conflicted) {
      return 'border-red-400';
    }
    
    switch (appointment.status) {
      case 'confirmed':
        return 'border-teal-400';
      case 'pending':
        return 'border-amber-400';
      case 'cancelled':
        return 'border-red-400';
      default:
        return 'border-slate-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`text-xs px-2 py-0.5 rounded truncate cursor-pointer border-l-2 ${getTypeColor()} ${getStatusColor()}`}
    >
      {format(appointment.startTime, 'h:mm a')} {appointment.patientName}
    </div>
  );
};