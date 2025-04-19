"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Bell, Search, ChevronRight
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

// Import widgets
import HealthSummaryWidget from "@/modules/patient-pages/dashboard/HealthSummaryWidget";
import AppointmentTimeline from "@/modules/patient-pages/dashboard/AppointmentTimeline";
import QRCodeWidget from "@/modules/patient-pages/dashboard/QRCodeWidget";
import MedicationTracker from "@/modules/patient-pages/dashboard/MedicationTracker";
// ...other imports...

export default function PatientDashboardPage() {
  const { setPageTitle } = useApp();
  
  // Mock patient data
  const patientInfo = {
    name: "John Smith",
    alerts: 3,
    appointments: {
      upcoming: 2,
      next: {
        doctor: "Dr. Sarah Johnson",
        type: "Check-up",
        date: "Tomorrow, 10:00 AM",
      },
    },
  };

  useEffect(() => {
    setPageTitle("Patient Dashboard");
  }, [setPageTitle]);

  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {patientInfo.name}</h1>
          <p className="text-gray-600 mt-1">Here's a summary of your health information</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button variant="default" className="bg-[#006D77] hover:bg-[#00585F]">
            <Bell size={16} className="mr-1" />
            <span className="mr-1">Notifications</span>
            {patientInfo.alerts > 0 && (
              <span className="bg-white text-[#006D77] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {patientInfo.alerts}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {/* Dashboard Widgets */}
      {/* ...widget grid code... */}
    </>
  );
}
