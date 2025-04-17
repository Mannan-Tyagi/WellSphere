import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Pill, ChevronRight, Clock, AlertCircle, Check, PlusCircle, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MedicationTracker = () => {
  const [activeTab, setActiveTab] = useState('current');
  
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
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 2) // In 2 hours
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
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 18) // Tomorrow morning
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
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 18) // Tomorrow morning
    },
    {
      id: 4,
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      timeOfDay: ['Morning', 'Afternoon', 'Evening'],
      withFood: true,
      adherence: 100,
      refillBy: '2025-03-30',
      refillReminder: false,
      notes: 'Finish entire course of antibiotics',
      priority: 'high',
      status: 'completed',
      nextDose: null
    }
  ];
  
  // Filter medications based on active tab
  const filteredMedications = medications.filter(med => {
    if (activeTab === 'current') return med.status === 'active';
    if (activeTab === 'completed') return med.status === 'completed';
    return true; // all tab
  });
  
  // Filter meds that need a refill soon (within 7 days)
  const refillSoonMeds = medications.filter(med => {
    const refillDate = new Date(med.refillBy);
    const today = new Date();
    const diffTime = refillDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && med.status === 'active';
  });
  
  // Helper function to get time until next dose
  const getTimeUntilNextDose = (nextDose) => {
    if (!nextDose) return null;
    
    const now = new Date();
    const diffMs = nextDose.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Now';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    } else {
      return `${diffMins}m`;
    }
  };
  
  // Helper function to get adherence color
  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return 'bg-emerald-500';
    if (adherence >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  
  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Pill className="mr-2 h-5 w-5" />
          Medication Tracker
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 bg-[#F0F9FA] text-[#006D77] border-[#006D77]">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </Button>
          <Link href="/patient/medications" className="text-sm text-[#006D77] hover:underline flex items-center">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            {refillSoonMeds.length > 0 && (
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <h3 className="font-medium flex items-center text-amber-800">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Medications Needing Refill Soon
                </h3>
                <ul className="mt-2 space-y-1">
                  {refillSoonMeds.map(med => (
                    <li key={med.id} className="text-sm flex justify-between">
                      <span>{med.name} ({med.dosage})</span>
                      <span className="font-medium">Refill by {new Date(med.refillBy).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
                <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 h-7">
                  Request Refills
                </Button>
              </div>
            )}
            
            {filteredMedications.map((medication) => (
              <div 
                key={medication.id} 
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{medication.name}</h3>
                    <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                  </div>
                  {medication.nextDose && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-[#006D77] mr-1" />
                      <span className="text-sm font-medium">
                        Next: {getTimeUntilNextDose(medication.nextDose)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Adherence</span>
                    <span>{medication.adherence}%</span>
                  </div>
                  <Progress 
                    value={medication.adherence} 
                    className="h-2" 
                    indicatorClassName={getAdherenceColor(medication.adherence)} 
                  />
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {medication.withFood && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Take with food
                    </Badge>
                  )}
                  {medication.priority === 'high' && (
                    <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200">
                      High priority
                    </Badge>
                  )}
                  {medication.refillReminder && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      <Bell className="h-3 w-3 mr-1" />
                      Refill reminder on
                    </Badge>
                  )}
                </div>
                
                {medication.notes && (
                  <p className="mt-2 text-xs text-gray-500 italic">{medication.notes}</p>
                )}
                
                {medication.nextDose && medication.nextDose.getTime() - new Date().getTime() < 1000 * 60 * 60 && (
                  <Button 
                    className="mt-3 w-full justify-center bg-[#006D77] hover:bg-[#00585F]"
                    size="sm"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark as Taken
                  </Button>
                )}
              </div>
            ))}
            
            {filteredMedications.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p>No current medications</p>
                <Link href="/patient/medications/add" className="text-sm text-[#006D77] hover:underline mt-2 inline-block">
                  Add a medication
                </Link>
              </div>
            )}
          </TabsContent>
          
          {/* Additional tabs content with similar structure */}
          <TabsContent value="all" className="space-y-4">
            {/* Similar structure to the "current" tab */}
            {medications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No medications found</p>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Showing all {medications.length} medications
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {/* Similar structure to the "current" tab */}
            {filteredMedications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No completed medications</p>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Showing {filteredMedications.length} completed medications
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
