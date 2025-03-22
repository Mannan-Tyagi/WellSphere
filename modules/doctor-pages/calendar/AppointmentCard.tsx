import React from 'react';
import { Clock, Phone, FileText, User, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { Appointment } from './calendar';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment, e: React.MouseEvent) => void;
  onCancel: (appointment: Appointment, e: React.MouseEvent) => void;
  onComplete: (appointment: Appointment, e: React.MouseEvent) => void;
}

const statusColors = {
  finished: 'bg-green-50 border-green-200 text-green-700',
  'in-progress': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
  upcoming: 'bg-blue-50 border-blue-200 text-blue-700',
  encounter: 'bg-purple-50 border-purple-200 text-purple-700',
  late: 'bg-orange-50 border-orange-200 text-orange-700',
  'no-show': 'bg-gray-50 border-gray-200 text-gray-700',
};

const statusIcons = {
  'in-progress': <Clock className="w-3 h-3" />,
  upcoming: <Calendar className="w-3 h-3" />,
  finished: <CheckCircle2 className="w-3 h-3" />,
  cancelled: <AlertCircle className="w-3 h-3" />,
  late: <AlertCircle className="w-3 h-3" />,
  'no-show': <AlertCircle className="w-3 h-3" />,
  encounter: <User className="w-3 h-3" />,
};

export function AppointmentCard({ appointment, onClick, onEdit, onCancel, onComplete }: AppointmentCardProps) {
  const statusColor = statusColors[appointment.status] || statusColors.upcoming;
  const statusIcon = statusIcons[appointment.status];
  
  // Calculate appointment duration in minutes
  const startTime = appointment.startTime.split(':').map(Number);
  const endTime = appointment.endTime.split(':').map(Number);
  const durationMinutes = (endTime[0] * 60 + endTime[1]) - (startTime[0] * 60 + startTime[1]);
  
  // Determine if this is a long appointment (over 30 minutes)
  const isLongAppointment = durationMinutes > 30;
  
  // Check if appointment is happening now
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const startHour = startTime[0];
  const startMinute = startTime[1] || 0;
  const endHour = endTime[0];
  const endMinute = endTime[1] || 0;
  
  const isHappeningNow = 
    (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) && 
    (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute));

  return (
    <div
      className={`group relative h-full w-full ${statusColor} border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:z-10 ${isHappeningNow ? 'ring-2 ring-blue-400' : ''}`}
      onClick={() => onClick(appointment)}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center min-w-0 flex-1">
            <User className="w-3.5 h-3.5 mr-1 shrink-0 opacity-70" />
            <h3 className="font-medium text-sm truncate">{appointment.patientName}</h3>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full capitalize bg-white/80 ml-1 shrink-0 flex items-center">
            {statusIcon && <span className="mr-1">{statusIcon}</span>}
            {appointment.status}
          </span>
        </div>
        
        <div className="space-y-0.5 text-xs flex-grow">
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
          
          {isLongAppointment && appointment.notes && (
            <div className="mt-1 text-[10px] italic opacity-70 line-clamp-2">
              {appointment.notes}
            </div>
          )}
        </div>
        
        {appointment.priority === 'high' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
        )}
      </div>
      
      <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gradient-to-t from-black/10 to-transparent p-1 rounded-b-lg">
        <div className="flex justify-center space-x-1">
          {appointment.status !== 'finished' && appointment.status !== 'cancelled' && (
            <button 
              className="bg-white/90 text-green-600 px-2 py-0.5 text-xs font-medium rounded transition-colors hover:bg-green-50 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(appointment, e);
              }}
            >
              Complete
            </button>
          )}
          <button 
            className="bg-white/90 text-blue-600 px-2 py-0.5 text-xs font-medium rounded transition-colors hover:bg-blue-50 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(appointment, e);
            }}
          >
            Edit
          </button>
          {appointment.status !== 'cancelled' && appointment.status !== 'finished' && (
            <button 
              className="bg-white/90 text-red-600 px-2 py-0.5 text-xs font-medium rounded transition-colors hover:bg-red-50 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(appointment, e);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}