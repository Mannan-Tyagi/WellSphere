"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define types for medical records
export interface MedicalRecord {
  id: string | number;
  title: string;
  date: Date;
  type: string;
  provider: string;
  content: string;
  attachments?: string[];
  status: 'active' | 'archived';
  sharedWith?: string[];
  expiresAt?: Date;
}

export interface Medication {
  id: string | number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  instructions: string;
  status: 'active' | 'completed' | 'discontinued';
  refillsRemaining?: number;
}

interface MedicalRecordsContextType {
  records: MedicalRecord[];
  medications: Medication[];
  addRecord: (record: MedicalRecord) => void;
  updateRecord: (id: string | number, updatedData: Partial<MedicalRecord>) => void;
  deleteRecord: (id: string | number) => void;
  addMedication: (medication: Medication) => void;
  updateMedication: (id: string | number, updatedData: Partial<Medication>) => void;
  deleteMedication: (id: string | number) => void;
  generateRecordsQR: (duration: string) => string;
  navigateToRecordDetails: (id: string | number) => void;
  loadingRecords: boolean;
}

// Create the context
const MedicalRecordsContext = createContext<MedicalRecordsContextType | undefined>(undefined);

// Create a provider component
export const MedicalRecordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const router = useRouter();

  // Fetch medical records and medications on component mount
  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        // In a real app, this would be API calls
        const storedRecords = localStorage.getItem('medicalRecords');
        const storedMedications = localStorage.getItem('medications');
        
        if (storedRecords) {
          const parsedRecords = JSON.parse(storedRecords, (key, value) => {
            if (key === 'date' || key === 'expiresAt') {
              return new Date(value);
            }
            return value;
          });
          setRecords(parsedRecords);
        }
        
        if (storedMedications) {
          const parsedMedications = JSON.parse(storedMedications, (key, value) => {
            if (key === 'startDate' || key === 'endDate') {
              return new Date(value);
            }
            return value;
          });
          setMedications(parsedMedications);
        }
      } catch (error) {
        console.error('Failed to fetch medical data:', error);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchMedicalData();
    
    // Setup event listeners for real-time updates
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('medical_records_updated', handleMedicalRecordsEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('medical_records_updated', handleMedicalRecordsEvent as EventListener);
    };
  }, []);

  // Handle storage change for cross-tab synchronization
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'medicalRecords' && event.newValue) {
      const updatedRecords = JSON.parse(event.newValue, (key, value) => {
        if (key === 'date' || key === 'expiresAt') {
          return new Date(value);
        }
        return value;
      });
      setRecords(updatedRecords);
    }
    
    if (event.key === 'medications' && event.newValue) {
      const updatedMedications = JSON.parse(event.newValue, (key, value) => {
        if (key === 'startDate' || key === 'endDate') {
          return new Date(value);
        }
        return value;
      });
      setMedications(updatedMedications);
    }
  };

  // Handle custom medical records events
  const handleMedicalRecordsEvent = (event: CustomEvent) => {
    if (event.detail) {
      if (event.detail.records) {
        setRecords(event.detail.records);
      }
      if (event.detail.medications) {
        setMedications(event.detail.medications);
      }
    }
  };

  // Persist data to localStorage
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('medicalRecords', JSON.stringify(records));
      
      // Dispatch a custom event
      const event = new CustomEvent('medical_records_updated', { 
        detail: { records } 
      });
      window.dispatchEvent(event);
    }
  }, [records]);

  useEffect(() => {
    if (medications.length > 0) {
      localStorage.setItem('medications', JSON.stringify(medications));
      
      // Dispatch a custom event
      const event = new CustomEvent('medical_records_updated', { 
        detail: { medications } 
      });
      window.dispatchEvent(event);
    }
  }, [medications]);

  // Records CRUD operations
  const addRecord = (record: MedicalRecord) => {
    const newRecord = {
      ...record,
      id: typeof record.id !== 'undefined' ? record.id : Date.now().toString()
    };
    setRecords(prev => [...prev, newRecord]);
  };

  const updateRecord = (id: string | number, updatedData: Partial<MedicalRecord>) => {
    setRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, ...updatedData } : record
      )
    );
  };

  const deleteRecord = (id: string | number) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  // Medications CRUD operations
  const addMedication = (medication: Medication) => {
    const newMedication = {
      ...medication,
      id: typeof medication.id !== 'undefined' ? medication.id : Date.now().toString()
    };
    setMedications(prev => [...prev, newMedication]);
  };

  const updateMedication = (id: string | number, updatedData: Partial<Medication>) => {
    setMedications(prev => 
      prev.map(medication => 
        medication.id === id ? { ...medication, ...updatedData } : medication
      )
    );
  };

  const deleteMedication = (id: string | number) => {
    setMedications(prev => prev.filter(medication => medication.id !== id));
  };

  // QR code generation for medical records sharing
  const generateRecordsQR = (duration: string) => {
    // In a real app, this would generate a secure, time-limited access token
    const expiration = new Date();
    switch (duration) {
      case '24hr': 
        expiration.setHours(expiration.getHours() + 24);
        break;
      case '7days':
        expiration.setDate(expiration.getDate() + 7);
        break;
      case '30days':
        expiration.setDate(expiration.getDate() + 30);
        break;
      default:
        expiration.setHours(expiration.getHours() + 24);
    }
    
    // This would typically return a URL or token
    // For demo purposes, we'll just return a placeholder
    return `medical-records-access-token-expires-${expiration.toISOString()}`;
  };

  // Navigation helper
  const navigateToRecordDetails = (id: string | number) => {
    sessionStorage.setItem('selectedRecordId', id.toString());
    router.push(`/patient/medical-records/${id}`);
  };

  // Context value
  const value = {
    records,
    medications,
    addRecord,
    updateRecord,
    deleteRecord,
    addMedication,
    updateMedication,
    deleteMedication,
    generateRecordsQR,
    navigateToRecordDetails,
    loadingRecords
  };

  return (
    <MedicalRecordsContext.Provider value={value}>
      {children}
    </MedicalRecordsContext.Provider>
  );
};

// Custom hook to use the medical records context
export const useMedicalRecords = () => {
  const context = useContext(MedicalRecordsContext);
  if (context === undefined) {
    throw new Error('useMedicalRecords must be used within a MedicalRecordsProvider');
  }
  return context;
};
