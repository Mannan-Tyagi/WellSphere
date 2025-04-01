import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import { Appointment } from "@/types/patient";

interface AppointmentHistoryItemProps {
  appointment: Appointment;
}

const AppointmentHistoryItem: React.FC<AppointmentHistoryItemProps> = ({ appointment }) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="bg-[#F0F9FA] p-2 rounded-md mr-4">
            <Calendar className="h-5 w-5 text-[#006D77]" />
          </div>
          <div>
            <div className="font-medium">{formatDate(appointment.date)} • {appointment.time}</div>
            <div className="text-sm text-gray-500">{appointment.type} with {appointment.doctorName}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-gray-50 rounded-md p-3 mt-3">
        <div className="text-sm font-medium mb-1">Doctor's Notes:</div>
        <div className="text-sm text-gray-600">{appointment.notes}</div>
      </div>
      
      {appointment.prescriptions.length > 0 && (
        <div className="mt-3">
          <div className="text-sm font-medium mb-1">Prescriptions:</div>
          <div className="flex flex-wrap gap-2">
            {appointment.prescriptions.map((prescription, idx) => (
              <Badge key={idx} variant="outline" className="bg-gray-50">
                {prescription}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistoryItem;