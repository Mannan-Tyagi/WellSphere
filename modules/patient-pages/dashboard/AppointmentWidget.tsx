import React from 'react';
import Link from 'next/link';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Calendar, ChevronRight, Video, MapPin, Phone, PlusCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Import our context
import { useAppointments } from '@/contexts/AppointmentContext';

interface AppointmentWidgetProps {
  className?: string;
}

const AppointmentWidget: React.FC<AppointmentWidgetProps> = ({ className }) => {
  // Use our context
  const { upcomingAppointments, navigateToAppointmentDetails, navigateToBooking } = useAppointments();

  // Helper function to format date
  const formatAppointmentDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  // Helper function to get appointment type icon
  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return <MapPin className="h-4 w-4 text-emerald-600" />;
      case 'video': return <Video className="h-4 w-4 text-blue-600" />;
      case 'phone': return <Phone className="h-4 w-4 text-purple-600" />;
      default: return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className={`border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Calendar className="mr-2 h-5 w-5" />
          Upcoming Appointments
        </CardTitle>
        <Link href="/patient/appointments" className="text-sm text-[#006D77] hover:underline flex items-center">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.slice(0, 3).map((appointment) => (
              <div 
                key={appointment.id} 
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigateToAppointmentDetails(appointment.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={appointment.doctorPhoto} alt={appointment.doctor} />
                      <AvatarFallback>{appointment.doctor?.charAt(0) || 'D'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{appointment.title}</h3>
                      <p className="text-sm text-gray-600">with {appointment.doctor}</p>
                      
                      <div className="flex flex-wrap items-center text-sm gap-x-3 gap-y-1 mt-1">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {formatAppointmentDate(appointment.date)}
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {appointment.time}
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          {getAppointmentTypeIcon(appointment.type)}
                          <span className="ml-1 capitalize">{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.type === 'video' && (
                    <Button 
                      size="sm" 
                      className="text-xs h-7 bg-[#006D77] hover:bg-[#00585F]"
                    >
                      Join Call
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              <div className="flex justify-center mb-2">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <p>No upcoming appointments</p>
              <Button 
                className="text-sm text-[#006D77] hover:underline mt-2 inline-block"
                variant="link"
                onClick={navigateToBooking}
              >
                Schedule an appointment
              </Button>
            </div>
          )}
        </div>
        
        {upcomingAppointments.length > 0 && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full border-[#006D77] text-[#006D77] hover:bg-[#F0F9FA] bg-white"
              onClick={navigateToBooking}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule New Appointment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentWidget;