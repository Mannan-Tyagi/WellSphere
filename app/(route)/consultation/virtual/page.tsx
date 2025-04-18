"use client";

import React, { useState } from 'react';
import { VirtualConsultationProvider } from '@/modules/consultation/context/VirtualConsultationContext';
import VirtualConsultationInterface from '@/modules/consultation/VirtualConsultationInterface';
import PreConsultationCheck from '@/modules/consultation/PreConsultationCheck';
import VirtualWaitingRoom from '@/modules/consultation/VirtualWaitingRoom';
import PostConsultationSummary from '@/modules/consultation/PostConsultationSummary';

// Consultation status types
type ConsultationStage = 'pre-check' | 'waiting-room' | 'consultation' | 'post-summary';

export default function VirtualConsultationPage() {
  const [consultationStage, setConsultationStage] = useState<ConsultationStage>('pre-check');

  return (
    <VirtualConsultationProvider>
      <div className="min-h-screen bg-gray-50">
        {consultationStage === 'pre-check' && (
          <PreConsultationCheck 
            onComplete={() => setConsultationStage('waiting-room')} 
          />
        )}

        {consultationStage === 'waiting-room' && (
          <VirtualWaitingRoom 
            onJoinConsultation={() => setConsultationStage('consultation')} 
          />
        )}

        {consultationStage === 'consultation' && (
          <VirtualConsultationInterface 
            onEndConsultation={() => setConsultationStage('post-summary')} 
          />
        )}

        {consultationStage === 'post-summary' && (
          <PostConsultationSummary />
        )}
      </div>
    </VirtualConsultationProvider>
  );
}
