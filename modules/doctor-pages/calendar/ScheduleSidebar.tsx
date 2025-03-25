import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Appointment, APPOINTMENT_TYPES, APPOINTMENT_STATUS } from '@/app/(route)/Doctor/Calendar/page';
import AppointmentCard from '@/modules/doctor-pages/calendar/AppointmentCard';
import { format, isSameDay } from 'date-fns';
import { Badge, User, X } from 'lucide-react';

interface ScheduleSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  appointments: Appointment[];
  waitlist: Appointment[];
  date: Date;
  onDateSelect: (date: Date) => void;
  onAddFromWaitlist: (appointment: Appointment) => void;
  onAppointmentSelect: (appointment: Appointment) => void;
}

const ScheduleSidebar: React.FC<ScheduleSidebarProps> = ({
  isOpen,
  onToggle,
  appointments,
  waitlist,
  date,
  onDateSelect,
  onAddFromWaitlist,
  onAppointmentSelect
}) => {
  // Get today's appointments
  const todayAppointments = appointments.filter(appt => 
    isSameDay(appt.start, new Date('2025-03-25'))
  ).sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Get selected day appointments
  const selectedDayAppointments = appointments.filter(appt => 
    isSameDay(appt.start, date)
  ).sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Get upcoming appointments (not today or selected day)
  const upcomingAppointments = appointments.filter(appt => 
    !isSameDay(appt.start, new Date('2025-03-25')) && 
    !isSameDay(appt.start, date) &&
    appt.start > new Date('2025-03-25')
  ).sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return appointments.some(appt => isSameDay(appt.start, day));
  };
  
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Schedule</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggle}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && onDateSelect(newDate)}
          className="rounded-md border"
          modifiers={{
            hasAppointment: (date) => isDayWithAppointment(date),
          }}
          modifiersStyles={{
            hasAppointment: { 
              fontWeight: 'bold',
              boxShadow: 'inset 0 0 0 1.5px var(--primary)', 
            }
          }}
        />
      </div>
      
      <ScrollArea className="flex-1">
        {selectedDayAppointments.length > 0 && (
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">
              {isSameDay(date, new Date('2025-03-25')) 
                ? "Today's Schedule" 
                : `Schedule for ${format(date, 'MMMM d')}`}
            </h3>
            <div className="space-y-3">
              {selectedDayAppointments.map(appt => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onClick={() => onAppointmentSelect(appt)}
                />
              ))}
            </div>
          </div>
        )}
        
        {todayAppointments.length > 0 && !isSameDay(date, new Date('2025-03-25')) && (
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Today's Schedule</h3>
            <div className="space-y-3">
              {todayAppointments.map(appt => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onClick={() => onAppointmentSelect(appt)}
                />
              ))}
            </div>
          </div>
        )}
        
        {waitlist.length > 0 && (
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Waitlist</h3>
              <span className="text-xs text-muted-foreground">{waitlist.length} patients</span>
            </div>
            
            <div className="space-y-3">
              {waitlist.map(waitlistItem => (
                <div key={waitlistItem.id} className="border rounded-lg p-3 bg-muted/20">
                  <div className="font-medium">{waitlistItem.patient.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline"
                      style={{ 
                        color: APPOINTMENT_TYPES[waitlistItem.type].color,
                        borderColor: APPOINTMENT_TYPES[waitlistItem.type].color + '40'
                      }}
                    >
                      {APPOINTMENT_TYPES[waitlistItem.type].name}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onAddFromWaitlist(waitlistItem)}
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {upcomingAppointments.length > 0 && (
          <div className="p-4">
            <h3 className="font-semibold mb-3">Upcoming Appointments</h3>
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map(appt => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onClick={() => onAppointmentSelect(appt)}
                />
              ))}
              
              {upcomingAppointments.length > 5 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  View all ({upcomingAppointments.length}) appointments
                </Button>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </>
  );
  
  // On mobile, render as a Sheet, on desktop render as a sidebar
  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={isOpen && window.innerWidth < 1024} onOpenChange={onToggle}>
        <SheetContent side="left" className="p-0 w-full max-w-xs sm:max-w-sm flex flex-col">
          {sidebarContent}
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "border-r lg:flex flex-col bg-background w-80 shrink-0 h-full transition-all duration-300",
          isOpen ? "hidden" : "hidden"
        )}
      >
        {sidebarContent}
      </div>
      
      {/* Desktop Sidebar (visible) */}
      <div 
        className={cn(
          "border-r flex-col bg-background w-80 shrink-0 h-full transition-all duration-300",
          isOpen ? "hidden lg:flex" : "hidden"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default ScheduleSidebar;