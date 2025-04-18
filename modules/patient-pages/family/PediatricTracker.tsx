import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, CheckCircle, Clock, ChartPie, ChevronLeft, Ruler, 
  Calendar, Syringe 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PediatricTracker = ({ immunizationData, childData, developmentalMilestones }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('immunizations');
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 text-gray-500" 
          onClick={() => router.back()}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[#006D77]">Pediatric Health Tracker</h1>
      </div>
      
      {/* Child info card */}
      <Card className="bg-[#F0F9FA] border-[#E8F3F4] mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Avatar className="h-16 w-16 border-2 border-[#006D77]">
              <AvatarImage src={childData.avatar} alt={childData.name} />
              <AvatarFallback className="bg-[#E8F3F4] text-[#006D77] text-xl">
                {childData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#006D77]">{childData.name}</h2>
                  <p className="text-gray-600">
                    {childData.age} years old • Born {new Date(childData.birthDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                  <Badge className="bg-[#E8F3F4] text-[#006D77] border-[#006D77]">
                    {childData.gender === 'female' ? 'Female' : 'Male'}
                  </Badge>
                  
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Calendar size={12} className="mr-1" />
                    Next Checkup: {new Date(childData.nextCheckup).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main tracker tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
          <TabsTrigger value="milestones">Developmental Milestones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="immunizations">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-[#006D77]">
                <Syringe className="mr-2 h-5 w-5" />
                Immunization Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-6">
                {immunizationData.upcoming.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Upcoming Immunizations</h3>
                    <div className="space-y-2">
                      {immunizationData.upcoming.map((vaccine, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-amber-50 hover:bg-amber-100 rounded-md">
                          <div>
                            <p className="font-medium">{vaccine.name}</p>
                            <p className="text-xs text-gray-600">
                              Recommended at {vaccine.recommendedAge} • Due: {new Date(vaccine.nextDue).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            Due {new Date(vaccine.nextDue).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center text-sm text-amber-700">
                        <MapPin size={14} className="mr-1" />
                        Nearest clinic: Community Pediatrics (0.8 miles)
                      </div>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Schedule All Due Vaccines
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Immunization status by vaccine */}
                <div>
                  <h3 className="font-medium mb-3">Complete Immunization Record</h3>
                  
                  <div className="space-y-3">
                    {/* Completed vaccines */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Completed Immunizations</h4>
                      <div className="space-y-2">
                        {immunizationData.completed.map((vaccine, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md">
                            <div>
                              <p className="font-medium">{vaccine.name}</p>
                              <p className="text-xs text-gray-600">
                                {vaccine.doses} {vaccine.doses === 1 ? 'dose' : 'doses'} • Last dose: {new Date(vaccine.lastDose).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle size={12} className="mr-1" />
                              Complete
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Due vaccines */}
                    {immunizationData.upcoming.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Due or Upcoming Immunizations</h4>
                        <div className="space-y-2">
                          {immunizationData.upcoming.map((vaccine, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-amber-50 hover:bg-amber-100 rounded-md">
                              <div>
                                <p className="font-medium">{vaccine.name}</p>
                                <p className="text-xs text-gray-600">
                                  Recommended at {vaccine.recommendedAge} • Due: {new Date(vaccine.nextDue).toLocaleDateString()}
                                </p>
                              </div>
                              <Button size="sm" className="h-7 bg-[#006D77] hover:bg-[#00585F]">
                                Schedule
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Immunization timeline visualization */}
                <div>
                  <h3 className="font-medium mb-3">Immunization Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4 pl-10 relative">
                      {[...immunizationData.completed, ...immunizationData.upcoming]
                        .sort((a, b) => {
                          const dateA = a.lastDose ? new Date(a.lastDose) : new Date(a.nextDue);
                          const dateB = b.lastDose ? new Date(b.lastDose) : new Date(b.nextDue);
                          return dateB.getTime() - dateA.getTime();
                        })
                        .map((vaccine, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-10 top-1">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                vaccine.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {vaccine.status === 'completed' 
                                  ? <CheckCircle size={14} />
                                  : <Clock size={14} />
                                }
                              </div>
                            </div>
                            <div className={`p-2 rounded-md ${
                              vaccine.status === 'completed' 
                                ? 'bg-green-50 border border-green-100' 
                                : 'bg-amber-50 border border-amber-100'
                            }`}>
                              <p className="font-medium">{vaccine.name}</p>
                              <p className="text-xs text-gray-600">
                                {vaccine.status === 'completed' 
                                  ? `Completed on ${new Date(vaccine.lastDose).toLocaleDateString()}` 
                                  : `Due by ${new Date(vaccine.nextDue).toLocaleDateString()}`
                                }
                              </p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-[#006D77]">
                <ChartPie className="mr-2 h-5 w-5" />
                Developmental Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-6">
                <div className="p-3 bg-[#F0F9FA] rounded-lg border border-[#E8F3F4] text-sm">
                  <p className="flex items-center text-[#006D77]">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Tracking developmental progress helps ensure your child is developing appropriately for their age.
                  </p>
                </div>
                
                {/* Current milestone progress */}
                <div>
                  <h3 className="font-medium mb-3">Current Age Milestones ({childData.age} years)</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    {developmentalMilestones
                      .filter(m => m.age === `${childData.age} years`)
                      .map((milestone, idx) => (
                        <div key={idx}>
                          <h4 className="font-medium mb-2">Expected milestones at {milestone.age}:</h4>
                          <ul className="space-y-2">
                            {milestone.milestones.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <div className={`mt-0.5 h-4 w-4 rounded-full flex-shrink-0 ${
                                  milestone.completed 
                                    ? 'bg-green-100 border border-green-500' 
                                    : 'bg-gray-100 border border-gray-300'
                                }`}>
                                  {milestone.completed && <CheckCircle size={12} className="text-green-600" />}
                                </div>
                                <span className="ml-2">{item}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {!milestone.completed && (
                            <Button 
                              className="mt-3 bg-[#006D77] hover:bg-[#00585F]"
                              size="sm"
                            >
                              Mark Milestones as Achieved
                            </Button>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* Milestone timeline */}
                <div>
                  <h3 className="font-medium mb-3">Developmental Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4 pl-10 relative">
                      {developmentalMilestones.map((milestone, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-10 top-1">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              milestone.completed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {milestone.completed 
                                ? <CheckCircle size={14} />
                                : <Clock size={14} />
                              }
                            </div>
                          </div>
                          <div className={`p-2 rounded-md ${
                            milestone.completed 
                              ? 'bg-green-50 border border-green-100' 
                              : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <p className="font-medium">{milestone.age}</p>
                            <div className="mt-1 space-y-1">
                              {milestone.milestones.map((item, i) => (
                                <p key={i} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-xs mr-1">•</span> {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PediatricTracker;