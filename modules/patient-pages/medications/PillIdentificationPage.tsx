"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PillIdentificationAR from './PillIdentificationAR';

interface PillIdentificationPageProps {
  medicationId?: string;
}

export function PillIdentificationPage({ medicationId }: PillIdentificationPageProps) {
  const router = useRouter();

  const handleIdentified = (result: any) => {
    console.log('Medication identified:', result);
    // In a real app, you might save this identification result
  };

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
        <h1 className="text-2xl font-bold text-[#006D77]">Identify Medication</h1>
        <p className="text-gray-600 mt-1">
          Use your camera to scan and identify your medication
        </p>
      </div>

      <Card className="border-[#E8F3F4] max-w-xl mx-auto">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-semibold text-[#006D77]">
            Pill Identification Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <PillIdentificationAR 
            medicationId={medicationId} 
            onIdentified={handleIdentified}
            onClose={() => router.push('/patient/medications')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
