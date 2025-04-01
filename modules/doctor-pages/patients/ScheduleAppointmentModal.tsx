import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { Patient } from "@/types/patient";
import { formatDate } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ScheduleAppointmentModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({ 
  patient, 
  isOpen, 
  onClose,
  onSubmit 
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [appointmentType, setAppointmentType] = useState("Check-up");
  const [doctor, setDoctor] = useState("Dr. Julia Smith");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!appointmentType) newErrors.type = "Appointment type is required";
    if (!doctor) newErrors.doctor = "Doctor is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Format date as ISO string (YYYY-MM-DD)
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    
    const appointmentData = {
      date: formattedDate,
      time: formatTime(time),
      type: appointmentType,
      doctor,
      duration,
      notes
    };
    
    onSubmit(appointmentData);
  };
  
  const formatTime = (time24h: string) => {
    // Convert 24h to 12h format with AM/PM
    const [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Generate time options in 15-minute intervals
  const timeOptions = [];
  for (let hour = 8; hour <= 17; hour++) { // 8 AM to 5 PM
    for (let minute = 0; minute < 60; minute += 15) {
      const hourFormatted = hour.toString().padStart(2, '0');
      const minuteFormatted = minute.toString().padStart(2, '0');
      timeOptions.push(`${hourFormatted}:${minuteFormatted}`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <div className="text-sm text-gray-500">
            Patient: <span className="font-medium">{patient.name}</span> ({patient.id})
          </div>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white",
                      !date && "text-muted-foreground",
                      errors.date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date.toISOString()) : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time <span className="text-red-500">*</span></Label>
              <Select
                value={time}
                onValueChange={setTime}
              >
                <SelectTrigger 
                  id="time" 
                  className={cn(
                    "bg-white",
                    errors.time && "border-red-500"
                  )}
                >
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {timeOptions.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      {formatTime(timeOption)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type <span className="text-red-500">*</span></Label>
            <Select
              value={appointmentType}
              onValueChange={setAppointmentType}
            >
              <SelectTrigger 
                id="type" 
                className={cn(
                  "bg-white",
                  errors.type && "border-red-500"
                )}
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Check-up">Regular Check-up</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Therapy">Therapy Session</SelectItem>
                <SelectItem value="Procedure">Medical Procedure</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor <span className="text-red-500">*</span></Label>
              <Select
                value={doctor}
                onValueChange={setDoctor}
              >
                <SelectTrigger 
                  id="doctor" 
                  className={cn(
                    "bg-white",
                    errors.doctor && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Dr. Julia Smith">Dr. Julia Smith</SelectItem>
                  <SelectItem value="Dr. Mark Williams">Dr. Mark Williams</SelectItem>
                  <SelectItem value="Dr. Rebecca Lee">Dr. Rebecca Lee</SelectItem>
                  <SelectItem value="Dr. James Wilson">Dr. James Wilson</SelectItem>
                  <SelectItem value="Dr. Sophia Chen">Dr. Sophia Chen</SelectItem>
                  <SelectItem value="Dr. Alex Thompson">Dr. Alex Thompson</SelectItem>
                </SelectContent>
              </Select>
              {errors.doctor && <p className="text-red-500 text-xs">{errors.doctor}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select
                value={duration}
                onValueChange={setDuration}
              >
                <SelectTrigger id="duration" className="bg-white">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes for this appointment"
              className="bg-white min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-[#006D77]">Schedule Appointment</Button>
        </DialogFooter>

        <DialogClose className="absolute right-4 top-4">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentModal;