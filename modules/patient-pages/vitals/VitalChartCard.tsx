"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface VitalChartCardProps {
  title: string;
  icon: React.ReactNode;
  data: any;
  type: string;
  latestReading: {
    value: any;
    timestamp: Date;
  };
  statusInfo: {
    color: string;
    bgColor: string;
    status: string;
  };
  expanded?: boolean;
}

const VitalChartCard: React.FC<VitalChartCardProps> = ({
  title,
  icon,
  data,
  type,
  latestReading,
  statusInfo,
  expanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [timeRange, setTimeRange] = useState('7d');

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: Date) => {
    return format(timestamp, 'MMM d, h:mm a');
  };

  // Custom chart config based on vital type
  const getChartConfig = () => {
    switch (type) {
      case 'bloodPressure':
        return {
          lines: [
            { dataKey: 'systolic', stroke: '#ef4444', name: 'Systolic' },
            { dataKey: 'diastolic', stroke: '#3b82f6', name: 'Diastolic' }
          ],
          referenceLines: [
            { y: data.thresholds.warning.systolic, label: 'Systolic Warning', stroke: '#f59e0b' },
            { y: data.thresholds.critical.systolic, label: 'Systolic Critical', stroke: '#dc2626' },
            { y: data.thresholds.warning.diastolic, label: 'Diastolic Warning', stroke: '#f59e0b', strokeDasharray: '3 3' },
            { y: data.thresholds.critical.diastolic, label: 'Diastolic Critical', stroke: '#dc2626', strokeDasharray: '3 3' }
          ]
        };
      case 'heartRate':
        return {
          lines: [
            { dataKey: 'value', stroke: '#8b5cf6', name: 'Heart Rate' }
          ],
          referenceLines: [
            { y: data.thresholds.warning.max, label: 'High Warning', stroke: '#f59e0b' },
            { y: data.thresholds.critical.max, label: 'High Critical', stroke: '#dc2626' },
            { y: data.thresholds.warning.min, label: 'Low Warning', stroke: '#f59e0b' },
            { y: data.thresholds.critical.min, label: 'Low Critical', stroke: '#dc2626' }
          ]
        };
      case 'oxygenSaturation':
        return {
          lines: [
            { dataKey: 'value', stroke: '#3b82f6', name: 'SpO2' }
          ],
          referenceLines: [
            { y: data.thresholds.warning.min, label: 'Warning', stroke: '#f59e0b' },
            { y: data.thresholds.critical.min, label: 'Critical', stroke: '#dc2626' }
          ]
        };
      case 'temperature':
        return {
          lines: [
            { dataKey: 'value', stroke: '#f97316', name: 'Temperature' }
          ],
          referenceLines: [
            { y: data.thresholds.warning.max, label: 'High Warning', stroke: '#f59e0b' },
            { y: data.thresholds.critical.max, label: 'High Critical', stroke: '#dc2626' },
            { y: data.thresholds.warning.min, label: 'Low Warning', stroke: '#f59e0b' },
            { y: data.thresholds.critical.min, label: 'Low Critical', stroke: '#dc2626' }
          ]
        };
      case 'hydrationLevel':
        return {
          lines: [
            { dataKey: 'value', stroke: '#0ea5e9', name: 'Hydration' }
          ],
          referenceLines: [
            { y: data.thresholds.warning.min, label: 'Warning', stroke: '#f59e0b' },
            { y: data.thresholds.critical.min, label: 'Critical', stroke: '#dc2626' }
          ]
        };
      default:
        return {
          lines: [
            { dataKey: 'value', stroke: '#006D77', name: 'Value' }
          ],
          referenceLines: []
        };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex justify-between items-start">
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
            <div className="flex items-center mt-1">
              <div className="text-2xl font-bold mr-2">
                {latestReading.value} {data.unit}
              </div>
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-xs text-gray-500 flex items-center mb-3">
          <Clock size={14} className="mr-1" />
          Last updated: {formatTimestamp(latestReading.timestamp)}
        </div>

        {isExpanded && (
          <>
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.readings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  
                  {chartConfig.lines.map((line, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={line.dataKey}
                      stroke={line.stroke}
                      name={line.name}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                  
                  {chartConfig.referenceLines.map((line, index) => (
                    <ReferenceLine
                      key={index}
                      y={line.y}
                      stroke={line.stroke}
                      strokeDasharray={line.strokeDasharray || '3 3'}
                      label={{
                        position: 'insideBottomRight',
                        value: line.label,
                        fill: line.stroke,
                        fontSize: 10
                      }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={timeRange === '1d' ? 'bg-[#F0F9FA] text-[#006D77] border-[#006D77]' : ''}
                  onClick={() => setTimeRange('1d')}
                >
                  24h
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={timeRange === '7d' ? 'bg-[#F0F9FA] text-[#006D77] border-[#006D77]' : ''}
                  onClick={() => setTimeRange('7d')}
                >
                  7d
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={timeRange === '30d' ? 'bg-[#F0F9FA] text-[#006D77] border-[#006D77]' : ''}
                  onClick={() => setTimeRange('30d')}
                >
                  30d
                </Button>
              </div>
              <Button variant="outline" size="sm" className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalChartCard;
