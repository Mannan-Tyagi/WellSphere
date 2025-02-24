import React from 'react';
import { Clock, Phone, FileText, User } from 'lucide-react';
import { Appointment } from './calendar';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
}

const statusColors = {
  finished: 'bg-green-50 border-green-200 text-green-700',
  'in-progress': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
  upcoming: 'bg-blue-50 border-blue-200 text-blue-700',
  encounter: 'bg-purple-50 border-purple-200 text-purple-700',
};

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const statusColor = statusColors[appointment.status];

  return (
    <div
      className={`group relative h-full w-full ${statusColor} border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:z-10`}
      onClick={() => onClick(appointment)}
    >
      <div className="p-2 h-full">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center min-w-0 flex-1">
            <User className="w-3.5 h-3.5 mr-1 shrink-0 opacity-70" />
            <h3 className="font-medium text-sm truncate">{appointment.patientName}</h3>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full capitalize bg-white/80 ml-1 shrink-0">
            {appointment.status}
          </span>
        </div>
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center opacity-80">
            <Clock className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="truncate">{appointment.startTime} - {appointment.endTime}</span>
          </div>
          <div className="flex items-center opacity-80">
            <FileText className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="truncate">{appointment.treatmentType}</span>
          </div>
          {appointment.patientContact && (
            <div className="flex items-center opacity-80">
              <Phone className="w-3.5 h-3.5 mr-1 shrink-0" />
              <span className="truncate">{appointment.patientContact}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gradient-to-t from-black/10 to-transparent p-1 rounded-b-lg">
        <div className="flex justify-center space-x-1">
          <button 
            className="bg-white/90 text-blue-600 px-2 py-0.5 text-xs font-medium rounded transition-colors hover:bg-blue-50 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit
            }}
          >
            Edit
          </button>
          <button 
            className="bg-white/90 text-red-600 px-2 py-0.5 text-xs font-medium rounded transition-colors hover:bg-red-50 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              // Handle cancel
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}