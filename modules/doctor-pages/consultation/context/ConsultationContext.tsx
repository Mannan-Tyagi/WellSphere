/**
 * ConsultationContext.tsx
 * This context provider facilitates communication between all components in the consultation module.
 * It provides shared state and functions to ensure seamless integration and synchronization.
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { offlineManager, OfflineConsultation, ConnectionStatus, useOfflineStatus } from '../services/OfflineService';
import { AIDocumentationTemplate } from '../services/AIService';

// Define the shape of our consultation data
export interface ConsultationData {
  id: string;
  patientId: string;
  doctorId: string;
  status: 'Waiting' | 'In Progress' | 'Completed';
  startTime: Date;
  duration: number;
  documentation: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  aiSuggestions: {
    diagnoses: any[];
    treatments: any[];
    billingCodes: any[];
    showSuggestions: boolean;
  };
  voiceRecording: {
    isRecording: boolean;
    transcription: string;
  };
  lastSaved?: Date;
  syncStatus?: 'synced' | 'pending' | 'failed';
}

// Define the context type
interface ConsultationContextType {
  consultation: ConsultationData;
  updateConsultation: (data: Partial<ConsultationData>) => void;
  updateDocumentation: (section: keyof ConsultationData['documentation'], content: string) => void;
  saveConsultation: () => Promise<void>;
  isOnline: boolean;
  connectionStatus: ConnectionStatus;
  pendingSyncs: boolean;
  syncData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create the context with a default value
const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

// Default consultation data
const defaultConsultation: ConsultationData = {
  id: `consultation-${Date.now()}`,
  patientId: 'patient-123', // Mock patient ID
  doctorId: 'doctor-123', // Mock doctor ID
  status: 'In Progress',
  startTime: new Date(),
  duration: 0,
  documentation: {
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  },
  aiSuggestions: {
    diagnoses: [],
    treatments: [],
    billingCodes: [],
    showSuggestions: false
  },
  voiceRecording: {
    isRecording: false,
    transcription: ''
  }
};

// Provider component
export function ConsultationProvider({ children, initialData }: { children: ReactNode, initialData?: Partial<ConsultationData> }) {
  const [consultation, setConsultation] = useState<ConsultationData>({
    ...defaultConsultation,
    ...initialData
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use the offline status hook
  const { isOnline, connectionStatus, pendingSyncs, syncData } = useOfflineStatus();
  
  // Update timer for consultation duration
  useEffect(() => {
    if (consultation.status === 'In Progress') {
      const timer = setInterval(() => {
        const now = new Date();
        const durationInSeconds = Math.floor((now.getTime() - consultation.startTime.getTime()) / 1000);
        setConsultation(prev => ({ ...prev, duration: durationInSeconds }));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [consultation.status, consultation.startTime]);
  
  // Function to update consultation data
  const updateConsultation = (data: Partial<ConsultationData>) => {
    setConsultation(prev => ({
      ...prev,
      ...data,
      lastSaved: new Date()
    }));
  };
  
  // Function to update a specific documentation section
  const updateDocumentation = (section: keyof ConsultationData['documentation'], content: string) => {
    setConsultation(prev => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        [section]: content
      },
      lastSaved: new Date()
    }));
  };
  
  // Function to save consultation data (locally and to server when online)
  const saveConsultation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert to offline consultation format
      const offlineConsultation: OfflineConsultation = {
        id: consultation.id,
        patientId: consultation.patientId,
        doctorId: consultation.doctorId,
        startTime: consultation.startTime,
        endTime: consultation.status === 'Completed' ? new Date() : undefined,
        status: consultation.status === 'Completed' ? 'completed' : 'draft',
        documentation: {
          subjective: consultation.documentation.subjective,
          objective: consultation.documentation.objective,
          assessment: consultation.documentation.assessment,
          plan: consultation.documentation.plan
        },
        billingCodes: consultation.aiSuggestions.billingCodes.map(code => ({
          code: code.code,
          description: code.description
        })),
        lastModified: new Date(),
        syncStatus: isOnline ? 'synced' : 'pending',
        syncError: undefined
      };
      
      // Save to offline manager
      await offlineManager.saveConsultation(offlineConsultation);
      
      // Update the consultation with sync status
      setConsultation(prev => ({
        ...prev,
        lastSaved: new Date(),
        syncStatus: isOnline ? 'synced' : 'pending'
      }));
      
      console.log('Consultation saved successfully');
    } catch (err) {
      console.error('Error saving consultation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error saving consultation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value: ConsultationContextType = {
    consultation,
    updateConsultation,
    updateDocumentation,
    saveConsultation,
    isOnline,
    connectionStatus,
    pendingSyncs,
    syncData,
    isLoading,
    error
  };
  
  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
}

// Custom hook to use the consultation context
export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
}