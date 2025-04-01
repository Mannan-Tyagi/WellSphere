export type ViewType = 'day' | 'week' | 'month';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoto?: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  purpose: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  preparationStatus?: string;
  notes?: string;
  type: 'consultation' | 'surgery' | 'follow-up' | 'check-up' | 'other';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  type: 'prescription' | 'follow-up' | 'documentation' | 'other';
  relatedPatientId?: string;
  relatedPatientName?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'routine' | 'important' | 'critical';
  type: 'appointment' | 'task' | 'system';
  actionUrl?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'scheduling' | 'patient-risk' | 'follow-up' | 'optimization';
  suggestion: string;
  reason: string;
  timestamp: Date;
  applied: boolean;
  relatedPatientId?: string;
  relatedAppointmentId?: string;
  suggestedTime?: Date;
  efficiencyImprovement?: number; // percentage improvement
}

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  notificationCount?: number;
  active: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo?: string;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}