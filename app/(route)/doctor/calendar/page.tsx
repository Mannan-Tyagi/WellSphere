"use client";
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarUI, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from 'next-themes';
import { Toaster, toast } from 'sonner';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  Filter
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CalendarToolbar } from '@/modules/doctor-pages/calendar/CalendarToolbar';
import { AppointmentView } from '@/modules/doctor-pages/calendar/AppointmentView';
import { AppointmentCard } from '@/modules/doctor-pages/calendar/AppointmentCard';
import { AppointmentModal } from '@/modules/doctor-pages/calendar/AppointmentModal';
import { AppointmentDetailsPanel } from '@/modules/doctor-pages/calendar/AppointmentDetailsPanel';
import { FilterBar } from '@/modules/doctor-pages/calendar/FilterBar';
import { DatePickerCalendar } from '@/modules/doctor-pages/calendar/DatePickerCalendar';

// Appointment type definitions with consistent healthcare colors
export const APPOINTMENT_TYPES = {
  INITIAL_CONSULTATION: {
    id: 'initial',
    name: 'Initial Consultation',
    duration: 60,
    color: '#3B82F6', // Blue
  },
  FOLLOW_UP: {
    id: 'follow-up',
    name: 'Follow-Up',
    duration: 30,
    color: '#10B981', // Emerald
  },
  PROCEDURE: {
    id: 'procedure',
    name: 'Procedure',
    duration: 60,
    color: '#8B5CF6', // Violet
  },
  URGENT_CARE: {
    id: 'urgent',
    name: 'Urgent Care',
    duration: 45,
    color: '#EF4444', // Red
  },
  TELEMEDICINE: {
    id: 'telemedicine',
    name: 'Telemedicine',
    duration: 20,
    color: '#06B6D4', // Cyan
  }
};

// Appointment status with meaningful colors
export const APPOINTMENT_STATUS = {
  SCHEDULED: { id: 'scheduled', name: 'Scheduled', color: '#6B7280' },
  CONFIRMED: { id: 'confirmed', name: 'Confirmed', color: '#059669' },
  CHECKED_IN: { id: 'checked-in', name: 'Checked In', color: '#2563EB' },
  IN_PROGRESS: { id: 'in-progress', name: 'In Progress', color: '#7C3AED' },
  COMPLETED: { id: 'completed', name: 'Completed', color: '#9CA3AF' },
  CANCELLED: { id: 'cancelled', name: 'Cancelled', color: '#DC2626' },
};

// Interface definitions
export interface Patient {
  id: string;
  name: string;
  age?: number;
  phone: string;
  email: string;
  photo?: string;
  insuranceProvider?: string;
  lastVisit?: string;
  notes?: string;
}

export interface Appointment {
  checklistCompleted: any;
  preparation: any;
  id: string;
  title: string;
  start: Date;
  end: Date;
  patient: Patient;
  type: keyof typeof APPOINTMENT_TYPES;
  status: keyof typeof APPOINTMENT_STATUS;
  notes?: string;
  isWaitlisted?: boolean;
}

// Main calendar component
export default function DoctorSchedule() {
  // Current date is hardcoded to match the specified date in the requirements
  const currentDate = new Date('2025-03-25T15:55:42Z');
  
  // State declarations
  const [date, setDate] = useState<Date>(currentDate);
  const [view, setView] = useState(Views.WEEK);
  const [events, setEvents] = useState<Appointment[]>([]);
  const [waitlist, setWaitlist] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Load mock data
  useEffect(() => {
    const mockEvents = generateMockAppointments(currentDate);
    const mockWaitlist = generateMockWaitlist();
    setEvents(mockEvents);
    setWaitlist(mockWaitlist);
    setLoading(false);
  }, []);

  // Filtered events based on active filters
  const filteredEvents = activeFilters.length > 0
    ? events.filter(event => activeFilters.includes(event.type))
    : events;
  
  // Today's appointments
  const todaysAppointments = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
  ).sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Handler functions
  const handleSelectSlot = (slotInfo: any) => {
    setSelectedSlot(slotInfo);
    setShowAppointmentModal(true);
  };

  const handleSelectEvent = (event: Appointment) => {
    setSelectedAppointment(event);
    setShowDetailsPanel(true);
  };

  const handleCreateAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointmentData,
      id: `appointment-${Date.now()}`
    } as Appointment;
    
    setEvents([...events, newAppointment]);
    setShowAppointmentModal(false);
    toast.success("Appointment created successfully");
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setEvents(events.map(event => 
      event.id === updatedAppointment.id ? updatedAppointment : event
    ));
    setShowDetailsPanel(false);
    toast.success("Appointment updated successfully");
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setEvents(events.filter(event => event.id !== appointmentId));
    setShowDetailsPanel(false);
    toast.success("Appointment cancelled");
  };

  const handleScheduleFromWaitlist = (waitlistAppointment: Appointment) => {
    // Create a new scheduled appointment from waitlist
    const appointmentDuration = APPOINTMENT_TYPES[waitlistAppointment.type].duration;
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0); // Default to 9:00 AM
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + appointmentDuration);
    
    const newAppointment: Appointment = {
      ...waitlistAppointment,
      id: `appointment-${Date.now()}`,
      start: startTime,
      end: endTime,
      status: 'SCHEDULED',
      isWaitlisted: false
    };
    
    setEvents([...events, newAppointment]);
    setWaitlist(waitlist.filter(appt => appt.id !== waitlistAppointment.id));
    toast.success(`Scheduled ${waitlistAppointment.patient.name}`);
  };

  // Appointment styling based on type and status
  const eventStyleGetter = (event: Appointment) => {
    const backgroundColor = APPOINTMENT_TYPES[event.type].color;
    const opacity = event.status === 'CANCELLED' ? 0.6 : 0.9;
    
    return {
      style: {
        backgroundColor,
        opacity,
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        display: 'block'
      }
    };
  };

  // Custom calendar components
  const components = {
    toolbar: (props: any) => (
      <CalendarToolbar 
        {...props}
        onView={setView}
        date={date}
        onNavigate={(action) => {
          if (action === 'TODAY') {
            setDate(currentDate);
          } else if (action === 'PREV') {
            const newDate = new Date(date);
            if (view === Views.DAY) {
              newDate.setDate(date.getDate() - 1);
            } else if (view === Views.WEEK) {
              newDate.setDate(date.getDate() - 7);
            } else {
              newDate.setMonth(date.getMonth() - 1);
            }
            setDate(newDate);
          } else if (action === 'NEXT') {
            const newDate = new Date(date);
            if (view === Views.DAY) {
              newDate.setDate(date.getDate() + 1);
            } else if (view === Views.WEEK) {
              newDate.setDate(date.getDate() + 7);
            } else {
              newDate.setMonth(date.getMonth() + 1);
            }
            setDate(newDate);
          }
        }}
        onCreateAppointment={() => setShowAppointmentModal(true)}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleFilters={() => setFiltersVisible(!filtersVisible)}
        isMobile={isMobile}
      />
    ),
    event: (props: any) => (
      <AppointmentView 
        appointment={props.event} 
        onClick={() => handleSelectEvent(props.event)}
      />
    )
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar for Date Picker and Today's Schedule */}
      <Sheet open={isMobile ? false : showSidebar} onOpenChange={setShowSidebar}>
        <SheetContent 
          side={isMobile ? "left" : "left"} 
          className={cn(
            "p-0 w-80 border-r sm:relative",
            !isMobile && "static translate-x-0 shadow-none border-r"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg mb-4">Dr. Mannan Tyagi</h2>
              <DatePickerCalendar 
                date={date}
                onDateChange={setDate}
                appointments={events}
              />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm text-muted-foreground">TODAY'S SCHEDULE</h3>
                    <Badge variant="outline" className="font-normal">
                      {todaysAppointments.length} patients
                    </Badge>
                  </div>
                  
                  {todaysAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {todaysAppointments.map(appointment => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onClick={() => handleSelectEvent(appointment)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
                
                {waitlist.length > 0 && (
                  <div className="p-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm text-muted-foreground">WAITLIST</h3>
                      <Badge variant="outline" className="font-normal">
                        {waitlist.length} patients
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {waitlist.map(appointment => (
                        <Card key={appointment.id} className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-sm">{appointment.patient.name}</p>
                                <div className="flex items-center mt-1">
                                  <Badge 
                                    variant="outline"
                                    className="text-xs"
                                    style={{ color: APPOINTMENT_TYPES[appointment.type].color }}
                                  >
                                    {APPOINTMENT_TYPES[appointment.type].name}
                                  </Badge>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleScheduleFromWaitlist(appointment)}
                                className="h-8"
                              >
                                Schedule
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="p-2 border-b flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Dr. Mannan Tyagi</h1>
            <Button variant="ghost" size="icon" onClick={() => setFiltersVisible(!filtersVisible)}>
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Filter Bar - Only show when filters are visible or on larger screens */}
        {(filtersVisible || !isMobile) && (
          <div className="p-2 bg-muted/20">
            <FilterBar
              appointmentTypes={APPOINTMENT_TYPES}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          </div>
        )}
        
        {/* Calendar */}
        <div className="flex-1 overflow-hidden">
          <div className={cn(
            "h-full transition-all duration-300 ease-in-out",
            theme === 'dark' ? 'dark-calendar' : ''
          )}>
            <CalendarUI
              localizer={momentLocalizer(moment)}
              events={filteredEvents}
              date={date}
              view={view}
              onView={setView}
              onNavigate={(newDate) => setDate(newDate)}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              dayLayoutAlgorithm="no-overlap"
              views={['month', 'week', 'day']}
              defaultView={Views.WEEK}
              min={new Date(2025, 0, 1, 8, 0, 0)}  // 8:00 AM
              max={new Date(2025, 0, 1, 18, 0, 0)} // 6:00 PM
              components={components}
              className="rounded-md"
              style={{ height: '100%' }}
            />
          </div>
        </div>
        
        {/* Mobile Action Button (Fixed at bottom) */}
        {isMobile && (
          <div className="fixed bottom-4 right-4">
            <Button 
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={() => setShowAppointmentModal(true)}
            >
              <PlusCircle className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Appointment Creation Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          selectedSlot={selectedSlot}
          onCreateAppointment={handleCreateAppointment}
          appointmentTypes={APPOINTMENT_TYPES}
        />
      )}
      
      {/* Appointment Details Panel */}
      {showDetailsPanel && selectedAppointment && (
        <AppointmentDetailsPanel
          isOpen={showDetailsPanel}
          onClose={() => setShowDetailsPanel(false)}
          appointment={selectedAppointment}
          onUpdateAppointment={handleUpdateAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          appointmentTypes={APPOINTMENT_TYPES}
        />
      )}
      
      <Toaster position="bottom-right" richColors />
      
      <style jsx global>{`
        .dark-calendar .rbc-off-range-bg {
          background: #1a1a1a;
        }
        .dark-calendar .rbc-today {
          background-color: rgba(59, 130, 246, 0.08);
        }
        .dark-calendar .rbc-header, 
        .dark-calendar .rbc-month-view {
          border-color: #333;
        }
        .dark-calendar .rbc-toolbar button {
          color: #f0f0f0;
          border-color: #333;
        }
        .dark-calendar .rbc-toolbar button:hover {
          background-color: #333;
        }
        .dark-calendar .rbc-toolbar button.rbc-active {
          background-color: #1e293b;
          color: white;
        }
        .dark-calendar .rbc-month-row, 
        .dark-calendar .rbc-day-bg,
        .dark-calendar .rbc-time-view,
        .dark-calendar .rbc-time-header,
        .dark-calendar .rbc-time-content {
          border-color: #333;
        }
        
        .rbc-calendar {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        .rbc-time-view {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .rbc-time-header {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rbc-header {
          padding: 8px 2px;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .rbc-header + .rbc-header {
          border-left: none;
        }
        
        .rbc-event {
          padding: 2px 4px !important;
          border-radius: 4px !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          transition: transform 0.1s ease-in-out;
        }
        
        .rbc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .rbc-day-slot .rbc-event {
          border: none !important;
        }
        
        .rbc-today {
          background-color: rgba(59, 130, 246, 0.08);
        }
        
        .rbc-off-range-bg {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}

// Mock data generation for demonstration
function generateMockAppointments(currentDate: Date): Appointment[] {
  const patients = [
    { id: '1', name: 'Emma Johnson', age: 42, phone: '555-123-4567', email: 'emma@example.com' },
    { id: '2', name: 'James Wilson', age: 35, phone: '555-234-5678', email: 'james@example.com' },
    { id: '3', name: 'Sophia Davis', age: 28, phone: '555-345-6789', email: 'sophia@example.com' },
    { id: '4', name: 'Noah Martinez', age: 56, phone: '555-456-7890', email: 'noah@example.com' },
    { id: '5', name: 'Olivia Taylor', age: 63, phone: '555-567-8901', email: 'olivia@example.com' }
  ];
  
  const types = Object.keys(APPOINTMENT_TYPES) as Array<keyof typeof APPOINTMENT_TYPES>;
  const statuses = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN'] as Array<keyof typeof APPOINTMENT_STATUS>;
  
  // Today's appointments (March 25, 2025)
  const appointments: Appointment[] = [];
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);
  
  // Generate appointments every hour from 9 AM to 5 PM
  for (let hour = 9; hour <= 16; hour++) {
    if (hour !== 12) { // Skip lunch hour
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const duration = APPOINTMENT_TYPES[type].duration;
      
      const start = new Date(today);
      start.setHours(hour, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + duration);
      
      appointments.push({
        id: `appt-${hour}`,
        title: `${patient.name} - ${APPOINTMENT_TYPES[type].name}`,
        start,
        end,
        patient,
        type,
        status,
        notes: Math.random() > 0.5 ? 'Patient requested follow-up scheduling before leaving.' : undefined
      });
    }
  }
  
  // Add some appointments for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  for (let hour = 9; hour <= 16; hour += 2) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const duration = APPOINTMENT_TYPES[type].duration;
    
    const start = new Date(tomorrow);
    start.setHours(hour, 0, 0);
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + duration);
    
    appointments.push({
      id: `appt-tomorrow-${hour}`,
      title: `${patient.name} - ${APPOINTMENT_TYPES[type].name}`,
      start,
      end,
      patient,
      type,
      status: 'SCHEDULED',
      notes: undefined
    });
  }
  
  return appointments;
}

function generateMockWaitlist(): Appointment[] {
  return [
    {
      id: 'waitlist-1',
      title: 'Michael Brown - Urgent Care',
      start: new Date(),
      end: new Date(),
      patient: {
        id: '6',
        name: 'Michael Brown',
        age: 45,
        phone: '555-678-9012',
        email: 'michael@example.com'
      },
      type: 'URGENT_CARE',
      status: 'SCHEDULED',
      isWaitlisted: true
    },
    {
      id: 'waitlist-2',
      title: 'Anna Smith - Initial Consultation',
      start: new Date(),
      end: new Date(),
      patient: {
        id: '7',
        name: 'Anna Smith',
        age: 31,
        phone: '555-789-0123',
        email: 'anna@example.com'
      },
      type: 'INITIAL_CONSULTATION',
      status: 'SCHEDULED',
      isWaitlisted: true
    }
  ];
}