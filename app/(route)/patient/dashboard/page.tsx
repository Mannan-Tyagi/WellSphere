"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Pill, 
  FileText, 
  Users, 
  RefreshCw, 
  ArrowUpRight,
  Sliders 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import HealthSummaryWidget from '@/modules/patient-pages/dashboard/HealthSummaryWidget';
import AppointmentTimeline from '@/modules/patient-pages/dashboard/AppointmentTimeline';
import MedicationTracker from '@/modules/patient-pages/dashboard/MedicationTracker';
import HealthRiskAssessment from '@/modules/patient-pages/dashboard/HealthRiskAssessment';
import FamilyHealthOverview from '@/modules/patient-pages/dashboard/FamilyHealthOverview';
import PatientSidebar from '@/modules/patient-pages/PatientSidebar';
import QRCodeWidget from '@/modules/patient-pages/dashboard/QRCodeWidget';
import PatientNotifications from '@/modules/patient-pages/dashboard/PatientNotifications';

const PatientDashboard = () => {
  const [greeting, setGreeting] = useState('Good morning');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Patient info
  const patientInfo = {
    name: 'Diana Cooper',
    upcomingAppointments: 2,
    medications: 3,
    alerts: 1
  };

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Refresh dashboard data
  const refreshDashboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Welcome Banner */}
        {showWelcomeBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 rounded-lg bg-gradient-to-r from-[#006D77] to-[#249EA0] text-white shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-medium">{greeting}, {patientInfo.name}</h1>
                <p className="text-white/80 mt-1">Here's your health at a glance</p>
              </div>
              
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{patientInfo.upcomingAppointments}</p>
                  <p className="text-sm text-white/80">Appointments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{patientInfo.medications}</p>
                  <p className="text-sm text-white/80">Medications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{patientInfo.alerts}</p>
                  <p className="text-sm text-white/80">Alerts</p>
                </div>
                <button 
                  onClick={() => setShowWelcomeBanner(false)} 
                  className="absolute top-2 right-2 text-white/60 hover:text-white"
                  aria-label="Close welcome banner"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Dashboard Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">Patient Dashboard</h2>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={refreshDashboard}
              className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center"
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center">
                <Sliders size={16} className="mr-1" />
                <span>Customize</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  Hide Medication Tracker
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Hide Family Members
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Hide Risk Assessment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
        
        {/* Top Row - Quick Access Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <HealthSummaryWidget />
          <AppointmentTimeline />
          <QRCodeWidget />
        </div>
        
        {/* Middle Row - Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <MedicationTracker />
          </div>
          <HealthRiskAssessment />
        </div>
        
        {/* Bottom Row - Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FamilyHealthOverview />
          <PatientNotifications />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
