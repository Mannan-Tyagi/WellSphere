import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appointment, APPOINTMENT_TYPES } from '@/app/(route)/Doctor/Calendar/page';
import {
  Clock,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  Edit,
  Trash,
  FileText
} from 'lucide-react';

interface AppointmentDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  appointmentTypes: typeof APPOINTMENT_TYPES;
}

export function AppointmentDetailsPanel({
  isOpen,
  onClose,
  appointment,
  onUpdateAppointment,
  onDeleteAppointment,
  appointmentTypes
}: AppointmentDetailsPanelProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDelete = () => {
    onDeleteAppointment(appointment.id);
    setShowDeleteDialog(false);
  };
  
  // Format appointment duration in minutes
  const getDuration = () => {
    const durationMs = appointment.end.getTime() - appointment.start.getTime();
    return Math.round(durationMs / 60000); // Convert to minutes
  };
  
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-2">
            <SheetTitle>Appointment Details</SheetTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="patient">Patient</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4 pb-2">
              <div className="space-y-4">
                {/* Appointment Type */}
                <div>
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: appointmentTypes[appointment.type].color }}
                  >
                    {appointmentTypes[appointment.type].name}
                  </Badge>
                </div>
                
                {/* Date & Time */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{format(appointment.start, 'EEEE, MMMM d, yyyy')}</div>
                        <div className="text-muted-foreground text-sm">
                          {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{getDuration()} minutes</div>
                        <div className="text-muted-foreground text-sm">Appointment duration</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Notes */}
                {appointment.notes && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Notes</h3>
                    <div className="p-3 bg-muted/50 rounded-md text-sm">
                      {appointment.notes}
                    </div>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="pt-2 space-y-2">
                  <h3 className="text-sm font-medium">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Reschedule
                    </Button>
                    <Button variant="outline" className="justify-start text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="patient" className="pt-4 pb-2">
              <div className="space-y-4">
                {/* Patient Details */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{appointment.patient.name}</h3>
                    {appointment.patient.age && (
                      <p className="text-sm text-muted-foreground">{appointment.patient.age} years old</p>
                    )}
                  </div>
                </div>
                
                {/* Contact Information */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{appointment.patient.phone}</div>
                        <div className="text-muted-foreground text-sm">Phone</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{appointment.patient.email}</div>
                        <div className="text-muted-foreground text-sm">Email</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional Patient Information */}
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    View Full Medical Record
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the appointment with {appointment.patient.name} on {format(appointment.start, 'MMMM d')} at {format(appointment.start, 'h:mm a')}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}