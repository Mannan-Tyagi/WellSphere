import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { ViewType, Appointment, Notification, AIRecommendation } from './types';
import { 
  getDateRangeForView,
  getNextDate,
  getPreviousDate,
  hasScheduleConflict
} from './utils';
import { v4 as uuidv4 } from 'uuid';
import { useNotifications } from '@/contexts/NotificationsContext';

// Mock data
import { mockAppointments } from './mockData/appointments';
import { mockRecommendations } from './mockData/recommendations';
import { mockNotifications } from './mockData/notifications';

interface CalendarContextType {
  // State
  activeView: ViewType;
  selectedDate: Date;
  appointments: Appointment[];
  recommendations: AIRecommendation[];
  notifications: Notification[];
  selectedAppointment: Appointment | null;
  draggingAppointment: Appointment | null;
  potentialTimeSlot: { date: Date; hour: number } | null;
  showConflictModal: boolean;
  
  // Actions
  setActiveView: (view: ViewType) => void;
  setSelectedDate: (date: Date) => void;
  goToNextDate: () => void;
  goToPreviousDate: () => void;
  goToToday: () => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  cancelAppointment: (appointmentId: string) => void;
  deleteAppointment: (appointmentId: string) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  startDraggingAppointment: (appointment: Appointment) => void;
  stopDraggingAppointment: () => void;
  setPotentialTimeSlot: (timeSlot: { date: Date; hour: number } | null) => void;
  applyAIRecommendation: (recommendationId: string) => void;
  dismissAIRecommendation: (recommendationId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  setShowConflictModal: (show: boolean) => void;
  
  // Helper data
  dateRange: {
    start: Date;
    end: Date;
  };
  scheduleConflicts: { appointmentId: string; conflictingWith: string[] }[];
  unreadNotificationsCount: number;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core calendar state
  const [activeView, setActiveView] = useState<ViewType>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(mockRecommendations);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [draggingAppointment, setDraggingAppointment] = useState<Appointment | null>(null);
  const [potentialTimeSlot, setPotentialTimeSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [scheduleConflicts, setScheduleConflicts] = useState<{ appointmentId: string; conflictingWith: string[] }[]>([]);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);

  // Use our notification context
  const { addNotification } = useNotifications();

  // Compute the date range based on the active view
  const dateRange = getDateRangeForView(activeView, selectedDate);
  
  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Effect to check for scheduling conflicts
  useEffect(() => {
    const conflicts: { appointmentId: string; conflictingWith: string[] }[] = [];
    
    appointments.forEach(appointment => {
      if (appointment.status === 'cancelled') return; // Skip cancelled appointments
      
      const conflictingAppointments = appointments.filter(other => 
        other.status !== 'cancelled' && // Skip cancelled appointments
        appointment.id !== other.id && 
        hasScheduleConflict(appointment, other)
      );
      
      if (conflictingAppointments.length > 0) {
        conflicts.push({
          appointmentId: appointment.id,
          conflictingWith: conflictingAppointments.map(a => a.id)
        });
      }
    });
    
    setScheduleConflicts(conflicts);
    
    // Auto-show conflict modal when conflicts are detected
    if (conflicts.length > 0 && !showConflictModal) {
      // Only show automatically for new conflicts, not existing ones
      const isNewConflict = conflicts.some(conflict => 
        !scheduleConflicts.some(oldConflict => 
          oldConflict.appointmentId === conflict.appointmentId
        )
      );
      
      if (isNewConflict) {
        setShowConflictModal(true);
      }
    }
  }, [appointments]);

  // Calendar navigation methods
  const goToNextDate = useCallback(() => {
    setSelectedDate(prevDate => getNextDate(activeView, prevDate));
  }, [activeView]);

  const goToPreviousDate = useCallback(() => {
    setSelectedDate(prevDate => getPreviousDate(activeView, prevDate));
  }, [activeView]);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  // Appointment management methods
  const addAppointment = useCallback((appointment: Appointment) => {
    // Ensure appointment has an ID
    const newAppointment = appointment.id ? appointment : { ...appointment, id: uuidv4() };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    // Add a notification for the new appointment
    const newNotification: Notification = {
      id: uuidv4(),
      title: 'New Appointment Created',
      message: `Appointment for ${appointment.patientName} on ${
        appointment.startTime.toLocaleDateString()
      } at ${appointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} has been scheduled.`,
      timestamp: new Date(),
      read: false,
      priority: 'normal',
      type: 'appointment'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also add to global notifications if available
    if (addNotification) {
      addNotification({
        id: newNotification.id,
        title: newNotification.title,
        message: newNotification.message,
        timestamp: newNotification.timestamp,
        read: newNotification.read,
        priority: 'normal',
        type: 'appointment',
        relatedItemId: newAppointment.id,
        actionUrl: `/doctor/calendar?appointmentId=${newAppointment.id}`
      });
    }
  }, [addNotification]);

  const updateAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev => prev.map(app => 
      app.id === appointment.id ? appointment : app
    ));
  }, []);

  const cancelAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId ? { ...app, status: 'cancelled' } : app
    ));
    
    // Add a notification for the cancelled appointment
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      const newNotification: Notification = {
        id: uuidv4(),
        title: 'Appointment Cancelled',
        message: `Appointment for ${appointment.patientName} on ${
          appointment.startTime.toLocaleDateString()
        } has been cancelled.`,
        timestamp: new Date(),
        read: false,
        priority: 'important',
        type: 'appointment'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Also add to global notifications if available
      if (addNotification) {
        addNotification({
          id: newNotification.id,
          title: newNotification.title,
          message: newNotification.message,
          timestamp: newNotification.timestamp,
          read: newNotification.read,
          priority: 'important',
          type: 'appointment',
          relatedItemId: appointment.id,
          actionUrl: `/doctor/calendar?appointmentId=${appointment.id}`
        });
      }
    }
  }, [appointments, addNotification]);

  const deleteAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
  }, []);

  // Drag and drop methods
  const startDraggingAppointment = useCallback((appointment: Appointment) => {
    setDraggingAppointment(appointment);
  }, []);

  const stopDraggingAppointment = useCallback(() => {
    setDraggingAppointment(null);
    setPotentialTimeSlot(null);
  }, []);

  // AI recommendation methods
  const applyAIRecommendation = useCallback((recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    
    if (recommendation) {
      // Mark as applied
      setRecommendations(prev => prev.map(r => 
        r.id === recommendationId ? { ...r, applied: true } : r
      ));
      
      // For scheduling recommendations, update the appointment
      if (recommendation.type === 'scheduling' && 
          recommendation.relatedAppointmentId && 
          recommendation.suggestedTime) {
        
        const appointment = appointments.find(a => a.id === recommendation.relatedAppointmentId);
        
        if (appointment) {
          const duration = appointment.duration;
          const newStartTime = recommendation.suggestedTime;
          const newEndTime = new Date(newStartTime);
          newEndTime.setMinutes(newEndTime.getMinutes() + duration);
          
          updateAppointment({
            ...appointment,
            startTime: newStartTime,
            endTime: newEndTime
          });
        }
      }
    }
  }, [appointments, recommendations, updateAppointment]);

  const dismissAIRecommendation = useCallback((recommendationId: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
  }, []);
  
  // Notification methods
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);
  
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const value = {
    activeView,
    selectedDate,
    appointments,
    recommendations,
    notifications,
    selectedAppointment,
    draggingAppointment,
    potentialTimeSlot,
    showConflictModal,
    setActiveView,
    setSelectedDate,
    goToNextDate,
    goToPreviousDate,
    goToToday,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    setSelectedAppointment,
    startDraggingAppointment,
    stopDraggingAppointment,
    setPotentialTimeSlot,
    applyAIRecommendation,
    dismissAIRecommendation,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setShowConflictModal,
    dateRange,
    scheduleConflicts,
    unreadNotificationsCount,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};