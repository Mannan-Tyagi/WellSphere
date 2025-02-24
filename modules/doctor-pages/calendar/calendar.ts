export type AppointmentStatus = 'finished' | 'in-progress' | 'cancelled' | 'upcoming' | 'encounter';

export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  appointments: number;
  specialization: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  treatmentType: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  patientContact?: string;
  doctorId: string;
  location?: string;
}

export type CalendarView = 'day' | 'week' | 'month';

export interface NewAppointmentData {
  patientName: string;
  treatmentType: string;
  startTime: string;
  endTime: string;
  patientContact: string;
  notes?: string;
}