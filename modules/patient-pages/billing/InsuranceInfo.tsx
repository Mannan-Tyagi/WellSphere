import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, SquareUser, PlusCircle, Phone, AlertCircle, 
  CheckCircle, Info, CreditCard, Ticket, Calendar, FileText, 
  Building, Search, Copy, FileQuestion, Globe, X, Share, Download
} from 'lucide-react';

// Define TypeScript interface for the insurancePlan prop
interface InsurancePlanProps {
  id?: string;
  planName?: string;
  provider?: string;
  memberID?: string;
  groupNumber?: string;
  primaryMember?: string;
  effectiveDate?: string;
  customerServicePhone?: string;
  dependents?: string[];
  deductible?: {
    individual?: number;
    family?: number;
    remaining?: number;
  };
  outOfPocketMax?: {
    individual?: number;
    family?: number;
    remaining?: number;
  };
}

// Default insurance plan data to use when prop is not provided
const defaultInsurancePlan: InsurancePlanProps = {
  id: 'default-plan',
  planName: 'BlueCross Health PPO',
  provider: 'BlueCross BlueShield',
  memberID: 'BC12345678',
  groupNumber: 'G9876543',
  primaryMember: 'Sarah Cooper',
  effectiveDate: '2025-01-01',
  customerServicePhone: '1-800-555-1234',
  dependents: ['John Cooper'],
  deductible: {
    individual: 1500,
    family: 3000,
    remaining: 750
  },
  outOfPocketMax: {
    individual: 4000,
    family: 8000,
    remaining: 2500
  }
};

const InsuranceInfo = ({ insurancePlan = defaultInsurancePlan }: { insurancePlan?: InsurancePlanProps }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Insurance Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-[#006D77] to-[#00585F] text-white rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">{insurancePlan.provider}</h3>
                    <p className="text-sm opacity-80">{insurancePlan.planName}</p>
                  </div>
                  <div className="bg-white text-[#006D77] rounded-full p-2">
                    <Building className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div>
                    <p className="text-xs opacity-80">Member ID</p>
                    <div className="flex items-center">
                      <p className="font-medium">{insurancePlan.memberID}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 text-white opacity-80 hover:opacity-100 hover:bg-white/10">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs opacity-80">Group Number</p>
                    <p className="font-medium">{insurancePlan.groupNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs opacity-80">Primary Member</p>
                    <p className="font-medium">{insurancePlan.primaryMember}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs opacity-80">Effective Date</p>
                    <p className="font-medium">{new Date(insurancePlan.effectiveDate || '').toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">Your digital insurance card is always available here. You can download or share it when needed for medical appointments.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Coins className="mr-2 h-5 w-5" />
                Coverage Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deductible">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="deductible">Deductible</TabsTrigger>
                  <TabsTrigger value="out-of-pocket">Out-of-Pocket</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="deductible" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <div>
                          <h4 className="font-medium">Individual Deductible</h4>
                          <p className="text-xs text-gray-500">Amount you pay before insurance helps with costs</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${insurancePlan.deductible?.remaining?.toFixed(2)} remaining</p>
                          <p className="text-xs text-gray-500">of ${insurancePlan.deductible?.individual?.toFixed(2)}</p>
                        </div>
                      </div>
                      <Progress 
                        value={((insurancePlan.deductible?.individual || 0) - (insurancePlan.deductible?.remaining || 0)) / (insurancePlan.deductible?.individual || 1) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div>
                          <h4 className="font-medium">Family Deductible</h4>
                          <p className="text-xs text-gray-500">Combined expenses for all family members</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${insurancePlan.deductible?.remaining?.toFixed(2)} remaining</p>
                          <p className="text-xs text-gray-500">of ${insurancePlan.deductible?.family?.toFixed(2)}</p>
                        </div>
                      </div>
                      <Progress 
                        value={((insurancePlan.deductible?.family || 0) - (insurancePlan.deductible?.remaining || 0)) / (insurancePlan.deductible?.family || 1) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Deductible Reset</h4>
                          <p className="text-sm">Your plan deductible resets on January 1, 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="out-of-pocket" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <div>
                          <h4 className="font-medium">Individual Out-of-Pocket Maximum</h4>
                          <p className="text-xs text-gray-500">Maximum you'll pay for covered services</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${insurancePlan.outOfPocketMax?.remaining?.toFixed(2)} remaining</p>
                          <p className="text-xs text-gray-500">of ${insurancePlan.outOfPocketMax?.individual?.toFixed(2)}</p>
                        </div>
                      </div>
                      <Progress 
                        value={((insurancePlan.outOfPocketMax?.individual || 0) - (insurancePlan.outOfPocketMax?.remaining || 0)) / (insurancePlan.outOfPocketMax?.individual || 1) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div>
                          <h4 className="font-medium">Family Out-of-Pocket Maximum</h4>
                          <p className="text-xs text-gray-500">Combined maximum for all family members</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${insurancePlan.outOfPocketMax?.remaining?.toFixed(2)} remaining</p>
                          <p className="text-xs text-gray-500">of ${insurancePlan.outOfPocketMax?.family?.toFixed(2)}</p>
                        </div>
                      </div>
                      <Progress 
                        value={((insurancePlan.outOfPocketMax?.family || 0) - (insurancePlan.outOfPocketMax?.remaining || 0)) / (insurancePlan.outOfPocketMax?.family || 1) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800">What This Means</h4>
                          <p className="text-sm text-green-700">Once you reach your out-of-pocket maximum, your insurance will pay 100% of covered services for the rest of the plan year.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="benefits" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Primary Care Visit</p>
                        <p className="text-2xl font-bold mt-1">$25 <span className="text-sm font-normal text-gray-500">copay</span></p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Specialist Visit</p>
                        <p className="text-2xl font-bold mt-1">$50 <span className="text-sm font-normal text-gray-500">copay</span></p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Urgent Care</p>
                        <p className="text-2xl font-bold mt-1">$75 <span className="text-sm font-normal text-gray-500">copay</span></p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Emergency Room</p>
                        <p className="text-2xl font-bold mt-1">$250 <span className="text-sm font-normal text-gray-500">copay</span></p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Generic Prescriptions</p>
                        <p className="text-2xl font-bold mt-1">$10 <span className="text-sm font-normal text-gray-500">copay</span></p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Brand Prescriptions</p>
                        <p className="text-2xl font-bold mt-1">$35 <span className="text-sm font-normal text-gray-500">copay</span></p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Benefits Summary
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <SquareUser className="mr-2 h-5 w-5" />
                Covered Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="/avatars/sarah.jpg" alt="Sarah Cooper" />
                      <AvatarFallback className="bg-[#006D77] text-white">SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{insurancePlan.primaryMember}</p>
                      <p className="text-xs text-gray-600">Primary Member</p>
                    </div>
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                </div>
                
                {insurancePlan.dependents?.map((dependent, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/avatars/john.jpg" alt={dependent} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">{dependent.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{dependent}</p>
                        <p className="text-xs text-gray-600">Dependent (Spouse)</p>
                      </div>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <PlusCircle size={16} className="mr-2" />
                  Add Dependent
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Claim Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Coverage Documents</p>
                      <p className="text-xs text-gray-600">Plan details and summary</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-3">
                      <Download size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Download Forms</p>
                      <p className="text-xs text-gray-600">Claim forms and documentation</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-3">
                      <Search size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Provider Directory</p>
                      <p className="text-xs text-gray-600">Find in-network providers</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-3">
                      <FileQuestion size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Common Questions</p>
                      <p className="text-xs text-gray-600">FAQ about your coverage</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Support Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Customer Service</p>
                  <p className="text-sm mt-1">{insurancePlan.customerServicePhone}</p>
                  <div className="flex items-center mt-2">
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      <Phone size={12} className="mr-1" />
                      Call
                    </Button>
                    <div className="text-xs text-gray-500 ml-2">
                      Mon-Fri: 8am-8pm EST
                      <br />
                      Sat: 9am-1pm EST
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Claims Department</p>
                  <p className="text-sm mt-1">1-800-555-2468</p>
                  <div className="flex items-center mt-2">
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      <Phone size={12} className="mr-1" />
                      Call
                    </Button>
                    <div className="text-xs text-gray-500 ml-2">
                      Mon-Fri: 8am-6pm EST
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg">
                  <p className="font-medium text-[#006D77]">WellSphere Support</p>
                  <p className="text-sm mt-1">Let us help navigate your insurance</p>
                  <Button className="w-full mt-2 bg-[#006D77] hover:bg-[#00585F]">
                    Get Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InsuranceInfo;