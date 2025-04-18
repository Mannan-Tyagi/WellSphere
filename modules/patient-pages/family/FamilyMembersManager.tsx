import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, ChevronLeft, Search, Filter, Plus, MoreHorizontal, 
  Edit, Trash2, Shield, Share2, Bell, Eye, EyeOff, HeartPulse, 
  Pill
} from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FamilyMembersManager = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock family members data with expanded details
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: 'John Cooper',
      relationship: 'Spouse',
      age: 45,
      avatar: '/avatars/john.png',
      permissionLevel: 'full',
      status: 'healthy',
      alerts: 0,
      dateAdded: '2024-02-15',
      metrics: {
        medications: 2,
        conditions: ['Hypertension'],
        lastVisit: '2024-03-01',
        upcomingAppointments: 1
      }
    },
    {
      id: 2,
      name: 'Emma Cooper',
      relationship: 'Daughter',
      age: 12,
      avatar: '/avatars/emma.png',
      permissionLevel: 'moderate',
      status: 'needs-attention',
      alerts: 1,
      dateAdded: '2024-01-10',
      metrics: {
        medications: 1,
        conditions: ['Asthma'],
        lastVisit: '2024-02-20',
        upcomingAppointments: 0
      }
    },
    {
      id: 3,
      name: 'Rose Wilson',
      relationship: 'Mother',
      age: 73,
      avatar: '/avatars/rose.png',
      permissionLevel: 'managed',
      status: 'stable',
      alerts: 2,
      dateAdded: '2023-12-05',
      metrics: {
        medications: 5,
        conditions: ['Arthritis', 'Hypertension', 'Type 2 Diabetes'],
        lastVisit: '2024-03-15',
        upcomingAppointments: 1
      }
    }
  ]);

  // Filter family members based on search and active tab
  const filteredMembers = familyMembers.filter(member => {
    // Search filter
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.relationship.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filter
    if (activeTab === 'caregiving') {
      return matchesSearch && member.permissionLevel === 'managed';
    } else if (activeTab === 'children') {
      return matchesSearch && member.age < 18;
    } else if (activeTab === 'adults') {
      return matchesSearch && member.age >= 18 && member.age < 65;
    } else if (activeTab === 'seniors') {
      return matchesSearch && member.age >= 65;
    }
    
    return matchesSearch; // 'all' tab
  });
  
  // Permission level badge color
  const getPermissionBadge = (level) => {
    switch(level) {
      case 'full':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Full Access</Badge>;
      case 'moderate': 
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Moderate Access</Badge>;
      case 'managed':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Managed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Limited</Badge>;
    }
  };

  // Status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>;
      case 'needs-attention':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Needs Attention</Badge>;
      case 'critical':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Critical</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Stable</Badge>;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-6">
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
        <h1 className="text-2xl font-bold text-[#006D77]">Family Health Management</h1>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-sm text-gray-600 mb-4">
            <p>
              Manage your family members' health information, coordinate medications, and set up 
              caregiving workflows. Privacy settings allow you to control what information is shared.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-grow max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search family members..."
                className="pl-9 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Link href="/patient/family/add">
              <Button className="bg-[#006D77] hover:bg-[#00585F]">
                <Plus size={16} className="mr-2" />
                Add Family Member
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="caregiving">Caregiving</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
              <TabsTrigger value="adults">Adults</TabsTrigger>
              <TabsTrigger value="seniors">Seniors</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="p-0 mt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Health Info</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                      <TableRow key={member.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                            {member.alerts > 0 && (
                              <Badge variant="outline" className="ml-2 h-5 px-1.5 bg-amber-50 text-amber-800 border-amber-200">
                                {member.alerts}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{member.relationship}</TableCell>
                        <TableCell>{member.age}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell>{getPermissionBadge(member.permissionLevel)}</TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center mb-1">
                              <Pill size={12} className="mr-1" />
                              <span>{member.metrics.medications} medications</span>
                            </div>
                            <div className="flex items-center">
                              <HeartPulse size={12} className="mr-1" />
                              <span>{member.metrics.conditions.length} conditions</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/patient/family/${member.id}`)}>
                                <Eye size={14} className="mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield size={14} className="mr-2" />
                                Manage Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bell size={14} className="mr-2" />
                                Configure Alerts
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit size={14} className="mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 size={14} className="mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        No family members found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FamilyMembersManager;
