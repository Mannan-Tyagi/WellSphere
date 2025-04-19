'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, format, isPast, isToday, isTomorrow, addDays } from 'date-fns';
import { Calendar, ChevronRight, Video, MapPin, Phone, PlusCircle, Clock, MoreHorizontal, Search, CalendarDays, Filter, AlertTriangle, FileText, QrCode, Shield, Download, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Import our contexts
import { useAppointments } from '@/contexts/AppointmentContext';
import { useMedicalRecords } from '@/contexts/MedicalRecordsContext';
import { useNotifications } from '@/contexts/NotificationsContext';

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

// Main component
export function AppointmentsPageClient() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState<boolean>(false);
  const [recordAccessDuration, setRecordAccessDuration] = useState<string>("24hr");
  const [showRecordsQR, setShowRecordsQR] = useState<boolean>(false);

  // New states for enhanced filtering
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const [calendarSynced, setCalendarSynced] = useState<boolean>(false);

  // Use our contexts
  const { 
    upcomingAppointments, 
    pastAppointments, 
    updateAppointment,
    cancelAppointment,
    getAppointmentById,
    navigateToAppointmentDetails
  } = useAppointments();
  
  const { generateRecordsQR } = useMedicalRecords();
  const { addNotification } = useNotifications();
  
  // Use selected appointment from state or context
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const selectedAppointment = selectedAppointmentId ? 
    getAppointmentById(selectedAppointmentId) : null;

  // Filter appointments based on multiple criteria
  const getFilteredAppointments = () => {
    let filtered = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;
    
    // Filter by appointment status
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(appointment => 
        !isPast(appointment.date) || 
        (isToday(appointment.date) && appointment.status !== 'completed')
      );
    } else {
      filtered = filtered.filter(appointment => 
        (isPast(appointment.date) && !isToday(appointment.date)) || 
        appointment.status === 'completed' ||
        appointment.status === 'cancelled'
      );
    }
    
    // Filter by appointment type
    if (filterType !== 'all') {
      filtered = filtered.filter(appointment => appointment.type === filterType);
    }
    
    // Filter by doctor
    if (filterDoctor !== 'all') {
      filtered = filtered.filter(appointment => appointment.doctor === filterDoctor);
    }
    
    return filtered;
  };

  // Get unique doctors for filter
  const getDoctors = () => {
    const doctors = new Set(upcomingAppointments.concat(pastAppointments).map(appointment => appointment.doctor));
    return Array.from(doctors);
  };

  // Handle calendar sync
  const handleCalendarSync = () => {
    // This would normally integrate with Google/Apple Calendar APIs
    console.log('Syncing appointments to calendar');
    setCalendarSynced(true);
    
    setTimeout(() => {
      setCalendarSynced(false);
    }, 3000);
  };

  // Get appointment conflicts (in real app, this would check against actual calendar)
  const getAppointmentConflicts = (appointment) => {
    const sameDay = upcomingAppointments.concat(pastAppointments).filter(a => 
      a.id !== appointment.id && 
      format(a.date, 'yyyy-MM-dd') === format(appointment.date, 'yyyy-MM-dd')
    );
    
    if (sameDay.length === 0) return null;
    
    return {
      hasConflict: true,
      conflictingAppointments: sameDay
    };
  };

  // Filtered appointments using all criteria
  const filteredAppointments = getFilteredAppointments();

  // Event handlers
  const handleAppointmentSelect = (appointment: any) => {
    setSelectedAppointmentId(appointment.id);
    setShowDetailsDialog(true);
  };

  const handleCancelAppointment = () => {
    if (selectedAppointmentId) {
      cancelAppointment(selectedAppointmentId);
      
      // Add notification for cancellation
      addNotification({
        id: Date.now().toString(),
        title: 'Appointment Cancelled',
        message: `Your appointment on ${format(selectedAppointment?.date || new Date(), 'MMM d, yyyy')} has been cancelled.`,
        timestamp: new Date(),
        read: false,
        priority: 'normal',
        type: 'appointment'
      });
      
      setShowCancelDialog(false);
      setShowDetailsDialog(false);
    }
  };

  const handleGenerateQRCode = () => {
    const qrToken = generateRecordsQR(recordAccessDuration);
    // In a real app, this would generate a QR code with the token
    setShowRecordsQR(true);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">My Appointments</h1>
          <p className="text-gray-500">Manage and schedule your medical appointments</p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="bg-white" onClick={handleCalendarSync}>
            {calendarSynced ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Synced
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Sync to Calendar
              </>
            )}
          </Button>
          
          <Link href="/patient/appointments/schedule">
            <Button className="bg-[#006D77] hover:bg-[#005A64]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Book New Appointment
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Enhanced Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-[250px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search appointments..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[130px] h-9 bg-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterDoctor} onValueChange={setFilterDoctor}>
              <SelectTrigger className="w-[130px] h-9 bg-white">
                <SelectValue placeholder="Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {getDoctors().map((doctor, index) => (
                  <SelectItem key={index} value={doctor}>{doctor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Tabs - with appointment counts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full border-b rounded-none p-0">
          <TabsTrigger 
            value="upcoming" 
            className="flex-1 py-3 rounded-none border-r data-[state=active]:bg-[#E8F3F4] data-[state=active]:text-[#006D77] data-[state=active]:shadow-none"
          >
            Upcoming
            <Badge className="ml-2 bg-[#006D77]">
              {upcomingAppointments.filter(a => !isPast(a.date) || (isToday(a.date) && a.status !== 'completed')).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="past" 
            className="flex-1 py-3 rounded-none data-[state=active]:bg-[#E8F3F4] data-[state=active]:text-[#006D77] data-[state=active]:shadow-none"
          >
            Past
            <Badge className="ml-2 bg-gray-200 text-gray-800">
              {pastAppointments.filter(a => (isPast(a.date) && !isToday(a.date)) || a.status === 'completed').length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="p-4">
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const conflict = getAppointmentConflicts(appointment);
                
                return (
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
                        {appointment.type === 'video' && isToday(appointment.date) && (
                          <Button size="sm" className="mr-2 bg-[#006D77] hover:bg-[#005A64]">
                            <Video className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Show conflict warning if it exists */}
                    {conflict && conflict.hasConflict && (
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p>You have {conflict.conflictingAppointments.length} other appointment(s) on this day.</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
                No past appointments
              </h3>
              
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Your past appointments will appear here once completed.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialogs for appointment details, cancellation, and rescheduling */}
      {showDetailsDialog && selectedAppointment && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#006D77] text-xl">
                Appointment Details
              </DialogTitle>
              <DialogDescription>
                Review your upcoming appointment information and medical records
              </DialogDescription>
            </DialogHeader>
            
            {/* Appointment Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedAppointment.doctorPhoto} alt={selectedAppointment.doctor} />
                  <AvatarFallback>{selectedAppointment.doctor.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium">{selectedAppointment.title}</h3>
                  <p className="text-sm text-gray-600">with {selectedAppointment.doctor}</p>
                  {selectedAppointment.specialty && (
                    <Badge variant="outline" className="mt-1">
                      {selectedAppointment.specialty}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="bg-[#E8F3F4] p-3 rounded-md">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#006D77]" />
                    <span>{formatAppointmentDate(selectedAppointment.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#006D77]" />
                    <span>{selectedAppointment.time} {selectedAppointment.endTime && `- ${selectedAppointment.endTime}`}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getAppointmentTypeIcon(selectedAppointment.type)}
                    <span className="capitalize">{selectedAppointment.type} appointment</span>
                  </div>
                  
                  {selectedAppointment.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#006D77]" />
                      <span>{selectedAppointment.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Medical Records Section */}
              <div>
                <h4 className="font-medium text-[#006D77] mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Related Medical Records
                </h4>
                
                <div className="border rounded-md p-3">
                  {/* AI-categorized records */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recent Lab Results</span>
                      <Badge variant="outline" className="text-xs">3 records</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Medication History</span>
                      <Badge variant="outline" className="text-xs">7 records</Badge>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  
                  {/* Record expiration alert */}
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800">
                      Some of your medical records will expire in 3 days. Generate a new QR code to maintain access.
                    </div>
                  </div>
                  
                  {/* QR Generator */}
                  {!showRecordsQR ? (
                    <Button 
                      onClick={handleGenerateQRCode}
                      className="w-full bg-[#006D77] hover:bg-[#005A64] text-sm"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate Medical Records QR
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Access Duration:</span>
                        <Select value={recordAccessDuration} onValueChange={setRecordAccessDuration}>
                          <SelectTrigger className="w-[100px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="24hr">24 hours</SelectItem>
                            <SelectItem value="7days">7 days</SelectItem>
                            <SelectItem value="30days">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="bg-white border p-3 rounded-md flex justify-center">
                        {/* This would be an actual QR code in production */}
                        <div className="w-32 h-32 bg-[#E8F3F4] flex items-center justify-center border-2 border-[#006D77] rounded-md">
                          <QrCode className="h-16 w-16 text-[#006D77]" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => setShowRecordsQR(false)}
                        >
                          Hide QR
                        </Button>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Shield className="h-3 w-3 mr-1 text-[#006D77]" />
                        Encrypted and expires in {recordAccessDuration === "24hr" ? "24 hours" : 
                          recordAccessDuration === "7days" ? "7 days" : "30 days"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              {!isPast(selectedAppointment.date) && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setShowCancelDialog(true);
                      setShowDetailsDialog(false);
                    }}
                  >
                    Cancel Appointment
                  </Button>
                  
                  <Button 
                    className="bg-[#006D77] hover:bg-[#005A64]"
                  >
                    Reschedule
                  </Button>
                </>
              )}
              {isPast(selectedAppointment.date) && (
                <Button className="w-full bg-[#006D77] hover:bg-[#005A64]">
                  View Full Medical Record
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Other dialogs */}
    </div>
  );
}