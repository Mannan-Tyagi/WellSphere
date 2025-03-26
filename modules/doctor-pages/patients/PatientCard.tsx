import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { Patient, PatientStatus } from "@/types/patient";
import Link from "next/link";

interface PatientCardProps {
  patient: Patient;
  viewMode: "grid" | "list";
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, viewMode }) => {
  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-800 border-green-200";
      case "needs-attention":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border border-gray-200">
              <Image
                src={patient.profileImage || "/avatars/placeholder.png"}
                alt={patient.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span>ID: {patient.id}</span>
                    <span>{patient.age} years • {patient.gender}</span>
                  </div>
                </div>
                
                <Badge className={`${getStatusColor(patient.status)}`}>
                  {getStatusLabel(patient.status)}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center ml-4 gap-2">
              <div className="text-right mr-6">
                <div className="text-sm text-gray-500">Last Visit</div>
                <div className="font-medium">{formatDate(patient.lastVisit)}</div>
              </div>
              
              <Link href={`/Doctor/Patients/${patient.id}`}>
                <Button className="bg-[#006D77] hover:bg-[#00585F]">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 border border-gray-200">
                <Image
                  src={patient.profileImage || "/avatars/placeholder.png"}
                  alt={patient.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{patient.name}</h3>
                <div className="text-sm text-gray-500">ID: {patient.id}</div>
              </div>
            </div>
            <Badge className={`${getStatusColor(patient.status)}`}>
              {getStatusLabel(patient.status)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div>
              <div className="text-gray-500">Age</div>
              <div>{patient.age} years</div>
            </div>
            <div>
              <div className="text-gray-500">Gender</div>
              <div>{patient.gender}</div>
            </div>
            <div>
              <div className="text-gray-500">Last Visit</div>
              <div>{formatDate(patient.lastVisit)}</div>
            </div>
            <div>
              <div className="text-gray-500">Condition</div>
              <div>{patient.condition}</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 flex gap-2">
          <Link href={`/Doctor/Patients/${patient.id}`} className="flex-grow">
            <Button variant="default" className="w-full bg-[#006D77] hover:bg-[#00585F]">
              View Details
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="text-[#006D77]">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-[#006D77]">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;