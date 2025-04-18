"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pill } from 'lucide-react';
import PharmacyIntegration from './PharmacyIntegration';

interface MedicationRefillPageProps {
  medicationId: string;
}

// Mock medication data - in a real app this would come from an API call
const getMedicationById = (id: string) => {
  const medications = [
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      prescriptionDetails: {
        dosage: '500mg',
        quantity: 60,
        refills: 2
      }
    },
    {
      id: '2',
      name: 'Lisinopril',
      dosage: '10mg',
      prescriptionDetails: {
        dosage: '10mg',
        quantity: 30,
        refills: 3
      }
    },
    {
      id: '3',
      name: 'Vitamin D',
      dosage: '1000 IU',
      prescriptionDetails: {
        dosage: '1000 IU',
        quantity: 90,
        refills: 1
      }
    }
  ];
  
  return medications.find(med => med.id === id);
};

export function MedicationRefillPage({ medicationId }: MedicationRefillPageProps) {
  const router = useRouter();
  const [medication, setMedication] = useState<any>(null);
  
  useEffect(() => {
    // Fetch medication details based on ID
    const med = getMedicationById(medicationId);
    setMedication(med);
  }, [medicationId]);
  
  const handleRefillRequested = (pharmacyId: string, useGeneric: boolean) => {
    console.log('Refill requested:', { medicationId, pharmacyId, useGeneric });
    // In a real app, you would submit this to your backend
    
    // Navigate back to the medications page
    setTimeout(() => {
      router.push('/patient/medications');
    }, 2000);
  };
  
  if (!medication) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading medication details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#006D77]">
          Refill {medication.name} {medication.dosage}
        </h1>
        <p className="text-gray-600 mt-1">
          Find the best pharmacy options and request a refill
        </p>
      </div>
      
      <PharmacyIntegration
        medicationId={medicationId}
        medicationName={`${medication.name} ${medication.dosage}`}
        prescriptionDetails={medication.prescriptionDetails}
        onRequestRefill={handleRefillRequested}
      />
    </div>
  );
}
