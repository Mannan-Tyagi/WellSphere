import React from 'react';
import { Appointment} from '@/app/(route)/Doctor/Calendar/page';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface AppointmentViewProps {
  appointment: Appointment;
  onClick: () => void;
}

export function AppointmentView({ appointment, onClick }: AppointmentViewProps) {
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div 
      className="h-full p-1.5 overflow-hidden cursor-pointer transition-opacity hover:opacity-90"
      onClick={onClick}
    >
      <div className="font-medium text-sm line-clamp-1">{appointment.patient.name}</div>
      <div className="flex items-center text-xs mt-0.5 opacity-90">
        <Clock className="h-3 w-3 mr-1 shrink-0" />
        <span>
          {formatTime(appointment.start)} - {formatTime(appointment.end)}
        </span>
      </div>
    </div>
  );
}