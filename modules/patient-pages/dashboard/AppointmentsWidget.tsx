import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, ChevronRight, User, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AppointmentsWidget = () => {
  // Mock upcoming appointments
  const appointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Tomorrow',
      time: '10:00 AM',
      location: 'Main Clinic',
      type: 'in-person'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'General Practice',
      date: 'Friday, Jun 12',
      time: '2:30 PM',
      location: 'Virtual',
      type: 'telehealth'
    }
  ];

  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Calendar className="mr-2 h-5 w-5" />
          Upcoming Appointments
        </CardTitle>
        <Link href="/patient/appointments/book">
          <Button className="bg-[#006D77] hover:bg-[#00585F]">
            <Plus className="h-4 w-4 mr-1" />
            Book New
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{appointment.doctorName}</h3>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  </div>
                  <Badge 
                    className={appointment.type === 'telehealth' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : 'bg-green-100 text-green-800 border-green-200'}
                  >
                    {appointment.type === 'telehealth' ? 'Telehealth' : 'In-Person'}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm mt-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center text-gray-700">
                    {appointment.type === 'telehealth' ? (
                      <Video className="h-4 w-4 mr-1 text-gray-500" />
                    ) : (
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    )}
                    {appointment.location}
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Link href={`/patient/appointments/${appointment.id}`}>
                    <Button variant="outline" size="sm" className="text-[#006D77] border-[#006D77]">
                      View Details
                    </Button>
                  </Link>
                  {appointment.type === 'telehealth' && (
                    <Button size="sm" className="ml-2 bg-blue-500 hover:bg-blue-600">
                      Join Call
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <User className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No upcoming appointments</p>
              <Link href="/patient/appointments/book">
                <Button variant="outline" className="mt-2">
                  Schedule an appointment
                </Button>
              </Link>
            </div>
          )}
          
          <Link href="/patient/appointments" className="text-sm text-[#006D77] hover:underline flex items-center justify-end">
            View All Appointments <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsWidget;
