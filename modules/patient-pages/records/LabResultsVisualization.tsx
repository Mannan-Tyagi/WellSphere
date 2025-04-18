"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  AlertTriangle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileText, 
  Filter, 
  Info, 
  Share2
} from 'lucide-react';

// Mock data for lab results
const labCategories = [
  { id: 'bloodwork', name: 'Blood Work' },
  { id: 'lipids', name: 'Lipid Panel' },
  { id: 'metabolic', name: 'Metabolic Panel' },
  { id: 'urine', name: 'Urinalysis' }
];

const mockResults = {
  'bloodwork': [
    {
      id: 'lab1',
      name: 'Hemoglobin',
      value: 13.8,
      date: '2024-03-15',
      unit: 'g/dL',
      referenceRange: '13.5-17.5',
      status: 'normal',
      trend: 'stable',
      history: [
        { date: '2023-09-15', value: 13.7 },
        { date: '2023-12-15', value: 13.5 },
        { date: '2024-03-15', value: 13.8 },
      ]
    },
    {
      id: 'lab2',
      name: 'White Blood Cells',
      value: 9.8,
      date: '2024-03-15',
      unit: 'K/uL',
      referenceRange: '4.5-11.0',
      status: 'normal',
      trend: 'up',
      history: [
        { date: '2023-09-15', value: 7.5 },
        { date: '2023-12-15', value: 8.2 },
        { date: '2024-03-15', value: 9.8 },
      ]
    },
    {
      id: 'lab3',
      name: 'Platelets',
      value: 210,
      date: '2024-03-15',
      unit: 'K/uL',
      referenceRange: '150-450',
      status: 'normal',
      trend: 'stable',
      history: [
        { date: '2023-09-15', value: 205 },
        { date: '2023-12-15', value: 215 },
        { date: '2024-03-15', value: 210 },
      ]
    }
  ],
  'lipids': [
    {
      id: 'lipid1',
      name: 'Total Cholesterol',
      value: 210,
      date: '2024-03-15',
      unit: 'mg/dL',
      referenceRange: '<200',
      status: 'abnormal',
      trend: 'down',
      history: [
        { date: '2023-09-15', value: 225 },
        { date: '2023-12-15', value: 215 },
        { date: '2024-03-15', value: 210 },
      ]
    },
    {
      id: 'lipid2',
      name: 'LDL',
      value: 140,
      date: '2024-03-15',
      unit: 'mg/dL',
      referenceRange: '<130',
      status: 'abnormal',
      trend: 'down',
      history: [
        { date: '2023-09-15', value: 155 },
        { date: '2023-12-15', value: 145 },
        { date: '2024-03-15', value: 140 },
      ]
    },
    {
      id: 'lipid3',
      name: 'HDL',
      value: 48,
      date: '2024-03-15',
      unit: 'mg/dL',
      referenceRange: '>40',
      status: 'normal',
      trend: 'up',
      history: [
        { date: '2023-09-15', value: 42 },
        { date: '2023-12-15', value: 45 },
        { date: '2024-03-15', value: 48 },
      ]
    }
  ],
  'metabolic': [
    {
      id: 'met1',
      name: 'Glucose',
      value: 118,
      date: '2024-03-15',
      unit: 'mg/dL',
      referenceRange: '70-99',
      status: 'abnormal',
      trend: 'up',
      history: [
        { date: '2023-09-15', value: 105 },
        { date: '2023-12-15', value: 110 },
        { date: '2024-03-15', value: 118 },
      ]
    }
  ],
  'urine': []
};

const LabResultsVisualization = () => {
  const [activeCategory, setActiveCategory] = useState(labCategories[0].id);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('1y');
  
  const labResults = mockResults[activeCategory] || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight size={14} className="text-amber-500" />;
      case 'down':
        return <ArrowDownRight size={14} className="text-amber-500" />;
      default:
        return null;
    }
  };
  
  const parseRange = (range: string) => {
    // Extract numeric values from reference range (e.g., "13.5-17.5" or "<130" or ">40")
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(parseFloat);
      return { min, max };
    } else if (range.startsWith('<')) {
      return { max: parseFloat(range.substring(1)) };
    } else if (range.startsWith('>')) {
      return { min: parseFloat(range.substring(1)) };
    }
    return {};
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between text-[#006D77]">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Laboratory Results
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Filter size={14} className="mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Download size={14} className="mr-1" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            {labCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {labCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              {mockResults[category.id].length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No {category.name} results available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Time range:</span>
                      <div className="flex border rounded-md overflow-hidden">
                        <button 
                          onClick={() => setSelectedDateRange('6m')}
                          className={`px-2 py-1 text-xs ${selectedDateRange === '6m' ? 'bg-[#006D77] text-white' : 'bg-gray-100'}`}
                        >
                          6M
                        </button>
                        <button 
                          onClick={() => setSelectedDateRange('1y')}
                          className={`px-2 py-1 text-xs ${selectedDateRange === '1y' ? 'bg-[#006D77] text-white' : 'bg-gray-100'}`}
                        >
                          1Y
                        </button>
                        <button 
                          onClick={() => setSelectedDateRange('all')}
                          className={`px-2 py-1 text-xs ${selectedDateRange === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100'}`}
                        >
                          All
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockResults[category.id].map(test => (
                        <React.Fragment key={test.id}>
                          <TableRow className="group hover:bg-gray-50">
                            <TableCell className="font-medium">{test.name}</TableCell>
                            <TableCell className="flex items-center">
                              {test.value} {test.unit} {getTrendIcon(test.trend)}
                            </TableCell>
                            <TableCell>{test.referenceRange}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(test.status)}>
                                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                                className="text-gray-500"
                              >
                                {expandedTest === test.id ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded view with trend chart */}
                          {expandedTest === test.id && (
                            <TableRow>
                              <TableCell colSpan={5} className="bg-gray-50 p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">{test.name} Trends</h4>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" className="text-xs h-7">
                                        <Share2 size={14} className="mr-1" />
                                        Share
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-xs h-7">
                                        <Info size={14} className="mr-1" />
                                        Learn More
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="h-64 mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart
                                        data={test.history}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                      >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={['auto', 'auto']} />
                                        <Tooltip />
                                        <Line 
                                          type="monotone" 
                                          dataKey="value" 
                                          stroke="#006D77" 
                                          strokeWidth={2} 
                                          activeDot={{ r: 8 }} 
                                        />
                                        
                                        {/* Reference range lines */}
                                        {(() => {
                                          const range = parseRange(test.referenceRange);
                                          return (
                                            <>
                                              {range.min && (
                                                <ReferenceLine 
                                                  y={range.min} 
                                                  stroke="#94a3b8" 
                                                  strokeDasharray="3 3" 
                                                  label={{ 
                                                    value: `Min: ${range.min}`, 
                                                    position: 'insideBottomLeft',
                                                    fill: '#94a3b8',
                                                    fontSize: 12
                                                  }} 
                                                />
                                              )}
                                              {range.max && (
                                                <ReferenceLine 
                                                  y={range.max} 
                                                  stroke="#94a3b8" 
                                                  strokeDasharray="3 3" 
                                                  label={{ 
                                                    value: `Max: ${range.max}`, 
                                                    position: 'insideTopLeft',
                                                    fill: '#94a3b8',
                                                    fontSize: 12
                                                  }} 
                                                />
                                              )}
                                            </>
                                          );
                                        })()}
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                  
                                  {test.status === 'abnormal' && (
                                    <div className="bg-amber-50 p-3 rounded-md border border-amber-100 flex items-start">
                                      <AlertTriangle size={16} className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm text-amber-800 font-medium">Understanding this result:</p>
                                        <p className="text-sm text-amber-700">
                                          This result is outside the reference range. This could be due to various factors and doesn't 
                                          always indicate a serious condition. Discuss with your healthcare provider for proper interpretation.
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LabResultsVisualization;
