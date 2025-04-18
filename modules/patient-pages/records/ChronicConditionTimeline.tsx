"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp,
  Clock, 
  Activity, 
  Pill, 
  FileText,
  ZoomIn,
  Heart,
  Lungs,
  Brain,
  Thermometer
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Mock data - would come from API in real implementation
const mockConditions = [
  {
    id: 'cond1',
    name: 'Hypertension',
    diagnosedDate: '2018-05-10',
    status: 'controlled',
    icon: Heart,
    primaryColor: '#ef4444',
    secondaryColor: '#fee2e2',
    metrics: [
      { name: 'Blood Pressure', unit: 'mmHg', currentValue: '128/82', targetValue: '<120/80', status: 'elevated' },
    ],
    timeline: [
      { date: '2024-03-15', bp: '128/82', medication: 'Lisinopril 10mg' },
      { date: '2024-02-10', bp: '130/84', medication: 'Lisinopril 10mg' },
      { date: '2024-01-05', bp: '135/88', medication: 'Lisinopril 10mg' },
      { date: '2023-12-01', bp: '142/90', medication: 'Lisinopril 5mg' },
      { date: '2023-11-01', bp: '145/92', medication: 'Lisinopril 5mg' },
      { date: '2023-10-01', bp: '148/94', medication: 'None' },
      { date: '2023-09-01', bp: '150/95', medication: 'None' },
    ],
    medications: [
      { name: 'Lisinopril', dose: '10mg', startDate: '2023-12-15', status: 'active' },
    ],
    chartData: [
      { date: '2023-09', systolic: 150, diastolic: 95, target: 120 },
      { date: '2023-10', systolic: 148, diastolic: 94, target: 120 },
      { date: '2023-11', systolic: 145, diastolic: 92, target: 120 },
      { date: '2023-12', systolic: 142, diastolic: 90, target: 120 },
      { date: '2024-01', systolic: 135, diastolic: 88, target: 120 },
      { date: '2024-02', systolic: 130, diastolic: 84, target: 120 },
      { date: '2024-03', systolic: 128, diastolic: 82, target: 120 },
    ],
    recentEvents: [
      { date: '2024-03-15', type: 'checkup', description: 'BP well controlled on current medication' },
      { date: '2023-12-15', type: 'medication', description: 'Increased Lisinopril to 10mg daily' },
      { date: '2023-10-01', type: 'diagnosis', description: 'Diagnosed with hypertension, started on Lisinopril 5mg' },
    ]
  },
  {
    id: 'cond2',
    name: 'Asthma',
    diagnosedDate: '2015-08-22',
    status: 'controlled',
    icon: Lungs,
    primaryColor: '#3b82f6',
    secondaryColor: '#dbeafe',
    metrics: [
      { name: 'Peak Flow', unit: 'L/min', currentValue: '450', targetValue: '>400', status: 'normal' },
      { name: 'FEV1', unit: '%', currentValue: '85%', targetValue: '>80%', status: 'normal' },
    ],
    timeline: [
      { date: '2024-03-10', peakFlow: 450, medication: 'Albuterol (as needed)' },
      { date: '2024-01-15', peakFlow: 430, medication: 'Albuterol (as needed)' },
      { date: '2023-11-20', peakFlow: 380, medication: 'Albuterol (as needed)' },
      { date: '2023-09-05', peakFlow: 410, medication: 'Albuterol (as needed)' },
    ],
    medications: [
      { name: 'Albuterol Inhaler', dose: '2 puffs', startDate: '2015-08-22', status: 'active' },
    ],
    chartData: [
      { date: '2023-09', peakFlow: 410, target: 400 },
      { date: '2023-11', peakFlow: 380, target: 400 },
      { date: '2024-01', peakFlow: 430, target: 400 },
      { date: '2024-03', peakFlow: 450, target: 400 },
    ],
    recentEvents: [
      { date: '2024-03-10', type: 'checkup', description: 'Asthma well controlled, continue current management' },
      { date: '2023-11-20', type: 'exacerbation', description: 'Mild exacerbation due to seasonal allergies' },
    ]
  }
];

interface ChronicConditionTimelineProps {
  expanded?: boolean;
}

const ChronicConditionTimeline: React.FC<ChronicConditionTimelineProps> = ({ expanded = false }) => {
  const [activeTab, setActiveTab] = useState(mockConditions[0].id);
  const [showDetails, setShowDetails] = useState(expanded);
  const [timeRange, setTimeRange] = useState('6m');
  
  const activeCondition = mockConditions.find(c => c.id === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'elevated':
        return 'text-amber-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'controlled':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200">Controlled</Badge>;
      case 'uncontrolled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-200">Uncontrolled</Badge>;
      case 'improving':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200">Improving</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  // Helper function to get the icon for event types
  const getEventIcon = (type, size = 16) => {
    // Handle undefined type case
    if (!type) return <Activity size={size} />;
    
    switch (type) {
      case 'checkup':
        return <FileText size={size} />;
      case 'medication':
        return <Pill size={size} />;
      case 'diagnosis':
        return <Activity size={size} />;
      case 'exacerbation':
        return <AlertTriangle size={size} />;
      default:
        // Always return a valid component for unknown types
        return <Activity size={size} />;
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-auto space-x-2 bg-transparent p-0 mb-4">
          {mockConditions.map(condition => {
            // Make sure the ConditionIcon is defined
            const ConditionIcon = condition.icon;
            // Safety check - if icon is undefined, don't render this tab
            if (!ConditionIcon) return null;
            
            return (
              <TabsTrigger 
                key={condition.id} 
                value={condition.id}
                className="flex items-center gap-1 rounded-md border px-3 py-2"
                style={{ 
                  borderColor: activeTab === condition.id ? condition.primaryColor : '',
                  backgroundColor: activeTab === condition.id ? condition.secondaryColor : '',
                  color: activeTab === condition.id ? condition.primaryColor : ''
                }}
              >
                <ConditionIcon size={16} />
                <span>{condition.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {activeCondition && (
          <Card className="border-l-4" style={{ borderLeftColor: activeCondition.primaryColor }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{activeCondition.name}</h3>
                    {getStatusBadge(activeCondition.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Diagnosed {new Date(activeCondition.diagnosedDate).toLocaleDateString()}
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </Button>
              </div>
              
              {/* Current Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {activeCondition.metrics.map((metric, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-md border">
                    <div className="text-sm text-gray-500 mb-1">{metric.name}</div>
                    <div className="flex justify-between items-baseline">
                      <div className="text-lg font-semibold">{metric.currentValue}</div>
                      <div className={`text-sm ${getStatusColor(metric.status)}`}>
                        Target: {metric.targetValue}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-gray-50 p-3 rounded-md border">
                  <div className="text-sm text-gray-500 mb-1">Current Medication</div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {activeCondition.medications[0]?.name || 'None'} 
                      {activeCondition.medications[0]?.dose ? ` (${activeCondition.medications[0].dose})` : ''}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activeCondition.medications[0]?.status || 'none'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {showDetails && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Trend Over Time</h4>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={timeRange === '3m' ? 'bg-[#F0F9FA] text-[#006D77] border-[#006D77]' : ''}
                        onClick={() => setTimeRange('3m')}
                      >
                        3M
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={timeRange === '6m' ? 'bg-[#F0F9FA] text-[#006D77] border-[#006D77]' : ''}
                        onClick={() => setTimeRange('6m')}
                      >
                        6M
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={timeRange === '1y' ? 'bg-[#F0F9FA] text-[#006D77] border-[#006D77]' : ''}
                        onClick={() => setTimeRange('1y')}
                      >
                        1Y
                      </Button>
                    </div>
                  </div>
                  
                  <div className="h-72 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activeCondition.chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {activeCondition.id === 'cond1' ? (
                          <>
                            <Line 
                              type="monotone" 
                              dataKey="systolic" 
                              stroke={activeCondition.primaryColor} 
                              name="Systolic" 
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="diastolic" 
                              stroke="#6366f1" 
                              name="Diastolic" 
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#9ca3af" 
                              strokeDasharray="3 3" 
                              name="Target" 
                            />
                          </>
                        ) : (
                          <>
                            <Line 
                              type="monotone" 
                              dataKey="peakFlow" 
                              stroke={activeCondition.primaryColor} 
                              name="Peak Flow" 
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#9ca3af" 
                              strokeDasharray="3 3" 
                              name="Target" 
                            />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <h4 className="font-medium mb-3">Recent Events</h4>
                  <div className="space-y-3">
                    {activeCondition.recentEvents.map((event, i) => (
                      <div key={i} className="flex">
                        <div className="mr-3 relative">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center" 
                               style={{ backgroundColor: activeCondition.secondaryColor, color: activeCondition.primaryColor }}>
                            {/* Add safety check for event.type */}
                            {event && event.type ? getEventIcon(event.type) : <Activity size={16} />}
                          </div>
                          {i !== activeCondition.recentEvents.length - 1 && (
                            <div className="absolute left-1/2 top-8 bottom-0 w-0.5 -ml-px bg-gray-200 h-8"></div>
                          )}
                        </div>
                        <div className="pb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                            <span className="text-sm text-gray-500 capitalize">{event.type}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  );
};

export default ChronicConditionTimeline;
