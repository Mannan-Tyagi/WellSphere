import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Appointment, APPOINTMENT_TYPES, APPOINTMENT_STATUS } from '@/app/(route)/Doctor/Calendar/page';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-sm transition-shadow border-l-4 animate-in fade-in-50 slide-in-from-bottom-2"
      style={{ borderLeftColor: APPOINTMENT_TYPES[appointment.type].color }}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="font-medium text-sm">{appointment.patient.name}</div>
          <Badge 
            variant={
              appointment.status === 'CANCELLED' 
                ? 'destructive' 
                : appointment.status === 'COMPLETED' 
                ? 'outline' 
                : 'secondary'
            }
            className="text-[10px] h-5"
          >
            {APPOINTMENT_STATUS[appointment.status].name}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Clock className="h-3 w-3" />
          <span>{format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}</span>
        </div>
        
        <div className="mt-2">
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ color: APPOINTMENT_TYPES[appointment.type].color }}
          >
            {APPOINTMENT_TYPES[appointment.type].name}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}