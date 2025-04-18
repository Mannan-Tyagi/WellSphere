"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Shield, 
  Bell, 
  Calendar, 
  FileText, 
  Pill, 
  AlertTriangle, 
  Syringe, 
  Activity, 
  Heart,
  Settings,
  MoreHorizontal,
  Edit,
  UserPlus,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import FamilyMemberCard from './components/FamilyMemberCard';
import FamilyActionsSidebar from './components/FamilyActionsSidebar';
import EmergencyContactPanel from './components/EmergencyContactPanel';
import SharedHealthRecord from './components/SharedHealthRecord';
import VaccinationSchedule from './components/VaccinationSchedule';
import HereditaryConditionsAnalysis from './components/HereditaryConditionsAnalysis';

// Sample family data
const familyMembersData = [
  {
    id: 1,
    name: 'John Smith',
    relationship: 'Self',
    age: 35,
    gender: 'Male',
    photo: null,
    color: '#006D77',
    isPrimary: true,
    healthStatus: 'good',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    upcomingAppointments: [
      { 
        id: 'apt-1', 
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
        provider: 'Dr. Emily Chen',
        type: 'Follow-up'
      }
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', schedule: 'Twice daily' },
      { name: 'Lisinopril', dosage: '10mg', schedule: 'Once daily' }
    ],
    alerts: [
      { type: 'medication', message: 'Refill Lisinopril in 5 days', severity: 'medium' }
    ],
    lastCheckup: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    accessLevel: 'owner'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    relationship: 'Spouse',
    age: 33,
    gender: 'Female',
    photo: null,
    color: '#2A9D8F',
    isPrimary: false,
    healthStatus: 'excellent',
    conditions: [],
    upcomingAppointments: [
      { 
        id: 'apt-2', 
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
        provider: 'Dr. Robert Williams',
        type: 'Annual Physical'
      }
    ],
    medications: [],
    alerts: [],
    lastCheckup: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    accessLevel: 'full'
  },
  {
    id: 3,
    name: 'Emma Smith',
    relationship: 'Daughter',
    age: 8,
    gender: 'Female',
    photo: null,
    color: '#E9C46A',
    isPrimary: false,
    healthStatus: 'good',
    conditions: ['Seasonal Allergies'],
    upcomingAppointments: [
      {
        id: 'apt-3',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        provider: 'Dr. Lisa Johnson',
        type: 'Pediatric Checkup'
      }
    ],
    medications: [
      { name: 'Cetirizine', dosage: '5mg', schedule: 'Once daily (seasonal)' }
    ],
    alerts: [
      { type: 'vaccination', message: 'Due for flu shot', severity: 'medium' }
    ],
    lastCheckup: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    accessLevel: 'guardian'
  },
  {
    id: 4,
    name: 'Robert Smith',
    relationship: 'Father',
    age: 65,
    gender: 'Male',
    photo: null,
    color: '#F4A261',
    isPrimary: false,
    healthStatus: 'fair',
    conditions: ['Hypertension', 'Arthritis', 'High Cholesterol'],
    upcomingAppointments: [
      {
        id: 'apt-4',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        provider: 'Dr. Michael Brown',
        type: 'Cardiology Follow-up'
      }
    ],
    medications: [
      { name: 'Atorvastatin', dosage: '20mg', schedule: 'Once daily' },
      { name: 'Amlodipine', dosage: '5mg', schedule: 'Once daily' },
      { name: 'Acetaminophen', dosage: '500mg', schedule: 'As needed for pain' }
    ],
    alerts: [
      { type: 'appointment', message: 'Cardiology appointment in 5 days', severity: 'high' }
    ],
    lastCheckup: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    accessLevel: 'limited'
  }
];

// Emergency contact data
const emergencyContactsData = [
  {
    id: 1,
    name: 'Jennifer Williams',
    relationship: 'Sister',
    phone: '(555) 123-4567',
    email: 'jennifer.williams@example.com',
    address: '123 Maple St, Anytown, USA',
    isPrimary: true,
    canMakeDecisions: true
  },
  {
    id: 2,
    name: 'Michael Smith',
    relationship: 'Brother',
    phone: '(555) 987-6543',
    email: 'michael.smith@example.com',
    address: '456 Oak Ave, Somewhere, USA',
    isPrimary: false,
    canMakeDecisions: false
  }
];

export default function FamilyHealthHubPage() {
  const [familyMembers, setFamilyMembers] = useState(familyMembersData);
  const [emergencyContacts, setEmergencyContacts] = useState(emergencyContactsData);
  const [selectedTab, setSelectedTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelationship, setFilterRelationship] = useState('all');
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [showActionSidebar, setShowActionSidebar] = useState(false);

  // Filter family members based on search and relationship filter
  const filteredFamilyMembers = familyMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRelationship = filterRelationship === 'all' || 
                                member.relationship.toLowerCase() === filterRelationship.toLowerCase();
    
    return matchesSearch && matchesRelationship;
  });

  // Get color classes based on health status
  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'fair':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get color classes based on alert severity
  const getAlertSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date for easier reading
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle selecting a family member
  const handleMemberSelect = (memberId: number) => {
    const isSelected = selectedMember === memberId;
    setSelectedMember(isSelected ? null : memberId);
    setShowActionSidebar(!isSelected);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">Family Health Hub</h1>
          <p className="text-gray-600 mt-1">
            Manage healthcare for your entire family in one place
          </p>
        </div>

        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          <Link href="/patient/family/add-member">
            <Button className="bg-[#006D77] hover:bg-[#005a66]">
              <UserPlus size={16} className="mr-2" />
              Add Family Member
            </Button>
          </Link>
          <Button variant="outline" className="border-[#006D77] text-[#006D77]">
            <Settings size={16} className="mr-2" />
            Access Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="shared">Shared Records</TabsTrigger>
              <TabsTrigger value="hereditary">Analytics</TabsTrigger>
            </TabsList>

            {/* Family Members Tab */}
            <TabsContent value="members" className="space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 mb-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search family members..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="h-9" onClick={() => setFilterRelationship('all')}>
                    <Filter className="mr-2 h-4 w-4" />
                    {filterRelationship === 'all' ? 'All' : filterRelationship}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFamilyMembers.map(member => (
                  <FamilyMemberCard
                    key={member.id}
                    member={member}
                    isSelected={selectedMember === member.id}
                    onClick={() => handleMemberSelect(member.id)}
                    onAction={() => setShowActionSidebar(true)}
                    getHealthStatusColor={getHealthStatusColor}
                    formatDate={formatDate}
                  />
                ))}

                {/* Add family member card */}
                <Link href="/patient/family/add-member" className="block">
                  <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[220px] hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-[#F0F9FA] rounded-full flex items-center justify-center mb-3">
                      <UserPlus className="h-6 w-6 text-[#006D77]" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Add Family Member</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Add a family member to manage their health
                    </p>
                  </div>
                </Link>
              </div>
            </TabsContent>

            {/* Emergency Contacts Tab */}
            <TabsContent value="emergency" className="mt-4">
              <EmergencyContactPanel 
                emergencyContacts={emergencyContacts} 
                setEmergencyContacts={setEmergencyContacts} 
              />
            </TabsContent>

            {/* Shared Health Records Tab */}
            <TabsContent value="shared" className="mt-4">
              <SharedHealthRecord familyMembers={familyMembers} />
            </TabsContent>

            {/* Hereditary Conditions Analytics Tab */}
            <TabsContent value="hereditary" className="mt-4">
              <HereditaryConditionsAnalysis familyMembers={familyMembers} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar: Action Panel when a family member is selected */}
        <div className="lg:col-span-1">
          {selectedMember && showActionSidebar ? (
            <FamilyActionsSidebar 
              member={familyMembers.find(m => m.id === selectedMember)!} 
              onClose={() => {
                setShowActionSidebar(false);
                setSelectedMember(null);
              }}
            />
          ) : (
            <Card>
              <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
                <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                  <Activity className="mr-2 h-5 w-5" />
                  Family Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Health Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 rounded-md p-3 border">
                        <div className="text-2xl font-bold text-[#006D77]">{familyMembers.length}</div>
                        <div className="text-sm text-gray-500">Family members</div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3 border">
                        <div className="text-2xl font-bold text-amber-600">2</div>
                        <div className="text-sm text-gray-500">Need attention</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-1 text-[#006D77]" />
                      Upcoming Appointments
                    </h3>
                    <div className="space-y-2">
                      {familyMembers.flatMap(member => 
                        member.upcomingAppointments.map(appointment => (
                          <div 
                            key={appointment.id} 
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-600">
                                {appointment.type} • {formatDate(appointment.date)}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <Pill className="h-4 w-4 mr-1 text-[#006D77]" />
                      Medication Summary
                    </h3>
                    <div className="space-y-2">
                      {familyMembers.flatMap(member => 
                        member.medications.map((medication, idx) => (
                          <div 
                            key={`${member.id}-med-${idx}`} 
                            className="p-2 border rounded-md flex justify-between"
                          >
                            <div>
                              <div className="font-medium">{medication.name} {medication.dosage}</div>
                              <div className="text-xs">
                                <span className="text-gray-600">{member.name}</span> • 
                                <span className="ml-1">{medication.schedule}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="h-fit">Active</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 mr-1 text-[#006D77]" />
                      Health Alerts
                    </h3>
                    <div className="space-y-2">
                      {familyMembers.flatMap(member => 
                        member.alerts.map((alert, idx) => (
                          <div 
                            key={`${member.id}-alert-${idx}`}
                            className={`p-2 rounded-md border ${getAlertSeverityColor(alert.severity)}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm">{alert.message}</div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Action</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <VaccinationSchedule familyMembers={familyMembers} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
