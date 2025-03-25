'use client';

import React, { useState, useEffect } from 'react';
import { CalendarProvider, useCalendar } from '@/modules/doctor-pages/calendar/CalendarContext';
import CalendarView from '@/modules/doctor-pages/calendar/CalendarView';
import { AppointmentDetailsPanel } from '@/modules/doctor-pages/calendar/AppointmentDetailsPanel';
import { AISchedulingAssistant } from '@/modules/doctor-pages/calendar/AISchedulingAssistant';
import { CalendarHeader } from '@/modules/doctor-pages/calendar/CalendarHeader';
import { LoadingCalendarSkeleton } from '@/modules/doctor-pages/calendar/LoadingCalendarSkeleton';
import { QuickActionButton } from '@/modules/doctor-pages/calendar/QuickActionButton';
import { ConflictResolutionModal } from '@/modules/doctor-pages/calendar/modals/ConflictResolutionModal';
import { NotificationsPanel } from '@/modules/doctor-pages/calendar/NotificationsPanel';

// Main calendar content component with access to context
const CalendarContent = () => {
  const { 
    scheduleConflicts, 
    setShowConflictModal, 
    showConflictModal,
    selectedAppointment,
    setSelectedAppointment
  } = useCalendar();
  
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Handle appointment selection
  useEffect(() => {
    if (selectedAppointment !== null) {
      setAppointmentDetailsOpen(true);
    }
  }, [selectedAppointment]);

  const toggleAppointmentDetails = () => {
    if (!appointmentDetailsOpen) {
      setAppointmentDetailsOpen(true);
      // Close other panels if opening this one
      setAiAssistantOpen(false);
      setNotificationsOpen(false);
    } else {
      setAppointmentDetailsOpen(false);
      setSelectedAppointment(null);
    }
  };

  const toggleAiAssistant = () => {
    if (!aiAssistantOpen) {
      setAiAssistantOpen(true);
      // Close other panels if opening this one
      setAppointmentDetailsOpen(false);
      setNotificationsOpen(false);
      setSelectedAppointment(null);
    } else {
      setAiAssistantOpen(false);
    }
  };

  const toggleNotifications = () => {
    if (!notificationsOpen) {
      setNotificationsOpen(true);
      // Close other panels if opening this one
      setAppointmentDetailsOpen(false);
      setAiAssistantOpen(false);
      setSelectedAppointment(null);
    } else {
      setNotificationsOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <CalendarHeader 
        onToggleAiAssistant={toggleAiAssistant}
        onToggleNotifications={toggleNotifications}
        aiAssistantOpen={aiAssistantOpen}
        notificationsOpen={notificationsOpen}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Calendar Area */}
        <div className={`flex-1 transition-all duration-300 ${
          appointmentDetailsOpen || aiAssistantOpen || notificationsOpen ? 'pr-80' : ''
        }`}>
          <CalendarView 
            onAppointmentClick={(appointment) => {
              setSelectedAppointment(appointment);
              setAppointmentDetailsOpen(true);
            }} 
          />
        </div>
        
        {/* Sliding Panels */}
        <AppointmentDetailsPanel 
          isOpen={appointmentDetailsOpen}
          onClose={() => {
            setAppointmentDetailsOpen(false);
            setSelectedAppointment(null);
          }}
        />
        
        <AISchedulingAssistant 
          isOpen={aiAssistantOpen}
          onClose={() => setAiAssistantOpen(false)}
        />
        
        <NotificationsPanel
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>
      
      {/* Floating Action Button */}
      <QuickActionButton />
      
      {/* Schedule Conflicts Modal */}
      <ConflictResolutionModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        conflicts={scheduleConflicts}
      />
    </div>
  );
};

// Main page component with loading state
export default function CalendarPage() {
  const [loading, setLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingCalendarSkeleton />;
  }

  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
}