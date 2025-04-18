"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Shield, Search, EyeOff, Calendar, Filter, AlertTriangle } from 'lucide-react';

// Mock data for record access logs
const mockAccessLogs = [
  {
    id: 'access-1',
    accessedBy: {
      name: 'Dr. Sarah Reynolds',
      role: 'Cardiologist',
      organization: 'City General Hospital'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    recordsAccessed: ['Blood Pressure Readings', 'EKG Results', 'Prescription History'],
    accessType: 'direct',
    accessMethod: 'QR Code',
    duration: '24 hours',
    status: 'active',
    qrDetails: {
      created: new Date(Date.now() - 1000 * 60 * 60 * 2),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 22), // Expires in 22 hours
      accessLevel: 'partial'
    }
  },
  {
    id: 'access-2',
    accessedBy: {
      name: 'Dr. Michael Johnson',
      role: 'Primary Care Physician',
      organization: 'Family Medical Center'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    recordsAccessed: ['Full Medical History', 'Lab Results', 'Imaging Studies'],
    accessType: 'direct',
    accessMethod: 'QR Code',
    duration: '7 days',
    status: 'expired',
    qrDetails: {
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // Expired 1 day ago
      accessLevel: 'full'
    }
  },
  {
    id: 'access-3',
    accessedBy: {
      name: 'Quest Diagnostics',
      role: 'Laboratory',
      organization: 'Quest Diagnostics, Inc.'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    recordsAccessed: ['Previous Lab Results'],
    accessType: 'automated',
    accessMethod: 'API',
    duration: 'Single Use',
    status: 'completed',
    qrDetails: null
  },
  {
    id: 'access-4',
    accessedBy: {
      name: 'Dr. Lisa Chen',
      role: 'Neurologist',
      organization: 'Neurology Associates'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    recordsAccessed: ['Brain MRI', 'Neurological Exam Notes', 'Medication History'],
    accessType: 'direct',
    accessMethod: 'QR Code',
    duration: '30 days',
    status: 'revoked',
    qrDetails: {
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16), // Would expire in 16 days
      accessLevel: 'partial',
      revokedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) // Revoked 10 days ago
    }
  }
];

const RecordsAccessLog = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter logs based on search, timeframe and status
  const filteredLogs = mockAccessLogs.filter(log => {
    // Filter by search query
    const searchMatches = 
      log.accessedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accessedBy.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accessedBy.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordsAccessed.some(record => record.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by timeframe
    let timeframeMatches = true;
    if (selectedTimeframe === 'today') {
      timeframeMatches = log.timestamp.toDateString() === new Date().toDateString();
    } else if (selectedTimeframe === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      timeframeMatches = log.timestamp >= weekAgo;
    } else if (selectedTimeframe === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      timeframeMatches = log.timestamp >= monthAgo;
    }
    
    // Filter by status
    const statusMatches = selectedStatus === 'all' || log.status === selectedStatus;
    
    return searchMatches && timeframeMatches && statusMatches;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by newest first

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      case 'revoked':
        return <Badge className="bg-red-100 text-red-800">Revoked</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor, organization, or records..."
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="overflow-hidden hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-[#F0F9FA] rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-[#006D77]" />
                    </div>
                    <div>
                      <h3 className="font-medium">{log.accessedBy.name}</h3>
                      <p className="text-sm text-gray-500">{log.accessedBy.role} • {log.accessedBy.organization}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(log.status)}
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                
                <div className="pl-12 space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Records Accessed:</div>
                    <div className="flex flex-wrap gap-1">
                      {log.recordsAccessed.map((record, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {record}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      Duration: {log.duration}
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1 text-gray-400" />
                      Access Method: {log.accessMethod}
                    </div>
                    
                    {log.status === 'active' && (
                      <Button size="sm" variant="destructive" className="ml-auto h-6 text-xs">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Revoke Access
                      </Button>
                    )}
                    
                    {log.status === 'revoked' && (
                      <div className="ml-auto flex items-center text-red-600 text-xs">
                        <AlertTriangle size={12} className="mr-1" />
                        Revoked on {log.qrDetails.revokedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Shield className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>No access logs found matching your criteria</p>
          <Button 
            variant="link" 
            className="mt-2 text-[#006D77]"
            onClick={() => {
              setSearchQuery('');
              setSelectedTimeframe('all');
              setSelectedStatus('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      
      <div className="bg-[#F0F9FA] p-3 rounded-md border border-[#E8F3F4] mt-2">
        <h4 className="text-sm font-medium flex items-center text-[#006D77]">
          <Shield className="h-4 w-4 mr-1" />
          Access Security Information
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          All record access is encrypted, logged, and monitored for security purposes. You can revoke access at any time.
          Active QR codes automatically expire after their set duration.
        </p>
      </div>
    </div>
  );
};

export default RecordsAccessLog;
