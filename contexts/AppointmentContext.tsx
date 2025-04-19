"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Define types for our context
export interface Appointment {
  id: number | string;
  title: string;
  doctor?: string;
  doctorPhoto?: string;
  specialty?: string;
  date: Date;
  time: string;
  endTime?: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location?: string | null;
  notes?: string;
  patientName?: string;
  patientPhoto?: string;
  patientAge?: number;
  patientGender?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  purpose?: string;
  preparationStatus?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string | number, updatedData: Partial<Appointment>) => void;
  cancelAppointment: (id: string | number) => void;
  deleteAppointment: (id: string | number) => void;
  getAppointmentById: (id: string | number) => Appointment | undefined;
  navigateToAppointmentDetails: (id: string | number) => void;
  navigateToBooking: () => void;
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  loadingAppointments: boolean;
}

// Create the context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Create a provider component
export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const router = useRouter();

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data or localStorage
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
          // Parse dates from string to Date objects
          const parsedAppointments = JSON.parse(storedAppointments, (key, value) => {
            if (key === 'date' || key === 'startTime' || key === 'endTime') {
              return new Date(value);
            }
            return value;
          });
          setAppointments(parsedAppointments);
        } else {
          // Use mock data initially
          // This would be your API call in a real application
          const mockAppointments = [];
          setAppointments(mockAppointments);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
    
    // Setup event listeners for real-time updates
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('appointment_updated', handleAppointmentEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('appointment_updated', handleAppointmentEvent as EventListener);
    };
  }, []);

  // Handle storage change for cross-tab synchronization
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'appointments' && event.newValue) {
      const updatedAppointments = JSON.parse(event.newValue, (key, value) => {
        if (key === 'date' || key === 'startTime' || key === 'endTime') {
          return new Date(value);
        }
        return value;
      });
      setAppointments(updatedAppointments);
    }
  };

  // Handle custom appointment events
  const handleAppointmentEvent = (event: CustomEvent) => {
    if (event.detail && event.detail.appointments) {
      setAppointments(event.detail.appointments);
    }
  };

  // Persist appointments to localStorage
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
      
      // Dispatch a custom event to notify other components
      const event = new CustomEvent('appointment_updated', { 
        detail: { appointments } 
      });
      window.dispatchEvent(event);
    }
  }, [appointments]);

  // Filter appointments into upcoming and past
  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) >= new Date() || app.status === 'pending'
  );
  
  const pastAppointments = appointments.filter(
    app => new Date(app.date) < new Date() && app.status !== 'pending'
  );

  // Add a new appointment
  const addAppointment = (appointment: Appointment) => {
    const newAppointment = {
      ...appointment,
      id: typeof appointment.id !== 'undefined' ? appointment.id : Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  // Update an existing appointment
  const updateAppointment = (id: string | number, updatedData: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === id ? { ...app, ...updatedData } : app
      )
    );
  };

  // Cancel an appointment
  const cancelAppointment = (id: string | number) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  // Delete an appointment
  const deleteAppointment = (id: string | number) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  // Get an appointment by ID
  const getAppointmentById = (id: string | number) => {
    return appointments.find(app => app.id === id);
  };

  // Navigation helpers
  const navigateToAppointmentDetails = (id: string | number) => {
    // Store selected appointment ID in sessionStorage for cross-page persistence
    sessionStorage.setItem('selectedAppointmentId', id.toString());
    router.push(`/patient/appointments/details/${id}`);
  };

  const navigateToBooking = () => {
    router.push('/patient/appointments/schedule');
  };

  // Context value
  const value = {
    appointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    getAppointmentById,
    navigateToAppointmentDetails,
    navigateToBooking,
    upcomingAppointments,
    pastAppointments,
    loadingAppointments
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the appointment context
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
