"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  Share2, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  User, 
  Plus,
  X,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age: number;
  color: string;
  photo: string | null;
  // Other properties not needed for this component
  [key: string]: any;
}

interface SharedHealthRecordProps {
  familyMembers: FamilyMember[];
}

const SharedHealthRecord: React.FC<SharedHealthRecordProps> = ({ familyMembers }) => {
  const [activeSharing, setActiveSharing] = useState<'internal' | 'external'>('internal');
  
  // Shared records by category
  const sharedRecords = [
    { 
      category: 'Medical History', 
      status: 'shared', 
      members: familyMembers.map(m => m.id),
      lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    { 
      category: 'Conditions', 
      status: 'shared', 
      members: familyMembers.filter(m => m.id !== 4).map(m => m.id),
      lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    { 
      category: 'Allergies', 
      status: 'shared', 
      members: familyMembers.map(m => m.id),
      lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    { 
      category: 'Medications', 
      status: 'shared', 
      members: [1, 3],
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    { 
      category: 'Immunizations', 
      status: 'shared', 
      members: familyMembers.map(m => m.id),
      lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    },
    { 
      category: 'Test Results', 
      status: 'restricted', 
      members: [1],
      lastUpdated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ];
  
  // External providers with access
  const externalProviders = [
    {
      id: 1,
      name: 'Dr. Emily Chen',
      specialty: 'Primary Care',
      organization: 'Central Medical Center',
      accessLevel: 'full',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Dr. Michael Brown',
      specialty: 'Cardiology',
      organization: 'Heart Health Specialists',
      accessLevel: 'limited',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  ];
  
  // Format date for easier reading
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Get sharing status badge
  const getSharingStatusBadge = (status: string) => {
    switch (status) {
      case 'shared':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Shared</Badge>;
      case 'restricted':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Restricted</Badge>;
      case 'private':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Private</Badge>;
      default:
        return null;
    }
  };
  
  // Get access level badge
  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'full':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Full Access</Badge>;
      case 'limited':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Limited</Badge>;
      case 'emergency':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Emergency Only</Badge>;
      default:
        return null;
    }
  };
  
  // Get member avatars
  const getMemberAvatars = (memberIds: number[]) => {
    const relevantMembers = familyMembers.filter(member => memberIds.includes(member.id));
    
    return (
      <div className="flex -space-x-2">
        {relevantMembers.slice(0, 3).map(member => (
          <div 
            key={member.id}
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white"
            style={{ backgroundColor: member.color }}
            title={member.name}
          >
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              member.name.charAt(0)
            )}
          </div>
        ))}
        {relevantMembers.length > 3 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
            +{relevantMembers.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#006D77]">Shared Health Records</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeSharing === 'internal' ? 'default' : 'outline'} 
            className={activeSharing === 'internal' ? 'bg-[#006D77] hover:bg-[#005a66]' : ''}
            onClick={() => setActiveSharing('internal')}
          >
            Family Sharing
          </Button>
          <Button 
            variant={activeSharing === 'external' ? 'default' : 'outline'} 
            className={activeSharing === 'external' ? 'bg-[#006D77] hover:bg-[#005a66]' : ''}
            onClick={() => setActiveSharing('external')}
          >
            Provider Access
          </Button>
        </div>
      </div>

      {activeSharing === 'internal' ? (
        <>
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Share2 className="mr-2 h-5 w-5" />
                Family Health Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-lg border p-4 mb-4">
                <h3 className="font-medium mb-2">Sharing Overview</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Control what health information is shared with family members. Each member can have different levels of access.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F0F9FA] rounded-md border border-[#E8F3F4]">
                    <div className="font-medium mb-1">Records Shared</div>
                    <div className="text-2xl font-bold text-[#006D77]">5/6</div>
                    <Progress value={83} className="h-2 mt-2" />
                  </div>
                  <div className="p-3 bg-[#F0F9FA] rounded-md border border-[#E8F3F4]">
                    <div className="font-medium mb-1">Family Members</div>
                    <div className="text-2xl font-bold text-[#006D77]">{familyMembers.length}</div>
                    <div className="flex mt-2 -space-x-2">
                      {familyMembers.map(member => (
                        <div 
                          key={member.id}
                          className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.photo ? (
                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-[#F0F9FA] rounded-md border border-[#E8F3F4]">
                    <div className="font-medium mb-1">Last Updated</div>
                    <div className="text-lg font-medium text-[#006D77]">{formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      <Clock size={12} className="inline mr-1" />
                      7 days ago
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {sharedRecords.map((record, idx) => (
                  <div key={idx} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#006D77]" />
                        <span className="font-medium">{record.category}</span>
                      </div>
                      {getSharingStatusBadge(record.status)}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Shared with:</span>
                        {getMemberAvatars(record.members)}
                      </div>
                      <Button variant="outline" size="sm">Edit Access</Button>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Last updated {formatDate(record.lastUpdated)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button className="bg-[#006D77] hover:bg-[#005a66]">
                  Manage Sharing Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Lock className="mr-2 h-5 w-5" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {familyMembers.map(member => (
                  <div key={member.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: member.color }}>
                          {member.photo ? (
                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.relationship}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText size={16} className="mr-2 text-gray-500" />
                          <span className="text-sm">View Medical History</span>
                        </div>
                        <Switch defaultChecked={member.id !== 4} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield size={16} className="mr-2 text-gray-500" />
                          <span className="text-sm">View Allergies</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText size={16} className="mr-2 text-gray-500" />
                          <span className="text-sm">Test Results</span>
                        </div>
                        <Switch defaultChecked={member.id === 1 || member.id === 2} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield size={16} className="mr-2 text-gray-500" />
                          <span className="text-sm">Medications</span>
                        </div>
                        <Switch defaultChecked={member.id === 1 || member.id === 3} />
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Access Level:</span>
                        <Select defaultValue={member.id === 1 ? "owner" : member.id === 2 ? "full" : member.id === 3 ? "guardian" : "limited"}>
                          <SelectTrigger className="w-[180px] h-8 text-xs ml-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Account Owner</SelectItem>
                            <SelectItem value="full">Full Access</SelectItem>
                            <SelectItem value="guardian">Guardian Access</SelectItem>
                            <SelectItem value="limited">Limited Access</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-[#006D77]">
                        View Audit Log
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-[#E8F3F4]">
          <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
            <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
              <Shield className="mr-2 h-5 w-5" />
              Provider Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="rounded-lg border p-4 mb-4">
              <h3 className="font-medium mb-2">External Access Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Control which healthcare providers have access to your family's health records.
              </p>
              
              <div className="p-3 bg-blue-50 rounded-md border border-blue-100 flex items-start">
                <Shield className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Provider Access is Secure</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Providers are verified and all access is encrypted, logged, and can be revoked at any time.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {externalProviders.map(provider => (
                <div key={provider.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                        <User size={20} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-sm text-gray-500">{provider.specialty} • {provider.organization}</p>
                      </div>
                    </div>
                    {getAccessLevelBadge(provider.accessLevel)}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">
                        Expires: {formatDate(provider.expiresAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Shield size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">
                        Access: {provider.accessLevel === 'full' ? 'All records' : 'Selected records'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t flex justify-between">
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <X size={16} className="mr-1" />
                      Revoke Access
                    </Button>
                    <Button variant="outline" size="sm">
                      Modify Access
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full bg-[#006D77] hover:bg-[#005a66]">
                <Plus size={16} className="mr-2" />
                Grant Access to New Provider
              </Button>
            </div>
            
            <div className="mt-6 p-3 bg-amber-50 rounded-md border border-amber-100">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-700 font-medium">Emergency Access Protocol</p>
                  <p className="text-xs text-amber-600 mt-1">
                    In case of emergency, medical professionals can request temporary access to vital health information.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Configure Emergency Access
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SharedHealthRecord;
