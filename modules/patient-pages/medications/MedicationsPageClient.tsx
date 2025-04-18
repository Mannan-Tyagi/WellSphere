"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Pill, 
  Search, 
  Camera, 
  CalendarClock, 
  ShoppingCart, 
  Plus, 
  Settings, 
  Bell, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  BarChart2,
  Store,
  Smartphone,
  Eye,
  ArrowRight,
  Calendar,
  CalendarCheck,
  CircleCheck,
  MapPin
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import MedicationTracker from '@/modules/patient-pages/dashboard/MedicationTracker';
import PillIdentificationAR from './PillIdentificationAR';
import PharmacyIntegration from './PharmacyIntegration';

export default function MedicationsPageClient() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScanModal, setShowScanModal] = useState(false);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  
  // Mock medication data
  const medications = [
    {
      id: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeOfDay: ['Morning', 'Evening'],
      withFood: true,
      adherence: 92,
      refillBy: '2025-04-10',
      refillReminder: true,
      notes: 'Take with food to minimize GI upset',
      priority: 'high',
      status: 'active',
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 2), // In 2 hours
      prescribedBy: 'Dr. Emily Chen',
      pharmacy: 'QuickCare Pharmacy',
      prescriptionDetails: {
        dosage: '500mg',
        quantity: 60,
        refills: 2
      }
    },
    {
      id: 2,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      timeOfDay: ['Morning'],
      withFood: false,
      adherence: 85,
      refillBy: '2025-03-28',
      refillReminder: true,
      notes: 'For blood pressure control',
      priority: 'high',
      status: 'active',
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 18), // Tomorrow morning
      prescribedBy: 'Dr. Emily Chen',
      pharmacy: 'City Drugs',
      prescriptionDetails: {
        dosage: '10mg',
        quantity: 30,
        refills: 3
      }
    },
    {
      id: 3,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Once daily',
      timeOfDay: ['Morning'],
      withFood: true,
      adherence: 78,
      refillBy: '2025-05-15',
      refillReminder: false,
      notes: 'Supplement for deficiency',
      priority: 'medium',
      status: 'active',
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 18), // Tomorrow morning
      prescribedBy: 'Dr. Emily Chen',
      pharmacy: 'QuickCare Pharmacy',
      prescriptionDetails: {
        dosage: '1000 IU',
        quantity: 90,
        refills: 1
      }
    }
  ];
  
  // Weekly adherence stats for visualization
  const weeklyAdherence = [
    { day: 'Mon', onTime: 2, missed: 0, total: 2 },
    { day: 'Tue', onTime: 1, missed: 1, total: 2 },
    { day: 'Wed', onTime: 2, missed: 0, total: 2 },
    { day: 'Thu', onTime: 2, missed: 0, total: 2 },
    { day: 'Fri', onTime: 1, missed: 1, total: 2 },
    { day: 'Sat', onTime: 2, missed: 0, total: 2 },
    { day: 'Sun', onTime: 2, missed: 0, total: 2 },
  ];
  
  const overallAdherence = Math.round(
    weeklyAdherence.reduce((acc, day) => acc + day.onTime, 0) / 
    weeklyAdherence.reduce((acc, day) => acc + day.total, 0) * 100
  );
  
  // Smart reminders state
  const [reminderSettings, setReminderSettings] = useState({
    frequency: 'medium',
    quietHours: { start: '22:00', end: '07:00' },
    adaptiveReminders: true
  });
  
  // Handle medication selection for refill
  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
    setShowPharmacyModal(true);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">Medication Management</h1>
          <p className="text-gray-600 mt-1">Track, schedule, and refill your medications</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
            <DialogTrigger asChild>
              <Button className="bg-[#006D77] hover:bg-[#00585F]">
                <Camera size={16} className="mr-2" />
                Scan Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Scan Prescription or Medication</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <PillIdentificationAR onClose={() => setShowScanModal(false)} />
              </div>
            </DialogContent>
          </Dialog>
          
          <Link href="/patient/medications/add">
            <Button variant="outline" className="border-[#006D77] text-[#006D77]">
              <Plus size={16} className="mr-2" />
              Add Medication
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="refills">Refills</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          {/* Medication Tracker Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Use the prescription-styled medication tracker */}
              <MedicationTracker />
            </div>
            
            <div className="space-y-6">
              {/* Weekly Adherence Card - prescription styled */}
              <Card className="border-[#E8F3F4]">
                <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
                  <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                    <CalendarClock className="mr-2 h-5 w-5" />
                    Weekly Adherence
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-white border-l-4 border-l-green-300 shadow-inner p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">Overall: {overallAdherence}%</span>
                      <Badge className={
                        overallAdherence >= 90 ? "bg-green-100 text-green-800 border-green-200" :
                        overallAdherence >= 75 ? "bg-amber-100 text-amber-800 border-amber-200" :
                        "bg-rose-100 text-rose-800 border-rose-200"
                      }>
                        {overallAdherence >= 90 ? "Excellent" :
                         overallAdherence >= 75 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weeklyAdherence.map((day, i) => (
                        <div key={i} className="text-center">
                          <div className="text-xs text-gray-500">{day.day}</div>
                          <div className="mt-1 relative">
                            <div className="h-20 bg-gray-100 rounded-md relative overflow-hidden">
                              {day.total > 0 && (
                                <>
                                  <div 
                                    className="absolute bottom-0 w-full bg-green-500"
                                    style={{ 
                                      height: `${(day.onTime / day.total) * 100}%`,
                                    }}
                                  />
                                  {day.missed > 0 && (
                                    <div 
                                      className="absolute bottom-0 w-full bg-amber-500"
                                      style={{ 
                                        height: `${(day.missed / day.total) * 100}%`,
                                        top: `${(day.onTime / day.total) * 100}%`
                                      }}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                            
                            <div className="mt-1 text-xs">
                              {day.onTime}/{day.total}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 text-xs mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                        <span>On Time</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded-sm mr-1"></div>
                        <span>Missed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* AR Tutorial Card */}
              <Card className="border-[#E8F3F4]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                    <Smartphone className="mr-2 h-5 w-5" />
                    AR Medication Assistance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-[#F0F9FA] rounded-lg">
                      <h3 className="font-medium text-[#006D77] mb-1">Pill Identification</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Use your camera to identify pills and verify your medications.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full justify-center"
                        onClick={() => setShowScanModal(true)}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Scan Medication
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-[#F0F9FA] rounded-lg">
                      <h3 className="font-medium text-[#006D77] mb-1">Dosage Demonstration</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Get AR guidance on how to take your medications properly.
                      </p>
                      <Button variant="outline" className="w-full justify-center">
                        <Eye className="h-4 w-4 mr-1" />
                        View Demonstrations
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* AI Insights Card */}
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <BarChart2 className="mr-2 h-5 w-5" />
                AI Medication Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                  <h3 className="flex items-center font-medium text-blue-800 mb-2">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Adherence Prediction
                  </h3>
                  <p className="text-sm text-blue-600 mb-3">
                    Based on your patterns, AI predicts your adherence will improve to 94% if you set reminders 
                    for evening medications.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Optimize Reminders
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                  <h3 className="flex items-center font-medium text-amber-800 mb-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Interaction Alert
                  </h3>
                  <p className="text-sm text-amber-600 mb-3">
                    Lisinopril may interact with certain high-potassium foods like bananas and avocados.
                    Monitor your intake.
                  </p>
                  <Button size="sm" variant="outline" className="text-amber-800 border-amber-300 bg-white">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          {/* Schedule view styled like prescription pad */}
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Calendar className="mr-2 h-5 w-5" />
                Medication Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white border-l-4 border-l-amber-300 shadow-inner p-4">
                {/* Today's medicines */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Today's Medications</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">Morning</h4>
                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">7:00 AM - 9:00 AM</Badge>
                          </div>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center">
                              <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Metformin 500mg</div>
                                <div className="text-sm text-gray-600">Take with breakfast</div>
                              </div>
                              <Badge className="ml-auto bg-green-100 text-green-800">
                                <CheckCircle size={12} className="mr-1" />
                                Taken 7:45 AM
                              </Badge>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Lisinopril 10mg</div>
                                <div className="text-sm text-gray-600">Take with or without food</div>
                              </div>
                              <Badge className="ml-auto bg-green-100 text-green-800">
                                <CheckCircle size={12} className="mr-1" />
                                Taken 7:45 AM
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">Evening</h4>
                            <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">6:00 PM - 8:00 PM</Badge>
                          </div>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center">
                              <div className="w-1 h-6 bg-amber-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Metformin 500mg</div>
                                <div className="text-sm text-gray-600">Take with dinner</div>
                              </div>
                              <Button size="sm" className="ml-auto h-7 bg-[#006D77] hover:bg-[#00585F]">
                                <CircleCheck size={12} className="mr-1" />
                                Mark as Taken
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tomorrow's medicines */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Tomorrow</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Morning</h4>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center">
                              <div className="w-1 h-6 bg-gray-300 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Metformin 500mg</div>
                                <div className="text-sm text-gray-600">Take with breakfast</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="w-1 h-6 bg-gray-300 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Lisinopril 10mg</div>
                                <div className="text-sm text-gray-600">Take with or without food</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="w-1 h-6 bg-gray-300 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Vitamin D 1000 IU</div>
                                <div className="text-sm text-gray-600">Take with breakfast</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Evening</h4>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center">
                              <div className="w-1 h-6 bg-gray-300 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Metformin 500mg</div>
                                <div className="text-sm text-gray-600">Take with dinner</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="refills" className="space-y-6">
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Prescription Refills
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Medications needing refills soon */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Refill Soon</h3>
                  
                  <div className="space-y-3">
                    {medications
                      .filter(med => {
                        const refillDate = new Date(med.refillBy);
                        const today = new Date();
                        const diffTime = refillDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays <= 7;
                      })
                      .map(medication => (
                        <div 
                          key={medication.id}
                          className="p-3 border rounded-md bg-amber-50 border-amber-100"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
                              <div className="text-sm text-gray-600">
                                Refill by {new Date(medication.refillBy).toLocaleDateString()}
                              </div>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span className="flex items-center mr-3">
                                  <Store size={12} className="mr-1" />
                                  {medication.pharmacy}
                                </span>
                                <span className="flex items-center">
                                  <Calendar size={12} className="mr-1" />
                                  {medication.prescriptionDetails.refills} refills remaining
                                </span>
                              </div>
                            </div>
                            
                            <Button 
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                              size="sm"
                              onClick={() => handleMedicationSelect(medication)}
                            >
                              <ShoppingCart size={14} className="mr-1" />
                              Refill Now
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                    
                    {medications.filter(med => {
                      const refillDate = new Date(med.refillBy);
                      const today = new Date();
                      const diffTime = refillDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length === 0 && (
                      <div className="p-6 text-center border rounded-md bg-gray-50">
                        <p className="text-gray-500">No medications need refilling soon</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* All active medications */}
                <div>
                  <h3 className="text-sm font-medium mb-3">All Active Prescriptions</h3>
                  
                  <div className="space-y-3">
                    {medications
                      .filter(med => med.status === 'active')
                      .map(medication => (
                        <div 
                          key={medication.id}
                          className="p-3 border rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
                              <div className="text-sm text-gray-600">
                                {medication.frequency} • Prescribed by {medication.prescribedBy}
                              </div>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span className="flex items-center mr-3">
                                  <Store size={12} className="mr-1" />
                                  {medication.pharmacy}
                                </span>
                                <span className="flex items-center">
                                  <Calendar size={12} className="mr-1" />
                                  Refill by {new Date(medication.refillBy).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleMedicationSelect(medication)}
                            >
                              <ShoppingCart size={14} className="mr-1" />
                              Refill
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Pharmacy finder card */}
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Store className="mr-2 h-5 w-5" />
                Nearby Pharmacies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="p-3 bg-[#F0F9FA] rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                  View nearby pharmacies, compare prices, and request automatic refills.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">QuickCare Pharmacy</h3>
                  <p className="text-sm text-gray-600">0.8 km away • Open until 9 PM</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Delivery Available</Badge>
                </div>
                
                <div className="flex-1 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">City Drugs</h3>
                  <p className="text-sm text-gray-600">1.2 km away • Open until 8 PM</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Best Prices</Badge>
                </div>
              </div>
              
              <Button className="w-full mt-4">
                <MapPin size={14} className="mr-1" />
                Find More Pharmacies
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Bell className="mr-2 h-5 w-5" />
                Smart Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <h3 className="flex items-center font-medium text-blue-800 mb-1">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    AI-Powered Reminder System
                  </h3>
                  <p className="text-sm text-blue-600">
                    Our system analyzes your patterns to optimize reminder frequency and prevent alert fatigue.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequency" className="text-sm font-medium">Reminder Frequency</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className={reminderSettings.frequency === 'low' ? 'bg-[#F0F9FA] border-[#006D77] text-[#006D77]' : ''}
                        onClick={() => setReminderSettings({...reminderSettings, frequency: 'low'})}
                      >
                        Minimal
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        className={reminderSettings.frequency === 'medium' ? 'bg-[#F0F9FA] border-[#006D77] text-[#006D77]' : ''}
                        onClick={() => setReminderSettings({...reminderSettings, frequency: 'medium'})}
                      >
                        Standard
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        className={reminderSettings.frequency === 'high' ? 'bg-[#F0F9FA] border-[#006D77] text-[#006D77]' : ''}
                        onClick={() => setReminderSettings({...reminderSettings, frequency: 'high'})}
                      >
                        Frequent
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quietStart" className="text-sm font-medium">Quiet Hours Start</Label>
                      <Input 
                        id="quietStart" 
                        type="time" 
                        value={reminderSettings.quietHours.start}
                        onChange={(e) => setReminderSettings({
                          ...reminderSettings, 
                          quietHours: {...reminderSettings.quietHours, start: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quietEnd" className="text-sm font-medium">Quiet Hours End</Label>
                      <Input 
                        id="quietEnd" 
                        type="time"
                        value={reminderSettings.quietHours.end}
                        onChange={(e) => setReminderSettings({
                          ...reminderSettings, 
                          quietHours: {...reminderSettings.quietHours, end: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="adaptiveReminders" 
                      className="rounded border-gray-300"
                      checked={reminderSettings.adaptiveReminders}
                      onChange={(e) => setReminderSettings({
                        ...reminderSettings,
                        adaptiveReminders: e.target.checked
                      })}
                    />
                    <Label htmlFor="adaptiveReminders" className="text-sm font-medium cursor-pointer">
                      Use AI to adjust reminder frequency based on my behavior
                    </Label>
                  </div>
                </div>
                
                <Alert className="bg-[#F0F9FA] border-[#E8F3F4]">
                  <AlertCircle className="h-4 w-4 text-[#006D77]" />
                  <AlertTitle className="text-[#006D77] text-sm font-medium">Reminder Adaptation Active</AlertTitle>
                  <AlertDescription className="text-sm text-gray-600">
                    Your reminders will automatically adjust based on your adherence patterns to prevent alert fatigue.
                  </AlertDescription>
                </Alert>
                
                <Button className="w-full bg-[#006D77] hover:bg-[#00585F]">
                  Save Reminder Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Settings className="mr-2 h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="refillAlert" className="text-sm font-medium">Refill Alert Threshold</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Button type="button" variant="outline" className="bg-[#F0F9FA] border-[#006D77] text-[#006D77]">
                      3 Days
                    </Button>
                    <Button type="button" variant="outline">
                      5 Days
                    </Button>
                    <Button type="button" variant="outline">
                      7 Days
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="defaultPharmacy" className="text-sm font-medium">Default Pharmacy</Label>
                  <select 
                    id="defaultPharmacy" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  >
                    <option value="quickcare">QuickCare Pharmacy</option>
                    <option value="citydrugs">City Drugs</option>
                    <option value="superhealth">SuperHealth Pharmacy</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="preferGeneric" 
                    className="rounded border-gray-300"
                    defaultChecked={true}
                  />
                  <Label htmlFor="preferGeneric" className="text-sm font-medium cursor-pointer">
                    Use generic medications when available
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="autoRefill" 
                    className="rounded border-gray-300"
                    defaultChecked={true}
                  />
                  <Label htmlFor="autoRefill" className="text-sm font-medium cursor-pointer">
                    Enable automatic refill requests
                  </Label>
                </div>
                
                <Button className="w-full bg-[#006D77] hover:bg-[#00585F]">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Pharmacy Integration Modal */}
      <Dialog open={showPharmacyModal} onOpenChange={setShowPharmacyModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pharmacy Options for {selectedMedication?.name}</DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <PharmacyIntegration
              medicationId={selectedMedication.id.toString()}
              medicationName={`${selectedMedication.name} ${selectedMedication.dosage}`}
              prescriptionDetails={selectedMedication.prescriptionDetails}
              onRequestRefill={() => setShowPharmacyModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
