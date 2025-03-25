import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Appointment, APPOINTMENT_TYPES } from '@/app/(route)/Doctor/Calendar/page';
import { cn } from '@/lib/utils';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot?: {
    start: Date;
    end: Date;
    slots: Date[];
    action: 'select' | 'click' | 'doubleClick';
  };
  onCreateAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
  appointmentTypes: typeof APPOINTMENT_TYPES;
}

export function AppointmentModal({
  isOpen,
  onClose,
  selectedSlot,
  onCreateAppointment,
  appointmentTypes
}: AppointmentModalProps) {
  // Initialize with the slot times or default to current time
  const initialStart = selectedSlot?.start || new Date();
  const initialEnd = selectedSlot?.end || new Date(initialStart.getTime() + 30 * 60000);
  
  // Form state
  const [patientId, setPatientId] = useState('');
  const [appointmentType, setAppointmentType] = useState<keyof typeof APPOINTMENT_TYPES>('FOLLOW_UP');
  const [startDate, setStartDate] = useState<Date>(initialStart);
  const [endDate, setEndDate] = useState<Date>(initialEnd);
  const [startTime, setStartTime] = useState(format(initialStart, 'HH:mm'));
  const [endTime, setEndTime] = useState(format(initialEnd, 'HH:mm'));
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [notes, setNotes] = useState('');
  
  // Mock patients for the dropdown
  const patients = [
    { id: '1', name: 'Emma Johnson' },
    { id: '2', name: 'James Wilson' },
    { id: '3', name: 'Sophia Davis' },
    { id: '4', name: 'Noah Martinez' },
    { id: '5', name: 'Olivia Taylor' }
  ];
  
  // Update duration when appointment type changes
  useEffect(() => {
    const typeDuration = appointmentTypes[appointmentType].duration;
    setDuration(typeDuration);
    updateEndTime(startTime, typeDuration);
  }, [appointmentType, appointmentTypes]);
  
  // Update end time when start time or duration changes
  const updateEndTime = (startTimeString: string, mins: number) => {
    const [hours, minutes] = startTimeString.split(':').map(Number);
    const newStartDate = new Date(startDate);
    newStartDate.setHours(hours, minutes, 0, 0);
    
    const newEndDate = new Date(newStartDate.getTime() + mins * 60000);
    setEndTime(format(newEndDate, 'HH:mm'));
  };
  
  // Handle duration slider change
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setDuration(newDuration);
    updateEndTime(startTime, newDuration);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId) {
      alert('Please select a patient');
      return;
    }
    
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    // Combine date and time
    const start = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    start.setHours(startHours, startMinutes, 0, 0);
    
    const end = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    end.setHours(endHours, endMinutes, 0, 0);
    
    const appointmentData: Omit<Appointment, 'id'> = {
      title: `${patient.name} - ${appointmentTypes[appointmentType].name}`,
      start,
      end,
      patient: {
        id: patient.id,
        name: patient.name,
        phone: '555-123-4567',
        email: `${patient.name.toLowerCase().replace(' ', '.')}@example.com`,
      },
      type: appointmentType,
      status: 'SCHEDULED',
      notes: notes.trim() || undefined
    };
    
    onCreateAppointment(appointmentData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger id="patient">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select 
              value={appointmentType} 
              onValueChange={(value: keyof typeof APPOINTMENT_TYPES) => setAppointmentType(value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(appointmentTypes).map(([type, details]) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: details.color }}
                      />
                      <span>{details.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date and Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        setEndDate(date);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    updateEndTime(e.target.value, duration);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Duration</Label>
              <span className="text-sm text-muted-foreground">{duration} minutes</span>
            </div>
            <Slider
              value={[duration]}
              min={10}
              max={120}
              step={5}
              onValueChange={handleDurationChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none h-20"
              placeholder="Add any notes about this appointment..."
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}