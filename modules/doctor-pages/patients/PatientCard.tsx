import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageCircle, ChevronRight } from "lucide-react";
import { Patient, PatientStatus } from "@/types/patient";
import { formatDate } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
  viewMode: "grid" | "list";
  onViewDetails: () => void;
  onScheduleAppointment: () => void;
  onSendMessage: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  viewMode,
  onViewDetails,
  onScheduleAppointment,
  onSendMessage
}) => {
  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "needs-attention":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "critical":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "Stable";
      case "needs-attention":
        return "Needs Attention";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  // Check if patient has upcoming appointments
  const hasUpcomingAppointment = patient.upcomingAppointments && patient.upcomingAppointments.length > 0;
  const nextAppointment = hasUpcomingAppointment ? patient.upcomingAppointments![0] : null;

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-[#E8F3F4] bg-white">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-center p-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden mr-4 border-2 border-[#E8F3F4] flex-shrink-0">
              <Image
                src={patient.profileImage || "/avatars/placeholder.png"}
                alt={patient.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <h3 className="font-medium text-lg">{patient.name}</h3>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3">
                    <span className="bg-[#F0F9FA] px-2 py-0.5 rounded-md">ID: {patient.id}</span>
                    <span>{patient.age} years • {patient.gender}</span>
                  </div>
                </div>
                
                <Badge className={`${getStatusColor(patient.status)} mt-1 sm:mt-0`}>
                  {getStatusLabel(patient.status)}
                </Badge>
              </div>
              
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500 mr-1">Condition:</span>
                  <span className="font-medium">{patient.condition}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 mr-1">Last Visit:</span>
                  <span className="font-medium">{formatDate(patient.lastVisit)}</span>
                </div>
                
                {nextAppointment && (
                  <div className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    <Calendar className="inline-block h-3 w-3 mr-1" />
                    Next Appt: {formatDate(nextAppointment.date)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-row sm:flex-col md:flex-row items-center gap-2 mt-3 sm:mt-0 sm:ml-4">
              <Button 
                className="bg-gradient-to-r from-[#006D77] to-[#249EA0] text-white hover:opacity-90 transition-all duration-300"
                onClick={onViewDetails}
              >
                View Details
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA] hover:text-[#006D77] bg-white"
                  onClick={onScheduleAppointment}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA] hover:text-[#006D77] bg-white"
                  onClick={onSendMessage}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-[#E8F3F4] hover:translate-y-[-2px] bg-white">
      <CardContent className="p-0">
        <div className="p-4 border-b border-[#E8F3F4]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="relative h-14 w-14 rounded-full overflow-hidden mr-3 border-2 border-[#E8F3F4]">
                <Image
                  src={patient.profileImage || "/avatars/placeholder.png"}
                  alt={patient.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{patient.name}</h3>
                <div className="text-sm text-gray-500">ID: {patient.id}</div>
              </div>
            </div>
            <Badge className={`${getStatusColor(patient.status)}`}>
              {getStatusLabel(patient.status)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-[#F0F9FA] p-2 rounded-md">
              <div className="text-[#006D77] font-medium">Age</div>
              <div>{patient.age} years</div>
            </div>
            <div className="bg-[#F0F9FA] p-2 rounded-md">
              <div className="text-[#006D77] font-medium">Gender</div>
              <div>{patient.gender}</div>
            </div>
            <div className="bg-[#F0F9FA] p-2 rounded-md">
              <div className="text-[#006D77] font-medium">Last Visit</div>
              <div>{formatDate(patient.lastVisit)}</div>
            </div>
            <div className="bg-[#F0F9FA] p-2 rounded-md">
              <div className="text-[#006D77] font-medium">Condition</div>
              <div className="truncate">{patient.condition}</div>
            </div>
          </div>
          
          {nextAppointment && (
            <div className="bg-blue-50 p-2 rounded-md mb-2 flex items-center">
              <Calendar className="h-4 w-4 text-blue-700 mr-2" />
              <div>
                <div className="text-blue-700 text-xs font-medium">Upcoming Appointment</div>
                <div className="text-sm">{formatDate(nextAppointment.date)} • {nextAppointment.time}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-[#F8FCFC] flex gap-2">
          <Button 
            className="flex-grow bg-gradient-to-r from-[#006D77] to-[#249EA0] text-white hover:opacity-90 transition-all duration-300"
            onClick={onViewDetails}
          >
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA] hover:text-[#006D77] bg-white"
            onClick={onScheduleAppointment}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA] hover:text-[#006D77] bg-white"
            onClick={onSendMessage}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;