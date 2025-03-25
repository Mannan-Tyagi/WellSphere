import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Appointment, APPOINTMENT_TYPES } from '@/app/(route)/Doctor/Calendar/page';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Clock,
  CalendarClock,
  Pencil,
  X,
  Phone,
  Mail,
  FileText,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

interface AppointmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
  appointmentTypes: typeof APPOINTMENT_TYPES;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  isOpen,
  onClose,
  appointment,
  onAppointmentUpdate,
  onAppointmentDelete,
  appointmentTypes
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [checklist, setChecklist] = useState<string[]>(
    appointment.preparation || appointmentTypes[appointment.type].preparation
  );
  const [completedItems, setCompletedItems] = useState<string[]>(
    appointment.checklistCompleted ? [...checklist] : []
  );

  const handleDeleteAppointment = () => {
    onAppointmentDelete(appointment.id);
    setShowDeleteDialog(false);
  };

  const toggleChecklistItem = (item: string) => {
    if (completedItems.includes(item)) {
      setCompletedItems(completedItems.filter(i => i !== item));
      
      // If not all items are completed, update the appointment
      onAppointmentUpdate({
        ...appointment,
        checklistCompleted: false
      });
    } else {
      const newCompleted = [...completedItems, item];
      setCompletedItems(newCompleted);
      
      // If all items are completed, update the appointment
      if (newCompleted.length === checklist.length) {
        onAppointmentUpdate({
          ...appointment,
          checklistCompleted: true
        });
      }
    }
  };

  const formatAppointmentTime = () => {
    const startDate = format(appointment.start, 'EEEE, MMMM d, yyyy');
    const startTime = format(appointment.start, 'h:mm a');
    const endTime = format(appointment.end, 'h:mm a');
    
    return `${startDate} · ${startTime} - ${endTime}`;
  };

  const calculateDuration = () => {
    const durationMs = appointment.end.getTime() - appointment.start.getTime();
    return Math.round(durationMs / (1000 * 60)); // Convert to minutes
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="text-xl">Appointment Details</SheetTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {}}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="patient">Patient</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{appointment.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    style={{ backgroundColor: appointmentTypes[appointment.type].color }}
                    className="text-white"
                  >
                    {appointmentTypes[appointment.type].name}
                  </Badge>
                  <Badge variant="outline">{appointment.status}</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span>{formatAppointmentTime()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{calculateDuration()} minutes</span>
              </div>
              
              {appointment.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Notes:</h4>
                  <div className="p-3 bg-muted/50 rounded-md text-sm">
                    {appointment.notes}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Preparation Checklist</h4>
                  
                  <div className="space-y-2">
                    {checklist.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-2"
                      >
                        <Checkbox 
                          id={`checklist-${index}`}
                          checked={completedItems.includes(item)}
                          onCheckedChange={() => toggleChecklistItem(item)}
                        />
                        <label 
                          htmlFor={`checklist-${index}`}
                          className={`text-sm cursor-pointer ${completedItems.includes(item) ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button variant="outline" className="justify-start text-red-600">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="patient" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{appointment.patient.name}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {appointment.patient.dob && (
                      <span>DOB: {format(new Date(appointment.patient.dob), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.patient.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.patient.email}</span>
                  </div>
                  
                  {appointment.patient.lastVisit && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last Visit: {format(new Date(appointment.patient.lastVisit), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Insurance Information</h4>
                  {appointment.patient.insuranceProvider ? (
                    <div className="p-3 bg-muted/50 rounded-md">
                      <div className="font-medium">{appointment.patient.insuranceProvider}</div>
                      {appointment.patient.insuranceNumber && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Policy #: {appointment.patient.insuranceNumber}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No insurance information</div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Medical Record
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="mt-6">
            <Button onClick={onClose}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel This Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the appointment with {appointment.patient.name} on {format(appointment.start, 'MMMM d, yyyy')} at {format(appointment.start, 'h:mm a')}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAppointment} className="bg-destructive text-destructive-foreground">
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppointmentDetails;