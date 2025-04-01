"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, AlertTriangle, ChevronDown, ChevronUp, PauseCircle, StopCircle, FlaskConical, Wifi, WifiOff } from 'lucide-react';
import { useConsultation } from '../context/ConsultationContext';

type ConsultationStatus = 'Waiting' | 'In Progress' | 'Completed';


type PatientInfo = {
  name: string;
  age: number;
  gender: string;
  profileImage: string;
  visitReason: string;
  appointmentType: string;
  alerts: Array<{ type: string; message: string }>;
};

// Mock patient data - in a real app, this would come from an API
const patientInfo: PatientInfo = {
  name: "Sarah Johnson",
  age: 42,
  gender: "Female",
  profileImage: "/patient-avatar.jpg", // Placeholder
  visitReason: "Persistent headaches and fatigue",
  appointmentType: "Follow-up",
  alerts: [
    { type: "allergy", message: "Penicillin allergy" },
    { type: "hospitalization", message: "Recent hospitalization (3 months ago)" },
  ],
};

export function EncounterHeader() {
  const [historyExpanded, setHistoryExpanded] = React.useState(false);
  const { consultation, updateConsultation, isOnline, connectionStatus, pendingSyncs, syncData } = useConsultation();
  
  // Format the consultation duration
  const formatDuration = (durationInSeconds: number) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle consultation status changes
  const handleEndVisit = () => {
    updateConsultation({ status: 'Completed' });
  };
  
  const handlePauseVisit = () => {
    // Toggle between paused and in progress
    const newStatus = consultation.status === 'In Progress' ? 'Waiting' : 'In Progress';
    updateConsultation({ status: newStatus });
  };
  
  // Handle manual sync
  const handleSync = async () => {
    if (isOnline && pendingSyncs) {
      await syncData();
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case 'Waiting': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'In Progress': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Completed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      default: return '';
    }
  };
  
  // Get connection status color
  const getConnectionStatusColor = () => {
    if (isOnline) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Patient Summary Card */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {/* Patient Avatar */}
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
              {/* Placeholder for patient image */}
              <span className="text-xl font-medium">{patientInfo.name.charAt(0)}</span>
            </div>
            
            {/* Patient Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-xl font-medium">{patientInfo.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{patientInfo.age} years</span>
                  <span>•</span>
                  <span>{patientInfo.gender}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="bg-[#F5F5F5] font-normal">
                    {patientInfo.appointmentType}
                  </Badge>
                  <Badge className="bg-[#006D77] hover:bg-[#006D77]/90 text-white font-normal">
                    {patientInfo.visitReason}
                  </Badge>
                </div>
              </div>
              
              {/* Alerts */}
              <div className="mt-3 space-y-1">
                {patientInfo.alerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-1 text-sm text-amber-600">
                    <AlertTriangle size={14} />
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Collapsible Medical History */}
          <div className="mt-4">
            <button 
              onClick={() => setHistoryExpanded(!historyExpanded)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {historyExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {historyExpanded ? "Hide" : "Show"} full medical history
            </button>
            
            {historyExpanded && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                <h3 className="font-medium mb-2">Medical History</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hypertension (diagnosed 2018)</li>
                  <li>Migraine with aura</li>
                  <li>Appendectomy (2010)</li>
                </ul>
                
                <h3 className="font-medium mt-3 mb-2">Current Medications</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Lisinopril 10mg daily</li>
                  <li>Sumatriptan 50mg as needed</li>
                  <li>Multivitamin daily</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <Separator orientation="vertical" className="hidden md:block h-auto" />
        
        {/* Visit Controls */}
        <div className="flex flex-col justify-between min-w-[200px]">
          <div className="space-y-3">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-500" />
              <span className="text-lg font-medium">{formatDuration(consultation.duration)}</span>
            </div>
            
            {/* Status */}
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(consultation.status)}>
                {consultation.status}
              </Badge>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-1 text-sm">
                  <Wifi size={16} className={getConnectionStatusColor()} />
                  <span className="text-green-600">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm">
                  <WifiOff size={16} className={getConnectionStatusColor()} />
                  <span className="text-red-600">Offline</span>
                </div>
              )}
            </div>
            
            {/* Sync Status */}
            {pendingSyncs && (
              <div className="text-xs text-amber-600">
                Changes pending sync
                {isOnline && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 pl-1 text-xs text-blue-600"
                    onClick={handleSync}
                  >
                    Sync now
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={handlePauseVisit}
            >
              <PauseCircle size={16} />
              {consultation.status === 'In Progress' ? 'Pause Visit' : 'Resume Visit'}
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2"
            >
              <FlaskConical size={16} />
              Request Labs
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleEndVisit}
            >
              <StopCircle size={16} />
              End Visit
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}