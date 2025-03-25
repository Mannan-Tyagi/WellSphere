import React, { useState } from 'react';
import { Appointment } from '@/app/(route)/Doctor/Calendar/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, Calendar, Clock } from 'lucide-react';

interface WaitlistPanelProps {
  waitlist: Appointment[];
  onAddToSchedule: (appointment: Appointment) => void;
  onPatientSelect: (appointment: Appointment) => void;
}

const WaitlistPanel: React.FC<WaitlistPanelProps> = ({
  waitlist,
  onAddToSchedule,
  onPatientSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('priority');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Apply search, sort, and filter
  const filteredWaitlist = waitlist
    .filter(appt => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          appt.patient.name.toLowerCase().includes(query) ||
          appt.type.toLowerCase().includes(query) ||
          appt.notes?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(appt => {
      // Type filter
      if (filterType !== 'all') {
        return appt.type === filterType;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort
      switch (sortBy) {
        case 'priority':
          // Sort by priority: high > medium > low
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'low'] || 0) - (priorityOrder[a.priority || 'low'] || 0);
        case 'name':
          return a.patient.name.localeCompare(b.patient.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'waitTime':
          // Assume waitlist position roughly corresponds to wait time
          return (a.waitlistPosition || 0) - (b.waitlistPosition || 0);
        default:
          return 0;
      }
    });
  
  // Get the count of patients by priority
  const priorityCount = {
    high: waitlist.filter(appt => appt.priority === 'high').length,
    medium: waitlist.filter(appt => appt.priority === 'medium').length,
    low: waitlist.filter(appt => appt.priority === 'low').length
  };
  
  // Get unique appointment types in the waitlist
  const appointmentTypes = [...new Set(waitlist.map(appt => appt.type))];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total Waitlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlist.length}</div>
            <p className="text-xs text-muted-foreground">patients waiting</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">{priorityCount.high}</Badge>
              <Badge>{priorityCount.medium}</Badge>
              <Badge variant="outline">{priorityCount.low}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">high / medium / low</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Estimated Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~45 min</div>
            <p className="text-xs text-muted-foreground">for new patients</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="name">Patient Name</SelectItem>
                  <SelectItem value="type">Appointment Type</SelectItem>
                  <SelectItem value="waitTime">Wait Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredWaitlist.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWaitlist.map(appt => (
                  <TableRow key={appt.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onPatientSelect(appt)}>
                    <TableCell className="font-medium">{appt.patient.name}</TableCell>
                    <TableCell>{appt.type.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          appt.priority === 'high' ? 'destructive' : 
                          appt.priority === 'medium' ? 'default' : 'outline'
                        }
                      >
                        {appt.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{appt.waitlistPosition === 1 ? 'Next' : `~${appt.waitlistPosition! * 15} min`}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToSchedule(appt);
                        }}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <h3 className="text-lg font-medium">No patients found</h3>
              {searchQuery || filterType !== 'all' ? (
                <p className="mb-4">Try adjusting your search or filters</p>
              ) : (
                <p className="mb-4">The waitlist is currently empty</p>
              )}
              
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistPanel;