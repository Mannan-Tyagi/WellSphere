"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';

// Import components
import { EncounterHeader } from './components/EncounterHeader';
import { SmartDocumentationPanel } from './components/SmartDocumentationPanel';
import { EHRIntegrationPanel } from './components/EHRIntegrationPanel';
import { AIAssistantPanel } from './components/AIAssistantPanel';

// Import context provider
import { ConsultationProvider } from './context/ConsultationContext';

// Define the ConsultationPage component
export function ConsultationPage() {
  // Use media query for responsive design
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeTab, setActiveTab] = useState<string>("documentation");

  return (
    <ConsultationProvider>
      <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[1600px] mx-auto p-2 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl md:text-2xl font-medium text-gray-900">Clinical Consultation</h1>
          
          {/* Mobile tabs - only shown on small screens */}
          {!isDesktop && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="ehr">Records</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        {/* Encounter Header */}
        <EncounterHeader />
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Documentation (always visible on desktop, conditionally on mobile) */}
          {(isDesktop || activeTab === "documentation") && (
            <div className="lg:col-span-2">
              <SmartDocumentationPanel />
            </div>
          )}
          
          {/* Right Column - EHR and AI Assistant */}
          {isDesktop ? (
            <div className="space-y-4 md:space-y-6">
              <Tabs defaultValue="ehr" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ehr">Patient Records</TabsTrigger>
                  <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                </TabsList>
                <TabsContent value="ehr" className="mt-2">
                  <Card className="p-3 md:p-4">
                    <EHRIntegrationPanel />
                  </Card>
                </TabsContent>
                <TabsContent value="ai" className="mt-2">
                  <Card className="p-3 md:p-4">
                    <AIAssistantPanel />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <>
              {/* Mobile view for EHR */}
              {activeTab === "ehr" && (
                <div className="col-span-1">
                  <Card className="p-3">
                    <EHRIntegrationPanel />
                  </Card>
                </div>
              )}
              
              {/* Mobile view for AI Assistant */}
              {activeTab === "ai" && (
                <div className="col-span-1">
                  <Card className="p-3">
                    <AIAssistantPanel />
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ConsultationProvider>
  );
}