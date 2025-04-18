"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  X, 
  Calendar, 
  Pill, 
  FileText, 
  Syringe, 
  Bell, 
  Settings, 
  ChevronRight, 
  UserCog, 
  Clock, 
  Share2,
  Edit,
  UserPlus,
  CalendarPlus,
  PlusCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Medication {
  name: string;
  dosage: string;
  schedule: string;
}

interface Appointment {
  id: string;
  date: Date;
  provider: string;
  type: string;
}

interface Alert {
  type: string;
  message: string;
  severity: string;
}

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  photo: string | null;
  color: string;
  isPrimary: boolean;
  healthStatus: string;
  conditions: string[];
  upcomingAppointments: Appointment[];
  medications: Medication[];
  alerts: Alert[];
  lastCheckup: Date;
  accessLevel: string;
}

interface FamilyActionsSidebarProps {
  member: FamilyMember;
  onClose: () => void;
}

const FamilyActionsSidebar: React.FC<FamilyActionsSidebarProps> = ({ member, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get avatar initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Format date for easier reading
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };
  
  // Get access level display
  const getAccessLevelDisplay = (level: string) => {
    switch (level) {
      case 'owner':
        return 'Full (Account Owner)';
      case 'full':
        return 'Full Access';
      case 'guardian':
        return 'Guardian Access';
      case 'limited':
        return 'Limited Access';
      default:
        return 'Custom Access';
    }
  };

  return (
    <Card className="border-t-4 border-t-[#006D77]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-[#F0F9FA] border-b">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <UserCog className="mr-2 h-5 w-5" />
          Manage Family Member
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b flex items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: member.color }}>
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              getInitials(member.name)
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{member.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{member.relationship}</span>
              <span>•</span>
              <span>{member.age} years old</span>
              <span>•</span>
              <span>{member.gender}</span>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-0 bg-transparent h-auto">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:text-[#006D77] data-[state=active]:border-b-2 data-[state=active]:border-[#006D77] data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-10"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              className="data-[state=active]:text-[#006D77] data-[state=active]:border-b-2 data-[state=active]:border-[#006D77] data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-10"
            >
              Health
            </TabsTrigger>
            <TabsTrigger 
              value="permissions" 
              className="data-[state=active]:text-[#006D77] data-[state=active]:border-b-2 data-[state=active]:border-[#006D77] data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-10"
            >
              Permissions
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="pt-4 px-4 pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-[#006D77] hover:bg-[#005a66] h-auto py-3 justify-start">
                <CalendarPlus size={16} className="mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="border-[#006D77] text-[#006D77] h-auto py-3 justify-start">
                <PlusCircle size={16} className="mr-2" />
                Add Medication
              </Button>
            </div>
            
            {member.alerts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Bell className="h-4 w-4 mr-1 text-amber-600" />
                  Health Alerts
                </h3>
                {member.alerts.map((alert, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-md ${
                      alert.severity === 'high' ? 'bg-red-50 border border-red-100' : 
                      alert.severity === 'medium' ? 'bg-amber-50 border border-amber-100' : 
                      'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`text-sm ${
                          alert.severity === 'high' ? 'text-red-700' : 
                          alert.severity === 'medium' ? 'text-amber-700' : 
                          'text-blue-700'
                        }`}>
                          {alert.message}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-3">
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-1 text-[#006D77]" />
                Upcoming Appointments
              </h3>
              {member.upcomingAppointments.length > 0 ? (
                <div className="space-y-2">
                  {member.upcomingAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className="p-3 border rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{appointment.type}</div>
                          <div className="text-sm text-gray-600">
                            {appointment.provider} • {formatDate(appointment.date)}
                          </div>
                        </div>
                        <Badge>Scheduled</Badge>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="outline" size="sm" className="mr-2">Reschedule</Button>
                        <Button size="sm" className="bg-[#006D77] hover:bg-[#005a66]">Prepare</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border text-center">
                  <p className="text-sm text-gray-500">No upcoming appointments</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule Now
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Pill className="h-4 w-4 mr-1 text-[#006D77]" />
                Medications
              </h3>
              {member.medications.length > 0 ? (
                <div className="space-y-2">
                  {member.medications.map((medication, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 border rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{medication.name} {medication.dosage}</div>
                          <div className="text-sm text-gray-600">{medication.schedule}</div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      
                      <div className="mt-2 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-gray-500">Refill</Button>
                        <Button variant="ghost" size="sm" className="text-gray-500">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border text-center">
                  <p className="text-sm text-gray-500">No medications</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Pill className="h-4 w-4 mr-1" />
                    Add Medication
                  </Button>
                </div>
              )}
            </div>
            
            <Link href={`/patient/family/${member.id}/profile`} className="block">
              <Button 
                variant="outline" 
                className="w-full justify-between border-[#006D77] text-[#006D77]"
              >
                <span>View Complete Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </TabsContent>
          
          {/* Health Tab */}
          <TabsContent value="health" className="pt-4 px-4 pb-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Health Conditions</h3>
              {member.conditions.length > 0 ? (
                <div className="space-y-2">
                  {member.conditions.map((condition, idx) => (
                    <div key={idx} className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{condition}</div>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-1 w-full justify-center">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Condition
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border text-center">
                  <p className="text-sm text-gray-500">No health conditions</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Condition
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Vaccination Status</h3>
              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">Overall Vaccination Status</div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Up to Date</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Childhood Vaccinations</span>
                      <span className="font-medium text-emerald-600">100%</span>
                    </div>
                    <Progress value={100} className="h-2 bg-gray-100" indicatorClassName="bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Seasonal Vaccinations</span>
                      <span className="font-medium text-amber-600">50%</span>
                    </div>
                    <Progress value={50} className="h-2 bg-gray-100" indicatorClassName="bg-amber-500" />
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Button size="sm" className="bg-[#006D77] hover:bg-[#005a66]">
                    <Syringe className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Health Records</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Recent Records</div>
                      <div className="text-sm text-gray-600">Last updated: {formatDate(member.lastCheckup)}</div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Allergies & Reactions</div>
                      <div className="text-sm text-gray-600">
                        {member.conditions.some(c => c === 'Seasonal Allergies') ? 'Has allergies' : 'No known allergies'}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Link href={`/patient/family/${member.id}/health-records`} className="block">
              <Button 
                variant="outline" 
                className="w-full justify-between border-[#006D77] text-[#006D77]"
              >
                <span>Complete Health Records</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </TabsContent>
          
          {/* Permissions Tab */}
          <TabsContent value="permissions" className="pt-4 px-4 pb-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Access Level</h3>
              <div className="p-3 bg-[#F0F9FA] rounded-md border border-[#E8F3F4]">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium flex items-center">
                      {getAccessLevelDisplay(member.accessLevel)}
                      {member.accessLevel === 'owner' && (
                        <Badge className="ml-2 bg-[#006D77] text-white">Primary</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {member.accessLevel === 'owner' && "Full access to all family health records and management"}
                      {member.accessLevel === 'full' && "Can view and manage all health records"}
                      {member.accessLevel === 'guardian' && "Parent/guardian access to dependent's records"}
                      {member.accessLevel === 'limited' && "Limited access to specific health information"}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="border-[#006D77] text-[#006D77]">
                    <Edit className="h-4 w-4 mr-1" />
                    Modify
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Permission Details</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Appointment Management</div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Allowed
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Can schedule, view, and manage appointments
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Medication Management</div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Allowed
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Can view and manage medications
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Health Records Access</div>
                    {member.accessLevel === 'limited' ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Limited
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Full Access
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {member.accessLevel === 'limited' 
                      ? "Can view only specific health information"
                      : "Can view all health records and test results"
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Sharing Settings</h3>
              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Shared With Healthcare Providers</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {member.relationship === 'Self' 
                        ? "Your data is being shared with 2 providers"
                        : `${member.name}'s data is being shared with 1 provider`
                      }
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-between border-[#006D77] text-[#006D77]"
            >
              <span>Advanced Permission Settings</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FamilyActionsSidebar;
