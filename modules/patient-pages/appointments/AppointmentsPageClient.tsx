'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, format, isPast, isToday, isTomorrow, addDays } from 'date-fns';
import { Calendar, ChevronRight, Video, MapPin, Phone, PlusCircle, Clock, MoreHorizontal, Search, CalendarDays, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Types and helper functions moved outside component for better memory usage
interface Appointment {
  id: number;
  title: string;
  doctor: string;
  doctorPhoto?: string;
  specialty?: string;
  date: Date;
  time: string;
  endTime?: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location?: string | null;
  notes?: string;
}

const getAppointmentTypeIcon = (type: string) => {
  switch (type) {
    case 'in-person': return <MapPin className="h-4 w-4 text-emerald-600" />;
    case 'video': return <Video className="h-4 w-4 text-blue-600" />;
    case 'phone': return <Phone className="h-4 w-4 text-purple-600" />;
    default: return <Calendar className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string, date: Date) => {
  if (status === 'completed' || (isPast(date) && status !== 'pending' && status !== 'cancelled')) {
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Completed</Badge>;
  }
  if (status === 'confirmed') {
    return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Confirmed</Badge>;
  }
  if (status === 'pending') {
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
  }
  if (status === 'cancelled') {
    return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
  }
  return null;
};

const formatAppointmentDate = (date: Date) => {
  if (isToday(date)) return `Today, ${format(date, 'MMM d')}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'MMM d')}`;
  return format(date, 'EEE, MMM d, yyyy');
};

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: 'Annual Physical Examination',
    doctor: 'Dr. Julia Smith',
    doctorPhoto: '/assets/doctors/julia-smith.jpg',
    specialty: 'Cardiology',
    date: addDays(new Date(), 2),
    time: '10:00 AM',
    endTime: '10:45 AM',
    type: 'in-person',
    status: 'confirmed',
    location: 'Central Medical Center, Room 305',
    notes: 'Please bring your medication list'
  },
  // ... other appointments
];

// Main component
export function AppointmentsPageClient() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState<boolean>(false);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(appointment => {
      // Filter logic for tab, search, status, and type
      if (activeTab === 'upcoming' && (isPast(appointment.date) && appointment.status !== 'pending')) {
        return false;
      }
      if (activeTab === 'past' && (!isPast(appointment.date) || appointment.status === 'pending')) {
        return false;
      }
      
      if (searchTerm && !appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      if (statusFilter !== 'all' && appointment.status !== statusFilter) {
        return false;
      }
      
      if (typeFilter !== 'all' && appointment.type !== typeFilter) {
        return false;
      }
      
      return true;
    });
  }, [activeTab, searchTerm, statusFilter, typeFilter]);

  // Event handlers
  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsDialog(true);
  };

  const handleCancelAppointment = () => {
    console.log('Cancelling appointment:', selectedAppointment?.id);
    setShowCancelDialog(false);
    setShowDetailsDialog(false);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">My Appointments</h1>
          <p className="text-gray-500">Manage and schedule your medical appointments</p>
        </div>
        
        <Link href="/patient/appointments/schedule">
          <Button className="mt-4 md:mt-0 bg-[#006D77] hover:bg-[#005A64]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by doctor or appointment type" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs 
        defaultValue="upcoming" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="bg-white rounded-lg border"
      >
        <TabsList className="w-full border-b rounded-none p-0">
          <TabsTrigger 
            value="upcoming" 
            className="flex-1 py-3 rounded-none border-r data-[state=active]:bg-[#E8F3F4] data-[state=active]:text-[#006D77] data-[state=active]:shadow-none"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger 
            value="past" 
            className="flex-1 py-3 rounded-none data-[state=active]:bg-[#E8F3F4] data-[state=active]:text-[#006D77] data-[state=active]:shadow-none"
          >
            Past
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="p-4">
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white"
                  onClick={() => handleAppointmentSelect(appointment)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={appointment.doctorPhoto} alt={appointment.doctor} />
                        <AvatarFallback>{appointment.doctor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium">{appointment.title}</h3>
                          <div className="ml-2">
                            {getStatusBadge(appointment.status, appointment.date)}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">with {appointment.doctor}</p>
                        
                        <div className="flex flex-wrap items-center text-sm gap-x-4 gap-y-1 mt-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatAppointmentDate(appointment.date)}
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {appointment.time}
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            {getAppointmentTypeIcon(appointment.type)}
                            <span className="ml-1 capitalize">{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-3 md:mt-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-gray-400" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No upcoming appointments
              </h3>
              
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Book an appointment with one of our healthcare providers to get started
              </p>
              
              <Link href="/patient/appointments/schedule">
                <Button className="bg-[#006D77] hover:bg-[#005A64]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="p-4">
          {/* Similar content for past appointments */}
        </TabsContent>
      </Tabs>
      
      {/* Dialogs for appointment details, cancellation, and rescheduling */}
      {showDetailsDialog && selectedAppointment && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md bg-white">
            {/* Dialog content */}
          </DialogContent>
        </Dialog>
      )}
      
      {/* Other dialogs */}
    </div>
  );
}