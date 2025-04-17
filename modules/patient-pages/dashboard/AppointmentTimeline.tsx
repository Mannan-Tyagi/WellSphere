import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow, format, isPast, isToday, isTomorrow, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight, Video, MapPin, Phone, PlusCircle } from 'lucide-react';

const AppointmentTimeline = () => {
  // Mock appointments data
  const appointments = [
    {
      id: 1,
      title: 'Annual Physical Examination',
      doctor: 'Dr. Julia Smith',
      date: addDays(new Date(), 2),
      time: '10:00 AM',
      type: 'in-person',
      status: 'confirmed',
      location: 'Main Hospital, Room 305',
      notes: 'Please bring your medication list'
    },
    {
      id: 2,
      title: 'Diabetes Follow-up',
      doctor: 'Dr. Michael Chen',
      date: addDays(new Date(), 7),
      time: '2:30 PM',
      type: 'video',
      status: 'confirmed',
      location: null,
      notes: 'Have your glucose readings ready'
    },
    {
      id: 3,
      title: 'Therapy Session',
      doctor: 'Dr. Sarah Johnson',
      date: addDays(new Date(), -1),
      time: '3:00 PM',
      type: 'phone',
      status: 'completed',
      location: null,
      notes: 'Completed. Next session scheduled.'
    }
  ];
  
  // Helper function to get appointment type icon
  const getAppointmentTypeIcon = (type) => {
    switch (type) {
      case 'in-person':
        return <MapPin className="h-4 w-4 text-emerald-600" />;
      case 'video':
        return <Video className="h-4 w-4 text-blue-600" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-purple-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Helper function to format date
  const formatAppointmentDate = (date) => {
    if (isToday(date)) return `Today, ${format(date, 'MMM d')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'MMM d')}`;
    return format(date, 'EEE, MMM d');
  };
  
  // Helper function to get appointment status badge
  const getStatusBadge = (status, date) => {
    if (status === 'completed' || isPast(date)) {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Completed</Badge>;
    }
    if (status === 'confirmed') {
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Confirmed</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
  };
  
  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Calendar className="mr-2 h-5 w-5" />
          Appointments
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 bg-[#F0F9FA] text-[#006D77] border-[#006D77]">
            <PlusCircle className="h-4 w-4 mr-1" />
            New
          </Button>
          <Link href="/patient/appointments" className="text-sm text-[#006D77] hover:underline flex items-center">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className={`border rounded-lg p-3 hover:bg-gray-50 transition-colors ${
                isPast(appointment.date) && appointment.status !== 'completed' 
                  ? 'border-amber-200 bg-amber-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{appointment.title}</h3>
                  <p className="text-sm text-gray-600">with {appointment.doctor}</p>
                </div>
                {getStatusBadge(appointment.status, appointment.date)}
              </div>
              
              <div className="mt-2 flex flex-wrap items-center text-sm gap-x-4 gap-y-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{formatAppointmentDate(appointment.date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600">{appointment.time}</span>
                </div>
                <div className="flex items-center">
                  {getAppointmentTypeIcon(appointment.type)}
                  <span className="ml-1 capitalize">{appointment.type}</span>
                </div>
              </div>
              
              {appointment.notes && (
                <p className="mt-2 text-xs text-gray-500 italic">{appointment.notes}</p>
              )}
              
              {!isPast(appointment.date) && (
                <div className="mt-3 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7 border-[#006D77] text-[#006D77] hover:bg-[#F0F9FA]"
                  >
                    Reschedule
                  </Button>
                  {appointment.type === 'video' && (
                    <Button 
                      size="sm" 
                      className="text-xs h-7 bg-[#006D77] hover:bg-[#00585F]"
                    >
                      Join Call
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {appointments.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <p>No upcoming appointments</p>
              <Link href="/patient/appointments/schedule" className="text-sm text-[#006D77] hover:underline mt-2 inline-block">
                Schedule an appointment
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentTimeline;
