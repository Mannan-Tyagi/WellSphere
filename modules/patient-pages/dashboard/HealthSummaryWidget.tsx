import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, HeartPulse, Activity, AlertTriangle } from 'lucide-react';

const HealthSummaryWidget = () => {
  // Mock health data
  const healthConditions = [
    {
      id: 1,
      name: 'Type 2 Diabetes',
      status: 'stable',
      lastReading: '118 mg/dL',
      target: '<120 mg/dL',
      progress: 85,
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      name: 'Hypertension',
      status: 'needs-attention',
      lastReading: '138/85 mmHg',
      target: '<130/80 mmHg',
      progress: 62,
      lastUpdated: '1 day ago',
      alert: 'Above target range'
    }
  ];
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'stable':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'needs-attention':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Helper function to get progress color
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  
  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <HeartPulse className="mr-2 h-5 w-5" />
          Health Summary
        </CardTitle>
        <Link href="/patient/health" className="text-sm text-[#006D77] hover:underline flex items-center">
          View Details <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {healthConditions.length > 0 ? (
          <div className="space-y-4">
            {healthConditions.map((condition) => (
              <div key={condition.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{condition.name}</h3>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="text-gray-500">Last Reading:</span>
                      <span className="font-medium">{condition.lastReading}</span>
                      <span className="text-gray-500">Target:</span>
                      <span className="font-medium">{condition.target}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(condition.status)}>
                    {condition.status === 'stable' ? 'Stable' : 
                     condition.status === 'needs-attention' ? 'Needs Attention' : 'Critical'}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Management Progress</span>
                    <span className="font-medium">{condition.progress}%</span>
                  </div>
                  <Progress value={condition.progress} className="h-2" indicatorClassName={getProgressColor(condition.progress)} />
                </div>
                
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Updated {condition.lastUpdated}</span>
                  {condition.alert && (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {condition.alert}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600 flex items-center">
                <Activity className="h-4 w-4 mr-1 text-[#006D77]" />
                Overall Health Status: Good
              </span>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200">
                70/100
              </Badge>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No health conditions to monitor</p>
            <Link href="/patient/health/add" className="text-sm text-[#006D77] hover:underline mt-2 inline-block">
              Add health condition to track
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthSummaryWidget;
