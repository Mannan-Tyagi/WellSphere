import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Pill, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Check, 
  PlusCircle, 
  Bell, 
  Camera, 
  Store, 
  AlarmClock,
  ShoppingCart,
  AlertOctagon,
  BarChart2,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { checkMedicationInteractions } from '@/lib/medication-services';

const MedicationTracker = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [showInteractionWarning, setShowInteractionWarning] = useState(false);
  const [interactionDetails, setInteractionDetails] = useState(null);
  const [reminderSensitivity, setReminderSensitivity] = useState("medium");
  
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

  // Check for interactions when component mounts
  useEffect(() => {
    const activeMeds = medications
      .filter(med => med.status === 'active')
      .map(med => med.name);
      
    // Only check when we have multiple medications
    if (activeMeds.length > 1) {
      const checkInteractions = async () => {
        try {
          const interactions = await checkMedicationInteractions(activeMeds);
          if (interactions && interactions.length > 0) {
            setInteractionDetails(interactions[0]);
            setShowInteractionWarning(true);
          }
        } catch (error) {
          console.error("Failed to check medication interactions:", error);
        }
      };
      
      checkInteractions();
    }
  }, []);

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
  
  // Helper function to get AI adherence prediction
  const getAdherencePrediction = (medication) => {
    // Simple prediction based on past adherence and reminder sensitivity
    const baseAdherence = medication.adherence;
    
    // Adjust based on reminder sensitivity (simulating AI prediction)
    if (reminderSensitivity === "low" && baseAdherence < 90) {
      return baseAdherence - 5; // Predict decrease if sensitivity is low
    } else if (reminderSensitivity === "high" && baseAdherence < 95) {
      return baseAdherence + 5; // Predict increase if sensitivity is high
    }
    
    return baseAdherence;
  };
  
  // Detect if user is experiencing alert fatigue
  const detectAlertFatigue = () => {
    // Count medications with reminders
    const medsWithReminders = medications.filter(med => med.refillReminder).length;
    
    // Simulate AI detecting alert fatigue based on number of reminders
    if (medsWithReminders >= 3) {
      return "high";
    } else if (medsWithReminders >= 2) {
      return "medium";
    }
    return "low";
  };
  
  const alertFatigue = detectAlertFatigue();
  
  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-[#F0F9FA] border-b">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Pill className="mr-2 h-5 w-5" />
          Medication Tracker
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 bg-white text-[#006D77] border-[#006D77]">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </Button>
          <Link href="/patient/medications" className="text-sm text-[#006D77] hover:underline flex items-center">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Prescription pad styling wrapper */}
        <div className="bg-white border-l-4 border-l-amber-300 shadow-inner p-4">
          {/* AI Alert fatigue banner */}
          {alertFatigue !== "low" && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <h3 className="text-sm font-medium flex items-center text-blue-700">
                <BarChart2 className="h-4 w-4 mr-2" />
                AI Insight: Reminder Adjustment Recommended
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                Our AI detected potential alert fatigue from multiple medication reminders.
                Consider {alertFatigue === "high" ? "reducing frequency" : "consolidating"} reminders.
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-xs">
                  Optimize Reminders
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Dismiss
                </Button>
              </div>
            </div>
          )}
          
          {/* Interaction warning */}
          {showInteractionWarning && interactionDetails && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="text-sm font-medium flex items-center text-amber-800">
                <AlertOctagon className="h-4 w-4 mr-2" />
                Potential Medication Interaction Detected
              </h3>
              <p className="text-xs text-amber-700 mt-1">
                {interactionDetails.description}
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="h-7 bg-amber-600 hover:bg-amber-700 text-xs">
                  Learn More
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" 
                  onClick={() => setShowInteractionWarning(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}
          
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
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 h-7">
                      Request Refills
                    </Button>
                    <Button size="sm" variant="outline" className="mt-2 h-7 bg-white">
                      <Store className="h-3 w-3 mr-1" />
                      Find Nearby Pharmacies
                    </Button>
                  </div>
                </div>
              )}
              
              {filteredMedications.map((medication) => (
                <div 
                  key={medication.id} 
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors relative"
                >
                  {/* Prescription-style header */}
                  <div className="flex justify-between items-start border-b pb-2 mb-2">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {medication.name}
                        {medication.priority === 'high' && (
                          <span className="ml-2 w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                    </div>
                    
                    {/* Next dose badge */}
                    {medication.nextDose && (
                      <Badge className={
                        new Date().getTime() > medication.nextDose.getTime() 
                          ? "bg-amber-100 text-amber-800 border-amber-200" 
                          : "bg-[#E8F3F4] text-[#006D77] border-[#006D77]"
                      }>
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeUntilNextDose(medication.nextDose)}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Adherence tracking */}
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-500">Adherence</span>
                        
                        {/* AI Prediction popover */}
                        <Popover>
                          <PopoverTrigger>
                            <div className="cursor-help flex items-center">
                              <BarChart2 size={12} className="text-[#006D77]" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm flex items-center">
                                <BarChart2 className="h-4 w-4 mr-1 text-[#006D77]" />
                                AI Adherence Prediction
                              </h4>
                              <p className="text-xs text-gray-600">
                                Based on your past patterns, our AI predicts your adherence will be 
                                <span className="font-medium"> {getAdherencePrediction(medication)}%</span> for this medication.
                              </p>
                              <div className="pt-2 mt-2 border-t text-xs">
                                <p className="text-gray-500">
                                  Factors affecting this prediction:
                                </p>
                                <ul className="mt-1 space-y-1 text-gray-600">
                                  <li>• Time of day: {medication.timeOfDay.join(", ")}</li>
                                  <li>• Reminder sensitivity: {reminderSensitivity}</li>
                                  <li>• Past adherence patterns</li>
                                </ul>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <span>{medication.adherence}%</span>
                    </div>
                    
                    <Progress 
                      value={medication.adherence} 
                      className="h-2" 
                      indicatorClassName={getAdherenceColor(medication.adherence)} 
                    />
                  </div>
                  
                  {/* Pill identification, AR demonstration */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link href={`/patient/medications/identify/${medication.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        Identify Pill
                      </Button>
                    </Link>
                    
                    <Link href={`/patient/medications/ar-demo/${medication.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        AR Demonstration
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {medication.withFood && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Take with food
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
                  
                  {/* Take medication button */}
                  {medication.nextDose && medication.nextDose.getTime() - new Date().getTime() < 1000 * 60 * 60 && (
                    <Button 
                      className="mt-3 w-full justify-center bg-[#006D77] hover:bg-[#00585F]"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark as Taken
                    </Button>
                  )}
                  
                  {/* Auto-refill options */}
                  {new Date(medication.refillBy).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 7 && (
                    <div className="mt-3 border-t pt-3">
                      <h4 className="text-xs font-medium">Refill Options</h4>
                      <Link href={`/patient/medications/refill/${medication.id}`}>
                        <Button 
                          className="mt-2 w-full justify-center"
                          size="sm"
                          variant="outline"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Compare Prices & Refill
                        </Button>
                      </Link>
                    </div>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
